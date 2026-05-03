import React, { act, useContext } from "react";
import { createRoot, Root } from "react-dom/client";
import GLContextProvider, { GLContext } from "./GLContextProvider";
import { GLContextValue, GLRenderRequest } from "./GLContextProvider.types";
import { createOakMCube, oakMToMeshData } from "../../Utils/OakM";

interface Mock2DContext {
	clearRect: jest.Mock<void, [number, number, number, number]>;
	drawImage: jest.Mock<void, [CanvasImageSource, number, number, number, number]>;
}

interface MountedTree {
	container: HTMLDivElement;
	unmount: () => void;
}

const mount = (element: React.ReactElement): MountedTree => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	let root: Root | null = createRoot(container);
	act(() => {
		root?.render(element);
	});
	return {
		container,
		unmount: () => {
			act(() => {
				root?.unmount();
			});
			root = null;
			container.remove();
		},
	};
};

const createMock2DContext = (): Mock2DContext => ({
	clearRect: jest.fn(),
	drawImage: jest.fn(),
});

const createMockWebGLContext = (): WebGLRenderingContext => {
	let id = 1;
	const nextHandle = () => ({ __id: id++ });

	const gl = {
		DEPTH_TEST: 0x0b71,
		VERTEX_SHADER: 0x8b31,
		FRAGMENT_SHADER: 0x8b30,
		COMPILE_STATUS: 0x8b81,
		LINK_STATUS: 0x8b82,
		FRAMEBUFFER: 0x8d40,
		TEXTURE_2D: 0x0de1,
		RGBA: 0x1908,
		UNSIGNED_BYTE: 0x1401,
		TEXTURE_MIN_FILTER: 0x2801,
		NEAREST: 0x2600,
		LINEAR: 0x2601,
		TEXTURE_MAG_FILTER: 0x2800,
		TEXTURE_WRAP_S: 0x2802,
		CLAMP_TO_EDGE: 0x812f,
		TEXTURE_WRAP_T: 0x2803,
		COLOR_ATTACHMENT0: 0x8ce0,
		RENDERBUFFER: 0x8d41,
		DEPTH_COMPONENT16: 0x81a5,
		DEPTH_ATTACHMENT: 0x8d00,
		FRAMEBUFFER_COMPLETE: 0x8cd5,
		ARRAY_BUFFER: 0x8892,
		ELEMENT_ARRAY_BUFFER: 0x8893,
		STATIC_DRAW: 0x88e4,
		FLOAT: 0x1406,
		TRIANGLES: 0x0004,
		UNSIGNED_SHORT: 0x1403,
		COLOR_BUFFER_BIT: 0x4000,
		DEPTH_BUFFER_BIT: 0x0100,
		TEXTURE0: 0x84c0,
		TEXTURE1: 0x84c1,
		TEXTURE2: 0x84c2,
		TEXTURE3: 0x84c3,
		TEXTURE4: 0x84c4,
		TEXTURE5: 0x84c5,
		TEXTURE6: 0x84c6,
		TEXTURE7: 0x84c7,
		TEXTURE8: 0x84c8,
		createShader: jest.fn(() => nextHandle()),
		shaderSource: jest.fn(),
		compileShader: jest.fn(),
		getShaderParameter: jest.fn(() => true),
		getShaderInfoLog: jest.fn(() => ""),
		deleteShader: jest.fn(),
		createProgram: jest.fn(() => nextHandle()),
		attachShader: jest.fn(),
		linkProgram: jest.fn(),
		getProgramParameter: jest.fn(() => true),
		getProgramInfoLog: jest.fn(() => ""),
		deleteProgram: jest.fn(),
		getAttribLocation: jest.fn(() => 1),
		getUniformLocation: jest.fn(() => nextHandle()),
		createFramebuffer: jest.fn(() => nextHandle()),
		createTexture: jest.fn(() => nextHandle()),
		createRenderbuffer: jest.fn(() => nextHandle()),
		bindFramebuffer: jest.fn(),
		bindTexture: jest.fn(),
		texImage2D: jest.fn(),
		texParameteri: jest.fn(),
		framebufferTexture2D: jest.fn(),
		bindRenderbuffer: jest.fn(),
		renderbufferStorage: jest.fn(),
		framebufferRenderbuffer: jest.fn(),
		checkFramebufferStatus: jest.fn(() => 0x8cd5),
		createBuffer: jest.fn(() => nextHandle()),
		bindBuffer: jest.fn(),
		bufferData: jest.fn(),
		useProgram: jest.fn(),
		viewport: jest.fn(),
		clearColor: jest.fn(),
		clearDepth: jest.fn(),
		enable: jest.fn(),
		disable: jest.fn(),
		depthMask: jest.fn(),
		clear: jest.fn(),
		uniformMatrix4fv: jest.fn(),
		uniform3f: jest.fn(),
		uniform2f: jest.fn(),
		uniform4fv: jest.fn(),
		activeTexture: jest.fn(),
		uniform1i: jest.fn(),
		uniform1f: jest.fn(),
		enableVertexAttribArray: jest.fn(),
		vertexAttribPointer: jest.fn(),
		drawArrays: jest.fn(),
		drawElements: jest.fn(),
		deleteFramebuffer: jest.fn(),
		deleteTexture: jest.fn(),
		deleteRenderbuffer: jest.fn(),
		deleteBuffer: jest.fn(),
	};

	return gl as unknown as WebGLRenderingContext;
};

const meshA = oakMToMeshData(createOakMCube("mesh-a"));
const meshB = oakMToMeshData(createOakMCube("mesh-b"));

describe("GLContextProvider", () => {
	let capturedContext: GLContextValue | null = null;
	let mockWebGL: WebGLRenderingContext;
	let rafCallbacks: FrameRequestCallback[];
	const twoDContextMap = new WeakMap<HTMLCanvasElement, Mock2DContext>();

	beforeAll(() => {
		(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
			.IS_REACT_ACT_ENVIRONMENT = true;
	});

	const get2DContext = (canvas: HTMLCanvasElement): Mock2DContext => {
		let context = twoDContextMap.get(canvas);
		if (!context) {
			context = createMock2DContext();
			twoDContextMap.set(canvas, context);
		}
		return context;
	};

	const mountProvider = (): MountedTree => {
		const Probe = () => {
			capturedContext = useContext(GLContext);
			return null;
		};
		return mount(
			<GLContextProvider>
				<Probe />
			</GLContextProvider>,
		);
	};

	const requestFor = (
		targetCanvas: HTMLCanvasElement,
		overrides?: Partial<GLRenderRequest>,
	): GLRenderRequest => ({
		targetCanvas,
		mesh: meshA,
		width: 200,
		height: 120,
		...overrides,
	});

	const flushNextFrame = (timeMs = 16) => {
		const callback = rafCallbacks.shift();
		if (!callback) return;
		act(() => {
			callback(timeMs);
		});
	};

	beforeEach(() => {
		capturedContext = null;
		mockWebGL = createMockWebGLContext();
		rafCallbacks = [];

		jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
			rafCallbacks.push(callback);
			return rafCallbacks.length;
		});
		jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

		jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
			function (this: HTMLCanvasElement, contextId: string) {
				if (contextId === "webgl") {
					return mockWebGL as unknown as WebGLRenderingContext;
				}
				if (contextId === "2d") {
					return get2DContext(this) as unknown as CanvasRenderingContext2D;
				}
				return null;
			} as typeof HTMLCanvasElement.prototype.getContext,
		);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	afterAll(() => {
		(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
			.IS_REACT_ACT_ENVIRONMENT = false;
	});

	it("batches multiple render requests for the same canvas into one draw per frame", () => {
		const mounted = mountProvider();
		const context = capturedContext as GLContextValue;
		const canvas = document.createElement("canvas");
		const context2D = get2DContext(canvas);

		context.render(requestFor(canvas, { width: 120 }));
		context.render(requestFor(canvas, { width: 240 }));
		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
		expect(context2D.drawImage).toHaveBeenCalledTimes(0);

		flushNextFrame(20);
		expect(context2D.drawImage).toHaveBeenCalledTimes(1);
		expect(canvas.width).toBe(240);
		mounted.unmount();
	});

	it("draws each dirty canvas once in a shared flush frame", () => {
		const mounted = mountProvider();
		const context = capturedContext as GLContextValue;
		const firstCanvas = document.createElement("canvas");
		const secondCanvas = document.createElement("canvas");
		const firstContext2D = get2DContext(firstCanvas);
		const secondContext2D = get2DContext(secondCanvas);

		context.render(requestFor(firstCanvas));
		context.render(requestFor(secondCanvas, { width: 160, height: 90 }));
		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

		flushNextFrame(20);
		expect(firstContext2D.drawImage).toHaveBeenCalledTimes(1);
		expect(secondContext2D.drawImage).toHaveBeenCalledTimes(1);
		mounted.unmount();
	});

	it("does not rewrite layout attributes when only camera or mesh inputs change", () => {
		const mounted = mountProvider();
		const context = capturedContext as GLContextValue;
		const canvas = document.createElement("canvas");
		const context2D = get2DContext(canvas);

		context.render(requestFor(canvas, { width: 200, height: 100, mesh: meshA }));
		flushNextFrame(20);
		expect(context2D.drawImage).toHaveBeenCalledTimes(1);

		let numericWidth = canvas.width;
		let numericHeight = canvas.height;
		let cssWidth = canvas.style.width;
		let cssHeight = canvas.style.height;
		let widthWrites = 0;
		let heightWrites = 0;
		let cssWidthWrites = 0;
		let cssHeightWrites = 0;

		Object.defineProperty(canvas, "width", {
			configurable: true,
			get: () => numericWidth,
			set: (value: number) => {
				widthWrites += 1;
				numericWidth = Number(value);
			},
		});
		Object.defineProperty(canvas, "height", {
			configurable: true,
			get: () => numericHeight,
			set: (value: number) => {
				heightWrites += 1;
				numericHeight = Number(value);
			},
		});
		Object.defineProperty(canvas.style, "width", {
			configurable: true,
			get: () => cssWidth,
			set: (value: string) => {
				cssWidthWrites += 1;
				cssWidth = value;
			},
		});
		Object.defineProperty(canvas.style, "height", {
			configurable: true,
			get: () => cssHeight,
			set: (value: string) => {
				cssHeightWrites += 1;
				cssHeight = value;
			},
		});

		context.render(
			requestFor(canvas, {
				width: 200,
				height: 100,
				mesh: meshB,
				camera: {
					from: [2.5, 2.5, 2.5],
					to: [0, 0, 0],
					up: [0, 0, 1],
				},
			}),
		);
		flushNextFrame(40);

		expect(context2D.drawImage).toHaveBeenCalledTimes(2);
		expect(widthWrites).toBe(0);
		expect(heightWrites).toBe(0);
		expect(cssWidthWrites).toBe(0);
		expect(cssHeightWrites).toBe(0);
		mounted.unmount();
	});

	it("drops pending work for a canvas after release", () => {
		const mounted = mountProvider();
		const context = capturedContext as GLContextValue;
		const canvas = document.createElement("canvas");
		const context2D = get2DContext(canvas);

		context.render(requestFor(canvas));
		context.release(canvas);
		flushNextFrame(20);

		expect(context2D.drawImage).toHaveBeenCalledTimes(0);
		mounted.unmount();
	});

	it("uses nearest filtering for gbuffer targets when SSAO is enabled", () => {
		const mounted = mountProvider();
		const context = capturedContext as GLContextValue;
		const canvas = document.createElement("canvas");

		context.render(
			requestFor(canvas, {
				rendering: {
					ssaoEnabled: true,
				},
			}),
		);
		flushNextFrame(20);

		const texParameteri = mockWebGL.texParameteri as jest.Mock;
		const nearest = (mockWebGL as unknown as { NEAREST: number }).NEAREST;
		const nearestCalls = texParameteri.mock.calls.filter(
			(call) => call[2] === nearest,
		);
		expect(nearestCalls.length).toBeGreaterThan(0);
		mounted.unmount();
	});

	it("skips SSAO and bloom passes for non-final debug layers", () => {
		const mounted = mountProvider();
		const context = capturedContext as GLContextValue;
		const canvas = document.createElement("canvas");

		context.render(
			requestFor(canvas, {
				rendering: {
					renderLayer: "diffuse",
					ssaoEnabled: true,
					bloomEnabled: true,
				},
			}),
		);
		flushNextFrame(20);

		const drawArrays = mockWebGL.drawArrays as jest.Mock;
		expect(drawArrays).toHaveBeenCalledTimes(1);
		mounted.unmount();
	});
});
