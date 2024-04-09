<template>
  <div class="svg-container" ref="refChart">
    <svg
      width="1000"
      height="160"
      viewBox="0 0 1000 160"
      preserveAspectRatio="xMinYMin"
    >
      <defs>
        <g id="chart">
          <ellipse cx="20" cy="20" rx="20" ry="20"></ellipse>
        </g>
      </defs>
      <use
        href="#chart"
        :x="index * 40"
        y="0"
        v-for="(k, index) in 25"
        :key="0 + k"
        :style="{ fill: k <= calcRowCount[0] ? markedColor : color }"
      ></use>
      <use
        href="#chart"
        :x="index * 40"
        y="40"
        v-for="(k, index) in 25"
        :key="40 + k"
        :style="{ fill: k <= calcRowCount[1] ? markedColor : color }"
      ></use>
      <use
        href="#chart"
        :x="index * 40"
        y="80"
        v-for="(k, index) in 25"
        :key="80 + k"
        :style="{ fill: k <= calcRowCount[2] ? markedColor : color }"
      ></use>
      <use
        href="#chart"
        :x="index * 40"
        y="120"
        v-for="(k, index) in 25"
        :key="120 + k"
        :style="{ fill: k <= calcRowCount[3] ? markedColor : color }"
      ></use>
    </svg>
  </div>
</template>
<style lang="scss" scoped>
.svg-container {
  width: 300px;
  height: 150px;
  overflow: auto;
  resize: both;
}
svg {
  width: 100%;
  height: 100%;
  box-sizing: content-box;
  stroke: transparent;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
<script>
export default {
  data() {
    return {
      num: 99,
      color: "#e5e5e5",
      markedColor: "seagreen",
    };
  },
  computed: {
    calcRowCount() {
      let basic = Math.floor(this.num / 4); // 3
      let mod = this.num % 4;
      let ans = new Array(4).fill(basic);
      for (let index = 0; index < mod; index++) {
        ans[index] += 1;
      }
      // console.log(ans);
      return ans;
    },
  },
};
</script>
