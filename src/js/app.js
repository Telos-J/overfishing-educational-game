import '../favicon.ico'
import '../image.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { resize } from './helper'
import { world, gameLoop, createBoundary, addControls, setupChart, reset } from './game'
import { loader } from './assets'
import { spawnFishes, addFishes } from './fish'
import { createSea, createSky } from './objects'
import { createBoat } from './boat'

const canvas = document.querySelector('#sim'),
    app = new PIXI.Application({
        width: innerWidth,
        height: innerHeight,
        backgroundColor: 0x49536a,
        view: canvas,
        antialias: true,
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
    addControls();
    resize()
    reset()

    setTimeout(() => {
        setupChart()
        app.ticker.add(gameLoop);
        setInterval(addFishes, 1000)
    }, 100)
}

export { app }
