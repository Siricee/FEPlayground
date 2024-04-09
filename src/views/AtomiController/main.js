/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AtomiControls } from './AtomiControls'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer;
let teapot
let atomiControls


function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(8, 8, -8)
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });
  const geometry = new TeapotGeometry(1);
  teapot = new THREE.Mesh(geometry, material);
  scene.add(teapot);
  teapot.up = new THREE.Vector3(1, 1, 1)


  let ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight)

  atomiControls = initAtomiController()
  
  render();
  window.addEventListener("resize", onResize);
}

function initAtomiController() {
  let orbit = new OrbitControls(camera, renderer.domElement);
  const atomi = new AtomiControls(camera, renderer, 0.6)
  atomi.addEventListener("onpointer", ({ onChange }) => {
    orbit.enabled = !onChange;
  });
  teapot.add(atomi)
  return atomi
}


function render() {
  if (!renderer) return
  if (atomiControls) atomiControls.update()
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
