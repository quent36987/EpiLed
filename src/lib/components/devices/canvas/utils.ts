import type { Triangle } from '$lib/triangles/triangle';
import type { ILayer, IShape } from '../../../../interfaces/interfaces';
import { createTriangles, generateTriangles } from '$lib/triangles/utils';

export const _resizeCamera = (
	camera: THREE.PerspectiveCamera,
	zoom: number,
	sceneRotation: number,
	triangles: Triangle[],
	moreTriangles: Triangle[]
) => {
	let maxX = Math.max(...triangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
	let minX = Math.min(...triangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
	let maxY = Math.max(...triangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
	let minY = Math.min(...triangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

	if (moreTriangles.length > 0) {
		const maxX2 = Math.max(...moreTriangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
		const minX2 = Math.min(...moreTriangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
		const maxY2 = Math.max(...moreTriangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
		const minY2 = Math.min(...moreTriangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

		maxX = Math.max(maxX, maxX2);
		minX = Math.min(minX, minX2);
		maxY = Math.max(maxY, maxY2);
		minY = Math.min(minY, minY2);
	}

	const rotatedMaxX = maxX * Math.cos(sceneRotation) - maxY * Math.sin(sceneRotation);
	const rotatedMinX = minX * Math.cos(sceneRotation) - minY * Math.sin(sceneRotation);
	const rotatedMaxY = maxX * Math.sin(sceneRotation) + maxY * Math.cos(sceneRotation);
	const rotatedMinY = minX * Math.sin(sceneRotation) + minY * Math.cos(sceneRotation);

	camera.position.x = (rotatedMaxX + rotatedMinX) / 2;
	camera.position.y = (rotatedMaxY + rotatedMinY) / 2;

	const maxDistance = Math.max(
		Math.max(Math.abs(minX), Math.abs(maxY)),
		Math.max(Math.abs(maxX), Math.abs(minY))
	);

	camera.position.z = Math.max(maxDistance + zoom, 1);
};

export function addOrRemoveTriangleToLayer(
	triangleId: string,
	layer: ILayer | undefined,
	shape: IShape | undefined
) {
	if (!layer || !shape) return;

	if (layer.leds.includes(triangleId)) {
		layer.leds = layer.leds.filter((id) => id !== triangleId);
	} else {
		for (const shapeSelectedElement of shape.layers) {
			shapeSelectedElement.leds = shapeSelectedElement.leds.filter((id) => id !== triangleId);
		}

		layer.leds.push(triangleId);
	}
}

export function removeTriangle(triangleId: string, shape: IShape) {
	if (shape.devices.length === 1) {
		return;
	}

	shape.devices = shape.devices.filter((device) => device.id !== triangleId);
	shape.devices.forEach((device) => {
		device.connected = device.connected.filter((connected) => connected.id !== triangleId);
	});
}

export function addTriangle(
	triangleId: string,
	shape: IShape,
	moreTriangles: Triangle[],
	layerSelected: ILayer
): boolean {
	const newTriangle = moreTriangles.find((tri) => tri.triId === triangleId);

	if (newTriangle && !shape.devices.some((device) => device.id === triangleId)) {
		shape.devices.push({
			id: newTriangle.triId,
			connected: [
				{
					id: newTriangle.triangleCreationInfo.withTriangleId,
					pin: newTriangle.triangleCreationInfo.pinConnected
				}
			],
			size: newTriangle.size
		});

		shape.devices
			.find((device) => device.id === newTriangle.triangleCreationInfo.withTriangleId)
			?.connected.push({
				id: newTriangle.triId,
				pin: newTriangle.triangleCreationInfo.inTrianglePin
			});

		newTriangle.color = 'green';
		layerSelected?.leds.push(newTriangle.triId);

		return true;
	}

	return false;
}
