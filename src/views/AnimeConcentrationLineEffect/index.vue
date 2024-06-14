<template>
  <section class="wrapper">
    <main>
      <img
        src='https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920' />
      <img
        src='https://images.unsplash.com/photo-1621451683587-8be65b8b975c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920' />

      <canvas id="myCanvas"></canvas>
    </main>
  </section>
</template>

<script setup>
import { run } from "./main";
import { onMounted } from "vue";
onMounted(() => {
  run(document.getElementById("myCanvas"))
})
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=BIZ+UDGothic&display=swap");


.wrapper {

  --x: 90vw;
  --y: 100vh;
  --scale: 1;
  --duration: 2.5s;

  background-color: white;
  overscroll-behavior-x: none;
  overscroll-behavior-y: none;
  overflow: hidden;
}

.wrapper {
  width: 100vw;
  height: 100vh;
  font-family: serif;
  color: black;
  text-align: center;
  line-height: 1;
}

main {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

main img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 33%;
}

@keyframes slider {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes focus {
  0% {
    --x: 90vw;
    --y: 90vh;
    margin-left: calc(-100vw + var(--x));
    margin-top: calc(-100vh + var(--y));
    --scale: 1.2;
    transform: scale(var(--scale));
  }

  100% {
    --x: 100vw;
    --y: 110vh;
    margin-left: calc(-100vw + var(--x));
    margin-top: calc(-100vh + var(--y));
    --scale: 1.1;
    transform: scale(var(--scale));
  }
}

main img:nth-of-type(2) {
  object-position: center center;
  opacity: 0;
  animation: slider var(--duration) steps(2, jump-none) infinite;
}

#myCanvas {
  position: absolute;
  animation: focus var(--duration) steps(2, jump-none) infinite;
}
</style>