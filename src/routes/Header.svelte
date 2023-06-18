<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input } from 'flowbite-svelte';
	import { supabase } from '../supabaseClient.js';
	import { onMount } from 'svelte';
	import { session } from '../store/store.js';
	import Icon from '$lib/images/logo.png';

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

<div class="header">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<img src={Icon} class="mr-3 h-6 sm:h-10" alt="Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				EPI-LED
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
			<NavLi href="/">Home</NavLi>
			<NavLi href="/devices">Devices</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/shop">Shop</NavLi>
			<NavLi href="/login">Profile</NavLi>
		</NavUl>
	</Navbar>
</div>

<style>
	.header {
		background-color: #fff;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
</style>
