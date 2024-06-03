<template>
    <canvas ref="myCanvas" width="500" height="300" style="border: 1px solid #333"></canvas>
    <section class="btns">
        <button @click="executeDrawCommand(drawRectCommand)">draw Rect</button>
        <button @click="executeDrawCommand(drawCircleCommand)">draw Circle</button>
        <button @click="executeDrawCommand(drawTriangleCommand)">draw Triangle</button>
        <button @click="undoDrawCommand()">Revoke</button>
    </section>
    <section class="caption">
        <p>Revoke and Redo Demo implemented by Command Pattern.</p>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const myCanvas = ref('')

let ctx

onMounted(() => {
    ctx = myCanvas.value.getContext("2d")
})

let drawCommands = []; // 存储绘图命令
let currentCommand = -1; // 当前命令索引

// 封装绘制矩形的命令对象
const drawRectCommand = {
    execute() {
        ctx.fillStyle = "red";
        ctx.fillRect(300, 100, 100, 100);
    },
    undo() {
        ctx.clearRect(300, 100, 100, 100);
    },
};

// 封装绘制圆形的命令对象
const drawCircleCommand = {
    execute() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(150, 150, 50, 0, Math.PI * 2);
        ctx.fill();
    },
    undo() {
        ctx.clearRect(100, 100, 100, 100);
    },
};

// 封装绘制圆形的命令对象
const drawTriangleCommand = {
    execute() {
        ctx.fillStyle = "green";
        ctx.beginPath()
        ctx.moveTo(75, 25)
        ctx.lineTo(100, 75)
        ctx.lineTo(150, 25)
        ctx.lineTo(75, 25)
        ctx.fill();
        ctx.closePath()
    },
    undo() {
        ctx.clearRect(75, 25, 150, 75);
    },
};


function executeDrawCommand(command) {
    const newCommand = Object.create(command);
    newCommand.execute();

    drawCommands.splice(currentCommand + 1);
    drawCommands.push(newCommand);
    currentCommand++;
}

function undoDrawCommand() {
    if (currentCommand >= 0) {
        drawCommands[currentCommand].undo();
        currentCommand--;
    }
}

</script>

<style scoped lang="scss">
canvas {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
}

.btns {
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 10px;
    top: calc(20% + 320px);
    left: 50%;
    transform: translateX(-50%);
}

.caption {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
}
</style>