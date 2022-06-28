<template>
  <div class="camera-wrapper">
  <video-box v-for="id in ids"
             :key="id"
             :id="id"></video-box>
</div>
</template>

<script>
import VideoBox from './VideoBox.vue';
export default {
  components: {
    VideoBox,
  },
  props: ['cameraList'],
  data() {
    return {
      arr: [],//监控号码 示例：[11410, 11435, 11428, 11420, 11483, 9621, 7488, 12663, 7302],
      ids: [],
      index: -1,
      timer: null,
    }
  },
  created() {
    this.arr = this.cameraList
  },
  mounted() {
    this.loadVideos();
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  methods: {
    loadVideos() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.index += 1;
        if (this.index >= this.arr.length) return;
        this.ids.push(this.arr[this.index])
        this.loadVideos()

        console.log(this.index, this.ids)
      }, 1000)
    }
  }
}

</script>

<style>
.video-box {
  width: 30vw;
  height: 25vh;
  display: inline-block;
}
</style>