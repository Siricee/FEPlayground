<template>
  <section class="wrapper">
    <div id="mountedDOM" ref="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>
    <div class="caption">
      <p>AtomiControl is used as TransformControls</p>
      <a href="https://github.com/atomicra/AtomiControl" target="_blank">AtomiControl :
        https://github.com/atomicra/AtomiControl</a>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { run, dispose } from "./main";

const mountedDOM = ref()
onMounted(()=>{
  run(mountedDOM.value)
})
onBeforeUnmount(()=>{
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
}
</style>