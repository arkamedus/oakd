import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { GLRendererProps } from "./GLRenderer.types";
import { GLContext } from "../GLContextProvider/GLContextProvider";
import { Quat4 } from "../../Utils/Quat4";
import "./GLRenderer.css";

const GLRenderer: React.FC<GLRendererProps> = ({
	mesh,
	width = "100%",
	height = 220,
	autoRotate = false,
	rotationSpeed = 0.6,
	cameraDistance = 3,
	cameraOrbitSpeed = 0,
	camera,
	rendering,
	className,
	style,
	wide,
	grow,
	fill,
	...rest
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const releasedCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const lastFrameTimeRef = useRef(0);
	const rotationQuatRef = useRef(Quat4.identity());
	const rotationTickRef = useRef<number | null>(null);
	const { render, release, isSupported } = useContext(GLContext);
	const [size, setSize] = useState({
		width: typeof width === "number" ? width : 1,
		height,
	});

	const updateSize = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (!parent) return;
		const parentRect = parent.getBoundingClientRect();

		const nextWidth =
			typeof width === "number"
				? width
				: Math.max(1, Math.floor(parentRect.width));
		const nextHeight =
			fill && parentRect.height > 1
				? Math.max(1, Math.floor(parentRect.height))
				: height;
		setSize((previous) =>
			previous.width === nextWidth && previous.height === nextHeight
				? previous
				: { width: nextWidth, height: nextHeight },
		);
	}, [fill, height, width]);

	useEffect(() => {
		updateSize();
		window.addEventListener("resize", updateSize);
		return () => {
			window.removeEventListener("resize", updateSize);
		};
	}, [updateSize]);

	useEffect(() => {
		rotationQuatRef.current = Quat4.identity();
		rotationTickRef.current = null;
	}, [rotationSpeed, autoRotate]);

	const drawFrame = useCallback(
		(timeSeconds: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const maxFPS = rendering?.maxFPS ?? 60;
			const minFrameDelta = 1 / Math.max(1, maxFPS);
			if (timeSeconds - lastFrameTimeRef.current < minFrameDelta) {
				return;
			}
			lastFrameTimeRef.current = timeSeconds;

			let rotation = Quat4.identity();
			if (autoRotate) {
				if (rotationTickRef.current == null) {
					rotationTickRef.current = timeSeconds;
				}
				const deltaTime = Math.max(
					0,
					Math.min(0.25, timeSeconds - rotationTickRef.current),
				);
				rotationTickRef.current = timeSeconds;
				const axis = { x: 0.7, y: 1, z: 0.3 };
				const axisLength = Math.hypot(axis.x, axis.y, axis.z) || 1;
				const angularSpeed = rotationSpeed * axisLength;
				const deltaQuat = Quat4.fromAxisAngle(axis, angularSpeed * deltaTime);
				Quat4.multiply(
					deltaQuat,
					rotationQuatRef.current,
					rotationQuatRef.current,
				);
				rotationQuatRef.current.normalize();
				rotation = rotationQuatRef.current;
			}

			render({
				targetCanvas: canvas,
				mesh,
				width: size.width,
				height: size.height,
				cameraDistance,
				cameraOrbit: timeSeconds * cameraOrbitSpeed,
				camera,
				rotation,
				rendering,
			});
		},
		[
			autoRotate,
			camera,
			cameraDistance,
			cameraOrbitSpeed,
			mesh,
			render,
			rendering,
			rotationSpeed,
			size.height,
			size.width,
		],
	);

	const setCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
		canvasRef.current = node;
		if (node) {
			releasedCanvasRef.current = node;
		}
	}, []);

	useEffect(() => {
		const shouldAnimate = autoRotate || cameraOrbitSpeed !== 0;
		lastFrameTimeRef.current = 0;
		rotationTickRef.current = null;

		if (!shouldAnimate) {
			drawFrame(performance.now() / 1000);
			return () => undefined;
		}

		const tick = (timeMs: number) => {
			drawFrame(timeMs / 1000);
			animationFrameRef.current = window.requestAnimationFrame(tick);
		};
		animationFrameRef.current = window.requestAnimationFrame(tick);
		return () => {
			if (animationFrameRef.current !== null) {
				window.cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		};
	}, [autoRotate, drawFrame, cameraOrbitSpeed]);

	useEffect(
		() => () => {
			if (animationFrameRef.current !== null) {
				window.cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			const canvas = canvasRef.current;
			if (canvas) {
				release(canvas);
				releasedCanvasRef.current = null;
			} else if (releasedCanvasRef.current) {
				release(releasedCanvasRef.current);
				releasedCanvasRef.current = null;
			}
		},
		[release],
	);

	const classes = [
		"oakd",
		"gl-renderer",
		wide ? "wide" : "",
		grow ? "grow" : "",
		fill ? "fill" : "",
		className || "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<canvas
			{...rest}
			className={classes}
			style={style}
			ref={setCanvasRef}
			data-testid="GLRenderer"
			data-supported={isSupported ? "true" : "false"}
			aria-label="GL Renderer"
		/>
	);
};

export default GLRenderer;
