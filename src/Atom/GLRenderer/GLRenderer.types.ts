import { CoreContentProps } from "../../Core/Core.types";
import {
	GLRenderCamera,
	GLRenderConfig,
	GLRenderMesh,
} from "../GLContextProvider/GLContextProvider.types";

export interface GLRendererProps extends CoreContentProps<HTMLCanvasElement> {
	mesh: GLRenderMesh;
	width?: number | "100%";
	height?: number;
	autoRotate?: boolean;
	rotationSpeed?: number;
	cameraDistance?: number;
	cameraOrbitSpeed?: number;
	continuous?: boolean;
	camera?: GLRenderCamera;
	rendering?: GLRenderConfig;
	onBeforeRender?: (timeSeconds: number) => void;
	vertexShader?: string;
	fragmentShader?: string;
	wide?: boolean;
	grow?: boolean;
	fill?: boolean;
}
