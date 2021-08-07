import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { colorNet, resetNet } from './boat'
import { world, horizon, status, updateCaughtFish, updateCoins } from './game'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

let numFish = 100
const rFish = 0.001,
    kFish = 100,
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
        this.position.set(Math.random() * boundary.width, this.bounds[0] + Math.random() * (this.bounds[1] - this.bounds[0]))
        this.speed = 1.5
        this.velocity = new PIXI.Point(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))
        this.seperationSurface = new PIXI.Point()
        this.seperationNet = new PIXI.Point()
        this.seperation = new PIXI.Point()
        this.alignment = new PIXI.Point()
        this.cohesion = new PIXI.Point()
        this.seperateSurfaceConstant = 0.15
        this.seperationNetConstant = 0.05
        this.seperationConstant = 0.03
        this.alignmentConstant = 0.04
        this.cohesionConstant = 0.02
        this.makeNeighborhood()
        this.caught = false
        this.collected = false
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
        if (this.position.y < horizon) this.applyGravity()
        else this.swim()

        this.position = add(this.position, scale(this.velocity, deltaTime))
        for (const fish of fishes.children) {
            this.collide(fish)
        }

        if (this.rotation > Math.PI / 2 || this.rotation < -Math.PI / 2) this.scale.y = -0.8
        else this.scale.y = 0.8

        this.bound()
    }

    swim() {
        const boat = world.getChildByName('boat')
        const net = world.getChildByName('net')
        this.seperation.set(0, 0)
        this.alignment.set(0, 0)
        this.cohesion.set(0, 0)
        for (let fish of this.caught ? net.fishes : fishes.children) {
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
            normalize(this.seperationNet, this.seperationNetConstant),
            normalize(this.seperation, this.seperationConstant),
            normalize(this.alignment, this.alignmentConstant),
            normalize(this.cohesion, this.cohesionConstant)
        )
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        this.velocity.set(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))
    }

    applyGravity() {
        const boat = world.getChildByName('boat')
        if (!this.collected && !boat.netUp) {
            this.velocity.y += 0.098
            this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        }
    }

    seperateSurface() {
        const range = 200
        const max = this.seperateSurfaceConstant
        const threshold = [this.bounds[0] + range, this.bounds[1] - range]

        if (this.position.y < threshold[0])
            this.seperationSurface.y = (max / range ** 2) * (this.position.y - threshold[0]) ** 2
        else if (this.position.y > threshold[1])
            this.seperationSurface.y = -(max / range ** 2) * (this.position.y - threshold[1]) ** 2
        else this.seperationSurface.y = 0
    }

    seperateNet() {
        const net = world.getChildByName('net')
        const mask = net.getChildByName('mask')
        const netCenter = new PIXI.Point(net.x + mask.width / 2, net.y + mask.y + mask.height / 2)

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
        const net = world.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (this.caught && !this.collected && !mask.containsPoint(this.getGlobalPosition())) {
            const netCenter = new PIXI.Point(net.x + mask.width / 2, net.y + mask.height / 2)
            let max = 100
            while (!mask.containsPoint(this.getGlobalPosition())) {
                const vec = sub(netCenter, this.position)
                this.position = add(this.position, normalize(vec))
                max--
                if (max < 0) {
                    this.caught = false
                    this.collected = false
                    this.speed = 1.5
                    net.fishes = net.fishes.filter(fish => fish !== this)
                    break
                }
            }
        }

        if (this.x < - this.width / 2)
            this.x = boundary.width + this.width / 2
        else if (this.x > boundary.width + this.width / 2)
            this.x = -this.width / 2
    }

    collide(fish) {
        const vec = sub(this.position, fish.position)
        if (magnitude(vec) < this.height / 2) {
            this.position = add(this.position, normalize(vec, this.speed))
        }
    }

    collideNet() {
        const net = world.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (net.fishes.length < net.capacity && !this.caught && mask.containsPoint(this.getGlobalPosition())) {
            this.caught = true
            this.seperateSurfaceConstant = 0.05
            this.seperationConstant = 0.05
            this.speed = 0.8
            net.fishes.push(this)
            if (net.fishes.length === net.capacity) colorNet(0xdd636e)
        }
    }
}

function spawnFishes() {
    const boundary = world.getChildByName('boundary')

    for (let i = 0; i < numFish; i++) {
        const fish = new Fish()
        fishes.addChild(fish)
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function addFishes() {
    const boundary = world.getChildByName('boundary')

    numFish += rFish * numFish * (1 - numFish / kFish);
    for (let i = 0; i < Math.floor(numFish - fishes.children.length); i++) {
        const fish = new Fish(boundary.width)
        fish.x = boundary.width + fish.width / 2
        fishes.addChild(fish);
    }
}

function resetFishes() {
    resetNet()
    fishes.removeChildren()
    numFish = kFish
    for (let i = 0; i < numFish; i++) {
        const fish = new Fish()
        fishes.addChild(fish)
    }
}

function controlFishes(deltaTime) {
    for (const fish of fishes.children) {
        fish.collideNet()
        fish.move(deltaTime)
        if (fish.caught && fish.position.y < horizon - 35) collectFish(fish)
    }
}

function collectFish(fish) {
    const boat = world.getChildByName('boat')
    const net = world.getChildByName('net')
    colorNet(0x135c77)
    fish.scale.y = 0.8
    fish.collected = true
    net.fishes = net.fishes.filter(somefish => somefish !== fish)
    gsap.to(fish, {
        x: boat.position.x + boat.width / 3,
        y: boat.position.y + boat.height / 2,
        rotation: 0,
        onComplete: () => {
            const removed = fishes.removeChild(fish)

            if (removed) {
                updateCaughtFish(status.caughtFish + 1)
                updateCoins(status.coins + 2)
                numFish--
            }
        }
    })
}


export { fishes, spawnFishes, resetFishes, controlFishes, addFishes }
