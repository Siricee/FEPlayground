<template>
  <div ref="map"></div>
</template>
<script>
import SHMap from "./mapSH";
export default {
  data() {
    return {
      mapInstance: null,
    };
  },
  mounted() {
    this.mapInstance = new SHMap(this.$refs.map);
  },
  beforeDestroy() {
    this.mapInstance.dispose();
  },
};
</script>
