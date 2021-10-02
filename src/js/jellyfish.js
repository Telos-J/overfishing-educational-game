import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { colorNet, resetNet } from './boat'
import { world, horizon, status} from './game'
import { add, sub, dot, magnitude, scale, normalize } from './vector'

let numJellyfish = 10
const rJellyfish = 0.02,
    kJellyfish = 100,
    jellyfishes = new PIXI.Container()
// fishes = new PIXI.ParticleContainer(numFish, { vertices: true, rotation: true })

jellyfishes.name = 'jellyfishes'

class Jellyfish extends PIXI.Sprite {
    constructor() {
        const boundary = world.getChildByName('boundary')
        super()
        this.texture = loader.resources.jellyfish.texture
        this.anchor.set(0.3)
        this.scale.set(Math.random()<0.5? -0.7 : 0.7, 0.7)
        this.bounds = [horizon + 100, horizon + 1000]
        this.position.set(Math.random() * boundary.width, this.bounds[0] + Math.random() * (this.bounds[1] - this.bounds[0]))
        this.caught = false
        this.collected = false
        this.speed = 0.8
        this.velocity = new PIXI.Point(this.scale.x > 0? -this.speed : this.speed, 0)
    }

    move(deltaTime) {
        if (this.position.y < horizon) this.applyGravity()
        else this.swim()

        this.position = add(this.position, scale(this.velocity, deltaTime))

        this.bound()
    }

    swim() {
        //this.velocity = normalize(this.velocity, this.speed)
        if (this.caught) {
            this.velocity = normalize(this.velocity, 0)
            console.log(this.caught)
        } else {
            this.velocity.y += 0.02
            if (this.velocity.y > 0.4) {
                this.velocity.y = 0.4
            }
            if (Math.random() < 0.03 && this.position.y > this.bounds[0] + 200 && this.position.y < this.bounds[1] - 100) {
                this.velocity.y = -1 
            }
        }
    }

    applyGravity() {
        const boat = world.getChildByName('boat')
        if (!this.collected && !boat.netUp) {
            this.velocity.y += 0.098
        }
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

    collideNet() {
        const net = world.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (net.fishes.length < net.capacity && !this.caught && mask.containsPoint(this.getGlobalPosition())) {
            this.caught = true
            this.speed = 0
            net.fishes.push(this)
            if (net.fishes.length === net.capacity) colorNet(0xdd636e)
        }
    }
}

function spawnJellyfishes() {
    const boundary = world.getChildByName('boundary')

    for (let i = 0; i < numJellyfish; i++) {
        const jellyfish = new Jellyfish()
        jellyfishes.addChild(jellyfish)
    }

    jellyfishes.mask = boundary
    world.addChild(jellyfishes)
}

function controlJellyfishes(deltaTime) {
    for (const jellyfish of jellyfishes.children) {
        jellyfish.collideNet()
        jellyfish.move(deltaTime)
        if (jellyfish.caught && jellyfish.position.y < horizon - 35) collectJellyfish(jellyfish)
    }
}


function collectJellyfish(jellyfish) {
    if (jellyfish.collected) return

    const boat = world.getChildByName('boat')
    const net = world.getChildByName('net')
    colorNet(0x135c77)
    jellyfish.collected = true
    net.fishes = net.fishes.filter(somejellyfish => somejellyfish !== jellyfish)
    gsap.to(jellyfish, {
        x: boat.position.x + boat.width / 3,
        y: boat.position.y + boat.height / 2,
        rotation: 0,
        onComplete: () => {
            numJellyfish--
            jellyfishes.removeChild(jellyfish)
        }
    })
}

export { jellyfishes, spawnJellyfishes, controlJellyfishes }
