<template>
  <div class="wrapper">
    <Navigation class="navigation"></Navigation>
    <div class="view-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="less" scoped>
.wrapper {
  display: contents;
}
.view-container {
  width: 100%;
  height: 100%;
}
</style>
<script>
import Navigation from "../components/Navigation.vue";
export default {
  components: { Navigation },
};
</script>
