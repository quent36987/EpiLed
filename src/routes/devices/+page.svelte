<script lang="ts">
	import ListBlockSlector from '$lib/components/devices/selector/ListBlockSlector.svelte';
	import Tabs from '$lib/components/devices/tabs/Tabs.svelte';
	import type { IAnimation, ILayer, IShape, IStepAnimation } from '../../interfaces/interfaces';
	import { Triangle } from '$lib/triangles/triangle';
	import { createLeds, createTriangles, generateTriangles } from '$lib/triangles/utils';
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';
	import Toggle from '$lib/components/devices/Toggle.svelte';
	import ToggleSize from '$lib/components/devices/ToggleSize.svelte';
	import { supabase } from '../../supabaseClient';
	import SettingButtons from '$lib/components/devices/SettingButtons.svelte';
	import { session } from '../../store/store';
	import { ANIMATIONS } from '../../data/data';

	let shapes: IShape[] = [];
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;
	let moreTriangles: Triangle[] = [];
	let shapeSelected: IShape | undefined;
	let layerSelected: ILayer | undefined;

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
			refresh = false;
			getShapes().then((data) => {
				shapes = data as IShape[];
				if (!shapeSelected) {
					shapeSelected = shapes[0];
				}
			});
		}
	}

	onMount(() => {
		play();
	});

	const update = () => {
		const allAnimation: IStepAnimation = {
			frequency: 0,
			steps: []
		};

		if (!shapeSelected) return;

		// FIXME x)
		for (const layer of shapeSelected.layers) {
			if (!layer.animation) continue;

			const leds = createLeds(triangles.filter((triangle) => layer.leds.includes(triangle.triId)));

			const layerAnimation = layer.animation.function(
				leds,
				createConfig(layer.animation.modules),
				shapeSelected?.devices ?? []
			);

			allAnimation.frequency = Math.max(allAnimation.frequency, layerAnimation.frequency);

			allAnimation.steps = allAnimation.steps.concat(layerAnimation.steps);
		}

		animation = allAnimation;
	};

	const play = () => {
		state = EState.PLAYING;
		update();
	};

	const edit = () => {
		state = EState.EDITING;
	};

	const onTriangleClick = (events) => {
		if (state === EState.PAUSED || state === EState.PLAYING) return;

		if (state === EState.LAYERS) {
			if (!layerSelected || !shapeSelected) return;

			const LEDS_IS_ALREADY_IN_LAYER = layerSelected.leds.includes(events.detail);

			if (LEDS_IS_ALREADY_IN_LAYER) {
				layerSelected.leds = layerSelected.leds.filter((id) => id !== events.detail);
			} else {
				for (const shapeSelectedElement of shapeSelected.layers) {
					shapeSelectedElement.leds = shapeSelectedElement.leds.filter(
						(id) => id !== events.detail
					);
				}

				layerSelected.leds.push(events.detail);
			}

			return;
		}

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

			shapeSelected.layers.forEach((layer) => {
				layer.leds = layer.leds.filter((id) => id !== events.detail);
			});
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

				layerSelected?.leds.push(newTriangle.triId);
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
		if (shapes.length > 0) return shapes;

		try {
			const { data } = await supabase
				.from('shapes')
				.select('*')
				.eq('owner_id', my_session.user.id)
				.order('id', { ascending: false });

			data?.forEach((d) => {
				d.layers.forEach((l) => {
					if (l.animation) {
						const animationFinded = animations.find((a) => a.id === l.animation?.id);
						if (animationFinded) {
							l.animation.function = animationFinded.function;
						}
					}
				});
			});

			console.log('data get supabase', data);
			return data;
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		}

		return [];
	};

	$: {
		if (shapeSelected) {
			triangles = createTriangles(shapeSelected.devices);
			moreTriangles = generateTriangles(triangles, editSize);

			if (!layerSelected)
				layerSelected = shapeSelected.layers.length > 0 ? shapeSelected.layers[0] : undefined;
			update();
		}
	}
</script>

<svelte:head>
	<title>Devices</title>
	<meta name="description" content="Create and simulate template" />
</svelte:head>

<div id="app">
	<div id="left">
		<ListBlockSlector bind:shapes bind:shapeSelected bind:layerSelected />
	</div>
	<div class="content">
		<div class="flex-row">
			<div id="middle" class="flex-col">
				<Canvas
					bind:triangles
					bind:animation
					bind:moreTriangles
					bind:layerSelected
					on:triangleClick={onTriangleClick}
					bind:state
				/>
			</div>

			<div id="right">
				<Toggle bind:state />
				{#if state === EState.EDITING}
					<ToggleSize bind:size={editSize} />
					<SettingButtons bind:shape={shapeSelected} />
				{/if}
				<Tabs bind:animations bind:animationSelected bind:layerSelected bind:shapeSelected />
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
