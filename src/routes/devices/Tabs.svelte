<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import AlertFilled from 'svelte-ant-design-icons/AlertFilled.svelte';
	import type { IAnimation, ILayer, IShape } from '../../interfaces/interfaces';
	import AnimationList from '../../animations/components/AnimationList.svelte';
	import PropertiesBar from '../../animations/components/PropertiesBar.svelte';
	import { LayoutOutlined, ProjectOutlined } from 'svelte-ant-design-icons';
	import Layers from '../../animations/components/Layers.svelte';

	export let animations: IAnimation[];
	export let shapeSelected: IShape;
	export let layerSelected: ILayer | undefined;
	let layers: ILayer[] = [];

	$: layers = shapeSelected?.layers ?? [];
	$: animationSelected = layerSelected ? layerSelected.animation : undefined;

</script>

<div class="tabs">
	<Tabs contentClass>
		<TabItem open>
			<div slot="title" class="flex items-center gap-1">
				<AlertFilled class="w-5 h-5" />
				Animation
			</div>

			<AnimationList bind:animations bind:animationSelected bind:layerSelected />
		</TabItem>

		<TabItem>
			<div slot="title" class="flex items-center gap-1">
				<ProjectOutlined class="w-5 h-5" />
				Properties
			</div>

			<PropertiesBar bind:animation={animationSelected} />
		</TabItem>

		<TabItem>
			<div slot="title" class="flex items-center gap-1">
				<LayoutOutlined class="w-5 h-5" />
				Layers
			</div>

			<Layers bind:layers bind:layerSelected />
		</TabItem>
	</Tabs>
</div>

<style>
	.tabs {
		margin-top: var(--spacing-s);
		background-color: var(--light-gray);

		padding: var(--spacing-s);

		border-radius: 20px;
		height: min-content;
	}
</style>
