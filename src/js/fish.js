import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'

let caughtFish = 0
let coins = 0

const numFish = 1000,
    // fishes = new PIXI.Container(),
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
        fish.position.set(Math.random() * boundary.width, Math.random() * (boundary.height - horizon - 200) + horizon + 200)
        fish.rotation = Math.random() * Math.PI * 2
        fish.speed = 1.5
        fish.velocity = new PIXI.Point(fish.speed * Math.cos(fish.rotation), fish.speed * Math.sin(fish.rotation))
        fish.serperationSurface = new PIXI.Point()
        fishes.addChild(fish);
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function controlFishes(deltaTime) {
    for (const fish of fishes.children) {
        collideNet(fish)
        move(fish, deltaTime)
        if (fish.caught && fish.position.y < horizon) collectFish(fish)
    }
}

function move(fish, deltaTime) {
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')

    if (fish.caught) gsap.to(fish, { y: `+=${net.vy}` })
    else {
        const range = 200
        const max = 0.1
        const threshold = horizon + range

        if (fish.position.y < horizon + range)
            // fish.serperationSurface.y = max
            // fish.serperationSurface.y = -(max / range) * (fish.position.y - threshold)
            fish.serperationSurface.y = (max / range ** 2) * (fish.position.y - threshold) ** 2
        else fish.serperationSurface.y = 0

        fish.velocity.y += fish.serperationSurface.y
        fish.rotation = Math.atan2(fish.velocity.y, fish.velocity.x)
        fish.velocity.set(fish.speed * Math.cos(fish.rotation), fish.speed * Math.sin(fish.rotation))

        if (fish.position.y < horizon) fish.velocity.y += 0.098

        fish.position.x += deltaTime * fish.velocity.x
        fish.position.y += deltaTime * fish.velocity.y

        if (fish.rotation > Math.PI / 2 && fish.rotation < Math.PI * 3 / 2) fish.scale.y = -0.8
        else fish.scale.y = 0.8
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

    if (fish.position.y >= -fish.position.x + meshX + meshY &&
        fish.position.y <= -fish.position.x + meshX + meshY + 120 &&
        fish.position.y >= meshY &&
        fish.position.y <= meshY + 120 &&
        fish.position.x >= meshX - 100)
        fish.caught = true
}

function collectFish(fish) {
    const boat = world.getChildByName('boat')
    gsap.to(fish, {
        x: boat.position.x + boat.width / 3,
        y: boat.position.y + boat.height / 2,
        rotation: 0,
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
