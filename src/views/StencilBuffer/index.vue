<template>
  <section>
    <div id="mountedDOM">
      <p class="illustrate">
        <a href="https://www.youtube.com/watch?v=X93GxW84t84"
          >three.js Stencil Buffer - Learn the WebGL Stencil Buffer - YouTube
          https://www.youtube.com/watch?v=X93GxW84t84</a
        >
      </p>
    </div>
    <div class="gui-container" ref="GUIcontainer"></div>
  </section>
</template>

<script>
import { run } from "./main";
export default {
  mounted() {
    run(document.getElementById("mountedDOM"));
  },
};
</script>

<style>
.illustrate {
  position: absolute;
  bottom: 3em;
  width: 100%;
  text-align: center;
}
.gui-container{
  position: absolute;
  top: 0;
  left: 15px;
}
</style>
