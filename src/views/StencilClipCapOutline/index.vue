<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="caption">
      <p>
        Reference: <a href="https://discourse.threejs.org/t/three-mesh-bvh-a-plugin-for-fast-geometry-raycasting-and-spatial-queries/26394/18"
          target="_blank">Three-mesh-bvh - Resources - three.js forum</a>
      </p>
    </div>
  </section>
</template>
<script lang="js">
import { run, dispose } from "./main";
export default {
  mounted() {
    run(document.getElementById("mountedDOM"));
  },
  beforeDestroy() {
    dispose()
  }
};
</script>
<style scoped>
.wrapper,
#mountedDOM {
  width: 100%;
  height: 100%;
}

.gui-container {
  position: absolute;
  top: 50px;
  left: 15px;
}

.caption {
  position: absolute;
  color: white;
  bottom: 15px;
  left: 50%;
  transform: translate(-50%);
  text-align: center;
}
</style>