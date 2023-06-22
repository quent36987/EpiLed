<script lang="ts">
	import { Tabs, TabItem, Card } from 'flowbite-svelte';
	import AlertFilled from 'svelte-ant-design-icons/AlertFilled.svelte';
</script>

<Tabs contentClass>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<AlertFilled class="w-5 h-5" />
			Animation
		</div>

		<div class="animation-list">

				<div class="flex-row gap-l card">
					<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Smooth wave</h5>
					<a href="/" class="inline-flex items-center text-primary-600 hover:underline">
						By Quent3455
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
					</a>
				</div>

				<div class="flex-row gap-l card">
					<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Smooth wave</h5>
					<a href="/" class="inline-flex items-center text-primary-600 hover:underline">
						By Quent3455
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
					</a>
				</div>


		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
				/></svg
			>
			Properties
		</div>
		<slot name="dashboard" />
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
				/></svg
			>
			Settings
		</div>
	</TabItem>
</Tabs>

<style>
	.animation-list{
		margin-top: var(--spacing-s);
		display:flex;
		flex-direction: column;
		gap: var(--spacing-s);

	}

	.card{
		padding: var(--spacing-m);
		justify-content: space-between;
		background-color: #c95d5d;
		border-radius: var(--border-radius);
	}

	.card:hover{
		background-color: var(--color-bg-1)
	}
</style>
