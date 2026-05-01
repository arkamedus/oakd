export interface Vec3Like {
	x: number;
	y: number;
	z: number;
}

let vec3Temp = 0;
const vec3TempVector = { x: 0, y: 0, z: 0 };

export class Vec3 implements Vec3Like {
	x = 0;
	y = 0;
	z = 0;

	static identity(): Vec3 {
		return new Vec3().set(1, 1, 1);
	}

	static from(value: Vec3Like): Vec3 {
		return new Vec3().copy(value);
	}

	static fromValues(x: number, y: number, z: number): Vec3 {
		return new Vec3().set(x, y, z);
	}

	static fromArray(value: [number, number, number]): Vec3 {
		return new Vec3().set(value[0], value[1], value[2]);
	}

	set(x: number, y: number, z: number): Vec3 {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	copy(value: Vec3Like): Vec3 {
		this.x = value.x;
		this.y = value.y;
		this.z = value.z;
		return this;
	}

	clone(): Vec3 {
		return new Vec3().set(this.x, this.y, this.z);
	}

	add(value: Vec3Like): Vec3 {
		this.x += value.x;
		this.y += value.y;
		this.z += value.z;
		return this;
	}

	sub(value: Vec3Like): Vec3 {
		this.x -= value.x;
		this.y -= value.y;
		this.z -= value.z;
		return this;
	}

	mul(value: Vec3Like): Vec3 {
		this.x *= value.x;
		this.y *= value.y;
		this.z *= value.z;
		return this;
	}

	div(value: Vec3Like): Vec3 {
		this.x /= value.x;
		this.y /= value.y;
		this.z /= value.z;
		return this;
	}

	mulI(n: number): Vec3 {
		this.x *= n;
		this.y *= n;
		this.z *= n;
		return this;
	}

	divI(n: number): Vec3 {
		this.x /= n;
		this.y /= n;
		this.z /= n;
		return this;
	}

	dot(value: Vec3Like): number {
		return this.x * value.x + this.y * value.y + this.z * value.z;
	}

	cross(value: Vec3Like): Vec3 {
		return new Vec3().set(
			this.y * value.z - this.z * value.y,
			this.z * value.x - this.x * value.z,
			this.x * value.y - this.y * value.x,
		);
	}

	rotX(rad: number): Vec3 {
		vec3TempVector.y = this.y * Math.cos(rad) - this.z * Math.sin(rad);
		vec3TempVector.z = this.y * Math.sin(rad) + this.z * Math.cos(rad);
		this.y = vec3TempVector.y;
		this.z = vec3TempVector.z;
		return this;
	}

	rotY(rad: number): Vec3 {
		vec3TempVector.x = this.x * Math.cos(rad) - this.z * Math.sin(rad);
		vec3TempVector.z = this.x * Math.sin(rad) + this.z * Math.cos(rad);
		this.x = vec3TempVector.x;
		this.z = vec3TempVector.z;
		return this;
	}

	rotZ(rad: number): Vec3 {
		vec3TempVector.x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
		vec3TempVector.y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
		this.x = vec3TempVector.x;
		this.y = vec3TempVector.y;
		return this;
	}

	invert(): Vec3 {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this;
	}

	normalize(): Vec3 {
		vec3Temp = this.mag() + 0.0000000000001;
		this.x /= vec3Temp;
		this.y /= vec3Temp;
		this.z /= vec3Temp;
		return this;
	}

	mag(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	dist(value: Vec3Like): number {
		return Math.sqrt(
			(this.x - value.x) * (this.x - value.x) +
				(this.y - value.y) * (this.y - value.y) +
				(this.z - value.z) * (this.z - value.z),
		);
	}

	toArray(): [number, number, number] {
		return [this.x, this.y, this.z];
	}
}
