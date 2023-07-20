<script lang="ts">
	import ListBlockSlector from '$lib/components/devices/selector/ListBlockSlector.svelte';
	import Tabs from '$lib/components/devices/tabs/Tabs.svelte';
	import type { IAnimation, ILayer, IShape, IStepAnimation } from '../../interfaces/interfaces';
	import { Triangle } from '$lib/triangles/triangle';
	import { createTriangles, generateTriangles } from '$lib/triangles/utils';
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';
	import Toggle from '$lib/components/devices/Toggle.svelte';
	import ToggleSize from '$lib/components/devices/ToggleSize.svelte';
	import SettingButtons from '$lib/components/devices/SettingButtons.svelte';
	import { session } from '../../store/store';
	import { ANIMATIONS } from '../../data/data';
	import { UniformShapeAnimation } from '../../animations/utils/animation';
	import { getShapes } from '$lib/components/devices/utils/supabase';

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
			getShapes(my_session, animations).then((data) => {
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

	const updateAnimation = () => {
		animationsStep = UniformShapeAnimation(shapeSelected, triangles);
	};

	const play = () => {
		state = EState.PLAYING;
		updateAnimation();
	};

	$: {
		state;
		switch (state) {
			case EState.PLAYING:
				play();
				break;
		}
	}

	$: {
		if (shapeSelected) {
			triangles = createTriangles(shapeSelected.devices);
			moreTriangles = generateTriangles(triangles, editSize);

			if (!layerSelected)
				layerSelected = shapeSelected.layers.length > 0 ? shapeSelected.layers[0] : undefined;
			updateAnimation();

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
			bind:state
			bind:shapeSelected
			bind:editSize
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
