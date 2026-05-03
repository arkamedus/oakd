import { CoreContentProps } from "../../Core/Core.types";
import { OakMMeshData } from "../../Utils/OakM";
import {
	GLRenderCamera,
	GLRenderConfig,
} from "../GLContextProvider/GLContextProvider.types";

export interface GLRendererProps extends CoreContentProps<HTMLCanvasElement> {
	mesh: OakMMeshData;
	width?: number | "100%";
	height?: number;
	autoRotate?: boolean;
	rotationSpeed?: number;
	cameraDistance?: number;
	cameraOrbitSpeed?: number;
	camera?: GLRenderCamera;
	rendering?: GLRenderConfig;
	vertexShader?: string;
	fragmentShader?: string;
	wide?: boolean;
	grow?: boolean;
	fill?: boolean;
}
