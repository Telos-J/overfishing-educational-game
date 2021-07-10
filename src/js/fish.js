import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'

let caughtFish = 0
let coins = 0

const numFish = 100,
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
        this.position.set(Math.random() * boundary.width, Math.random() * (boundary.height - horizon - 50) + horizon + 50)
        this.rotation = Math.random() * Math.PI * 2
        this.speed = 1.5
        this.velocity = new PIXI.Point(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))
        this.serperationSurface = new PIXI.Point()
        this.seperation = new PIXI.Point()
        this.alignment = new PIXI.Point()
        this.cohesion = new PIXI.Point()
        this.bounds = [horizon, horizon + 1000]
        this.makeNeighborhood()
    }

    makeNeighborhood() {
        const neighborhood = new PIXI.Graphics()
        neighborhood.beginFill(0xffffff, 0.5)
        neighborhood.moveTo(0, 0)
        neighborhood.arc(0, 0, this.width * 3, -Math.PI * 2 / 3, Math.PI * 2 / 3)
        this.addChild(neighborhood)
        this.neighborhood = neighborhood
    }

    inNeighborhood(fish) {
        return this.neighborhood.containsPoint(fish.getGlobalPosition())
    }

    move(deltaTime) {
        const boat = world.getChildByName('boat')
        const net = boat.getChildByName('net')
    
        if (this.caught) return gsap.to(this, { y: `+=${net.vy}` })

        if (this.position.y < horizon) this.applyGravity()
        else this.swim() 
                           
        this.position.x += deltaTime * this.velocity.x
        this.position.y += deltaTime * this.velocity.y
    
        if (this.rotation > Math.PI / 2 || this.rotation < -Math.PI / 2) this.scale.y = -0.8
        else this.scale.y = 0.8
    
        this.bound()
    }


    swim() {
        this.seperation.set(0,0)
        for (let fish of fishes.children){
            if (this.inNeighborhood(fish)){
                this.seperate(fish)
                this.align(fish)
                this.coherce(fish)
            }
        }
        this.seperateSurface()
        this.velocity.x += this.seperation.x
        this.velocity.y += this.serperationSurface.y + this.seperation.y
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
        this.velocity.set(this.speed * Math.cos(this.rotation), this.speed * Math.sin(this.rotation))       
    }    

    applyGravity(){
        this.velocity.y += 0.098
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x)
    }

    seperateSurface(){
        const range = 200
        const max = 0.15
        const threshold = [this.bounds[0] + range, this.bounds[1] - range]
    
        if (this.position.y < threshold[0])
            this.serperationSurface.y = (max / range ** 2) * (this.position.y - threshold[0]) ** 2
        else if (this.position.y > threshold[1])
            this.serperationSurface.y = -(max / range ** 2) * (this.position.y - threshold[1]) ** 2
        else this.serperationSurface.y = 0
    }

    seperate(fish) {
        this.seperation.x += this.position.x - fish.position.x
        this.seperation.y += this.position.y - fish.position.y
    }

    align(){
    }

    coherce(){
    }

    bound(){
        const boundary = world.getChildByName('boundary')
        if (this.position.x - this.width / 2 > boundary.width)
            this.position.x = -this.width / 2
    }
    collideNet(){
        const boat = world.getChildByName('boat')
        const net = boat.getChildByName('net')
        const mask = net.getChildByName('mask')

        if (mask.containsPoint(this.getGlobalPosition())) this.caught = true
        else if (this.position.y > horizon) this.caught = false
    }
}

function spawnFishes() {
    const boundary = world.getChildByName('boundary')
    const sea = world.getChildByName('sea')
    const texture = loader.resources.fish.texture

    for (let i = 0; i < numFish; i++) {
        const fish = new Fish()
        fishes.addChild(fish)
    }

    fishes.mask = boundary
    world.addChild(fishes)
}

function controlFishes(deltaTime) {
    for (const fish of fishes.children) {
        fish.collideNet()
        fish.move(deltaTime)
        if (fish.caught && fish.position.y < horizon) collectFish(fish)
    }
}

function collectFish(fish) {
    const boat = world.getChildByName('boat')
    fish.scale.y = 0.8
    gsap.to(fish, {
        x: boat.position.x + boat.width / 3,
        y: boat.position.y + boat.height / 2,
        rotation: 0,
        onComplete: () => {
            const removed = fishes.removeChild(fish)
            if (removed) {
                caughtFish++
                const fishMeter = document.querySelector('#fish-meter').contentDocument
                fishMeter.querySelector('#caught').innerHTML = `${caughtFish}/40`
                gsap.to(fishMeter.querySelector('#gauge'), {
                    attr: { width: 220 * caughtFish / 40 }
                })

                coins += 2
                const coinMeter = document.querySelector('#coin-meter').contentDocument
                coinMeter.querySelector('#coin').innerHTML = coins
                gsap.to(coinMeter.querySelector('#gauge'), {
                    attr: { width: 220 * coins / 100 }
                })
            }
        }
    })
}


export { fishes, spawnFishes, controlFishes }