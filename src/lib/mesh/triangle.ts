import * as THREE from 'three';
import type { Vector2 } from 'three';

export class Triangle extends THREE.Mesh {
	triId: string;
	shape: THREE.Shape;
	vec1: Vector2;
	vec2: Vector2;
	vec3: Vector2;
	border: THREE.LineLoop | null = null;
	color: string;
	size: number;

	constructor(
		triID: string,
		p1: Vector2,
		p2: Vector2,
		p3: Vector2,
		size: number,
		color = 'red',
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

		const cc = this.triId === '1' ? 'red' : 'green';
		//add a circle on vec1
		const circle = new THREE.CircleGeometry(0.05);
		const circleMesh = new THREE.Mesh(circle, new THREE.MeshBasicMaterial({ color: cc }));
		circleMesh.position.set(p1.x, p1.y, 0.1);
		this.add(circleMesh);

		//add square on vec2
		const square = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		const squareMesh = new THREE.Mesh(square, new THREE.MeshBasicMaterial({ color: cc }));
		squareMesh.position.set(p2.x, p2.y, 0.1);
		this.add(squareMesh);

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
}
