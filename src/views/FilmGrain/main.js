/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { vertexShader, fragmentShader } from './shader'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


export function run(DOM = null) {
    init(DOM);
}

let scene, camera, renderer, controls,
    composer, customPass, PassArgument = {
        enable: true,
        amount: 0.0,
        depth: 0.075, // 0.16,
    }

function init(DOM) {

    const [width, height] = [DOM.clientWidth, DOM.clientHeight];
    renderer = new THREE.WebGLRenderer({ antialias: true, toneMapping: THREE.NeutralToneMapping });
    renderer.outputColorSpace = THREE.NoColorSpace; // 适配材质摄影照片 关闭色彩空间

    renderer.setSize(width, height);
    DOM.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
    camera.position.set(0, 0, 7)
    scene.add(camera);


    const texture = new THREE.TextureLoader().load("https://photo.tuchong.com/29442098/f/955138231.jpg");

    const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture,
    })

    const geometry = new THREE.PlaneGeometry(3, 4.5, 200, 200)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)


    //COMPOSER
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);


    //custom shader pass
    const FilmGrainEffect = {
        uniforms: {
            tDiffuse: { value: texture },
            amount: { value: PassArgument.amount },
            depth: { value: PassArgument.depth }
        },
        vertexShader,
        fragmentShader,
    }

    customPass = new ShaderPass(FilmGrainEffect);
    customPass.renderToScreen = true;
    composer.addPass(customPass);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false

    const gui = new GUI({ container: document.getElementsByClassName('gui-container')[0] });

    gui.add(PassArgument, 'enable').name('enable').onChange(value => {
        PassArgument.enable = value
        if (value) {
            composer.addPass(customPass)
        } else {
            composer.removePass(customPass)
        }
        render();
    })
    gui.add(PassArgument, 'amount', 0, 3, 0.01).name('amount').onChange(value => {
        PassArgument.amount = value
    })
    gui.add(PassArgument, 'depth', 0, 0.3, 0.001).name('depth').onChange(value => {
        PassArgument.depth = value
    })


    render();
    window.addEventListener("resize", onResize);
}

function render() {
    if (!composer) return
    customPass.uniforms["amount"].value = PassArgument.amount;
    customPass.uniforms["depth"].value = PassArgument.depth;
    composer.render();
    requestAnimationFrame(render)
}


function onResize() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    controls.update();
}

export function dispose() {
    window.removeEventListener("resize", onResize);
    if (scene) {
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
        scene = null;
    }
    if (renderer) {
        renderer.forceContextLoss();
        renderer.dispose();
        renderer.domElement = null;
        renderer = null;
    }
}
