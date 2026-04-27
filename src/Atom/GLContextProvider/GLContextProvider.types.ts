import { CoreContentProps } from "../../Core/Core.types";
import { OakMMeshData } from "../../Utils/OakM";

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
}

export interface GLRenderRequest {
	targetCanvas: HTMLCanvasElement;
	mesh: OakMMeshData;
	width: number;
	height: number;
	rotation?: GLRenderRotation | GLRenderQuaternion;
	cameraDistance?: number;
	cameraOrbit?: number;
	camera?: GLRenderCamera;
	rendering?: GLRenderConfig;
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
