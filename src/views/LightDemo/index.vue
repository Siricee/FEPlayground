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

.gui-container {
  position: absolute;
  top: 0;
  left: 15px;
}
</style>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { init, buildGui, render, dispose } from "./light.js";

const container = ref()
const GUIcontainer = ref()
onMounted(() => {
  init(container.value)
  buildGui(GUIcontainer.value)
  render()
})
onBeforeUnmount(() => {
  dispose()
})
</script>
