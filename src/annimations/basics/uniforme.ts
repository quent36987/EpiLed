/* eslint-disable */
import type { IAnimation, ILed, IModule } from '../../interfaces/interfaces';

interface IVagueProps {
	color: string;
}

export function UniformeAnnimation(leds: ILed[], props: IVagueProps): IAnimation {
	const animation: IAnimation = {
		frequence: 0,
		steps: []
	};

	animation.steps.push({
		ids: leds.map((led) => led.id),
		timecode: 0,
		colors: props.color
	});

	return animation;
}

export const UNIFORME_MODULES: IModule[] = [
	{
		title: 'Couleur',
		name: 'color',
		color: {
			value: '#2f27a4'
		}
	}
];
