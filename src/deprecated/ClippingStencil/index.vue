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
</style>
