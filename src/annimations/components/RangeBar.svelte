<script lang="ts">
	import { Range, Label } from 'flowbite-svelte';
	import type { IModule } from '../../interfaces/interfaces';

	export let module: IModule;
</script>

<div class="range-container">
	<Label class="italic">{module.title}</Label>

	<div class="flex-row center width-100 gap-s">
		<div class="slider_number">
			{module.range.min}
		</div>

		<Range
			id="range-minmax"
			min={module.range.min}
			max={module.range.max}
			bind:value={module.range.value}
		/>

		<div class="slider_number">
			{module.range.max}
		</div>
	</div>

	<p class="value">Value: {module.range.value}</p>
</div>

<style>
	.range-container {
		display: flex;
		align-items: start;
		flex-direction: column;
		justify-content: flex-start;
		padding: var(--spacing-s);
	}
	.slider_number {
		font-size: 0.8rem;
	}

	.value{
		font-size: 0.7rem;
	}
</style>
