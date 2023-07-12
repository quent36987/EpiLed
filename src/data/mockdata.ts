import type { IAnimation, IDevice } from '../interfaces/interfaces';
import {
	createSnakeAnimation,
	createUniformAnimation,
	createWaveAnimation,
	SNAKE_MODULES,
	UNIFORM_MODULES,
	WAVE_MODULES
} from '../annimations';

export const ANIMATIONS: IAnimation[] = [
	{
		id: 0,
		modules: WAVE_MODULES,
		function: createWaveAnimation,
		title: 'Wave',
		description: 'make a wave of color'
	},
	{
		id: 1,
		modules: UNIFORM_MODULES,
		function: createUniformAnimation,
		title: 'Uniforme',
		description: 'same color for all leds'
	},
	{
		id: 2,
		modules: SNAKE_MODULES,
		function: createSnakeAnimation,
		title: 'Snake',
		description: 'wave of color that goes from one led to another'
	}
];

export const deviceslol: IDevice[] = [
	{
		id: '1',
		connected: [
			{
				id: '2',
				pin: 3
			}
		]
	},
	{
		id: '2',
		connected: [
			{
				id: '1',
				pin: 1
			},
			{
				id: '3',
				pin: 2
			}
		]
	},
	{
		id: '3',
		connected: [
			{
				id: '2',
				pin: 1
			},
			{
				id: '4',
				pin: 2
			},
			{
				id: '8',
				pin: 3
			}
		]
	},
	{
		id: '4',
		connected: [
			{
				id: '3',
				pin: 1
			},
			{
				id: '5',
				pin: 3
			}
		]
	},
	{
		id: '5',
		connected: [
			{
				id: '4',
				pin: 1
			},
			{
				id: '6',
				pin: 2
			}
		]
	},
	{
		id: '6',
		connected: [
			{
				id: '5',
				pin: 3
			},
			{
				id: '7',
				pin: 2
			}
		]
	},
	{
		id: '7',
		connected: [
			{
				id: '6',
				pin: 1
			}
		]
	},
	{
		id: '8',
		connected: [
			{
				id: '3',
				pin: 1
			},
			{
				id: '9',
				pin: 2
			}
		]
	},
	{
		id: '9',
		connected: [
			{
				id: '8',
				pin: 1
			},
			{
				id: '10',
				pin: 3
			}
		]
	},
	{
		id: '10',
		connected: [
			{
				id: '9',
				pin: 1
			},
			{
				id: '11',
				pin: 3
			}
		]
	},
	{
		id: '11',
		connected: [
			{
				id: '10',
				pin: 1
			}
		]
	}
];
