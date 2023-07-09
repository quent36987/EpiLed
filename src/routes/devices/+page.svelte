<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import { WAVE_MODULES } from '../../annimations';
	import Tabs from './Tabs.svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import Canvas from './Canvas.svelte';
	import { onMount } from 'svelte';
	import { Triangle } from '$lib/mesh/triangle';
	import { ANIMATIONS, deviceslol } from '../../data/mockdata';
	import type { IStepAnimation, IDevice, ILed, IAnimation } from '../../interfaces/interfaces';
	import { createLeds, createTriangles } from './utils';

	let modules = WAVE_MODULES;
	let animation: IStepAnimation;
	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;

	let status = 'play';
	let selectedAnimation: IAnimation | undefined = undefined;

	let createConfig = (modules) => {
		let config = {};

		modules.forEach((module) => {
			if (module.range) config[module.name] = module.range.value;
			else if (module.color) config[module.name] = module.color.value;
		});

		return config;
	};

	const init = () => {
		triangles = createTriangles(devices);
		leds = createLeds(triangles);
	};

	onMount(() => {
		init();
		update();
	});

	const update = () => {
		const allAnimations: IStepAnimation = {
			frequency: 10,
			steps: []
		};

		for (const animation of animations) {
			if (animation.leds.length > 0) {
				const anim = animation.function(animation.leds, createConfig(animation.modules));

				allAnimations.steps.push(...anim.steps);
			}
		}

		animation = allAnimations;
	};

	$: {
		modules;
		if (status === 'play') update();
	}

	const play = () => {
		status = 'play';
		update();
	};

	const edit = () => {
		status = 'edit';
	};

	const onTriangleClick = (events) => {
		const led = leds.find((led) => led.id === events.detail);

		if (led && selectedAnimation) selectedAnimation.leds.push(led);
	};

	const onAnimationClick = (events) => {
		selectedAnimation = animations.find((animation) => animation.id === events.detail);
	};
</script>

<div id="app">
	<div id="left" class="height-100">
		<ListBlockSlector />
	</div>
	<div class="content">
		<div class="flex-row">
			<div id="middle" class="flex-col">
				<div class="flex-1">
					<Canvas bind:triangles bind:animation on:triangleClick={onTriangleClick} />
				</div>

				<div class="buttons">
					<ButtonGroup class="py-4 button-group">
						<div class:active={true}>
							<Button outline color={'green'}>On</Button>
						</div>
					</ButtonGroup>
					<ButtonGroup class="py-4 button-group">
						<Button outline color="yellow">Load</Button>
						<Button outline color="blue">Save</Button>
					</ButtonGroup>
					<ButtonGroup class="py-4 button-group">
						<Button outline color="purple">Delete</Button>
					</ButtonGroup>
				</div>
			</div>

			<div id="right">
				<div>
					<ButtonGroup class="py-4 button-group">
						<Button outline color="green" on:click={play}>Play</Button>
						<Button outline color="blue" on:click={edit}>Edit Animation</Button>
						<Button outline color="blue">Edit shape</Button>
					</ButtonGroup>
				</div>
				<Tabs bind:animations on:animationClick={onAnimationClick} />
			</div>
		</div>
	</div>
</div>

<style>
	#app {
		display: flex;
		height: 100%;
	}

	#left {
		width: min-content;
		height: 100%;
		background-color: white;
	}

	.content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.flex-row {
		flex-grow: 1;
		display: flex;
	}

	#middle {
		background-color: #f8f8f8;
		flex-grow: 3;
	}

	#right {
		background-color: #ddd;
		flex-grow: 1;
		padding: var(--spacing-s);
		max-width: 40vw;
	}

	.buttons {
		display: flex;
		justify-content: space-evenly;
	}

	.active > button {
		background-color: #007bff !important;
		color: white !important;
	}
</style>
