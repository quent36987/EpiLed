<script lang="ts" xmlns="http://www.w3.org/1999/html">
	import BlockSlector from '$lib/components/devices/selector/BlockSlector.svelte';
	import type { ILayer, IShape } from '../../../../interfaces/interfaces';
	import { supabase } from '../../../../supabaseClient';
	import { session } from '../../../../store/store';
	import { addErrorToast, addInfoToast } from '$lib/components/toast/toast';

	export let shapes: IShape[];
	export let shapeSelected: IShape | undefined;
	export let layerSelected: ILayer | undefined;

	let scrollElement;

	let my_session;

	session.subscribe((value) => {
		my_session = value;
	});

	const onNewDeviceClick = async () => {
		const newShape = {
			owner_id: 0,
			title: 'New device',
			devices: [
				{
					id: '0',
					size: 1,
					connected: []
				}
			],
			layers: [
				{
					id: 0,
					leds: ['0']
				}
			]
		};

		if (!my_session || !my_session.user) {
			addInfoToast('Be careful, you need to be logged in to save your device.');

			const shape: IShape = { ...newShape, id: 1 };

			shapes.push(shape);
			shapeSelected = shape;
			layerSelected = shape.layers[0];

			return;
		}

		const title = prompt('Enter device name', 'New device');
		try {
			const { data, error, status } = await supabase
				.from('shapes')
				.insert([{ ...newShape, title: title, owner_id: my_session.user.id }])
				.select();

			if (data) {
				shapes.push(data[0]);
				shapeSelected = data[0];
				layerSelected = data[0].layers[0];
			}
			if (error && status !== 406) throw error;
		} catch (error) {
			if (error) {
				console.log(error);
				addErrorToast('Error while creating new device');
			}
		}
	};

	const scroll = (value) => {
		// FIXME DONT WORK
		console.log(scrollElement, 'oui');
		if (scrollElement && scrollElement.scrollBy) {
			return () => {
				scrollElement.scrollBy({ top: value, behavior: 'smooth' });
			};
		}
	};
</script>

<div class="left-scroll">
	<div class="button" on:click={scroll(-100)}>^</div>

	<div class="blocks" bind:this={scrollElement}>
		{#each shapes as shape}
			<BlockSlector bind:layerSelected bind:shape bind:shapeSelected />
		{/each}

		<div class="new-device" on:click={onNewDeviceClick}>
			<div class="title">
				<div class="plus">+</div>
				new device
			</div>
		</div>
	</div>

	<div class="button" on:click={scroll(100)}>v</div>
</div>

<style>
	.left-scroll {
		width: 100%;
		height: 100%;
		background-color: var(--light-gray);
		border-radius: 20px;
		padding: var(--spacing-s);

		display: flex;
		flex-direction: column;
	}
	.blocks::-webkit-scrollbar {
		display: none;
	}

	.blocks {
		flex: 1;
		width: 100%;

		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.button {
		width: 100%;
		padding: var(--spacing-s);
		border-radius: var(--spacing-s);
		cursor: default;
		text-align: center;
	}

	.new-device {
		cursor: default;
	}

	.new-device:hover,
	.button:hover {
		transform: scale(1.04);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.plus {
		font-size: var(--header-font-size);
		font-weight: bold;
	}

	.title {
		text-align: center;
		padding: var(--spacing-s);
		font-family: 'Agency FB', sans-serif;
		font-size: var(--font-size-l);
		font-weight: bold;
	}
</style>
