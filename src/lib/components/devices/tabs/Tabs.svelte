<script lang="ts">
	import AlertFilled from 'svelte-ant-design-icons/AlertFilled.svelte';
	import type { IAnimation, ILayer, IShape } from '../../../../interfaces/interfaces';
	import AnimationList from '$lib/components/devices/tabs/AnimationList.svelte';
	import PropertiesBar from '$lib/components/devices/tabs/PropertiesBar.svelte';
	import { LayoutOutlined, ProjectOutlined } from 'svelte-ant-design-icons';
	import Layers from '$lib/components/devices/tabs/Layers.svelte';

	export let animations: IAnimation[];
	export let shapeSelected: IShape;
	export let layerSelected: ILayer | undefined;

	let tab = 'animation';

	$: layers = shapeSelected?.layers ?? [];
	$: animationSelected = layerSelected ? layerSelected.animation : undefined;
</script>

<div class="tabs">
	<div class="toggle-buttons">
		<button class:active={tab === 'animation'} on:click={() => (tab = 'animation')}>
			<AlertFilled class="w-5 h-5" />
			Animation
		</button>

		<button class:active={tab === 'properties'} on:click={() => (tab = 'properties')}>
			<ProjectOutlined class="w-5 h-5" />
			Properties
		</button>

		<button class:active={tab === 'layers'} on:click={() => (tab = 'layers')}>
			<LayoutOutlined class="w-5 h-5" />
			Layers
		</button>
	</div>
	<hr />
	<div class="tab">
		{#if tab === 'animation'}
			<AnimationList bind:animations bind:animationSelected bind:layerSelected />
		{:else if tab === 'properties'}
			<PropertiesBar bind:animationSelected />
		{:else if tab === 'layers'}
			<Layers bind:layers bind:layerSelected />
		{/if}
	</div>
</div>

<style>
	.tabs {
		margin-top: var(--spacing-s);
		background-color: var(--light-gray);
		padding: var(--spacing-s);
		border-radius: 20px;

		flex: 1;
		overflow-y: hidden;

		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.tab {
		flex: 1;

		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.tab::-webkit-scrollbar {
		display: none;
	}

	.toggle-buttons {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--light-gray);
		border-radius: 15px;
		padding: var(--spacing-s);
	}

	.toggle-buttons > button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-s);
		padding: 0.5rem 1rem;
		border: none;
		color: #616161;
		cursor: default;
		border-radius: 0.5rem;
		margin: 0 0.5rem;
		transition: all 0.3s;
	}

	.toggle-buttons > button.active {
		background-color: var(--bg-color);
		font-weight: bold;
	}

	.toggle-buttons > button:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
