<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import Tabs from './Tabs.svelte';
	import type { IAnimation, ILed, IShape, IStepAnimation } from '../../interfaces/interfaces';
	import { Triangle } from '$lib/triangles/triangle';
	import { createLeds, createTriangles, generateTriangles } from '$lib/triangles/utils';
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';
	import Toggle from '../../animations/components/Toggle.svelte';
	import ToggleSize from '../../animations/components/ToggleSize.svelte';
	import { supabase } from '../../supabaseClient';
	import SettingButtons from '../../animations/components/SettingButtons.svelte';
	import { session } from '../../store/store';
	import { ANIMATIONS } from '../../data/data';

	let shapes: IShape[] = [];
	let leds: ILed[] = [];
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;
	let moreTriangles: Triangle[] = [];
	let shapeSelected: IShape | undefined;

	let animation: IStepAnimation;
	let state: EState = EState.EDITING;
	let editSize = 3;
	let animationSelected: IAnimation | undefined = animations[0];

	let my_session;
	let refresh = true;

	session.subscribe((value) => {
		my_session = value;
		if (!refresh) {
			refresh = true;
		}
	});

	let createConfig = (modules) => {
		let config = {};

		modules.forEach((module) => {
			if (module.range) config[module.name] = module.range.value;
			else if (module.color) config[module.name] = module.color.value;
			else if (module.toggle) config[module.name] = module.toggle.value;
		});

		return config;
	};

	$: {
		refresh;
		if (refresh) {
			getShapes().then((data) => {
				shapes = data as IShape[];
				if (!shapeSelected) {
					shapeSelected = shapes[0];
				}
				refresh = false;
			});
		}
	}

	onMount(() => {
		console.log('on mount');
		leds = createLeds(triangles);

		update();
		play();
	});

	const update = () => {
		if (animationSelected) {
			animation = animationSelected.function(
				leds,
				createConfig(animationSelected.modules),
				shapeSelected?.devices ?? []
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
	};

	const onAnimationClick = (events) => {
		animationSelected = animations.find((animation) => animation.id === events.detail);
		update();
	};

	const onTriangleClick = (events) => {
		if (state !== EState.EDITING) return;

		const triangle = triangles.find((triangle) => triangle.triId === events.detail);

		if (triangle && shapeSelected) {
			// delete triangle
			if (shapeSelected.devices.length === 1) {
				return;
			}

			shapeSelected.devices = shapeSelected.devices.filter((device) => device.id !== events.detail);
			shapeSelected.devices.forEach((device) => {
				device.connected = device.connected.filter((connected) => connected.id !== events.detail);
			});

			triangles = createTriangles(shapeSelected.devices);
			moreTriangles = generateTriangles(triangles, editSize);
		} else {
			const newTriangle = moreTriangles.find((tri) => tri.triId === events.detail);

			if (
				newTriangle &&
				shapeSelected &&
				!shapeSelected.devices.some((device) => device.id === events.detail)
			) {
				shapeSelected.devices.push({
					id: newTriangle.triId,
					connected: [
						{
							id: newTriangle.triangleCreationInfo.withTriangleId,
							pin: newTriangle.triangleCreationInfo.pinConnected
						}
					],
					size: newTriangle.size
				});

				shapeSelected.devices
					.find((device) => device.id === newTriangle.triangleCreationInfo.withTriangleId)
					?.connected.push({
						id: newTriangle.triId,
						pin: newTriangle.triangleCreationInfo.inTrianglePin
					});

				newTriangle.color = 'green';

				triangles = createTriangles(shapeSelected.devices);
				moreTriangles = generateTriangles(triangles, editSize);
			}
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

	const getShapes = async () => {
		try {
			const { data, error, status } = await supabase
				.from('shapes')
				.select('*')
				.eq('owner_id', my_session.user.id)
				.order('id', { ascending: false });

			console.log('data', data, 'error', error, 'status', status);

			return data;
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		}

		return [];
	};

	$: {
		shapeSelected;
		console.log('shapeSelected', shapeSelected);
		if (shapeSelected) {
			triangles = createTriangles(shapeSelected.devices);
			moreTriangles = generateTriangles(triangles, editSize);
			leds = createLeds(triangles);
			update();
		}
	}
</script>

<div id="app">
	<div id="left">
		<ListBlockSlector
			on:newDevice={shapeSelected?.newDevice ?? []}
			bind:shapes
			bind:shapeSelected
		/>
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
						on:deleteTriangle={onTriangleClick}
						bind:state
					/>
				</div>
			</div>

			<div id="right">
				<Toggle bind:state />
				{#if state === EState.EDITING}
					<ToggleSize bind:size={editSize} />
					<SettingButtons bind:shape={shapeSelected} />
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
		height: 80%;
	}

	#right {
		width: 30%;
		margin-left: var(--spacing-s);
		margin-right: var(--spacing-s);
	}
</style>
