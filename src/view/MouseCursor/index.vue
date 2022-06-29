<template>
  <section class="viewpoint" ref="viewpoint">
    <span class="text-block">文字测试文字测试</span>
    <div class="color-block"></div>
    <div class="color-block-2"></div>
    <img class="image-block" src="/PhotoGallery/pic.png" alt="" />
    <div class="buttons-block">
      <button class="button">点击测试</button>
    </div>
    <footer>
      <p>效果参考：<a href="https://github.com/chokcoco/iCSS/issues/186"
        >有意思的鼠标指针交互探究 · Issue #186 · chokcoco/iCSS</a
      ></p>
      <p>灵感来源：<a href="https://www.laphase5.com/en">Interactive & instructive studio - La Phase 5</a></p>
    </footer>
  </section>
</template>
<style scoped>
* {
  cursor: none;
}
.viewpoint {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.text-block {
  font-size: 20px;
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
}
.color-block,
.color-block-2 {
  position: absolute;
  display: inline-block;
  width: 50%;
  height: 10%;
  left: 50%;
  top: 24%;
  transform: translateX(-50%);
  background-image: linear-gradient(to right, white, black);
}
.color-block-2 {
  top: 34%;
  background-image: linear-gradient(
    to right,
    red,
    #ff4d00,
    #ff9900,
    #ffe600,
    #ccff00,
    #80ff00,
    #33ff00,
    #00ff1a,
    #00ff66,
    #00ffb3,
    cyan,
    #00b3ff,
    #0066ff,
    #001aff,
    #3300ff,
    #8000ff,
    #cc00ff,
    #ff00e6,
    #ff0099,
    #ff004d,
    red
  );
}
.image-block {
  width: 30%;
  height: 30%;
  object-fit: contain;
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;
}
.buttons-block {
  position: absolute;
  top: 74%;
  left: 50%;
  transform: translateX(-50%);
}
footer {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
<script>
import { CMouse } from "./MouseCursor";
export default {
  mounted() {
    new CMouse(this.$refs.viewpoint);
  },
};
</script>
