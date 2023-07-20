<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { Triangle } from '$lib/triangles/triangle';
	import { InteractionManager } from 'three.interactive';
	import type { ILayer, IShape, IStepAnimation } from '../../interfaces/interfaces';
	import { EState } from '../../interfaces/enums';
	import { RotateLeftOutlined, RotateRightOutlined } from 'svelte-ant-design-icons';
	import { _resizeCamera } from './utils';
	import { generateLightColorWave } from '../../animations/utils/couleurs';
	import { createTriangles, generateTriangles } from '$lib/triangles/utils';

	export let animationsStep: IStepAnimation[];
	export let triangles: Triangle[];
	export let state: EState;
	export let moreTriangles: Triangle[];
	export let layerSelected: ILayer | undefined;
	export let shapeSelected: IShape | undefined;
	export let editSize: number;

	let contenaire;
	let canvas;

	let sceneRotation = 0;
	let timecode = [];
	let maxTimecode = [];
	let zoom = 0;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let interactionManager: InteractionManager;
	let renderer: THREE.WebGLRenderer;

	let clicking = false;

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
		_resizeCamera(
			camera,
			zoom,
			sceneRotation,
			triangles,
			state == EState.EDITING ? moreTriangles : []
		);
	};

	const addListeners = (triangle: Triangle, colorOver: string) => {
		triangle.addEventListener('click', (target) => {
			if (!clicking) {
				clicking = true;
				onTriangleClick(target.target.triId);

				setTimeout(() => {
					clicking = false;
				}, 100);
			}
		});

		triangle.addEventListener('mouseover', (target) => {
			target.target.material.color.set(colorOver);
			target.target.position.z = 0.001;
		});

		triangle.addEventListener('mouseout', (target) => {
			target.target.material.color.set(triangle.color);
			target.target.position.z = 0;
		});
	};

	const colorLayer = (triangle: Triangle, LAYER_LENGTH: number, colorlight: string[]) => {
		if (layerSelected.leds.includes(triangle.triId)) {
			triangle.material.color.set('blue');
		} else {
			for (let i = 0; i < LAYER_LENGTH; i++) {
				if (shapeSelected?.layers[i].leds.includes(triangle.triId)) {
					triangle.material.color.set(colorlight[i]);
				}
			}
		}
	};

	const update = () => {
		if (!triangles || triangles.length === 0) {
			return;
		}

		scene.clear();
		scene.background = new THREE.Color('#e3e2e2');
		interactionManager = new InteractionManager(renderer, camera, renderer.domElement);

		for (const triangle of triangles) {
			scene.add(triangle);
			triangle.material.color.set(triangle.color);
			interactionManager.add(triangle);

			const LAYER_LENGTH = shapeSelected?.layers?.length ?? 0;
			const colorlight = generateLightColorWave(LAYER_LENGTH);

			triangle.addEventListener('click', (target) => {
				if (!clicking) {
					clicking = true;
					onTriangleClick(target.target.triId);

					setTimeout(() => {
						clicking = false;
					}, 100);
				}
			});

			triangle.addEventListener('mouseover', (target) => {
				target.target.material.color.set('red');
			});

			triangle.addEventListener('mouseout', () => {
				triangle.material.color.set(triangle.color);
				if (layerSelected && shapeSelected && state === EState.LAYERS) {
					const LAYER_LENGTH = shapeSelected?.layers?.length ?? 0;
					const colorlight = generateLightColorWave(LAYER_LENGTH);
					colorLayer(triangle, LAYER_LENGTH, colorlight);
				}
			});

			if (layerSelected && shapeSelected && state === EState.LAYERS) {
				triangle.material.color.set(triangle.color);
				colorLayer(triangle, LAYER_LENGTH, colorlight);
			}
		}

		if (state == EState.EDITING) {
			for (const triangle of moreTriangles) {
				scene.add(triangle);
				interactionManager.add(triangle);

				triangle.addEventListener('click', (target) => {
					onTriangleClick(target.target.triId);
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

		timecodeAnimation();
		resizeCamera();
	};

	const timecodeAnimation = () => {
		timecode = [];
		maxTimecode = [];
		for (const iStepAnimation of animationsStep) {
			timecode.push(0);
			maxTimecode.push(
				iStepAnimation.steps.map((x) => x.timecode).reduce((a, b) => Math.max(a, b))
			);
		}
	};

	$: {
		triangles;
		moreTriangles;
		state;
		layerSelected;
		update();
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

		for (let i = 0; i < animationsStep.length; i++) {
			if (timecode[i] > maxTimecode[i]) {
				timecode[i] = 0;
			}

			if (triangles && triangles.length > 0 && triangles[0].material && animationsStep[i] != null) {
				const step = animationsStep[i].steps.filter((x) => x.timecode === timecode[i]);

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

			timecode[i] += 1;
		}

		setTimeout(() => {
			requestAnimationFrame(animate);
		}, (1 / (animationsStep[0]?.frequency ?? 1000)) * 1000);

		renderer.render(scene, camera);
	};

	const onTriangleClick = (triangleId: string) => {
		if (state === EState.PAUSED || state === EState.PLAYING) return;

		if (state === EState.LAYERS) {
			if (!layerSelected || !shapeSelected) return;

			const LEDS_IS_ALREADY_IN_LAYER = layerSelected.leds.includes(triangleId);

			if (LEDS_IS_ALREADY_IN_LAYER) {
				layerSelected.leds = layerSelected.leds.filter((id) => id !== triangleId);
			} else {
				for (const shapeSelectedElement of shapeSelected.layers) {
					shapeSelectedElement.leds = shapeSelectedElement.leds.filter((id) => id !== triangleId);
				}

				layerSelected.leds.push(triangleId);
			}

			return;
		}

		const triangle = triangles.find((triangle) => triangle.triId === triangleId);

		if (triangle && shapeSelected) {
			// delete triangle
			if (shapeSelected.devices.length === 1) {
				return;
			}

			shapeSelected.devices = shapeSelected.devices.filter((device) => device.id !== triangleId);
			shapeSelected.devices.forEach((device) => {
				device.connected = device.connected.filter((connected) => connected.id !== triangleId);
			});

			triangles = createTriangles(shapeSelected.devices);
			moreTriangles = generateTriangles(triangles, editSize);

			shapeSelected.layers.forEach((layer) => {
				layer.leds = layer.leds.filter((id) => id !== triangleId);
			});
		} else {
			const newTriangle = moreTriangles.find((tri) => tri.triId === triangleId);

			if (
				newTriangle &&
				shapeSelected &&
				!shapeSelected.devices.some((device) => device.id === triangleId)
			) {
				shapeSelected.devices.push({
					id: newTriangle.triId,
					connected: [
						{
							id: newTriangle.triangleCreationInfo.withTriangleId,
							pin: newTriangle.triangleCreationInfo.pinConnected
						}
					],
					size: newTriangle.size
				});

				shapeSelected.devices
					.find((device) => device.id === newTriangle.triangleCreationInfo.withTriangleId)
					?.connected.push({
						id: newTriangle.triId,
						pin: newTriangle.triangleCreationInfo.inTrianglePin
					});

				newTriangle.color = 'green';

				triangles = createTriangles(shapeSelected.devices);
				moreTriangles = generateTriangles(triangles, editSize);

				layerSelected?.leds.push(newTriangle.triId);
			}
		}
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
		height: 100%;
		flex: 5;
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
