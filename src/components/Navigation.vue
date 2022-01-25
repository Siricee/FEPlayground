<template>
  <div class="contents" style="display:contents">
    <mu-button class="menu-btn" flat color="primary" @click="open = !open">
      MENU
    </mu-button>
    <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'">
      <mu-list>
        <mu-list-item
          button
          v-for="item in menu"
          :key="item.text"
          @click="clickMenu(item)"
        >
          <mu-list-item-title v-text="item.text"></mu-list-item-title>
        </mu-list-item>
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
    text: "Solar",
    link: "/solar",
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
    text: "Particles",
    link: "/particles",
  },
  {
    text: "LinkLines",
    link: "/linklines",
  },
  {
    text:"PhotoGallery",
    link: "/photogallery"
  },
  {
    text:"MapModel",
    link: "/mapmodel"
  },
];
export default {
  data() {
    return {
      docked: false,
      open: false,
      position: "left",
      menu,
    };
  },
  methods: {
    clickMenu(item) {
      this.$router.push(item.link);
    },
  },
};
</script>
