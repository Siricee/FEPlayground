<template>
  <section class="wrapper">
    <div id="mountedDOM" ref="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
  </section>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { run, dispose } from "./main";

const mountedDOM = ref()
onMounted(() => {
  run(mountedDOM.value)
})
onBeforeUnmount(() => {
  dispose()
})
</script>
<style scoped>
.wrapper,
#mountedDOM {
  width: 100%;
  height: 100%;
}
.gui-container{
  position: absolute;
  top: 0;
  left: 15px;
}
</style>