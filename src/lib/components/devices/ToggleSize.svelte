<script lang="ts">
	import { BorderOutlined } from 'svelte-ant-design-icons';

	export let size: number;
</script>

<div class="toggle-buttons">
	{#each [1, 2, 3, 4] as num}
		<button class:active={size === num} on:click={() => (size = num)}>
			<BorderOutlined class={`w-${num + 3} h-${num + 3} mr-1`} />
			{num}
		</button>
	{/each}
</div>

<style>
	.toggle-buttons {
		display: flex;
		justify-content: center;
		background-color: var(--light-gray);
		border-radius: 15px;
		margin-top: var(--spacing-s);
		padding: var(--spacing-s);
		width: min-content;
	}

	.toggle-buttons > button {
		display: flex;
		align-items: center;
		justify-content: center;
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
