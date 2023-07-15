<script lang="ts" xmlns="http://www.w3.org/1999/html">
	import { createEventDispatcher } from 'svelte';
	import BlockSlector from '$lib/components/BlockSlector.svelte';
	import type { IShape } from '../../interfaces/interfaces';

	const dispatch = createEventDispatcher();
	export let shapes: IShape[];
	export let shapeSelected: IShape;

	function handleClick(shape: IShape) {
		shapeSelected = shape
	}

	function onNewDeviceClick() {
		dispatch('newDevice');
	}
</script>

<div class="blocks">
	{#each shapes as shape}
		<BlockSlector on:click={() => handleClick(shape)} bind:shape={shape}  bind:shapeSelected={shapeSelected} />
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
