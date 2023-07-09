import * as THREE from 'three';
import { Triangle } from '$lib/mesh/triangle';
import type { IDevice, ILed } from '../../interfaces/interfaces';
import { Vector2 } from 'three';

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

export function _createTriangles(devices: IDevice[], triangles: Triangle[], device: IDevice) {
	for (const dev of device.connected) {
		const hasTriangle= triangles.filter((x) => x.triId === dev.id).length === 0;

		if (hasTriangle) {
			const deviceTriangle = triangles.filter((x) => x.triId === device.id)[0];
			const deviceVecs = deviceTriangle.getPin(dev.pin);

			const vec3 = findVectorTriangle(deviceVecs[0], deviceVecs[1], deviceVecs[2]);
			let newVecs = [deviceVecs[0], deviceVecs[1], vec3];

			const devPin = devices
				.filter((x) => x.id === dev.id)[0]
				.connected.filter((x) => x.id === device.id)[0].pin;

			switch (devPin) {
				case 3:
					newVecs = [vec3, deviceVecs[0], deviceVecs[1]];
					break;
				case 1:
					newVecs = [deviceVecs[0], deviceVecs[1], vec3];
					break;
				case 2:
					newVecs = [deviceVecs[1], vec3, deviceVecs[0]];
					break;
			}

			const triangle = new Triangle(dev.id, newVecs[1], newVecs[0], newVecs[2]);
			triangles.push(triangle);

			const new_device = devices.filter((x) => x.id === dev.id)[0];
			if (new_device) _createTriangles(devices, triangles, new_device);
		}
	}
}

export function createTriangles(devices: IDevice[]) {
	const triangles: Triangle[] = [];

	const firstDevice = devices[0];

	const firstTriangle = new Triangle(
		firstDevice.id,
		new Vector2(0, 0),
		new Vector2(-0.8, 1),
		findVectorTriangle(new Vector2(0, 0), new Vector2(-0.8, 1), new Vector2(-1, 0))
	);

	triangles.push(firstTriangle);

	_createTriangles(devices, triangles, firstDevice);

	return triangles;
}

export function createLeds(triangles: Triangle[]) {
	const leds: ILed[] = [];

	for (const tri of triangles) {
		const middle = new Vector2(
			(tri.vec1.x + tri.vec2.x + tri.vec3.x) / 3,
			(tri.vec1.y + tri.vec2.y + tri.vec3.y) / 3
		);

		leds.push({
			id: tri.triId,
			shape: 'e',
			position: [middle.x, middle.y],
			rotation: 0,
			pin: [1]
		});
	}

	return leds;
}
