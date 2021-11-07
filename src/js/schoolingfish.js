import { Species } from './species'
import { loader } from './assets'
import { Fish } from './fish'

class Schoolingfish extends Fish {
    constructor() {
        super({ bounds: [400, 1400], speed: 1.5, canRotate: true })
        this.texture = loader.resources.fish.texture
        this.anchor.set(0.5)
        this.scale.set(0.8)
        this.makeNeighborhood(this.width * 3)
        this.desired = true
    }
}

const schoolingfishes = new Species({
    num: 100,
    r: 0.02,
    k: 100,
    name: 'schoolingfishes',
    className: Schoolingfish
})


function spawnSchoolingfishes(world) {
    for (let i = 0; i < schoolingfishes.num; i++) {
        const fish = new Schoolingfish()
        fish.dispatch(world)
        schoolingfishes.addChild(fish)
    }

    schoolingfishes.mask = world.boundary
    world.addChild(schoolingfishes)
}

export { schoolingfishes, spawnSchoolingfishes }
