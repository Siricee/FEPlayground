/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GeometryControls } from './GeometryControls'


export function run(DOM = null) {
    init(DOM);
    render();
}

let scene, camera, renderer;
let teapot
let teapotCopy
let orbit, transformControl


function init(DOM) {
    const [width, height] = [DOM.clientWidth, DOM.clientHeight];
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    DOM.appendChild(renderer.domElement);


    const gui = new GUI({ container: document.getElementsByClassName('gui-container')[0] });

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
    camera.position.set(40, 40, -40)
    scene.add(camera);

    let grid = new THREE.GridHelper(1000, 100, 0x888888, 0x444444)
    grid.ignoreRayCasted = true
    grid.position.y = -1

    scene.add(grid);

    const material = new THREE.MeshNormalMaterial({
        flatShading: true, // 方便我们看到每个面的颜色
    });

    const geometry = new TeapotGeometry(4);
    teapot = new THREE.Mesh();
    scene.add(teapot);

    teapot.up = new THREE.Vector3(1, 1, 1)

    const box = new THREE.Box3();
    teapot.geometry.computeBoundingBox();
    box.copy(teapot.geometry.boundingBox)
    const helper = new THREE.Box3Helper(box, 0xffff00);
    teapot.add(helper);

    const geometry_copy = new TeapotGeometry(1);
    teapotCopy = new THREE.Mesh(geometry_copy, material);
    teapotCopy.position.x = 8
    teapotCopy.position.z = 8
    scene.add(teapotCopy)



    let ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight)

    orbit = new OrbitControls(camera, renderer.domElement);
    
    transformControl = new GeometryControls(
        camera,
        renderer.domElement
    )
    document.addEventListener("keydown", (event) => {
        if (event.repeat) {
            return false;
        }

        if (event.key === "s") {
            transformControl.mode = "scale";
            return false;
        }

        if (event.key === "r") {
            transformControl.mode = "rotate";
            return false;
        }

        if (event.key === "t") {
            transformControl.mode = "translate";
            return false;
        }
    });
    // 局部变换
    transformControl.setSpace('local')
    // 变换阻尼
    // transformControl.setTranslationSnap(3);
    // transformControl.setRotationSnap(THREE.MathUtils.degToRad(15));
    // transformControl.setScaleSnap(0.5);

    transformControl.addEventListener('dragging-changed', function (event) {

        orbit.enabled = !event.value;

    });

    scene.add(transformControl);
    transformControl.attach(teapot);

    transformControl.addEventListener('objectChange', () => {
        let beforeM = new THREE.Matrix4().copy(teapot.matrix)
        teapot.updateMatrix()
        let afterM = new THREE.Matrix4().copy(teapot.matrix)

        teapotCopy.geometry.applyMatrix4(beforeM.invert())
        teapotCopy.geometry.applyMatrix4(afterM)
    });


    gui.add({
        click: () => {
            const _geometry = teapotCopy.geometry.clone()
            let color = generateRandomColor().toString().toLowerCase()

            const material = new THREE.MeshBasicMaterial({ color: color })
            let compare = new THREE.Mesh(_geometry, material)

            compare.position.set(teapotCopy.position.x, teapotCopy.position.y, teapotCopy.position.z)

            scene.add(compare)

        }
    }, 'click').name('Instanced Mesh')

    render();
    window.addEventListener("resize", onResize);

}

function test() {
    let beforePos = new THREE.Vector3().setFromMatrixPosition(teapot.matrix) // 本次调用坐标更新前
    teapot.updateMatrix()
    let afterPos = new THREE.Vector3().setFromMatrixPosition(teapot.matrix) // 本次调用坐标更新后
    let transPos = new THREE.Vector3().subVectors(afterPos, beforePos) // 本次调用坐标更新差值
    console.log('test called  ', transPos)
}
function generateRandomColor() {
    // 定义十六进制颜色值的字符集
    const hexValues = '0123456789ABCDEF';

    // 生成随机的六位十六进制颜色代码
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += hexValues[Math.floor(Math.random() * 16)];
    }

    return color;
}


function render() {
    if (!renderer) return
    // if (_gizmoControls) _gizmoControls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

function onResize() {
    const [width, height] = [window.innerWidth, window.innerHeight];
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
    scene.clear();
    renderer.forceContextLoss();
    renderer.dispose();
    scene = null;
    camera = null;
    renderer.domElement = null;
    renderer = null;
}