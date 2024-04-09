<template>
  <div id="mountedDOM" ref="mountedDOM"></div>
</template>

<script setup>
import { run } from "./main";
import { ref, onMounted } from 'vue'

const mountedDOM = ref()
onMounted(() => {
  run(mountedDOM.value)
})
</script>

<style scoped>
body {
  margin: 0;
}

#mountedDOM {
  width: 100%;
  height: 100%;
}

canvas {
  cursor: grab;
  display: block;
}

canvas:active {
  cursor: grabbing;
}
</style>
