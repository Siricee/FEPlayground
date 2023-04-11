/* eslint-disable */
/**
 * 108 THREE.JS 使用矩阵对3D对象进行位置设置 | 暮志未晚-中文案例网
    https://www.wjceo.com/blog/threejs2/2019-01-22/184.html
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as Util from "./utils";

export function run(DOM = null) {
  init(DOM);
}

let scene, renderer;
let camera;
let controls;
let cube, params;

let matrixT, matrixR, matrixS, matrixAns;

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

  //创建相机，设置位置
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  //设置相机的位置
  camera.position.set(2, 3, 30);
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });

  //创建一个立方体的几何体
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  //将集合体和材质放到一个网格中
  cube = new THREE.Mesh(geometry, material);

  //添加辅助线
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  //将立方体网格添加到场景中
  scene.add(cube);

  controls = new OrbitControls(camera, renderer.domElement);

  //生成设置 和 GUI控件
  setGUI();

  render();
  window.addEventListener("resize", onResize);
}

function render() {
  if(!renderer)return
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function onResize(){
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
  params = {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    transformation: "缩放旋转平移",
    centerX: 0,
    centerY: 0,
    centerZ: 0,
  };
  const savedParams = Object.create(params);

  //位移
  gui
    .add(params, "positionX", -5, 5, 0.1)
    .name("沿x轴移动")
    .onChange(update);
  gui
    .add(params, "positionY", -5, 5, 0.1)
    .name("沿y轴移动")
    .onChange(update);
  gui
    .add(params, "positionZ", -5, 5, 0.1)
    .name("沿z轴移动")
    .onChange(update);

  //旋转
  gui
    .add(params, "rotationX", Math.PI * -2, Math.PI * 2, Math.PI / 4)
    .name("沿x轴旋转")
    .onChange(update);
  gui
    .add(params, "rotationY", Math.PI * -2, Math.PI * 2, Math.PI / 4)
    .name("沿y轴旋转")
    .onChange(update);
  gui
    .add(params, "rotationZ", Math.PI * -2, Math.PI * 2, Math.PI / 4)
    .name("沿z轴旋转")
    .onChange(update);

  //缩放
  gui
    .add(params, "scaleX", 1, 5, 0.1)
    .name("沿x轴缩放")
    .onChange(update);
  gui
    .add(params, "scaleY", 1, 5, 0.1)
    .name("沿y轴缩放")
    .onChange(update);
  gui
    .add(params, "scaleZ", 1, 5, 0.1)
    .name("沿z轴缩放")
    .onChange(update);

  //中心点
  gui
    .add(params, "centerX", -2, 5)
    .name("变换中心x轴")
    .onChange(update);
  gui
    .add(params, "centerY", -2, 5)
    .name("变换中心y轴")
    .onChange(update);
  gui
    .add(params, "centerZ", -2, 5)
    .name("变换中心z轴")
    .onChange(update);

  //修改变换顺序
  gui
    .add(params, "transformation", [
      "缩放旋转平移",
      "平移旋转缩放",
      "缩放平移旋转",
      "旋转平移缩放",
      "旋转缩放平移",
      "平移缩放旋转",
      "平移旋转缩放",
    ])
    .name("修改变换顺序")
    .onChange(update);

  gui
    .add(
      {
        logScale: () => {
          Util.log("缩放矩阵", matrixS);
        },
      },
      "logScale"
    )
    .name("打印缩放矩阵");
  gui
    .add(
      {
        logRotation: () => {
          Util.log("旋转矩阵", matrixR);
        },
      },
      "logRotation"
    )
    .name("打印旋转矩阵");
  gui
    .add(
      {
        logTranslation: () => {
          Util.log("平移矩阵", matrixT);
        },
      },
      "logTranslation"
    )
    .name("打印平移矩阵");
  gui
    .add(
      {
        logCaculation: () => {
          Util.log("结果矩阵", matrixAns);
        },
      },
      "logCaculation"
    )
    .name("打印结果矩阵");
  gui
    .add(
      {
        reset: () => {
          cube.matrix = new THREE.Matrix4([
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
          ]);
          cube.matrix.decompose(cube.position, cube.quaternion, cube.scale);
          gui.controllers.forEach((c) => c.setValue(c.initialValue));
        },
      },
      "reset"
    )
    .name("重置");
}

function update() {
  //生成缩放矩阵
  const scaleM = new THREE.Matrix4();
  scaleM.makeScale(params.scaleX, params.scaleY, params.scaleZ);
  //生成旋转矩阵
  const rotaMX = new THREE.Matrix4();
  rotaMX.makeRotationX(params.rotationX);

  const rotaMY = new THREE.Matrix4();
  rotaMY.makeRotationY(params.rotationY);

  const rotaMZ = new THREE.Matrix4();
  rotaMZ.makeRotationZ(params.rotationZ);

  rotaMZ.multiply(rotaMY);
  rotaMZ.multiply(rotaMX);

  //生成位移矩阵
  const translationM = new THREE.Matrix4();
  translationM.makeTranslation(
    params.positionX,
    params.positionY,
    params.positionZ
  );

  //生成需要使用的矩阵
  const matrix = new THREE.Matrix4();

  //设置中心点变换矩阵
  const centerM = new THREE.Matrix4();
  centerM.makeTranslation(params.centerX, params.centerY, params.centerZ);
  matrix.multiply(centerM);

  //用后进行的操作进行乘先进行的矩阵变换
  switch (params.transformation) {
    case "缩放旋转平移":
      matrix.multiply(translationM);
      matrix.multiply(rotaMZ);
      matrix.multiply(scaleM);
      break;
    case "缩放平移旋转":
      matrix.multiply(rotaMZ);
      matrix.multiply(translationM);
      matrix.multiply(scaleM);
      break;
    case "旋转平移缩放":
      matrix.multiply(scaleM);
      matrix.multiply(translationM);
      matrix.multiply(rotaMZ);
      break;
    case "旋转缩放平移":
      matrix.multiply(translationM);
      matrix.multiply(scaleM);
      matrix.multiply(rotaMZ);
      break;
    case "平移缩放旋转":
      matrix.multiply(rotaMZ);
      matrix.multiply(scaleM);
      matrix.multiply(translationM);
      break;
    case "平移旋转缩放":
      matrix.multiply(scaleM);
      matrix.multiply(rotaMZ);
      matrix.multiply(translationM);
      break;
  }

  //最后先将模型移动到中心位置
  let inverseM = centerM.clone();
  matrix.multiply(inverseM.invert());

  //将矩阵赋值给模型
  cube.matrix = matrix;

  //使用矩阵更新模型的信息
  cube.matrix.decompose(cube.position, cube.quaternion, cube.scale);

  // for LOG
  matrixT = translationM.clone();
  matrixR = rotaMZ.clone();
  matrixS = scaleM.clone();
  matrixAns = matrix.clone();
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
