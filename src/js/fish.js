import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

let caughtFish = 0
let coins = 0

const numFish = 100,
    fishes = new PIXI.Container()
// fishes = new PIXI.ParticleContainer(numFish, { vertices: true, rotation: true })

fishes.name = 'fishes'

class Fish extends PIXI.Sprite {
    constructor() {
        const boundary = world.getChildByName('boundary')
        super()
        this.texture = loader.resources.fish.texture
        this.anchor.set(0.5)
        this.scale.set(0.8)
        this.bounds = [horizon, horizon + 1000]
        //this.position.set(boundary.width, this.bounds[0] + 50)
        //this.rotation = Math.PI
        this.position.set(Math.random() * boundary.width, this.bounds[0] + Math.random() * (this.bounds[1] - this.bounds[0]))
        this.rotation = Math.random() * Math.PI * 2
        this.speed = 1.5
        this.velocity = new PIXI.Point(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))
        this.seperationSurface = new PIXI.Point()
        this.seperationNet = new PIXI.Point()
        this.seperation = new PIXI.Point()
        this.alignment = new PIXI.Point()
        this.cohesion = new PIXI.Point()
        this.makeNeighborhood()
    }

    makeNeighborhood() {
        const neighborhood = new PIXI.Graphics()
        neighborhood.beginFill(0xffffff, 0.00001)
        neighborhood.moveTo(0, 0)
        neighborhood.arc(0, 0, this.width * 3, -Math.PI * 2 / 3, Math.PI * 2 / 3)
        this.addChild(neighborhood)
        this.neighborhood = neighborhood
    }

    inNeighborhood(fish) {
        return this.neighborhood.containsPoint(fish.getGlobalPosition())
    }

    move(deltaTime) {
        const boat = world.getChildByName('boat')
        const net = boat.getChildByName('net')

        if (this.position.y < horizon) this.applyGravity()
        else this.swim()

        this.position = add(this.position, scale(this.velocity, deltaTime))

        if (this.rotation > Math.PI / 2 || this.rotation < -Math.PI / 2) this.scale.y = -0.8
        else this.scale.y = 0.8

        this.bound()
    }


    swim() {
        this.seperation.set(0, 0)
        this.alignment.set(0, 0)
        this.cohesion.set(0, 0)
        for (let fish of fishes.children) {
            if (this.inNeighborhood(fish)) {
                this.seperate(fish)
                this.align(fish)
                this.coherce(fish)
            }
        }
        this.seperateSurface()
        this.seperateNet()
        this.velocity = add(
            this.velocity,
            this.seperationSurface,
            normalize(this.seperationNet, 0.1),
            normalize(this.seperation, 0.03),
            normalize(this.alignment, 0.04),
            normalize(this.cohesion, 0.02)
        )
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        this.velocity.set(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))
    }

    applyGravity() {
        this.velocity.y += 0.098
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
    }

    seperateSurface() {
        const range = 200
        const max = 0.15
        const threshold = [this.bounds[0] + range, this.bounds[1] - range]

        if (this.position.y < threshold[0])
            this.seperationSurface.y = (max / range ** 2) * (this.position.y - threshold[0]) ** 2
        else if (this.position.y > threshold[1])
            this.seperationSurface.y = -(max / range ** 2) * (this.position.y - threshold[1]) ** 2
        else this.seperationSurface.y = 0
    }

    seperateNet() {
        const boat = world.getChildByName('boat')
        const net = boat.getChildByName('net')
        const mask = net.getChildByName('mask')
        const netCenter = new PIXI.Point(boat.x + net.x - 9.5, boat.y + net.y + 84.5)

        if (this.caught) this.seperationNet = sub(netCenter, this.position)
        else this.seperationNet.set(0, 0)
    }

    seperate(fish) {
        this.seperation = add(this.seperation, normalize(sub(this.position, fish.position)))
    }

    align(fish) {
        this.alignment = add(this.alignment, fish.velocity)
    }

    coherce(fish) {
        this.cohesion = add(this.cohesion, sub(fish.position, this.position))
    }

    bound() {
        const boundary = world.getChildByName('boundary')
        const boat = world.getChildByName('boat')
        const net = boat.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (this.caught && !mask.containsPoint(this.getGlobalPosition())) {
            const netCenter = new PIXI.Point(boat.x + net.x - 9.5, boat.y + net.y + 84.5)
            while (!mask.containsPoint(this.getGlobalPosition())) {
                this.position = add(this.position, normalize(sub(netCenter, this.position)))
            }

            gsap.to(this, { y: `+=${net.vy}` })
        }

        if (this.x < - this.width / 2)
            this.x = boundary.width + this.width / 2
        else if (this.x > boundary.width + this.width / 2)
            this.x = -this.width / 2
    }

    collideNet() {
        const boat = world.getChildByName('boat')
        const net = boat.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (mask.containsPoint(this.getGlobalPosition())) this.caught = true
    }
}

function spawnFishes() {
    const boundary = world.getChildByName('boundary')
    const sea = world.getChildByName('sea')
    const texture = loader.resources.fish.texture

    for (let i = 0; i < numFish; i++) {
        const fish = new Fish()
        fishes.addChild(fish)
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function controlFishes(deltaTime) {
    for (const fish of fishes.children) {
        fish.collideNet()
        fish.move(deltaTime)
        if (fish.caught && fish.position.y < horizon) collectFish(fish)
    }
}

function collectFish(fish) {
    const boat = world.getChildByName('boat')
    fish.scale.y = 0.8
    gsap.to(fish, {
        x: boat.position.x + boat.width / 3,
        y: boat.position.y + boat.height / 2,
        rotation: 0,
        onComplete: () => {
            const removed = fishes.removeChild(fish)
            if (removed) {
                caughtFish++
                const fishMeter = document.querySelector('#fish-meter').contentDocument
                fishMeter.querySelector('#caught').innerHTML = `${caughtFish}/40`
                gsap.to(fishMeter.querySelector('#gauge'), {
                    attr: { width: 220 * caughtFish / 40 }
                })

                coins += 2
                const coinMeter = document.querySelector('#coin-meter').contentDocument
                coinMeter.querySelector('#coin').innerHTML = coins
                gsap.to(coinMeter.querySelector('#gauge'), {
                    attr: { width: 220 * coins / 100 }
                })
            }
        }
    })
}


export { fishes, spawnFishes, controlFishes }
