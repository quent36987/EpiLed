<script lang="ts">
	import type { ISharingShape } from '../../interfaces/interfaces';
	import ShapesStore from './ShapesStore.svelte';
	import { sharingShapes } from '../../data/mockdata';
	import { ArrowKeyLeft, ArrowKeyRight } from 'flowbite-svelte';
	import { SearchOutlined } from 'svelte-ant-design-icons';

	let shapesStored: ISharingShape[] = sharingShapes;
</script>

<div class="store">
	<div class="header">
		<input type="text" placeholder="Search shapes" class="search" />

		<div class="button flex-row center">
			<SearchOutlined />
			Search
		</div>
	</div>

	<div class="shapes">
		{#each shapesStored as shape}
			<ShapesStore bind:shape />
		{/each}
	</div>

	<div class="buttons">
		<div class="flex-row center button">
			<ArrowKeyLeft />
			Prev
		</div>
		<div class="flex-row center button">
			<ArrowKeyRight />
			Next
		</div>
	</div>
</div>

<style>
	.store {
		padding: var(--spacing-l);
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-s);
		margin-bottom: var(--spacing-l);
	}

	.search {
		border-radius: var(--spacing-s);
		padding: var(--spacing-s) var(--spacing-m);
		width: 40%;
	}

	.shapes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-auto-columns: minmax(300px, 1fr);
		grid-gap: var(--spacing-l);
	}

	.buttons {
		margin-top: var(--spacing-l);
		display: flex;
		justify-content: center;
		gap: var(--spacing-l);
		flex-direction: row;
		align-items: center;
	}

	.button {
		background-color: var(--light-gray);
		border-radius: var(--spacing-s);
		padding: var(--spacing-s) var(--spacing-m);
	}

	.button:hover {
		transform: scale(1.07);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.1s ease-in-out;
	}
</style>
