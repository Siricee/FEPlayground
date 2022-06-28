<template>
  <div class="video-box">
    <div class="__video_box" ref="videoBoxRef" @click.prevent="reload"></div>
    <div class="openDetail" @click="openDetail"></div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    init() {
      if (!this.id) return;

      let iframe = document.createElement("iframe");
      iframe.src = `http://116.236.40.138:8081/oauth/privateCloud/videoView?ubiLogicId=${this.id}`;
      this.$refs.videoBoxRef.appendChild(iframe);

      iframe.onload = () => {
        console.log(this.id + ' loaded')
      };
    },
    // 点击强制刷新
    reload(){
      console.log('点击重试')
      this.$refs.videoBoxRef.childNodes.forEach(e=>{
        this.$refs.videoBoxRef.removeChild(e);
      })
      this.init()
    },
    // 点击右下角，添加传出的视频id。
    openDetail(){
      console.log('点击的视频id  ',this.id)
    }
  }
}

</script>

<style>
.video-box {
  position: relative;
}
.__video_box {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.__video_box iframe {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.openDetail {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 50px;
  height: 50px;
  background-color: #fff;
  cursor: pointer;
  z-index: 1;
}
</style>
