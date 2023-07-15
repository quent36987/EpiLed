<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import Tabs from './Tabs.svelte';
	import type {
		IAnimation,
		IDevice,
		ILed,
		IShape,
		IStepAnimation
	} from '../../interfaces/interfaces';
	import { ANIMATIONS, deviceslol } from '../../data/mockdata';
	import { Triangle } from '$lib/triangles/triangle';
	import { createLeds, createTriangles, generateTriangles } from '$lib/triangles/utils';
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import { EState } from '../../interfaces/enums';
	import Toggle from '../../annimations/components/Toggle.svelte';
	import ToggleSize from '../../annimations/components/ToggleSize.svelte';
	import { supabase } from '../../supabaseClient';
	import SettingButtons from '../../annimations/components/SettingButtons.svelte';
	import {session} from "../../store/store";

	let shapes: IShape[] = [];
	let leds: ILed[] = [];
	let devices: IDevice[] = deviceslol;
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

	session.subscribe(value => {
		my_session = value;
		if(!refresh){
			refresh = true;
		}
	});

	// $: devices = shapeSelected?.devices ?? deviceslol;
	// $: triangles = createTriangles(devices);
	// $: moreTriangles = generateTriangles(triangles, editSize);



	let createConfig = (modules) => {
		let config = {};

		modules.forEach((module) => {
			if (module.range) config[module.name] = module.range.value;
			else if (module.color) config[module.name] = module.color.value;
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
		console.log('on mount')
		leds = createLeds(triangles);

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
	};

	const onAnimationClick = (events) => {
		animationSelected = animations.find((animation) => animation.id === events.detail);
		update();
	};

	const onTriangleClick = (events) => {
		if (state !== EState.EDITING) return;

		const triangle = triangles.find((triangle) => triangle.triId === events.detail);

		if (triangle) {
			// delete triangle
			devices = devices.filter((device) => device.id !== events.detail);
			devices.forEach((device) => {
				device.connected = device.connected.filter((connected) => connected.id !== events.detail);
			});

			triangles = createTriangles(devices);
			moreTriangles = generateTriangles(triangles, editSize);
		} else {
			const newTriangle = moreTriangles.find((tri) => tri.triId === events.detail);

			if (newTriangle && !devices.some((device) => device.id === events.detail)) {
				devices.push({
					id: newTriangle.triId,
					connected: [
						{
							id: newTriangle.triangleCreationInfo.withTriangleId,
							pin: newTriangle.triangleCreationInfo.pinConnected
						}
					],
					size: newTriangle.size
				});

				devices
					.find((device) => device.id === newTriangle.triangleCreationInfo.withTriangleId)
					?.connected.push({
						id: newTriangle.triId,
						pin: newTriangle.triangleCreationInfo.inTrianglePin
					});

				newTriangle.color = 'green';

				triangles = createTriangles(devices);
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

	const newDevice = async () => {
		console.log('new device', my_session);

		try {
			console.log('user', my_session.user);

			const { data, error, status } = await supabase
				.from('shapes')
				.insert([{ owner_id: my_session.user.id, title: 'New Device', devices: devices }])
				.select();

			console.log('data', data, 'error', error, 'status', status);
			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		}
	};

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
			devices = shapeSelected.devices;
			triangles = createTriangles(devices);
			moreTriangles = generateTriangles(triangles, editSize);
		}
	}

</script>

<div id="app">
	<div id="left">
		<ListBlockSlector on:newDevice={newDevice} bind:shapes bind:shapeSelected />
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
	}

	#right {
		width: 30%;
		margin-left: var(--spacing-s);
		margin-right: var(--spacing-s);
	}
</style>
