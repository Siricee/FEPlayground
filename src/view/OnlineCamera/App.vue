<template>
  <camera-wrapper class="cameraBox" :cameraList="cameraList"></camera-wrapper>
</template>

<script>
import CameraWrapper from './CameraWrapper.vue'
export default {
  components:{
    CameraWrapper,
  },
  data() {
    return {
      cameraList: [11410, 11435, 11428, 11420, 11483, 9621, 7488, 12663, 7302], // 12642, 12647, 12652, 12656],
    };
  },
};
</script>

<style>
.cameraBox {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
}
</style>
