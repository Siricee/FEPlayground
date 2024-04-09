<template>
  <div ref="canvas" class="canvas"></div>
</template>
<style lang="scss" scoped>
.canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";

let scene, camera, renderer; // 定义所有 three 实例变量
const loader = new TextureLoader();
const stats = new Stats();
const setStats = (DOM) => {
  DOM.appendChild(stats.dom);
};

// 场景
const setScene = (DOM) => {
  scene = new Scene();
  renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(DOM.clientWidth, DOM.clientHeight);
  DOM.appendChild(renderer.domElement);
};
// 相机
const setCamera = () => {
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 100000);
  camera.position.set(0, 500, 2000);
  camera.lookAt(scene.position);
};
// 控制
const setControls = () => {
  new OrbitControls(camera, renderer.domElement);
};
// 繁星背景
// eslint-disable-next-line no-unused-vars
const starForge = () => {
  const starQty = 10000;
  const geometry = new SphereGeometry(10000, 100, 50);
  const materialOptions = {
    color: "#f4c604",
  };
  const starStuff = new PointsMaterial(materialOptions);
  geometry.vertices = [];
  for (let i = 0; i < starQty; i++) {
    let starVertex = new Vector3();
    starVertex.x = Math.random() * 20000 - 10000;
    starVertex.y = Math.random() * 20000 - 10000;
    starVertex.z = Math.random() * 20000 - 10000;
    geometry.vertices.push(starVertex);
  }
  const stars = new Points(geometry, starStuff);
  scene.add(stars);
};

// 添加设置太阳
let sun, sunParent;
const setSun = () => {
  sun = new Group(); //建立一个组
  sunParent = new Group();
  scene.add(sunParent); //把组都添加到场景里
  loader.load("./Solar/sun.jpeg", (texture) => {
    const geometry = new SphereGeometry(500, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    sun.add(mesh); //添加到组里
    sunParent.add(sun);
  });
};

// 设置水星
let mercury, mercuryParent;
const setMercury = () => {
  mercury = new Group(); //建立一个组
  mercuryParent = new Group();
  scene.add(mercuryParent);
  loader.load("./Solar/mercury.jpeg", (texture) => {
    const geometry = new SphereGeometry(25, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    mercury.position.x -= 600;
    mercury.add(mesh); //添加到组里
    mercuryParent.add(mercury);
  });
};

//设置金星
let venus, venusParent;
const setVenus = () => {
  venus = new Group(); //建立一个组
  venusParent = new Group();
  scene.add(venusParent);
  loader.load("./Solar/venus.jpeg", (texture) => {
    const geometry = new SphereGeometry(100, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    venus.position.x -= 700;
    venus.add(mesh); //添加到组里
    venusParent.add(venus);
  });
};
//设置地球
let earth, earthParent;
const setEarth = () => {
  earth = new Group(); //建立一个组
  earthParent = new Group();
  scene.add(earthParent);
  loader.load("./Solar/earth.jpeg", (texture) => {
    const geometry = new SphereGeometry(100, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    earth.position.x -= 900;
    earth.add(mesh); //添加到组里
    earthParent.add(earth);
  });
};
//设置火星
let mars, marsParent;
const setMars = () => {
  mars = new Group(); //建立一个组
  marsParent = new Group();
  scene.add(marsParent);
  loader.load("./Solar/mars.jpeg", (texture) => {
    const geometry = new SphereGeometry(85, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    mars.position.x -= 1200;
    mars.add(mesh); //添加到组里
    marsParent.add(mars);
  });
};

// 设置木星
let jupiter, jupiterParent;
const setJupiter = () => {
  jupiter = new Group(); //建立一个组
  jupiterParent = new Group();
  scene.add(jupiterParent);
  loader.load("./Solar/jupiter.jpeg", (texture) => {
    const geometry = new SphereGeometry(150, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    jupiter.position.x -= 1500;
    jupiter.add(mesh); //添加到组里
    jupiterParent.add(jupiter);
  });
};

// 设置土星
let saturn, saturnParent;
const setSaturn = () => {
  saturn = new Group(); //建立一个组
  saturnParent = new Group();
  scene.add(saturnParent);
  loader.load("./Solar/saturn.jpeg", (texture) => {
    const geometry = new SphereGeometry(120, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    saturn.position.x -= 1800;
    saturn.add(mesh); //添加到组里
    saturnParent.add(saturn);
  });
};

//设置天王星
let uranus, uranusParent;
const setUranus = () => {
  uranus = new Group();
  uranusParent = new Group();
  scene.add(uranusParent);
  loader.load("./Solar/uranus.jpeg", (texture) => {
    const geometry = new SphereGeometry(50, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    uranus.position.x -= 2100;
    uranus.add(mesh); //添加到组里
    saturnParent.add(uranus);
  });
};

//设置海王星
let neptune, neptuneParent;
const setNeptune = () => {
  neptune = new Group();
  neptuneParent = new Group();
  scene.add(neptuneParent);
  loader.load("./Solar/neptune.jpeg", (texture) => {
    const geometry = new SphereGeometry(50, 20, 20); //球体模型
    const material = new MeshBasicMaterial({ map: texture }); //材质 将图片解构成 THREE 能理解的材质
    const mesh = new Mesh(geometry, material); //网孔对象 第一个参数是几何模型 (结构),第二参数是材料 (外观)
    neptune.position.x -= 2300;
    neptune.add(mesh); //添加到组里
    neptuneParent.add(neptune);
  });
};

import * as THREE from "three";
const stars = () => {
  const geometry = new SphereGeometry(10000, 100, 50) //new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(10000)); // x
    vertices.push(THREE.MathUtils.randFloatSpread(10000)); // y
    vertices.push(THREE.MathUtils.randFloatSpread(10000)); // z
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: 0x888888 })
  );
  scene.add(particles);
};

//设置公转函数
const revolution = () => {
  mercuryParent.rotation.y += 0.015;
  venusParent.rotation.y += 0.0065;
  earthParent.rotation.y += 0.05;
  marsParent.rotation.y += 0.03;
  jupiterParent.rotation.y += 0.001;
  saturnParent.rotation.y += 0.02;
  uranusParent.rotation.y += 0.09;
  neptuneParent.rotation.y += 0.001;
};
//设置自转函数
const selfRotation = () => {
  sun.rotation.y += 0.004;
  mercury.rotation.y += 0.002;
  venus.rotation.y += 0.005;
  earth.rotation.y += 0.01;
  mars.rotation.y += 0.01;
  jupiter.rotation.y += 0.08;
  saturn.rotation.y += 1.5;
  uranus.rotation.y += 1;
  neptune.rotation.y += 0.1;
};

// 循环场景、相机、位置更新
let animateId;
const loop = () => {
  stats.update();
  animateId = requestAnimationFrame(loop);
  revolution();
  selfRotation();
  renderer.render(scene, camera);
  camera.lookAt(scene.position);
};
const init = (rootDOM) => {
  setStats(rootDOM);
  setScene(rootDOM); //设置场景
  setCamera(); //设置相机
  // starForge(); //设置满天星背景
  setSun(); // 设置太阳
  setMercury(); //设置水星
  setVenus(); //设置金星
  setEarth(); // 地球
  setMars(); //火星
  setJupiter(); // 木星
  setSaturn(); // 土星
  setUranus(); // 天王星
  setNeptune(); //海王星
  stars()
  setControls(); //设置可旋转控制
  loop(); // 循环动画
};

const canvas = ref()
onMounted(() => {
  init(canvas.value);
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animateId); // Stop the animation
  scene = null;
  camera = null;
  renderer = null;
  stats.end();
  canvas.value.innerHTML = "";
  console.log("已销毁");
})
</script>
