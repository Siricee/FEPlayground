<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="fomula">
      Matrix = centerM · T · R · S · centerM<sup>-1</sup>
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

.fomula {
  font-family: consolas;
  color: #fff;
  font-size: 1.3em;
  position: absolute;
  top: 3em;
  left: 50%;
  transform: translateX(-50%);
}
</style>