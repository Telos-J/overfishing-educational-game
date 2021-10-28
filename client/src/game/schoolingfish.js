import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { Fish } from './fish'
import { colorNet, getNetSpace } from './boat'
import { world, horizon, status, updateCaughtFish, updateCoins } from './game'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

const schoolingfishes = new PIXI.Container()
// const schoolingfishes = new PIXI.ParticleContainer(numFish, { vertices: true, rotation: true })
schoolingfishes.num = 100
schoolingfishes.r = 0.02
schoolingfishes.k = 100
schoolingfishes.name = 'schoolingfishes'

class Schoolingfish extends Fish {
    constructor() {
        super({ bounds: [horizon, horizon + 1000], speed: 1.5 })
        this.texture = loader.resources.fish.texture
        this.anchor.set(0.5)
        this.scale.set(0.8)
        this.makeNeighborhood()
        this.desired = true
    }

    move(deltaTime) {
        super.move(deltaTime)
        for (const fish of schoolingfishes.children) {
            this.collide(fish)
        }
    }

    swim() {
        const boat = world.getChildByName('boat')
        const net = world.getChildByName('net')
        this.seperation.set(0, 0)
        this.alignment.set(0, 0)
        this.cohesion.set(0, 0)
        for (let fish of this.caught ? net.fishes : schoolingfishes.children) {
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
}

schoolingfishes.instance = Schoolingfish

function spawnSchoolingfishes(fishes) {
    const boundary = world.getChildByName('boundary')

    for (let i = 0; i < schoolingfishes.num; i++) {
        const fish = new Schoolingfish()
        schoolingfishes.addChild(fish)
    }

    schoolingfishes.mask = boundary
    world.addChild(schoolingfishes)
}

export { schoolingfishes, spawnSchoolingfishes }
