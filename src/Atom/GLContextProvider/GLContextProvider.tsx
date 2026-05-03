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
const DEFAULT_SHADOW_BIAS = 0.0002;
const DEFAULT_SHADOW_NORMAL_BIAS = 0.00012;
const DEFAULT_SHADOW_SOFTNESS = 1.5;
const DEFAULT_SHADOW_SAMPLES = 9;
const DEFAULT_SHADOW_ORTHO_SIZE = 8;
const DEFAULT_SHADOW_NEAR = 1;
const DEFAULT_SHADOW_FAR = 120;
const DEFAULT_CAMERA_NEAR = 0.1;
const DEFAULT_CAMERA_FAR = 100;

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
uniform float uShadowsEnabled;
uniform int uShadowMode;
uniform float uShadowBias;
uniform float uShadowNormalBias;
uniform float uShadowSoftness;
uniform float uShadowOrthoSize;
uniform int uShadowSamples;
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;
uniform vec3 uRimColor;
uniform float uRimIntensity;
uniform float uRimPower;
uniform float uEmissionStrength;
uniform float uSsaoEnabled;
uniform float uSsaoRadius;
uniform float uSsaoIntensity;
uniform float uSsaoBias;
uniform int uSsaoSamples;
uniform float uBloomEnabled;
uniform float uBloomThreshold;
uniform float uBloomIntensity;
uniform float uBloomRadius;
uniform int uRenderLayer;

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

float hash12(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

float shadowFactor(vec3 normal, vec3 lightDir) {
	if (uShadowsEnabled < 0.5) {
		return 1.0;
	}
	vec3 projected = (vShadowCoord.xyz / vShadowCoord.w) * 0.5 + 0.5;
	if (
		projected.x < 0.0 || projected.x > 1.0 ||
		projected.y < 0.0 || projected.y > 1.0 ||
		projected.z < 0.0 || projected.z > 1.0
	) {
		return 1.0;
	}

	float ndotl = max(dot(normal, lightDir), 0.0);
	float bias = uShadowBias + uShadowNormalBias * (1.0 - ndotl);
	float texel = uShadowTexelSize;
	if (uShadowMode == 0 || uShadowSamples <= 1) {
		float depth = decodeFloat(texture2D(uShadowMap, projected.xy));
		return projected.z - bias <= depth ? 1.0 : 0.0;
	}

	float lit = 0.0;
	float count = 0.0;
	float shadowMapSize = max(1.0, 1.0 / max(texel, 1e-6));
	float normalizedShadowMapScale =
		shadowMapSize / float(${DEFAULT_SHADOW_MAP_SIZE.toFixed(1)});
	float orthoSize = max(1e-4, uShadowOrthoSize);
	float normalizedShadowOrthoScale =
		float(${DEFAULT_SHADOW_ORTHO_SIZE.toFixed(1)}) / orthoSize;
	float radius =
		max(1.0, uShadowSoftness) *
		normalizedShadowMapScale *
		normalizedShadowOrthoScale;
	float sampleLimit = clamp(float(uShadowSamples), 1.0, 25.0);

	vec2 poissonDisk[25];
	poissonDisk[0] = vec2(-0.613392, 0.617481);
	poissonDisk[1] = vec2(0.170019, -0.040254);
	poissonDisk[2] = vec2(-0.299417, 0.791925);
	poissonDisk[3] = vec2(0.645680, 0.493210);
	poissonDisk[4] = vec2(-0.651784, 0.717887);
	poissonDisk[5] = vec2(0.421003, 0.027070);
	poissonDisk[6] = vec2(-0.817194, -0.271096);
	poissonDisk[7] = vec2(-0.705374, -0.668203);
	poissonDisk[8] = vec2(0.977050, -0.108615);
	poissonDisk[9] = vec2(0.063326, 0.142369);
	poissonDisk[10] = vec2(0.203528, 0.214331);
	poissonDisk[11] = vec2(-0.667531, 0.326090);
	poissonDisk[12] = vec2(-0.098422, -0.295755);
	poissonDisk[13] = vec2(-0.885922, 0.215369);
	poissonDisk[14] = vec2(0.566637, 0.605213);
	poissonDisk[15] = vec2(0.039766, -0.396100);
	poissonDisk[16] = vec2(0.751946, 0.453352);
	poissonDisk[17] = vec2(0.078707, -0.715323);
	poissonDisk[18] = vec2(-0.075838, -0.529344);
	poissonDisk[19] = vec2(0.724479, -0.580798);
	poissonDisk[20] = vec2(0.222999, -0.215125);
	poissonDisk[21] = vec2(-0.467574, -0.405438);
	poissonDisk[22] = vec2(-0.248268, -0.814753);
	poissonDisk[23] = vec2(0.354411, -0.887570);
	poissonDisk[24] = vec2(0.175817, 0.382366);

	float angle = hash12(projected.xy * 8192.0 + projected.zy * 37.0) * 6.2831853;
	float jitter = mix(0.85, 1.15, hash12(projected.yx * 4096.0 + projected.xz * 19.0));
	float cs = cos(angle);
	float sn = sin(angle);
	mat2 rotation = mat2(cs, -sn, sn, cs);

	for (int i = 0; i < 25; i++) {
		if (count >= sampleLimit) {
			continue;
		}

		vec2 poissonOffset = rotation * poissonDisk[i] * jitter;
		vec3 sampleShadowPos = projected;
		sampleShadowPos.xy += poissonOffset * texel * radius;

		if (
			sampleShadowPos.x < 0.0 || sampleShadowPos.x > 1.0 ||
			sampleShadowPos.y < 0.0 || sampleShadowPos.y > 1.0
		) {
			lit += 1.0;
			count += 1.0;
			continue;
		}

		float depth = decodeFloat(texture2D(uShadowMap, sampleShadowPos.xy));
		if (sampleShadowPos.z - bias <= depth) {
			lit += 1.0;
		}
		count += 1.0;
	}

	return lit / max(1.0, count);
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
	float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), max(0.001, uRimPower));

	vec4 materialTint = pickMaterial(vMaterial);
	vec4 materialInfo = pickMaterialProperties(vMaterial);
	float materialDiffuse = materialInfo.x;
	float materialSpecular = materialInfo.y;
	float materialReflection = materialInfo.z;
	float materialEmission = materialInfo.w;
	vec4 base = vColor * materialTint;

	float ambientTermFactor = (ambient * uAmbientIntensity);
	vec3 ambientTerm = base.rgb * ambientTermFactor * uAmbientColor;
	vec3 diffuseTerm = base.rgb * diffuse * materialDiffuse;
	vec3 diffuseShadowed = diffuseTerm * shadow;
	vec3 specularColored = vec3(specularTerm * materialSpecular * shadow * 0.35);
	vec3 rimTerm = uRimColor * (rim * materialReflection * uRimIntensity);
	vec3 emissionTerm = base.rgb * (materialEmission * uEmissionStrength);
	vec3 lit = ambientTerm + diffuseShadowed + specularColored + rimTerm + emissionTerm;

	float depth01 = clamp(gl_FragCoord.z, 0.0, 1.0);
	float curvature = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
	float aoWeight = (curvature + uSsaoBias + depth01 * 0.35) * uSsaoRadius;
	float ssaoSampleWeight = clamp(float(uSsaoSamples), 1.0, 64.0) / 16.0;
	float ao = clamp(
		1.0 - aoWeight * uSsaoIntensity * ssaoSampleWeight,
		0.0,
		1.0
	);

	float brightness = max(max(lit.r, lit.g), lit.b);
	float bloomMask = smoothstep(uBloomThreshold, 1.0, brightness);
	vec3 bloomTerm = lit * bloomMask * uBloomIntensity * (0.15 + 0.1 * uBloomRadius);

	// Main pass outputs base lighting only; post passes handle SSAO/Bloom composition.
	vec3 finalColor = clamp(lit, 0.0, 1.0);

	vec3 debugColor = finalColor;
	if (uRenderLayer == 1) {
		debugColor = clamp(base.rgb * materialDiffuse, 0.0, 1.0);
	} else if (uRenderLayer == 2) {
		debugColor = clamp(vec3(specularTerm * materialSpecular), 0.0, 1.0);
	} else if (uRenderLayer == 3) {
		debugColor = clamp(vec3(ambient + diffuse * shadow), 0.0, 1.0);
	} else if (uRenderLayer == 9) {
		debugColor = clamp(emissionTerm, 0.0, 1.0);
	} else if (uRenderLayer == 4) {
		debugColor = vec3(ao);
	} else if (uRenderLayer == 5) {
		debugColor = clamp(bloomTerm, 0.0, 1.0);
	} else if (uRenderLayer == 6) {
		debugColor = vec3(depth01);
	} else if (uRenderLayer == 7) {
		debugColor = normal * 0.5 + 0.5;
	} else if (uRenderLayer == 8) {
		debugColor = vec3(shadow);
	}
	gl_FragColor = vec4(debugColor, base.a);
}
`;

const NORMAL_VERTEX_SHADER = `
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

varying vec3 vNormal;

void main(void) {
	vec4 world = uModel * vec4(aPosition, 1.0);
	gl_Position = uProjection * uView * world;
	vNormal = normalize(mat3(uView * uModel) * aNormal);
}
`;

const NORMAL_FRAGMENT_SHADER = `
precision highp float;
varying vec3 vNormal;

void main(void) {
	vec3 normal = normalize(vNormal) * 0.5 + 0.5;
	gl_FragColor = vec4(normal, 1.0);
}
`;

const DEPTH_VERTEX_SHADER = `
attribute vec3 aPosition;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

void main(void) {
	vec4 world = uModel * vec4(aPosition, 1.0);
	gl_Position = uProjection * uView * world;
}
`;

const DEPTH_FRAGMENT_SHADER = `
precision highp float;

vec4 encodeFloat(float depth) {
	const vec4 bitShift = vec4(
		256.0 * 256.0 * 256.0,
		256.0 * 256.0,
		256.0,
		1.0
	);
	const vec4 bitMask = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);
	vec4 comp = fract(depth * bitShift);
	comp -= comp.xxyz * bitMask;
	return comp;
}

void main(void) {
	gl_FragColor = encodeFloat(clamp(gl_FragCoord.z, 0.0, 1.0));
}
`;

const POST_VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUV;

void main(void) {
	vUV = aPosition * 0.5 + 0.5;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const SSAO_FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUV;

uniform sampler2D uGBuffer;
uniform sampler2D uDepth;
uniform vec2 uTexel;
uniform mat4 uProjection;
uniform mat4 uInvProjection;
uniform float uRadius;
uniform float uIntensity;
uniform float uBias;
uniform float uSamples;

float hash12(vec2 p){
	vec3 p3 = fract(vec3(p.xyx) * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
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

vec3 reconstructViewPos(vec2 uv, float depth01) {
	float z = depth01 * 2.0 - 1.0;
	vec4 clip = vec4(uv * 2.0 - 1.0, z, 1.0);
	vec4 view = uInvProjection * clip;
	return view.xyz / max(view.w, 1e-6);
}

vec2 projectToUV(vec3 viewPos) {
	vec4 clip = uProjection * vec4(viewPos, 1.0);
	vec3 ndc = clip.xyz / max(clip.w, 1e-6);
	return ndc.xy * 0.5 + 0.5;
}

void main(void) {
	vec4 center = texture2D(uGBuffer, vUV);
	float centerDepth = decodeFloat(texture2D(uDepth, vUV));
	if (centerDepth >= 0.9999) {
		gl_FragColor = vec4(1.0);
		return;
	}
	vec3 normal = normalize(center.rgb * 2.0 - 1.0);
	vec3 centerPos = reconstructViewPos(vUV, centerDepth);
	float sampleCount = clamp(uSamples, 4.0, 32.0);
	float radius = max(0.0001, uRadius);
	float occ = 0.0;
	float seed = hash12(vUV * vec2(237.2, 91.7)) * 6.2831853;
	vec3 rand = normalize(vec3(cos(seed), sin(seed), 0.33));
	vec3 tangent = normalize(rand - normal * dot(rand, normal));
	vec3 bitangent = cross(normal, tangent);

	for (int i = 0; i < 32; i++) {
		if (float(i) >= sampleCount) {
			continue;
		}
		float fi = float(i);
		float angle = fi * 2.39996323 + seed;
		float ring = (fi + 1.0) / sampleCount;
		float radial = mix(0.1, 1.0, ring * ring);
		vec3 hemi = normalize(
			tangent * cos(angle) * radial +
			bitangent * sin(angle) * radial +
			normal * (1.0 - 0.45 * radial)
		);
		vec3 samplePos = centerPos + hemi * radius;
		vec2 sampleUV = projectToUV(samplePos);
		if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) {
			continue;
		}
		vec4 tap = texture2D(uGBuffer, sampleUV);
		float tapDepth = decodeFloat(texture2D(uDepth, sampleUV));
		if (tapDepth >= 0.9999) {
			continue;
		}
		vec3 sampleView = reconstructViewPos(sampleUV, tapDepth);
		vec3 tapNormal = normalize(tap.rgb * 2.0 - 1.0);
		float normalAgreement = max(dot(normal, tapNormal), 0.0);
		float dz = abs(centerPos.z - sampleView.z);
		float thickness = max(1e-4, radius * 2.0);
		if (dz > thickness) {
			continue;
		}
		float sampleDelta = sampleView.z - samplePos.z;
		float closerThanSample = smoothstep(uBias, uBias + radius * 0.25, sampleDelta);
		float range = 1.0 - smoothstep(0.0, thickness, dz);
		float nd = max(dot(normal, normalize(sampleView - centerPos)), 0.0);
		occ += closerThanSample * range * nd * mix(0.6, 1.0, normalAgreement);
	}

	float occNorm = occ / sampleCount;
	float ao = clamp(1.0 - occNorm, 0.0, 1.0);
	ao = pow(ao, 1.35);
	gl_FragColor = vec4(vec3(ao), 1.0);
}
`;

const BLOOM_EXTRACT_FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUV;

uniform sampler2D uScene;
uniform float uThreshold;

void main(void) {
	vec3 color = texture2D(uScene, vUV).rgb;
	float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
	float mask = smoothstep(uThreshold, 1.0, luma);
	gl_FragColor = vec4(color * mask, 1.0);
}
`;

const BLOOM_BLUR_FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUV;

uniform sampler2D uBloom;
uniform vec2 uTexel;
uniform vec2 uDirection;
uniform float uRadius;

void main(void) {
	vec2 d = uDirection * uTexel * max(0.5, uRadius);
	vec3 c = vec3(0.0);
	c += texture2D(uBloom, vUV - d * 4.0).rgb * 0.016216;
	c += texture2D(uBloom, vUV - d * 3.0).rgb * 0.054054;
	c += texture2D(uBloom, vUV - d * 2.0).rgb * 0.121621;
	c += texture2D(uBloom, vUV - d * 1.0).rgb * 0.194594;
	c += texture2D(uBloom, vUV).rgb * 0.227027;
	c += texture2D(uBloom, vUV + d * 1.0).rgb * 0.194594;
	c += texture2D(uBloom, vUV + d * 2.0).rgb * 0.121621;
	c += texture2D(uBloom, vUV + d * 3.0).rgb * 0.054054;
	c += texture2D(uBloom, vUV + d * 4.0).rgb * 0.016216;
	gl_FragColor = vec4(c, 1.0);
}
`;

const COMPOSE_FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUV;

uniform sampler2D uScene;
uniform sampler2D uGBuffer;
uniform sampler2D uDepth;
uniform sampler2D uSsao;
uniform sampler2D uBloom;
uniform float uSsaoEnabled;
uniform float uSsaoIntensity;
uniform float uBloomEnabled;
uniform float uBloomIntensity;
uniform int uRenderLayer;

float decodeFloat(vec4 color) {
	const vec4 bitShift = vec4(
		1.0 / (256.0 * 256.0 * 256.0),
		1.0 / (256.0 * 256.0),
		1.0 / 256.0,
		1.0
	);
	return dot(color, bitShift);
}

void main(void) {
	vec3 scene = texture2D(uScene, vUV).rgb;
	vec4 gbuffer = texture2D(uGBuffer, vUV);
	float depthRaw = decodeFloat(texture2D(uDepth, vUV));
	float ao = texture2D(uSsao, vUV).r;
	vec3 bloom = texture2D(uBloom, vUV).rgb * uBloomIntensity;

	if (uRenderLayer == 4) {
		if (uSsaoEnabled < 0.5) {
			gl_FragColor = vec4(vec3(0.0), 1.0);
		} else {
			gl_FragColor = vec4(vec3(ao), 1.0);
		}
		return;
	}
	if (uRenderLayer == 5) {
		if (uBloomEnabled < 0.5) {
			gl_FragColor = vec4(vec3(0.0), 1.0);
		} else {
			gl_FragColor = vec4(bloom, 1.0);
		}
		return;
	}
	if (uRenderLayer == 6) {
		float shadedDepth = pow(clamp(1.0 - depthRaw, 0.0, 1.0), 0.45);
		shadedDepth = clamp(1.0 - shadedDepth, 0.0, 1.0);
		gl_FragColor = vec4(vec3(shadedDepth), 1.0);
		return;
	}
	if (uRenderLayer == 7) {
		gl_FragColor = vec4(gbuffer.rgb, 1.0);
		return;
	}

	vec3 outColor = scene;
	if (uBloomEnabled > 0.5) {
		outColor += bloom;
	}
	if (uSsaoEnabled > 0.5) {
		float aoMix = clamp(uSsaoIntensity, 0.0, 1.0);
		outColor *= mix(1.0, ao, aoMix);
	}
	gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
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
		shadowsEnabled: WebGLUniformLocation | null;
		shadowMode: WebGLUniformLocation | null;
		shadowBias: WebGLUniformLocation | null;
		shadowNormalBias: WebGLUniformLocation | null;
		shadowSoftness: WebGLUniformLocation | null;
		shadowOrthoSize: WebGLUniformLocation | null;
		shadowSamples: WebGLUniformLocation | null;
		ambientColor: WebGLUniformLocation | null;
		ambientIntensity: WebGLUniformLocation | null;
		rimColor: WebGLUniformLocation | null;
		rimIntensity: WebGLUniformLocation | null;
		rimPower: WebGLUniformLocation | null;
		emissionStrength: WebGLUniformLocation | null;
		ssaoEnabled: WebGLUniformLocation | null;
		ssaoRadius: WebGLUniformLocation | null;
		ssaoIntensity: WebGLUniformLocation | null;
		ssaoBias: WebGLUniformLocation | null;
		ssaoSamples: WebGLUniformLocation | null;
		bloomEnabled: WebGLUniformLocation | null;
		bloomThreshold: WebGLUniformLocation | null;
		bloomIntensity: WebGLUniformLocation | null;
		bloomRadius: WebGLUniformLocation | null;
		renderLayer: WebGLUniformLocation | null;
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

interface ColorTarget {
	framebuffer: WebGLFramebuffer;
	renderbuffer: WebGLRenderbuffer;
	texture: WebGLTexture;
	width: number;
	height: number;
	filter: number;
}

interface NormalProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
		normal: number;
	};
	uniforms: {
		projection: WebGLUniformLocation | null;
		view: WebGLUniformLocation | null;
		model: WebGLUniformLocation | null;
	};
}

interface DepthProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
	};
	uniforms: {
		projection: WebGLUniformLocation | null;
		view: WebGLUniformLocation | null;
		model: WebGLUniformLocation | null;
	};
}

interface SSAOProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
	};
	uniforms: {
		normalTexture: WebGLUniformLocation | null;
		depthTexture: WebGLUniformLocation | null;
		texel: WebGLUniformLocation | null;
		projection: WebGLUniformLocation | null;
		inverseProjection: WebGLUniformLocation | null;
		radius: WebGLUniformLocation | null;
		intensity: WebGLUniformLocation | null;
		bias: WebGLUniformLocation | null;
		samples: WebGLUniformLocation | null;
	};
}

interface BloomExtractProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
	};
	uniforms: {
		scene: WebGLUniformLocation | null;
		threshold: WebGLUniformLocation | null;
	};
}

interface BloomBlurProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
	};
	uniforms: {
		bloom: WebGLUniformLocation | null;
		texel: WebGLUniformLocation | null;
		direction: WebGLUniformLocation | null;
		radius: WebGLUniformLocation | null;
	};
}

interface ComposeProgram {
	program: WebGLProgram;
	attributes: {
		position: number;
	};
	uniforms: {
		scene: WebGLUniformLocation | null;
		normalTexture: WebGLUniformLocation | null;
		depthTexture: WebGLUniformLocation | null;
		ssao: WebGLUniformLocation | null;
		bloom: WebGLUniformLocation | null;
		ssaoEnabled: WebGLUniformLocation | null;
		ssaoIntensity: WebGLUniformLocation | null;
		bloomEnabled: WebGLUniformLocation | null;
		bloomIntensity: WebGLUniformLocation | null;
		renderLayer: WebGLUniformLocation | null;
	};
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

const ortho = (
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number,
): Mat4 => {
	const out = new Float32Array(16);
	out[0] = 2 / (right - left);
	out[5] = 2 / (top - bottom);
	out[10] = -2 / (far - near);
	out[12] = -(right + left) / (right - left);
	out[13] = -(top + bottom) / (top - bottom);
	out[14] = -(far + near) / (far - near);
	out[15] = 1;
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

const invertMat4 = (matrix: Mat4): Mat4 => {
	const out = new Float32Array(16);
	const a00 = matrix[0];
	const a01 = matrix[1];
	const a02 = matrix[2];
	const a03 = matrix[3];
	const a10 = matrix[4];
	const a11 = matrix[5];
	const a12 = matrix[6];
	const a13 = matrix[7];
	const a20 = matrix[8];
	const a21 = matrix[9];
	const a22 = matrix[10];
	const a23 = matrix[11];
	const a30 = matrix[12];
	const a31 = matrix[13];
	const a32 = matrix[14];
	const a33 = matrix[15];

	const b00 = a00 * a11 - a01 * a10;
	const b01 = a00 * a12 - a02 * a10;
	const b02 = a00 * a13 - a03 * a10;
	const b03 = a01 * a12 - a02 * a11;
	const b04 = a01 * a13 - a03 * a11;
	const b05 = a02 * a13 - a03 * a12;
	const b06 = a20 * a31 - a21 * a30;
	const b07 = a20 * a32 - a22 * a30;
	const b08 = a20 * a33 - a23 * a30;
	const b09 = a21 * a32 - a22 * a31;
	const b10 = a21 * a33 - a23 * a31;
	const b11 = a22 * a33 - a23 * a32;

	const determinant =
		b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	if (Math.abs(determinant) < 1e-8) {
		return identity();
	}
	const invDet = 1 / determinant;

	out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
	out[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
	out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
	out[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
	out[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
	out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
	out[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
	out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
	out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
	out[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
	out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
	out[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
	out[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
	out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
	out[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
	out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
	return out;
};

const normalize3 = (
	value: [number, number, number],
): [number, number, number] => {
	const length = Math.hypot(value[0], value[1], value[2]) || 1;
	return [value[0] / length, value[1] / length, value[2] / length];
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const resolveRenderLayer = (layer: GLRenderConfig["renderLayer"]): number => {
	switch (layer) {
		case "diffuse":
			return 1;
		case "specular":
			return 2;
		case "lighting":
			return 3;
		case "emission":
			return 9;
		case "ssao":
			return 4;
		case "bloom":
			return 5;
		case "depth":
			return 6;
		case "normals":
			return 7;
		case "shadow":
			return 8;
		case "final":
		default:
			return 0;
	}
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

const createColorTarget = (
	gl: WebGLRenderingContext,
	width: number,
	height: number,
	filter: number = gl.LINEAR,
): ColorTarget => {
	const framebuffer = gl.createFramebuffer();
	const texture = gl.createTexture();
	const renderbuffer = gl.createRenderbuffer();
	if (!framebuffer || !texture || !renderbuffer) {
		throw new Error("Unable to create post-processing resources");
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		width,
		height,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		null,
	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
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
	if (
		typeof WebGL2RenderingContext !== "undefined" &&
		gl instanceof WebGL2RenderingContext
	) {
		gl.renderbufferStorage(
			gl.RENDERBUFFER,
			gl.DEPTH_COMPONENT24,
			width,
			height,
		);
	} else {
		gl.renderbufferStorage(
			gl.RENDERBUFFER,
			gl.DEPTH_COMPONENT16,
			width,
			height,
		);
	}
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.DEPTH_ATTACHMENT,
		gl.RENDERBUFFER,
		renderbuffer,
	);

	const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (status !== gl.FRAMEBUFFER_COMPLETE) {
		throw new Error(`Post framebuffer incomplete: ${status}`);
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	return { framebuffer, texture, renderbuffer, width, height, filter };
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
	const normalProgramRef = useRef<NormalProgram | null>(null);
	const depthProgramRef = useRef<DepthProgram | null>(null);
	const ssaoProgramRef = useRef<SSAOProgram | null>(null);
	const bloomExtractProgramRef = useRef<BloomExtractProgram | null>(null);
	const bloomBlurProgramRef = useRef<BloomBlurProgram | null>(null);
	const composeProgramRef = useRef<ComposeProgram | null>(null);
	const shadowResourcesRef = useRef<ShadowResources | null>(null);
	const sceneTargetRef = useRef<ColorTarget | null>(null);
	const normalTargetRef = useRef<ColorTarget | null>(null);
	const depthTargetRef = useRef<ColorTarget | null>(null);
	const ssaoTargetRef = useRef<ColorTarget | null>(null);
	const bloomARef = useRef<ColorTarget | null>(null);
	const bloomBRef = useRef<ColorTarget | null>(null);
	const bloomCRef = useRef<ColorTarget | null>(null);
	const fullscreenQuadRef = useRef<WebGLBuffer | null>(null);
	const meshCacheRef = useRef<WeakMap<GLRenderRequest["mesh"], MeshBuffers>>(
		new WeakMap(),
	);
	const canvasRuntimeMapRef = useRef<
		Map<HTMLCanvasElement, CanvasRuntimeState>
	>(new Map());
	const dirtyCanvasSetRef = useRef<Set<HTMLCanvasElement>>(new Set());
	const flushHandleRef = useRef<number | null>(null);

	if (!glRef.current && sharedCanvasRef.current) {
		const contextAttributes: WebGLContextAttributes = {
			antialias: true,
			alpha: true,
			depth: true,
			stencil: false,
			premultipliedAlpha: true,
			preserveDrawingBuffer: false,
		};
		try {
			const webgl2 = sharedCanvasRef.current.getContext(
				"webgl2",
				contextAttributes,
			) as WebGL2RenderingContext | null;
			glRef.current =
				(webgl2 as unknown as WebGLRenderingContext | null) ||
				(sharedCanvasRef.current.getContext(
					"webgl",
					contextAttributes,
				) as WebGLRenderingContext | null);
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
					shadowsEnabled: gl.getUniformLocation(program, "uShadowsEnabled"),
					shadowMode: gl.getUniformLocation(program, "uShadowMode"),
					shadowBias: gl.getUniformLocation(program, "uShadowBias"),
					shadowNormalBias: gl.getUniformLocation(program, "uShadowNormalBias"),
					shadowSoftness: gl.getUniformLocation(program, "uShadowSoftness"),
					shadowOrthoSize: gl.getUniformLocation(program, "uShadowOrthoSize"),
					shadowSamples: gl.getUniformLocation(program, "uShadowSamples"),
					ambientColor: gl.getUniformLocation(program, "uAmbientColor"),
					ambientIntensity: gl.getUniformLocation(program, "uAmbientIntensity"),
					rimColor: gl.getUniformLocation(program, "uRimColor"),
					rimIntensity: gl.getUniformLocation(program, "uRimIntensity"),
					rimPower: gl.getUniformLocation(program, "uRimPower"),
					emissionStrength: gl.getUniformLocation(program, "uEmissionStrength"),
					ssaoEnabled: gl.getUniformLocation(program, "uSsaoEnabled"),
					ssaoRadius: gl.getUniformLocation(program, "uSsaoRadius"),
					ssaoIntensity: gl.getUniformLocation(program, "uSsaoIntensity"),
					ssaoBias: gl.getUniformLocation(program, "uSsaoBias"),
					ssaoSamples: gl.getUniformLocation(program, "uSsaoSamples"),
					bloomEnabled: gl.getUniformLocation(program, "uBloomEnabled"),
					bloomThreshold: gl.getUniformLocation(program, "uBloomThreshold"),
					bloomIntensity: gl.getUniformLocation(program, "uBloomIntensity"),
					bloomRadius: gl.getUniformLocation(program, "uBloomRadius"),
					renderLayer: gl.getUniformLocation(program, "uRenderLayer"),
					materialPalette: gl.getUniformLocation(program, "uMaterialPalette"),
					materialProperties: gl.getUniformLocation(
						program,
						"uMaterialProperties",
					),
				},
			};
		}

		if (!normalProgramRef.current) {
			const program = createProgram(
				gl,
				NORMAL_VERTEX_SHADER,
				NORMAL_FRAGMENT_SHADER,
			);
			normalProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
					normal: gl.getAttribLocation(program, "aNormal"),
				},
				uniforms: {
					projection: gl.getUniformLocation(program, "uProjection"),
					view: gl.getUniformLocation(program, "uView"),
					model: gl.getUniformLocation(program, "uModel"),
				},
			};
		}

		if (!depthProgramRef.current) {
			const program = createProgram(
				gl,
				DEPTH_VERTEX_SHADER,
				DEPTH_FRAGMENT_SHADER,
			);
			depthProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
				},
				uniforms: {
					projection: gl.getUniformLocation(program, "uProjection"),
					view: gl.getUniformLocation(program, "uView"),
					model: gl.getUniformLocation(program, "uModel"),
				},
			};
		}

		if (!ssaoProgramRef.current) {
			const program = createProgram(
				gl,
				POST_VERTEX_SHADER,
				SSAO_FRAGMENT_SHADER,
			);
			ssaoProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
				},
				uniforms: {
					normalTexture: gl.getUniformLocation(program, "uGBuffer"),
					depthTexture: gl.getUniformLocation(program, "uDepth"),
					texel: gl.getUniformLocation(program, "uTexel"),
					projection: gl.getUniformLocation(program, "uProjection"),
					inverseProjection: gl.getUniformLocation(program, "uInvProjection"),
					radius: gl.getUniformLocation(program, "uRadius"),
					intensity: gl.getUniformLocation(program, "uIntensity"),
					bias: gl.getUniformLocation(program, "uBias"),
					samples: gl.getUniformLocation(program, "uSamples"),
				},
			};
		}

		if (!bloomExtractProgramRef.current) {
			const program = createProgram(
				gl,
				POST_VERTEX_SHADER,
				BLOOM_EXTRACT_FRAGMENT_SHADER,
			);
			bloomExtractProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
				},
				uniforms: {
					scene: gl.getUniformLocation(program, "uScene"),
					threshold: gl.getUniformLocation(program, "uThreshold"),
				},
			};
		}

		if (!bloomBlurProgramRef.current) {
			const program = createProgram(
				gl,
				POST_VERTEX_SHADER,
				BLOOM_BLUR_FRAGMENT_SHADER,
			);
			bloomBlurProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
				},
				uniforms: {
					bloom: gl.getUniformLocation(program, "uBloom"),
					texel: gl.getUniformLocation(program, "uTexel"),
					direction: gl.getUniformLocation(program, "uDirection"),
					radius: gl.getUniformLocation(program, "uRadius"),
				},
			};
		}

		if (!composeProgramRef.current) {
			const program = createProgram(
				gl,
				POST_VERTEX_SHADER,
				COMPOSE_FRAGMENT_SHADER,
			);
			composeProgramRef.current = {
				program,
				attributes: {
					position: gl.getAttribLocation(program, "aPosition"),
				},
				uniforms: {
					scene: gl.getUniformLocation(program, "uScene"),
					normalTexture: gl.getUniformLocation(program, "uGBuffer"),
					depthTexture: gl.getUniformLocation(program, "uDepth"),
					ssao: gl.getUniformLocation(program, "uSsao"),
					bloom: gl.getUniformLocation(program, "uBloom"),
					ssaoEnabled: gl.getUniformLocation(program, "uSsaoEnabled"),
					ssaoIntensity: gl.getUniformLocation(program, "uSsaoIntensity"),
					bloomEnabled: gl.getUniformLocation(program, "uBloomEnabled"),
					bloomIntensity: gl.getUniformLocation(program, "uBloomIntensity"),
					renderLayer: gl.getUniformLocation(program, "uRenderLayer"),
				},
			};
		}

		if (!shadowResourcesRef.current) {
			shadowResourcesRef.current = createShadowResources(
				gl,
				DEFAULT_SHADOW_MAP_SIZE,
			);
		}

		if (!fullscreenQuadRef.current) {
			const buffer = gl.createBuffer();
			if (!buffer) throw new Error("Unable to create fullscreen quad buffer");
			fullscreenQuadRef.current = buffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
				gl.STATIC_DRAW,
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

	const ensureColorTarget = useCallback(
		(
			gl: WebGLRenderingContext,
			targetRef: React.MutableRefObject<ColorTarget | null>,
			width: number,
			height: number,
			filter: number = gl.LINEAR,
		): ColorTarget => {
			const existing = targetRef.current;
			if (
				existing &&
				existing.width === width &&
				existing.height === height &&
				existing.filter === filter
			) {
				return existing;
			}
			if (existing) {
				gl.deleteFramebuffer(existing.framebuffer);
				gl.deleteTexture(existing.texture);
				gl.deleteRenderbuffer(existing.renderbuffer);
			}
			const created = createColorTarget(gl, width, height, filter);
			targetRef.current = created;
			return created;
		},
		[],
	);

	const drawFullscreen = useCallback(
		(
			gl: WebGLRenderingContext,
			program: WebGLProgram,
			positionLocation: number,
		) => {
			const quad = fullscreenQuadRef.current;
			if (!quad || positionLocation < 0) return;
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, quad);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
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
			const normalProgram = normalProgramRef.current;
			const depthProgram = depthProgramRef.current;
			const ssaoProgram = ssaoProgramRef.current;
			const bloomExtractProgram = bloomExtractProgramRef.current;
			const bloomBlurProgram = bloomBlurProgramRef.current;
			const composeProgram = composeProgramRef.current;
			const shadowResources = shadowResourcesRef.current;
			if (
				!mainProgram ||
				!shadowProgram ||
				!normalProgram ||
				!depthProgram ||
				!ssaoProgram ||
				!bloomExtractProgram ||
				!bloomBlurProgram ||
				!composeProgram ||
				!shadowResources
			)
				return;

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

			const rendering = request.rendering;
			const shadowsEnabled = rendering?.shadowsEnabled ?? true;
			const shadowMode = rendering?.shadowMode ?? "soft";
			const shadowBias = rendering?.shadowBias ?? DEFAULT_SHADOW_BIAS;
			const shadowNormalBias =
				rendering?.shadowNormalBias ?? DEFAULT_SHADOW_NORMAL_BIAS;
			const shadowSoftness =
				rendering?.shadowSoftness ?? DEFAULT_SHADOW_SOFTNESS;
			const shadowSamples = Math.max(
				1,
				Math.floor(rendering?.shadowSamples ?? DEFAULT_SHADOW_SAMPLES),
			);
			const shadowOrthoSize =
				rendering?.shadowOrthoSize ?? DEFAULT_SHADOW_ORTHO_SIZE;
			const shadowNear = Math.max(
				0.01,
				rendering?.shadowNear ?? DEFAULT_SHADOW_NEAR,
			);
			const shadowFar = Math.max(
				shadowNear + 0.01,
				rendering?.shadowFar ?? DEFAULT_SHADOW_FAR,
			);
			const renderLayer = resolveRenderLayer(rendering?.renderLayer);
			const ssaoEnabled = rendering?.ssaoEnabled ?? false;
			const ssaoRadius = rendering?.ssaoRadius ?? 0.35;
			const ssaoIntensity = rendering?.ssaoIntensity ?? 1.0;
			const ssaoBias = rendering?.ssaoBias ?? 0.002;
			const ssaoSamples = Math.max(1, Math.floor(rendering?.ssaoSamples ?? 16));
			const bloomEnabled = rendering?.bloomEnabled ?? false;
			const bloomThreshold = clamp01(rendering?.bloomThreshold ?? 0.7);
			const bloomIntensity = Math.max(0, rendering?.bloomIntensity ?? 0.3);
			const bloomRadius = Math.max(0, rendering?.bloomRadius ?? 3.0);
			const ambientColor = rendering?.ambientColor ?? [0.92, 0.97, 1.0];
			const ambientIntensity = Math.max(0, rendering?.ambientIntensity ?? 0.34);
			const rimColor = rendering?.rimColor ?? [1.0, 0.96, 0.9];
			const rimIntensity = Math.max(0, rendering?.rimIntensity ?? 0.18);
			const rimPower = Math.max(0.1, rendering?.rimPower ?? 2.1);
			const emissionStrength = Math.max(0, rendering?.emissionStrength ?? 0.24);
			const isFinalLayer = renderLayer === 0;
			const isSsaoLayer = renderLayer === 4;
			const isBloomLayer = renderLayer === 5;
			const activeSsao = ssaoEnabled && (isFinalLayer || isSsaoLayer);
			const activeBloom = bloomEnabled && (isFinalLayer || isBloomLayer);
			const needsGBuffer = activeSsao || renderLayer === 6 || renderLayer === 7;
			const needsBloom = activeBloom;

			const sceneTarget = ensureColorTarget(
				gl,
				sceneTargetRef,
				scaledWidth,
				scaledHeight,
			);
			const normalTarget = needsGBuffer
				? ensureColorTarget(
						gl,
						normalTargetRef,
						scaledWidth,
						scaledHeight,
						gl.NEAREST,
					)
				: null;
			const depthTarget = needsGBuffer
				? ensureColorTarget(
						gl,
						depthTargetRef,
						scaledWidth,
						scaledHeight,
						gl.NEAREST,
					)
				: null;
			const ssaoTarget = needsGBuffer
				? ensureColorTarget(gl, ssaoTargetRef, scaledWidth, scaledHeight)
				: null;
			const bloomWidth = Math.max(1, Math.floor(scaledWidth / 2));
			const bloomHeight = Math.max(1, Math.floor(scaledHeight / 2));
			const bloomA = needsBloom
				? ensureColorTarget(gl, bloomARef, bloomWidth, bloomHeight)
				: null;
			const bloomB = needsBloom
				? ensureColorTarget(gl, bloomBRef, bloomWidth, bloomHeight)
				: null;
			const bloomC = needsBloom
				? ensureColorTarget(gl, bloomCRef, bloomWidth, bloomHeight)
				: null;

			const requestedShadowSize = Math.max(
				128,
				Math.floor(rendering?.shadowMapSize ?? DEFAULT_SHADOW_MAP_SIZE),
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

			const cameraNear = Math.max(
				0.001,
				rendering?.cameraNear ?? DEFAULT_CAMERA_NEAR,
			);
			const cameraFar = Math.max(
				cameraNear + 0.01,
				rendering?.cameraFar ?? DEFAULT_CAMERA_FAR,
			);
			const projection = perspective(
				request.camera?.fov ?? Math.PI / 4,
				scaledWidth / scaledHeight,
				cameraNear,
				cameraFar,
			);
			const inverseProjection = invertMat4(projection);
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
			const lightProjection = ortho(
				-shadowOrthoSize,
				shadowOrthoSize,
				-shadowOrthoSize,
				shadowOrthoSize,
				shadowNear,
				shadowFar,
			);
			const lightView = lookAt(lightPosition, cameraTarget, [0, 0, 1]);

			if (shadowsEnabled) {
				drawShadowPass(
					gl,
					shadowProgram,
					activeShadowResources,
					mesh,
					lightProjection,
					lightView,
					model,
				);
			}

			gl.useProgram(mainProgram.program);
			gl.bindFramebuffer(gl.FRAMEBUFFER, sceneTarget.framebuffer);
			gl.viewport(0, 0, scaledWidth, scaledHeight);
			const clear = rendering?.clearColor || [0.05, 0.05, 0.08, 1];
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
			if (mainProgram.uniforms.shadowsEnabled) {
				gl.uniform1f(
					mainProgram.uniforms.shadowsEnabled,
					shadowsEnabled ? 1 : 0,
				);
			}
			if (mainProgram.uniforms.shadowMode) {
				gl.uniform1i(
					mainProgram.uniforms.shadowMode,
					shadowMode === "soft" ? 1 : 0,
				);
			}
			if (mainProgram.uniforms.shadowBias) {
				gl.uniform1f(mainProgram.uniforms.shadowBias, shadowBias);
			}
			if (mainProgram.uniforms.shadowNormalBias) {
				gl.uniform1f(mainProgram.uniforms.shadowNormalBias, shadowNormalBias);
			}
			if (mainProgram.uniforms.shadowSoftness) {
				gl.uniform1f(mainProgram.uniforms.shadowSoftness, shadowSoftness);
			}
			if (mainProgram.uniforms.shadowOrthoSize) {
				gl.uniform1f(mainProgram.uniforms.shadowOrthoSize, shadowOrthoSize);
			}
			if (mainProgram.uniforms.shadowSamples) {
				gl.uniform1i(mainProgram.uniforms.shadowSamples, shadowSamples);
			}
			if (mainProgram.uniforms.ambientColor) {
				gl.uniform3f(
					mainProgram.uniforms.ambientColor,
					ambientColor[0],
					ambientColor[1],
					ambientColor[2],
				);
			}
			if (mainProgram.uniforms.ambientIntensity) {
				gl.uniform1f(mainProgram.uniforms.ambientIntensity, ambientIntensity);
			}
			if (mainProgram.uniforms.rimColor) {
				gl.uniform3f(
					mainProgram.uniforms.rimColor,
					rimColor[0],
					rimColor[1],
					rimColor[2],
				);
			}
			if (mainProgram.uniforms.rimIntensity) {
				gl.uniform1f(mainProgram.uniforms.rimIntensity, rimIntensity);
			}
			if (mainProgram.uniforms.rimPower) {
				gl.uniform1f(mainProgram.uniforms.rimPower, rimPower);
			}
			if (mainProgram.uniforms.emissionStrength) {
				gl.uniform1f(mainProgram.uniforms.emissionStrength, emissionStrength);
			}
			if (mainProgram.uniforms.ssaoEnabled) {
				gl.uniform1f(mainProgram.uniforms.ssaoEnabled, ssaoEnabled ? 1 : 0);
			}
			if (mainProgram.uniforms.ssaoRadius) {
				gl.uniform1f(mainProgram.uniforms.ssaoRadius, ssaoRadius);
			}
			if (mainProgram.uniforms.ssaoIntensity) {
				gl.uniform1f(mainProgram.uniforms.ssaoIntensity, ssaoIntensity);
			}
			if (mainProgram.uniforms.ssaoBias) {
				gl.uniform1f(mainProgram.uniforms.ssaoBias, ssaoBias);
			}
			if (mainProgram.uniforms.ssaoSamples) {
				gl.uniform1i(mainProgram.uniforms.ssaoSamples, ssaoSamples);
			}
			if (mainProgram.uniforms.bloomEnabled) {
				gl.uniform1f(mainProgram.uniforms.bloomEnabled, bloomEnabled ? 1 : 0);
			}
			if (mainProgram.uniforms.bloomThreshold) {
				gl.uniform1f(mainProgram.uniforms.bloomThreshold, bloomThreshold);
			}
			if (mainProgram.uniforms.bloomIntensity) {
				gl.uniform1f(mainProgram.uniforms.bloomIntensity, bloomIntensity);
			}
			if (mainProgram.uniforms.bloomRadius) {
				gl.uniform1f(mainProgram.uniforms.bloomRadius, bloomRadius);
			}
			if (mainProgram.uniforms.renderLayer) {
				const mainRenderLayer =
					renderLayer === 4 ||
					renderLayer === 5 ||
					renderLayer === 6 ||
					renderLayer === 7
						? 0
						: renderLayer;
				gl.uniform1i(mainProgram.uniforms.renderLayer, mainRenderLayer);
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

			if (needsGBuffer && normalTarget && depthTarget) {
				gl.useProgram(normalProgram.program);
				gl.bindFramebuffer(gl.FRAMEBUFFER, normalTarget.framebuffer);
				gl.viewport(0, 0, scaledWidth, scaledHeight);
				gl.clearColor(0, 0, 0, 1);
				gl.clearDepth(1);
				gl.enable(gl.DEPTH_TEST);
				gl.depthMask(true);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				if (normalProgram.uniforms.projection) {
					gl.uniformMatrix4fv(
						normalProgram.uniforms.projection,
						false,
						projection,
					);
				}
				if (normalProgram.uniforms.view) {
					gl.uniformMatrix4fv(normalProgram.uniforms.view, false, view);
				}
				if (normalProgram.uniforms.model) {
					gl.uniformMatrix4fv(normalProgram.uniforms.model, false, model);
				}
				bindAttribute(gl, normalProgram.attributes.position, mesh.position, 3);
				bindAttribute(gl, normalProgram.attributes.normal, mesh.normal, 3);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
				gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);

				gl.useProgram(depthProgram.program);
				gl.bindFramebuffer(gl.FRAMEBUFFER, depthTarget.framebuffer);
				gl.viewport(0, 0, scaledWidth, scaledHeight);
				gl.clearColor(1, 1, 1, 1);
				gl.clearDepth(1);
				gl.enable(gl.DEPTH_TEST);
				gl.depthMask(true);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				if (depthProgram.uniforms.projection) {
					gl.uniformMatrix4fv(
						depthProgram.uniforms.projection,
						false,
						projection,
					);
				}
				if (depthProgram.uniforms.view) {
					gl.uniformMatrix4fv(depthProgram.uniforms.view, false, view);
				}
				if (depthProgram.uniforms.model) {
					gl.uniformMatrix4fv(depthProgram.uniforms.model, false, model);
				}
				bindAttribute(gl, depthProgram.attributes.position, mesh.position, 3);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices);
				gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
			}

			if (
				activeSsao &&
				needsGBuffer &&
				normalTarget &&
				depthTarget &&
				ssaoTarget
			) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, ssaoTarget.framebuffer);
				gl.viewport(0, 0, scaledWidth, scaledHeight);
				gl.disable(gl.DEPTH_TEST);
				gl.clearColor(1, 1, 1, 1);
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.useProgram(ssaoProgram.program);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, normalTarget.texture);
				if (ssaoProgram.uniforms.normalTexture) {
					gl.uniform1i(ssaoProgram.uniforms.normalTexture, 1);
				}
				gl.activeTexture(gl.TEXTURE2);
				gl.bindTexture(gl.TEXTURE_2D, depthTarget.texture);
				if (ssaoProgram.uniforms.depthTexture) {
					gl.uniform1i(ssaoProgram.uniforms.depthTexture, 2);
				}
				if (ssaoProgram.uniforms.texel) {
					gl.uniform2f(
						ssaoProgram.uniforms.texel,
						1 / scaledWidth,
						1 / scaledHeight,
					);
				}
				if (ssaoProgram.uniforms.radius) {
					gl.uniform1f(ssaoProgram.uniforms.radius, ssaoRadius);
				}
				if (ssaoProgram.uniforms.intensity) {
					gl.uniform1f(ssaoProgram.uniforms.intensity, ssaoIntensity);
				}
				if (ssaoProgram.uniforms.bias) {
					gl.uniform1f(ssaoProgram.uniforms.bias, ssaoBias);
				}
				if (ssaoProgram.uniforms.samples) {
					gl.uniform1f(ssaoProgram.uniforms.samples, ssaoSamples);
				}
				if (ssaoProgram.uniforms.projection) {
					gl.uniformMatrix4fv(
						ssaoProgram.uniforms.projection,
						false,
						projection,
					);
				}
				if (ssaoProgram.uniforms.inverseProjection) {
					gl.uniformMatrix4fv(
						ssaoProgram.uniforms.inverseProjection,
						false,
						inverseProjection,
					);
				}
				drawFullscreen(
					gl,
					ssaoProgram.program,
					ssaoProgram.attributes.position,
				);
			}

			let finalBloomTexture: WebGLTexture | null = null;
			if (activeBloom && bloomA && bloomB && bloomC) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.framebuffer);
				gl.viewport(0, 0, bloomWidth, bloomHeight);
				gl.disable(gl.DEPTH_TEST);
				gl.clearColor(0, 0, 0, 1);
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.useProgram(bloomExtractProgram.program);
				gl.activeTexture(gl.TEXTURE2);
				gl.bindTexture(gl.TEXTURE_2D, sceneTarget.texture);
				if (bloomExtractProgram.uniforms.scene) {
					gl.uniform1i(bloomExtractProgram.uniforms.scene, 2);
				}
				if (bloomExtractProgram.uniforms.threshold) {
					gl.uniform1f(bloomExtractProgram.uniforms.threshold, bloomThreshold);
				}
				drawFullscreen(
					gl,
					bloomExtractProgram.program,
					bloomExtractProgram.attributes.position,
				);

				gl.activeTexture(gl.TEXTURE3);
				gl.bindTexture(gl.TEXTURE_2D, bloomA.texture);
				gl.useProgram(bloomBlurProgram.program);
				if (bloomBlurProgram.uniforms.bloom) {
					gl.uniform1i(bloomBlurProgram.uniforms.bloom, 3);
				}
				if (bloomBlurProgram.uniforms.texel) {
					gl.uniform2f(
						bloomBlurProgram.uniforms.texel,
						1 / bloomWidth,
						1 / bloomHeight,
					);
				}
				if (bloomBlurProgram.uniforms.radius) {
					gl.uniform1f(bloomBlurProgram.uniforms.radius, bloomRadius);
				}
				if (bloomBlurProgram.uniforms.direction) {
					gl.bindFramebuffer(gl.FRAMEBUFFER, bloomB.framebuffer);
					gl.viewport(0, 0, bloomWidth, bloomHeight);
					gl.uniform2f(bloomBlurProgram.uniforms.direction, 1, 0);
					drawFullscreen(
						gl,
						bloomBlurProgram.program,
						bloomBlurProgram.attributes.position,
					);

					gl.bindFramebuffer(gl.FRAMEBUFFER, bloomC.framebuffer);
					gl.viewport(0, 0, bloomWidth, bloomHeight);
					gl.bindTexture(gl.TEXTURE_2D, bloomB.texture);
					gl.uniform2f(bloomBlurProgram.uniforms.direction, 0, 1);
					drawFullscreen(
						gl,
						bloomBlurProgram.program,
						bloomBlurProgram.attributes.position,
					);
				}
				finalBloomTexture = bloomC.texture;
			}

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.viewport(0, 0, scaledWidth, scaledHeight);
			gl.disable(gl.DEPTH_TEST);
			gl.clearColor(clear[0], clear[1], clear[2], clear[3]);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(composeProgram.program);

			gl.activeTexture(gl.TEXTURE4);
			gl.bindTexture(gl.TEXTURE_2D, sceneTarget.texture);
			if (composeProgram.uniforms.scene) {
				gl.uniform1i(composeProgram.uniforms.scene, 4);
			}

			const normalTexture = normalTarget
				? normalTarget.texture
				: sceneTarget.texture;
			gl.activeTexture(gl.TEXTURE5);
			gl.bindTexture(gl.TEXTURE_2D, normalTexture);
			if (composeProgram.uniforms.normalTexture) {
				gl.uniform1i(composeProgram.uniforms.normalTexture, 5);
			}

			const depthTexture = depthTarget
				? depthTarget.texture
				: sceneTarget.texture;
			gl.activeTexture(gl.TEXTURE6);
			gl.bindTexture(gl.TEXTURE_2D, depthTexture);
			if (composeProgram.uniforms.depthTexture) {
				gl.uniform1i(composeProgram.uniforms.depthTexture, 6);
			}

			const ssaoTexture = ssaoTarget ? ssaoTarget.texture : sceneTarget.texture;
			gl.activeTexture(gl.TEXTURE7);
			gl.bindTexture(gl.TEXTURE_2D, ssaoTexture);
			if (composeProgram.uniforms.ssao) {
				gl.uniform1i(composeProgram.uniforms.ssao, 7);
			}

			gl.activeTexture(gl.TEXTURE8);
			gl.bindTexture(gl.TEXTURE_2D, finalBloomTexture || sceneTarget.texture);
			if (composeProgram.uniforms.bloom) {
				gl.uniform1i(composeProgram.uniforms.bloom, 8);
			}
			if (composeProgram.uniforms.ssaoEnabled) {
				gl.uniform1f(composeProgram.uniforms.ssaoEnabled, activeSsao ? 1 : 0);
			}
			if (composeProgram.uniforms.ssaoIntensity) {
				gl.uniform1f(composeProgram.uniforms.ssaoIntensity, ssaoIntensity);
			}
			if (composeProgram.uniforms.bloomEnabled) {
				gl.uniform1f(composeProgram.uniforms.bloomEnabled, activeBloom ? 1 : 0);
			}
			if (composeProgram.uniforms.bloomIntensity) {
				gl.uniform1f(composeProgram.uniforms.bloomIntensity, bloomIntensity);
			}
			if (composeProgram.uniforms.renderLayer) {
				gl.uniform1i(composeProgram.uniforms.renderLayer, renderLayer);
			}
			drawFullscreen(
				gl,
				composeProgram.program,
				composeProgram.attributes.position,
			);
			gl.enable(gl.DEPTH_TEST);

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
		[drawFullscreen, drawShadowPass, ensureColorTarget, ensurePrograms],
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

			// Do not delete live GL objects here; React strict-mode teardown can race
			// with queued frames and trigger INVALID_OPERATION on deleted handles.
			sceneTargetRef.current = null;
			normalTargetRef.current = null;
			depthTargetRef.current = null;
			ssaoTargetRef.current = null;
			bloomARef.current = null;
			bloomBRef.current = null;
			bloomCRef.current = null;
			shadowResourcesRef.current = null;
			fullscreenQuadRef.current = null;
			mainProgramRef.current = null;
			shadowProgramRef.current = null;
			normalProgramRef.current = null;
			depthProgramRef.current = null;
			ssaoProgramRef.current = null;
			bloomExtractProgramRef.current = null;
			bloomBlurProgramRef.current = null;
			composeProgramRef.current = null;
			meshCacheRef.current = new WeakMap();
			glRef.current = null;
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
