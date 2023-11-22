/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export function run(DOM = null) {
  init(DOM);
}

let mesh, renderer, scene, camera, controls;
let gui

const API = {
  offsetX: 0,
  offsetY: 0,
  repeatX: 1,
  repeatY: 1,
  rotation: 0, // positive is counterclockwise
  centerX: 0,
  centerY: 0
};


function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  //创建渲染器，添加到dom当中, antialias（是否启用抗锯齿）
  renderer = new THREE.WebGLRenderer({ antialias: true });
  //设置渲染器的尺寸
  renderer.setSize(width, height);
  //将渲染器放置到页面当中
  DOM.appendChild(renderer.domElement);

  //创建场景
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(10, 15, 25);
  scene.add(camera);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  const geometry = new THREE.BoxGeometry(10, 10, 10);

  new THREE.TextureLoader().load('./UVchecker/uv_grid_opengl.jpg', function (texture) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.colorSpace = THREE.SRGBColorSpace;

    //texture.matrixAutoUpdate = false; // default true; set to false to update texture.matrix manually

    const material = new THREE.MeshBasicMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    updateUvTransform();

    initGui();

    render();
  })
  window.addEventListener('resize', onResize);
}

function render() {
  if (!renderer) return
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function onResize() {
  const [width, height] = [window.innerWidth, window.innerHeight];
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  controls.update();
}

function updateUvTransform() {

  const texture = mesh.material.map;

  if (texture.matrixAutoUpdate === true) {

    texture.offset.set(API.offsetX, API.offsetY);
    texture.repeat.set(API.repeatX, API.repeatY);
    texture.center.set(API.centerX, API.centerY);
    texture.rotation = API.rotation; // rotation is around center

  } else {

    // setting the matrix uv transform directly
    //texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );

    // another way...
    texture.matrix
      .identity()
      .translate(- API.centerX, - API.centerY)
      .rotate(API.rotation)					// I don't understand how rotation can preceed scale, but it seems to be required...
      .scale(API.repeatX, API.repeatY)
      .translate(API.centerX, API.centerY)
      .translate(API.offsetX, API.offsetY);

  }

  render();

}

function initGui() {

  gui = new GUI({
    container: document.getElementsByClassName("gui-container")[0],
  });

  gui.add(API, 'offsetX', 0.0, 1.0).name('offset.x').onChange(updateUvTransform);
  gui.add(API, 'offsetY', 0.0, 1.0).name('offset.y').onChange(updateUvTransform);
  gui.add(API, 'repeatX', 0.25, 2.0).name('repeat.x').onChange(updateUvTransform);
  gui.add(API, 'repeatY', 0.25, 2.0).name('repeat.y').onChange(updateUvTransform);
  gui.add(API, 'rotation', - 2.0, 2.0).name('rotation').onChange(updateUvTransform);
  gui.add(API, 'centerX', 0.0, 1.0).name('center.x').onChange(updateUvTransform);
  gui.add(API, 'centerY', 0.0, 1.0).name('center.y').onChange(updateUvTransform);

}

export function dispose() {
  window.removeEventListener("resize", onResize)
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