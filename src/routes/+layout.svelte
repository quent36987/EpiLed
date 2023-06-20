<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import './styles.css';
	import '../input.css';
</script>

<div class="app">
	<Header />

	<div class="body">
		<slot />
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
	}

	.body {
		overflow: auto;
	}
</style>
