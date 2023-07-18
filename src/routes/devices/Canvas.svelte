<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import * as THREE from 'three';
	import { Triangle } from '$lib/triangles/triangle';
	import { InteractionManager } from 'three.interactive';
	import type { ILayer, IStepAnimation } from '../../interfaces/interfaces';
	import { EState } from '../../interfaces/enums';
	import { RotateLeftOutlined, RotateRightOutlined } from 'svelte-ant-design-icons';

	export let animation: IStepAnimation;
	export let triangles: Triangle[];
	export let state: EState;
	export let moreTriangles: Triangle[];
	export let layerSelected: ILayer;

	let contenaire;
	let canvas;
	let sceneRotation = 0;
	let timecode = 0;
	let maxTimecode = 0;
	let zoom = 0;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let interactionManager: InteractionManager;
	let renderer: THREE.WebGLRenderer;

	let clicking = false;

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

	const resizeCamera = () => {
		let maxX = Math.max(...triangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
		let minX = Math.min(...triangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
		let maxY = Math.max(...triangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
		let minY = Math.min(...triangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

		if (state == EState.EDITING) {
			const maxX2 = Math.max(...moreTriangles.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
			const minX2 = Math.min(...moreTriangles.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
			const maxY2 = Math.max(...moreTriangles.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
			const minY2 = Math.min(...moreTriangles.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

			maxX = Math.max(maxX, maxX2);
			minX = Math.min(minX, minX2);
			maxY = Math.max(maxY, maxY2);
			minY = Math.min(minY, minY2);
		}

		const rotatedMaxX = maxX * Math.cos(sceneRotation) - maxY * Math.sin(sceneRotation);
		const rotatedMinX = minX * Math.cos(sceneRotation) - minY * Math.sin(sceneRotation);
		const rotatedMaxY = maxX * Math.sin(sceneRotation) + maxY * Math.cos(sceneRotation);
		const rotatedMinY = minX * Math.sin(sceneRotation) + minY * Math.cos(sceneRotation);

		camera.position.x = (rotatedMaxX + rotatedMinX) / 2;
		camera.position.y = (rotatedMaxY + rotatedMinY) / 2;

		let maxDistance = Math.max(
			Math.max(Math.abs(minX), Math.abs(maxY)),
			Math.max(Math.abs(maxX), Math.abs(minY))
		);
		camera.position.z = Math.max(maxDistance + zoom, 1);
	};

	const update = () => {
		if (!triangles || triangles.length === 0) {
			return;
		}

		scene.clear();
		scene.background = new THREE.Color('#e3e2e2');

		interactionManager = new InteractionManager(renderer, camera, renderer.domElement);

		for (const triangle of triangles) {
			if (layerSelected && state === EState.LAYERS) {
				if (layerSelected.leds.includes(triangle.triId)) {
					triangle.material.color.set('blue');
				} else {
					triangle.material.color.set(triangle.color);
				}
			}

			scene.add(triangle);
			interactionManager.add(triangle);

			triangle.addEventListener('click', (target) => {
				console.log('clickTriangle');
				target.stopPropagation();

				if (!clicking) {
					clicking = true;
					dispatch('deleteTriangle', target.target.triId);

					setTimeout(() => {
						clicking = false;
					}, 100);
				}
			});

			triangle.addEventListener('mouseover', (target) => {
				target.target.material.color.set('red');
			});

			triangle.addEventListener('mouseout', (target) => {
				const IN_LAYER =
					layerSelected &&
					state === EState.LAYERS &&
					layerSelected.leds.includes(target.target.triId);

				target.target.material.color.set(IN_LAYER ? 'blue' : triangle.color);
			});
		}

		if (state == EState.EDITING) {
			for (const triangle of moreTriangles) {
				scene.add(triangle);
				interactionManager.add(triangle);

				triangle.addEventListener('click', (target) => {
					dispatch('triangleClick', target.target.triId);
					target.stopPropagation();
				});

				triangle.addEventListener('mouseover', (target) => {
					target.target.material.color.set('blue');
					target.target.position.z = 0.1;
				});

				triangle.addEventListener('mouseout', (target) => {
					target.target.material.color.set(triangle.color);
					target.target.position.z = 0;
				});
			}
		}

		resizeCamera();
	};

	$: {
		triangles;
		moreTriangles;
		state;
		layerSelected;
		update();
	}

	$: {
		animation;
		if (animation && animation.steps.length > 0) {
			maxTimecode = animation.steps.map((x) => x.timecode).reduce((a, b) => Math.max(a, b));
		}
	}

	const editZoom = (value) => {
		camera.position.z = camera.position.z + value;
		zoom += value;
	};

	const animate = () => {
		if (state == EState.PAUSED) {
			requestAnimationFrame(animate);

			renderer.render(scene, camera);
			return;
		}

		if (state == EState.EDITING || state === EState.LAYERS) {
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

					if (tri) {
						tri.material = new THREE.MeshBasicMaterial({
							color: s.colors
						});
					}
				}
			}
		}

		timecode += 1;

		setTimeout(() => {
			requestAnimationFrame(animate);
		}, animation?.frequency * 10 ?? 100);

		renderer.render(scene, camera);
	};

	const resize = () => {
		renderer.setSize(contenaire.clientWidth, contenaire.clientHeight);
		camera.aspect = contenaire.clientWidth / contenaire.clientHeight;
		camera.updateProjectionMatrix();
	};

	const rotate = (value) => {
		const angle = THREE.MathUtils.degToRad(value);
		scene.rotation.z += angle;
		sceneRotation += angle;
		resizeCamera();
	};
</script>

<div id="container" bind:this={contenaire} class="height-100">
	<canvas bind:this={canvas} class="test" />

	<div class="zooms">
		<div class="zoom" on:click={() => rotate(-5)}>
			<RotateRightOutlined />
		</div>
		<div class="zoom" on:click={() => rotate(5)}>
			<RotateLeftOutlined />
		</div>

		<div class="zoom" on:click={() => editZoom(-1)}>+</div>
		<div class="zoom" on:click={() => editZoom(1)}>-</div>
	</div>
</div>

<style>
	#container {
		position: relative;
	}

	.test {
		border-radius: 25px;
	}

	.zooms {
		position: absolute;
		bottom: 0;
		right: 10px;
		display: flex;
		flex-direction: row;
		z-index: 5;
	}

	.zoom {
		cursor: default;
		background-color: var(--bg-color);
		border-radius: 50%;
		width: 30px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 5px;
	}

	.zoom:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
