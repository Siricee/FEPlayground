<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
  </section>
</template>
<script setup>
import { run, dispose } from "./main";
import { onMounted, onBeforeMount } from "vue";
onMounted(() => {
  run(document.getElementById("mountedDOM"));
})
onBeforeMount(() => {
  console.log('onBeforeMount')
  dispose()
})
</script>
<style scoped>
.wrapper,
#mountedDOM {
  width: 100%;
  height: 100%;
}

.gui-container {
  position: absolute;
  top: 0;
  left: 15px;
}
</style>