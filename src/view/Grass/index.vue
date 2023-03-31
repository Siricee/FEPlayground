<template>
    <div id="mountedDOM"></div>
</template>

<script>
import { run } from "./main";
export default {
  mounted() {
    run(document.getElementById('mountedDOM'));
  },
};
</script>

<style>
body {
  margin: 0;
}

canvas {
  cursor: grab;
  display: block;
}

canvas:active {
  cursor: grabbing;
}
</style>
