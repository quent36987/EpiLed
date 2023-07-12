<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import AlertFilled from 'svelte-ant-design-icons/AlertFilled.svelte';
	import type { IAnimation } from '../../interfaces/interfaces';
	import AnimationList from '../../annimations/components/AnimationList.svelte';
	import PropertiesBar from '../../annimations/components/PropertiesBar.svelte';
	import { createEventDispatcher } from 'svelte';
	import { ProjectOutlined, SettingOutlined } from 'svelte-ant-design-icons';

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

<div class="tabs">
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
				<ProjectOutlined class="w-5 h-5" />
				Properties
			</div>

			<PropertiesBar bind:animation={animationSelected} />
		</TabItem>

		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<SettingOutlined class="w-5 h-5" />
				Settings
			</div>
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
