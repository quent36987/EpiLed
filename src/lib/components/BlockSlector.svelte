<script lang="ts">
	import Icon from '../images/test2.png';
	import type { IShape } from '../../interfaces/interfaces';

	export let shape: IShape;
	export let shapeSelected: IShape;
</script>

<div class="block {shapeSelected === shape ? 'isSelected' : ''}" on:click>
	<div>
		<!-- FIXMe by something else -->
		<img src={Icon} alt="icon" />
	</div>
	<div class="title">
		{shape.title}
	</div>
</div>

<style>
	.block {
		padding: var(--spacing-s);
		border-radius: var(--spacing-s);
		cursor: default;
	}

	.block:hover {
		transform: scale(1.04);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.block.isSelected {
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
