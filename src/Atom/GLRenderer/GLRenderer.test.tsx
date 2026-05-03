import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import GLRenderer from "./GLRenderer";
import { GLContext } from "../GLContextProvider/GLContextProvider";
import { createOakMCube, oakMToMeshData } from "../../Utils/OakM";

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

describe("GLRenderer", () => {
	const mesh = oakMToMeshData(createOakMCube("test"));

	beforeAll(() => {
		(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
			.IS_REACT_ACT_ENVIRONMENT = true;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	afterAll(() => {
		(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
			.IS_REACT_ACT_ENVIRONMENT = false;
	});

	it("renders once by default without starting a RAF loop", () => {
		const renderMock = jest.fn();
		const releaseMock = jest.fn();
		const rafSpy = jest.spyOn(window, "requestAnimationFrame");

		const { container, unmount } = mount(
			<GLContext.Provider
				value={{ isSupported: true, render: renderMock, release: releaseMock }}
			>
				<GLRenderer mesh={mesh} width={240} height={120} wide grow fill />
			</GLContext.Provider>,
		);

		const canvas = container.querySelector(
			'[data-testid="GLRenderer"]',
		) as HTMLCanvasElement;
		expect(canvas).toBeTruthy();
		expect(canvas.tagName.toLowerCase()).toBe("canvas");
		expect(canvas.classList.contains("wide")).toBe(true);
		expect(canvas.classList.contains("grow")).toBe(true);
		expect(canvas.classList.contains("fill")).toBe(true);
		expect(renderMock).toHaveBeenCalledTimes(1);
		expect(rafSpy).toHaveBeenCalledTimes(0);

		unmount();
		expect(releaseMock).toHaveBeenCalledTimes(1);
		expect(releaseMock).toHaveBeenCalledWith(canvas);
	});

	it("uses bounded parent height when fill is enabled", () => {
		const renderMock = jest.fn();
		const releaseMock = jest.fn();
		const rect = {
			x: 0,
			y: 0,
			width: 640,
			height: 480,
			top: 0,
			right: 640,
			bottom: 480,
			left: 0,
			toJSON: () => ({}),
		};
		jest
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockImplementation(() => rect as DOMRect);

		const { unmount } = mount(
			<GLContext.Provider
				value={{ isSupported: true, render: renderMock, release: releaseMock }}
			>
				<GLRenderer mesh={mesh} width={240} height={120} fill />
			</GLContext.Provider>,
		);

		expect(renderMock).toHaveBeenCalled();
		const latestCallIndex = renderMock.mock.calls.length - 1;
		const latestRequest = renderMock.mock.calls[latestCallIndex][0];
		expect(latestRequest).toEqual(
			expect.objectContaining({
				width: 240,
				height: 480,
			}),
		);
		unmount();
	});

	it("runs a local animation RAF loop when autoRotate is enabled", () => {
		const renderMock = jest.fn();
		const releaseMock = jest.fn();
		const rafCallbacks: FrameRequestCallback[] = [];

		jest
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((callback: FrameRequestCallback) => {
				rafCallbacks.push(callback);
				return rafCallbacks.length;
			});
		jest
			.spyOn(window, "cancelAnimationFrame")
			.mockImplementation(() => undefined);

		const { unmount } = mount(
			<GLContext.Provider
				value={{ isSupported: true, render: renderMock, release: releaseMock }}
			>
				<GLRenderer mesh={mesh} width={240} height={120} autoRotate />
			</GLContext.Provider>,
		);

		expect(rafCallbacks.length).toBe(1);
		expect(renderMock).toHaveBeenCalledTimes(0);

		act(() => {
			const callback = rafCallbacks.shift();
			if (callback) callback(20);
		});
		expect(renderMock).toHaveBeenCalledTimes(1);
		expect(rafCallbacks.length).toBe(1);

		act(() => {
			const callback = rafCallbacks.shift();
			if (callback) callback(40);
		});
		expect(renderMock).toHaveBeenCalledTimes(2);

		unmount();
		expect(releaseMock).toHaveBeenCalledTimes(1);
	});

	it("runs a local animation RAF loop when camera orbit speed is enabled", () => {
		const renderMock = jest.fn();
		const releaseMock = jest.fn();
		const rafCallbacks: FrameRequestCallback[] = [];

		jest
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((callback: FrameRequestCallback) => {
				rafCallbacks.push(callback);
				return rafCallbacks.length;
			});
		jest
			.spyOn(window, "cancelAnimationFrame")
			.mockImplementation(() => undefined);

		mount(
			<GLContext.Provider
				value={{ isSupported: true, render: renderMock, release: releaseMock }}
			>
				<GLRenderer
					mesh={mesh}
					width={240}
					height={120}
					autoRotate={false}
					cameraOrbitSpeed={0.12}
				/>
			</GLContext.Provider>,
		);

		expect(rafCallbacks.length).toBe(1);
		expect(renderMock).toHaveBeenCalledTimes(0);

		act(() => {
			const callback = rafCallbacks.shift();
			if (callback) callback(20);
		});
		expect(renderMock).toHaveBeenCalledTimes(1);

		act(() => {
			const callback = rafCallbacks.shift();
			if (callback) callback(40);
		});
		expect(renderMock).toHaveBeenCalledTimes(2);
	});

	it("passes shadow settings from rendering config", () => {
		const renderMock = jest.fn();
		const releaseMock = jest.fn();

		const { unmount } = mount(
			<GLContext.Provider
				value={{ isSupported: true, render: renderMock, release: releaseMock }}
			>
				<GLRenderer
					mesh={mesh}
					width={240}
					height={120}
					rendering={{
						maxFPS: 60,
						shadowSoftness: 6.5,
						shadowSamples: 19,
						shadowOrthoSize: 22,
					}}
				/>
			</GLContext.Provider>,
		);

		expect(renderMock).toHaveBeenCalled();
		const latestCallIndex = renderMock.mock.calls.length - 1;
		const latestRequest = renderMock.mock.calls[latestCallIndex][0];
		expect(latestRequest.rendering).toEqual(
			expect.objectContaining({
				maxFPS: 60,
				shadowSoftness: 6.5,
				shadowSamples: 19,
				shadowOrthoSize: 22,
			}),
		);

		unmount();
	});
});
