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
	import { UniformAnimationsDuration } from '../../animations/utils/decoupe';
	import { createConfig } from '../../animations/utils/modules';

	let shapes: IShape[] = [];
	let triangles: Triangle[] = [];
	let animations = ANIMATIONS;
	let moreTriangles: Triangle[] = [];
	let shapeSelected: IShape | undefined;
	let layerSelected: ILayer | undefined;

	let animationsStep: IStepAnimation[] = [];
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
		const allAnimation: IStepAnimation[] = [];

		if (!shapeSelected) return;

		for (const layer of shapeSelected.layers) {
			if (!layer.animation) continue;

			const layerAnimation = layer.animation.function(
				createLeds(triangles.filter((triangle) => layer.leds.includes(triangle.triId))),
				createConfig(layer.animation.modules),
				shapeSelected?.devices ?? []
			);

			allAnimation.push(layerAnimation);
		}

		animationsStep = UniformAnimationsDuration(allAnimation);
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
	<div class="left">
		<ListBlockSlector bind:shapes bind:shapeSelected bind:layerSelected />
	</div>
	<div class="content">
		<Canvas
			bind:triangles
			bind:animationsStep
			bind:moreTriangles
			bind:layerSelected
			on:triangleClick={onTriangleClick}
			bind:state
			bind:shapeSelected
		/>

		<div id="right">
			<Toggle bind:state />
			<SettingButtons bind:shape={shapeSelected} />
			{#if state === EState.EDITING}
				<ToggleSize bind:size={editSize} />
			{/if}
			<Tabs bind:animations bind:animationSelected bind:layerSelected bind:shapeSelected />
		</div>
	</div>
</div>

<style>
	#app {
		display: flex;
		position: relative;
		height: 90vh;
		overflow: hidden;
	}

	.left {
		margin: var(--spacing-s);
		width: min-content;
	}

	.content {
		flex-grow: 1;
		display: flex;
		flex-direction: row;
		margin-top: var(--spacing-s);
		margin-bottom: var(--spacing-s);
		margin-right: var(--spacing-s);
		gap: var(--spacing-s);
	}

	#right {
		flex: 3;

		display: flex;
		flex-direction: column;
	}
</style>
