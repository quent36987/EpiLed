<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
	import { createWaveAnimation, WAVE_MODULES } from '../../annimations';
	import Tabs from './Tabs.svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import Canvass from './Canvass.svelte';
	import { onMount } from 'svelte';

	import { Triangle } from '$lib/mesh/triangle';
	import { deviceslol } from '../../data/mockdata';
	import type { IAnimation, IDevice, ILed } from '../../interfaces/interfaces';
	import {Vector2} from "three";
	import {findVectorTriangle, rec} from "./utils";
	import type {IWaveProps} from "../../annimations/basics/wave";

	let modules  = WAVE_MODULES;
	let annim: IAnimation;
	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
	let triangles: Triangle[] = [];

	let createConfig = (modules) => {
		let config = {};

		modules.forEach((module) => {
			if (module.range) config[module.name] = module.range.value;
			else if (module.color) config[module.name] = module.color.value;
		});

		return config;
	};



	const createTriangles = () => {
		triangles = [];
		leds = [];

		const firstDevice = devices[0];

		const firstTriangle = new Triangle(
			firstDevice.id,
			new Vector2(0, 0),
			new Vector2(-0.8, 1),
			findVectorTriangle(new Vector2(0, 0), new Vector2(-0.8, 1), new Vector2(-1, 0))
		);

		triangles.push(firstTriangle);

		rec(devices, triangles, firstDevice);

		for (const tri of triangles) {
			const midle = new Vector2(
				(tri.vec1.x + tri.vec2.x + tri.vec3.x) / 3,
				(tri.vec1.y + tri.vec2.y + tri.vec3.y) / 3
			);

			leds.push({
				id: tri.triId,
				forme: 'e',
				position: [midle.x, midle.y],
				rotation: 0,
				pin: [1]
			});
		}
	};

	onMount(() => {
		createTriangles();

		annim = createWaveAnimation(leds, createConfig(modules) as IWaveProps);
	});

	const update = () => {
		annim = createWaveAnimation(leds, createConfig(modules) as IWaveProps);
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
					<Canvass bind:triangles bind:annim />
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
				<Tabs>
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
