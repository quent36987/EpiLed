<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
	import { createWaveAnimation, WAVE_MODULES } from '../../annimations';
	import Tabs from './Tabs.svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import Canvas from './Canvas.svelte';
	import { onMount } from 'svelte';
	import { Triangle } from '$lib/mesh/triangle';
	import { ANIMATIONS, deviceslol } from '../../data/mockdata';
	import type { IStepAnimation, IDevice, ILed } from '../../interfaces/interfaces';
	import { createLeds, createTriangles } from './utils';
	import type { IWaveProps } from '../../annimations/basics/wave';

	let modules = WAVE_MODULES;
	let animation: IStepAnimation;
	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;

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
		triangles[0].setUnlight();
		leds = createLeds(triangles);
	};

	onMount(() => {
		init();
		update();
	});

	const update = () => {
		animation = createWaveAnimation(leds, createConfig(modules) as IWaveProps);
	};

	$: {
		console.log('e');
		modules;
		update();
	}
</script>

<div id="app">
	<div id="left" class="height-100">
		<ListBlockSlector />
	</div>
	<div class="content">
		<div class="flex-row">
			<div id="middle" class="flex-col">
				<div class="flex-1">
					<Canvas bind:triangles bind:animation />
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
				<Tabs bind:animations>
					<PropertiesBar slot="dashboard" bind:modules />
				</Tabs>
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
