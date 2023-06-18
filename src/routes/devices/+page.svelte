<script lang="ts">
	import ListBlockSlector from '$lib/components/ListBlockSlector.svelte';
	import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
	import { WAVE_MODULES } from '../../annimations';

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

<div id="app">
	<div class="flex-row">
		<div id="left">
			<ListBlockSlector />
		</div>

		<div id="middle">Milieu</div>
		<div id="right">
			<PropertiesBar bind:modules />
		</div>
	</div>
	<div id="footer">Pied de page</div>
</div>

<style>
	#app {
		height: 100vh;
		width: 100vw;
	}

	#left {
		width: min-content;
		background-color: #eee;
	}

	#middle {
		background-color: #f8f8f8;
		flex-grow: 3;
	}

	#right {
		background-color: #ddd;
		flex-grow: 1;
	}

	#footer {
		grid-column: 2 / span 2;
		background-color: #eee;
	}
</style>
