import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { Fish } from './fish'
import { colorNet, getNetSpace } from './boat'
import { world, horizon, status, updateCaughtFish, updateCoins } from './game'
import { add, sub, dot, magnitude, scale, normalize } from './vector'
import { jellyfishes } from './jellyfish'

const turtles = new PIXI.Container()
// const turtles = new PIXI.ParticleContainer(numFish, { vertices: true, rotation: true })
turtles.num = 5
turtles.r = 0.02
turtles.k = 100
turtles.name = 'turtles'

class Turtle extends Fish {
    constructor() {
        super({bounds:[horizon, horizon + 1000], speed: 1.2})
        this.texture = loader.resources.turtle.texture
        this.anchor.set(0.92, 0.76)
        this.scale.set(0.65)
        this.makeNeighborhood()
        this.makeHead()
        this.space = 4
    }

    makeHead() {
        const head = new PIXI.Graphics()
        head.beginFill(0xffffff, 0.00001)
        head.moveTo(0, 0)
        head.arc(0, 0, 20, 0, 2 * Math.PI)
        this.addChild(head)
        this.head = head
    }

    move(deltaTime) {
        super.move(deltaTime)
        for (const fish of turtles.children) {
            this.collide(fish)
        }
    }

    swim() {
        const boat = world.getChildByName('boat')
        const net = world.getChildByName('net')
        this.seperation.set(0, 0)
        this.alignment.set(0, 0)
        this.cohesion.set(0, 0)
        this.chasing.set(0, 0)
        for (let fish of this.caught ? net.fishes : turtles.children) {
            if (this.inNeighborhood(fish)) {
                this.seperate(fish)
                this.align(fish)
                this.coherce(fish)
            }
        }

        for (let jellyfish of jellyfishes.children) {
            if (this.inNeighborhood(jellyfish)) {
                this.chase(jellyfish)
                this.eat(jellyfish)
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
            normalize(this.cohesion, this.cohesionConstant),
            normalize(this.chasing, this.chasingConstant)
        )
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        this.velocity.set(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))
    }
}

function spawnTurtles(fishes) {
    const boundary = world.getChildByName('boundary')

    for (let i = 0; i < turtles.num; i++) {
        const fish = new Turtle()
        turtles.addChild(fish)
    }

    turtles.mask = boundary
    world.addChild(turtles)
}

export { turtles, spawnTurtles }
