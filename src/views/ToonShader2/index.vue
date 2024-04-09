<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="introductions">
      <p class="keywords">
        Reference:
        <a target="_blank" href="https://github.com/Yuki-Sakaguchi/threejs-toon-shader">Yuki-Sakaguchi/threejs-toon-shader</a>
      </p>
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
.introductions {
  position: absolute;
  left: 50%;
  bottom: 1em;
  transform: translateX(-50%);
  color: black;
  text-align: center;
  user-select: none;
}

.introductions .keywords,
.introductions .exteral-link,
.introductions a {
  font-family: "Consolas";
}
.introductions .keywords a{
  color: slateblue;
  text-decoration: underline;
}
</style>