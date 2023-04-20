<template>
  <div class="contents" style="display:contents">
    <mu-button class="menu-btn" flat color="primary" @click="open = !open">
      MENU
    </mu-button>
    <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'">
      <mu-list toggle-nested>
        <template v-for="item in menu">
          <mu-list-item
            button
            v-if="item.hasOwnProperty('link')"
            :key="item.text"
            @click="clickMenu(item)"
          >
            <mu-list-item-title v-text="item.text"></mu-list-item-title>
          </mu-list-item>
          <mu-list-item
            button
            nested
            v-if="item.hasOwnProperty('children')"
            :key="item.text"
            :open="openTab === item.text"
            @toggle-nested="openTab = arguments[0] ? item.text : ''"
          >
            <mu-list-item-title
              style="font-style:italic;"
              v-text="item.text"
            ></mu-list-item-title>
            <mu-list-item
              button
              slot="nested"
              v-for="subitem in item.children"
              :key="subitem.text"
              @click="clickMenu(subitem)"
            >
              <mu-list-item-title v-text="subitem.text"></mu-list-item-title>
            </mu-list-item>
          </mu-list-item>
        </template>
        <mu-list-item @click="open = false" button>
          <mu-list-item-title>Close Menu</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
  </div>
</template>
<style lang="less" scoped>
.menu-btn {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
}
</style>
<script>
const menu = [
  {
    text: "Intro",
    link: "/home",
  },
  {
    text: "2D Examples",
    children: [
      {
        text: "MouseCursor",
        link: "/MouseCursor",
      },
      {
        text: "TagCanvas",
        link: "/tagcanvas",
      },
      {
        text: "DotChart",
        link: "/dotchart",
      },
      {
        text: "LinkLines",
        link: "/linklines",
      },
      {
        text: "PhotoGallery",
        link: "/photogallery",
      },
    ],
  },
  {
    text: "GIS Examples",
    children: [
      {
        text: "VirtualCity",
        link: "/virtualcity",
      },
      {
        text: "MapGeoJsonChina",
        link: "/mapgeojsonchina",
      },
      {
        text: "ShangHaiMap",
        link: "/mapShanghai",
      },
    ],
  },
  {
    text: "3D Examples",
    children: [
      {
        text: "Solar",
        link: "/solar",
      },
      {
        text: "Grass",
        link: "/Grass",
      },
      {
        text: "LightDemo",
        link: "/lightdemo",
      },
      {
        text: "SketchyPencil",
        link: "/SketchyPencil",
      },
      {
        text: "StencilBuffer",
        link: "/StencilBuffer",
      },
      {
        text: "GridGauge",
        link: "/GridGauge",
      },
      {
        text: "SkyDome",
        link: "/SkyDome",
      },
      {
        text: "TRSMatrix",
        link: "/TRSMatrix",
      },
    ],
  },
  {
    text: "Unfinished",
    children: [
      {
        text: "RotateMatrix",
        link: "/RotateMatrix",
      },
      {
        text: "ResetAnimation",
        link: "/ResetAnimation",
      },
    ],
  },
  // {
  //   text: "Particles",
  //   link: "/particles",
  // },
  // {
  //   text:'OnlineCamera',
  //   link:"/OnlineCamera"
  // },
  // {
  //   text:'ShaderTest',
  //   link:'/ShaderTest'
  // },
  // {
  //   text:"WeatherForecast",
  //   link:"/weatherforecast"
  // },
];
export default {
  data() {
    return {
      docked: false,
      open: false,
      position: "left",
      menu,
      openTab: "",
    };
  },
  methods: {
    clickMenu(item) {
      this.$router.push(item.link);
    },
  },
};
</script>
