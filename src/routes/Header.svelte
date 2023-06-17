<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input } from 'flowbite-svelte';
	import { supabase } from '../supabaseClient.js';
	import { onMount } from 'svelte';
	import { session } from '../store/store.js';

	let my_session = null;
	session.subscribe((value) => {
		my_session = value;
	});

	onMount(() => {
		supabase.auth.getSession().then(({ data }) => {
			console.log(data);
			session.set(data.session);
		});

		supabase.auth.onAuthStateChange((_event, _session) => {
			console.log(_session);
			session.set(_session);
		});
	});

	function signOut() {
		supabase.auth.signOut();
	}
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
			src="https://flowbite.com/docs/images/logo.svg"
			class="mr-3 h-6 sm:h-9"
			alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Flowbite
		</span>
	</NavBrand>
	<div class="flex md:order-2">
		{#if my_session}
			<Button size="sm" on:click={signOut}>Sign Out</Button>
		{:else}
			<Button size="sm" href="/login">Sign In</Button>
		{/if}

		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/services">Services</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/login">Mon profile</NavLi>
	</NavUl>
</Navbar>

<style>
</style>
