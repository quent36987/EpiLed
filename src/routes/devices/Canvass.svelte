<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { Triangle } from '$lib/mesh/triangle';
	import { InteractionManager } from 'three.interactive';
	import type { IAnimation } from '../../interfaces/interfaces';

	export let annim: IAnimation;
	export let triangles: Triangle[];

	let el;
	let maxtime = 0;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let interactionManager: InteractionManager;
	let renderer: THREE.WebGLRenderer;
	let timecode = 0;

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 8;
		window.addEventListener('resize', () => resize(document.getElementById('container')));

		renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
		resize(document.getElementById('container'));

		update();
        animate();
	});

	const update = () => {
		if (triangles.length === 0) {
			return;
		}

		for (const tri of triangles) {
			scene.add(tri);
		}
		//interactionManager = new InteractionManager(renderer, camera, renderer.domElement);

		const maxX = Math.max(...triangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
		const minX = Math.min(...triangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
		const maxY = Math.max(...triangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
		const minY = Math.min(...triangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

		camera.position.x = (maxX + minX) / 2;
		camera.position.y = (maxY + minY) / 2;
	};

	$: {
        triangles;
        console.log('eeeee')
		update();
	}

    $: {
        annim;
        console.log('wwww');
        maxtime = annim.steps.map((x) => x.timecode).reduce((a, b) => Math.max(a, b));
    }

	const animate = () => {
		if (timecode > maxtime) {
			timecode = 0;
		}

		if (triangles.length > 0 && triangles[0].material && annim != null) {
			const step = annim.steps.filter((x) => x.timecode === timecode);

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
		}, annim.frequency * 10);

		renderer.render(scene, camera);
	};

	const resize = (contenaire) => {
		renderer.setSize(contenaire.clientWidth, contenaire.clientHeight);
		camera.aspect = contenaire.clientWidth / contenaire.clientHeight;
		camera.updateProjectionMatrix();
	};
</script>

<div id="container" class="width-100 height-100">
	<canvas bind:this={el} />
</div>
