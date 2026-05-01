import {
	createOakMCube,
	OakMDocument,
	oakMToMeshData,
	parseOakM,
} from "./OakM";

describe("OakM utils", () => {
	it("converts a cube document into mesh buffers", () => {
		const mesh = oakMToMeshData(createOakMCube());
		expect(mesh.positions.length).toBeGreaterThan(0);
		expect(mesh.normals.length).toBe(mesh.positions.length);
		expect(mesh.colors.length).toBe((mesh.positions.length / 3) * 4);
		expect(mesh.materials.length).toBe(mesh.positions.length / 3);
		expect(mesh.indices.length).toBe(mesh.positions.length / 3);
	});

	it("parses old oakm primitive lines", () => {
		const parsed = parseOakM(
			`oakm\nformat ascii 1.0\nprimitive property name x y z rx ry rz sx sy sz material red green blue alpha\ncube "box" 0 0 0 0 0 0 1 1 1 3 1 0.8 0.2 1`,
		);
		expect(parsed.primitives).toHaveLength(1);
		expect(parsed.primitives[0].type).toBe("cube");
		expect(parsed.primitives[0].material).toBe(3);
	});

	it("keeps cube triangles flat-shaded normals", () => {
		const mesh = oakMToMeshData(createOakMCube("cube"));
		let allTrianglesFlat = true;
		for (let i = 0; i < mesh.normals.length; i += 9) {
			const n0x = mesh.normals[i + 0];
			const n0y = mesh.normals[i + 1];
			const n0z = mesh.normals[i + 2];
			const n1x = mesh.normals[i + 3];
			const n1y = mesh.normals[i + 4];
			const n1z = mesh.normals[i + 5];
			const n2x = mesh.normals[i + 6];
			const n2y = mesh.normals[i + 7];
			const n2z = mesh.normals[i + 8];
			const triangleIsFlat =
				n0x === n1x &&
				n0y === n1y &&
				n0z === n1z &&
				n0x === n2x &&
				n0y === n2y &&
				n0z === n2z;
			if (!triangleIsFlat) {
				allTrianglesFlat = false;
				break;
			}
		}
		expect(allTrianglesFlat).toBe(true);
	});

	it("uses smooth per-vertex normals for sphere meshes", () => {
		const sphere: OakMDocument = {
			name: "sphere",
			primitives: [
				{
					id: "sphere-1",
					name: "sphere",
					type: "sphere",
					position: { x: 0, y: 0, z: 0 },
					rotationDeg: { x: 0, y: 0, z: 0 },
					scale: { x: 1, y: 1, z: 1 },
					material: 0,
					color: { r: 1, g: 1, b: 1, a: 1 },
				},
			],
		};
		const mesh = oakMToMeshData(sphere, { meshQuality: 1 });

		let foundTriangleWithVaryingNormals = false;
		for (let i = 0; i < mesh.normals.length; i += 9) {
			const n0x = mesh.normals[i + 0];
			const n0y = mesh.normals[i + 1];
			const n0z = mesh.normals[i + 2];
			const n1x = mesh.normals[i + 3];
			const n1y = mesh.normals[i + 4];
			const n1z = mesh.normals[i + 5];
			const n2x = mesh.normals[i + 6];
			const n2y = mesh.normals[i + 7];
			const n2z = mesh.normals[i + 8];
			const hasVariation =
				n0x !== n1x ||
				n0y !== n1y ||
				n0z !== n1z ||
				n0x !== n2x ||
				n0y !== n2y ||
				n0z !== n2z;
			if (hasVariation) {
				foundTriangleWithVaryingNormals = true;
				break;
			}
		}

		expect(foundTriangleWithVaryingNormals).toBe(true);
	});

	it("keeps cylinder caps hard while smoothing cylinder side normals", () => {
		const cylinder: OakMDocument = {
			name: "cylinder",
			primitives: [
				{
					id: "cylinder-1",
					name: "cylinder",
					type: "cylinder",
					position: { x: 0, y: 0, z: 0 },
					rotationDeg: { x: 0, y: 0, z: 0 },
					scale: { x: 1, y: 1, z: 1 },
					material: 0,
					color: { r: 1, g: 1, b: 1, a: 1 },
				},
			],
		};
		const mesh = oakMToMeshData(cylinder, { meshQuality: 0 });
		const triangleCount = mesh.normals.length / 9;

		for (let triangle = 0; triangle < triangleCount; triangle += 1) {
			const offset = triangle * 9;
			const n0x = mesh.normals[offset + 0];
			const n0y = mesh.normals[offset + 1];
			const n0z = mesh.normals[offset + 2];
			const n1x = mesh.normals[offset + 3];
			const n1y = mesh.normals[offset + 4];
			const n1z = mesh.normals[offset + 5];
			const n2x = mesh.normals[offset + 6];
			const n2y = mesh.normals[offset + 7];
			const n2z = mesh.normals[offset + 8];
			const isFlat =
				n0x === n1x &&
				n0y === n1y &&
				n0z === n1z &&
				n0x === n2x &&
				n0y === n2y &&
				n0z === n2z;
			const slot = triangle % 4;

			if (slot <= 1) {
				expect(isFlat).toBe(false);
				expect(Math.abs(n0z)).toBeLessThan(0.95);
			} else {
				expect(isFlat).toBe(true);
				expect(Math.abs(n0z)).toBeGreaterThan(0.95);
			}
		}
	});

	it("keeps cone cap hard while smoothing cone side normals", () => {
		const cone: OakMDocument = {
			name: "cone",
			primitives: [
				{
					id: "cone-1",
					name: "cone",
					type: "cone",
					position: { x: 0, y: 0, z: 0 },
					rotationDeg: { x: 0, y: 0, z: 0 },
					scale: { x: 1, y: 1, z: 1 },
					material: 0,
					color: { r: 1, g: 1, b: 1, a: 1 },
				},
			],
		};
		const mesh = oakMToMeshData(cone, { meshQuality: 0 });
		const triangleCount = mesh.normals.length / 9;

		for (let triangle = 0; triangle < triangleCount; triangle += 1) {
			const offset = triangle * 9;
			const n0x = mesh.normals[offset + 0];
			const n0y = mesh.normals[offset + 1];
			const n0z = mesh.normals[offset + 2];
			const n1x = mesh.normals[offset + 3];
			const n1y = mesh.normals[offset + 4];
			const n1z = mesh.normals[offset + 5];
			const n2x = mesh.normals[offset + 6];
			const n2y = mesh.normals[offset + 7];
			const n2z = mesh.normals[offset + 8];
			const isFlat =
				n0x === n1x &&
				n0y === n1y &&
				n0z === n1z &&
				n0x === n2x &&
				n0y === n2y &&
				n0z === n2z;

			if (triangle % 2 === 0) {
				expect(isFlat).toBe(false);
				expect(n0z).toBeGreaterThan(-0.95);
			} else {
				expect(isFlat).toBe(true);
				expect(Math.abs(n0z)).toBeGreaterThan(0.95);
			}
		}
	});
});
