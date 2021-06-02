import * as PIXI from 'pixi.js'
import { loader } from './assets'
import { world } from './game'

const numFish = 1000,
    fishes = new PIXI.ParticleContainer(numFish)

fishes.name = 'fishes'

function spawnFishes() {
    for (let i = 0; i < numFish; i++) {
        const sea = world.getChildByName('sea')
        const texture = loader.resources.fish.texture
        const fish = new PIXI.Sprite(texture);
        fish.anchor.set(0.5)
        fish.position.set(Math.random() * sea.width, Math.random() * sea.height)
        fishes.addChild(fish);
    }
}

export { fishes, spawnFishes }
