import type { IStepAnimation, ILed, IModule } from '../../interfaces/interfaces';
import { generateColorWave } from '../utils/couleurs';

export interface IUniformWaveProps {
	frequency: number;
	colorCount: number;
	firstColor: string;
	endColor: string;
}

export function createUniformWaveAnimation(leds: ILed[], props: IUniformWaveProps): IStepAnimation {
	const animation: IStepAnimation = {
		frequency: props.frequency,
		steps: []
	};

	const colors = generateColorWave(props.colorCount, props.firstColor, props.endColor);

	let time = 0;

	for (let c = 0; c < props.colorCount; c++) {
		animation.steps.push({
			ids: leds.map((led) => led.id),
			timecode: time,
			colors: colors[c]
		});

		time += 1;
	}

	return animation;
}

export const UNIFORM_WAVE_MODULES: IModule[] = [
	{
		title: 'Color Count',
		name: 'colorCount',
		range: {
			min: 1,
			max: 200,
			value: 100
		}
	},
	{
		title: 'Start Color',
		name: 'firstColor',
		color: {
			value: '#ff0000'
		}
	},
	{
		title: 'End Color',
		name: 'endColor',
		color: {
			value: '#ff003b'
		}
	},
	{
		title: 'Speed',
		name: 'frequency',
		range: {
			min: 1,
			max: 100,
			value: 10
		}
	}
];
