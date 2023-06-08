<script lang="ts">
	import type { IModule } from '../../interfaces/interfaces';
	import RangeBar from './RangeBar.svelte';
	import ColorBar from './ColorBar.svelte';

	export let modules: IModule[];
</script>

<div>
	{#each modules as module}
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
