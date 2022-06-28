<template>
  <div class="wrap">
    <div id="photos">
      <div class="card" v-for="index in 6" :key="index">
        <img :class="`pic${index}`" src="/PhotoGallery/pic.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  perspective: 1600px;
  perspective-origin: 0 -50px;
  position: absolute;
  top: 30%;
  left: 40%;
}
#photos {
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  transition: all 0.5s ease;
  animation: spin 20s linear infinite;
}
#photos:hover {
  animation-play-state: paused;
}
.card {
  width: 200px;
  height: 200px;
  margin-bottom: 100px;
  position: absolute;
  border: 1px solid gray;
  backface-visibility:visible;
}
img {
  width: 100%;
  height: 100%;
}
@keyframes spin {
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(360deg);
  }
}
@keyframes selfRotate {
  to{
    transform: rotateY(-360deg);
  }
}
</style>

<script>
export default {
  mounted() {
    var phoArr = document.getElementById("photos");
    var phoNum = phoArr.getElementsByClassName("card");
    var phoLen = phoNum.length;
    var ang = Math.floor(360 / phoLen);
    for (var i = 0; i < phoLen; i++) {
      phoNum[i].style.transform =
        "rotateY(" + -ang * i + "deg) translateZ(300px) ";
    }
  },
};
</script>
