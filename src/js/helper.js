import { app } from './app'
import { world } from './game'

function resize() {
    app.renderer.resize(innerWidth, innerHeight);
    const ratio = world.height / world.width
    world.width = innerWidth
    world.height = world.width * ratio
}

addEventListener('resize', resize)

export { resize }
