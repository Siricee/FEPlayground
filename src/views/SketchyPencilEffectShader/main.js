/* eslint-disable no-unused-vars */
import * as THREE from "three";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { custompass } from "./pipeline"
import { PencilLinesPass } from './PencilLinesPass'

let renderer, scene, camera;
let composer;
let spotLight;
let model;
let gui;
let axesHelper;
let pencilLinePass;

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

  composer = new EffectComposer(renderer)


  scene = new THREE.Scene();


  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(40, 20, 40);
  camera.lookAt(0, 30, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(15, 40, 35);
  spotLight.angle = Math.PI / 9;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.intensity = 1.8;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  let material = new THREE.MeshPhongMaterial({
    color: 0x808080,
    dithering: true,
  });

  let geometry = new THREE.PlaneGeometry(150, 150);

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.x = -Math.PI * 0.5;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const loader = new GLTFLoader();

  loader.load(
    "./LightDemo/model.glb",
    (gltf) => {
      console.log("loading model");
      const rawModel = gltf.scene.children[0].children[0].children[0]; // 原始模型数据，类型为Mesh
      rawModel.scale.set(0.1, 0.1, 0.1)
      rawModel.position.set(-10, 0, -7)
      rawModel.castShadow = true
      model = new THREE.Object3D()  // rawModel添加进model容器解决模型中心轴的偏移，做法就是在外层套一个容器以消除模型本身的偏移量
      model.position.set(0, 0, 0)
      model.rotation.set(-Math.PI, -Math.PI / 2, 0)
      model.add(rawModel);
      model.castShadow = true;
      scene.add(model);

      axesHelper = new THREE.AxesHelper(25);
      axesHelper.visible = false;
      scene.add(axesHelper);
      render();

      console.log("loaded model successfully");
    },
    () => { },
    (error) => {
      console.log("An error happened", error);
    }
  );


  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  pencilLinePass = new PencilLinesPass({
    width: renderer.domElement.clientWidth * 3,
    height: renderer.domElement.clientHeight * 3,
    scene,
    camera
  })

  render();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-1.9114473584617535, 8.75190067729339, -0.8088243237200273)
  controls.update()

  controls.addEventListener("change", render);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render()
}

function render() {
  composer.render()
}

let PostProcessEnable = false
let EnhancedPencilEffectEnable = false

function buildGui(GUIDOM) {
  gui = new GUI({ container: GUIDOM });

  const params = {
    "Light Color": spotLight.color.getHex(),
    // intensity: spotLight.intensity,
    // distance: spotLight.distance,
    // angle: spotLight.angle,
    // penumbra: spotLight.penumbra,
    // decay: spotLight.decay,
    // focus: spotLight.shadow.focus,
    "PostProcessEnable": PostProcessEnable,
    "EnhancedPencilEffect":EnhancedPencilEffectEnable,
  };

  gui.addColor(params, "Light Color").onChange(function (val) {
    spotLight.color.setHex(val);
    render();
  });

  gui.add(params, "PostProcessEnable").onChange((enable) => {
    if (enable) {
      composer.addPass(custompass)
    } else {
      composer.removePass(custompass)
    }
    render();
  }).name('Felt Pen Effect')

  gui.add(params,'EnhancedPencilEffect').onChange((enable)=>{
    if(enable){
      composer.removePass(custompass)
      composer.addPass(pencilLinePass)
    }else{
      composer.removePass(pencilLinePass)
    }
    render();
  }).name('Pencil Sketch Effect')


}
function dispose() {
  renderer.renderLists.dispose()
  console.log('renderer has been disposed')
}
export { init, buildGui, render, dispose };
