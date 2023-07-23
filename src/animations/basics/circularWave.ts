import type { IStepAnimation, ILed, IModule } from '../../interfaces/interfaces';
import { generateColorWave } from '../utils/couleurs';
import { getCircularPart } from '../utils/decoupe';

export interface ICircularProps {
	frequency: number;
	colorCount: number;
	firstColor: string;
	endColor: string;
	partCount: number;
	colorCountBetweenStep: number;
}

export function createCircularAnimation(leds: ILed[], props: ICircularProps): IStepAnimation {
	const animation: IStepAnimation = {
		frequency: props.frequency,
		steps: []
	};

	const colors = generateColorWave(props.colorCount, props.firstColor, props.endColor);

	const centerX = leds.reduce((acc, led) => acc + led.position[0], 0) / leds.length;
	const centerY = leds.reduce((acc, led) => acc + led.position[1], 0) / leds.length;

	for (let part = 0; part <= props.partCount; part++) {
		const ledsInPart = getCircularPart(leds, props.partCount, part, centerX, centerY);

		let time = 0;

		if (ledsInPart.length === 0) continue;
		for (let c = 0; c < props.colorCount; c++) {
			animation.steps.push({
				ids: ledsInPart.map((led) => led.id),
				timecode: time,
				colors: colors[(c + part * props.colorCountBetweenStep) % props.colorCount]
			});

			time += 1;
		}
	}

	return animation;
}

export const CIRCULAR_WAVE_MODULES: IModule[] = [
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
		title: 'Part Count',
		name: 'partCount',
		range: {
			min: 1,
			max: 20,
			value: 10
		}
	},
	{
		title: 'Color Count Between Steps',
		name: 'colorCountBetweenStep',
		range: {
			min: 1,
			max: 10,
			value: 2
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
