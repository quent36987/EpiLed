<script>
    import image1 from '../../lib/images/about/proto_1.png';
    import image2 from '../../lib/images/about/proto_2.png';
	import image3 from '../../lib/images/about/proto_3.png';
	import image4 from '../../lib/images/about/proto_4.png';

    import circuit1 from '../../lib/images/about/circuits_1.png';
    import circuit2 from '../../lib/images/about/circuits_2.png';
    import circuit5 from '../../lib/images/about/circuits_5.png';
    import circuit6 from '../../lib/images/about/circuits_6.png';
    import circuit3 from '../../lib/images/about/circuits_3.png';

    const images = [image1, image2, image3, image4];
    const images2 = [circuit1, circuit2, circuit5, circuit6];
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Work+Sans:300,400&display=swap');

    body {
        background-color: #ffffff;
    }

    .header {
        background-image: url('../../lib/images/about/web-Header-Background.jpg');
        background-position: center;
        background-size: cover;
        color: #fff;
        text-align: center;
        padding: 2em 0;
        font-family: 'Work Sans', sans-serif;
        font-size: 36px;
        font-weight: 700;
    }

    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
        padding: 1em;
        font-family: 'Work Sans', sans-serif;
    }

    .text-column {
        flex: 1;
        margin-right: 1em;
        color: #363537;
        font-family: 'Work Sans', sans-serif;
        padding: 1em;
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
        font-family: 'Work Sans', sans-serif;
    }

    .github-img {
        width: 50px;
        height: 50px;
    }

    .square {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 90%;
        margin: auto;
    }

    .square img {
        width: 48%;
        height: auto;
        margin: 1%;
        border-radius: 15px;
        transform: rotate(-10deg);
        transition: transform 0.5s;
    }

    .square img:nth-child(2) {
        transform: rotate(10deg);
    }

    .square img:nth-child(3) {
        transform: rotate(-20deg);
    }

    .square img:nth-child(4) {
        transform: rotate(20deg);
    }

    .square img:hover {
        transform: rotate(0deg) scale(1.2);
        z-index: 1;
    }

    .rectangle {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 0.5em;
        width: 100%;
        margin: auto;
        position: relative;
    }

    .rectangle div {
        width: 100%;
        height: 0;
        padding-bottom: 50%;
        position: relative;
    }

    .rectangle img {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 15px;
        transform: rotate(-10deg);
        transition: transform 0.5s;
    }

    .rectangle div:nth-child(2n) img {
        transform: rotate(10deg);
    }

    .rectangle div:nth-child(2n+1) img {
        transform: rotate(-10deg);
    }

    .rectangle div:nth-child(2n) img:hover,
    .rectangle div:nth-child(2n+1) img:hover {
        transform: rotate(0deg) scale(1.2);
        z-index: 1;
    }

    .image-description {
        font-family: 'Work Sans', sans-serif;
        padding: 1em;
    }

    .lorem-section-with-image {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Work Sans', sans-serif;
        padding: 1em;
        margin-top: 1em;
    }

    .lorem-section-with-image img {
        max-width: 30%;
        height: auto;
        margin-left: 1em;
    }

    .big-image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1em;
    }

    .big-image {
        max-width: 100%;
        border-radius: 15px;
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
		<p><strong>
			This is Epileaf's SvelteKit app.
			</strong>
		</p>

		<p>
			The goal of this project is to propose an alternative to nanoleaf products. By proposing a highly configurable, easy to use product,
			we aim to make your home brighter !
		</p>

		<p>
			Beside basic informations regarding Epileaf, on this page you'll be able to find some pictures of the processes behind this project's development.
		</p>

		<p>
			Do not hesitate to check out the code on <code>Github</code>:
		</p>
		<div class="github-container">
			<a href="https://github.com/quent36987/svelte-test">
				<img class="github-img" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
			</a>
		</div>
	</div>

	<div class="square">
		{#each images as image, i (i)}
			<img src={image} alt={`Prototype image ${i + 1}`} on:mouseover={() => setHoveredIndex(i)} on:mouseout={() => setHoveredIndex(null)} />
		{/each}
	</div>

	<div class="rectangle">
		{#each images2 as image2, i (i)}
			<div>
				<img src={image2} alt={`Circuit design ${i + 1}`} on:mouseover={() => setHoveredIndex(i)} on:mouseout={() => setHoveredIndex(null)} />
			</div>
		{/each}
	</div>

	<div class="image-description">
		<p>
			<br/>
			<strong>Who are we ?</strong>. <br/>
		</p>
		<p>
			<br/>
			We are a team made from Epita's 2024 IF promotion. Currently in ING2 (almost in ING3!), we work on this project as a team under the supervision of <code>Christian Diaconu</code>. 
		</p>
	</div>

	<div class="lorem-section-with-image">
		<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam maximus mauris mollis, efficitur mauris et, convallis tellus. 
			Aenean sed condimentum leo, nec condimentum lorem. Sed in auctor nisl, nec facilisis elit. Morbi non arcu ac sem pharetra accumsan at non erat. </p>
	</div>
	<div class="big-image-container">
        <img class="big-image" src="{circuit3}" alt="Circuit design 3" />
    </div>
</div>
