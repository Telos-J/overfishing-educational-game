import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { gameStatus, updateCaughtFish, updateCoins } from './gameStatus'
import { add, sub, magnitude, scale, normalize } from './vector'
import { updateLF } from './lengthFrequencyGraph'
import { app } from './app'

class Fish extends PIXI.Sprite {
    constructor({ bounds, speed, canRotate }) {
        super()
        // Boundaries and velocity
        this.bounds = bounds
        this.canRotate = canRotate
        this.rotation = (Math.random() * Math.PI) / 3 - Math.PI / 6
        if (!canRotate) this.rotation = 0
        else if (Math.random() < 0.5) this.rotation += Math.PI
        this.maxSpeed = speed
        this.speed = speed
        this.velocity = new PIXI.Point(
            this.speed * Math.cos(this.rotation),
            this.speed * Math.sin(this.rotation)
        )
        if (!canRotate) this.velocity.set(Math.random() < 0.5 ? this.speed : -this.speed, 0)
        this.flip()

        // Vectors and constants
        this.seperationSurface = new PIXI.Point()
        this.seperationNet = new PIXI.Point()
        this.seperation = new PIXI.Point()
        this.alignment = new PIXI.Point()
        this.cohesion = new PIXI.Point()
        this.leveling = new PIXI.Point()
        this.exploration = new PIXI.Point()
        this.chasing = new PIXI.Point()
        this.seperateBoundConstant = 0.15
        this.seperationNetConstant = 0.05
        this.seperationConstant = 0.03
        this.alignmentConstant = 0.04
        this.cohesionConstant = 0.03
        this.levelingConstant = 0.01
        this.explorationContant = 0.1
        this.chasingConstant = 0.2
        this.explorationProb = 0.0005

        // Properties
        this.ghost = false
        this.caught = false
        this.collected = false
        this.exploring = false
        this.space = 1
        this.desired = false
        this.hunger = 0
    }

    dispatch(world) {
        this.world = world
        this.position.set(
            Math.random() * world.boundary.width,
            this.bounds[0] + Math.random() * (this.bounds[1] - this.bounds[0]) + this.height
        )
        this.on('pointerover', () => {
            console.log('fish')
        })
    }

    makeNeighborhood(range) {
        const neighborhood = new PIXI.Graphics()
        neighborhood.beginFill(0xffffff, 1)
        neighborhood.alpha = 0.00001
        neighborhood.moveTo(0, 0)
        neighborhood.arc(0, 0, this.height * 2, (Math.PI * 2) / 3, (Math.PI * 4) / 3)
        neighborhood.moveTo(0, 0)
        neighborhood.arc(0, 0, range, (-Math.PI * 2) / 3, (Math.PI * 2) / 3)
        this.addChild(neighborhood)
        this.neighborhood = neighborhood
    }

    inNeighborhood(fish) {
        return this.neighborhood.containsPoint(fish.getGlobalPosition())
    }

    onHead(fish) {
        return this.head.containsPoint(fish.getGlobalPosition())
    }

    move(deltaTime) {
        const fishes = this.parent
        const world = fishes.parent

        if (this.position.y < world.horizon) this.applyGravity()
        else this.swim()

        this.position = add(this.position, scale(this.velocity, deltaTime))

        if (!this.ghost) this.collide(fishes.children)

        this.flip()
        this.bound()
    }

    flip() {
        if (this.prey) return
        if (this.canRotate) {
            if (this.rotation > Math.PI / 2 || this.rotation < -Math.PI / 2)
                this.scale.y = -Math.abs(this.scale.y)
            else this.scale.y = Math.abs(this.scale.y)
        } else {
            this.scale.x = Math.sign(this.velocity.x) * Math.abs(this.scale.x)
        }
    }

    swim() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        this.seperation.set(0, 0)
        this.alignment.set(0, 0)
        this.cohesion.set(0, 0)
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
        this.velocity = add(
            this.velocity,
            normalize(this.seperationNet, this.seperationNetConstant),
            normalize(this.seperation, this.seperationConstant),
            normalize(this.alignment, this.alignmentConstant),
            normalize(this.cohesion, this.cohesionConstant),
            normalize(this.leveling, this.levelingConstant),
            normalize(this.exploration, this.explorationContant)
        )

        if (this.canRotate) this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        this.velocity = normalize(this.velocity, this.speed)
    }

    applyGravity() {
        if (!this.collected) {
            this.velocity.y += 0.098
        }
    }

    level() {
        this.leveling.set(this.velocity.x, 0)
    }

    explore() {
        if (!this.exploring && Math.random() < this.explorationProb) {
            this.ghost = true
            this.exploring = true
            this.exploration.set(-this.velocity.x, 0)
            setTimeout(() => {
                this.ghost = false
                this.exploring = false
                this.exploration.set(0, 0)
            }, 2000)
        }
    }

    seperateNet() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        if (this.caught) this.seperationNet = sub(net.getCenter(), this.position)
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

    chase(fish) {
        const world = this.world
        const headPosition = world.getWorldPosition(this.head)
        this.chasing = sub(fish.position, headPosition)
    }

    eat(fish) {
        if (this.onHead(fish)) {
            fish.parent.num--
            fish.parent.removeChild(fish)
        }
    }

    bound() {
        this.boundX()
        this.boundY()
        if (this.caught && !this.collected) this.boundNet()
    }

    boundNet() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        const mask = net.getChildByName('mask')

        if (!mask.containsPoint(this.getGlobalPosition())) {
            const vec = sub(net.getCenter(), this.position)

            let max = 100
            while (!mask.containsPoint(this.getGlobalPosition())) {
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
    }

    boundNetY() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        const mask = net.getChildByName('mask')

        if (!mask.containsPoint(this.getGlobalPosition())) {
            if (
                (net.vy > 0 && -(this.x - net.getCenter().x) > this.y - net.getCenter().y) ||
                (net.vy < 0 && net.getCenter().y < this.y)
            )
                this.y += net.vy
        }
    }

    boundX() {
        const boundary = this.world.boundary

        if (this.x < -this.width / 2) this.x = boundary.width + this.width / 2
        else if (this.x > boundary.width + this.width / 2) this.x = -this.width / 2
    }

    boundY() {
        const range = 200
        const max = this.seperateBoundConstant
        const threshold = [this.bounds[0] + range, this.bounds[1] - range]

        if (this.position.y < threshold[0])
            this.velocity.y += (max / range ** 2) * (this.position.y - threshold[0]) ** 2
        else if (this.position.y > threshold[1])
            this.velocity.y += -(max / range ** 2) * (this.position.y - threshold[1]) ** 2
    }

    isColliding(fishes) {
        return fishes.some(fish => {
            const vec = sub(this.position, fish.position)
            return fish !== this && magnitude(vec) < this.height
        })
    }

    collide(fishes) {
        for (const fish of fishes) {
            const vec = sub(this.position, fish.position)
            if (fish !== this && !fish.ghost && magnitude(vec) < (this.height + fish.height) / 2) {
                this.position = add(this.position, normalize(vec, this.speed / 2))
            }
        }
    }

    collideNet() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        const mask = net.getChildByName('mask')

        if (
            gameStatus.fishing &&
            net.getNetSpace() >= this.space &&
            !this.caught &&
            mask.containsPoint(this.getGlobalPosition())
        ) {
            this.caught = true
            this.seperateBoundConstant = 0.05
            this.seperationConstant = 0.05
            this.speed = 0.8
            net.fishes.push(this)
            if (!net.getNetSpace()) net.colorNet(0xdd636e)
        }
    }

    release() {
        const boat = this.world.getChildByName('boat', true)
        const net = boat.net
        net.fishes = net.fishes.filter(fish => fish !== this)

        this.caught = false
        this.seperateBoundConstant = 0.15
        this.seperationNetConstant = 0.05
        this.speed = this.maxSpeed
    }
}

function resetFishes(fishes) {
    if (!fishes.children.length) return
    const world = fishes.children[0].world
    fishes.removeChildren()
    fishes.num = fishes.k
    for (let i = 0; i < fishes.num; i++) {
        const fish = new fishes.className()
        fish.dispatch(world)
        fishes.addChild(fish)
    }
}

function controlFishes(fishes, deltaTime) {
    const world = fishes.parent
    for (const fish of fishes.children) {
        fish.move(deltaTime)
        fish.collideNet()
        if (fish.caught && fish.position.y < world.horizon - 35)
            fish.desired ? collectFish(fish) : collectOtherFish(fish)
    }
}

function collectOtherFish(fish) {
    if (fish.collected) return

    const fishes = fish.parent
    const world = fishes.parent
    const boat = world.getChildByName('boat', true)
    const net = boat.net

    net.colorNet(0x135c77)
    fish.collected = true
    net.fishes = net.fishes.filter(somefish => somefish !== fish)
    gsap.to(fish, {
        x: boat.position.x,
        y: boat.position.y - boat.height / 2,
        rotation: 0,
        onComplete: () => {
            fish.parent.num--
            fish.parent.removeChild(fish)
        },
    })
}

function collectFish(fish) {
    if (fish.collected) return

    const boat = app.stage.getChildByName('boat', true)
    const net = boat.net

    net.colorNet(0x135c77)
    fish.scale.set(0.8)
    fish.collected = true
    net.fishes = net.fishes.filter(somefish => somefish !== fish)
    gsap.to(fish, {
        x: boat.position.x,
        y: boat.position.y - boat.height / 2,
        rotation: 0,
        onComplete: () => {
            fish.texture = loader.resources.coin.texture
            gsap.to(fish, {
                y: '-=100',
                onComplete: () => {
                    fish.parent.num--
                    fish.parent.removeChild(fish)
                    updateCaughtFish(gameStatus.biomass + fish.biomass)
                    updateCoins(gameStatus.coins + 2)
                    updateLF(fish.length)
                },
            })
        },
    })
}

function addFishes(fishes) {
    const world = fishes.parent
    const boundary = world.boundary

    fishes.num += fishes.r * fishes.num * (1 - fishes.num / fishes.k)

    fishes.children = fishes.children.sort((fish1, fish2) => fish1.age > fish2.age)
    if (fishes.num < fishes.children.length) {
        for (let i = 0; i < Math.floor(fishes.children.length - fishes.num); i++) {
            const fish = fishes.children.pop()
            gsap.to(fish, {
                rotation: 0,
                scaleY: -Math.abs(fish.scale.y),
                onComplete: () => {
                    fishes.removeChild(fish)
                },
            })
        }
    } else {
        for (let i = 0; i < Math.floor(fishes.num - fishes.children.length); i++) {
            const fish = new fishes.className(0)
            fish.dispatch(world)
            fish.x = boundary.width + fish.width / 2
            fishes.addChild(fish)
        }
    }
}

export { Fish, resetFishes, controlFishes, addFishes }
