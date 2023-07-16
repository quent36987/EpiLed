<script lang="ts">
	import { DeleteOutlined, EditOutlined, SaveOutlined } from 'svelte-ant-design-icons';
	import type { IShape } from '../../interfaces/interfaces';
	import { supabase } from '../../supabaseClient';
	import { addToast, session } from '../../store/store';

	export let shape: IShape;

	let my_session;

	session.subscribe((value) => {
		my_session = value;
	});

	const onSave = async () => {
		if (!my_session) {
			addToast({
				type: 'error',
				message: 'You must be logged in to save shapes',
				timeout: 3000,
				dismissible: true
			});
			return;
		}

		await supabase.from('shapes').upsert(shape);
		addToast({ type: 'success', message: 'Shape saved', timeout: 2000, dismissible: true });
	};

	const onEdit = async () => {
		shape.title = prompt('Enter a new name for this shape', shape.title);
		addToast({ type: 'success', message: 'Shape name updated', timeout: 2000, dismissible: true });
	};

	const onDelete = async () => {
		if (confirm('Are you sure you want to delete this?')) {
			await supabase.from('shapes').delete().match({ id: shape.id }).single();
			addToast({
				type: 'success',
				message: 'Shape deleted',
				timeout: 2000,
				dismissible: true
			});
		}
	};
</script>

<div class="toggle-buttons">
	<button class="toggle-button" on:click={onSave}>
		<SaveOutlined class="w-5 h-5 mr-1" />
		Save
	</button>
	<button class="toggle-button" on:click={onEdit}>
		<EditOutlined class="w-5 h-5 mr-1" />
		Name
	</button>
	<button class="toggle-button" on:click={onDelete}>
		<DeleteOutlined class="w-5 h-5 mr-1" />
		Delete
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
