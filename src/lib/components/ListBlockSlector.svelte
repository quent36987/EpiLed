<script lang="ts" xmlns="http://www.w3.org/1999/html">
	interface IBlock {
		id: number;
		title: string;
		isSelected: boolean;
	}

	import BlockSlector from '$lib/components/BlockSlector.svelte';

	let blocks: IBlock[] = [
		{
			id: 1,
			title: 'Block',
			isSelected: false
		},
		{
			id: 2,
			title: 'Chambre',
			isSelected: true
		},
		{
			id: 3,
			title: 'Salon',
			isSelected: false
		}
	];

	function handleClick(blockId: IBlock) {
		blocks = blocks.map((block) => {
			if (block.id === blockId) {
				return {
					...block,
					isSelected: !block.isSelected
				};
			}
			return {
				...block,
				isSelected: false
			};
		});
	}
</script>

<div class="blocks">
	{#each blocks as block}
		<BlockSlector {...block} on:click={() => handleClick(block.id)} />
	{/each}
	<div class="new-device">
		<div class="title">
			<div class="plus">+</div>
			new device
		</div>
	</div>
</div>

<style>
	.blocks {
		background-color: var(--light-gray);
		margin-right: var(--spacing-s);
		border-radius: 20px;
		padding: var(--spacing-s);
	}

	.new-device {
		cursor: default;
	}

	.new-device:hover {
		transform: scale(1.04);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.plus {
		font-size: var(--header-font-size);
		font-weight: bold;
	}

	.title {
		text-align: center;
		padding: var(--spacing-s);
		font-family: 'Agency FB', sans-serif;
		font-size: var(--font-size-l);
		font-weight: bold;
	}
</style>
