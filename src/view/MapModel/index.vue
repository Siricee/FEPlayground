<template>
  <div id="map-model" style="width:100%;height:100%"></div>
</template>
<script>
import { main, dispose } from "./index.js";
export default {
  mounted() {
    main("map-model");
  },
  beforeCreate() {
    dispose("map-model");
  },
};
</script>
