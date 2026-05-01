import { Vec3, Vec3Like } from "./Vec3";
import { Quat4, Quat4Like } from "./Quat4";

export type OakMPrimitiveType =
	| "plane"
	| "cone"
	| "cube"
	| "octahedron"
	| "cylinder"
	| "sphere"
	| "icosphere";

export interface OakMColor {
	r: number;
	g: number;
	b: number;
	a: number;
}

export interface OakMPrimitive {
	id: string;
	name: string;
	type: OakMPrimitiveType;
	position: Vec3Like;
	rotationDeg: Vec3Like;
	rotationQuat?: Quat4Like;
	scale: Vec3Like;
	material: number;
	color: OakMColor;
}

export interface OakMDocument {
	name?: string;
	primitives: OakMPrimitive[];
}

export interface OakMMeshData {
	positions: Float32Array;
	normals: Float32Array;
	colors: Float32Array;
	materials: Float32Array;
	indices: Uint16Array;
}

export interface OakMMeshBuildOptions {
	meshQuality?: 0 | 1;
}

interface Triangle {
	a: Vec3;
	b: Vec3;
	c: Vec3;
	surface?: "flat" | "smooth";
}

const DEFAULT_COLOR: OakMColor = { r: 1, g: 1, b: 1, a: 1 };

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const uid = (prefix = "oakm"): string =>
	`${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const primitiveQuat = (primitive: OakMPrimitive): Quat4 => {
	if (primitive.rotationQuat) {
		return new Quat4().copy(primitive.rotationQuat).normalize();
	}
	return Quat4.fromEulerDeg(
		primitive.rotationDeg.x,
		primitive.rotationDeg.y,
		primitive.rotationDeg.z,
	);
};

const transformPoint = (
	point: Vec3,
	primitive: OakMPrimitive,
	rotation: Quat4,
): Vec3 => {
	const scaled = point.clone().mul(primitive.scale);
	const rotated = Quat4.rotateVec3(rotation, scaled);
	return rotated.add(primitive.position);
};

const triNormal = (triangle: Triangle): Vec3 => {
	const edge1 = triangle.b.clone().sub(triangle.a);
	const edge2 = triangle.c.clone().sub(triangle.a);
	return edge1.cross(edge2).normalize();
};

const transformNormal = (
	localNormal: Vec3,
	primitive: OakMPrimitive,
	rotation: Quat4,
): Vec3 => {
	const sx = Math.abs(primitive.scale.x) > 1e-8 ? primitive.scale.x : 1;
	const sy = Math.abs(primitive.scale.y) > 1e-8 ? primitive.scale.y : 1;
	const sz = Math.abs(primitive.scale.z) > 1e-8 ? primitive.scale.z : 1;
	const transformed = new Vec3().set(
		localNormal.x / sx,
		localNormal.y / sy,
		localNormal.z / sz,
	);
	return Quat4.rotateVec3(rotation, transformed).normalize();
};

const radialNormal = (
	localVertex: Vec3,
	fallbackA: Vec3,
	fallbackB: Vec3,
): Vec3 => {
	let x = localVertex.x;
	let y = localVertex.y;
	if (Math.hypot(x, y) < 1e-6) {
		x = 0.5 * (fallbackA.x + fallbackB.x);
		y = 0.5 * (fallbackA.y + fallbackB.y);
	}
	const normal = new Vec3().set(x, y, 0);
	if (normal.mag() < 1e-6) {
		return new Vec3().set(0, 1, 0);
	}
	return normal.normalize();
};

const smoothLocalNormal = (
	primitiveType: OakMPrimitiveType,
	localVertex: Vec3,
	triangle: Triangle,
): Vec3 => {
	switch (primitiveType) {
		case "sphere":
		case "icosphere":
			return localVertex.clone().normalize();
		case "cylinder":
			return radialNormal(localVertex, triangle.a, triangle.b);
		case "cone": {
			const radial = radialNormal(localVertex, triangle.b, triangle.c);
			const coneRadius = 0.5;
			const coneHeight = 0.65 - -0.5;
			const zSlope = coneRadius / coneHeight;
			return new Vec3().set(radial.x, radial.y, zSlope).normalize();
		}
		default:
			return localVertex.clone().normalize();
	}
};

const cubeTriangles = (): Triangle[] => {
	const vertices = [
		new Vec3().set(-0.5, -0.5, 0.5),
		new Vec3().set(0.5, -0.5, 0.5),
		new Vec3().set(0.5, 0.5, 0.5),
		new Vec3().set(-0.5, 0.5, 0.5),
		new Vec3().set(-0.5, -0.5, -0.5),
		new Vec3().set(0.5, -0.5, -0.5),
		new Vec3().set(0.5, 0.5, -0.5),
		new Vec3().set(-0.5, 0.5, -0.5),
	];
	const faces = [
		[0, 1, 2],
		[0, 2, 3],
		[1, 5, 6],
		[1, 6, 2],
		[5, 4, 7],
		[5, 7, 6],
		[4, 0, 3],
		[4, 3, 7],
		[3, 2, 6],
		[3, 6, 7],
		[4, 5, 1],
		[4, 1, 0],
	] as const;

	return faces.map(([a, b, c]) => ({
		a: vertices[a].clone(),
		b: vertices[b].clone(),
		c: vertices[c].clone(),
	}));
};

const planeTriangles = (): Triangle[] => [
	{
		a: new Vec3().set(-0.5, -0.5, 0),
		b: new Vec3().set(0.5, -0.5, 0),
		c: new Vec3().set(0.5, 0.5, 0),
	},
	{
		a: new Vec3().set(-0.5, -0.5, 0),
		b: new Vec3().set(0.5, 0.5, 0),
		c: new Vec3().set(-0.5, 0.5, 0),
	},
];

const octahedronTriangles = (): Triangle[] => {
	const top = new Vec3().set(0, 0, 0.6);
	const bottom = new Vec3().set(0, 0, -0.6);
	const ring = [
		new Vec3().set(-0.6, 0, 0),
		new Vec3().set(0, -0.6, 0),
		new Vec3().set(0.6, 0, 0),
		new Vec3().set(0, 0.6, 0),
	];
	return [
		{ a: top.clone(), b: ring[0].clone(), c: ring[1].clone() },
		{ a: top.clone(), b: ring[1].clone(), c: ring[2].clone() },
		{ a: top.clone(), b: ring[2].clone(), c: ring[3].clone() },
		{ a: top.clone(), b: ring[3].clone(), c: ring[0].clone() },
		{ a: bottom.clone(), b: ring[1].clone(), c: ring[0].clone() },
		{ a: bottom.clone(), b: ring[2].clone(), c: ring[1].clone() },
		{ a: bottom.clone(), b: ring[3].clone(), c: ring[2].clone() },
		{ a: bottom.clone(), b: ring[0].clone(), c: ring[3].clone() },
	];
};

const cylinderTriangles = (segments = 12): Triangle[] => {
	const triangles: Triangle[] = [];
	for (let i = 0; i < segments; i++) {
		const a0 = (i / segments) * Math.PI * 2;
		const a1 = ((i + 1) / segments) * Math.PI * 2;
		const p0 = new Vec3().set(Math.cos(a0) * 0.5, Math.sin(a0) * 0.5, -0.5);
		const p1 = new Vec3().set(Math.cos(a1) * 0.5, Math.sin(a1) * 0.5, -0.5);
		const p2 = new Vec3().set(Math.cos(a0) * 0.5, Math.sin(a0) * 0.5, 0.5);
		const p3 = new Vec3().set(Math.cos(a1) * 0.5, Math.sin(a1) * 0.5, 0.5);
		triangles.push(
			{ a: p0, b: p1, c: p2, surface: "smooth" },
			{ a: p2.clone(), b: p1.clone(), c: p3, surface: "smooth" },
		);
		triangles.push({
			a: new Vec3().set(0, 0, -0.5),
			b: p1.clone(),
			c: p0.clone(),
			surface: "flat",
		});
		triangles.push({
			a: new Vec3().set(0, 0, 0.5),
			b: p2.clone(),
			c: p3.clone(),
			surface: "flat",
		});
	}
	return triangles;
};

const coneTriangles = (segments = 12): Triangle[] => {
	const triangles: Triangle[] = [];
	const tip = new Vec3().set(0, 0, 0.65);
	for (let i = 0; i < segments; i++) {
		const a0 = (i / segments) * Math.PI * 2;
		const a1 = ((i + 1) / segments) * Math.PI * 2;
		const p0 = new Vec3().set(Math.cos(a0) * 0.5, Math.sin(a0) * 0.5, -0.5);
		const p1 = new Vec3().set(Math.cos(a1) * 0.5, Math.sin(a1) * 0.5, -0.5);
		triangles.push({ a: tip.clone(), b: p0, c: p1, surface: "smooth" });
		triangles.push({
			a: new Vec3().set(0, 0, -0.5),
			b: p1.clone(),
			c: p0.clone(),
			surface: "flat",
		});
	}
	return triangles;
};

const sphereTriangles = (segments = 8, rings = 8): Triangle[] => {
	const triangles: Triangle[] = [];
	for (let y = 0; y < rings; y++) {
		const v0 = y / rings;
		const v1 = (y + 1) / rings;
		const lat0 = v0 * Math.PI - Math.PI / 2;
		const lat1 = v1 * Math.PI - Math.PI / 2;

		for (let x = 0; x < segments; x++) {
			const u0 = x / segments;
			const u1 = (x + 1) / segments;
			const lon0 = u0 * Math.PI * 2;
			const lon1 = u1 * Math.PI * 2;

			const p00 = new Vec3().set(
				Math.cos(lat0) * Math.cos(lon0) * 0.5,
				Math.cos(lat0) * Math.sin(lon0) * 0.5,
				Math.sin(lat0) * 0.5,
			);
			const p10 = new Vec3().set(
				Math.cos(lat0) * Math.cos(lon1) * 0.5,
				Math.cos(lat0) * Math.sin(lon1) * 0.5,
				Math.sin(lat0) * 0.5,
			);
			const p01 = new Vec3().set(
				Math.cos(lat1) * Math.cos(lon0) * 0.5,
				Math.cos(lat1) * Math.sin(lon0) * 0.5,
				Math.sin(lat1) * 0.5,
			);
			const p11 = new Vec3().set(
				Math.cos(lat1) * Math.cos(lon1) * 0.5,
				Math.cos(lat1) * Math.sin(lon1) * 0.5,
				Math.sin(lat1) * 0.5,
			);

			triangles.push(
				{ a: p00, b: p10, c: p01, surface: "smooth" },
				{ a: p01.clone(), b: p10.clone(), c: p11, surface: "smooth" },
			);
		}
	}
	return triangles;
};

const primitiveTriangles = (
	type: OakMPrimitiveType,
	options?: OakMMeshBuildOptions,
): Triangle[] => {
	const quality = options?.meshQuality ?? 1;
	const highQuality = quality >= 1;
	switch (type) {
		case "plane":
			return planeTriangles();
		case "cone":
			return coneTriangles(highQuality ? 16 : 8);
		case "cube":
			return cubeTriangles();
		case "octahedron":
			return octahedronTriangles();
		case "cylinder":
			return cylinderTriangles(highQuality ? 16 : 8);
		case "sphere":
		case "icosphere":
			return sphereTriangles(highQuality ? 20 : 8, highQuality ? 20 : 8);
		default:
			return cubeTriangles();
	}
};

const parseQuoted = (value: string): string => {
	const trimmed = value.trim();
	if (!trimmed.startsWith('"')) return trimmed;
	const end = trimmed.indexOf('"', 1);
	if (end < 1) return trimmed;
	return trimmed.slice(1, end);
};

const parsePrimitiveLine = (
	line: string,
	index: number,
): OakMPrimitive | null => {
	const [typeToken] = line.split(" ");
	const type = typeToken.toLowerCase() as OakMPrimitiveType;
	const supportedTypes: OakMPrimitiveType[] = [
		"plane",
		"cone",
		"cube",
		"octahedron",
		"cylinder",
		"sphere",
		"icosphere",
	];
	if (!supportedTypes.includes(type)) {
		return null;
	}

	const nameMatch = line.match(/"([^"]+)"/);
	if (!nameMatch) return null;

	const afterName = line
		.slice((nameMatch.index ?? 0) + nameMatch[0].length)
		.trim();
	const values = afterName.split(/\s+/).map((entry) => Number(entry));
	if (values.length < 14) return null;

	return {
		id: uid(`primitive_${index}`),
		name: parseQuoted(nameMatch[0]),
		type,
		position: { x: values[0], y: values[1], z: values[2] },
		rotationDeg: { x: values[3], y: values[4], z: values[5] },
		scale: { x: values[6], y: values[7], z: values[8] },
		material: Math.max(0, Math.floor(values[9] ?? 0)),
		color: {
			r: clamp01(values[10] ?? 1),
			g: clamp01(values[11] ?? 1),
			b: clamp01(values[12] ?? 1),
			a: clamp01(values[13] ?? 1),
		},
	};
};

export const parseOakM = (source: string): OakMDocument => {
	const lines = source
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.filter((line) => !line.startsWith("#") && !line.startsWith("comment"));

	const primitives: OakMPrimitive[] = [];
	lines.forEach((line, index) => {
		if (
			line === "oakm" ||
			line.startsWith("format") ||
			line.startsWith("primitive property")
		) {
			return;
		}
		const primitive = parsePrimitiveLine(line, index);
		if (primitive) primitives.push(primitive);
	});

	return { primitives };
};

export const createOakMCube = (
	name = "cube",
	override?: Partial<OakMPrimitive>,
): OakMDocument => {
	const cube: OakMPrimitive = {
		id: uid("primitive"),
		name,
		type: "cube",
		position: { x: 0, y: 0, z: 0 },
		rotationDeg: { x: 0, y: 0, z: 0 },
		scale: { x: 1, y: 1, z: 1 },
		material: 0,
		color: DEFAULT_COLOR,
		...override,
	};

	return {
		name,
		primitives: [cube],
	};
};

export const oakMToMeshData = (
	document: OakMDocument,
	options?: OakMMeshBuildOptions,
): OakMMeshData => {
	const positions: number[] = [];
	const normals: number[] = [];
	const colors: number[] = [];
	const materials: number[] = [];
	const indices: number[] = [];

	let vertexIndex = 0;
	for (const primitive of document.primitives) {
		const rotation = primitiveQuat(primitive);
		const triangles = primitiveTriangles(primitive.type, options);
		for (const triangle of triangles) {
			const transformed = {
				a: transformPoint(triangle.a, primitive, rotation),
				b: transformPoint(triangle.b, primitive, rotation),
				c: transformPoint(triangle.c, primitive, rotation),
			};
			const normal = triNormal(transformed);
			const color = primitive.color || DEFAULT_COLOR;
			const vertexPairs: Array<[Vec3, Vec3]> = [
				[triangle.a, transformed.a],
				[triangle.b, transformed.b],
				[triangle.c, transformed.c],
			];

			for (const [localVertex, worldVertex] of vertexPairs) {
				const localNormal =
					triangle.surface === "smooth"
						? smoothLocalNormal(primitive.type, localVertex, triangle)
						: normal;
				const vertexNormal =
					triangle.surface === "smooth"
						? transformNormal(localNormal, primitive, rotation)
						: normal;
				positions.push(worldVertex.x, worldVertex.y, worldVertex.z);
				normals.push(vertexNormal.x, vertexNormal.y, vertexNormal.z);
				colors.push(color.r, color.g, color.b, color.a);
				materials.push(primitive.material);
				indices.push(vertexIndex);
				vertexIndex += 1;
			}
		}
	}

	return {
		positions: new Float32Array(positions),
		normals: new Float32Array(normals),
		colors: new Float32Array(colors),
		materials: new Float32Array(materials),
		indices: new Uint16Array(indices),
	};
};
