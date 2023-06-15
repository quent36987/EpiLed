<style>
	#app {

	  height: 100vh;
	  width: 100vw;
	}

	#header {
	  grid-column: 1 / span 3;
	  background-color: #ddd;
	}

	#left {
	  grid-row: 2 / span 2;
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

	  let logConfig = () => {
		  console.log(createConfig(modules));
	  };
  </script>

  <div id="app">
	<div id="header">Entête</div>
	<div id="left">Gauche</div>
	  <div class="flex-row">

	<div id="middle" >Milieu</div>
	<div id="right" >
	  <PropertiesBar bind:modules />
	</div>

	  </div>
	<div id="footer">Pied de page</div>
  </div>
