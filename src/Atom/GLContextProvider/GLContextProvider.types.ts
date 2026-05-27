import { CoreContentProps } from "../../Core/Core.types";
import { OakMMeshData } from "../../Utils/OakM";

export type GLRenderMesh = OakMMeshData | readonly OakMMeshData[];

export interface GLRenderRotation {
	x: number;
	y: number;
	z: number;
}

export interface GLRenderQuaternion {
	x: number;
	y: number;
	z: number;
	w: number;
}

export interface GLRenderCamera {
	from: [number, number, number];
	to: [number, number, number];
	up?: [number, number, number];
	fov?: number;
}

export interface GLRenderConfig {
	pixelRatio?: number | "default";
	maxFPS?: number;
	shadowMapSize?: number;
	meshQuality?: 0 | 1;
	clearColor?: [number, number, number, number];
	lightDirection?: [number, number, number];
	lightPosition?: [number, number, number];
	lightTarget?: [number, number, number];
	lightIntensity?: number;
	shadowsEnabled?: boolean;
	shadowMode?: "hard" | "soft";
	shadowBias?: number;
	shadowNormalBias?: number;
	shadowSoftness?: number;
	shadowNoiseEnabled?: boolean;
	shadowSamples?: number;
	shadowOrthoSize?: number;
	shadowOrthoHalfWidth?: number;
	shadowOrthoHalfHeight?: number;
	shadowCircularFadeEnabled?: boolean;
	shadowNear?: number;
	shadowFar?: number;
	cameraNear?: number;
	cameraFar?: number;
	renderLayer?:
		| "final"
		| "diffuse"
		| "specular"
		| "lighting"
		| "emission"
		| "ssao"
		| "bloom"
		| "depth"
		| "normals"
		| "shadow";
	ssaoEnabled?: boolean;
	postProcessScale?: number;
	ssaoRadius?: number;
	ssaoIntensity?: number;
	ssaoBias?: number;
	ssaoSamples?: number;
	bloomEnabled?: boolean;
	bloomThreshold?: number;
	bloomIntensity?: number;
	bloomRadius?: number;
	ambientColor?: [number, number, number];
	ambientIntensity?: number;
	rimColor?: [number, number, number];
	rimIntensity?: number;
	rimPower?: number;
	emissionStrength?: number;
}

export interface GLRenderRequest {
	targetCanvas: HTMLCanvasElement;
	mesh: GLRenderMesh;
	width: number;
	height: number;
	rotation?: GLRenderRotation | GLRenderQuaternion;
	cameraDistance?: number;
	cameraOrbit?: number;
	camera?: GLRenderCamera;
	rendering?: GLRenderConfig;
	immediate?: boolean;
	direct?: boolean;
}

export interface GLContextValue {
	isSupported: boolean;
	/** Enqueue a render request; the latest request per target canvas wins within a frame. */
	// eslint-disable-next-line no-unused-vars
	render: (request: GLRenderRequest) => void;
	/** Release per-canvas runtime state when a renderer unmounts. */
	// eslint-disable-next-line no-unused-vars
	release: (targetCanvas: HTMLCanvasElement) => void;
}

export interface GLContextProviderProps extends CoreContentProps<HTMLDivElement> {}
