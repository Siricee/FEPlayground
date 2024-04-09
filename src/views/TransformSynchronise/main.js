/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer;
let teapot1, teapot2, teapot3
let teapot1_mat, teapot2_mat, teapot3_mat

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  initRenderer(DOM, width, height)
  initScene()

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 10, 40)
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true,
  });
  teapot1 = new THREE.Mesh(new TeapotGeometry(2), material);
  teapot1.position.set(-5, 0, 0)
  scene.add(teapot1)

  teapot2 = new THREE.Mesh(new TeapotGeometry(2), material);
  teapot2.position.set(5, 0, 0)
  scene.add(teapot2)

  teapot3 = new THREE.Mesh(new TeapotGeometry(2), material.clone());
  teapot3.material.wireframe = true
  teapot3.position.set(15, 0, 0)
  scene.add(teapot3)


  teapot1.updateMatrix()
  teapot1_mat = new THREE.Matrix4().copy(teapot1.matrix)
  teapot2.updateMatrix()
  teapot2_mat = new THREE.Matrix4().copy(teapot2.matrix)
  teapot3.updateMatrix()
  teapot3_mat = new THREE.Matrix4().copy(teapot3.matrix)

  setController()

  render();
  window.addEventListener("resize", onResize);
}

function initScene() {
  scene = new THREE.Scene();
  let grid = new THREE.GridHelper(1000, 100, 0x888888, 0x444444)
  grid.ignoreRayCasted = true
  grid.position.y = -1

  scene.add(grid);
}

function initRenderer(DOM, width, height) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);
}

function setController() {
  let _camera = camera
  let _renderer = renderer
  let _scene = scene

  let orbit = new OrbitControls(camera, renderer.domElement);

  let selectedObject = null

  // 初始变换控制器
  const transformControls = new TransformControls(
    _camera,
    _renderer.domElement
  );
  let transing = false;
  transformControls.addEventListener("mouseDown", () => {
    transing = true;
    orbit.enabled = false
  });
  transformControls.addEventListener("mouseUp", () => {
    orbit.enabled = true
  })

  document.addEventListener("keydown", (event) => {
    if (event.repeat) {
      return false;
    }

    if (event.key === "s") {
      transformControls.mode = "scale";
      return false;
    }

    if (event.key === "r") {
      transformControls.mode = "rotate";
      return false;
    }

    if (event.key === "t") {
      transformControls.mode = "translate";
      return false;
    }
  });

  // 初始射线发射器
  const raycaster = new THREE.Raycaster();

  // 给renderer的canvas对象添加鼠标事件
  const mouse = new THREE.Vector2();
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  _renderer.domElement.addEventListener("mousemove", (event) => {
    x = event.offsetX;
    y = event.offsetY;
    width = _renderer.domElement.offsetWidth;
    height = _renderer.domElement.offsetHeight;
    mouse.x = (x / width) * 2 - 1;
    mouse.y = (-y * 2) / height + 1;
  });

  _renderer.domElement.addEventListener("click", () => {
    // 拖动结束的操作
    if (transing) {
      transing = false;
      return;
    }

    // 选取物体的操作
    raycaster.setFromCamera(mouse, _camera);

    _scene.remove(transformControls);
    selectedObject = null
    const intersection = raycaster.intersectObjects(_scene.children);

    if (intersection.length) {
      const object = intersection[0].object;
      if (object.ignoreRayCasted && object.ignoreRayCasted === true) return
      selectedObject = object
      _scene.add(transformControls);
      transformControls.attach(object);
      console.log('transformControls',transformControls)
    }
  });

  transformControls.addEventListener('objectChange', () => {
    let o1 = selectedObject === teapot1 ? teapot1 : teapot2
    let o2 = selectedObject === teapot1 ? teapot2 : teapot1
    let o1mat = selectedObject === teapot1 ? teapot1_mat : teapot2_mat
    let o2mat = selectedObject === teapot1 ? teapot2_mat : teapot1_mat

    transformSynchronise(o1, o1mat, o2, o2mat, teapot3)
  })
}

function transformSynchronise(o1, o1mat, o2, o2mat, o3) {
  let beforePos = new THREE.Vector3().setFromMatrixPosition(o1.matrix) // 本次调用坐标更新前
  o1.updateMatrix()
  let afterPos = new THREE.Vector3().setFromMatrixPosition(o1.matrix) // 本次调用坐标更新后
  let transPos = new THREE.Vector3().subVectors(afterPos, beforePos) // 本次调用坐标更新差值

  let trsM = new THREE.Matrix4().copy(o1.matrix.clone()).premultiply(o1mat.clone().invert())
  let ansM = trsM.premultiply(o2mat.clone())
  ansM.decompose(o2.position, o2.quaternion, o2.scale)
  o2.updateMatrix()

  // applyMatrix4累计值
  o3.geometry.applyMatrix4(new THREE.Matrix4().setPosition(transPos))
}



function render() {
  if (!renderer) return
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
