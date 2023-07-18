<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import AlertFilled from 'svelte-ant-design-icons/AlertFilled.svelte';
	import type { IAnimation, IShape } from '../../interfaces/interfaces';
	import AnimationList from '../../animations/components/AnimationList.svelte';
	import PropertiesBar from '../../animations/components/PropertiesBar.svelte';
	import { createEventDispatcher } from 'svelte';
	import { LayoutOutlined, ProjectOutlined } from 'svelte-ant-design-icons';
	import Layers from '../../animations/components/Layers.svelte';

	export let animations: IAnimation[];
	export let animationSelected: IAnimation | undefined;
	export let shape: IShape;

	$: layers = shape?.layers ?? [];

	const dispatch = createEventDispatcher();

	const onAnimationClick = (event) => {
		dispatch('animationClick', event.detail);
	};

	$: {
		animationSelected;
		console.log(animationSelected?.modules);
		dispatch('updateModule');
	}
</script>

<div class="tabs">
	<Tabs contentClass>
		<TabItem open>
			<div slot="title" class="flex items-center gap-1">
				<AlertFilled class="w-5 h-5" />
				Animation
			</div>

			<AnimationList bind:animations bind:animationSelected on:animationClick={onAnimationClick} />
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

			<Layers bind:layers />
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
