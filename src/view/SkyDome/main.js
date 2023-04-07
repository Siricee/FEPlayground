/* eslint-disable */

/**
 * 注意： 相对相机不动的物体：添加到（add)相机的子元素下，并且将相机添加到scene中。
 * 
 * cube在世界坐标系中原点，轨道控制器只做原地旋转。
 * grid在相机眼前，而轨道控制器旋转的是相机的视角，所以相对相机位置不变。
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


export function run(DOM = null) {
    init(DOM);
}
let scene, renderer;
let camera;
let controls;

async function init(DOM) {
    const [width, height] = [DOM.clientWidth, DOM.clientHeight]

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.cullFaceModes = THREE.CullFaceBack;
    DOM.appendChild(renderer.domElement);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        40,
        width / height,
        1,
        1000
    );
    camera.position.set(- 60, 7, 60);
    camera.lookAt(0, 4, 0);
    camera.zoom = 1
    scene.add(camera) // checkpoint

    // CUBE
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshNormalMaterial({
        'flatShading': true // 方便我们看到每个面的颜色
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 5 / 2, 0)
    scene.add(cube);

    // GroundProjectedSkybox
    const params = {
        height: 20,
        radius: 200
    }

    const hdrLoader = new RGBELoader();
    const skyHDRTexture = await hdrLoader.loadAsync('./SkyDome/blouberg_sunrise_2_1k.hdr');
    skyHDRTexture.mapping = THREE.EquirectangularReflectionMapping;
    const skytexture = new THREE.TextureLoader().load("./SkyDome/env.jpg")

    const skybox = new GroundProjectedSkybox(skyHDRTexture, params);
    skybox.scale.setScalar(100);
    scene.add(skybox);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.enablePan = false
    controls.maxPolarAngle = Math.PI / 2.2
    controls.addEventListener("change", (event) => {
        render()
    })

    const gui = new GUI({ container: document.getElementsByClassName('gui-container')[0] });
    gui.add(params, 'height', 20, 50, 0.1).name('Skybox height').onChange(() => {
        skybox.height = params.height;
        render();
    });
    gui.add(params, 'radius', 200, 600, 0.1).name('Skybox radius').onChange(() => {
        skybox.radius = params.radius;
        render();
    });
    // 切换背景图
    let timer = 0
    gui.add({
        toggleEnv: () => {
            skybox.material.uniforms.map.value = timer % 2 === 1 ? skytexture : skyHDRTexture
            timer += 1
            render()
        }
    }, 'toggleEnv')

    render()
}

function render() {
    renderer.render(scene, camera);
}

export function dispose() {
    scene.traverse((child) => {
        if (child.material) {
            child.material.dispose()
        } if (child.geometry) {
            child.geometry.dispose()
        }
        child = null
    })
    scene.clear()
    renderer.forceContextLoss()
    renderer.dispose()
    scene = null
    camera = null
    renderer.domElement = null
    renderer = null
}
