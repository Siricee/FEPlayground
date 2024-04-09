import * as THREE from "three";
import { loadMap, AMap } from "./functions/map";
import { vertexShader, fragmentShader } from "./functions/shaders";

let map; // 地图实例
let engine; // Three 场景实例
/**
 * 加载高德地图
 */
async function initMap(DOM_id) {
  map = await loadMap(DOM_id);
}
/**
 * 加载自定义图层,必须在 initMap 方法后执行。
 */
async function initLayer() {
  let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  let canvas = renderer.domElement;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(map.getSize().width, map.getSize().height);
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    70,
    map.getSize().width / map.getSize().height,
    0.1,
    2000
  );
  camera.updateProjectionMatrix();
  camera.lookAt(0, 0, 0);

  engine = {
    _scene: scene,
    _camera: camera,
    _renderer: renderer,
    _map: map,
    _clock: new THREE.Clock(),
    _timeCounter: 0,
    _timeLineCounter: 0,
    _renderTimer: 0,
  };

  let customLayer = new AMap.CustomLayer(canvas, {
    zIndex: 12,
    zooms: [8, 18],
  });

  map.add(customLayer);
  map.on("camerachange", OnMapCameraChanged.bind(this));

  loadBuildingModels();
}
/**
 * @function 加载地图建模
 */
const modelPath = "./MapModel/buildings.json";
function loadBuildingModels() {
  let loader = new THREE.FileLoader();
  loader.setResponseType("json").load(modelPath, (model) => {
    appendBuildingsToScene(model);
    console.log("model loaded.");
    OnRenderThreeJs();
  });
}
/**
 * @function 加载模型后的处理
 * @param {Model Geometry} model
 */
function appendBuildingsToScene(json) {
  const scene = engine._scene;
  // let material = new THREE.MeshBasicMaterial({
  //   color:'#049ef4'
  // })
  const cameraStat = map.getCameraState();

  const zoom = map.getZoom();

  let material = new THREE.ShaderMaterial({
    uniforms: {
      u_opacity: { value: 1.0 },
      u_time: { value: 0.45 },
      u_color: { value: [0.02, 0.15, 0.5, 1] },
      u_zoom: { value: zoom },
      u_brightColor: { value: [1, 1, 1, 1] }, // 顶线和亮色
      u_windowColor: { value: [0.07, 0.07, 0.03, 1] },
      u_near: { value: cameraStat.near },
      u_far: { value: cameraStat.far },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const model = json.buildings;
  let meshGroup = new THREE.Group();

  model.forEach((p, idx) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(p.geometry), 3)
    );
    geometry.setAttribute(
      "faceUv",
      new THREE.Float32BufferAttribute(new Float32Array(p.faceUv), 2)
    );
    geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(new Float32Array(p.geometry.length), 3)
    );

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.___index = idx;
    meshGroup.add(mesh);
  });
  scene.add(meshGroup);
}
/**
 * 移动地图时，上面的模型图层需要同步移动，地图和模型相对位置保持不变，从而得到定位。
 * @param {*} evt 高德地图的视角参数
 */
function OnMapCameraChanged(evt) {
  let mapCamera = evt ? evt.camera : map.getCameraState();
  let fPI = Math.PI / 180;
  let pitch = mapCamera.pitch * fPI;
  let rotation = mapCamera.rotation * fPI;
  let camera = engine._camera;
  camera.fov = mapCamera.fov / fPI;
  camera.aspect = mapCamera.aspect;
  camera.near = mapCamera.near;
  camera.far = mapCamera.far;
  camera.updateProjectionMatrix();
  camera.position.z = mapCamera.height * Math.cos(pitch);
  camera.position.x = mapCamera.height * Math.sin(pitch) * Math.sin(rotation);
  camera.position.y = -mapCamera.height * Math.sin(pitch) * Math.cos(rotation);
  camera.up.x = -Math.cos(pitch) * Math.sin(rotation);
  camera.up.y = Math.cos(pitch) * Math.cos(rotation);
  camera.up.z = Math.sin(pitch);
  camera.lookAt(0, 0, 0);

  // 移动地图时 Scene 和全部模型一起移动
  let scene = engine._scene;
  scene.position.x = -mapCamera.position.x;
  scene.position.y = mapCamera.position.y;
}
/**
 * @function Three渲染函数
 */
function OnRenderThreeJs() {
  engine._renderer.render(engine._scene, engine._camera);
  requestAnimationFrame(OnRenderThreeJs.bind(this));
}


// 入口函数
export async function main(DOMid) {
  await initMap(DOMid);
  await initLayer();
}
// main(DOMid);


/**
 * 销毁实例方法
 * @param {*} DOMid 
 */
/* eslint-disable */
 export function dispose(DOMid) {
  const elem = document.getElementById(DOMid);
  if(elem)elem.innerHTML = ''
  map = null;
  engine = null;
}