import * as THREE from 'three';
import type { Vector2 } from 'three';

export interface ITriangleCreationInfo {
	pinConnected: number;
	withTriangleId: string;
	inTrianglePin: number;
}

export class Triangle extends THREE.Mesh {
	triId: string;
	shape: THREE.Shape;
	vec1: Vector2;
	vec2: Vector2;
	vec3: Vector2;
	border: THREE.LineLoop | null = null;
	color: string;
	size: number;

	triangleCreationInfo: ITriangleCreationInfo = {
		pinConnected: 0,
		withTriangleId: '',
		inTrianglePin: 0
	};

	constructor(
		triID: string,
		p1: Vector2,
		p2: Vector2,
		p3: Vector2,
		size: number,
		color = '#a4a0a0',
		percent = 0.1,
		scale = 0.95
	) {
		super();
		this.triId = triID;
		this.vec1 = p1;
		this.vec2 = p2;
		this.vec3 = p3;
		this.color = color;
		this.size = size;

		const center = new THREE.Vector2((p1.x + p2.x + p3.x) / 3, (p1.y + p2.y + p3.y) / 3);

		scale = scale + Math.min(size / 100, 0.4);

		const newP1 = new THREE.Vector2(p1.x, p1.y).lerp(center, 1 - scale);
		const newP2 = new THREE.Vector2(p2.x, p2.y).lerp(center, 1 - scale);
		const newP3 = new THREE.Vector2(p3.x, p3.y).lerp(center, 1 - scale);

		this.shape = new THREE.Shape();

		const q1 = new THREE.Vector2().lerpVectors(newP1, newP2, percent);
		const q2 = new THREE.Vector2().lerpVectors(newP2, newP1, percent);
		const q3 = new THREE.Vector2().lerpVectors(newP2, newP3, percent);
		const q4 = new THREE.Vector2().lerpVectors(newP3, newP2, percent);
		const q5 = new THREE.Vector2().lerpVectors(newP3, newP1, percent);
		const q6 = new THREE.Vector2().lerpVectors(newP1, newP3, percent);

		this.shape.moveTo(q1.x, q1.y);
		this.shape.lineTo(q2.x, q2.y);
		this.shape.quadraticCurveTo(newP2.x, newP2.y, q3.x, q3.y);
		this.shape.lineTo(q4.x, q4.y);
		this.shape.quadraticCurveTo(newP3.x, newP3.y, q5.x, q5.y);
		this.shape.lineTo(q6.x, q6.y);
		this.shape.quadraticCurveTo(newP1.x, newP1.y, q1.x, q1.y);

		// Fill parents fields
		super.geometry = new THREE.ShapeGeometry(this.shape);
		super.material = new THREE.MeshBasicMaterial({
			color: color,
			side: THREE.DoubleSide
		});

		// const cc = this.triId === '1' ? 'red' : 'green';
		// //add a circle on vec1
		// const circle = new THREE.CircleGeometry(0.05);
		// const circleMesh = new THREE.Mesh(circle, new THREE.MeshBasicMaterial({ color: cc }));
		// circleMesh.position.set(p1.x, p1.y, 0.1);
		// this.add(circleMesh);
		//
		// //add square on vec2
		// const square = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		// const squareMesh = new THREE.Mesh(square, new THREE.MeshBasicMaterial({ color: cc }));
		// squareMesh.position.set(p2.x, p2.y, 0.1);
		// this.add(squareMesh);

		super.updateMorphTargets();
	}

	setUnlight(unlight: boolean) {
		if (unlight) {
			this.border = new THREE.LineLoop(
				new THREE.BufferGeometry().setFromPoints([this.vec1, this.vec2, this.vec3, this.vec1]),
				new THREE.LineBasicMaterial({ color: 0xff0000 })
			);

			this.border.position.set(0, 0, 0.1);
			this.add(this.border);
		} else {
			if (this.border) {
				this.remove(this.border);
				this.border = null;
			}
		}
	}

	exists(triangleList: Triangle[], threshold = 0.01) {
		for (const triangle of triangleList) {
			if (
				(this.vec1.distanceTo(triangle.vec1) < threshold ||
					this.vec1.distanceTo(triangle.vec2) < threshold ||
					this.vec1.distanceTo(triangle.vec3) < threshold) &&
				(this.vec2.distanceTo(triangle.vec1) < threshold ||
					this.vec2.distanceTo(triangle.vec2) < threshold ||
					this.vec2.distanceTo(triangle.vec3) < threshold) &&
				(this.vec3.distanceTo(triangle.vec1) < threshold ||
					this.vec3.distanceTo(triangle.vec2) < threshold ||
					this.vec3.distanceTo(triangle.vec3) < threshold)
			) {
				return true;
			}
		}

		return false;
	}

	isConnected(triangle: Triangle, threshold = 0.01) {
		if (
			(this.vec1.distanceTo(triangle.vec1) < threshold ||
				this.vec1.distanceTo(triangle.vec2) < threshold ||
				this.vec1.distanceTo(triangle.vec3) < threshold) &&
			(this.vec2.distanceTo(triangle.vec1) < threshold ||
				this.vec2.distanceTo(triangle.vec2) < threshold ||
				this.vec2.distanceTo(triangle.vec3) < threshold)
		) {
			return 1;
		}

		if (
			(this.vec2.distanceTo(triangle.vec1) < threshold ||
				this.vec2.distanceTo(triangle.vec2) < threshold ||
				this.vec2.distanceTo(triangle.vec3) < threshold) &&
			(this.vec3.distanceTo(triangle.vec1) < threshold ||
				this.vec3.distanceTo(triangle.vec2) < threshold ||
				this.vec3.distanceTo(triangle.vec3) < threshold)
		) {
			return 2;
		}

		if (
			(this.vec3.distanceTo(triangle.vec1) < threshold ||
				this.vec3.distanceTo(triangle.vec2) < threshold ||
				this.vec3.distanceTo(triangle.vec3) < threshold) &&
			(this.vec1.distanceTo(triangle.vec1) < threshold ||
				this.vec1.distanceTo(triangle.vec2) < threshold ||
				this.vec1.distanceTo(triangle.vec3) < threshold)
		) {
			return 3;
		}

		return -1;
	}

	getPin(pin: number) {
		let segment, vecA, vecB, vecC;

		// Determine which of the 3 sides of the triangle the pin belongs to
		if (pin <= this.size) {
			vecA = this.vec1;
			vecB = this.vec2;
			vecC = this.vec3;
			segment = pin - 1;
		} else if (pin <= 2 * this.size) {
			vecA = this.vec2;
			vecB = this.vec3;
			vecC = this.vec1;
			segment = pin - this.size - 1;
		} else {
			vecA = this.vec3;
			vecB = this.vec1;
			vecC = this.vec2;
			segment = pin - 2 * this.size - 1;
		}

		// Compute the offset along the side where the pin is
		const offset = segment / this.size;

		// Compute the two vectors at the pin location and return them with the opposite vector
		const pinVec1 = new THREE.Vector2().lerpVectors(vecA, vecB, offset);
		const pinVec2 = new THREE.Vector2().lerpVectors(vecA, vecB, (segment + 1) / this.size);
		return [pinVec1, pinVec2, vecC];
	}

	public containsPoint(point: THREE.Vector2): boolean {
		const v0 = new THREE.Vector2().subVectors(this.vec3, this.vec1);
		const v1 = new THREE.Vector2().subVectors(this.vec2, this.vec1);
		const v2 = new THREE.Vector2().subVectors(point, this.vec1);

		const dot00 = v0.dot(v0);
		const dot01 = v0.dot(v1);
		const dot02 = v0.dot(v2);
		const dot11 = v1.dot(v1);
		const dot12 = v1.dot(v2);

		const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
		const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

		// Vérifiez si le point est dans le triangle
		return u >= 0 && v >= 0 && u + v < 1;
	}

	public intersects(other: Triangle): boolean {
		const p1 = other.vec1;
		const p2 = other.vec2;
		const p3 = other.vec3;

		const center = new THREE.Vector2((p1.x + p2.x + p3.x) / 3, (p1.y + p2.y + p3.y) / 3);

		const newP1 = new THREE.Vector2(p1.x, p1.y).lerp(center, 1 - 0.95);
		const newP2 = new THREE.Vector2(p2.x, p2.y).lerp(center, 1 - 0.95);
		const newP3 = new THREE.Vector2(p3.x, p3.y).lerp(center, 1 - 0.95);

		if (this.containsPoint(newP1) || this.containsPoint(newP2) || this.containsPoint(newP3)) {
			return true;
		}

		// Vérifiez l'intersection des lignes des triangles
		const lines1 = [
			[this.vec1, this.vec2],
			[this.vec2, this.vec3],
			[this.vec3, this.vec1]
		];
		const lines2 = [
			[newP1, newP2],
			[newP2, newP3],
			[newP3, newP1]
		];

		for (const line1 of lines1) {
			for (const line2 of lines2) {
				if (linesIntersect(line1[0], line1[1], line2[0], line2[1])) {
					return true;
				}
			}
		}

		return false;
	}
}

function linesIntersect(
	a1: THREE.Vector2,
	a2: THREE.Vector2,
	b1: THREE.Vector2,
	b2: THREE.Vector2
): boolean {
	const denominator = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

	// Les lignes sont parallèles
	if (denominator === 0) return false;

	const numerator1 = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
	const numerator2 = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
	const r = numerator1 / denominator;
	const s = numerator2 / denominator;

	// Les lignes se croisent
	return r >= 0 && r <= 1 && s >= 0 && s <= 1;
}
