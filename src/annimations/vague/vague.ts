import type { IAnimation, ILed, IModule } from '../../interfaces/interfaces';
import { getDecoupePart } from '../utils/decoupe';
import { generateColorWave } from '../utils/couleurs';
/* eslint-disable */

interface IVagueProps {
	frequency: number;
	nbColor: number;
	firstColor: string;
	endColor: string;
	nbPart: number;
	nbColorBetweenStep: number;
	rotation: number;
}

export function VagueAnnimation(leds: ILed[], props: IVagueProps): IAnimation {
	const animation: IAnimation = {
		frequence: props.frequency,
		steps: []
	};

	const colors = generateColorWave(props.nbColor, props.firstColor, props.endColor);

	for (let part = 0; part < props.nbPart; part++) {
		const ledInPart = getDecoupePart(leds, props.nbPart, part, props.rotation);

		let time = 0;
		for (let c = 0; c < props.nbColor; c++) {
			animation.steps.push({
				ids: ledInPart.map((led) => led.id),
				timecode: time,
				colors: colors[(c + part * props.nbColorBetweenStep) % props.nbColor]
			});

			time += 1;
		}
	}

	return animation;
}

export const VAGUE_MODULES: IModule[] = [
	{
		title: 'Nombre de couleurs',
		name: 'nbColor',
		range: {
			min: 1,
			max: 20,
			value: 10
		}
	},
	{
		title: 'Couleur de départ',
		name: 'firstColor',
		color: {
			value: '#ff0000'
		}
	},
	{
		title: 'Couleur de fin',
		name: 'endColor',
		color: {
			value: '#0000ff'
		}
	},
	{
		title: 'Nombre de partie',
		name: 'nbPart',
		range: {
			min: 1,
			max: 10,
			value: 5
		}
	},
	{
		title: 'Nombre de couleur entre chaque partie',
		name: 'nbColorBetweenStep',
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
		title: 'Fréquence',
		name: 'frequency',
		range: {
			min: 1,
			max: 100,
			value: 10
		}
	}
];
