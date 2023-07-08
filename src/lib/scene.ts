import * as THREE from 'three';
import { Vector2 } from 'three';
import { Triangle } from '$lib/mesh/triangle';
import type { IAnimation, IDevice, ILed } from '../interfaces/interfaces';
import { devices } from '../data/mockdata';
import { InteractionManager } from 'three.interactive';
import { createWaveAnimation } from '../annimations';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

let interactionManager: InteractionManager;

const findVectorTriangle = (vec1: Vector2, vec2: Vector2, vecOpose: Vector2) => {
	const direction = new THREE.Vector2().subVectors(vec2, vec1).normalize();

	const sin60 = Math.sqrt(3) / 2;
	const cos60 = 0.5;
	const rotatedDirection = new THREE.Vector2(
		direction.x * cos60 - direction.y * sin60,
		direction.x * sin60 + direction.y * cos60
	);

	const sideLength = vec1.distanceTo(vec2);

	const vec3a = new THREE.Vector2().addVectors(
		vec1,
		rotatedDirection.clone().multiplyScalar(sideLength)
	);

	rotatedDirection.set(
		direction.x * cos60 + direction.y * sin60,
		-direction.x * sin60 + direction.y * cos60
	);

	const vec3b = new THREE.Vector2().addVectors(
		vec1,
		rotatedDirection.clone().multiplyScalar(sideLength)
	);

	// return the vector that is not closest to vecOpose
	return vecOpose.distanceTo(vec3a) < vecOpose.distanceTo(vec3b) ? vec3b : vec3a;
};

const givemepin = (triangle: Triangle, pin: number) => {
	switch (pin) {
		case 1:
			return [triangle.vec1, triangle.vec2, triangle.vec3];
		case 2:
			return [triangle.vec2, triangle.vec3, triangle.vec1];
		case 3:
			return [triangle.vec3, triangle.vec1, triangle.vec2];
		default:
			return [triangle.vec1, triangle.vec2, triangle.vec3];
	}
};

const rec = (devices: IDevice[], triangles: Triangle[], device: IDevice) => {
	console.log('device:', device.id);
	for (const dev of device.connected) {
		const results = triangles.filter((x) => x.triId === dev.id);

		if (results.length === 0) {
			// 2 point grace pos et aliutre pos ^^
			// recup verc oposé
			// ajoute
			const parent = triangles.filter((x) => x.triId === device.id)[0];
			const pin = givemepin(parent, dev.pin);

			const vec3 = findVectorTriangle(pin[0], pin[1], pin[2]);

			// FIXME need to look  order of three vector with the devices[]

			const pin2 = devices
				.filter((x) => x.id === dev.id)[0]
				.connected.filter((x) => x.id === device.id)[0].pin;

			let vecs = [pin[0], pin[1], vec3];

			switch (pin2) {
				case 3:
					vecs = [vec3, pin[0], pin[1]];
					break;
				case 1:
					vecs = [pin[0], pin[1], vec3];
					break;
				case 2:
					vecs = [pin[1], vec3, pin[0]];
					break;
			}

			console.log('connected ?', device.id, '(', dev.pin, ')', '=>', dev.id, '(', pin2, ')');
			//console.log('vec de ',dev.id, vecs[0],vecs[1],vecs[2] )

			const triangle = new Triangle(dev.id, vecs[1], vecs[0], vecs[2]);

			triangles.push(triangle);
			console.log('add', triangle.triId);

			const new_device = devices.filter((x) => x.id === dev.id)[0];
			if (new_device) rec(devices, triangles, new_device);
		}
	}
};
const nostritri: Triangle[] = [];
let leds: ILed[] = [];
let annim: IAnimation = null;
let maxtime = 0;


const CreateTriangles = (devices: IDevice[]) => {
	const firstDevice = devices[0];

	const firstTriangle = new Triangle(
		firstDevice.id,
		new Vector2(0, 0),
		new Vector2(-0.8, 1),
		findVectorTriangle(new Vector2(0, 0), new Vector2(-0.8, 1), new Vector2(-1, 0))
	);

	nostritri.push(firstTriangle);

	rec(devices, nostritri, firstDevice);

	for (const tri of nostritri) {
		console.log('scene', tri.triId);

		scene.add(tri);
		interactionManager.add(tri);
		tri.addEventListener('click', (target) => {
			target.target.material.color.set(Math.random() * 0xffffff);
		});

		// calculate the midle of the triangle
		const midle = new Vector2(
			(tri.vec1.x + tri.vec2.x + tri.vec3.x) / 3,
			(tri.vec1.y + tri.vec2.y + tri.vec3.y) / 3
		);

		leds.push({
			id: tri.triId,
			forme: 'e',
			position: [midle.x, midle.y],
			rotation: 0,
			pin: [1]
		});

	}

	const toto = {
		frequency: 60,
		colorCount: 100,
		firstColor: '#ff0000',
		endColor: '#ff0044',
		partCount: 6,
		colorCountBetweenStep: 1,
		rotation: 40,
	};

	annim = createWaveAnimation(leds, toto);

	maxtime = annim.steps.map((x) => x.timecode).reduce((a, b) => Math.max(a, b));

	console.log(annim, leds.length);


	//add a black circle on 0 0
	const geometry = new THREE.CircleGeometry(0.1, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
	const circle = new THREE.Mesh(geometry, material);
	scene.add(circle);

	const maxX = Math.max(...nostritri.map((x) => Math.max(x.vec1.x, x.vec2.x, x.vec3.x)));
	const minX = Math.min(...nostritri.map((x) => Math.min(x.vec1.x, x.vec2.x, x.vec3.x)));
	const maxY = Math.max(...nostritri.map((x) => Math.max(x.vec1.y, x.vec2.y, x.vec3.y)));
	const minY = Math.min(...nostritri.map((x) => Math.min(x.vec1.y, x.vec2.y, x.vec3.y)));

	console.log('maxX', maxX);
	camera.position.x = (maxX + minX) / 2;
	camera.position.y = (maxY + minY) / 2;
};

let renderer: THREE.WebGLRenderer;

let timecode = 0;


const animate = () => {
	//sleep 1s
	if (timecode > maxtime) {
		timecode = 0;
	}
	if (nostritri.length > 0 && nostritri[0].material && annim != null) {

		const step = annim.steps.filter((x) => x.timecode === timecode);

		for (const s of step) {
			const ids = s.ids;

			for (const id of ids) {
				const tri = nostritri.filter((x) => x.triId === id)[0];
				tri.material = new THREE.MeshBasicMaterial({
					color: s.colors
				});
			}
		}
	}

	timecode += 1;

	// wait 1s
	setTimeout(() => {
		requestAnimationFrame(animate);
	}, 100);

	renderer.render(scene, camera);
};

const resize = (contenaire) => {
	renderer.setSize(contenaire.clientWidth, contenaire.clientHeight);
	camera.aspect = contenaire.clientWidth / contenaire.clientHeight;

	camera.updateProjectionMatrix();
};

export const createScene = (el, annim) => {
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
	resize(document.getElementById('container'));
	animate();

	interactionManager = new InteractionManager(renderer, camera, renderer.domElement);

	CreateTriangles(devices);
};

window.addEventListener('resize', () => resize(document.getElementById('container')));
