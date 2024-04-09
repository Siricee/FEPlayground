/**
 * https://codesandbox.io/s/3rk1o6
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Grass from "./Grass";
import { SkyBox } from "./skybox";
import { Character } from "./Character";

export async function run(DOM = document.body) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  DOM.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, width / height);
  camera.position.set(0, 1, 7);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  scene.translateY(-2.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.maxDistance = 15;

  const grass = new Grass(50, 100000);
  scene.add(grass);

  const skybox = await SkyBox();
  skybox.position.y = -4.5;
  scene.add(skybox);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  scene.add(light);

  const model = await Character();
  const scale = 0.0025;
  model.scale.set(scale, scale, scale);
  model.position.set(0, 0, 0);
  model.rotation.x = -Math.PI / 2;
  scene.add(model);

  renderer.setAnimationLoop((time) => {
    grass.update(time);
    if (skybox) skybox.rotation.y += -0.0005 % Math.PI;
    renderer.render(scene, camera);
  });
}