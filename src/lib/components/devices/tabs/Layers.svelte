<script lang="ts">
	import type { ILayer } from '../../../../interfaces/interfaces';
	import { AppstoreAddOutlined } from 'svelte-ant-design-icons';
	import { generateLightColorWave } from '../../../../animations/utils/couleurs';

	export let layers: ILayer[];
	export let layerSelected: ILayer;

	const addLayer = () => {
		const newLayer: ILayer = {
			id: layers.length,
			leds: []
		};

		layers.push(newLayer);
		layerSelected = newLayer;
	};

	const onLayerSelected = (layer: ILayer) => {
		layerSelected = layer;
	};

	const color = (i: number, selected: boolean) => {
		const colorlight = generateLightColorWave(layers.length);

		if (selected) {
			return 'blue';
		}

		return colorlight[i];
	};
</script>

<div>
	<div class="button flex-row center" on:click={addLayer}>
		<AppstoreAddOutlined />
		Add a new layer
	</div>

	{#each layers as layer, i}
		<div
			class="layer"
			class:selected={layerSelected === layer}
			on:click={() => onLayerSelected(layer)}
		>
			<div>
				<h3>Layer {i}</h3>
				<p class="description">{layer.animation ? layer.animation.title : 'None animation yet'}</p>
			</div>

			<div style="background-color: {color(i, layerSelected === layer)}" class="color" />
		</div>
	{/each}
</div>

<style>
	.layer {
		background-color: #f2f2f2;
		border-radius: var(--spacing-s);
		padding: var(--spacing-s) var(--spacing-m);
		margin-bottom: var(--spacing-s);

		transition: all 0.3s;
		cursor: pointer;
		font-family: Arial, sans-serif;

		display: flex;
		flex-direction: row;
		gap: var(--spacing-l);
		align-items: center;
		justify-content: start;
	}

	.color {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
	}

	.layer.selected {
		background-color: #cfd8dc;
	}

	h3 {
		font-size: 1.2rem;
		font-weight: bold;
		margin-bottom: var(--spacing-s);
	}

	.description {
		font-size: 0.9rem;
		color: #616161;
		margin-top: 0.5rem;
	}

	.button {
		background-color: var(--bg-color);
		border-radius: var(--spacing-s);
		padding: var(--spacing-s) var(--spacing-l);
		margin-bottom: var(--spacing-s);
		margin-top: var(--spacing-s);
		gap: var(--spacing-s);
		width: max-content;
	}

	.button:hover,
	.layer:hover {
		transform: scale(1.05);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.1s ease-in-out;
	}
</style>
