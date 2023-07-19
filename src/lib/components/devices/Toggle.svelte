<script lang="ts">
	import { EditOutlined, PauseCircleOutlined, PlayCircleOutlined } from 'svelte-ant-design-icons';
	import { EState } from '../../../interfaces/enums.js';

	export let state: EState;
</script>

<div class="toggle-buttons">
	<button class:active={state === EState.PLAYING} on:click={() => (state = EState.PLAYING)}>
		<PlayCircleOutlined tabindex="-1" class="w-5 h-5 mr-1" /> Play
	</button>

	<button class:active={state === EState.PAUSED} on:click={() => (state = EState.PAUSED)}>
		<PauseCircleOutlined class="w-5 h-5 mr-1" /> Pause
	</button>

	<button class:active={state === EState.EDITING} on:click={() => (state = EState.EDITING)}>
		<EditOutlined class="w-5 h-5 mr-1" /> Shape
	</button>

	<button class:active={state === EState.LAYERS} on:click={() => (state = EState.LAYERS)}>
		<EditOutlined class="w-5 h-5 mr-1" /> Layers
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
