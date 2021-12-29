<template>
  <div class="container">
    <canvas id="canvas" class="canvas" ref="canvas"></canvas>
    <div class="dragbox" ref="dragbox">点击我拖动</div>
    <div class="dragbox dragbox2" ref="dragbox2">点击我拖动</div>
    <div class="dragbox dragbox3" ref="dragbox3">点击我拖动</div>
    <div class="dragbox dragbox4" ref="dragbox4">点击我拖动</div>
    <button @click="linkLine" class="button">linkline</button>
  </div>
</template>
<style lang="less" scoped>
.container {
  display: contents;
}
.button {
  position: absolute;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.dragbox {
  width: 100px;
  height: 100px;
  background: #ffb72e;
  border-radius: 50%;
  position: absolute;
  text-align: center;
  line-height: 100px;
  user-select: none;
  cursor: pointer;

  left: 50px;
  top: 300px;
}
.dragbox2 {
  left: 300px;
  top: 100px;
}
.dragbox3 {
  left: 400px;
  top: 300px;
}
.dragbox4 {
  left: 300px;
  top: 500px;
}
</style>
<script>
/**
 * @function 连接两个点的贝塞尔曲线。虽然定义了起始点和终止点，但本身是一条无向图。
 * @param ctx {Canvas Context} canvas 全局上下文
 * @param fromDOM {HTML DOM Element}
 * @param toDOM {HTML DOM Element}
 * @param lineOption {Object} 非必填，默认为{}
 * lineOption:{
 *  strokeStyle?:HEX / RGB, // 线条填充颜色
 *  lineWidth?:number,  // 线条宽度
 * }
 */
const linkBezierLine = (ctx, fromDOM, toDOM, lineOption = {}) => {
  let [x1, y1] = getElementPostion(fromDOM);
  let [x2, y2] = getElementPostion(toDOM);
  ctx.beginPath();
  ctx.strokeStyle = lineOption?.strokeStyle || "#F00";
  ctx.lineWidth = lineOption?.lineWidth || 1;
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x1, y2, x2, (y1 + y2) / 2, x2, y2);
  ctx.stroke();
};

/**
 * @function 获取DOM在画布上的位置（取DOM中心点）
 * @param DOM {HTML DOM Element}
 * @return [x,y] {Array<Number,Number>}
 */
const getElementPostion = (DOM) => {
  let d = DOM;
  let clientRect = d.getBoundingClientRect();
  let x = clientRect.left + clientRect.width / 2;
  let y = clientRect.top + clientRect.height / 2;
  return [x, y];
};

/**
 * @function 给元素添加拖拽事件
 * @param DOM {HTML DOM Element}
 * @param cb {Object}
 * cb:{
 *  mouseDownCallBack?: Function, // 鼠标按下回调
 *  mouseMoveCallBack?: Function, // 鼠标移动回调
 *  mouseUpCallBack?: Function, // 鼠标弹起回调
 * }
 *
 */
const addDragHandler = (
  DOM,
  cb = {
    mouseDownCallBack: null,
    mouseMoveCallBack: null,
    mouseUpCallBack: null,
  }
) => {
  const oDiv = DOM;
  oDiv.onmousedown = function(event) {
    event = event || window.event; //兼容IE浏览器
    //    鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
    let diffX = event.clientX - oDiv.offsetLeft;
    let diffY = event.clientY - oDiv.offsetTop;
    if (typeof oDiv.setCapture !== "undefined") {
      oDiv.setCapture();
    }
    if (Object.prototype.hasOwnProperty.call(cb, "mouseDownCallBack"))
      cb.mouseDownCallBack();
    document.onmousemove = function(event) {
      event = event || window.event;
      let moveX = event.clientX - diffX;
      let moveY = event.clientY - diffY;
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > window.innerWidth - oDiv.offsetWidth) {
        moveX = window.innerWidth - oDiv.offsetWidth;
      }
      if (moveY < 0) {
        moveY = 0;
      } else if (moveY > window.innerHeight - oDiv.offsetHeight) {
        moveY = window.innerHeight - oDiv.offsetHeight;
      }
      oDiv.style.left = moveX + "px";
      oDiv.style.top = moveY + "px";
      if (Object.prototype.hasOwnProperty.call(cb, "mouseMoveCallBack"))
        cb.mouseMoveCallBack();
    };
    document.onmouseup = function() {
      this.onmousemove = null;
      this.onmouseup = null;
      //修复低版本ie bug
      if (typeof oDiv.releaseCapture != "undefined") {
        oDiv.releaseCapture();
      }
      if (Object.prototype.hasOwnProperty.call(cb, "mouseUpCallBack"))
        cb.mouseUpCallBack();
    };
  };
};

export default {
  mounted() {
    [
      this.$refs.dragbox,
      this.$refs.dragbox2,
      this.$refs.dragbox3,
      this.$refs.dragbox4,
    ].forEach((dom) => {
      addDragHandler(dom, { mouseMoveCallBack: this.linkLine });
    });
  },
  methods: {
    linkLine() {
      // canvas context 保存到函数作用域，让多条线同时存在
      this.$refs.canvas.width = window.innerWidth;
      this.$refs.canvas.height = window.innerHeight;
      let ctx = this.$refs.canvas.getContext("2d");
      // 连线方法
      linkBezierLine(ctx, this.$refs.dragbox, this.$refs.dragbox2);
      linkBezierLine(ctx, this.$refs.dragbox, this.$refs.dragbox3,{strokeStyle:'#648bd2'});
      linkBezierLine(ctx, this.$refs.dragbox, this.$refs.dragbox4);
    },
  },
};
</script>
