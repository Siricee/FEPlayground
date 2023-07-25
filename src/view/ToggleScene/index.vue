<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="caption">
      <p>This is a demo of toggling multi-scenes.</p>
      <p>Two meshs that each one within a scene. While one scene is in render loop, the other one will be paused.</p>
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
}
</style>