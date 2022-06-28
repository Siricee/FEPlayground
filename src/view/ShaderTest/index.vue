<template>
  <canvas id="renderCanvas" width="1000" height="1000"></canvas>
</template>
<style scoped>
#renderCanvas {
  display: block;
  margin: auto;
  width: min(90vh,90vw);
  height: min(90vh,90vw);
}
</style>
<script>
import main from "./webgl";
export default {
  mounted() {
    main();
  },
};
</script>
