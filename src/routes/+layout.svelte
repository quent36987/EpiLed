<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import './styles.css';
	import '../input.css';
</script>

<div class="app">
	<Header />

	<slot />

</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

</style>
