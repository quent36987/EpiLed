import type {IStep, IStepAnimation} from "../../interfaces/interfaces";

export function updateAnnimation(oldAnnimation: IStepAnimation, newAnnimation: IStepAnimation) {
	const newLedIds = new Set<string>(newAnnimation.steps.flatMap((s) => s.ids));

	for (const oldStep of oldAnnimation.steps) {
		const oldStepIds = oldStep.ids.filter((id) => !newLedIds.has(id));

		if (oldStepIds.length > 0) {
			const newStep: IStep = {
				ids: oldStepIds,
				timecode: oldStep.timecode,
				colors: oldStep.colors,
				intensities: oldStep.intensities
			};

			newAnnimation.steps.push(newStep);
		}
	}

	return newAnnimation;
}
