<script lang="ts">
	import RangeBar from './RangeBar.svelte';
	import ColorBar from './ColorBar.svelte';
	import type { IAnimation } from '../../interfaces/interfaces';

	export let animation: IAnimation;
</script>

<div class="property-bar">
	<div class="title">
		{animation.title}
	</div>
	{#each animation.modules as module}
		<div>
			{#if module.range}
				<RangeBar bind:module />
			{/if}

			{#if module.color}
				<ColorBar bind:module />
			{/if}
			<hr />
		</div>
	{/each}
</div>

<style>
	.title {
		font-size: 1.2em;
		font-weight: bold;
	}
</style>
