<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="introductions">
      <p class="keywords">
        GLTFModel,
        <a href="https://github.com/mayacoda/toon-shader">ToonShaderMaterial</a>,
        <a href="https://threejs.org/examples/#webgl_postprocessing_fxaa">FXAA</a>.
      </p>
      <p class="exteral-link">
        Origin Scene based on
        <a target="_blank"
          href="https://docs.pmnd.rs/react-three-fiber/getting-started/examples">react-three-fiber/getting-started/examples</a>.
        <a target="_blank" href="https://codesandbox.io/s/7duy8">Link</a>
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

.introductions {
  position: absolute;
  left: 50%;
  bottom: 1em;
  transform: translateX(-50%);
  color: black;
  text-align: center;
}

.introductions .keywords,
.introductions .exteral-link,
.introductions a {
  font-family: "Consolas";
}

.introductions .keywords a {
  color: #9b9b9b;
  text-decoration: underline;
}
</style>
