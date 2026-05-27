import { parsePLY, plyToMeshData } from "./PLY";

describe("PLY utilities", () => {
	it("parses vertex properties by header order", () => {
		const ply = parsePLY(`ply
format ascii 1.0
element vertex 3
property uchar red
property float z
property float y
property float x
property uchar blue
property uchar green
property float nx
property float ny
property float nz
property float s
property float t
element face 1
property list uchar int vertex_indices
end_header
255 3 2 1 64 128 0 0 1 0.25 0.75
0 6 5 4 255 0 0 1 0 0.5 0.5
32 9 8 7 16 48 1 0 0 0 1
3 0 1 2`);

		expect(Array.from(ply.positions)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(Array.from(ply.normals)).toEqual([0, 0, 1, 0, 1, 0, 1, 0, 0]);
		expect(Array.from(ply.uvs)).toEqual([0.25, 0.75, 0.5, 0.5, 0, 1]);
		expect(ply.colors[0]).toBeCloseTo(1);
		expect(ply.colors[1]).toBeCloseTo(128 / 255);
		expect(ply.colors[2]).toBeCloseTo(64 / 255);
		expect(ply.colors[3]).toBe(1);
	});

	it("uses defaults for missing optional vertex fields", () => {
		const ply = parsePLY(`ply
format ascii 1.0
element vertex 1
property float x
property float y
property float z
element face 0
property list uchar int vertex_indices
end_header
1 2 3`);

		expect(Array.from(ply.positions)).toEqual([1, 2, 3]);
		expect(Array.from(ply.normals)).toEqual([0, 0, 0]);
		expect(Array.from(ply.uvs)).toEqual([0, 0]);
		expect(Array.from(ply.colors)).toEqual([1, 1, 1, 1]);
		expect(Array.from(ply.materials)).toEqual([0]);
	});

	it("triangulates polygon faces", () => {
		const ply = parsePLY(`ply
format ascii 1.0
element vertex 4
property float x
property float y
property float z
element face 1
property list uchar int vertex_indices
end_header
0 0 0
1 0 0
1 1 0
0 1 0
4 0 1 2 3`);

		expect(Array.from(ply.indices)).toEqual([0, 1, 2, 0, 2, 3]);
	});

	it("uses Uint32 indices when parsed indices exceed Uint16 range", () => {
		const vertexLines = Array.from({ length: 65537 }, (_, index) => `${index} 0 0`).join("\n");
		const ply = parsePLY(`ply
format ascii 1.0
element vertex 65537
property float x
property float y
property float z
element face 1
property list uchar int vertex_indices
end_header
${vertexLines}
3 0 65536 1`);

		expect(ply.indices).toBeInstanceOf(Uint32Array);
		expect(Array.from(ply.indices)).toEqual([0, 65536, 1]);
	});

	it("converts PLY data into OakD mesh data", () => {
		const ply = parsePLY(`ply
format ascii 1.0
element vertex 3
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
property uchar alpha
property float material
element face 1
property list uchar int vertex_indices
end_header
0 0 0 255 0 0 255 2
1 0 0 0 255 0 255 2
0 1 0 0 0 255 255 2
3 0 1 2`);
		const mesh = plyToMeshData(ply);

		expect(mesh.positions).toBeInstanceOf(Float32Array);
		expect(mesh.normals).toBeInstanceOf(Float32Array);
		expect(mesh.colors).toBeInstanceOf(Float32Array);
		expect(mesh.materials).toBeInstanceOf(Float32Array);
		expect(Array.from(mesh.materials)).toEqual([2, 2, 2]);
		expect(Array.from(mesh.indices)).toEqual([0, 1, 2]);
	});
});
