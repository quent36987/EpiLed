<script lang="ts">
	import RangeBar from './RangeBar.svelte';
	import ColorBar from './ColorBar.svelte';
	import type { IAnimation } from '../../../../interfaces/interfaces';
	import ToggleBar from './ToggleBar.svelte';

	export let animationSelected: IAnimation | undefined;
</script>

{#each animationSelected?.modules ?? [] as module}
	<div>
		{#if module.range}
			<RangeBar bind:module />
		{:else if module.color}
			<ColorBar bind:module />
		{:else if module.toggle}
			<ToggleBar bind:module />
		{/if}
		<hr />
	</div>
{/each}

<style>
</style>
