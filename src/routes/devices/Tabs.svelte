<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import AlertFilled from 'svelte-ant-design-icons/AlertFilled.svelte';
	import type { IAnimation } from '../../interfaces/interfaces';
	import AnimationList from '../../annimations/components/AnimationList.svelte';
	import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
	import { createEventDispatcher } from 'svelte';

	export let animations: IAnimation[];
	export let animationSelected: IAnimation | undefined;

	const dispatch = createEventDispatcher();

	const onAnimationClick = (event) => {
		dispatch('animationClick', event.detail);
	};

	$: {
		animationSelected;
		dispatch('updateModule');
	}
</script>

<Tabs contentClass>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<AlertFilled class="w-5 h-5" />
			Animation
		</div>

		<AnimationList bind:animations bind:animationSelected on:animationClick={onAnimationClick} />
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
				/></svg
			>
			Properties
		</div>

		<PropertiesBar bind:animation={animationSelected} />
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
				/></svg
			>
			Settings
		</div>
	</TabItem>
</Tabs>

<style>
</style>
