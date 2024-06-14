/*!
    Anime Focus Speed Lines effect
    集中線
*/
/*!
    Base code :
    forked from nekoneko-wanwan's "Canvasで漫画の集中線を描く" 
    https://codepen.io/nekoneko-wanwan/pen/xwRjbq
    
    Changed by Wakana : 
    1. Resized to match screen size.
    2. Added reset process for window resizing.
*/

/**
 * focusLine()に渡す引数の設定
 */

let cs;
let ctx;
let w, h;
let timerID = null;

function init(DOM) {

    cs = DOM;
    ctx = cs.getContext("2d");

    w = window.innerWidth * 2;
    h = window.innerHeight * 2;

    cs.width = w;
    cs.height = h;

    var conf = {
        cx: w / 2,
        cy: h / 2,
        lineWidth: 10,
        lineNum: 220,
        crMax: Math.min(w, h) / 2 / 2, // 集中線の円形の半径上限
        crMin: Math.min(w, h) / 3 / 2, // 集中線の円形の半径下限
        color: "black"
    };

    focusLine(
        cs,
        conf.cx,
        conf.cy,
        conf.lineWidth,
        conf.lineNum,
        conf.crMax,
        conf.crMin,
        conf.color
    );


    window.addEventListener("resize", onWindowResize);
    function onWindowResize() {
        ctx.clearRect(0, 0, cs.width, cs.height);

        clearTimeout(timerID);
        timerID = null;
        init(cs);
    }
}

/*!*
 * 集中線メーカー
 * @param {obj} canvas object
 * @param {number} centralX: 集中線を配置するx座標
 * @param {number} centralY: 集中線を配置するy座標
 * @param {number} lineWidth: 線の太さ（ランダムの上限）
 * @param {number} lineNum: 線の数
 * @param {number} circleRadiusMax: 集中線の円形の半径上限
 * @param {number} circleRadiusMin: 集中線の円形の半径下限
 * @param {color} lineColor: 集中線の色
 
Copyright (c) 2023 by nekoneko-wanwan (https://codepen.io/nekoneko-wanwan/pen/xwRjbq)
*/
const focusLine = function (
    cs,
    centralX,
    centralY,
    lineWidth,
    lineNum,
    circleRadiusMax,
    circleRadiusMin,
    lineColor
) {
    let lines = [];

    // canvasの中心から角までの斜辺距離を円の半径とする
    let csRadius =
        Math.sqrt(Math.pow(cs.width / 2, 2) + Math.pow(cs.height / 2, 2)) | 0;

    /**
     * ランダムな整数を返す
     * @param max 最大値
     * @param min 最小値
     * @return min ~ max
     */
    let getRandomInt = function (max, min) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    /**
     * 円周上の座標を返す
     * @param d 角度
     * @param r 半径
     * @param cx, cy 中心座標
     */
    let getCircumPos = {
        // x座標
        x: function (d, r, cx) {
            return Math.cos((Math.PI / 180) * d) * r + cx;
        },
        // y座標
        y: function (d, r, cy) {
            return Math.sin((Math.PI / 180) * d) * r + cy;
        }
    };

    /**
     * @constructor
     */
    let Liner = function () {
        this.initialize();
    };
    Liner.prototype = {
        /* initialize()からsetPos()へ値を移すと、アニメーションの動きが変わる */
        initialize: function () {
            this.deg = getRandomInt(360, 0);
        },
        setPos: function () {
            this.moveDeg = this.deg + getRandomInt(lineWidth, 1) / 10;
            this.endRadius = getRandomInt(circleRadiusMax, circleRadiusMin);

            // 開始座標
            this.startPos = {
                x: getCircumPos.x(this.deg, csRadius, centralX),
                y: getCircumPos.y(this.deg, csRadius, centralY)
            };

            // 移動座標
            this.movePos = {
                x: getCircumPos.x(this.moveDeg, csRadius, centralX),
                y: getCircumPos.y(this.moveDeg, csRadius, centralY)
            };

            // 終了座標
            this.endPos = {
                x: getCircumPos.x(this.moveDeg, this.endRadius, centralX),
                y: getCircumPos.y(this.moveDeg, this.endRadius, centralY)
            };
        },
        update: function () {
            this.setPos();
        },
        draw: function () {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = lineColor;
            ctx.moveTo(this.startPos.x, this.startPos.y);
            ctx.lineTo(this.movePos.x, this.movePos.y);
            ctx.lineTo(this.endPos.x, this.endPos.y);
            ctx.fill();
            ctx.closePath();
        },
        render: function () {
            this.update();
            this.draw();
        }
    };

    /**
     * 線インスタンスの作成
     * @return lines[instance, instance...];
     */
    function createLines(num) {
        let i = 0;
        for (; i < num; i++) {
            lines[lines.length] = new Liner();
        }
    }

    /**
     * 描画
     */
    function render() {
        let i = 0;
        let l = lines.length;
        ctx.clearRect(0, 0, cs.width, cs.height);
        for (; i < l; i++) {
            lines[i].render();
        }
        timerID = setTimeout(function () {
            render();
        }, 100);
    }

    createLines(lineNum);
    render();
};



export function run(DOM = null) {
    init(DOM);
}
