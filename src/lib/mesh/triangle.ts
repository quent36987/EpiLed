import * as THREE from 'three';
import type { Vector2 } from 'three';

export class Triangle extends THREE.Mesh {
	triId: string;
	shape: THREE.Shape;
	vec1: Vector2;
	vec2: Vector2;
	vec3: Vector2;
	border: THREE.LineLoop | null = null;

	constructor(triID: string, p1: Vector2, p2: Vector2, p3: Vector2) {
		super();
		this.triId = triID;
		this.vec1 = p1;
		this.vec2 = p2;
		this.vec3 = p3;

		this.shape = new THREE.Shape();
		this.shape.moveTo(p1.x, p1.y);
		this.shape.lineTo(p2.x, p2.y);
		this.shape.lineTo(p3.x, p3.y);

		// Fill parents fields
		super.geometry = new THREE.ShapeGeometry(this.shape);

		super.material = new THREE.MeshBasicMaterial({
			color: 'red',
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
