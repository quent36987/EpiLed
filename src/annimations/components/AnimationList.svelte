<script lang="ts">
	import type { IAnimation } from '../../interfaces/interfaces';

	export let animations: IAnimation[];

	const onAnimationClick = (animation: IAnimation) => {
		console.log('animation click', animation.title, animation.id);
	};
</script>

<div class="animation-list">
	{#each animations as anim}
		<div class="flex-row gap-l card" on:click={() => onAnimationClick(anim)}>
			<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
				{anim.title}
			</h5>
			<a href="/" class="inline-flex items-center text-primary-600 hover:underline">
				By Quent3455
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 ml-2"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/></svg
				>
			</a>
		</div>
	{/each}
</div>

<style>
	.animation-list {
		margin-top: var(--spacing-s);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	.card {
		padding: var(--spacing-m);
		justify-content: space-between;
		background-color: #c95d5d;
		border-radius: var(--border-radius);
	}

	.card:hover {
		background-color: var(--color-bg-1);
	}
</style>
