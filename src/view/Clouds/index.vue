<template>
    <section class="wrapper">
        <div id="mountedDOM"></div>
        <div class="stat-container"></div>
        <div class="gui-container" ref="GUIcontainer"></div>
    </section>
</template>
<script>
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
.stat-container{
  position: absolute;
  top: 0;
  left: 15px;
}
.gui-container{
  position: absolute;
  top: 0px;
  left: 80px;
}
</style>