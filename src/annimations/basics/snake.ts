import type { IStepAnimation, ILed, IModule, IDevice } from '../../interfaces/interfaces';
import { generateColorWave } from '../utils/couleurs';

export interface ISnakeProps {
	frequency: number;
	colorCount: number;
	firstColor: string;
	endColor: string;
	colorCountBetweenStep: number;
}

export function createSnakeAnimation(
	leds: ILed[],
	props: ISnakeProps,
	devices: IDevice[] = []
): IStepAnimation {
	const animation: IStepAnimation = {
		frequency: props.frequency,
		steps: []
	};

	const colors = generateColorWave(props.colorCount, props.firstColor, props.endColor);

	let firstLed = devices.find((device) => device.connected.length === 1)?.id;

	console.log(firstLed);

	if (!firstLed) {
		firstLed = devices.find((device) => device.connected.length === 2)?.id;
	}

	if (!firstLed) {
		return animation;
	}

	const ledsPast: string[] = [firstLed];
	let tmpLed: string[] = [firstLed];
	let part = 0;

	while (tmpLed.length > 0) {
		let time = 0;

		for (let c = props.colorCount; c >= 0; c--) {
			animation.steps.push({
				ids: tmpLed,
				timecode: time,
				colors: colors[(c + part * props.colorCountBetweenStep) % props.colorCount]
			});

			time += 1;
		}

		// add all the led connected to tmpLed
		const newLeds: string[] = [];
		for (const led of tmpLed) {
			const device = devices.find((device) => device.id === led);

			if (device) {
				for (const connected of device.connected) {
					if (!ledsPast.includes(connected.id)) {
						newLeds.push(connected.id);
						ledsPast.push(connected.id);
					}
				}
			}
		}

		tmpLed = newLeds;
		part += 1;
	}

	return animation;
}

export const SNAKE_MODULES: IModule[] = [
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
		title: 'Color Count Between Steps',
		name: 'colorCountBetweenStep',
		range: {
			min: 1,
			max: 10,
			value: 1
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
