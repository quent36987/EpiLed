/* eslint-disable */
import type { IStepAnimation, ILed, IModule } from '../../interfaces/interfaces';

interface IVagueProps {
	color: string;
}

export function createUniformAnimation(leds: ILed[], props: IVagueProps): IStepAnimation {
	const animation: IStepAnimation = {
		frequency: 0,
		steps: []
	};

	animation.steps.push({
		ids: leds.map((led) => led.id),
		timecode: 0,
		colors: props.color
	});

	return animation;
}

export const UNIFORM_MODULES: IModule[] = [
	{
		title: 'Couleur',
		name: 'color',
		color: {
			value: '#2f27a4'
		}
	}
];
