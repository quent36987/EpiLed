<script lang="ts">
	import { Triangle } from '$lib/triangles/triangle';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { _resizeCamera } from '$lib/components/devices/canvas/utils';

	export let triangles: Triangle[];
	let contenaire;
	let canvas;
	let sceneRotation = 0;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;

	onMount(() => {
		scene = new THREE.Scene();
		scene.background = new THREE.Color('var(--light-gray)');
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		window.addEventListener('resize', resize);

		renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

		update();
		animate();
		resize();
	});

	const resizeCamera = () => {
		_resizeCamera(camera, 0, sceneRotation, triangles, []);
	};

	const update = () => {
		if (!scene || !triangles || triangles.length === 0) {
			return;
		}

		scene.clear();
		scene.background = new THREE.Color('var(--bg-color)');

		for (const triangle of triangles) {
			scene.add(triangle);
		}

		resizeCamera();
	};

	$: {
		triangles;
		update();
	}

	const animate = () => {
		setTimeout(() => {
			requestAnimationFrame(animate);
		}, 1000);

		renderer.render(scene, camera);
	};

	const resize = () => {
		renderer.setSize(contenaire.clientWidth, contenaire.clientHeight);
		camera.aspect = contenaire.clientWidth / contenaire.clientHeight;
		camera.updateProjectionMatrix();
	};
</script>

<div id="container" bind:this={contenaire} class="height-100">
	<canvas bind:this={canvas} class="canvas" />
</div>

<style>
</style>
