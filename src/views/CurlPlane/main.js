/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import curlPlane from "./curl";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

export function run(DOM = null) {
    init(DOM);
}

let scene, camera, renderer, controls;

function init(DOM) {
    const [width, height] = [DOM.clientWidth, DOM.clientHeight];
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    DOM.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
    camera.position.set(0, 0, 7)
    scene.add(camera);

    const texture = new THREE.TextureLoader().load("https://images.unsplash.com/photo-1712324014968-018a63a4d0e8?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            texture1: { value: texture },
            u_curl: { value: { x: 1.2, y: 0.5 } },
            u_size: { value: 0.5 },
            u_flip: { value: 0 },
        },
        vertexShader:/* glsl */`
                varying vec2 vUv;

                uniform vec2 u_curl;
                uniform float u_size;
                uniform int u_flip;

                ${curlPlane}

                void main() {
                    vUv = uv;
                    vec3 _position = position.xyz;
                    float centerOffset = u_size * .5;
                    vec2 curledPosition = curlPlane(
                        centerOffset + position.y, 
                        u_size, 
                        u_curl.x, 
                        u_curl.y, 
                        u_flip == 1
                      );
                    _position.y = curledPosition.x - centerOffset;
                    _position.z += curledPosition.y;
    
                    gl_Position =   projectionMatrix * 
                                    modelViewMatrix * 
                                    vec4(_position,1.0);
                }
        `,
        fragmentShader:/* glsl */`
                uniform sampler2D texture1;

                varying vec2 vUv;
    
                void main() {
                    gl_FragColor = texture2D(texture1, vUv);
                }
        `,
    })

    const geometry = new THREE.PlaneGeometry(3, 4.5, 200, 200)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)


    controls = new OrbitControls(camera, renderer.domElement);

    render();

    const uniforms = mesh.material.uniforms

    const gui = new GUI({ container: document.getElementsByClassName('gui-container')[0] });

    gui.add(uniforms.u_curl.value, 'x', -5, 5, 0.1).name('curl X').onChange(value => {
        uniforms.u_curl.value.x = value
    })
    gui.add(uniforms.u_curl.value, 'y', -5, 5, 0.1).name('curl Y').onChange(value => {
        uniforms.u_curl.value.y = value
    })
    gui.add(uniforms.u_size, 'value', 0, 3, 0.02).name('u_size').onChange(value => {
        uniforms.u_size.value = value
    })
    gui.add(uniforms.u_flip, 'value', [0, 1]).name('u_flip').onChange(value => {
        uniforms.u_flip.value = value
    })


    window.addEventListener("resize", onResize);
}

function render() {
    if (!renderer) return
    renderer.render(scene, camera)
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
