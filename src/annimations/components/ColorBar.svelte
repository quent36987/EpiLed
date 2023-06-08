<script lang="ts">
	import type { IModule } from '../../interfaces/interfaces';

	export let module: IModule;
</script>

<div class="range-container">
	<input type="color" bind:value={module.color.value} />
	
	<div class="italic">
		{module.title}
		{module.color.value}
	</div>
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
