<script lang="ts">
	import RangeBar from './RangeBar.svelte';
	import ColorBar from './ColorBar.svelte';
	import type { IAnimation } from '../../interfaces/interfaces';
	import ToggleBar from "./ToggleBar.svelte";

	export let animation: IAnimation | undefined;
</script>

<div class="property-bar">
	{#if animation}
		{#each animation.modules as module}
			<div>
				{#if module.range}
					<RangeBar bind:module />
				{/if}

				{#if module.color}
					<ColorBar bind:module />
				{/if}

				{#if module.toggle}
					<ToggleBar bind:module />
				{/if}
				<hr />
			</div>
		{/each}
	{/if}
</div>

<style>
</style>
