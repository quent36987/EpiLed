<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import Account from '$lib/components/Account.svelte';
	import { session } from '../../store/store';

	let my_session;

	session.subscribe(value => {
		my_session = value;
	});
</script>

<div >
	{#if !my_session}
		<Auth />
	{:else}
		<Account session={my_session} />
	{/if}
</div>
