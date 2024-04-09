<template>
  <section class="wrapper">
    <div id="mountedDOM" ref="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="introductions">
      <p class="keywords">
        Original Model from
        <a target="_blank" href="https://sketchfab.com/3d-models/emojis-3d-animated-and-stable-free-5e88760d14b8474cacb867b197456334">sketchfab.com/3d-models</a>, modified with Blender.
      </p>
    </div>
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

.gui-container {
  position: absolute;
  top: 0;
  left: 15px;
}
.introductions {
  position: absolute;
  left: 50%;
  bottom: 1em;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  user-select: none;
}

.introductions .keywords,
.introductions .exteral-link,
.introductions a {
  font-family: "Consolas";
}
.introductions .keywords a{
  color: white;
  text-decoration: underline;
}
</style>