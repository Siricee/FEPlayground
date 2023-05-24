/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import CameraControls from './camera-controls.module';
CameraControls.install( { THREE: THREE } );
export function run(DOM = null) {
  init(DOM);
}

let scene, renderer;
let camera;
let controls;
let cube;
let cameraControls;
let clock = new THREE.Clock()

const POSITION = {
  NORMAL: [2, 3, 30],
  FRONT: [0, 0, 30],
  LEFT: [-30, 0, 0],
  RIGHT: [30, 0, 0],
  TOP: [0, 30, 0],
}


function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  //创建渲染器，添加到dom当中, antialias（是否启用抗锯齿）
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.outputEncoding = THREE.sRGBEncoding;
  //设置渲染器的尺寸
  renderer.setSize(width, height);
  //将渲染器放置到页面当中
  DOM.appendChild(renderer.domElement);

  //创建场景
  scene = new THREE.Scene();

  //创建相机，设置位置
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  //设置相机的位置
  camera.position.set(...POSITION.NORMAL);
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });

  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  let normalGrid = new THREE.GridHelper(100, 50, 0x0000ff, 0x808080);
  normalGrid.material = new THREE.LineBasicMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.5
  })
  normalGrid.position.y = -0.5;
  scene.add(normalGrid)

  const geometry = new THREE.ConeGeometry( 1, 2, 10 );
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  
  controls = new OrbitControls(camera, renderer.domElement);
  cameraControls = new CameraControls( camera, renderer.domElement );

  //生成设置 和 GUI控件
  setGUI();

  render();
  window.addEventListener("resize", onResize);
}

function render() {
  if (!renderer) return;
  // TWEEN.update()
  const delta = clock.getDelta();
	cameraControls.update( delta )
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

function setGUI() {
  const gui = new GUI({
    container: document.getElementsByClassName("gui-container")[0],
  });
  gui.add({
    frontView: () => {
      // camera.position.set(...POSITION.FRONT)
      // camera.lookAt(cube.position)
      // animateCamera(camera,new THREE.Vector3(...POSITION.FRONT),cube.position)
      cameraControls.setLookAt(...POSITION.FRONT,...cube.position,true)

    }
  }, "frontView").name("正视图");
  gui.add({
    leftView: () => {
      cameraControls.setLookAt(...POSITION.LEFT,...cube.position,true)
    }
  }, "leftView").name("左视图");
  gui.add({
    rightView: () => {
      cameraControls.setLookAt(...POSITION.RIGHT,...cube.position,true)
    }
  }, "rightView").name("右视图");
  gui.add({
    topView: () => {
      cameraControls.setLookAt(...POSITION.TOP,...cube.position,true)
    }
  }, "topView").name("俯视图");
  gui.add({
    reset: () => {
      cameraControls.setLookAt(...POSITION.NORMAL,...cube.position,true)
    }
  }, "reset").name("回正视角");
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


