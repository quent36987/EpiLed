<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import * as THREE from 'three';
	import { Triangle } from '$lib/mesh/triangle';
	import { InteractionManager } from 'three.interactive';

	export let triangles: Triangle[];
	export let moreTriangles: Triangle[];

	let contenaire;
	let canvas;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let interactionManager: InteractionManager;
	let renderer: THREE.WebGLRenderer;

	const dispatch = createEventDispatcher();

	onMount(() => {
		scene = new THREE.Scene();
		scene.background = new THREE.Color('#e3e2e2');
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		window.addEventListener('resize', resize);

		renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
		resize();

		update();
		animate();
	});

	const update = () => {
		if (triangles.length === 0) {
			return;
		}

		interactionManager = new InteractionManager(renderer, camera, renderer.domElement);

		for (const triangle of triangles) {
			scene.add(triangle);
			interactionManager.add(triangle);

			triangle.addEventListener('click', () => {
				dispatch('triangleClick', triangle.triId);
			});
		}

		for (const triangle of moreTriangles) {
			scene.add(triangle);
			interactionManager.add(triangle);

			triangle.addEventListener('click', (target) => {
				dispatch('triangleClick', target.target.triId);
			});

			triangle.addEventListener('mouseover', (target) => {
				target.target.material.color.setHex('blue');
			});

			triangle.addEventListener('mouseout', (target) => {
				target.target.material.color.set(triangle.color);
			});
		}

		const maxX = Math.max(...triangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
		const minX = Math.min(...triangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
		const maxY = Math.max(...triangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
		const minY = Math.min(...triangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

		camera.position.x = (maxX + minX) / 2;
		camera.position.y = (maxY + minY) / 2;

		let maxDistance = Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));
		camera.position.z = maxDistance;
	};

	$: {
		triangles;
		moreTriangles;
		update();
	}

	const animate = () => {
		requestAnimationFrame(animate);
		if (interactionManager) {
			interactionManager.update();
		}

		renderer.render(scene, camera);
	};

	const resize = () => {
		renderer.setSize(contenaire.clientWidth, contenaire.clientHeight);
		camera.aspect = contenaire.clientWidth / contenaire.clientHeight;
		camera.updateProjectionMatrix();
	};
</script>

<div id="container" bind:this={contenaire} class="width-100 height-100">
	<canvas bind:this={canvas} />
</div>

<style>
</style>
