import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { status } from './game'

export default class Boat extends PIXI.Sprite {
    constructor() {
        super()
        this.texture = loader.resources.boat.texture
        this.anchor.set(0.5, 1)
        this.animate()
        this.lineHook1 = this.height * 0.177
        this.lineHook2 = this.height * 0.275
    }

    dispatch(world) {
        //this.position.set(world.width / 2, world.horizon)
        this.position.set(-this.width, world.horizon)
        this.mask = world.boundary
        gsap.to(this, { x: world.width / 2, duration: 3 })
        world.addChild(this)
    }

    animate() {
        gsap.to(this, { y: '+=4', repeat: -1, yoyo: true, ease: 'power1.inOut', duration: 1 })
    }

    addNet(net) {
        this.createLine()
        this.net = net
        this.addChild(net)
        net.connectBoat(-this.width / 2.45, -this.height / 4)
    }

    createLine() {
        const line = new PIXI.Graphics()
        line.name = 'line'
        line.tint = 0x135c77
        this.addChild(line)
    }

    control() {
        const net = this.net
        if (!status.fishing) {
            this.netUp = true
            this.netDown = false
        }

        if (this.netDown) {
            net.force = net.speed / 15
            net.reachedMax = false
        } else if (this.netUp) {
            net.force = -net.speed / 15
            net.reachedMax = false
        } else if (net.reachedMax) net.force = 0
    }
}
