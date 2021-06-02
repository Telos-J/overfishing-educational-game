import * as PIXI from 'pixi.js'
import { loader } from './assets'
import { world } from './game'

function createSea() {
    const texture = loader.resources.sea.texture
    const sea = new PIXI.Sprite(texture)
    sea.name = 'sea'
    world.addChild(sea);
}

export { createSea }
