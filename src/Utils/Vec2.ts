export interface Vec2Like {
	x: number;
	y: number;
}

export class Vec2 implements Vec2Like {
	x = 0;
	y = 0;

	static from(value: Vec2Like): Vec2 {
		return new Vec2().copy(value);
	}

	set(x: number, y: number): Vec2 {
		this.x = x;
		this.y = y;
		return this;
	}

	copy(value: Vec2Like): Vec2 {
		this.x = value.x;
		this.y = value.y;
		return this;
	}

	clone(): Vec2 {
		return new Vec2().set(this.x, this.y);
	}

	add(value: Vec2Like): Vec2 {
		this.x += value.x;
		this.y += value.y;
		return this;
	}

	sub(value: Vec2Like): Vec2 {
		this.x -= value.x;
		this.y -= value.y;
		return this;
	}

	mulI(n: number): Vec2 {
		this.x *= n;
		this.y *= n;
		return this;
	}

	mag(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize(): Vec2 {
		const magnitude = this.mag() || 1;
		this.x /= magnitude;
		this.y /= magnitude;
		return this;
	}

	toDeg(): number {
		const normalized = this.clone().normalize();
		return (
			((Math.atan2(normalized.x, normalized.y + 0.0000001) / Math.PI) * 180 +
				180) %
			360
		);
	}

	toRad(): number {
		const normalized = this.clone().normalize();
		return Math.atan2(normalized.x, normalized.y + 0.0000001);
	}
}
