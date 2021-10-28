import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { Fish } from './fish'
import { colorNet, getNetSpace } from './boat'
import { world, horizon, status } from './game'

const jellyfishes = new PIXI.Container()
// fishes = new PIXI.ParticleContainer(numFish, { vertices: true, rotation: true })
jellyfishes.num = 20
jellyfishes.r = 0.02
jellyfishes.k = 20
jellyfishes.name = 'jellyfishes'

class Jellyfish extends Fish {
    constructor() {
        super({ bounds: [horizon + 200, horizon + 1000], speed: 0.8 })
        this.texture = loader.resources.jellyfish.texture
        this.anchor.set(0.3)
        this.scale.set(Math.random() < 0.5 ? -0.7 : 0.7, 0.7)
        this.rotation = 0
        this.velocity = new PIXI.Point(this.scale.x > 0 ? -this.speed : this.speed, 0)
        this.space = 2
    }

    swim() {
        if (this.caught) this.velocity.x = 0

        this.velocity.y += 0.02
        if (this.velocity.y > 0.4) this.velocity.y = 0.4
        if (Math.random() < (this.position.y) * 0.00001) {
            this.velocity.y = -1
        }
    }

    collideNet() {
        const net = world.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (getNetSpace() >= this.space && !this.caught && mask.containsPoint(this.getGlobalPosition())) {
            this.caught = true
            this.speed = 0
            net.fishes.push(this)
            if (!getNetSpace()) colorNet(0xdd636e)
        }
    }
}

jellyfishes.instance = Jellyfish

function spawnJellyfishes() {
    const boundary = world.getChildByName('boundary')

    for (let i = 0; i < jellyfishes.num; i++) {
        const fish = new Jellyfish()
        jellyfishes.addChild(fish)
    }

    jellyfishes.mask = boundary
    world.addChild(jellyfishes)
}


export { jellyfishes, spawnJellyfishes }
