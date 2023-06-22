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
				<Button outline color="dark" size="sm" href="/login">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    Sign In
                </Button>
			{/if}

			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1">
			<NavLi href="/">
                <Button outline color="dark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"><path d="M20 12H4M20 12a8 8 0 11-16 0 8 8 0 0116 0zM12 2a10 10 0 00-5 19.47M12 2a10 10 0 015 19.47"></path></svg>
                    Home
                </Button>
            </NavLi>
			<NavLi href="/devices">
                <Button outline color="dark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"><path d="M3 10h18M12 1v6m-9 5h18"></path></svg>
                    Devices
                </Button>
            </NavLi>
			<NavLi href="/about">
                <Button outline color="dark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    About
                </Button>
            </NavLi>
			<NavLi href="/shop">
                <Button outline color="dark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path></svg>
                    Shop
                </Button>
            </NavLi>
			<NavLi href="/login">
                <Button outline color="dark">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    Profile
                </Button>
            </NavLi>
		</NavUl>
	</Navbar>
</div>

<style>
	.header {
		background-color: #fff;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
</style>
