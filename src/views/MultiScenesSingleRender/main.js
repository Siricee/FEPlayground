/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function run(DOM = null) {
  init(DOM);
}

let sceneL, sceneR
let renderer
let cameraL, cameraR
let controlL, controlR

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


  cameraL = new THREE.PerspectiveCamera(45, width / 2 / height, 1, 4000);
  cameraL.position.set(0, 0, 15)

  cameraR = new THREE.PerspectiveCamera(45, width / 2 / height, 1, 4000);
  cameraR.position.set(0, 0, 15)

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });
  const cube = new THREE.Mesh(geometry, material);

  const material2 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true
  });
  const cube2 = new THREE.Mesh(geometry, material2)

  sceneL.add(cube)
  sceneR.add(cube2)

  controlL = new OrbitControls(cameraL, document.getElementsByClassName('left')[0]);
  controlR = new OrbitControls(cameraR, document.getElementsByClassName('right')[0]);


  animate();
  window.addEventListener("resize", onResize);
}

function render() {
  if (!renderer) return

  const [width, height] = [window.innerWidth, window.innerHeight];
  renderer.setScissor(0, 0, width / 2, height)
  renderer.setViewport(0, 0, width / 2, height);
  renderer.render(sceneL, cameraL)

  renderer.setScissor(width / 2, 0, width, height)
  renderer.setViewport(width / 2, 0, width / 2, height);
  renderer.render(sceneR, cameraR)

}
function animate() {
  render()
  requestAnimationFrame(animate)
}


function onResize() {
  const [width, height] = [window.innerWidth, window.innerHeight];
  renderer.setSize(width, height);
  if (cameraL) {
    cameraL.aspect = (width / 2) / height
    cameraL.updateProjectionMatrix();
  }
  if (cameraR) {
    cameraR.aspect = (width / 2) / height
    cameraR.updateProjectionMatrix();
  }

  controlL.update();
  controlR.update();

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
  cameraL = cameraR = null;

  renderer.domElement = null;
  renderer = null;
}
