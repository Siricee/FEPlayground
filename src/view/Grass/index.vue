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

#mountedDOM {
  width: 100%;
  height: 100%;
}

canvas {
  cursor: grab;
  display: block;
}

canvas:active {
  cursor: grabbing;
}
</style>
