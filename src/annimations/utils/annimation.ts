import type { IAnimation, IStep } from '../../interfaces/interfaces';

export function updateAnnimation(oldAnnimation: IAnimation, newAnnimation: IAnimation) {
	const newLedIds = new Set<number>(newAnnimation.steps.flatMap((step) => step.ids));

	for (const oldStep of oldAnnimation.steps) {
		const oldStepIds = oldStep.ids.filter((id) => !newLedIds.has(id));

		if (oldStepIds.length > 0) {
			const newStep: IStep = {
				ids: oldStepIds,
				leds: oldStep.leds,
				timecode: oldStep.timecode,
				colors: oldStep.colors,
				intensities: oldStep.intensities
			};

			newAnnimation.steps.push(newStep);
		}
	}

	return newAnnimation;
}
