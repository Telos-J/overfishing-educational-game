import { Species } from './species'
import { loader } from './assets'
import { Fish } from './fish'

class Schoolingfish extends Fish {
    constructor(age) {
        super({ bounds: [400, 1400], speed: 1.5, canRotate: true })
        this.texture = loader.resources.fish.texture
        this.anchor.set(0.5)
        this.age = age
        this.scale.set(1.2 * (1 - Math.exp(-0.316 * age - 0.707)))
        this.makeNeighborhood(this.width * 3)
        this.desired = true
    }
}

const schoolingfishes = new Species({
    num: 0,
    r: 0.02,
    k: 100,
    name: 'schoolingfishes',
    className: Schoolingfish
})


function spawnSchoolingfishes(world) {
    for (let t = 0; t <= 10; t++) {
        const N = 30 * 10 ** (-0.15 * t)
        for (let i = 0; i < N; i++) {
            const fish = new Schoolingfish(t)
            fish.dispatch(world)
            schoolingfishes.addChild(fish)
            schoolingfishes.num++
        }
    }

    schoolingfishes.mask = world.boundary
    world.addChild(schoolingfishes)
}

export { schoolingfishes, spawnSchoolingfishes }
