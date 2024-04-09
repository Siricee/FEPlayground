/* eslint-disable */

/**
 * 注意： 相对相机不动的物体：添加到（add)相机的子元素下，并且将相机添加到scene中。
 * 
 * cube在世界坐标系中原点，轨道控制器只做原地旋转。
 * grid在相机眼前，而轨道控制器旋转的是相机的视角，所以相对相机位置不变。
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';


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
    DOM.appendChild(renderer.domElement);
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / -2, 1, 2000);
    camera.position.z = -15;
    camera.lookAt(0, 0, 0)
    camera.zoom = 1.2
    scene.add(camera) // checkpoint

    // CUBE
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshNormalMaterial({
        'flatShading': true // 方便我们看到每个面的颜色
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0)
    scene.add(cube);


    // GRID for 3 levels.
    let normalGrid = new THREE.GridHelper(1000, 20, 0x0000ff, 0x808080);
    normalGrid.geometry.rotateX(Math.PI / 2);
    normalGrid.material = new THREE.LineBasicMaterial({
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.5
    })
    normalGrid.position.z = -10;

    let mediumGrid = new THREE.GridHelper(1000, 80, 0x0000ff, 0x808080);
    mediumGrid.geometry.rotateX(Math.PI / 2);
    mediumGrid.material = new THREE.LineBasicMaterial({
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.5
    });
    mediumGrid.position.z = -10;
    mediumGrid.visible = false

    let miniGrid = new THREE.GridHelper(1000, 400, 0x0000ff, 0x808080);
    miniGrid.geometry.rotateX(Math.PI / 2);
    miniGrid.material = new THREE.LineBasicMaterial({
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.5
    });
    miniGrid.position.z = -10;
    miniGrid.visible = false

    mediumGrid.add(miniGrid)
    normalGrid.add(mediumGrid)


    // LABELS & FONTS & MARKER LINES
    const font = await new Promise((resolve, reject) => {
        new FontLoader().load('./GridGauge/helvetiker_regular.typeface.json', function (font) {
            resolve(font)
        });
    })

    // 3 level label and markline.
    const miniLabel = new THREE.Mesh(new TextGeometry('1x', {
        font: font,
        size: 0.8,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
    }), new THREE.MeshBasicMaterial({ color: 0xFFFF00 }))
    let miniMarkLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(2.5, 0.2, 0)]),
        new THREE.LineBasicMaterial({
            color: 0xFFFF00
        })
    )
    miniLabel.position.z = -10;
    miniMarkLine.position.z = -10;
    miniLabel.visible = false
    miniMarkLine.visible = false

    // 2 level label and markline.
    const mediumLabel = new THREE.Mesh(new TextGeometry('5x', {
        font: font,
        size: 5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
    }), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
    let mediumMarkLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(25 / 2, 0.4, 0)]),
        new THREE.LineBasicMaterial({
            color: 0x00ff00
        })
    )
    mediumLabel.position.z = -10;
    mediumMarkLine.position.z = -10;
    mediumLabel.visible = false
    mediumMarkLine.visible = false

    // 1 level label and markline.
    const normalLabel = new THREE.Mesh(new TextGeometry('20x', {
        font: font,
        size: 12,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
    }), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
    let normalMarkLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 1, 0), new THREE.Vector3(50, 1, 0)]),
        new THREE.LineBasicMaterial({
            color: 0xff0000
        })
    )
    normalLabel.position.z = -10;
    normalMarkLine.position.z = -10;
    normalLabel.visible = false
    normalMarkLine.visible = false


    const gridGroup = new THREE.Group().add(normalGrid, mediumGrid, miniGrid, miniLabel, miniMarkLine, mediumLabel, mediumMarkLine, normalLabel, normalMarkLine)
    camera.add(gridGroup);

    render()


    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", (event) => {

        const ndc = getFitPosition({ camera })
        if (camera.zoom <= 6) {

            // 标注位置，直接删无影响。x坐标-1是文字从左往右排的偏移量。
            const step = 50
            let pos = [(Math.floor(Math.abs(ndc.x) / step) - 1) * step, -Math.floor(Math.abs(ndc.y) / step) * step, -10]

            normalLabel.position.set(...pos)
            normalMarkLine.position.set(...pos)
            // end

            normalGrid.visible = normalLabel.visible = normalMarkLine.visible = true
            mediumGrid.visible = mediumLabel.visible = mediumMarkLine.visible = false
            miniGrid.visible = miniLabel.visible = miniMarkLine.visible = false



        } else if (camera.zoom > 6 && camera.zoom <= 12) {
            // 标注位置，直接删无影响
            const step = 12.5
            let pos = [(Math.floor(Math.abs(ndc.x) / step) - 1) * step, -Math.floor(Math.abs(ndc.y) / step) * step, -10]
            mediumLabel.position.set(...pos)
            mediumMarkLine.position.set(...pos)
            // end

            normalGrid.visible = normalLabel.visible = normalMarkLine.visible = false
            mediumGrid.visible = mediumLabel.visible = mediumMarkLine.visible = true
            miniGrid.visible = miniLabel.visible = miniMarkLine.visible = false


        } else if (camera.zoom > 12) {
            // 标注位置，直接删无影响
            const step = 2.5
            let pos = [(Math.floor(Math.abs(ndc.x) / step) - 1) * step, -Math.floor(Math.abs(ndc.y) / step) * step, -10]
            miniLabel.position.set(...pos)
            miniMarkLine.position.set(...pos)
            // end

            normalGrid.visible = normalLabel.visible = normalMarkLine.visible = false
            mediumGrid.visible = mediumLabel.visible = mediumMarkLine.visible = false
            miniGrid.visible = miniLabel.visible = miniMarkLine.visible = true
        }
        render()
    })
    const gui = new GUI({ container: document.getElementsByClassName('gui-container')[0] });
    gui.add({ 'Display Grid': true }, "Display Grid").onChange(val => {
        gridGroup.visible = val
        render()
    })

}

function render() {
    camera.updateProjectionMatrix()
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

/**
 * @function 获取屏幕左下角的投影矩阵
 * @param {Camera} camera 
 * @returns Vector3
 */
function getFitPosition({ camera }) {
    const far = camera.far;
    const ndc = new THREE.Vector3(-1, -1, far); // 右下角点NDC
    ndc.unproject(camera); // 转换为相机投影坐标
    ndc.applyMatrix4(camera.matrixWorldInverse) // 乘相机世界逆矩阵
    return ndc
}