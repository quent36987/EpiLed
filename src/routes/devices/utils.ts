import * as THREE from 'three';
import type { Vector2 } from 'three';
import { Triangle } from '$lib/mesh/triangle';
import type { IDevice } from '../../interfaces/interfaces';

export function findVectorTriangle(vec1: Vector2, vec2: Vector2, vecOpose: Vector2) {
	const direction = new THREE.Vector2().subVectors(vec2, vec1).normalize();

	const sin60 = Math.sqrt(3) / 2;
	const cos60 = 0.5;
	const rotatedDirection = new THREE.Vector2(
		direction.x * cos60 - direction.y * sin60,
		direction.x * sin60 + direction.y * cos60
	);

	const sideLength = vec1.distanceTo(vec2);

	const vec3a = new THREE.Vector2().addVectors(
		vec1,
		rotatedDirection.clone().multiplyScalar(sideLength)
	);

	rotatedDirection.set(
		direction.x * cos60 + direction.y * sin60,
		-direction.x * sin60 + direction.y * cos60
	);

	const vec3b = new THREE.Vector2().addVectors(
		vec1,
		rotatedDirection.clone().multiplyScalar(sideLength)
	);

	// return the vector that is not closest to vecOpose
	return vecOpose.distanceTo(vec3a) < vecOpose.distanceTo(vec3b) ? vec3b : vec3a;
}

export function givemepin(triangle: Triangle, pin: number) {
	switch (pin) {
		case 1:
			return [triangle.vec1, triangle.vec2, triangle.vec3];
		case 2:
			return [triangle.vec2, triangle.vec3, triangle.vec1];
		case 3:
			return [triangle.vec3, triangle.vec1, triangle.vec2];
		default:
			return [triangle.vec1, triangle.vec2, triangle.vec3];
	}
}

export function rec(devices: IDevice[], triangles: Triangle[], device: IDevice) {
	for (const dev of device.connected) {
		const results = triangles.filter((x) => x.triId === dev.id);

		if (results.length === 0) {
			const parent = triangles.filter((x) => x.triId === device.id)[0];
			const pin = givemepin(parent, dev.pin);

			const vec3 = findVectorTriangle(pin[0], pin[1], pin[2]);

			// FIXME need to look  order of three vector with the devices[]

			const pin2 = devices
				.filter((x) => x.id === dev.id)[0]
				.connected.filter((x) => x.id === device.id)[0].pin;

			let vecs = [pin[0], pin[1], vec3];

			switch (pin2) {
				case 3:
					vecs = [vec3, pin[0], pin[1]];
					break;
				case 1:
					vecs = [pin[0], pin[1], vec3];
					break;
				case 2:
					vecs = [pin[1], vec3, pin[0]];
					break;
			}

			const triangle = new Triangle(dev.id, vecs[1], vecs[0], vecs[2]);
			triangles.push(triangle);

			const new_device = devices.filter((x) => x.id === dev.id)[0];
			if (new_device) rec(devices, triangles, new_device);
		}
	}
}



