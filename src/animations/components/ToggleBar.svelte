<script lang="ts">
	import type { IModule } from '../../interfaces/interfaces';
	import Switch from '$lib/components/common/Switch.svelte';

	export let module: IModule;
</script>

<div class="range-container">
	<Switch bind:value={module.toggle.value} design="slider" label={module.title} />
</div>

<style>
	.range-container {
		display: flex;
		align-items: start;
		flex-direction: row;
		justify-content: flex-start;
		padding: var(--spacing-s);
		gap: var(--spacing-s);
	}
</style>
