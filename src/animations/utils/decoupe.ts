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

export function resampleAnimation(animation: IStepAnimation, newFrequency: number): IStepAnimation {
	const newSteps: IStep[] = [];

	for (let i = 0; i < animation.steps.length; i++) {
		const oldTimecode = animation.steps[i].timecode;

		newSteps.push({
			...animation.steps[i],
			timecode: Math.round((oldTimecode * newFrequency) / animation.frequency)
		});
	}

	return {
		frequency: newFrequency,
		steps: newSteps
	};
}

export function sortAnimation(animation: IStepAnimation): IStepAnimation {
	return {
		...animation,
		steps: [...animation.steps].sort((a, b) => a.timecode - b.timecode)
	};
}

export function biggerAnimation(animation: IStepAnimation, nbStep: number): IStepAnimation {
	const sortedSteps = [...animation.steps].sort((a, b) => a.timecode - b.timecode);

	if (sortedSteps[sortedSteps.length - 1].timecode > nbStep) {
		console.log('Animation already bigger than nbStep');
		return animation;
	}

	let nbReplay = 1;
	const timecodeMax = sortedSteps[sortedSteps.length - 1].timecode + 1;
	console.log('timecodeMax', timecodeMax);

	const newSteps: IStep[] = [...animation.steps];
	let i = 0;

	while (true) {
		if (i >= animation.steps.length) {
			i = 0;
			nbReplay++;
		}

		const newTimecode = animation.steps[i].timecode + timecodeMax * nbReplay;

		if (newTimecode > nbStep) {
			break;
		}

		newSteps.push({
			...animation.steps[i],
			timecode: newTimecode
		});

		i++;
	}

	return {
		...animation,
		steps: newSteps
	};
}

export function findLongestAnimation(animations: IStepAnimation[]): {
	maxDuration: number;
	maxFrequency: number;
	timecode: number;
} {
	let maxDuration = 0;
	let maxFrequency = 0;
	let maxTimecode = 0;

	for (const animation of animations) {
		const sortedSteps = [...animation.steps].sort((a, b) => a.timecode - b.timecode);
		const currentMaxTimecode = sortedSteps[sortedSteps.length - 1].timecode;
		const currentDuration = currentMaxTimecode / animation.frequency;

		if (currentDuration > maxDuration) {
			maxDuration = currentDuration;
			maxTimecode = currentMaxTimecode;
		}

		if (maxFrequency < animation.frequency) {
			maxFrequency = animation.frequency;
		}
	}

	return { maxDuration, maxFrequency: maxFrequency, timecode: maxTimecode };
}

export function UniformAnimationsDuration(animations: IStepAnimation[]): IStepAnimation[] {
	let animationsSorted = [];

	for (const animation of animations) {
		animationsSorted.push(sortAnimation(animation));
	}

	const { maxDuration, maxFrequency, timecode } = findLongestAnimation(animationsSorted);

	console.log(maxDuration, maxFrequency, timecode, animationsSorted);

	const allAnimation: IStepAnimation[] = 	[];

	for (const animation of animationsSorted) {
		const animationResampled =
			animation.frequency !== maxFrequency ? resampleAnimation(animation, maxFrequency) : animation;

		//const steps = biggerAnimation(animationResampled, timecode).steps;

		allAnimation.push(animationResampled);
	}

	return allAnimation;
}
