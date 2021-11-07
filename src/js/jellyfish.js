import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { Fish } from './fish'
import { Species } from './species'
import { add, normalize } from './vector'

class Jellyfish extends Fish {
    constructor() {
        super({ bounds: [600, 2500], speed: 0.7, canRotate: false })
        this.texture = loader.resources.jellyfish.texture
        this.anchor.set(0.9, 0.15)
        this.scale.set(0.7)
        this.seperateBoundConstant = 0.015
        this.seperationNetConstant = 0.005
        this.space = 2
        this.ghost = true
    }

    swim() {
        const world = this.world

        if (this.caught) {
            this.seperateNet()
            this.velocity = add(
                this.velocity,
                normalize(this.seperationNet, this.seperationNetConstant)
            )
            this.velocity = normalize(this.velocity, 0.2)

            return
        }

        this.velocity.y += 0.02
        if (this.velocity.y > 0.3) this.velocity.y = 0.3

        const m = 0.1 ** 6
        const n = 0.1 ** 1.95
        const p = (this.position.y - world.horizon) * m + n

        if (Math.random() < p) {
            gsap.to(this, { y: '-=20' })
        }
    }
}

const jellyfishes = new Species({
    num: 10,
    r: 0.02,
    k: 10,
    name: 'jellyfishes',
    className: Jellyfish
})

function spawnJellyfishes(world) {
    const boundary = world.boundary

    for (let i = 0; i < jellyfishes.num; i++) {
        const fish = new Jellyfish()
        fish.dispatch(world)
        jellyfishes.addChild(fish)
    }

    jellyfishes.mask = boundary
    world.addChild(jellyfishes)
}


export { jellyfishes, spawnJellyfishes }
