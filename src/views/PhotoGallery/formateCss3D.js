import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const CONFIG = {
  card: [
    {
      url: "./pic1.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic2.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic3.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic4.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic5.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic6.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic3.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic4.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic5.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
    {
      url: "./pic6.png",
      value:Math.round(Math.random()*100),
      text:'文本文本',
    },
  ],
  cardStyle: {
    width: "20px",
    height: "20px",
  },
  autoplay: false,
  controlEnable: true, // 开启控制后点击事件会失效。
  playSpeed: 0.005, // 默认逆时针旋转，接收负数可顺时针旋转。
  clickCallBack: (...args) => {
    console.log([...args]);
  },
};

let renderer, scene, camera, controls;
let cardGroup;

/**
 * 设定renderer
 * @param ref {DOM} 传入一个DOM元素作为容器，默认为空。当该参数为空时使用window作为容器。
 */
const setRenderer = (ref = null) => {
  renderer = new CSS3DRenderer();
  const width = ref ? ref.clientWidth : window.innerWidth;
  const height = ref ? ref.clientHeight : window.innerHeight;
  renderer.setSize(width, height);
  if (ref) {
    ref.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }
};

const setScene = () => {
  scene = new THREE.Scene();
};
const setContent = () => {
  cardGroup = new THREE.Group();
  CONFIG.card.forEach((card, index) => {

    let el = document.createElement("div");
    el.classList.add('card')
    el.classList.add('card-'+index)

    el.style.width = "100px";
    el.style.height = "100px";
    el.style.textAlign= 'center'
    el.style.border = "1px solid red";
    el.style.cursor = "pointer";
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundImage = "url(" + card.url + ")";

    let subTextEl = document.createElement("div");
    subTextEl.classList.add('card-text')
    subTextEl.innerText = card.text;
    el.appendChild(subTextEl);
    let subValueEl = document.createElement("div");
    subValueEl.classList.add('card-value')
    subValueEl.innerText = card.value;
    el.appendChild(subValueEl);

    let sprite = new CSS3DSprite(el);

    sprite.position.x -= 230;
    let revolutionGroup = new THREE.Group();
    revolutionGroup.add(sprite);
    revolutionGroup.rotateY((2 * Math.PI * index) / CONFIG.card.length);
    cardGroup.add(revolutionGroup);
  });
  scene.add(cardGroup);
};
const setCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    10,
    1000
  );
  camera.position.set(0, 140,500) //设置相机位置
  camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
};
function animate() {
  if (animationAutomatic) cardGroup.rotation.y += CONFIG.playSpeed;
}

const setControl = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableRotate = true;
};

const render = () => {
  window.requestAnimationFrame(() => {
    render();
    if (CONFIG.autoplay) {
      animate();
    }
  });
  renderer.render(scene, camera);
};

// 控制部分，和animate耦合
let animationAutomatic = true;
function bindingEvents(_cardGroup) {
  let targets = [];
  _cardGroup.children.forEach((ch) => {
    let CSS3dSpriteArray = ch.children;
    CSS3dSpriteArray.forEach((ch) => {
      targets.push(ch.element);
    });
  });
  targets.forEach((el, index) => {
    el.addEventListener("click", () => {
      CONFIG.clickCallBack(el, index);
    });
    el.addEventListener("mouseover", () => {
      animationAutomatic = false;
    });
    el.addEventListener("mouseout", () => {
      animationAutomatic = true;
    });
  });
}

function run() {
  document.body.style.backgroundColor = "#5d7890";
  setRenderer();
  setScene();
  setCamera();
  setContent();
  if (CONFIG.controlEnable) {
    setControl();
  }
  bindingEvents(cardGroup);
  render();
}
run();
