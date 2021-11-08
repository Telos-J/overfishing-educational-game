import * as PIXI from 'pixi.js'
import { loader } from './assets'
import { Fish } from './fish'
import { add, normalize } from './vector'
import { Species } from './species'
import { jellyfishes } from './jellyfish'

class Turtle extends Fish {
    constructor() {
        super({ bounds: [400, 2000], speed: 1.2, canRotate: false })
        this.texture = loader.resources.turtle.texture
        this.anchor.set(0.5)
        this.scale.set(0.65)
        this.makeNeighborhood(this.width * 5)
        this.makeHead()
        this.chasingConstant = 1
        this.space = 4
        this.explorationProb = 0.001
        this.prey = null
    }

    makeHead() {
        const head = new PIXI.Graphics()
        head.beginFill(0xffffff, 1)
        head.alpha = 0.00001
        head.arc(0, 0, 20, 0, 2 * Math.PI)
        head.position.set(this.width / 1.6, this.height / 2)
        this.addChild(head)
        this.head = head
    }

    swim() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        this.seperation.set(0, 0)
        this.alignment.set(0, 0)
        this.cohesion.set(0, 0)
        this.chasing.set(0, 0)
        for (let fish of this.caught ? net.fishes : this.parent.children) {
            if (this.inNeighborhood(fish)) {
                this.seperate(fish)
                this.align(fish)
                this.coherce(fish)
            }
        }
        this.seperateNet()
        this.level()
        this.explore()
        this.findPrey(jellyfishes.children)
        if (this.prey) {
            this.chase(this.prey)
            this.eat(this.prey)
        }
        this.velocity = add(
            this.velocity,
            normalize(this.seperationNet, this.seperationNetConstant),
            normalize(this.seperation, this.seperationConstant),
            normalize(this.alignment, this.alignmentConstant),
            normalize(this.cohesion, this.cohesionConstant),
            normalize(this.leveling, this.levelingConstant),
            this.prey
                ? normalize(this.chasing, this.chasingConstant)
                : normalize(this.exploration, this.explorationContant)
        )

        if (this.canRotate) this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        this.velocity = normalize(this.velocity, this.speed)
    }

    findPrey(fishes) {
        if (!this.prey) {
            const self = this
            this.prey = fishes.find(fish => self.inNeighborhood(fish))
        } else if (!this.inNeighborhood(this.prey)) this.prey = null
    }
}

const turtles = new Species({
    num: 1,
    r: 0.02,
    k: 0,
    name: 'turtles',
    className: Turtle,
})

function spawnTurtles(world) {
    const boundary = world.boundary

    for (let i = 0; i < turtles.num; i++) {
        const fish = new Turtle()
        fish.dispatch(world)
        turtles.addChild(fish)
    }

    turtles.mask = boundary
    world.addChild(turtles)
}

export { turtles, spawnTurtles }
