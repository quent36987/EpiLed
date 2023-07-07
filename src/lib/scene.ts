import * as THREE from 'three';
import { Vector2 } from 'three';
import { Triangle } from '$lib/mesh/triangle';
import type { IDevice } from '../interfaces/interfaces';
import {devices} from "../data/mockdata";
import {InteractionManager} from "three.interactive";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

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
            const triangle = new Triangle(
                dev.id,
                pin[0],
                pin[1],
                vec3
            );

            triangles.push(triangle);

            const new_device = devices.filter((x) => x.id === dev.id)[0];
            if (new_device)
                rec(devices, triangles, new_device);
		}
	}
};

const CreateTriangles = (devices: IDevice[]) => {
	const nostritri: Triangle[] = [];

	const firstDevice = devices[0];

	const firstTriangle = new Triangle(
		firstDevice.id,
		new Vector2(0, 0),
		new Vector2(1, 0),
		new Vector2(0.5, 1)
	);

	nostritri.push(firstTriangle);

	rec(devices, nostritri, firstDevice);

	for (const tri of nostritri) {
        scene.add(tri);
        interactionManager.add(tri);
         tri.addEventListener('click', target => {
             target.target.material.color.set(Math.random() * 0xffffff);
         });
    }
};

let renderer: THREE.WebGLRenderer;

const animate = () => {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

const resize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};

// @ts-ignore
export const createScene = (el) => {
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
	resize();
	animate();

	interactionManager = new InteractionManager(renderer, camera, renderer.domElement);


    CreateTriangles(devices);
};


window.addEventListener('resize', resize);
