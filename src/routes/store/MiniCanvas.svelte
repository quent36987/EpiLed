<script lang="ts">
	import { Triangle } from '$lib/triangles/triangle';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

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
		let maxX = Math.max(...triangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
		let minX = Math.min(...triangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
		let maxY = Math.max(...triangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
		let minY = Math.min(...triangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

		const rotatedMaxX = maxX * Math.cos(sceneRotation) - maxY * Math.sin(sceneRotation);
		const rotatedMinX = minX * Math.cos(sceneRotation) - minY * Math.sin(sceneRotation);
		const rotatedMaxY = maxX * Math.sin(sceneRotation) + maxY * Math.cos(sceneRotation);
		const rotatedMinY = minX * Math.sin(sceneRotation) + minY * Math.cos(sceneRotation);

		camera.position.x = (rotatedMaxX + rotatedMinX) / 2;
		camera.position.y = (rotatedMaxY + rotatedMinY) / 2;

		camera.position.z = Math.max(
			Math.max(Math.abs(minX), Math.abs(maxY)),
			Math.max(Math.abs(maxX), Math.abs(minY))
		);
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
	<canvas bind:this={canvas} class="test" />
</div>

<style>
</style>
