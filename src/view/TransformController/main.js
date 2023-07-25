/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer;
let cube, teapot
let saveState = {
  cubeM: null,
  teapotM: null
}
let resetMatrix = {
  cubeM: null,
  teapotM: null
}

function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  initRenderer(DOM, width, height)
  initScene()

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(12, 26, 26)
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true,
  });
  cube = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 8), material);
  cube.position.set(0, 0, 0)
  scene.add(cube);
  teapot = new THREE.Mesh(new TeapotGeometry(2), material);
  teapot.position.set(0, 3, 0)
  cube.add(teapot)


  // init matrices
  cube.updateMatrix()
  teapot.updateMatrix()
  resetMatrix = {
    cubeM: new THREE.Matrix4().copy(cube.matrix),
    teapotM: new THREE.Matrix4().copy(teapot.matrix)
  }


  setGUI()
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


function setGUI() {
  const gui = new GUI({
    container: document.getElementsByClassName("gui-container")[0],
  });

  gui.add({
    reset: () => {
      resetMatrix.cubeM.decompose(cube.position, cube.quaternion, cube.scale)
      resetMatrix.teapotM.decompose(teapot.position, teapot.quaternion, teapot.scale)
    },
  }, "reset").name("重置");

  gui.add({
    saveAll: () => {
      saveState = {
        cubeM: new THREE.Matrix4().copy(cube.matrix),
        teapotM: new THREE.Matrix4().copy(teapot.matrix)
      }
      console.log('%c 保存成功', 'color:green')
    },
  }, "saveAll").name("保存整体矩阵");

  gui.add({
    loadAll: () => {
      saveState.cubeM.decompose(cube.position, cube.quaternion, cube.scale)
      saveState.teapotM.decompose(teapot.position, teapot.quaternion, teapot.scale)
      console.log('%c 加载成功', 'color:green')
    },
  }, "loadAll").name("加载整体矩阵");

  gui.add({
    saveCube: () => {
      saveState.cubeM = new THREE.Matrix4().copy(cube.matrix),
        console.log('%c 保存成功', 'color:green')
    },
  }, "saveCube").name("保存茶桌矩阵");

  gui.add({
    loadCube: () => {
      saveState.cubeM.decompose(cube.position, cube.quaternion, cube.scale)
    },
  }, "loadCube").name("加载茶桌矩阵");

  gui.add({
    saveTeapot: () => {
      saveState.teapotM = new THREE.Matrix4().copy(teapot.matrix)
      console.log('%c 保存成功', 'color:green')
    },
  }, "saveTeapot").name("保存茶壶矩阵");

  gui.add({
    loadTeapot: () => {
      saveState.teapotM.decompose(teapot.position, teapot.quaternion, teapot.scale)
      console.log('%c 加载成功', 'color:green')
    },
  }, "loadTeapot").name("加载茶壶矩阵");

  gui.add({
    log: () => {
      console.log(`cube matrix \n ${cube.matrix.toArray()}\n\n cube matrixWorld \n ${cube.matrixWorld.toArray()}\n\n teapot matrix \n ${teapot.matrix.toArray()}\n\n teapot matrixWorld \n ${teapot.matrixWorld.toArray()}\n`)
    },
  }, "log").name("LOG");
}

function setController() {
  let _camera = camera
  let _renderer = renderer
  let _scene = scene

  let orbit = new OrbitControls(camera, renderer.domElement);

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

  _renderer.domElement.addEventListener("click", (event) => {
    // 拖动结束的操作
    if (transing) {
      transing = false;
      return;
    }

    // 选取物体的操作
    raycaster.setFromCamera(mouse, _camera);

    _scene.remove(transformControls);
    const intersection = raycaster.intersectObjects(_scene.children);

    if (intersection.length) {
      const object = intersection[0].object;
      if (object.hasOwnProperty('ignoreRayCasted') && object.ignoreRayCasted === true) return
      _scene.add(transformControls);
      transformControls.attach(object);
    }
  });
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
