<template>
  <section class="wrapper">
    <div id="mountedDOM"></div>
    <div class="gui-container" ref="GUIcontainer"></div>

    <div class="caption">
      <p>Image: 2024小米徕卡影像大赛 - <a class="link"
          href="https://www.mi.com/visual/award/workDetail?type=imageCiTiao&id=661788c063766061d7579a0a">小朋友吃苹果
          @卷柏这个植物不错</a></p>
      <p>Shader algorithm <a class="link" href="https://github.com/shun-webdesign/Film-Grain">reference</a></p>
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
  console.log('onBeforeMount')
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
  font-size: 12px;
  
  .link {
    color: #ff6900;
  }
}
</style>