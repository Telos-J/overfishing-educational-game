import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'

const numFish = 1000,
    fishes = new PIXI.ParticleContainer(numFish)

fishes.name = 'fishes'

function spawnFishes() {
    const boundary = world.getChildByName('boundary')
    const sea = world.getChildByName('sea')
    const texture = loader.resources.fish.texture

    for (let i = 0; i < numFish; i++) {
        const fish = new PIXI.Sprite(texture);
        fish.anchor.set(0.5)
        fish.position.set(Math.random() * boundary.width, Math.random() * (boundary.height - horizon - fish.height) + horizon + fish.height / 2)
        fishes.addChild(fish);
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function moveFishes(deltaTime) {
    const boundary = world.getChildByName('boundary')

    for (const fish of fishes.children) {
        fish.position.x += deltaTime
        if (fish.position.x - fish.width / 2 > boundary.width) fish.position.x = -fish.width / 2
    }
}

export { fishes, spawnFishes, moveFishes }
