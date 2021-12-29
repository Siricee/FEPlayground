<template>
  <section class="container">
    <div ref="tag-canvas" class="tag-canvas"></div>
  </section>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}
.tag-canvas {
  width: 100%;
  height: 100%;
}
</style>
<script>
// prop的数据列表支持三种：
// 1. ['名称1','名称2','名称3','名称4','名称5',]
// 2. [{
//         name:'名称1',
//         weight:0.5,
//         href:'http://baidu.com',
//         color:'',
//     }]

/**
 * @author Sirice.
 *
 * doc site : TagCanvas function reference - https://www.goat1000.com/tagcanvas-functions.php
 */

const debounce = (fn) => {
  let timeout = null;
  return function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn();
    }, 500);
  };
};
/**
 * 这个库文档写的很烂，直接看示例：
 * TagCanvas https://codepen.io/deadbead/pen/FrKvi
 */
import TagCanvas from "./tagCanvas.js";
export default {
  name: "tag-canvas-component",
  //   props: {
  //     tagList: {
  //       type: Array,
  //     },
  //   },
  data() {
    return {
      // just for test.
      tagList: [
        { name: "文字0", value: 1 },
        { name: "文字1", value: 2 },
        { name: "文字2", value: 3 },
        { name: "文字3", value: 4 },
        { name: "文字4", value: 5 },
        { name: "文字5", value: 6 },
        { name: "文字6", value: 7 },
        { name: "文字7", value: 8 },
        { name: "文字8", value: 9 },
        { name: "文字9", value: 10 },
        { name: "文字10", value: 11 },
        { name: "文字11", value: 12 },
        { name: "文字12", value: 13 },
        { name: "文字13", value: 14 },
        { name: "文字14", value: 15 },
        { name: "文字15", value: 16 },
        { name: "文字16", value: 17 },
        { name: "文字17", value: 18 },
        { name: "文字18", value: 19 },
        { name: "文字19", value: 20 },
      ],
      // TagCanvas config
      tagCanvasConfig: {
        shape: "sphere",
        outlineColour: "transparent",
        reverse: false,
        depth: 0.8,
        dragControl: 1,
        textFont: null,
        textColour: null,
        weightMode: "both",
        weight: true,
        weightSize: 0.6,
        weightGradient: {
          0: "#ee6666",
          0.33: "#5470c6",
          0.66: "#91cc75",
          1: "#fac858",
        },
        /*
          shape: "sphere",
          outlineColour: "transparent",
          reverse: true,
          depth: 0.8,
          maxSpeed: 0.05,
          // noSelect: true,
          // dragControl: 1,
          initial: [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)],
          textFont: null,
          textColour: null,
          weightMode: "both",
          weight: true,
          weightSize: 0.6,
          weightGradient: {
            0: "#ee6666",
            0.33: "#5470c6",
            0.66: "#91cc75",
            1: "#fac858",
          },
          */
      },
      // custom TagCanvas config, including TagToFront
      clickTagCallBackConfig: {
        enable: true,
        callback: (e) => {
          console.log("clicked", e);
        },
      },
      tagToFrontConfig: {
        enable: true,
        config: {
          time: "300",
          callback: (e) => {
            console.log("tagToFront", e);
          },
        },
      },
    };
  },
  mounted() {
    this.resize("tag-canvas", () => {
      if (this.$refs["tag-canvas"]) {
        TagCanvas.Delete("rootcanvas");
        this.$refs["tag-canvas"].innerHTML = "";
      }
      this.createWightModeCanvas("tag-canvas", this.tagList);
      this.startTagCanvas(this.tagCanvasConfig);
    });
  },
  methods: {
    /**
     * @function create TagCanvas instance.
     * @param refName {String} (required) TagCanvas container,Element refName needed.
     * @param tagList {Array} (required) a list of tag, will be converted to <ul><li><a> automatically.
     * @return void.
     */
    createWightModeCanvas(
      refName = () => {
        throw Error("missing canvas container refname.");
      },
      tagList = () => {
        throw Error("missing tagList.");
      }
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = this.$refs[refName] && this.$refs[refName].offsetWidth;
      canvas.height = this.$refs[refName] && this.$refs[refName].offsetHeight;
      canvas.id = "rootcanvas";
      // create tag list
      let ul = document.createElement("ul");
      const [minValue, maxValue] = this.fontSizeRange;
      tagList.forEach((t, index) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.innerText = t.name;
        a.id = "tag" + (index + 1);
        a.style.fontSize =
          this.calculateFontSize(t.value, [minValue, maxValue]) / 3 + "ex";
        li.appendChild(a);
        a.addEventListener("click", (ev) => {
          ev.preventDefault();
          this.clickTagCallBack(t);
        });
        ul.appendChild(li);
      });
      canvas.appendChild(ul);
      this.$refs["tag-canvas"] && this.$refs[refName].appendChild(canvas);
    },
    /**
     * @function start TagCanvas instance running.
     * @param tagCanvasConfig {Object} (available) TagCanvas running config, if this argument is null,instance will run within default Config.
     */
    startTagCanvas(tagCanvasConfig) {
      const defaultConfig = {
        shape: "sphere",
        initial: [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)],
        dragControl: 1,
        textHeight: 20,
        activeCursor: "pointer",
      };
      TagCanvas.Start("rootcanvas", "", tagCanvasConfig || defaultConfig);
    },
    /**
     * 输入要计算的数据、[该组数据最小值最大值]
     * 输出一个映射到10-60之间的整数
     *
     * 这么做的理由是：
     * 当数据极差过大时，让字体大小归一到10-60范围内，然后用的时候整除3，
     * 可以缩小最大字体和最小字体的差距不至于过于悬殊。
     */
    calculateFontSize(value, [minValue, maxValue]) {
      let k = (maxValue - minValue) / 50;
      let b = 10 - minValue * k;
      return Math.round(k * value + b);
    },
    clickTagCallBack(val) {
      if (
        !this.clickTagCallBackConfig ||
        this.clickTagCallBackConfig.enable === false
      )
        return;

      if (this.clickTagCallBackConfig.callback !== undefined) {
        this.clickTagCallBackConfig.callback(val);
      } else {
        console.warn(
          "clickTagCallBackConfig enable, but you don't call any funciton."
        );
      }

      if (this.tagToFrontConfig && this.tagToFrontConfig.enable) {
        let tagId =
          this.tagList.indexOf(val) >= 0
            ? "tag" + (this.tagList.indexOf(val) + 1)
            : "no-tag";
        if (tagId !== "no-tag")
          TagCanvas.TagToFront("rootcanvas", {
            id: tagId,
            ...this.tagToFrontConfig.config,
          });
      }
    },
    /**
     * when canvas resized,regenerate graph.
     */
    resize(refName, fn) {
      const ro = new ResizeObserver(debounce(fn));
      this.$refs[refName] && ro.observe(this.$refs[refName]);
    },
  },
  computed: {
    fontSizeRange() {
      let maxValue = Math.max(),
        minValue = Math.min();
      for (let i = 0; i < this.tagList.length; i++) {
        maxValue =
          maxValue >= this.tagList[i].value ? maxValue : this.tagList[i].value;
        minValue =
          minValue < this.tagList[i].value ? minValue : this.tagList[i].value;
      }
      return [minValue, maxValue];
    },
  },
};
</script>
