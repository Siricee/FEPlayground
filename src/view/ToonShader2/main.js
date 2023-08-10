/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ToonShaderMaterial } from "./ToonShaderMaterial";

export function run(DOM = null) {
  init(DOM);
}

let scene, sceneEdge
let camera, renderer;
let controls
let cube, cubeEdge


function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setClearColor(new THREE.Color(0xffffff))
  renderer.setSize(width, height);
  renderer.autoClear = false
  DOM.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  sceneEdge = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 0, 1600)


  const material = new ToonShaderMaterial()
  const geometry = new THREE.TorusKnotGeometry(100, 34, 100, 16);

  cube = new THREE.Mesh(geometry, material);
  cubeEdge = new THREE.Mesh(geometry, material.clone())

  scene.add(cube);
  sceneEdge.add(cubeEdge)


  controls = new OrbitControls(camera, renderer.domElement);

  render();
  window.addEventListener("resize", onResize);
}

function render() {
  if (!renderer) return
  renderer.clear()

  cubeEdge.material.side = THREE.FrontSide;
  cube.material.uniforms.u_isEdge.value = false;
  renderer.render(scene, camera)

  cubeEdge.material.side = THREE.BackSide
  cubeEdge.material.uniforms.u_isEdge.value = true;
  renderer.render(sceneEdge, camera)

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
