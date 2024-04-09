<template>
  <section class="wrapper">
    <div id="mountedDOM" ref="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <video
      id="video"
      loop
      crossOrigin="anonymous"
      playsinline
      style="display:none"
      muted
    >
      <source
        src="/Reflections&VideoTextures/drei.mp4"
        type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      />
    </video>
    <div class="introductions">
      <p class="keywords">
        Draco Model,
        <a
          href="https://github.com/0beqz/vanilla-threejs-meshreflectormaterial-example"
          >MeshReflectorMaterial</a
        >,
        <a href="https://github.com/protectwise/troika">troika-three-text</a>,
        VideoMaterial.
      </p>
      <p class="exteral-link">
        Origin Scene based on React.
        <a
          target="_blank"
          href="https://codesandbox.io/s/ground-reflections-and-video-textures-bfplr"
          >Link</a
        >
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
