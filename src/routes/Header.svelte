<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input } from 'flowbite-svelte';
	import { supabase } from '../supabaseClient.js';
	import { onMount } from 'svelte';
	import { session } from '../store/store.js';
	import Icon from '$lib/images/logo.png';
	import {
		BulbOutlined,
		EuroCircleOutlined,
		ExclamationCircleOutlined,
		HomeOutlined,
		LoginOutlined,
		LogoutOutlined,
		ProfileOutlined
	} from 'svelte-ant-design-icons';

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
	<Navbar navClass="w-full px-4 py-0.5" fluid let:hidden let:toggle>
		<NavBrand href="/">
			<img src={Icon} class="mr-2 h-7 sm:h-9" alt="Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				EPI-LED
			</span>
		</NavBrand>
		<div class="flex md:order-2">
			{#if my_session}
				<Button size="sm" on:click={signOut}>
					<LogoutOutlined class="w-5 h-5 mr-1" />
					Sign Out
				</Button>
			{:else}
				<Button outline color="dark" size="sm" href="/login">
					<LoginOutlined class="w-5 h-5 mr-1" />
					Sign In
				</Button>
			{/if}

			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1">
			<NavLi href="/">
				<div class="link">
					<HomeOutlined class="w-5 h-5" />
					Home
				</div>
			</NavLi>
			<NavLi href="/devices">
				<div class="link">
					<BulbOutlined class="w-5 h-5" />
					Device
				</div>
			</NavLi>
			<NavLi href="/about">
				<div class="link">
					<ExclamationCircleOutlined class="w-5 h-5" />
					About
				</div>
			</NavLi>
			<NavLi href="/store">
				<div class="link">
					<EuroCircleOutlined class="w-5 h-5" />
					Store
				</div>
			</NavLi>
			<NavLi href="/login">
				<div class="link">
					<ProfileOutlined class="w-5 h-5" />
					Profile
				</div>
			</NavLi>
		</NavUl>
	</Navbar>
</div>

<style>
	.header {
		background-color: #fff;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
	.link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-s);
	}
</style>
