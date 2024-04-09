/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function run(DOM = null) {
  init(DOM);
}

let sceneL, sceneR
let renderer
let camera, controls
let cubeL, cubeR

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.useLegacyLights = false;
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height);
  renderer.setScissorTest(true)


  DOM.appendChild(renderer.domElement);

  sceneL = new THREE.Scene()
  sceneL.background = new THREE.Color(0xBCD48F);
  sceneR = new THREE.Scene()
  sceneR.background = new THREE.Color(0x8FBCD4);

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 0, 15)


  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });
  cubeL = new THREE.Mesh(geometry, material);

  const material2 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true
  });
  const cubeR = new THREE.Mesh(geometry, material2)

  sceneL.add(cubeL)
  sceneR.add(cubeR)

  controls = new OrbitControls(camera, renderer.domElement)


  animate();
  window.addEventListener("resize", onResize);
}

function render() {
  if (!renderer) return

  const [width, height] = [window.innerWidth, window.innerHeight];
  renderer.setScissor(0, 0, width / 2, height)
  renderer.render(sceneL, camera)

  renderer.setScissor(width / 2, 0, width, height)
  renderer.render(sceneR, camera)

}


function animate() {
  render()
  requestAnimationFrame(animate)
}

function onResize() {
  const [width, height] = [window.innerWidth, window.innerHeight];
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  controls.update();
  render()
}

export function dispose() {
  window.removeEventListener("resize", onResize);
  [sceneL, sceneR].forEach(s => {
    s.traverse((child) => {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    })
    s.clear()
    s = null
  })

  renderer.forceContextLoss();
  renderer.dispose();

  renderer.domElement = null;
  renderer = null;
}
