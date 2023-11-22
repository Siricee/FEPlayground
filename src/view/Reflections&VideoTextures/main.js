/* eslint-disable */
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Text as TroikaText } from 'troika-three-text'
import MeshReflectorMaterial from './MeshReflectorMaterial'

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer;
let reflectMaterial

async function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(15, width / height, 1, 4000);
  camera.position.set(-2.6287125894085865, 5.621243833686557, 16.814003016454198)
  camera.lookAt(0, 1, 0)
  scene.add(camera);

  // Lights
  let ambientLight = new THREE.AmbientLight(0xffffff, 1)
  let spotlight = new THREE.SpotLight(0xffffff)
  spotlight.position.set(0, 10, 0)
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
  directionalLight.position.set(-50, 0, -40)
  scene.add(ambientLight)
  scene.add(spotlight)
  scene.add(directionalLight)
  // models
  let model = await loadModel()
  model.rotation.set(0, Math.PI - 0.4, 0)
  model.position.set(-1.2, 0, 0.6)
  model.scale.set(0.26, 0.26, 0.26)
  scene.add(model)
  // texts
  let textM = new TroikaText()
  textM.text = 'drei'
  textM.fontSize = 3
  textM.letterSpacing = -0.06
  textM.color = 0x9966FF
  textM.font = './Reflections&VideoTextures/Inter-Bold.woff'
  textM.position.set(0, 0, -2)
  textM.anchorX = 'center'
  textM.anchorY = 'top-baseline'
  scene.add(textM)
  // video element
  let video = document.getElementById('video');
  video.play();
  video.addEventListener('play', function () {
    this.currentTime = 3;
  });
  // video material
  let texture = new THREE.VideoTexture(video);
  let vmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, toneMapped: false })
  textM.material = vmaterial

  addGround()

  render();
  DOM.addEventListener('mousemove', e => {
    const [mouseX, mouseY] = [(e.clientX / DOM.clientWidth) * 2 - 1, -(e.clientY / DOM.clientHeight) * 2 + 1]
    camera.position.lerp(new THREE.Vector3(mouseX * 5, mouseY * 2 + 4, 16.8), 0.05)
    camera.lookAt(0, 1, 0)
  })
  window.addEventListener("resize", onResize);
}

function addGround() {
  const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(15, 15))
  plane.rotation.x = -Math.PI / 2
  plane.rotation.z = -Math.PI / 2

  reflectMaterial = new MeshReflectorMaterial(renderer, camera, scene, plane, {
    resolution: 512,
    blur: [400, 100],
    mixBlur: 7.5,
    mixContrast: 1,
    mirror: 1
  });
  reflectMaterial.setValues({
    roughnessMap: new THREE.TextureLoader().load("./Reflections&VideoTextures/roughness.jpg"),
    normalMap: new THREE.TextureLoader().load("./Reflections&VideoTextures/normal.jpg"),
    normalScale: new THREE.Vector2(0.3, 0.3)
  })
  plane.material = reflectMaterial
  scene.add(plane)
}

function loadModel() {
  const loader = new GLTFLoader()

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./Common/draco/');
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);

  return new Promise((resolve, reject) => {
    loader.load('./Reflections&VideoTextures/carla-draco.glb', model => {
      resolve(model.scene)
    })
  })
}

function render() {
  if (!renderer) return

  if (reflectMaterial) reflectMaterial.update()
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
