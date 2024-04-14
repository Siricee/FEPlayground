<template>
  <section class="container">
    <header class="header">
      Feature Showcase
    </header>
    <section class="sketch-list">
      <SketchItem class="sketch-item" v-for="(item, index) of sketchList" :key="item.name" :cover="item.cover"
        @click="router.push(item.path)" :text="item.text || item.name" />
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import SketchItem from './SketchItem.vue';
import { router } from '@/router'

const sketchList = ref([
  {
    name: 'Solar',
    path: '/solar',
    cover: 'solar.png',
  },
  {
    name: 'AtomiController',
    path: '/AtomiController',
    cover: 'AtomiController.png',
  },
  {
    name: 'Clouds',
    path: '/Clouds',
    cover: 'clouds.png',
  },
  {
    name: 'EllipseCurveCamera',
    path: '/EllipseCurveCamera',
    cover: 'EllipseCurveCamera.png',
  },
  {
    name: 'Emoji',
    path: '/Emoji',
    cover: 'Emoji.png',
  },
  {
    name: 'Grass',
    path: '/Grass',
    cover: 'Grass.png',
  },
  {
    name: 'GridGauge',
    path: '/GridGauge',
    cover: 'GridGauge.png',
  },
  {
    name: 'HumanSkin',
    path: '/HumanSkin',
    cover: 'HumanSkin.png',
  },
  {
    name: 'LimitFPS',
    path: '/LimitFPS',
    cover: 'https://img1.baidu.com/it/u=905083005,954272425&fm=253&fmt=auto&app=138&f=JPEG?w=888&h=500',
  },
  {
    name: 'MultiScenesSingleRender',
    path: '/MultiScenesSingleRender',
    cover: 'MultiScenesSingleRender.png',
  },
  {
    name: 'MultiViewsSingleRender',
    path: '/MultiViewsSingleRender',
    cover: 'MultiViewsSingleRender.png',
  },
  {
    name: 'Reflections&VideoTextures',
    path: '/Reflections&VideoTextures',
    cover: 'https://github.com/pmndrs/drei/raw/master/logo.jpg'
  },
  {
    name: 'SketchyPencil',
    path: '/SketchyPencil',
    cover: 'SketchyPencil.png',
  },
  {
    name: 'SkyDome',
    path: '/SkyDome',
    cover: 'SkyDome.png',
  },
  {
    name: 'StencilClipCapOutline',
    path: '/StencilClipCapOutline',
    cover: 'StencilClipCapOutline.png',
  },
  {
    name: 'ToonShader',
    path: '/ToonShader2',
    cover: 'ToonShader2.png',
  },
  {
    name: 'TransformController',
    path: '/TransformController',
    cover: 'TransformController.png',
  },
  {
    name: 'TransformSynchronise',
    path: '/TransformSynchronise',
    cover: 'TransformSynchronise.png',
  },
  {
    name: 'GeometryGizmo',
    path: '/GeometryGizmo',
    cover: 'GeometryGizmo.png',
  },
  {
    name: 'ChinaMap',
    path: '/mapgeojsonchina',
    cover: 'mapgeojsonchina.png',
  },
  {
    name: 'ShangHaiMap',
    path: '/mapShanghai',
    cover: 'mapShanghai.png',
  },
  {
    name: 'VirtualCity',
    path: '/virtualcity',
    cover: 'virtualcity.png',
  },
  {
    name: 'FilmGrain',
    path: '/FilmGrain',
    cover: 'FilmGrain.jpg',
  },
  {
    name: 'CurlPlane',
    path: '/CurlPlane',
    cover: 'CurlPlane.png',
  },
].map(e => {
  // Dynamic Dummy Image Generator - DummyImage.com  https://dummyimage.com/
  e.cover = e.cover ? (e.cover.startsWith('http') ? e.cover : '/imgs/covers/' + e.cover) : 'https://dummyimage.com/1280x900&text=no+image'
  return e
}))


</script>

<style scoped lang="scss">
.container {
  height: 100%;
  background-color: rgb(244, 240, 230);
  padding: 5rem 4rem;
  overflow: auto;

  .header {
    font-size: 3rem;
    line-height: 1;
    text-align: center;
    margin-bottom: 5rem;
    font-family: 'Pandantica', sans-serif;
  }

  .sketch-list {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 0.5rem;
    margin: 0 auto;

    @media (width > 640px) {
      max-width: 640px;
    }

    @media (width > 768px) {
      max-width: 768px;
    }

    @media (width > 1024px) {
      max-width: 1024px;
    }

    @media (width > 1280px) {
      max-width: 1280px;
    }

    @media (width > 1536px) {
      max-width: 1536px;
    }

    .sketch-item {
      display: flex;
      height: 15rem;
      place-items: center;
      border-radius: 0.75rem;
    }
  }
}
</style>