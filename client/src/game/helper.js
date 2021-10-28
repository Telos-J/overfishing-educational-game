import { app } from './app'
import { world } from './game'

function resize() {
    const boat = world.getChildByName('boat')
    const net = world.getChildByName('net')
    const ratio = world.height / world.width

    app.renderer.resize(window.innerWidth, window.innerHeight);
    world.width = window.innerWidth
    world.height = world.width * ratio

    world.boundary = net.getGlobalPosition().y
}

window.addEventListener('resize', resize)

export { resize }
