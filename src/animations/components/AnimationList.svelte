<script lang="ts">
	import type { IAnimation, ILayer } from '../../interfaces/interfaces';

	export let animations: IAnimation[];
	export let animationSelected: IAnimation | undefined;
	export let layerSelected: ILayer | undefined;

	let filter = '';

	$: animationsFiltered = animations.filter((animation) =>
		animation.title.toUpperCase().includes(filter.toUpperCase())
	);

	const onAnimationClick = (animation: IAnimation) => {
		console.log('animation click', layerSelected);

		if (layerSelected) {
			//create a copie of the animation
			const copyAnimation: IAnimation = {
				id: animation.id,
				title: animation.title,
				description: animation.description,
				modules: JSON.parse(JSON.stringify(animation.modules)),
				function: animation.function
			};

			// same but simpler
			// const copyAnimation: IAnimation = {
			// 	...animation,
			// 	modules: JSON.parse(JSON.stringify(animation.modules))
			// };

			layerSelected.animation = copyAnimation;
			animationSelected = layerSelected.animation;
		}
	};
</script>

<div class="container">
	<input type="text" placeholder="Search animation" class="search" bind:value={filter} />

	{#each animationsFiltered as animation}
		<div
			class="animation {animationSelected && animation.id === animationSelected.id
				? 'selected'
				: ''}"
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

	.search {
		border-radius: var(--spacing-s);
		padding: var(--spacing-s) var(--spacing-m);
		width: 100%;
		margin-top: var(--spacing-s);
		margin-right: var(--spacing-s);
		margin-left: var(--spacing-s);
	}

	.animation {
		background-color: #f2f2f2;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-top: var(--spacing-s);
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
