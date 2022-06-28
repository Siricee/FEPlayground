/* eslint-disable no-unused-vars */
import * as THREE from "three";

import { GUI } from "./GUI.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
let renderer, scene, camera;

let spotLight, lightHelper, shadowCameraHelper;

let gui;

function init(DOM) {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    DOM.clientWidth || window.innerWidth,
    DOM.clientHeight || window.innerHeight
  );
  DOM.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(160, 40, 10);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.minDistance = 20;
  controls.maxDistance = 500;
  controls.enablePan = false;

  const ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(15, 40, 35);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);

  shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(shadowCameraHelper);

  //

  let material = new THREE.MeshPhongMaterial({
    color: 0x808080,
    dithering: true,
  });

  let geometry = new THREE.PlaneGeometry(2000, 2000);

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, -1, 0);
  mesh.rotation.x = -Math.PI * 0.5;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // add mesh
  //   material = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true });
  //   geometry = new THREE.CylinderGeometry(5, 5, 2, 32, 1, false);
  //   mesh = new THREE.Mesh(geometry, material);
  //   mesh.position.set(0, 5, 0);
  //   mesh.castShadow = true;
  //   scene.add(mesh);

  const loader = new GLTFLoader();
  loader.load(
    "./LightDemo/model.glb",
    (gltf) => {
      console.log("loading model");
      
      const model = gltf.scene.children[0];
      model.position.set(0, 5, 0);
      model.rotateZ(45);
      model.castShadow = true;
      model.scale.set(60, 60, 60);
      const axesHelper = new THREE.AxesHelper( 25 );
      scene.add( axesHelper );
      scene.add(model);
      console.log("loaded model successfully");
    },
    () => {},
    (error) => {
      console.log("An error happened", error);
    }
  );
  render();
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  lightHelper.update();
  shadowCameraHelper.update();
  renderer.render(scene, camera);
}

function buildGui(GUIDOM) {
  gui = new GUI({ container: GUIDOM });

  const params = {
    "light color": spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay,
    focus: spotLight.shadow.focus,
  };

  gui.addColor(params, "light color").onChange(function(val) {
    spotLight.color.setHex(val);
    render();
  });

  gui.add(params, "intensity", 0, 2).onChange(function(val) {
    spotLight.intensity = val;
    render();
  });

  gui.add(params, "distance", 50, 200).onChange(function(val) {
    spotLight.distance = val;
    render();
  });

  gui.add(params, "angle", 0, Math.PI / 3).onChange(function(val) {
    spotLight.angle = val;
    render();
  });

  gui.add(params, "penumbra", 0, 1).onChange(function(val) {
    spotLight.penumbra = val;
    render();
  });

  gui.add(params, "decay", 1, 2).onChange(function(val) {
    spotLight.decay = val;
    render();
  });

  gui.add(params, "focus", 0, 1).onChange(function(val) {
    spotLight.shadow.focus = val;
    render();
  });

  gui.open();
}

// init();
// buildGui();
// render();

function dispose() {
  renderer = null;
}
export { init, buildGui, render, dispose };
