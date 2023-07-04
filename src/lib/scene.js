import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const directionalLight = new THREE.DirectionalLight(0x9090aa);
directionalLight.position.set(-10, 10, -10).normalize();
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemisphereLight.position.set(1, 1, 1);
scene.add(hemisphereLight);

const shape = new THREE.Shape();

const x = 0;
const y = 0;

shape.moveTo(x - 2, y - 2);
shape.lineTo(x + 2, y - 2);
shape.lineTo(x, y + 2);

const TriangleGeometry = new THREE.ShapeGeometry(shape);

const material2 = new THREE.MeshBasicMaterial( {color: 0xf00f00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( TriangleGeometry, material2 );


scene.add( plane );



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
};



function onClick() {
    console.log('click')
    plane.material.color.set(Math.random() * 0xffffff);
}

window.addEventListener('resize', resize);
