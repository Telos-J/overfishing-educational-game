import '../favicon.ico'
import '../image.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { resize } from './helper'
import { world, gameLoop, createBoundary, addControls, setupChart, updateCaughtFish, updateCoins } from './game'
import { loader } from './assets'
import { spawnFishes, addFishes } from './fish'
import { schoolingfishes, spawnSchoolingfishes } from './schoolingfish'
import { jellyfishes, spawnJellyfishes } from './jellyfish'
import { createSea, createSky } from './objects'
import { createBoat } from './boat'
import { spawnTurtles } from './turtle'

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
    spawnSchoolingfishes()
    spawnJellyfishes()
    spawnTurtles()
    addControls();
    resize()
    updateCaughtFish()
    updateCoins()

    setTimeout(() => {
        setupChart()
        app.ticker.add(gameLoop);
        setInterval(() => {
            //addFishes(schoolingfishes)
        }, 1000)
    }, 100)
}

export { app }
