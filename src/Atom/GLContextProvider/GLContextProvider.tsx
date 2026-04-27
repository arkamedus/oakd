import React, {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import {
	GLContextProviderProps,
	GLRenderConfig,
	GLContextValue,
	GLRenderQuaternion,
	GLRenderRequest,
} from "./GLContextProvider.types";
import { Quat4 } from "../../Utils/Quat4";
import "./GLContextProvider.css";

const MATERIAL_SLOTS = 32;
const DEFAULT_SHADOW_MAP_SIZE = 1024;

const SHADOW_VERTEX_SHADER = `
attribute vec3 aPosition;
uniform mat4 uLightProjection;
uniform mat4 uLightView;
uniform mat4 uModel;

void main(void) {
	gl_Position = uLightProjection * uLightView * uModel * vec4(aPosition, 1.0);
}
`;

const SHADOW_FRAGMENT_SHADER = `
precision highp float;

vec4 encodeFloat(float depth) {
	const vec4 bitShift = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);
	const vec4 bitMask = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);
	vec4 comp = fract(depth * bitShift);
	comp -= comp.xxyz * bitMask;
	return comp;
}

void main(void) {
	gl_FragColor = encodeFloat(gl_FragCoord.z);
}
`;

const DEFAULT_VERTEX_SHADER = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec4 aColor;
attribute float aMaterial;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform mat4 uLightProjection;
uniform mat4 uLightView;
uniform vec3 uCameraPosition;

varying vec3 vNormal;
varying vec4 vColor;
varying float vMaterial;
varying vec4 vShadowCoord;
varying vec3 vViewDirection;

void main(void) {
	vec4 world = uModel * vec4(aPosition, 1.0);
	gl_Position = uProjection * uView * world;
	vShadowCoord = uLightProjection * uLightView * world;
	vNormal = mat3(uModel) * aNormal;
	vColor = aColor;
	vMaterial = aMaterial;
	vViewDirection = normalize(uCameraPosition - world.xyz);
}
`;

const DEFAULT_FRAGMENT_SHADER = `
precision highp float;

varying vec3 vNormal;
varying vec4 vColor;
varying float vMaterial;
varying vec4 vShadowCoord;
varying vec3 vViewDirection;

uniform sampler2D uShadowMap;
uniform vec3 uLightDirection;
uniform vec4 uMaterialPalette[32];
uniform vec4 uMaterialProperties[32];
uniform float uShadowTexelSize;

vec4 pickMaterial(float index) {
	vec4 color = uMaterialPalette[0];
	for (int i = 0; i < 32; i++) {
		if (abs(index - float(i)) < 0.5) {
			color = uMaterialPalette[i];
		}
	}
	return color;
}

vec4 pickMaterialProperties(float index) {
	vec4 properties = uMaterialProperties[0];
	for (int i = 0; i < 32; i++) {
		if (abs(index - float(i)) < 0.5) {
			properties = uMaterialProperties[i];
		}
	}
	return properties;
}

float decodeFloat(vec4 color) {
	const vec4 bitShift = vec4(
		1.0 / (256.0 * 256.0 * 256.0),
		1.0 / (256.0 * 256.0),
		1.0 / 256.0,
		1.0
	);
	return dot(color, bitShift);
}

float shadowFactor(vec3 normal, vec3 lightDir) {
	vec3 projected = (vShadowCoord.xyz / vShadowCoord.w) * 0.5 + 0.5;
	if (
		projected.x < 0.0 || projected.x > 1.0 ||
		projected.y < 0.0 || projected.y > 1.0 ||
		projected.z < 0.0 || projected.z > 1.0
	) {
		return 1.0;
	}

	float ndotl = max(dot(normal, lightDir), 0.0);
	float bias = 0.0002+(0.0001 * (1.0 - ndotl));
	float texel = uShadowTexelSize;
	float lit = 0.0;

	for (int x = -1; x <= 1; x++) {
		for (int y = -1; y <= 1; y++) {
			vec2 uv = projected.xy + vec2(float(x), float(y)) * texel;
			float depth = decodeFloat(texture2D(uShadowMap, uv));
			if (projected.z - bias <= depth) {
				lit += 1.0;
			}
		}
	}

	return lit / 9.0;
}

void main(void) {
	vec3 normal = normalize(vNormal);
	vec3 lightDir = normalize(uLightDirection);
	vec3 viewDir = normalize(vViewDirection);
	vec3 halfDir = normalize(lightDir + viewDir);

	float shadow = shadowFactor(normal, lightDir);
	float ambient = 0.24 + 0.18 * (0.5 + 0.5 * dot(normal, vec3(0.0, 0.0, 1.0)));
	float diffuse = max(dot(normal, lightDir), 0.0);
	float specularTerm = pow(max(dot(normal, halfDir), 0.0), 24.0);
	float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);

	vec4 materialTint = pickMaterial(vMaterial);
	vec4 materialInfo = pickMaterialProperties(vMaterial);
	float materialDiffuse = materialInfo.x;
	float materialSpecular = materialInfo.y;
	float materialReflection = materialInfo.z;
	float materialEmission = materialInfo.w;
	vec4 base = vColor * materialTint;

	float diffuseLight = (ambient + diffuse * materialDiffuse) * shadow;
	vec3 shaded =
		base.rgb * diffuseLight +
		vec3(specularTerm * materialSpecular * shadow * 0.35) +
		vec3(rim * materialReflection * 0.12) +
		base.rgb * (materialEmission * 0.28);
	shaded = clamp(shaded, 0.0, 1.0);
	gl_FragColor = vec4(shaded, base.a);
}
`;

interface MeshBuffers {
	position: WebGLBuffer;
	normal: WebGLBuffer;
	color: WebGLBuffer;
	material: WebGLBuffer;
	indices: WebGLBuffer;
	indexCount: number;
}

interface MainProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
		normal: number;
		color: number;
		material: number;
	};
	uniforms: {
		projection: WebGLUniformLocation | null;
		view: WebGLUniformLocation | null;
		model: WebGLUniformLocation | null;
		lightProjection: WebGLUniformLocation | null;
		lightView: WebGLUniformLocation | null;
		cameraPosition: WebGLUniformLocation | null;
		lightDirection: WebGLUniformLocation | null;
		shadowMap: WebGLUniformLocation | null;
		shadowTexelSize: WebGLUniformLocation | null;
		materialPalette: WebGLUniformLocation | null;
		materialProperties: WebGLUniformLocation | null;
	};
}

interface ShadowProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
	};
	uniforms: {
		lightProjection: WebGLUniformLocation | null;
		lightView: WebGLUniformLocation | null;
		model: WebGLUniformLocation | null;
	};
}

interface ShadowResources {
	framebuffer: WebGLFramebuffer;
	renderbuffer: WebGLRenderbuffer;
	texture: WebGLTexture;
	size: number;
}

interface CanvasRuntimeState {
	context2D: CanvasRenderingContext2D | null;
	layoutKey: string;
	pendingRequest: GLRenderRequest | null;
	dirty: boolean;
}

type Mat4 = Float32Array;

const SOURCE_MATERIAL_PROPERTIES: Array<[number, number, number, number]> = [
	[1.0, 0.2, 0.1, 0.0], // default
	[1.0, 0.0, 0.0, 1.0], // emission
	[0.5, 0.0, 0.0, 0.0], // matte
	[0.6, 1.0, 0.9, 0.01], // metallic
	[1.0, 0.0, 0.0, 0.01], // translucent
];

const identity = (): Mat4 => {
	const out = new Float32Array(16);
	out[0] = 1;
	out[5] = 1;
	out[10] = 1;
	out[15] = 1;
	return out;
};

const perspective = (
	fovy: number,
	aspect: number,
	near: number,
	far: number,
): Mat4 => {
	const f = 1.0 / Math.tan(fovy / 2);
	const out = new Float32Array(16);
	out[0] = f / aspect;
	out[5] = f;
	out[10] = (far + near) / (near - far);
	out[11] = -1;
	out[14] = (2 * far * near) / (near - far);
	return out;
};

const lookAt = (
	eye: [number, number, number],
	center: [number, number, number],
	up: [number, number, number],
): Mat4 => {
	const [ex, ey, ez] = eye;
	const [cx, cy, cz] = center;
	const [ux, uy, uz] = up;

	let zx = ex - cx;
	let zy = ey - cy;
	let zz = ez - cz;
	const zLength = Math.hypot(zx, zy, zz) || 1;
	zx /= zLength;
	zy /= zLength;
	zz /= zLength;

	let xx = uy * zz - uz * zy;
	let xy = uz * zx - ux * zz;
	let xz = ux * zy - uy * zx;
	const xLength = Math.hypot(xx, xy, xz) || 1;
	xx /= xLength;
	xy /= xLength;
	xz /= xLength;

	const yx = zy * xz - zz * xy;
	const yy = zz * xx - zx * xz;
	const yz = zx * xy - zy * xx;

	const out = identity();
	out[0] = xx;
	out[1] = yx;
	out[2] = zx;
	out[4] = xy;
	out[5] = yy;
	out[6] = zy;
	out[8] = xz;
	out[9] = yz;
	out[10] = zz;
	out[12] = -(xx * ex + xy * ey + xz * ez);
	out[13] = -(yx * ex + yy * ey + yz * ez);
	out[14] = -(zx * ex + zy * ey + zz * ez);
	return out;
};

const isQuaternion = (
	rotation: GLRenderRequest["rotation"] | undefined,
): rotation is GLRenderQuaternion =>
	!!rotation && typeof (rotation as GLRenderQuaternion).w === "number";

const rotationQuatFromRequest = (
	rotation: GLRenderRequest["rotation"] | undefined,
): Quat4 => {
	if (!rotation) return Quat4.identity();
	if (isQuaternion(rotation)) {
		return new Quat4().copy(rotation).normalize();
	}
	return Quat4.fromEulerRad(rotation.x, rotation.y, rotation.z);
};

const rotationMatrixFromQuat = (quat: Quat4): Mat4 => {
	const x = quat.x;
	const y = quat.y;
	const z = quat.z;
	const w = quat.w;
	const xx = x * x;
	const yy = y * y;
	const zz = z * z;
	const xy = x * y;
	const xz = x * z;
	const yz = y * z;
	const wx = w * x;
	const wy = w * y;
	const wz = w * z;

	const out = identity();
	out[0] = 1 - 2 * (yy + zz);
	out[1] = 2 * (xy + wz);
	out[2] = 2 * (xz - wy);
	out[4] = 2 * (xy - wz);
	out[5] = 1 - 2 * (xx + zz);
	out[6] = 2 * (yz + wx);
	out[8] = 2 * (xz + wy);
	out[9] = 2 * (yz - wx);
	out[10] = 1 - 2 * (xx + yy);
	return out;
};

const normalize3 = (
	value: [number, number, number],
): [number, number, number] => {
	const length = Math.hypot(value[0], value[1], value[2]) || 1;
	return [value[0] / length, value[1] / length, value[2] / length];
};

const resolvePixelRatio = (
	pixelRatio: GLRenderConfig["pixelRatio"],
): number => {
	if (pixelRatio === "default" || pixelRatio == null) {
		return window.devicePixelRatio || 1;
	}
	return Math.max(0.25, pixelRatio);
};

const createShader = (
	gl: WebGLRenderingContext,
	type: number,
	source: string,
): WebGLShader => {
	const shader = gl.createShader(type);
	if (!shader) throw new Error("Unable to create shader");
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const message =
			gl.getShaderInfoLog(shader) || "Unknown shader compile error";
		gl.deleteShader(shader);
		throw new Error(message);
	}
	return shader;
};

const createProgram = (
	gl: WebGLRenderingContext,
	vertexShader: string,
	fragmentShader: string,
): WebGLProgram => {
	const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
	const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
	const program = gl.createProgram();
	if (!program) {
		gl.deleteShader(vertex);
		gl.deleteShader(fragment);
		throw new Error("Unable to create program");
	}
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	gl.deleteShader(vertex);
	gl.deleteShader(fragment);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const message =
			gl.getProgramInfoLog(program) || "Unknown program link error";
		gl.deleteProgram(program);
		throw new Error(message);
	}
	return program;
};

const createShadowResources = (
	gl: WebGLRenderingContext,
	size: number,
): ShadowResources => {
	const framebuffer = gl.createFramebuffer();
	const texture = gl.createTexture();
	const renderbuffer = gl.createRenderbuffer();
	if (!framebuffer || !texture || !renderbuffer) {
		throw new Error("Unable to create shadow framebuffer resources");
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		size,
		size,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		null,
	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		texture,
		0,
	);

	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.DEPTH_ATTACHMENT,
		gl.RENDERBUFFER,
		renderbuffer,
	);

	const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (status !== gl.FRAMEBUFFER_COMPLETE) {
		throw new Error(`Shadow framebuffer incomplete: ${status}`);
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);

	return { framebuffer, texture, renderbuffer, size };
};

const uploadMesh = (
	gl: WebGLRenderingContext,
	mesh: GLRenderRequest["mesh"],
): MeshBuffers => {
	const position = gl.createBuffer();
	const normal = gl.createBuffer();
	const color = gl.createBuffer();
	const material = gl.createBuffer();
	const indices = gl.createBuffer();
	if (!position || !normal || !color || !material || !indices) {
		throw new Error("Unable to create WebGL buffers");
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, position);
	gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, normal);
	gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, color);
	gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, material);
	gl.bufferData(gl.ARRAY_BUFFER, mesh.materials, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

	return {
		position,
		normal,
		color,
		material,
		indices,
		indexCount: mesh.indices.length,
	};
};

const bindAttribute = (
	gl: WebGLRenderingContext,
	location: number,
	buffer: WebGLBuffer,
	size: number,
) => {
	if (location < 0) return;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.enableVertexAttribArray(location);
	gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
};

const defaultPalette = (): Float32Array => {
	const values = new Float32Array(MATERIAL_SLOTS * 4);
	for (let i = 0; i < MATERIAL_SLOTS; i++) {
		values[i * 4 + 0] = 1;
		values[i * 4 + 1] = 1;
		values[i * 4 + 2] = 1;
		values[i * 4 + 3] = 1;
	}
	return values;
};

const defaultMaterialProperties = (): Float32Array => {
	const values = new Float32Array(MATERIAL_SLOTS * 4);
	for (let i = 0; i < MATERIAL_SLOTS; i++) {
		const source =
			SOURCE_MATERIAL_PROPERTIES[i] || SOURCE_MATERIAL_PROPERTIES[0];
		values[i * 4 + 0] = source[0];
		values[i * 4 + 1] = source[1];
		values[i * 4 + 2] = source[2];
		values[i * 4 + 3] = source[3];
	}
	return values;
};

const DEFAULT_PALETTE_VALUES = defaultPalette();
const DEFAULT_MATERIAL_PROPERTIES = defaultMaterialProperties();

export const GLContext = createContext<GLContextValue>({
	isSupported: false,
	render: () => undefined,
	release: () => undefined,
});

const GLContextProvider: React.FC<GLContextProviderProps> = ({
	children,
	className,
	style,
	...rest
}) => {
	const sharedCanvasRef = useRef<HTMLCanvasElement | null>(
		typeof document === "undefined" ? null : document.createElement("canvas"),
	);
	const glRef = useRef<WebGLRenderingContext | null>(null);
	const mainProgramRef = useRef<MainProgram | null>(null);
	const shadowProgramRef = useRef<ShadowProgram | null>(null);
	const shadowResourcesRef = useRef<ShadowResources | null>(null);
	const meshCacheRef = useRef<WeakMap<GLRenderRequest["mesh"], MeshBuffers>>(
		new WeakMap(),
	);
	const canvasRuntimeMapRef = useRef<
		Map<HTMLCanvasElement, CanvasRuntimeState>
	>(new Map());
	const dirtyCanvasSetRef = useRef<Set<HTMLCanvasElement>>(new Set());
	const flushHandleRef = useRef<number | null>(null);

	if (!glRef.current && sharedCanvasRef.current) {
		try {
			glRef.current =
				sharedCanvasRef.current.getContext("webgl", {
					antialias: true,
					alpha: true,
				}) || null;
		} catch {
			glRef.current = null;
		}
		if (glRef.current) {
			glRef.current.enable(glRef.current.DEPTH_TEST);
		}
	}

	const ensurePrograms = useCallback((gl: WebGLRenderingContext) => {
		if (!shadowProgramRef.current) {
			const program = createProgram(
				gl,
				SHADOW_VERTEX_SHADER,
				SHADOW_FRAGMENT_SHADER,
			);
			shadowProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
				},
				uniforms: {
					lightProjection: gl.getUniformLocation(program, "uLightProjection"),
					lightView: gl.getUniformLocation(program, "uLightView"),
					model: gl.getUniformLocation(program, "uModel"),
				},
			};
		}

		if (!mainProgramRef.current) {
			const program = createProgram(
				gl,
				DEFAULT_VERTEX_SHADER,
				DEFAULT_FRAGMENT_SHADER,
			);
			mainProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
					normal: gl.getAttribLocation(program, "aNormal"),
					color: gl.getAttribLocation(program, "aColor"),
					material: gl.getAttribLocation(program, "aMaterial"),
				},
				uniforms: {
					projection: gl.getUniformLocation(program, "uProjection"),
					view: gl.getUniformLocation(program, "uView"),
					model: gl.getUniformLocation(program, "uModel"),
					lightProjection: gl.getUniformLocation(program, "uLightProjection"),
					lightView: gl.getUniformLocation(program, "uLightView"),
					cameraPosition: gl.getUniformLocation(program, "uCameraPosition"),
					lightDirection: gl.getUniformLocation(program, "uLightDirection"),
					shadowMap: gl.getUniformLocation(program, "uShadowMap"),
					shadowTexelSize: gl.getUniformLocation(program, "uShadowTexelSize"),
					materialPalette: gl.getUniformLocation(program, "uMaterialPalette"),
					materialProperties: gl.getUniformLocation(
						program,
						"uMaterialProperties",
					),
				},
			};
		}

		if (!shadowResourcesRef.current) {
			shadowResourcesRef.current = createShadowResources(
				gl,
				DEFAULT_SHADOW_MAP_SIZE,
			);
		}
	}, []);

	const drawShadowPass = useCallback(
		(
			gl: WebGLRenderingContext,
			program: ShadowProgram,
			shadow: ShadowResources,
			mesh: MeshBuffers,
			lightProjection: Mat4,
			lightView: Mat4,
			model: Mat4,
		) => {
			gl.useProgram(program.program);
			gl.bindFramebuffer(gl.FRAMEBUFFER, shadow.framebuffer);
			gl.viewport(0, 0, shadow.size, shadow.size);
			gl.clearColor(0, 0, 0, 0);
			gl.clearDepth(1);
			gl.enable(gl.DEPTH_TEST);
			gl.depthMask(true);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			if (program.uniforms.lightProjection) {
				gl.uniformMatrix4fv(
					program.uniforms.lightProjection,
					false,
					lightProjection,
				);
			}
			if (program.uniforms.lightView) {
				gl.uniformMatrix4fv(program.uniforms.lightView, false, lightView);
			}

			const draw = (buffers: MeshBuffers, modelMatrix: Mat4) => {
				if (program.uniforms.model) {
					gl.uniformMatrix4fv(program.uniforms.model, false, modelMatrix);
				}
				bindAttribute(gl, program.attributes.position, buffers.position, 3);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
				gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
			};

			draw(mesh, model);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		},
		[],
	);

	const drawRequest = useCallback(
		(request: GLRenderRequest, runtime: CanvasRuntimeState) => {
			const gl = glRef.current;
			const sharedCanvas = sharedCanvasRef.current;
			if (!gl || !sharedCanvas) return;

			ensurePrograms(gl);
			const mainProgram = mainProgramRef.current;
			const shadowProgram = shadowProgramRef.current;
			const shadowResources = shadowResourcesRef.current;
			if (!mainProgram || !shadowProgram || !shadowResources) return;

			const width = Math.max(1, Math.floor(request.width));
			const height = Math.max(1, Math.floor(request.height));
			const dpr = resolvePixelRatio(request.rendering?.pixelRatio);
			const scaledWidth = Math.max(1, Math.floor(width * dpr));
			const scaledHeight = Math.max(1, Math.floor(height * dpr));
			if (
				sharedCanvas.width !== scaledWidth ||
				sharedCanvas.height !== scaledHeight
			) {
				sharedCanvas.width = scaledWidth;
				sharedCanvas.height = scaledHeight;
			}

			let mesh = meshCacheRef.current.get(request.mesh);
			if (!mesh) {
				mesh = uploadMesh(gl, request.mesh);
				meshCacheRef.current.set(request.mesh, mesh);
			}

			const requestedShadowSize = Math.max(
				128,
				Math.floor(request.rendering?.shadowMapSize ?? DEFAULT_SHADOW_MAP_SIZE),
			);
			if (shadowResources.size !== requestedShadowSize) {
				gl.deleteFramebuffer(shadowResources.framebuffer);
				gl.deleteTexture(shadowResources.texture);
				gl.deleteRenderbuffer(shadowResources.renderbuffer);
				shadowResourcesRef.current = createShadowResources(
					gl,
					requestedShadowSize,
				);
			}
			const activeShadowResources = shadowResourcesRef.current;
			if (!activeShadowResources) return;

			const projection = perspective(
				request.camera?.fov ?? Math.PI / 4,
				scaledWidth / scaledHeight,
				0.1,
				100,
			);
			const distance = request.cameraDistance ?? 3;
			const orbit = request.cameraOrbit ?? 0;
			const cameraPosition: [number, number, number] = request.camera?.from ?? [
				Math.cos(orbit) * distance,
				Math.sin(orbit) * distance,
				distance * 0.9,
			];
			const cameraTarget: [number, number, number] = request.camera?.to ?? [
				0, 0, 0,
			];
			const cameraUp: [number, number, number] = request.camera?.up ?? [
				0, 0, 1,
			];
			const view = lookAt(cameraPosition, cameraTarget, cameraUp);
			const rotation = rotationQuatFromRequest(request.rotation);
			const model = rotationMatrixFromQuat(rotation);

			const lightDirection = normalize3(
				request.rendering?.lightDirection ?? [0.35, 0.55, 1],
			);
			const lightDistance = 28;
			const lightPosition: [number, number, number] = [
				lightDirection[0] * lightDistance,
				lightDirection[1] * lightDistance,
				lightDirection[2] * lightDistance,
			];
			const lightProjection = perspective(Math.PI / 3, 1, 1, 120);
			const lightView = lookAt(lightPosition, cameraTarget, [0, 0, 1]);

			drawShadowPass(
				gl,
				shadowProgram,
				activeShadowResources,
				mesh,
				lightProjection,
				lightView,
				model,
			);

			gl.useProgram(mainProgram.program);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.viewport(0, 0, scaledWidth, scaledHeight);
			const clear = request.rendering?.clearColor || [0.05, 0.05, 0.08, 1];
			gl.clearColor(clear[0], clear[1], clear[2], clear[3]);
			gl.clearDepth(1);
			gl.enable(gl.DEPTH_TEST);
			gl.depthMask(true);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			if (mainProgram.uniforms.projection) {
				gl.uniformMatrix4fv(mainProgram.uniforms.projection, false, projection);
			}
			if (mainProgram.uniforms.view) {
				gl.uniformMatrix4fv(mainProgram.uniforms.view, false, view);
			}
			if (mainProgram.uniforms.lightProjection) {
				gl.uniformMatrix4fv(
					mainProgram.uniforms.lightProjection,
					false,
					lightProjection,
				);
			}
			if (mainProgram.uniforms.lightView) {
				gl.uniformMatrix4fv(mainProgram.uniforms.lightView, false, lightView);
			}
			if (mainProgram.uniforms.cameraPosition) {
				gl.uniform3f(
					mainProgram.uniforms.cameraPosition,
					cameraPosition[0],
					cameraPosition[1],
					cameraPosition[2],
				);
			}
			if (mainProgram.uniforms.lightDirection) {
				gl.uniform3f(
					mainProgram.uniforms.lightDirection,
					lightDirection[0],
					lightDirection[1],
					lightDirection[2],
				);
			}

			if (mainProgram.uniforms.materialPalette) {
				gl.uniform4fv(
					mainProgram.uniforms.materialPalette,
					DEFAULT_PALETTE_VALUES,
				);
			}

			if (mainProgram.uniforms.materialProperties) {
				gl.uniform4fv(
					mainProgram.uniforms.materialProperties,
					DEFAULT_MATERIAL_PROPERTIES,
				);
			}

			if (mainProgram.uniforms.shadowMap) {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, activeShadowResources.texture);
				gl.uniform1i(mainProgram.uniforms.shadowMap, 0);
			}
			if (mainProgram.uniforms.shadowTexelSize) {
				gl.uniform1f(
					mainProgram.uniforms.shadowTexelSize,
					1 / activeShadowResources.size,
				);
			}

			const drawMain = (buffers: MeshBuffers, modelMatrix: Mat4) => {
				if (mainProgram.uniforms.model) {
					gl.uniformMatrix4fv(mainProgram.uniforms.model, false, modelMatrix);
				}
				bindAttribute(gl, mainProgram.attributes.position, buffers.position, 3);
				bindAttribute(gl, mainProgram.attributes.normal, buffers.normal, 3);
				bindAttribute(gl, mainProgram.attributes.color, buffers.color, 4);
				bindAttribute(gl, mainProgram.attributes.material, buffers.material, 1);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
				gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
			};

			drawMain(mesh, model);

			const target = request.targetCanvas;
			const sizeKey = `${scaledWidth}x${scaledHeight}::${width}x${height}`;
			if (runtime.layoutKey !== sizeKey) {
				target.width = scaledWidth;
				target.height = scaledHeight;
				target.style.width = `${width}px`;
				target.style.height = `${height}px`;
				runtime.layoutKey = sizeKey;
			}
			const context2D = runtime.context2D ?? target.getContext("2d");
			if (!context2D) return;
			runtime.context2D = context2D;
			context2D.clearRect(0, 0, scaledWidth, scaledHeight);
			context2D.drawImage(sharedCanvas, 0, 0, scaledWidth, scaledHeight);
		},
		[drawShadowPass, ensurePrograms],
	);

	const flushQueuedRenders = useCallback(() => {
		flushHandleRef.current = null;
		const dirtyCanvases = Array.from(dirtyCanvasSetRef.current);
		dirtyCanvasSetRef.current.clear();

		dirtyCanvases.forEach((targetCanvas) => {
			const runtime = canvasRuntimeMapRef.current.get(targetCanvas);
			if (!runtime || !runtime.dirty || !runtime.pendingRequest) return;
			const request = runtime.pendingRequest;
			runtime.pendingRequest = null;
			runtime.dirty = false;
			drawRequest(request, runtime);
		});
	}, [drawRequest]);

	const scheduleQueuedRender = useCallback(() => {
		if (flushHandleRef.current !== null || typeof window === "undefined")
			return;
		flushHandleRef.current = window.requestAnimationFrame(flushQueuedRenders);
	}, [flushQueuedRenders]);

	const render = useCallback(
		(request: GLRenderRequest) => {
			const target = request.targetCanvas;
			let runtime = canvasRuntimeMapRef.current.get(target);
			if (!runtime) {
				runtime = {
					context2D: null,
					layoutKey: "",
					pendingRequest: null,
					dirty: false,
				};
				canvasRuntimeMapRef.current.set(target, runtime);
			}

			runtime.pendingRequest = request;
			runtime.dirty = true;
			dirtyCanvasSetRef.current.add(target);
			scheduleQueuedRender();
		},
		[scheduleQueuedRender],
	);

	const release = useCallback((targetCanvas: HTMLCanvasElement) => {
		dirtyCanvasSetRef.current.delete(targetCanvas);
		canvasRuntimeMapRef.current.delete(targetCanvas);
	}, []);

	useEffect(
		() => () => {
			if (flushHandleRef.current !== null && typeof window !== "undefined") {
				window.cancelAnimationFrame(flushHandleRef.current);
			}
			flushHandleRef.current = null;
			dirtyCanvasSetRef.current.clear();
			canvasRuntimeMapRef.current.clear();
		},
		[],
	);

	const value = useMemo<GLContextValue>(
		() => ({
			isSupported: !!glRef.current,
			render,
			release,
		}),
		[release, render],
	);

	return (
		<div
			{...rest}
			className={["oakd", "gl-context-provider", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<GLContext.Provider value={value}>{children}</GLContext.Provider>
		</div>
	);
};

export {
	DEFAULT_FRAGMENT_SHADER as glDefaultFragmentShader,
	DEFAULT_VERTEX_SHADER as glDefaultVertexShader,
};

export default GLContextProvider;
