<script lang="ts">
	import type { ISharingShape } from '../../interfaces/interfaces';
	import ShapesStore from './ShapesStore.svelte';
	import { sharingShapes } from '../../data/mockdata';

	let shapesStored: ISharingShape[] = sharingShapes;
</script>

<div class="store">
	{#each shapesStored as shape}
		<ShapesStore bind:shape />
	{/each}
</div>

<style>
	.store {
		/*display: flex;*/
		/*flex-wrap: wrap;*/
		/*gap: var(--spacing-s);*/
		/*flex-direction: row;*/
		/*align-items: start;*/
		/*justify-content: start;*/
		/*padding: var(--spacing-s);*/

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-auto-columns: minmax(300px, 1fr);
		grid-gap: var(--spacing-l);
		padding: var(--spacing-l);
	}
</style>
