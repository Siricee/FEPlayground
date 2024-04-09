<template>
  <div ref="map"></div>
</template>
<script setup>
import ChinaMap from "./map";
import { onMounted, onBeforeUnmount, ref } from 'vue'

const map = ref()
onMounted(() => {
  const mapinstance = new ChinaMap(map.value)

  onBeforeUnmount(() => {
    mapinstance.dispose()
  })
})

</script>
