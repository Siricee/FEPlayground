<template>
  <section class="wrapper">
    <div class="canvas" ref="container"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
  </section>
</template>
<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
.gui-container{
  position: absolute;
  top: 0;
  left: 15px;
}
</style>
<script>
import { init, buildGui, render,dispose } from "./light.js";
export default {
  mounted() {
    init(this.$refs.container);
    buildGui(this.$refs.GUIcontainer);
    render();
  },
  beforeDestroy(){
    dispose()
  }
};
</script>
