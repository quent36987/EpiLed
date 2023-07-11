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

	constructor(
		triID: string,
		p1: Vector2,
		p2: Vector2,
		p3: Vector2,
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

	getPin(pin: number) {
		switch (pin) {
			case 1:
				return [this.vec1, this.vec2, this.vec3];
			case 2:
				return [this.vec2, this.vec3, this.vec1];
			case 3:
				return [this.vec3, this.vec1, this.vec2];
			default:
				return [this.vec1, this.vec2, this.vec3];
		}
	}
}
