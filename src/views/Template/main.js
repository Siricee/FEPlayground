/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer,controls;

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 0, 15)
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);


  controls = new OrbitControls(camera, renderer.domElement);

  render();
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
