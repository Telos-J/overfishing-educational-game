import * as PIXI from 'pixi.js'
import { app } from './app'
import { world } from './game'

function resize() {
    app.renderer.resize(innerWidth, innerHeight);
    const ratio = world.height / world.width
    app.stage.width = innerWidth
    app.stage.height = app.stage.width * ratio
}

addEventListener('resize', resize)

export { resize }
