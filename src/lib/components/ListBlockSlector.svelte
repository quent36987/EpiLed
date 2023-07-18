<script lang="ts" xmlns="http://www.w3.org/1999/html">
	import BlockSlector from '$lib/components/BlockSlector.svelte';
	import type { ILayer, IShape } from '../../interfaces/interfaces';
	import { supabase } from '../../supabaseClient';
	import { session } from '../../store/store';
	import { addInfoToast } from '$lib/components/toast/toast';

	export let shapes: IShape[];
	export let shapeSelected: IShape;
	export let layerSelected: ILayer | undefined;

	function handleClick(shape: IShape) {
		shapeSelected = shape;
		layerSelected = shape.layers.length > 0 ? shape.layers[0] : undefined;
	}

	let my_session;

	session.subscribe((value) => {
		my_session = value;
	});

	const onNewDeviceClick = async () => {
		const newShape: IShape = {
			id: 0,
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

		if (!my_session) {
			addInfoToast('Be careful, you need to be logged in to save your device.');

			shapes.push(newShape);
			shapeSelected = newShape;
			layerSelected = newShape.layers[0];

			return;
		}

		const title = prompt('Enter device name', 'New device');
		try {
			const { data, error, status } = await supabase
				.from('shapes')
				.insert([
					{
						title: title,
						owner_id: my_session.user.id,
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
					}
				])
				.select();

			console.log('data', data, 'error', error, 'status', status);

			if (data) {
				shapes.push(data[0]);
				shapeSelected = data[0];
				layerSelected = data[0].layers[0];
			}
			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		}
	};
</script>

<div class="blocks">
	{#each shapes as shape}
		<BlockSlector on:click={() => handleClick(shape)} bind:shape bind:shapeSelected />
	{/each}
	<div class="new-device" on:click={onNewDeviceClick}>
		<div class="title">
			<div class="plus">+</div>
			new device
		</div>
	</div>
</div>

<style>
	.blocks {
		background-color: var(--light-gray);
		margin-right: var(--spacing-s);
		border-radius: 20px;
		padding: var(--spacing-s);
	}

	.new-device {
		cursor: default;
	}

	.new-device:hover {
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
