/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer,controls

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.autoClear = false;
  DOM.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
  camera.position.set(-10, 10, 10);

  controls = new OrbitControls(camera, renderer.domElement);

  let light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.setScalar(1);
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  let grid = new THREE.GridHelper();
  grid.position.y = -5;
  scene.add(grid);

  let obj = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({
    color: "aqua"
  }));
  obj.scale.set(2, 3, 1);
  scene.add(obj);

  let curve = new THREE.EllipseCurve(0, 0, 10, 5);

  let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(100)), new THREE.LineBasicMaterial({
    color: "yellow"
  }));
  line.rotation.x = -Math.PI * 0.25;
  line.rotation.z = Math.PI * 0.125;
  line.position.x = 5;
  line.position.z = -2;
  scene.add(line);

  let cam = new THREE.PerspectiveCamera(25, 1, 1.5, 25);
  let camHelper = new THREE.CameraHelper(cam);
  scene.add(camHelper);

  let clock = new THREE.Clock();
  let v = new THREE.Vector3();
  let wpSize = Math.min(innerWidth, innerHeight) / 4;

  window.addEventListener("resize", onResize);

  renderer.setAnimationLoop(() => {

    let t = (clock.getElapsedTime() * 0.05) % 1;
    
    curve.getPointAt(t, v)
    cam.position.copy(v);
    cam.position.applyMatrix4(line.matrixWorld);
    cam.lookAt(obj.position);
  
    renderer.clear();
    camHelper.visible = true;
    renderer.setViewport(0, 0, innerWidth, innerHeight);
    renderer.render(scene, camera);
    camHelper.visible = false;
    renderer.setViewport(0, innerHeight - wpSize, wpSize, wpSize);
    renderer.render(scene, cam);
  })

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
