<script lang="ts">
	import Icon from '../images/image.png';

	export let title: string;
	export let isSelected: boolean;
</script>

<div class="block {isSelected ? 'isSelected' : ''}" on:click>
	<div>
		<!-- FIXMe by something else -->
		<img src={Icon} alt="icon" />
	</div>
	<div class="title">
		{title}
	</div>
</div>

<style>
	.block {
		padding: var(--spacing-s);
		border-right: black 1px solid;
		border-bottom: black 1px solid;
	}

	.block.isSelected {
		border-right: none;
		background-color: white;
	}

	.title {
		text-align: center;
		padding: var(--spacing-s);
		font-family: 'Agency FB', sans-serif;
		font-size: var(--font-size-l);
		font-weight: bold;
	}
</style>
