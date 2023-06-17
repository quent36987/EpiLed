<script lang="ts">
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

<div>
	{#each blocks as block}
		<BlockSlector {...block} on:click={() => handleClick(block.id)} />
	{/each}
</div>

<style>
</style>
