/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ToonShaderMaterial } from './ToonShaderMaterial.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer;
let controls
let statue
let composer1, composer, fxaaPass;

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.useLegacyLights = false // renderer.physicallyCorrectLights = true
  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  DOM.appendChild(renderer.domElement);



  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(17.581919241225574, 4.724954023846511, -1.0591627413274636)
  camera.lookAt(-0.7342178593990017, 2.177806878145501, -0.1387301098306116)
  scene.add(camera);

  // postprocess
  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  renderPass.clearColor = new THREE.Color(0, 0, 0);
  renderPass.clearAlpha = 0;
  composer.addPass(renderPass);

  const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
  composer.addPass(colorCorrectionPass);

  fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
  composer.addPass(fxaaPass);


  let ambientLight = new THREE.AmbientLight(0xffffff,0.5);
  scene.add(ambientLight)

  // 直射光必须存在，因为 ToonShaderMaterial 中会引用直射光变量
  const directionalLight = new THREE.DirectionalLight('#fafafa', 1)
  directionalLight.position.set(1, 1, 1)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 4096
  directionalLight.shadow.mapSize.height = 4096
  scene.add(directionalLight)


  const loader = new GLTFLoader();
  loader.load(
    "./ToonShader/bust-hi.glb",
    (model) => {
      console.log("loading model");

      let mesh = model.scene.children[2]
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.material = new ToonShaderMaterial({ color: '#ffffff' })
      scene.add(mesh)
      statue = mesh

      console.log("loaded model successfully");
    },
    () => { },
    (error) => {
      console.log("An error happened", error);
    }
  );


  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-0.6103977347104776, 2.525916920338679, 0.1370790528517294)
  controls.update()

  render();
  window.addEventListener("resize", onResize);
}

function render() {
  if (!renderer) return
  if (statue) statue.rotateY(0.005)
  camera.updateProjectionMatrix();
  // renderer.render(scene, camera)
  composer.render()
  requestAnimationFrame(render)
}


function onResize() {
  const [width, height] = [window.innerWidth, window.innerHeight];
  renderer.setSize(width, height);
  composer1.setSize(width, height);
  composer.setSize(width, height);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);


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
