import { Vec3, Vec3Like } from "./Vec3";

export interface Quat4Like {
	x: number;
	y: number;
	z: number;
	w: number;
}

export class Quat4 implements Quat4Like {
	x = 0;
	y = 0;
	z = 0;
	w = 1;

	static identity(): Quat4 {
		return new Quat4();
	}

	static fromEulerRad(
		x: number,
		y: number,
		z: number,
		out: Quat4 = new Quat4(),
	): Quat4 {
		const halfX = x * 0.5;
		const halfY = y * 0.5;
		const halfZ = z * 0.5;
		const sx = Math.sin(halfX);
		const cx = Math.cos(halfX);
		const sy = Math.sin(halfY);
		const cy = Math.cos(halfY);
		const sz = Math.sin(halfZ);
		const cz = Math.cos(halfZ);

		// q = qx * qy * qz (equivalent to X -> Y -> Z composition used in OakM/GL)
		out.x = sx * cy * cz + cx * sy * sz;
		out.y = cx * sy * cz - sx * cy * sz;
		out.z = cx * cy * sz + sx * sy * cz;
		out.w = cx * cy * cz - sx * sy * sz;
		return out.normalize();
	}

	static fromEulerDeg(
		xDegrees: number,
		yDegrees: number,
		zDegrees: number,
		out: Quat4 = new Quat4(),
	): Quat4 {
		const radians = Math.PI / 180;
		return Quat4.fromEulerRad(
			xDegrees * radians,
			yDegrees * radians,
			zDegrees * radians,
			out,
		);
	}

	static fromAxisAngle(
		axis: Vec3Like,
		angleRad: number,
		out: Quat4 = new Quat4(),
	): Quat4 {
		const length = Math.hypot(axis.x, axis.y, axis.z) || 1;
		const nx = axis.x / length;
		const ny = axis.y / length;
		const nz = axis.z / length;
		const halfAngle = angleRad * 0.5;
		const s = Math.sin(halfAngle);
		out.x = nx * s;
		out.y = ny * s;
		out.z = nz * s;
		out.w = Math.cos(halfAngle);
		return out.normalize();
	}

	static multiply(
		left: Quat4Like,
		right: Quat4Like,
		out: Quat4 = new Quat4(),
	): Quat4 {
		const lx = left.x;
		const ly = left.y;
		const lz = left.z;
		const lw = left.w;
		const rx = right.x;
		const ry = right.y;
		const rz = right.z;
		const rw = right.w;
		out.x = lw * rx + lx * rw + ly * rz - lz * ry;
		out.y = lw * ry - lx * rz + ly * rw + lz * rx;
		out.z = lw * rz + lx * ry - ly * rx + lz * rw;
		out.w = lw * rw - lx * rx - ly * ry - lz * rz;
		return out;
	}

	static rotateVec3(
		quat: Quat4Like,
		vector: Vec3Like,
		out: Vec3 = new Vec3(),
	): Vec3 {
		const x = vector.x;
		const y = vector.y;
		const z = vector.z;
		const qx = quat.x;
		const qy = quat.y;
		const qz = quat.z;
		const qw = quat.w;

		const tx = 2 * (qy * z - qz * y);
		const ty = 2 * (qz * x - qx * z);
		const tz = 2 * (qx * y - qy * x);

		out.x = x + qw * tx + (qy * tz - qz * ty);
		out.y = y + qw * ty + (qz * tx - qx * tz);
		out.z = z + qw * tz + (qx * ty - qy * tx);
		return out;
	}

	set(x: number, y: number, z: number, w: number): Quat4 {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	copy(value: Quat4Like): Quat4 {
		return this.set(value.x, value.y, value.z, value.w);
	}

	clone(): Quat4 {
		return new Quat4().copy(this);
	}

	normalize(): Quat4 {
		const length = Math.hypot(this.x, this.y, this.z, this.w);
		if (length <= 1e-12) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;
			return this;
		}
		const inverse = 1 / length;
		this.x *= inverse;
		this.y *= inverse;
		this.z *= inverse;
		this.w *= inverse;
		return this;
	}
}
