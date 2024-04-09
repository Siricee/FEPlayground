import * as THREE from "three";
import * as d3 from "d3-geo";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
THREE.Cache.enabled = true;

export default class ChinaMap {
  constructor(DOM) {
    this.init(DOM);
    console.log("init finished.");
    return this
  }
  scene = null;
  camera = null;
  renderer = null;
  controller = null;
  activeInstersect = [];
  raycaster = null;
  requestAnimationFrameIndex = null;
  init(DOM) {
    this.scene = new THREE.Scene();
    this.setCamera();
    this.setLight();
    this.loadMapData();
    this.setRenderer(DOM);
    this.setController();
    this.setRaycaster();
    // this.addHelper();
    this.render();
  }
  setCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 200);
    this.camera.lookAt(this.scene.position);
  }
  setLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
    this.scene.add(ambientLight);
  }
  setRenderer(DOM) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    DOM.appendChild(this.renderer.domElement);
  }
  loadMapData() {
    const loader = new THREE.FileLoader();
    loader.load("./MapGeoJsonChina/china.json", (data) => {
      const jsondata = JSON.parse(data);
      this.generateGeometry(jsondata);
    });
  }
  generateGeometry(jsondata) {
    // 初始化一个地图对象
    this.map = new THREE.Object3D();
    // 墨卡托投影转换
    const projection = d3
      .geoMercator()
      .center([104.0, 37.5])
      .translate([0, 0]);

    jsondata.features.forEach((elem) => {
      // 定一个省份3D对象
      const province = new THREE.Object3D();
      // 每个的 坐标 数组
      const coordinates = elem.geometry.coordinates;
      // 循环坐标数组
      coordinates.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          const shape = new THREE.Shape();
          const lineMaterial = new THREE.LineBasicMaterial({
            color: "white",
          });
          const lineGeometry = new THREE.BufferGeometry();

          for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i]);
            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
            // let vertices = new THREE.Vector3(x, -y, 5)
            // lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          }

          const extrudeSettings = {
            depth: 10,
            bevelEnabled: false,
          };

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshBasicMaterial({
            color: "#2defff",
            transparent: true,
            opacity: 0.6,
          });
          const material1 = new THREE.MeshBasicMaterial({
            color: "#3480C4",
            transparent: true,
            opacity: 0.5,
          });

          const mesh = new THREE.Mesh(geometry, [material, material1]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          // 将省份的属性 加进来
          province.properties = elem.properties;
          province.add(mesh);
          province.add(line);
        });
      });
      this.map.add(province);
    });
    this.scene.add(this.map);
  }
  setController() {
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
  }


  mouseMoveCallBack = null
  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    let El = document.createElement("div");
    El.className = "tooltip";
    // El.style.border = "2px solid red";
    // El.style.width = "4em";
    // El.style.height = "4em";
    El.style.position = "absolute";
    El.style.color = "white"
    El.style.whiteSpace = "no-wrap"

    document.body.appendChild(El);
    this.tooltip = El;

    this.mouseMoveCallBack = (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.tooltip.style.left = event.clientX + 2 + "px";
      this.tooltip.style.top = event.clientY + 2 + "px";
    };

    window.addEventListener("mousemove", this.mouseMoveCallBack, false);
  }
  render() {
    this.requestAnimationFrameIndex = window.requestAnimationFrame(() => {
      this.animate();
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
  }
  addHelper() {
    const helper = new THREE.CameraHelper(this.camera);
    this.scene.add(helper);
  }
  animate() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 算出射线 与当场景相交的对象有那些
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    // 恢复上一次清空的
    if (this.lastPick) {
      this.lastPick.object.material[0].color.set("#2defff");
      this.lastPick.object.material[1].color.set("#3480C4");
    }
    this.lastPick = null;
    this.lastPick = intersects.find(
      (item) => item.object.material && item.object.material.length === 2
    );
    if (this.lastPick) {
      this.lastPick.object.material[0].color.set(0xff0000);
      this.lastPick.object.material[1].color.set(0xff0000);
    }
    this.showTip();
  }
  showTip() {
    // 显示省份的信息
    if (this.lastPick) {
      const properties = this.lastPick.object.parent.properties;
      this.tooltip.innerText = properties.name;
      this.tooltip.style.visibility = "visible";
    } else {
      this.tooltip.style.visibility = "hidden";
    }
  }
  dispose() {
    console.log("running instance dispose");
    window.removeEventListener("mousemove", this.mouseMoveCallBack);
    document.body.removeChild(document.querySelector(".tooltip"))
    this.tooltip = null
    cancelAnimationFrame(this.requestAnimationFrameIndex);
    try {
      this.scene.traverse((child) => {
        if (child.material) {
          child.material.dispose();
        }
        if (child.geometry) {
          child.geometry.dispose();
        }
        child = null;
      });
    } catch (e) { }
    this.renderer.forceContextLoss();
    this.renderer.renderLists.dispose()
    this.renderer.dispose();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controller = null;
    this.activeInstersect = [];
    this.raycaster = null;
    console.log("instance has been disposed");
  }
}
