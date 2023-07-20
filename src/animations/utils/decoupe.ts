/* eslint-disable */
import type { IStep, IStepAnimation } from '../../interfaces/interfaces';

export interface IPosObject {
	position: [number, number];
}

export function getSegmentedPart<T extends IPosObject>(
	objects: T[],
	nbDecoupe: number,
	part: number,
	rotation: number = 0
): T[] {
	let rotationRadians = (rotation * Math.PI) / 180;

	let rotatedValues = objects.map(
		(obj) =>
			obj.position[0] * Math.cos(rotationRadians) + obj.position[1] * Math.sin(rotationRadians)
	);
	let minRotatedValue = Math.min(...rotatedValues);
	let maxRotatedValue = Math.max(...rotatedValues);

	let partWidth = (maxRotatedValue - minRotatedValue) / nbDecoupe;
	let partMin = minRotatedValue + partWidth * part;
	let partMax = partMin + partWidth;

	let partObjects = objects.filter((obj) => {
		let rotatedValue =
			obj.position[0] * Math.cos(rotationRadians) + obj.position[1] * Math.sin(rotationRadians);
		return rotatedValue >= partMin && rotatedValue <= partMax;
	});

	return partObjects;
}

export function getCircularPart<T extends IPosObject>(
	objects: T[],
	nbDecoupe: number,
	part: number,
	centerX: number,
	centerY: number
): T[] {
	let deltaAngle = (2 * Math.PI) / nbDecoupe;
	let minAngle = deltaAngle * part;
	let maxAngle = minAngle + deltaAngle;

	let partObjects = objects.filter((obj) => {
		// Calculate the angle between the center and the object
		let dx = obj.position[0] - centerX;
		let dy = obj.position[1] - centerY;
		let angle = Math.atan2(dy, dx);

		// Make sure angle is between 0 and 2*PI
		if (angle < 0) angle += 2 * Math.PI;

		// Check if the angle is within the range
		return angle >= minAngle && angle < maxAngle;
	});

	return partObjects;
}

export function getshootingTargetPart<T extends IPosObject>(
	objects: T[],
	nbDecoupe: number,
	part: number,
	centerX: number,
	centerY: number,
	invertParts: boolean = true
): T[] {
	let maxRadius = Math.max(
		...objects.map((obj) => Math.hypot(obj.position[0] - centerX, obj.position[1] - centerY))
	);

	let deltaRadius = maxRadius / nbDecoupe;

	// Invert the part number if invertParts is true
	let partNumber = invertParts ? nbDecoupe - 1 - part : part;

	let minRadius = deltaRadius * partNumber;
	let maxRadiusPart = minRadius + deltaRadius;

	let partObjects = objects.filter((obj) => {
		let radius = Math.hypot(obj.position[0] - centerX, obj.position[1] - centerY);
		return radius >= minRadius && radius <= maxRadiusPart;
	});

	return partObjects;
}



