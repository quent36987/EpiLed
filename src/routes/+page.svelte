<script lang="ts">
	import { VAGUE_MODULES } from '../annimations/vague/vague';
	import PropertiesBar from '../annimations/components/PropertiesBar.svelte';

	let modules = VAGUE_MODULES;

	let createConfig = (modules) => {
		let config = {};
		modules.forEach((module) => {
			if (module.range) config[module.name] = module.range.value;
			else if (module.color) config[module.name] = module.color.value;
		});
		return config;
	};
</script>

<div>
	<PropertiesBar bind:modules />
	<button on:click={() => console.log(createConfig(modules))}>Log</button>
</div>
