<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import * as THREE from 'three';
	import { Triangle } from '$lib/mesh/triangle';
	import { InteractionManager } from 'three.interactive';
	import type { IStepAnimation } from '../../interfaces/interfaces';
	import { EState } from '../../interfaces/enums';

	export let animation: IStepAnimation;
	export let triangles: Triangle[];
	export let state: EState;
	export let moreTriangles: Triangle[];

	let contenaire;
	let canvas;

	let timecode = 0;
	let maxTimecode = 0;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let interactionManager: InteractionManager;
	let renderer: THREE.WebGLRenderer;

	const dispatch = createEventDispatcher();

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

	const update = () => {
		if (!triangles || triangles.length === 0) {
			return;
		}

		scene = new THREE.Scene();
		scene.background = new THREE.Color('#e3e2e2');

		interactionManager = new InteractionManager(renderer, camera, renderer.domElement);

		for (const triangle of triangles) {
			scene.add(triangle);
			interactionManager.add(triangle);

			/* triangle.addEventListener('click', (target) => {
				dispatch('triangleClick', target.target.triId);
			}); */
		}

		if (state == EState.EDITING) {
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
		}

		const maxX = Math.max(...triangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
		const minX = Math.min(...triangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
		const maxY = Math.max(...triangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
		const minY = Math.min(...triangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

		camera.position.x = (maxX + minX) / 2;
		camera.position.y = (maxY + minY) / 2;

		let maxDistance = Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));
		camera.position.z = maxDistance - 1;
	};

	$: {
		triangles;
		moreTriangles;
		state;
		update();
	}

	$: {
		animation;
		if (animation && animation.steps.length > 0) {
			maxTimecode = animation.steps.map((x) => x.timecode).reduce((a, b) => Math.max(a, b));
		}
	}

	const animate = () => {
		if (state == EState.PAUSED) {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
			return;
		}

		if (state == EState.EDITING) {
			requestAnimationFrame(animate);
			if (interactionManager) {
				interactionManager.update();
			}

			renderer.render(scene, camera);
			return;
		}

		if (timecode > maxTimecode) {
			timecode = 0;
		}

		if (triangles && triangles.length > 0 && triangles[0].material && animation != null) {
			const step = animation.steps.filter((x) => x.timecode === timecode);

			for (const s of step) {
				const ids = s.ids;

				for (const id of ids) {
					const tri = triangles.filter((x) => x.triId === id)[0];

					tri.material = new THREE.MeshBasicMaterial({
						color: s.colors
					});
				}
			}
		}

		timecode += 1;

		setTimeout(() => {
			requestAnimationFrame(animate);
		}, animation.frequency * 10);

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
	.test {
		border-radius: 25px;
	}
</style>
