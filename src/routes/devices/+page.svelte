<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import { WAVE_MODULES } from '../../annimations';
	import Tabs from './Tabs.svelte';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Triangle } from '$lib/mesh/triangle';
	import { ANIMATIONS, deviceslol } from '../../data/mockdata';
	import type { IAnimation, IDevice, ILed, IStepAnimation } from '../../interfaces/interfaces';
	import { createLeds, createTriangles, findVectorTriangle } from './utils';
	import CanvasEdit from './CanvasEdit.svelte';

	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';

	let modules = WAVE_MODULES;
	let animation: IStepAnimation;
	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;
	let moreTriangles: Triangle[] = [];

	let status: EState = EState.EDITING;
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
	});

	const update = () => {
		if (animationSelected) {
			animation = animationSelected.function(leds, createConfig(animationSelected.modules));
		}
	};

	$: {
		modules;
		if (status === EState.PLAYING) update();
	}

	const play = () => {
		status = EState.PLAYING;
		update();
	};

	function getNewTriangles(triangleList) {
		let newTriangles = [];
		let id = 5000;

		for (let triangle of triangleList) {
			// Récupérer les trois triangles potentiels connectés
			let vec1 = findVectorTriangle(triangle.vec2, triangle.vec3, triangle.vec1);
			let vec2 = findVectorTriangle(triangle.vec3, triangle.vec1, triangle.vec2);
			let vec3 = findVectorTriangle(triangle.vec1, triangle.vec2, triangle.vec3);

			// Pour chaque triangle potentiel, vérifiez s'il existe déjà dans la liste de triangles existants ou dans la nouvelle liste
			let newTriangle1 = new Triangle(id.toString(), triangle.vec2, triangle.vec3, vec1, 'gray');
			if (!newTriangle1.exists(triangleList) && !newTriangle1.exists(newTriangles)) {
				newTriangles.push(newTriangle1);
			}
			id++;

			let newTriangle2 = new Triangle(id.toString(), triangle.vec3, triangle.vec1, vec2, 'gray');
			if (!newTriangle2.exists(triangleList) && !newTriangle2.exists(newTriangles)) {
				newTriangles.push(newTriangle2);
			}
			id++;
			let newTriangle3 = new Triangle(id.toString(), triangle.vec1, triangle.vec2, vec3, 'gray');
			if (!newTriangle3.exists(triangleList) && !newTriangle3.exists(newTriangles)) {
				newTriangles.push(newTriangle3);
			}
			id++;
		}

		return newTriangles;
	}

	const edit = () => {
		status = EState.EDITING;

		moreTriangles = getNewTriangles(triangles);
		console.log(moreTriangles);
	};

	const onAnimationClick = (events) => {
		animationSelected = animations.find((animation) => animation.id === events.detail);
		update();
	};

	const onTriangleClick = (events) => {
		console.log('click', events.detail);

		const triangle = moreTriangles.find((triangle) => triangle.triId === events.detail);

		if (triangle) {
			console.log('push');
			triangle.color = 'red';
			triangles.push(triangle);
			moreTriangles = getNewTriangles(triangles);
		}
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
					{#if status === EState.PLAYING}
						<Canvas bind:triangles bind:animation />
					{:else if status === EState.EDITING}
						<CanvasEdit bind:triangles bind:moreTriangles on:triangleClick={onTriangleClick} />
					{/if}
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
				<Tabs bind:animations bind:animationSelected on:animationClick={onAnimationClick} />
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
