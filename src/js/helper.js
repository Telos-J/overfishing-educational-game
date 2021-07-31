import * as PIXI from 'pixi.js'
import { app } from './app'
import { world } from './game'

function resize() {
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')
    const ratio = world.height / world.width

    app.renderer.resize(innerWidth, innerHeight);
    world.width = innerWidth
    world.height = world.width * ratio

    world.boundary = net.getGlobalPosition().y
}

addEventListener('resize', resize)

export { resize }
