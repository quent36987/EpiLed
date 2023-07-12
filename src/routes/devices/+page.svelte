<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import Tabs from './Tabs.svelte';
	import type { IAnimation, IDevice, ILed, IStepAnimation } from '../../interfaces/interfaces';
	import { ANIMATIONS, deviceslol } from '../../data/mockdata';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { Triangle } from '$lib/mesh/triangle';
	import { createLeds, createTriangles, generateTriangles } from './utils';
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';
	import Toggle from '../../annimations/components/Toggle.svelte';

	let animation: IStepAnimation;
	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;
	let moreTriangles: Triangle[] = [];

	let state: EState = EState.EDITING;
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
			animation = animationSelected.function(leds, createConfig(animationSelected.modules));
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

	const edit = () => {
		state = EState.EDITING;

		moreTriangles = generateTriangles(triangles);
	};

	const onAnimationClick = (events) => {
		animationSelected = animations.find((animation) => animation.id === events.detail);
		update();
	};

	const onTriangleClick = (events) => {
		const triangle = moreTriangles.find((triangle) => triangle.triId === events.detail);

		if (triangle) {
			triangle.color = 'red';
			triangles.push(triangle);
			moreTriangles = generateTriangles(triangles);
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
				<Toggle bind:state />
				<div class="tabs">
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
	}

	#right {
		width: 30%;
		margin-left: var(--spacing-s);
		margin-right: var(--spacing-s);
	}
	.tabs {
		margin-top: var(--spacing-s);
		background-color: var(--light-gray);

		padding: var(--spacing-s);

		border-radius: 20px;
		height: min-content;
	}

	.buttons {
		display: flex;
		justify-content: space-evenly;
	}
</style>
