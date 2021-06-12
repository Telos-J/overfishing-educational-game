import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'

let caughtFish = 0
let coins = 0

const numFish = 1000,
    fishes = new PIXI.ParticleContainer(numFish, { vertices: true, rotation: true })

fishes.name = 'fishes'

function spawnFishes() {
    const boundary = world.getChildByName('boundary')
    const sea = world.getChildByName('sea')
    const texture = loader.resources.fish.texture

    for (let i = 0; i < numFish; i++) {
        const fish = new PIXI.Sprite(texture);
        fish.anchor.set(0.5)
        fish.scale.set(0.8)
        //fish.position.set(0, horizon + fish.height)
        fish.position.set(Math.random() * boundary.width, Math.random() * (boundary.height - horizon - fish.height) + horizon + fish.height / 2)
        fishes.addChild(fish);
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function controlFishes(deltaTime) {
    for (const fish of fishes.children) {
        move(fish, deltaTime)
        if (fish.position.y < horizon) collectFish(fish)
    }
}

function move(fish, deltaTime) {
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')

    if (collideNet(fish)) gsap.to(fish, { y: `+=${net.vy}` })
    else {
        fish.rotation += 0.1
        if (fish.rotation > Math.PI * 2) fish.rotation = 0
        if (fish.rotation > Math.PI / 2 && fish.rotation < Math.PI * 3 / 2) fish.scale.y = -0.8
        else fish.scale.y = 0.8
        // fish.position.x += deltaTime * 1.5
    }

    bound(fish)
}

function bound(fish) {
    const boundary = world.getChildByName('boundary')
    if (fish.position.x - fish.width / 2 > boundary.width)
        fish.position.x = -fish.width / 2
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
        onComplete: () => {
            const removed = fishes.removeChild(fish)
            if (removed) {
                caughtFish++
                console.log(caughtFish)
                document.querySelector('#caught').innerHTML = `${caughtFish}`
                coins += 3
                document.querySelector('#coin #balance').innerHTML = coins
            }
        }
    })
}


export { fishes, spawnFishes, controlFishes }
