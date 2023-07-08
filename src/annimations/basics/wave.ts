import type { IAnimation, ILed, IModule } from '../../interfaces/interfaces';
import { generateColorWave } from '../utils/couleurs';
import { getSegmentedPart } from '../utils/decoupe';

interface IWaveProps {
	frequency: number;
	colorCount: number;
	firstColor: string;
	endColor: string;
	partCount: number;
	colorCountBetweenStep: number;
	rotation: number;
}

export function createWaveAnimation(leds: ILed[], props: IWaveProps): IAnimation {
	const animation: IAnimation = {
		frequency: props.frequency,
		steps: []
	};

	const colors = generateColorWave(props.colorCount, props.firstColor, props.endColor);

	for (let part = 0; part <= props.partCount; part++) {
		const ledsInPart = getSegmentedPart(leds, props.partCount, part, props.rotation);

		let time = 0;

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

export const WAVE_MODULES: IModule[] = [
	{
		title: 'Color Count',
		name: 'colorCount',
		range: {
			min: 1,
			max: 20,
			value: 10
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
			value: '#0000ff'
		}
	},
	{
		title: 'Part Count',
		name: 'partCount',
		range: {
			min: 1,
			max: 10,
			value: 5
		}
	},
	{
		title: 'Color Count Between Steps',
		name: 'colorCountBetweenStep',
		range: {
			min: 1,
			max: 10,
			value: 5
		}
	},
	{
		title: 'Rotation',
		name: 'rotation',
		range: {
			min: 0,
			max: 360,
			value: 0
		}
	},
	{
		title: 'Frequency',
		name: 'frequency',
		range: {
			min: 1,
			max: 100,
			value: 10
		}
	}
];
