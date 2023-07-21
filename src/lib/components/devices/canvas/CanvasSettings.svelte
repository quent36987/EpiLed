<script lang="ts">
    import {RotateLeftOutlined, RotateRightOutlined} from "svelte-ant-design-icons";
    import * as THREE from "three";

    export let scene: THREE.Scene;
    export let camera: THREE.PerspectiveCamera;
    export let sceneRotation: number;
    export let zoom: number;
    export let resizeCamera: () => void;


    const rotate = (value) => {
        const angle = THREE.MathUtils.degToRad(value);
        scene.rotation.z += angle;
        sceneRotation += angle;
        resizeCamera();
    };

    const editZoom = (value) => {
        camera.position.z = camera.position.z + value;
        zoom += value;
    };
</script>

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

<style>
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
