<template>
  <div class="photo-wall-wrapper">
    <div class="photo-wall" ref="photoWallDOM"></div>
  </div>
</template>

<style lang="less" scoped>
.photo-wall-wrapper {
  width: 100%;
  height: 100%;
  display: block;
  background-color: darkgray;

  .photo-wall {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
/* 注：scoped css对生成的DOM不起效 */
<style lang="less">
.card {
  cursor: pointer;
  position: relative;
  color: #fff;

  .card-text {
    text-align: center;
    width: 100%;
    position: absolute;
    top: 1em;
  }

  .card-value {
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 1em;
  }
}
</style>

<script>
/**
  PhotoWall

  每个卡片样式可以在外部使用css控制。
  
  注：对容器的响应式只针对 ui-component 元素里面自动创建的canvas响应，对外层无反应

  props:
  data 示例：
  [
      imageUrl: 'scn/file/upload/2zb9hsl7wlj4/NPhotoWallV1TestImage.png',
      value: Math.round(Math.random() * 100),
      text: '文本文本',
  ]
  
  config 示例 默认传空，可以不传。
  {
     cardStyle: {               // 卡片样式
      width: '50px',
      height: '35px',
    },
    autoplay: true,          // 自动旋转动画
    controlEnable: false,   // 开启控制后点击事件会失效。
    rotateRadius: 100,      // 旋转半径
    playSpeed: 0.005,       // 默认逆时针旋转，接收负数可顺时针旋转。
    clickCallBack: (...args) => { // 点击事件回调
      console.log([...args])
    },
  }
 */
import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let CONFIG = {
  card: [],
  cardStyle: {
    width: "150px",
    height: "150px",
  },
  autoplay: true,
  controlEnable: false, // 开启控制后点击事件会失效。
  rotateRadius: 250,
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
  let renderEl = renderer.domElement;
  renderEl.style.width = "100%";
  renderEl.style.height = "100%";
  if (ref) {
    console.log("ref", width, height);
    ref.appendChild(renderEl);
  } else {
    document.body.appendChild(renderEl);
  }
};

const setScene = () => {
  scene = new THREE.Scene();
};
/* eslint-disable no-prototype-builtins */
const setContent = () => {
  cardGroup = new THREE.Group();
  CONFIG.card.forEach((card, index) => {
    let el = document.createElement("div");
    el.classList.add("card");
    el.classList.add("card-" + index);

    el.style.width = CONFIG.cardStyle.width;
    el.style.height = CONFIG.cardStyle.height;

    if (card.hasOwnProperty("imageUrl")) {
      el.style.backgroundSize = "contain";
      el.style.backgroundPosition = "center center";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundImage = "url(" + card.imageUrl + ")";
    }
    if (card.hasOwnProperty("text")) {
      let subTextEl = document.createElement("div");
      subTextEl.classList.add("card-text");
      subTextEl.innerText = card.text;
      el.appendChild(subTextEl);
    }
    if (card.hasOwnProperty("value")) {
      let subValueEl = document.createElement("div");
      subValueEl.classList.add("card-value");
      subValueEl.innerText = card.value;
      el.appendChild(subValueEl);
    }
    let sprite = new CSS3DSprite(el);

    sprite.position.x -= CONFIG.rotateRadius;
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
  camera.position.set(0, 140, 500); // 设置相机位置
  camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)
};
function animate() {
  if (animationAutomatic) cardGroup.rotation.y += CONFIG.playSpeed;
}
const setControl = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableRotate = true;
};
let requestAnimationFrameIndex = 0; // requestAnimationFrame的函数id，记住这个便于销毁
const render = () => {
  requestAnimationFrameIndex = requestAnimationFrame(() => {
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

function run(ref) {
  setRenderer(ref);
  setScene();
  setCamera();
  setContent();
  if (CONFIG.controlEnable) {
    setControl();
  }
  bindingEvents(cardGroup);
  render();
}

function resize(ref) {
  let refClientWidth = ref ? ref.clientWidth : window.innerWidth;
  let refClientHeight = ref ? ref.clientHeight : window.innerHeight;
  renderer.setSize(refClientWidth, refClientHeight);
  scene.position.set(refClientWidth / 2, refClientHeight / 2, 0);
  camera.position.set(refClientWidth / 2, refClientHeight / 2 + 140, 500);
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
}

const mockData = new Array(7).fill(1).map(() => {
  return {
    imageUrl: "./PhotoGallery/pic.png",
    value: Math.round(Math.random() * 100),
    text: "文本文本",
  };
});

export default {
  data() {
    return {
      data: mockData,
    };
  },
  created() {
    CONFIG.card = this.data;
  },
  mounted() {
    run(this.$refs.photoWallDOM);
    this.$nextTick(() => {
      this.resize("photoWallDOM", () => resize(this.$refs.photoWallDOM));
    });
  },
  beforeDestroy() {
    cancelAnimationFrame(requestAnimationFrameIndex);
  },
  methods: {
    resize(refName, fn) {
      if (!this.$refs[refName]) return;
      const ro = new ResizeObserver(debounce(fn));
      ro.observe(this.$refs[refName]);
      this.$once("hook:beforeDestory", () => {
        ro.unobserve(this.$refs[refName]);
      });
    },
  },
};

/** Static Funciton, for utils. */
const debounce = (fn) => {
  let timeout = null;
  return function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, 200);
  };
};
</script>
