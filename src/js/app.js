import '../favicon.ico'
import '../image.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { resize } from './helper'
import { world, gameLoop, refactor, createBoundary } from './game'
import { loader } from './assets'
import { spawnFishes } from './fish'
import { createSea, createSky, createBoat } from './objects'

const canvas = document.querySelector('#sim'),
    app = new PIXI.Application({
        width: innerWidth,
        height: innerHeight,
        backgroundColor: 0x49536a,
        view: canvas,
        resolution: devicePixelRatio || 1
    });

app.stage.addChild(world)

loader.load(onAssetsLoaded)

function onAssetsLoaded(loader, resources) {
    createBoundary()
    createSea()
    createSky()
    createBoat()
    spawnFishes()

    app.ticker.add(gameLoop);
    resize()
}

export { app }
