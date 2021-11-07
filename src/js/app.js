import '../favicon.ico'
import '../image.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { gameLoop, addControls, setupChart, updateCaughtFish, updateCoins } from './game'
import { loader } from './assets'
import { addFishes } from './fish'
import { schoolingfishes, spawnSchoolingfishes } from './schoolingfish'
import { jellyfishes, spawnJellyfishes } from './jellyfish'
import { turtles, spawnTurtles } from './turtle'
import World from './world'
import Boat from './boat'
import Net from './net'

const canvas = document.querySelector('#sim'),
    app = new PIXI.Application({
        width: innerWidth,
        height: innerHeight,
        backgroundColor: 0x49536a,
        view: canvas,
        antialias: true,
        resolution: devicePixelRatio || 1
    });

loader.load(onAssetsLoaded)

function onAssetsLoaded(loader, resources) {
    const world = new World()
    app.stage.addChild(world)

    const boat = new Boat()
    boat.name = 'boat'
    boat.dispatch(world)

    const net = new Net()
    boat.addNet(net)

    spawnSchoolingfishes(world)
    spawnJellyfishes(world)
    spawnTurtles(world)

    resize()
    addControls();
    updateCaughtFish()
    updateCoins()
    setupChart()
    app.ticker.add(gameLoop);
    setInterval(() => {
        addFishes(schoolingfishes)
        addFishes(jellyfishes)
        addFishes(turtles)
    }, 1000)
}

function resize() {
    const ratio = app.stage.height / app.stage.width
    app.renderer.resize(innerWidth, innerHeight);
    app.stage.width = innerWidth
    app.stage.height = app.stage.width * ratio
}

addEventListener('resize', resize)

export { app }
