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
        super.material =  new THREE.MeshBasicMaterial( {color: 0xf00f00, side: THREE.DoubleSide} );
        super.updateMorphTargets();
    }



}
