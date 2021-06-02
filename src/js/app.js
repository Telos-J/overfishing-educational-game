import '../favicon.ico'
import '../image.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { resize } from './helper'
import { world, gameLoop, refactor } from './game'
import { loader } from './assets'
import { spawnFishes } from './fish'
import { createSea } from './objects'

const canvas = document.querySelector('#sim'),
    app = new PIXI.Application({
        width: innerWidth,
        height: innerHeight,
        backgroundAlpha: 0,
        view: canvas,
        resolution: devicePixelRatio || 1
    });

app.stage.addChild(world)

loader.load(onAssetsLoaded)

function onAssetsLoaded(loader, resources) {
    createSea()
    spawnFishes()

    app.ticker.add(gameLoop);
    refactor()
    resize()
}

export { app }
