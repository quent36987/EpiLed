<script lang="ts">
	import type { ISharingShape } from '../../interfaces/interfaces';
	import image1 from '../../lib/images/logo.png';
	import { LinkOutlined } from 'svelte-ant-design-icons';
	import MiniCanvas from './MiniCanvas.svelte';
	import { createTriangles } from '$lib/triangles/utils';
	import { generateDevices } from '../../data/mockdata';

	export let shape: ISharingShape;

	//$: triangles = createTriangles(shape.shape.devices);
	let triangles = createTriangles(generateDevices(Math.floor(Math.random() * 6) + 1));
</script>

<div class="shape">
	<div class="bigger">
		<LinkOutlined />
	</div>

	<div class="canvas">
		<!--		<img src={image2} alt="" />-->
		<MiniCanvas bind:triangles />
	</div>

	<div class="shape-footer">
		<div class="image">
			<img src={image1} alt="" />
		</div>

		<div>
			<div class="title">
				{shape.shape.title}
			</div>
			<div>
				{shape.shape.owner_id}
			</div>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Work+Sans:300,400&display=swap');

	.shape {
		border-radius: var(--spacing-s);
		background-color: var(--light-gray);
		padding: var(--spacing-s);
		position: relative;
	}

	.shape:hover {
		transform: scale(1.07);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.1s ease-in-out;
	}

	.bigger {
		position: absolute;
		right: 5%;
		/*background-color: var(--light-gray);*/
		/*border-radius: var(--spacing-s);*/
	}

	.canvas {
		border-radius: var(--spacing-s);
		margin-bottom: var(--spacing-s);
		overflow: hidden;
		background-color: var(--bg-color);
	}

	.shape-footer {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		width: 100%;
		gap: var(--spacing-s);
	}

	.image {
		width: 50px;
		height: 50px;
		border-radius: var(--spacing-s);
		overflow: hidden;
	}

	.title {
		font-family: 'Work Sans', sans-serif;
		font-weight: bold;
		font-size: 1.1rem;
	}
</style>
