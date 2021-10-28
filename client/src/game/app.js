import * as PIXI from 'pixi.js'
import { resize } from './helper'
import { world, gameLoop, createBoundary, addControls, setupChart, updateCaughtFish, updateCoins, init } from './game'
import { loader } from './assets'
import { spawnFishes, addFishes } from './fish'
import { schoolingfishes, spawnSchoolingfishes } from './schoolingfish'
import { jellyfishes, spawnJellyfishes } from './jellyfish'
import { createSea, createSky } from './objects'
import { createBoat } from './boat'
import { spawnTurtles } from './turtle'

let app;

function startGame(canvas) {
    app = new PIXI.Application({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x49536a,
        antialias: true,
        resolution: devicePixelRatio || 1
    });

    app.stage.addChild(world)
    loader.load(onAssetsLoaded)
}

function onAssetsLoaded(loader, resources) {
    init()
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

export { app, startGame }
