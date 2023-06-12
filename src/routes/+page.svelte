<script lang="ts">
	import PropertiesBar from '../annimations/components/PropertiesBar.svelte';
	import { WAVE_MODULES } from '../annimations/index.js';

	let modules = WAVE_MODULES;

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
