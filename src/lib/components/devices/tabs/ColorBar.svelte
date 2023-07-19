<script lang="ts">
	import type { IModule } from '../../../../interfaces/interfaces';

	export let module: IModule;

	let debouncedValue = module.color.value;

	const change = () => {
		module.color.value = debouncedValue;
	};
</script>

<div class="range-container">
	<input type="color" bind:value={debouncedValue} on:change={change} />

	<div class="italic">
		{module.title}
		{debouncedValue}
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
