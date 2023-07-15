<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import Tabs from './Tabs.svelte';
	import type { IAnimation, IDevice, ILed, IStepAnimation } from '../../interfaces/interfaces';
	import { ANIMATIONS, deviceslol } from '../../data/mockdata';
	import { Triangle } from '$lib/mesh/triangle';
	import { createLeds, createTriangles, generateTriangles } from './utils';
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';
	import Toggle from '../../annimations/components/Toggle.svelte';
	import ToggleSize from '../../annimations/components/ToggleSize.svelte';

	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;
	let moreTriangles: Triangle[] = [];

	let animation: IStepAnimation;
	let state: EState = EState.EDITING;
	let editSize = 3;
	let animationSelected: IAnimation | undefined = animations[0];

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
		play();
	});

	const update = () => {
		if (animationSelected) {
			animation = animationSelected.function(
				leds,
				createConfig(animationSelected.modules),
				devices
			);
		}
	};

	const updateModule = () => {
		if (state === EState.PLAYING) {
			update();
		}
	};

	const play = () => {
		state = EState.PLAYING;
		leds = createLeds(triangles);
		update();
	};

	$: {
		editSize;
		edit();
	}
	const edit = () => {
		state = EState.EDITING;

		moreTriangles = generateTriangles(triangles, editSize);
	};

	const onAnimationClick = (events) => {
		animationSelected = animations.find((animation) => animation.id === events.detail);
		update();
	};

	const onTriangleClick = (events) => {
		const triangle = moreTriangles.find((triangle) => triangle.triId === events.detail);

		if (triangle) {
			devices.push({
				id: triangle.triId,
				connected: [
					{
						id: triangle.triangleCreationInfo.withTriangleId,
						pin: triangle.triangleCreationInfo.pinConnected
					}
				],
				size: triangle.size
			});

			devices
				.find((device) => device.id === triangle.triangleCreationInfo.withTriangleId)
				?.connected.push({
					id: triangle.triId,
					pin: triangle.triangleCreationInfo.inTrianglePin
				});

			triangle.color = 'red';

			triangles = createTriangles(devices);
			moreTriangles = generateTriangles(triangles, editSize);
		}
	};

	$: {
		state;
		switch (state) {
			case EState.PLAYING:
				play();
				break;
			case EState.EDITING:
				edit();
				break;
		}
	}
</script>

<div id="app">
	<div id="left">
		<ListBlockSlector />
	</div>
	<div class="content">
		<div class="flex-row">
			<div id="middle" class="flex-col">
				<div class="flex-1">
					<Canvas
						bind:triangles
						bind:animation
						bind:moreTriangles
						on:triangleClick={onTriangleClick}
						bind:state
					/>
				</div>
			</div>

			<div id="right">
				<Toggle bind:state />
				{#if state === EState.EDITING}
					<ToggleSize bind:size={editSize} />
				{/if}
				<Tabs
					bind:animations
					bind:animationSelected
					on:animationClick={onAnimationClick}
					on:updateModule={updateModule}
				/>
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
		margin-top: var(--spacing-s);
		width: min-content;
		margin-bottom: var(--spacing-s);
		margin-left: var(--spacing-s);
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
		margin-top: var(--spacing-s);
		flex-grow: 3;
		margin-bottom: var(--spacing-s);
	}

	#right {
		width: 30%;
		margin-left: var(--spacing-s);
		margin-right: var(--spacing-s);
	}
</style>
