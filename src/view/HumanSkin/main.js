/* eslint-disable */
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export function run(DOM = null) {
  init(DOM);
}

let scene, camera, renderer;
let controls
const stats = new Stats();

let model, lights;
let material;


async function init(DOM) {
  const [width, height] = [DOM.clientWidth, DOM.clientHeight];
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  DOM.appendChild(renderer.domElement);
  document.getElementsByClassName('stat-container')[0].appendChild(stats.dom)


  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set( 0, 2, 2 );
  scene.add(camera);

  // const material = new THREE.MeshNormalMaterial({
  //   flatShading: true, // 方便我们看到每个面的颜色
  // });
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  model = new THREE.Group();
  scene.add(model);
  lights = new THREE.Group();
  scene.add(lights);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0.0, 0.5, 0.25).normalize();
  lights.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0x0000ff, 1);
  directionalLight2.position.set(0.0, -0.25, -0.25).normalize();
  lights.add(directionalLight2);

  const pointLight1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00c1c1 }));
  pointLight1.add(new THREE.PointLight(0x00c1c1, 5, 4, 2));
  lights.add(pointLight1);
  pointLight1.position.x = -1;
  pointLight1.position.y = 1;
  pointLight1.position.z = 2;

  const pointLight2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xc1c100 }));
  pointLight2.add(new THREE.PointLight(0xc1c100, 5, 4, 2));
  lights.add(pointLight2);
  pointLight2.position.x = 1;
  pointLight2.position.y = 1;
  pointLight2.position.z = - 2;
  const texture = await new RGBELoader().load('./HumanSkin/textures/lobe.hdr')

  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = new THREE.Color(0x808080)//texture;
  scene.environment = texture;
  scene.backgroundBlurriness = 0.1;
  initMaterial()
  initGUI();
  loadModel('man', 0.15);
  loadModel('woman', -0.15);



  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.y = 1.0
  controls.update()

  render();
  window.addEventListener("resize", onResize);
}
function loadModel(type, z) {

  const loaderGLB = new GLTFLoader().setPath('./HumanSkin/models/gltf/');
  loaderGLB.setDRACOLoader(new DRACOLoader().setDecoderPath('./Common/draco/'));
  loaderGLB.load(type + '.glb', function (object) {

    let m = object.scene;
    m.position.z = z;
    if (z < 0) m.rotation.y = Math.PI;
    model.add(m);

    m.traverse((child) => {

      if (child.name === 'body') child.material = material;
      if (child.name === 'Head') child.material = material;
      if (child.name === 'crane') child.material = material;
      if (child.name === 'body_low') child.visible = false;
      if (child.name === 'hair') child.visible = false;
      if (child.name === 'hair_man') child.visible = false;
      if (child.name === 'eyelash') child.visible = false;
      if (child.name === 'eyebrow') child.visible = false;
      if (child.name === 'mouth') child.visible = false;
      if (child.name === 'tear') child.visible = false;
    })

  });

}

function initGUI() {

  const gui = new GUI({ title: 'sss material', container: document.getElementsByClassName('gui-container')[0] });

  gui.add(material, 'roughness').min(0).max(1).step(0.01);
  gui.add(material, 'metalness').min(0).max(1).step(0.01);
  gui.add(material, 'sssDistortion').min(0.01).max(1).step(0.01);
  gui.add(material, 'sssAmbient').min(0.01).max(5.0).step(0.05);
  gui.add(material, 'sssAttenuation').min(0.01).max(5.0).step(0.05);
  gui.add(material, 'sssPower').min(0.01).max(16.0).step(0.1);
  gui.add(material, 'sssScale').min(0.01).max(50.0).step(0.1);

}

function initMaterial() {
  const loader = new THREE.TextureLoader();
  const imgTexture = loader.load('./HumanSkin/textures/avatar/avatar_c.jpg');
  imgTexture.flipY = false;
  imgTexture.colorSpace = THREE.SRGBColorSpace;

  const sssTexture = loader.load('./HumanSkin/textures/avatar/avatar_t.jpg');
  sssTexture.flipY = false;

  const aoTexture = loader.load('./HumanSkin/textures/avatar/avatar_ao.jpg');
  aoTexture.flipY = false;

  const normalTexture = loader.load('./HumanSkin/textures/avatar/avatar_n.jpg');
  normalTexture.flipY = false;

  const specTexture = loader.load('./HumanSkin/textures/avatar/avatar_s.jpg');
  specTexture.flipY = false;

  material = new sssMaterial({
    map: imgTexture,
    //thicknessMap:thicknessTexture,
    aoMap: aoTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(0.3, -0.3),

    envMapIntensity: 0.7,
    //roughnessMap:roughTexture,
    //specularMap:specTexture,
    //specularColorMap:specTexture,
    roughness: 0.54,//0.54,
    metalness: 0.24,//0.14
    //ior:1.4,
    vertexColors: false,

    sssMap: sssTexture,
    sssColor: new THREE.Color(0xee2323),
    sssAmbient: 0.5,
    sssDistortion: 0.6,
    sssAttenuation: 0.1,
    sssScale: 6.0,

  });


}


const sssAdd = `
		#include <common>
		uniform sampler2D sssMap;
		uniform float sssPower;
		uniform float sssScale;
		uniform float sssDistortion;
		uniform float sssAmbient;
		uniform float sssAttenuation;
		uniform vec3 sssColor;

		void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
			vec3 thickness = sssColor * texture2D(sssMap, uv).r;
			vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * sssDistortion));
			float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), sssPower) * sssScale;
			vec3 scatteringIllu = (scatteringDot + sssAmbient) * thickness;
			reflectedLight.directDiffuse += scatteringIllu * sssAttenuation * directLight.color;
		}
		`

const sssLight = `
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
		#if defined( SUBSURFACE ) && defined( USE_UV )
			RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
		#endif
		`


class sssMaterial extends THREE.MeshStandardMaterial {

  constructor(parameters) {

    super();

    this.defines = {

      'STANDARD': '',
      //'PHYSICAL': '',
      'SUBSURFACE': '',
      'USE_UV': '',

    };

    this.extra = {};

    this.addParametre('sssMap', null);
    this.addParametre('sssColor', 0.5);
    this.addParametre('sssAmbient', 0.5);
    this.addParametre('sssDistortion', 0.6);
    this.addParametre('sssAttenuation', 0.1);
    this.addParametre('sssPower', 1.0);
    this.addParametre('sssScale', 6.0);

    this.setValues(parameters);

  }

  addParametre(name, value) {

    this.extra[name] = value;

    Object.defineProperty(this, name, {
      get: () => (this.extra[name]),
      set: (v) => {
        this.extra[name] = v;
        if (this.userData.shader) this.userData.shader.uniforms[name].value = this.extra[name];
      }
    });
  }

  replaceAll(string, find, replace) {

    return string.split(find).join(replace);

  }

  onBeforeCompile(shader) {

    for (let name in this.extra) {
      shader.uniforms[name] = { value: this.extra[name] };
    }

    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', sssAdd);
    shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>',
      this.replaceAll(
        THREE.ShaderChunk['lights_fragment_begin'],
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        sssLight
      )
    );

    this.userData.shader = shader;

  }

}

function render() {
  if (!renderer) return
  if ( lights ) lights.rotation.y = performance.now() / 5000;
  renderer.render(scene, camera)
  stats.update();
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
