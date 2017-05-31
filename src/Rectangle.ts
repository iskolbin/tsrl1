export class Rectangle {
	constructor(
		public x: number,
		public y: number,
		public w: number,
		public h: number
	) {
	}

	get x0() { return this.x }
	get x1() { return this.x + this.w }
	get y0() { return this.y }
	get y1() { return this.y + this.h }

	center(): [number,number] {
		return [this.centerX(), this.centerY()]
	}
	
	centerX() {
		return Math.floor(( this.x + this.x + this.w ) / 2)
	}

	centerY() {
		return Math.floor(( this.y + this.y + this.h ) / 2)
	}

	intersect( other: Rectangle ) {
		return this.x0 <= other.x1
			&& this.x1 >= other.x0
			&& this.y0 <= other.y1
			&& this.y1 >= other.y1
	}
}
