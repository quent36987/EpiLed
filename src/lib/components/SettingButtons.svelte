<script lang="ts">
	import { Button, ButtonGroup } from 'flowbite-svelte';
</script>

<div class="buttons">
	<ButtonGroup class="py-4 button-group">
		<div class:active={true}>
			<Button outline color={'green'}>On</Button>
		</div>
	</ButtonGroup>
	<ButtonGroup class="py-4 button-group">
		<Button outline color="yellow">Load</Button>
		<Button outline color="blue">Save</Button>
	</ButtonGroup>
	<ButtonGroup class="py-4 button-group">
		<Button outline color="purple">Delete</Button>
	</ButtonGroup>
</div>

<style>
	.buttons {
		display: flex;
		justify-content: space-evenly;
	}
</style>
