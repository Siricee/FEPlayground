<template>
  <div ref="map"></div>
</template>
<script>
import ChinaMap from "./map";
export default {
  data() {
    return {
      mapInstance: null,
    };
  },
  mounted() {
    this.mapInstance = new ChinaMap(this.$refs.map);
  },
  beforeDestroy() {
    this.mapInstance.dispose();
  },
};
</script>
