<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="info">
			"T" translate | "R" rotate | "S" scale<br />
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
.info{
  position: absolute;
  top: 3em;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}
</style>