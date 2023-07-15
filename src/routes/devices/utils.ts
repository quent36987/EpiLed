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

export function getPin(vec1: Vector2, vec2: Vector2, vec3: Vector2, size: number, pin: number) {
	let segment, vecA, vecB, vecC;

	// Determine which of the 3 sides of the triangle the pin belongs to
	if (pin <= size) {
		vecA = vec1;
		vecB = vec2;
		vecC = vec3;
		segment = pin - 1;
	} else if (pin <= 2 * size) {
		vecA = vec2;
		vecB = vec3;
		vecC = vec1;
		segment = pin - size - 1;
	} else {
		vecA = vec3;
		vecB = vec1;
		vecC = vec2;
		segment = pin - 2 * size - 1;
	}

	// Compute the offset along the side where the pin is
	const offset = segment / size;

	// Compute the two vectors at the pin location and return them with the opposite vector
	const pinVec1 = new THREE.Vector2().lerpVectors(vecA, vecB, offset);
	const pinVec2 = new THREE.Vector2().lerpVectors(vecA, vecB, (segment + 1) / size);
	return [pinVec1, pinVec2, vecC];
}

export function isTriangleClockwise(p1: Vector2, p2: Vector2, p3: Vector2) {
	const area = 0.5 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
	return area < 0;
}

export function test(A: Vector2, B: Vector2, C: Vector2, size: number, pin: number) {
	for (let i = 1; i <= size; i++) {
		const p1 = new THREE.Vector2().lerpVectors(A, B, i);
		const p2 = new THREE.Vector2().lerpVectors(A, B, i - size);

		const firstTriangle = [p1, p2, findVectorTriangle(p1, p2, C)];
		if (!isTriangleClockwise(firstTriangle[0], firstTriangle[1], firstTriangle[2])) {
			firstTriangle.reverse();
		}

		for (let j = 0; j < 3; j++) {
			const vecs = getPin(
				firstTriangle[j % 3],
				firstTriangle[(j + 1) % 3],
				firstTriangle[(j + 2) % 3],
				size,
				pin
			);

			if (
				(vecs[0].distanceTo(A) < 0.01 && vecs[1].distanceTo(B) < 0.01) ||
				(vecs[0].distanceTo(B) < 0.01 && vecs[1].distanceTo(A) < 0.01)
			) {
				return [firstTriangle[j % 3], firstTriangle[(j + 1) % 3], firstTriangle[(j + 2) % 3]];
			}
		}
	}

	return [];
}

export function _createTriangles(devices: IDevice[], triangles: Triangle[], device: IDevice) {
	for (const dev of device.connected) {
		const hasTriangle = triangles.filter((x) => x.triId === dev.id).length === 0;
		const devSize = devices.filter((x) => x.id === dev.id)[0].size;

		if (hasTriangle) {
			const deviceTriangle = triangles.filter((x) => x.triId === device.id)[0];
			const deviceVecs = deviceTriangle.getPin(dev.pin);

			const devicePin = devices
				.filter((x) => x.id === dev.id)[0]
				.connected.filter((x) => x.id === device.id)[0].pin;

			const newVecs = test(deviceVecs[0], deviceVecs[1], deviceVecs[2], devSize, devicePin);

			const triangle = new Triangle(dev.id, newVecs[0], newVecs[1], newVecs[2], devSize);
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
		findVectorTriangle(new Vector2(0, 0), new Vector2(-0.8, 1), new Vector2(-1, 0)),
		firstDevice.size
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

const createAndAddTriangle = (
	vec1: Vector2,
	vec2: Vector2,
	vec3: Vector2,
	color: string,
	triangleList: Triangle[],
	newTriangles: Triangle[]
): void => {
	const id: string = Math.random().toString(36).substr(2) + Date.now().toString(36);
	const newTriangle: Triangle = new Triangle(id, vec1, vec2, vec3, 1, color);
	if (!newTriangle.exists(triangleList) && !newTriangle.exists(newTriangles)) {
		newTriangles.push(newTriangle);
	}
};

function intersept(triangleList: Triangle[], triangle: Triangle): boolean {
	for (const tri of triangleList) {
		if (tri.intersects(triangle)) {
			return true;
		}
	}
	return false;
}

export function generateTriangles(triangleList: Triangle[], editSize: number): Triangle[] {
	const newTriangles: Triangle[] = [];

	// faut parcourir tt les pin de chaque triangle
	// for i sur size
	// créer un tri de size edit size et connecter pin i sur le pin de triangle
	// si il empiete sur un truc déja codé on le skip
	// sinon on met de coté
	// on verifi que ya pas un trinagle avec les meme angle qui existe dans ceux mi de coté

	for (const triangle of triangleList) {
		for (let pin = 1; pin <= triangle.size * 3; pin++) {
			const vecPin = triangle.getPin(pin);

			for (let i = 1; i <= editSize; i += 1) {
				const id: string = Math.random().toString(36).substr(2) + Date.now().toString(36);

				const vecs = test(vecPin[0], vecPin[1], vecPin[2], editSize, i);
				const newTriangle = new Triangle(id, vecs[0], vecs[1], vecs[2], editSize, '#c4bfbf');

				if (!newTriangle.exists(triangleList) && !newTriangle.exists(newTriangles)) {
					if (!intersept(triangleList, newTriangle)) {
						newTriangle.triangleCreationInfo = {
							pinConnected: i,
							withTriangleId: triangle.triId,
							inTrianglePin: pin
						};
						newTriangles.push(newTriangle);
					}
				}
			}
		}
	}

	return newTriangles;
}
