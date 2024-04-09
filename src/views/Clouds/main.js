/* eslint-disable  */
import * as THREE from "three";
import { vertexShader, fragmentShader } from './shaders'
import Stats from "stats.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

let scene, renderer, camera;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let mouseX = 0, mouseY = 0
const clock = new THREE.Clock()
const stats = new Stats();
const params = {
    speed:1
}


export function run(DOM = null) {
    init(DOM);
    setGUI();
    render();
}

function init(DOM) {
    const [width, height] = [DOM.clientWidth, DOM.clientHeight];
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    DOM.appendChild(renderer.domElement);
    document.getElementsByClassName('stat-container')[0].appendChild(stats.dom)

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x326696)
    camera = new THREE.PerspectiveCamera(30, width / height, 1, 18000);
    camera.position.z = 6000;

    scene.add(camera);

    const texture = new THREE.TextureLoader().load('./Clouds/cloud10.png');
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture },
            fogColor: { value: new THREE.Color(0x4584b4) },
            fogNear: { value: -100 },
            fogFar: { value: 3000 },
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide
    });
    material.depthWrite = false;
    material.depthTest = false;
    material.transparent = true;

    // const length = 64
    // const plane = new THREE.Mesh(new THREE.PlaneGeometry(length, length), material);
    // for (let i = 0; i < 8000; i++) {

    //     let T = new THREE.Matrix4().makeTranslation(Math.random() * 1000 - 500, -Math.random() * Math.random() * 200 - 15, i)
    //     let R = new THREE.Matrix4().makeRotationZ(Math.random() * Math.PI)
    //     const scale = Math.random() * Math.random() * 1.5 + 0.5
    //     let S = new THREE.Matrix4().makeScale(scale, scale, 1)
    //     let matrix = new THREE.Matrix4().multiply(T).multiply(R).multiply(S)
    //     let cloneP = plane.clone()
    //     cloneP.applyMatrix4(matrix)

    //     scene.add(cloneP)
    // }

    let count = 8000 // 多少片云实例，同时也是 MergedMesh 的 z 轴宽度（0-count）
    const size = 64 // 每片云的尺寸
    const MergedMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(size, size), material, count)

    for (let i = 0; i < count; i++) {

        let T = new THREE.Matrix4().makeTranslation(Math.random() * 1000 - 500, -Math.random() * Math.random() * 200 - 15, i)
        let R = new THREE.Matrix4().makeRotationZ(Math.random() * Math.PI)
        const scale = Math.random() * Math.random() * 1.5 + 0.5
        let S = new THREE.Matrix4().makeScale(scale, scale, 1)
        let matrix = new THREE.Matrix4().multiply(T).multiply(R).multiply(S)

        MergedMesh.setMatrixAt(i, matrix)
    }
    
    MergedMesh.instanceMatrix.needsUpdate = true;
    scene.add(MergedMesh)


    //  两片云交替，防止突兀切换
    const MergedMeshCopy = MergedMesh.clone();
    MergedMeshCopy.position.z = -count;
    scene.add(MergedMeshCopy);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener("resize", onResize);
}
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.25;
    mouseY = (event.clientY - windowHalfY) * 0.15;
}

function render() {
    if (camera) {
        let position = (clock.getElapsedTime() * 10) % 8000;
        camera.position.x += (mouseX - (camera.position.x || 0)) * 0.01
        camera.position.y += (-mouseY - (camera.position.y || 0)) * 0.01
        camera.position.z = -position*params.speed + 6000;
    }
    if (!renderer) return
    stats.update();
    renderer.render(scene, camera)
    requestAnimationFrame(render);
}
function setGUI() {
    const gui = new GUI({
        container: document.getElementsByClassName('gui-container')[0]
    });
    gui.add(params,'speed',0.1,10,0.1).name('flight speed')
}

function onResize() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    windowHalfX = width / 2;
    windowHalfY = height / 2;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
export function dispose() {
    window.removeEventListener("resize", onResize);
    scene.traverse((child) => {
        if (child.material) {
            child.material.dispose();
        }
        if (child.geometry) {
            child.geometry.dispose();
        }
        child = null;
    });
    renderer.forceContextLoss();
    renderer.renderLists.dispose()
    renderer.dispose();
    scene.clear();
    scene = null;
    camera = null;
    renderer.domElement = null;
    renderer = null;
}