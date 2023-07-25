/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

export function run(DOM = null) {
  init(DOM);
}

let camera, renderer, controls;

let scene, scene2, currentScene

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 0, 15)

  // scene1  
  currentScene = scene = new THREE.Scene();

  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });
  const geometry = new THREE.ConeGeometry(1, 2, 32);
  const cone = new THREE.Mesh(geometry, material);
  cone.name = 'cone'
  scene.background = new THREE.Color(0x74b105);
  scene.add(cone);

  // scene2
  scene2 = new THREE.Scene()
  const torus = new THREE.TorusGeometry(1, 0.3, 30, 30);
  const tm = new THREE.Mesh(torus, material)
  scene2.background = new THREE.Color(0x2cc9ff);
  scene2.add(tm)


  controls = new OrbitControls(camera, renderer.domElement);

  render();
  window.addEventListener("resize", onResize);


  const gui = new GUI({ container: document.getElementsByClassName('gui-container')[0] });
  gui.add({ 'toggleScene': true }, "toggleScene").onChange(val => {
    currentScene = val ? scene : scene2
  })

}

function render() {
  if (!renderer || !currentScene) return
  renderer.render(currentScene, camera)
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
  [scene, scene2].forEach(s => s ?? s.traverse((child) => {
    if (child.material) {
      child.material.dispose();
    }
    if (child.geometry) {
      child.geometry.dispose();
    }
    child = null;
  }));
  scene.clear();
  renderer.forceContextLoss();
  renderer.dispose();
  scene = null;
  camera = null;
  renderer.domElement = null;
  renderer = null;
}
