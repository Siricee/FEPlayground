/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as TWEEN from "./tween.esm.js";
export function run(DOM = null) {
  init(DOM);
}

let scene, renderer;
let camera;
let controls;
let cube, sphere;
let gclock = new THREE.Clock();
let animateEnable = false
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
  // camera.position.set(12, 12, 48)
  camera.position.set(8, 5, 11)
  scene.add(camera);

  const material = new THREE.MeshNormalMaterial({
    flatShading: true, // 方便我们看到每个面的颜色
  });

  
  //添加辅助线
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  // 白轴
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const points = []
  points.push(new THREE.Vector3(1.5, 0, 0), new THREE.Vector3(1.5, 1.0, 0))
  const lineMesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial)
  scene.add(lineMesh)


  let g = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  let c = new THREE.Mesh(g, material)
  cube = c
  c.position.set(3, 0, 0)
  scene.add(c)


  controls = new OrbitControls(camera, renderer.domElement);
  setGUI();
  render();
  window.addEventListener("resize", onResize);
}

function render() {
  if (!renderer) return;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  if (animateEnable) { animate() }
  TWEEN.update()
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
    click: () => {
      animateEnable = !animateEnable
      gclock.start()

      // let progress = { value: 0 }
      // new TWEEN.Tween(progress)
      //   .to({ value: 1 },1000)
      //   .easing(TWEEN.Easing.Linear.None)
      //   .onUpdate((progress) => {
      //     const v = progress.value
      //     const t = gclock.getDelta()
      //     // matrix 实现 cube 自转
      //     let matrix = new THREE.Matrix4()
      //     matrix.makeRotationY(Math.PI / 2 * v);
      //     cube.setRotationFromMatrix(matrix)


      //     // let specAxes = new THREE.Vector3(12, 12, 12)
      //     // let Rm = new THREE.Matrix4().makeRotationAxis(specAxes.normalize(), t * Math.PI / 20)
      //     // cube.applyMatrix4(Rm)
      //   }).start()
    }
  }, "click").name("启动动画");
}


function animate() {
  let v = gclock.getDelta()
  // 平移
  // cube.translateOnAxis(new THREE.Vector3(12,12,12).normalize(),v*2)

  let Tm = new THREE.Matrix4().makeTranslation(1.5, 0, 0) // Tm 矩阵表示单次偏移矩阵变换，也就是每个t都会变换。
  let Rm = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,1,0).normalize(),v * Math.PI / 5)
  let TRS = new THREE.Matrix4().multiply(Tm).multiply(Rm).multiply(Tm.invert()) // 单次变化值
  // let TRS =  new THREE.Matrix4().premultiply(Tm).premultiply(Rm).premultiply(Tm.invert())
  cube.applyMatrix4(TRS)
  // let pos = new THREE.Vector3(3*time,0,0)
  // let Tm = new THREE.Matrix4().makeTranslation(v, 0, 0)
  // let TRS = new THREE.Matrix4().multiply(Tm) // 单次变化值
  // let mat = new THREE.Matrix4().copy(cube.matrix).multiply(Tm) // 累计值
  // cube.applyMatrix4(mat)

  // let mat = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(12,12,12).normalize(),v * Math.PI / 20)
  // cube.applyMatrix4(mat)

  // let matrix = new THREE.Matrix4().copy(cube.matrix)
  // matrix.makeRotationY(Math.PI / 10 * v);
  // cube.setRotationFromMatrix(matrix)

  // let matrix = new THREE.Matrix4()//.copy(cube.matrix)
  // matrix.makeRotationY(Math.PI /2 * v); // 注意：makeRotationY在累计值才有效果，每次只转一单位效果不累加。
  // cube.setRotationFromMatrix(matrix)
  // cube.applyMatrix4(matrix)

  // 绕 specAxes 公转
  // let specAxes = new THREE.Vector3(12,12,12)
  // let Rm = new THREE.Matrix4()
  // Rm.makeRotationAxis(specAxes.normalize(),v * Math.PI / 5)
  // cube.applyMatrix4(Rm)

  // let T1 = new THREE.Matrix4().makeTranslation( v, 0, 0)
  // let T2 = new THREE.Matrix4().makeRotationY(Math.PI / 10 * v);

  // let M = new THREE.Matrix4().multiplyMatrices(T1, T2)
  // cube.applyMatrix4(M)

  // let finalMatrix = new THREE.Matrix4()
  // let m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Vector3(0, v*100, 0), "XYZ")
  // finalMatrix.multiply(m);
  // cube.applyMatrix4(m)
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
