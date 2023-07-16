<script lang="ts">
	import { BorderOutlined } from 'svelte-ant-design-icons';

	export let size: number;
</script>

<div class="toggle-buttons">
	<button class="toggle-button {size === 1 ? 'active' : ''}" on:click={() => (size = 1)}>
		<BorderOutlined class="w-4 h-4 mr-1" />
		1
	</button>
	<button class="toggle-button {size === 2 ? 'active' : ''}" on:click={() => (size = 2)}>
		<BorderOutlined class="w-5 h-5 mr-1" />
		2
	</button>
	<button class="toggle-button {size === 3 ? 'active' : ''}" on:click={() => (size = 3)}>
		<BorderOutlined class="w-6 h-6 mr-1" />
		3
	</button>
	<button class="toggle-button {size === 4 ? 'active' : ''}" on:click={() => (size = 4)}>
		<BorderOutlined class="w-7 h-7 mr-1" />
		4
	</button>
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

	.toggle-button {
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

	.toggle-button.active {
		background-color: var(--bg-color);
		font-weight: bold;
	}

	.toggle-button:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
