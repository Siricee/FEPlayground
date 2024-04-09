<template>
    <div class="wrapper" @click="router.push('/grid')">
        <section ref="containerDOM" class="containerDOM"></section>
        <section class="content">
            <div class="text">
                Welcome to Sirice's PlayGround!
            </div>
            <div class="text-2">
                Press Anywhere to check the list of works.
            </div>
            <div class="text-3">
                Sirice Studio, based HarBin
            </div>
        </section>
    </div>
</template>
<script setup>
import { router } from '@/router';
import PIXI from './pixi@4.8.2.js';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const containerDOM = ref()

onMounted(() => {

    const app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
    })
    const container = new PIXI.Container()

    let posX = 0,
        displacementSprite = '',
        displacementFilter = '',
        bg = '',
        xVelocity = 0

    // if vue component instance is existing, PIXI resource will not reload again.
    try {
        if (!PIXI.loader.resources?.displacement || PIXI.loader.resources.displacement === undefined) {
            PIXI.loader
                .add(
                    'displacement',
                    'https://raw.githubusercontent.com/supahfunk/supah-codepen/master/masks/gradient4.png',
                )
                .add(
                    'bg',
                    './cover.jpg',
                )
        }
        PIXI.loader.load(setup)
    } catch (error) {
        console.log(error)
    }



    /*-------------------- Setup --------------------*/
    function setup() {
        posX = app.renderer.width / 2
        displacementSprite = new PIXI.Sprite(
            PIXI.loader.resources.displacement.texture,
        )
        displacementFilter = new PIXI.filters.DisplacementFilter(
            displacementSprite,
        )

        displacementSprite.anchor.set(0.5)
        displacementSprite.x = app.renderer.width / 2
        displacementSprite.y = app.renderer.height / 2
        // vx = displacementSprite.x

        app.stage.addChild(displacementSprite)
        displacementFilter.scale.x = 0
        displacementFilter.scale.y = 0

        bg = background(
            { x: window.innerWidth, y: window.innerHeight },
            new PIXI.Sprite(PIXI.loader.resources.bg.texture),
            'cover',
        )
        bg.zOrder = -1
        container.addChild(bg)

        let brightnessFilter = new PIXI.filters.ColorMatrixFilter();
        brightnessFilter.matrix = [
            1, 0, 0, 0, -0.16,
            0, 1, 0, 0, -0.16,
            0, 0, 1, 0, -0.16,
            0, 0, 0, 1, 0
        ];
        bg.filters = [displacementFilter, brightnessFilter]
        app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove)
        loop()
    }

    /*-------------------- Mouse Move --------------------*/
    function onPointerMove(eventData) {
        posX = eventData.data.global.x
    }

    /*-------------------- Loop --------------------*/
    function loop() {
        requestAnimationFrame(loop)
        xVelocity += (posX - displacementSprite.x) * 0.095
        displacementSprite.x = xVelocity

        let disp = Math.floor(posX - displacementSprite.x)
        if (disp < 0) {
            disp = -disp
        }

        let displacementSpriteScale = map(disp, 0, window.innerWidth, 0.1, 1.6),
            displacementFilterScale = map(disp, 0, window.innerWidth, 0, 500)

        displacementSprite.scale.x = displacementSpriteScale
        displacementFilter.scale.x = displacementFilterScale
    }

    /*-------------------- Map --------------------*/
    function map(n, start1, stop1, start2, stop2) {
        var newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
        return newval
    }

    /*-------------------- Background Cover --------------------*/
    function background(bgSize, inputSprite, type, forceSize) {
        var sprite = inputSprite
        var bgContainer = new PIXI.Container()
        var mask = new PIXI.Graphics()
            .beginFill(0x8bc5ff)
            .drawRect(0, 0, bgSize.x, bgSize.y)
            .endFill()
        bgContainer.mask = mask
        bgContainer.addChild(mask)
        bgContainer.addChild(sprite)

        var sp = { x: sprite.width, y: sprite.height }
        if (forceSize) sp = forceSize
        var winratio = bgSize.x / bgSize.y
        var spratio = sp.x / sp.y
        var scale = 1
        var pos = new PIXI.Point(0, 0)
        if (type == 'cover' ? winratio > spratio : winratio < spratio) {
            //photo is wider than background
            scale = bgSize.x / sp.x
            pos.y = -(sp.y * scale - bgSize.y) / 2
        } else {
            //photo is taller than background
            scale = bgSize.y / sp.y
            pos.x = -(sp.x * scale - bgSize.x) / 2
        }

        sprite.scale = new PIXI.Point(scale, scale)
        sprite.position = pos

        return bgContainer
    }



    /*-------------------- Win Resize --------------------*/
    function resize() {
        if (containerDOM.value) {

            container.removeChildren()
            app.renderer.resize(containerDOM.value.clientWidth, containerDOM.value.clientHeight)
            bg = background(
                { x: containerDOM.value.clientWidth, y: containerDOM.value.clientHeight },
                new PIXI.Sprite(PIXI.loader.resources.bg.texture),
                'cover',
            )
            container.addChild(bg)

            let brightnessFilter = new PIXI.filters.ColorMatrixFilter();
            brightnessFilter.matrix = [
                1, 0, 0, 0, -0.16,
                0, 1, 0, 0, -0.16,
                0, 0, 1, 0, -0.16,
                0, 0, 0, 1, 0
            ];

            bg.zOrder = 1
            bg.filters = [displacementFilter, brightnessFilter]
        }

    }

    function init() {
        containerDOM.value.appendChild(app.view)
        app.stage.interactive = true
        app.stage.addChild(container)
        resize()
    }


    init()
    window.addEventListener('resize', resize)

    onBeforeUnmount(() => {
        window.removeEventListener("resize", resize);
    })
})



</script>

<style scoped lang="scss">


.wrapper,
.containerDOM {
    width: 100%;
    height: 100vh;
}

.containerDOM {
    overflow: hidden;
}

.content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-40%);
    font-family: 'Pandantica', sans-serif;
    cursor: pointer;

    .text {
        color: #f7f7f7;
        font-size: calc(max(4vw, 4vh, 42px));
        text-align: center;
    }

    .text-2 {
        margin-top: 8rem;
        text-align: center;
        color: #f7f7f7;
        font-size: calc(max(1.6vw, 1.6vh, 16px));

        .enter-btn {
            display: inline-block;
            outline: none;
            border-width: 0px;
            border-radius: 10px;
            box-sizing: border-box;
            font-size: inherit;
            font-weight: 500;
            max-width: 100%;
            text-align: center;
            text-decoration: none;
            transition: background 0.3s ease-out 0s, box-shadow 0.3s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0.3s;
            background: #cfd1d56e;
            cursor: pointer;
            height: 28px;
            line-height: 28px;
            padding: 0px 12px;
            vertical-align: middle;
            width: auto;
            color: #ffffffea;
            margin: 0 0.5em;

            &:hover {
                background: #f3f3f333;
                text-decoration: inherit;
                transition-duration: 0s, 0.15s;
                color: white;
            }
        }
    }

    .text-3{
        margin-top: 8rem;
        text-align: center;
        color: #f7f7f7;
        font-size: calc(max(1vw, 1vh, 14px));
    }

}
</style>