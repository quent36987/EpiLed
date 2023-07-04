import * as THREE from 'three';
import { InteractionManager } from 'three.interactive';
import {Vector2} from "three";
import {Triangle} from "$lib/mesh/triangle";
import type {IDevice} from "../interfaces/interfaces";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;





// const connectTriangle = (base, position, id) =>
// {
//     const x = base.x
//     const y = base.y
//

//
// }



const CreateTriangles =  (devices : IDevice[]) => {
    const  nostritri: Triangle[] = [];


    const vec1 = new THREE.Vector2(1, 1);
    const vec2 = new THREE.Vector2(2, 2);

// Calculer la direction de la base
    const direction = new THREE.Vector2().subVectors(vec2, vec1).normalize();

// Rotation de 60 degrés (π/3 radians) dans le sens antihoraire
    const sin60 = Math.sqrt(3) / 2;
    const cos60 = 0.5;
    const rotatedDirection = new THREE.Vector2(
        direction.x * cos60 - direction.y * sin60,
        direction.x * sin60 + direction.y * cos60
    );

// Calculer la longueur du côté du triangle équilatéral
    const sideLength = vec1.distanceTo(vec2);

// Calculer les coordonnées du premier point du sommet
    const vec3a = new THREE.Vector2().addVectors(vec1, rotatedDirection.clone().multiplyScalar(sideLength));

// Rotation de 60 degrés (π/3 radians) dans le sens horaire
    rotatedDirection.set(
        direction.x * cos60 + direction.y * sin60,
        -direction.x * sin60 + direction.y * cos60
    );

// Calculer les coordonnées du second point du sommet
    const vec3b = new THREE.Vector2().addVectors(vec1, rotatedDirection.clone().multiplyScalar(sideLength));




    const tri = new Triangle(vec1, vec2, vec3a);

    nostritri.push(tri)
    scene.add( tri );

    const tri2 = new Triangle(vec1, vec2, vec3b);

    nostritri.push(tri2)
    scene.add( tri2 );


}

CreateTriangles([])







let renderer;






const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};




export const createScene = (el) => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    resize();
    animate();

    const interactionManager = new InteractionManager(
        renderer,
        camera,
        renderer.domElement
    );
    interactionManager.add(tri);

    tri.addEventListener('click', (event) => {
        console.log('click')
        tri.material.color.set(Math.random() * 0xffffff);
    });
};



function onClick() {
    console.log('click')
    tri.material.color.set(Math.random() * 0xffffff);
}

window.addEventListener('resize', resize);
