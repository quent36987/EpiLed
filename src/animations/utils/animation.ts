import type { IShape, IStep, IStepAnimation } from '../../interfaces/interfaces';
import { createLeds } from '$lib/triangles/utils';
import { createConfig } from './modules';
import type { Triangle } from '$lib/triangles/triangle';

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
	const animationsSorted = [];

	for (const animation of animations) {
		animationsSorted.push(sortAnimation(animation));
	}

	const { maxFrequency } = findLongestAnimation(animationsSorted);

	const allAnimation: IStepAnimation[] = [];

	for (const animation of animationsSorted) {
		const animationResampled =
			animation.frequency !== maxFrequency ? resampleAnimation(animation, maxFrequency) : animation;

		//const steps = biggerAnimation(animationResampled, timecode).steps;

		allAnimation.push(animationResampled);
	}

	return allAnimation;
}

export function UniformShapeAnimation(
	shape: IShape | undefined,
	triangles: Triangle[]
): IStepAnimation[] {
	if (!shape) return [];

	const allAnimation: IStepAnimation[] = [];

	for (const layer of shape.layers) {
		if (!layer.animation) continue;

		const layerAnimation = layer.animation.function(
			createLeds(triangles.filter((triangle) => layer.leds.includes(triangle.triId))),
			createConfig(layer.animation.modules),
			shape?.devices ?? []
		);

		allAnimation.push(layerAnimation);
	}

	return UniformAnimationsDuration(allAnimation);
}
