import { OakMMeshData } from "./OakM";

export type PLYIndexArray = Uint16Array | Uint32Array;

export interface PLYData {
	positions: Float32Array;
	normals: Float32Array;
	uvs: Float32Array;
	colors: Float32Array;
	indices: PLYIndexArray;
	materials: Float32Array;
}

export interface PLYParseOptions {
	defaultColor?: [number, number, number, number];
	defaultMaterial?: number;
}

export interface PLYMeshBuildOptions {
	material?: number;
}

type ElementName = "vertex" | "face" | string;

interface PropertyInfo {
	name: string;
	type: string;
}

interface ElementInfo {
	name: ElementName;
	count: number;
	properties: PropertyInfo[];
}

const MAX_UINT16_INDEX = 65535;

const COLOR_PROPERTIES = new Set(["red", "green", "blue", "alpha"]);

const normalizeLine = (line: string): string => line.trim();

const splitLine = (line: string): string[] =>
	normalizeLine(line).split(/\s+/).filter(Boolean);

const readNumericValue = (
	values: string[],
	propertyIndex: Record<string, number | undefined>,
	propertyName: string,
	defaultValue: number,
): number => {
	const index = propertyIndex[propertyName];
	if (index === undefined || index < 0 || index >= values.length) {
		return defaultValue;
	}
	const raw = values[index];
	if (COLOR_PROPERTIES.has(propertyName)) {
		const colorValue = Number.parseInt(raw, 10);
		return Number.isFinite(colorValue) ? colorValue / 255 : defaultValue;
	}
	const value = Number.parseFloat(raw);
	return Number.isFinite(value) ? value : defaultValue;
};

const createIndexArray = (indices: number[]): PLYIndexArray => {
	let maxIndex = 0;
	for (let index = 0; index < indices.length; index += 1) {
		if (indices[index] > maxIndex) {
			maxIndex = indices[index];
		}
	}
	return maxIndex > MAX_UINT16_INDEX
		? new Uint32Array(indices)
		: new Uint16Array(indices);
};

const parseHeader = (
	lines: string[],
): {
	elements: ElementInfo[];
	format: string;
	headerEndLine: number;
} => {
	const elements: ElementInfo[] = [];
	let activeElement: ElementInfo | undefined;
	let format = "";

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = normalizeLine(lines[lineIndex]);
		if (!line || line.startsWith("comment")) {
			continue;
		}
		if (line === "end_header") {
			return { elements, format, headerEndLine: lineIndex };
		}
		const parts = splitLine(line);
		if (parts[0] === "format") {
			format = parts[1] || "";
			continue;
		}
		if (parts[0] === "element") {
			activeElement = {
				name: parts[1] || "",
				count: Math.max(0, Number.parseInt(parts[2] || "0", 10) || 0),
				properties: [],
			};
			elements.push(activeElement);
			continue;
		}
		if (parts[0] === "property" && activeElement) {
			if (parts[1] === "list") {
				activeElement.properties.push({
					type: `${parts[1]} ${parts[2] || ""} ${parts[3] || ""}`.trim(),
					name: parts[4] || "",
				});
			} else {
				activeElement.properties.push({
					type: parts[1] || "",
					name: parts[2] || "",
				});
			}
		}
	}

	throw new Error("Invalid PLY: missing end_header");
};

export const parsePLY = (
	plyString: string,
	options: PLYParseOptions = {},
): PLYData => {
	const lines = plyString.split(/\r?\n/);
	const { elements, format, headerEndLine } = parseHeader(lines);
	if (format !== "ascii") {
		throw new Error(`Unsupported PLY format: ${format || "unknown"}`);
	}

	const defaultColor = options.defaultColor || [1, 1, 1, 1];
	const defaultMaterial = options.defaultMaterial ?? 0;
	const positions: number[] = [];
	const normals: number[] = [];
	const uvs: number[] = [];
	const colors: number[] = [];
	const materials: number[] = [];
	const indices: number[] = [];
	let currentLine = headerEndLine + 1;

	for (const element of elements) {
		if (element.name === "vertex") {
			const propertyIndex = element.properties.reduce<Record<string, number>>(
				(acc, property, index) => {
					if (property.name) {
						acc[property.name] = index;
					}
					return acc;
				},
				{},
			);

			for (let vertexIndex = 0; vertexIndex < element.count; vertexIndex += 1) {
				const values = splitLine(lines[currentLine] || "");
				currentLine += 1;
				positions.push(
					readNumericValue(values, propertyIndex, "x", 0),
					readNumericValue(values, propertyIndex, "y", 0),
					readNumericValue(values, propertyIndex, "z", 0),
				);
				normals.push(
					readNumericValue(values, propertyIndex, "nx", 0),
					readNumericValue(values, propertyIndex, "ny", 0),
					readNumericValue(values, propertyIndex, "nz", 0),
				);
				uvs.push(
					readNumericValue(values, propertyIndex, "s", 0),
					readNumericValue(values, propertyIndex, "t", 0),
				);
				colors.push(
					readNumericValue(values, propertyIndex, "red", defaultColor[0]),
					readNumericValue(values, propertyIndex, "green", defaultColor[1]),
					readNumericValue(values, propertyIndex, "blue", defaultColor[2]),
					readNumericValue(values, propertyIndex, "alpha", defaultColor[3]),
				);
				const material = readNumericValue(
					values,
					propertyIndex,
					"material",
					Number.NaN,
				);
				materials.push(
					Number.isFinite(material)
						? material
						: readNumericValue(
								values,
								propertyIndex,
								"material_index",
								defaultMaterial,
							),
				);
			}
			continue;
		}

		if (element.name === "face") {
			for (let faceIndex = 0; faceIndex < element.count; faceIndex += 1) {
				const values = splitLine(lines[currentLine] || "");
				currentLine += 1;
				const count = Math.max(0, Number.parseInt(values[0] || "0", 10) || 0);
				const faceIndices = values
					.slice(1, 1 + count)
					.map((value) => Number.parseInt(value, 10))
					.filter((value) => Number.isFinite(value));
				if (faceIndices.length < 3) {
					continue;
				}
				for (let index = 1; index < faceIndices.length - 1; index += 1) {
					indices.push(
						faceIndices[0],
						faceIndices[index],
						faceIndices[index + 1],
					);
				}
			}
			continue;
		}

		currentLine += element.count;
	}

	return {
		positions: new Float32Array(positions),
		normals: new Float32Array(normals),
		uvs: new Float32Array(uvs),
		colors: new Float32Array(colors),
		materials: new Float32Array(materials),
		indices: createIndexArray(indices),
	};
};

export const plyToMeshData = (
	plyData: PLYData,
	options: PLYMeshBuildOptions = {},
): OakMMeshData => {
	const vertexCount = plyData.positions.length / 3;
	const materials = new Float32Array(vertexCount);
	if (plyData.materials.length >= vertexCount) {
		materials.set(plyData.materials.slice(0, vertexCount));
	} else {
		materials.fill(options.material ?? 0);
		materials.set(
			plyData.materials.slice(
				0,
				Math.min(plyData.materials.length, vertexCount),
			),
		);
	}

	const colors = new Float32Array(vertexCount * 4);
	if (plyData.colors.length >= colors.length) {
		colors.set(plyData.colors.slice(0, colors.length));
	} else {
		for (let index = 0; index < colors.length; index += 4) {
			colors[index] = 1;
			colors[index + 1] = 1;
			colors[index + 2] = 1;
			colors[index + 3] = 1;
		}
		colors.set(
			plyData.colors.slice(0, Math.min(plyData.colors.length, colors.length)),
		);
	}

	const normals = new Float32Array(vertexCount * 3);
	if (plyData.normals.length >= normals.length) {
		normals.set(plyData.normals.slice(0, normals.length));
	} else {
		normals.set(
			plyData.normals.slice(
				0,
				Math.min(plyData.normals.length, normals.length),
			),
		);
	}

	return {
		positions: new Float32Array(plyData.positions),
		normals,
		colors,
		materials,
		indices:
			plyData.indices instanceof Uint32Array
				? new Uint32Array(plyData.indices)
				: new Uint16Array(plyData.indices),
	};
};
