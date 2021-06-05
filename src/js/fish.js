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
        //fish.position.set(0, horizon + fish.height)
        fish.position.set(Math.random() * boundary.width, Math.random() * (boundary.height - horizon - fish.height) + horizon + fish.height / 2)
        fishes.addChild(fish);
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function moveFishes(deltaTime) {
    const boundary = world.getChildByName('boundary')
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')

    for (const fish of fishes.children) {
        if (collideNet(fish)) gsap.to(fish, { y: `+=${net.vy}` })
        else fish.position.x += deltaTime

        if (fish.position.x - fish.width / 2 > boundary.width) fish.position.x = -fish.width / 2

        if (fish.position.y < horizon) collectFish(fish)
    }
}

function collideNet(fish) {
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')
    const meshX = net.position.x + boat.position.x - 20
    const meshY = net.position.y + boat.position.y + 20

    return fish.position.y >= -fish.position.x + meshX + meshY &&
        fish.position.y <= -fish.position.x + meshX + meshY + 120 &&
        fish.position.y >= meshY &&
        fish.position.y <= meshY + 120 &&
        fish.position.x >= meshX - 100
}

function collectFish(fish) {
    const boat = world.getChildByName('boat')
    gsap.to(fish, {
        x: boat.position.x + boat.width / 3,
        y: boat.position.y + boat.height / 2,
        onComplete: () => fishes.removeChild(fish)
    })
}


export { fishes, spawnFishes, moveFishes }
