<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import './styles.css';
	import '../input.css';
	import Footer from './Footer.svelte';
	import Toasts from "$lib/components/toast/Toasts.svelte";
</script>

<div class="app">
	<Toasts />
	<Header />

	<div class="scroll">
		<div class="body">
			<slot />
		</div>
		<!--		<Footer />-->
	</div>
</div>

<style>
	.scroll {
		overflow-y: auto;
		height: 100%;
	}

	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.body {
		flex: 1;
		height: 100%;
	}
</style>
