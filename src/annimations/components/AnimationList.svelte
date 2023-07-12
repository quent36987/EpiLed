<script lang="ts">
	import type { IAnimation } from '../../interfaces/interfaces';
	import { createEventDispatcher } from 'svelte';

	export let animations: IAnimation[];
	export let animationSelected: IAnimation;

	const dispatch = createEventDispatcher();

	const onAnimationClick = (animation: IAnimation) => {
		dispatch('animationClick', animation.id);
	};
</script>

<div class="container">
	{#each animations as animation}
		<div
			class="animation {animation === animationSelected ? 'selected' : ''}"
			on:click={() => onAnimationClick(animation)}
		>
			<h3>{animation.title}</h3>
			<p class="description">{animation.description}</p>
		</div>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.animation {
		background-color: #f2f2f2;
		padding: 1rem;
		border-radius: 0.5rem;
		margin: var(--spacing-s);
		width: 100%;
		transition: all 0.3s;
		cursor: pointer;
		font-family: Arial, sans-serif;
	}

	.animation.selected {
		background-color: #cfd8dc;
	}

	.animation:hover {
		transform: scale(1.04);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>
