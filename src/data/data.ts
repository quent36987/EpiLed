import {
	CIRCULAR_WAVE_MODULES,
	createCircularAnimation, createShootingTargetAnimation,
	createSnakeAnimation,
	createUniformAnimation,
	createUniformWaveAnimation,
	createWaveAnimation, SHOOTING_TARGET_MODULES,
	SNAKE_MODULES,
	UNIFORM_MODULES,
	UNIFORM_WAVE_MODULES,
	WAVE_MODULES
} from '../animations';
import type { IAnimation } from '../interfaces/interfaces';

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
	},
	{
		id: 3,
		modules: UNIFORM_WAVE_MODULES,
		function: createUniformWaveAnimation,
		title: 'Uniform Wave',
		description: 'wave of color with all the leds in the same color'
	},
	{
		id: 4,
		modules: CIRCULAR_WAVE_MODULES,
		function: createCircularAnimation,
		title: 'Circular Wave',
		description: 'a circular wave of color'
	},
	{
		id: 5,
		modules: SHOOTING_TARGET_MODULES,
		function: createShootingTargetAnimation,
		title: 'Shooting Target',
		description: 'a shooting target'
	}
];
