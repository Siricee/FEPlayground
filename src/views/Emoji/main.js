/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function run(DOM = null) {
  init(DOM);
}


let scene, camera, renderer, controls;
const clock = new THREE.Clock()
let mixer

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x326696)

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 0, 100)
  scene.add(camera);

  let index = 0
  let group = new THREE.Group();
  let namelist = ['Group002', 'Glass_emo', 'Sphere030', 'Sphere0013', 'Sphere036', 'Group008', 'Sphere042', 'Sphere019']

  loadModel().then((_model) => {
    namelist.forEach((name) => {
      let m = _model.scene.getObjectByName(name)
      group.add(m)
    })
    toggleModel(group, index)
    scene.add(group)
  })

  DOM.addEventListener('click', () => {
    index += 1
    toggleModel(group, index)
  })


  controls = new OrbitControls(camera, renderer.domElement);

  render();
  window.addEventListener("resize", onResize);
}

async function loadModel() {
  const loader = new GLTFLoader();
  const object = await new Promise((resolve, reject) => {
    loader.load('./Emoji/emojis_animated.glb', function (object) {
      resolve(object)
    });
  })

  mixer = new THREE.AnimationMixer(object);
  const action = mixer.clipAction(
    object.animations[0],
    object.scene
  );
  action.play();

  return object
}


function toggleModel(group, index = 0) {
  let namelist = ['Group002', 'Glass_emo', 'Sphere030', 'Sphere0013', 'Sphere036', 'Group008', 'Sphere042', 'Sphere019']
  let obj = group.getObjectByName(namelist[index % (namelist.length)])

  group.children.forEach(child => { child.visible = false })
  obj.visible = true

  let { x, y, z } = obj.position
  group.position.set(-x, -y, -z)
  group.updateMatrix()
}



function render() {
  if (!renderer) return
  if (mixer) mixer.update(clock.getDelta());
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
