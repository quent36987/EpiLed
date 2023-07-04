import * as THREE from "three";
import type {Vector2} from 'three';

export class Triangle extends THREE.Mesh {

    shape: THREE.Shape;

    constructor(p1: Vector2, p2: Vector2, p3: Vector2) {
        super();
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
