<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="caption">
      <p>Reference: <a class="link"
          href="https://tympanus.net/codrops/2024/03/21/case-study-design-embraced-portfolio-2024/">Case Study: Design
          Embraced Portfolio – 2024 | Codrops</a></p>
      <p>Rewrite demos by Threejs, based PlaneGeometry and ShaderMaterial. Algorithm Visualization click <a class="link"
          href="https://www.desmos.com/calculator/l73yeskwxl">here</a></p>
    </div>
  </section>
</template>
<script setup>
import { run, dispose } from "./main";
import { onMounted, onBeforeMount } from "vue";
onMounted(() => {
  run(document.getElementById("mountedDOM"));
})
onBeforeMount(() => {
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

.caption {
  position: absolute;
  color: white;
  bottom: 15px;
  left: 50%;
  transform: translate(-50%);
  text-align: center;

  .link {
    color: aquamarine;
  }
}
</style>