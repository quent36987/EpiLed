<script>
	import image1 from './proto_1.png';
	import image2 from './proto_2.png';
	import image3 from './proto_3.png';
	import image4 from './proto_4.png';
	import image5 from './proto_5.png';

	import circuit1 from './circuits_1.png';
	import circuit2 from './circuits_2.png';
	import circuit3 from './circuits_3.png';
	import circuit4 from './circuits_4.png';

	let index = 0;
	const images = [image1, image2, image3, image4, image5];
	const images2 = [circuit1, circuit2, circuit3, circuit4];
	const captions = [
		"Final version of Epileaf",
		"Final version of Epileaf",
		"3D View : 1",
		"3D View : 2",
		"3D View : 3",
	];

	function previous() {
		if (index > 0) {
			index--;
		} else {
			index = images.length - 1;
		}
	}

	function next() {
		if (index < images.length - 1) {
			index++;
		} else {
			index = 0;
		}
	}
</script>

<style>
	.header {
		background-image: url('./web-Header-Background.jpg');
		background-position: center;
		background-size: cover;
		color: #fff;
		text-align: center;
		padding: 2em 0;
	}

	.container {
		display: flex;
		justify-content: space-between;
		padding: 1em;
	}

	.text-column {
		flex: 1;
		margin-right: 1em;
		color: #363537;
		font-family: Arial, sans-serif;
		padding: 1em;
		background-color: #f9f9f9;
	}

	.text-column h1 {
		color: blue;
	}

	.text-column p {
		margin-bottom: 1em;
		color: black;
	}

	.text-column a {
		color: #1f77b4;
		text-decoration: none;
	}

	.text-column a:hover {
		color: #2ca02c;
	}

	.github-container {
		display: flex;
		justify-content: center;
	}

	.github-img {
		width: 50px;
		height: 50px;
	}

	.slider {
		flex: 1;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 2em;
	}

	.slider img {
		max-width: 70%;
		height: auto;
	}

	.image-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.image-container button {
		margin: 0 1em;
	}

	.caption {
		text-align: center;
		margin-bottom: 1em;
		color: #9467bd;
	}

	.mosaic {
		display: flex;
		justify-content: space-around;
		flex-wrap: nowrap;
		overflow: auto;
		padding: 1em 0;
	}

	.mosaic img {
		width: 23%; /* Adjust this value to control the size of the images */
		height: auto;
		margin: 0.5em;
	}
</style>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="header">
	<h1>About this App</h1>
</div>

<div class="container">
	<div class="text-column">
		<p>
			This is Epileaf's SvelteKit app.
		</p>

		<p>
			The goal of this project is to propose an alternative to nanoleaf products. By proposing a highly configurable, easy to use product,
			we aim to make your home brighter !
		</p>

		<p>
			Beside basic informations regarding Epileaf, on this page you'll be able to find some pictures of the processes behind this project's developpement.
		</p>

		<p>
			Do not hesitate to check out the code on GitHub:
		</p>
		<div class="github-container">
			<a href="https://github.com/quent36987/svelte-test">
				<img class="github-img" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
			</a>
		</div>
	</div>

	<div class="slider">
		<p class="caption">{captions[index]}</p>
		<div class="image-container">
			<button on:click={previous}>←</button>
			<img src={images[index]} alt="Prototype image" />
			<button on:click={next}>→</button>
		</div>
	</div>
</div>

<div class="mosaic">
	{#each images2 as image2 (index)}
		<img src={image2} alt={`Circuit design ${index + 1}`} />
	{/each}
</div>
