import * as THREE from "three";
import type {Vector2} from 'three';

export class Triangle extends THREE.Mesh {

    triId: string
    shape: THREE.Shape
    vec1: Vector2
    vec2: Vector2
    vec3: Vector2

    constructor(triID: string, p1: Vector2, p2: Vector2, p3: Vector2) {
        super();
        this.triId = triID;
        this.vec1 = p1;
        this.vec2 = p2;
        this.vec3 = p3;

        this.shape = new THREE.Shape();
        this.shape.moveTo(p1.x, p1.y);
        this.shape.lineTo(p2.x, p2.y);
        this.shape.lineTo(p3.x, p3.y);

        // Fill parents fields
        super.geometry = new THREE.ShapeGeometry(this.shape);

        const id = parseInt(this.triId, 10);

        const colors = [
            'red',
            'green',
            'blue',
            'yellow',
            'orange',
            'purple',
            'pink',
            'red',
            'grey',
            'red',
            'grey',
            'blue',
            'yellow'
        ]

        super.material =  new THREE.MeshBasicMaterial( {
            color : colors[id], side: THREE.DoubleSide
        } );


        // add a small cercle in the middle of the vec1
        const circle = new THREE.CircleGeometry( 0.1, 32 );
        const material = new THREE.MeshBasicMaterial( { color: colors[id] } );
        const circleMesh = new THREE.Mesh( circle, material );


        super.updateMorphTargets();


    }
}
