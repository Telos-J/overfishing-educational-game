import '../favicon.ico'
import '../image.png'
import '../css/style.scss'
import * as PIXI from 'pixi.js'
import { loader } from './assets'
import './drawer'
import { startGame } from './game'

const canvas = document.querySelector('#sim'),
    app = new PIXI.Application({
        width: innerWidth,
        height: innerHeight,
        backgroundColor: 0x49536a,
        view: canvas,
        antialias: true,
        resolution: devicePixelRatio || 1,
    })

loader.load(onAssetsLoaded)

function onAssetsLoaded(loader, resources) {
    startGame()
    resize()
}

function resize() {
    const ratio = app.stage.height / app.stage.width
    app.renderer.resize(innerWidth, innerHeight)
    app.stage.width = innerWidth
    app.stage.height = app.stage.width * ratio
}

addEventListener('resize', resize)

export { app }
