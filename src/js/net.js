import * as PIXI from 'pixi.js'
import { cloneDeep } from 'lodash'
import { gameStatus } from './game'

export default class Net extends PIXI.Container {
    constructor() {
        super()
        this.size = gameStatus.netSize
        this.meshSize = 15
        this.speed = gameStatus.netSpeed
        this.cost = 100
        this.fishes = []
        this.buildNet()
        this.pivot.set(0, (this.size + 1) * this.meshSize)
        this.offset = new PIXI.Point()
        this.resize()
        this.vy = 0
        this.reachedMax = false
    }

    buildNet() {
        const outline = new PIXI.Graphics()
        outline.name = 'outline'
        outline.tint = 0x135c77
        this.addChild(outline)

        const mask = new PIXI.Graphics()
        mask.name = 'mask'
        this.addChild(mask)

        const mesh = new PIXI.Graphics()
        mesh.name = 'mesh'
        mesh.mask = mask
        mesh.tint = 0x135c77
        this.addChild(mesh)
    }

    connectBoat(offsetX = 0, offsetY = 0) {
        this.offset.set(offsetX, offsetY)
        this.position.set(-this.size * this.meshSize + offsetX, offsetY)
        this.setShadow()
    }

    setShadow() {
        const boat = this.parent
        const world = boat.parent
        this.shadow = cloneDeep(this)
        this.alpha = 0.5
        this.shadow.zIndex = 10
        this.shadow.mask = world.boundary
        world.addChild(this.shadow)
    }

    resize() {
        const outline = this.getChildByName('outline')
        outline.clear()
        outline.lineStyle(2, 0xffffff)
        outline.moveTo(this.size * this.meshSize, -5)
        outline.lineTo(this.size * this.meshSize, 0)
        outline.lineTo(0, this.size * this.meshSize)
        outline.lineTo(0, (this.size + 1) * this.meshSize)
        outline.lineTo((this.size - 1) * this.meshSize, (this.size + 1) * this.meshSize)
        outline.lineTo(this.size * this.meshSize * 2, 0)
        outline.lineTo(this.size * this.meshSize * 2, -5)

        const mesh = this.getChildByName('mesh')
        mesh.clear()
        mesh.lineStyle(1, 0xffffff)
        for (let i = 0; i < this.size; i++) {
            const j = (this.size - i - 1) * this.meshSize
            // horizontal
            mesh.moveTo(j, (i + 1) * this.meshSize)
            mesh.lineTo(j + this.size * this.meshSize, (i + 1) * this.meshSize)

            // veritical
            mesh.moveTo((i - 1) * this.meshSize, (this.size + 1) * this.meshSize)
            mesh.lineTo((i - 1 + this.size) * this.meshSize, this.meshSize)
        }

        const mask = this.getChildByName('mask')
        mask.clear()
        mask.beginFill(0xfff, 0.5)
        mask.moveTo((this.size - 1) * this.meshSize, this.meshSize)
        mask.lineTo(0, this.size * this.meshSize)
        mask.lineTo(0, (this.size + 1) * this.meshSize)
        mask.lineTo((this.size - 1) * this.meshSize, (this.size + 1) * this.meshSize)
        mask.lineTo(this.size * this.meshSize * 2 - this.meshSize, this.meshSize)

        this.capacity = this.size ** 2
    }

    colorNet(color) {
        const boat = this.parent
        const outline = this.shadow.getChildByName('outline')
        const mesh = this.shadow.getChildByName('mesh')
        const line = boat.getChildByName('line')

        outline.tint = color
        mesh.tint = color
        line.tint = color
    }

    update() {
        this.move()
        this.bound()
        this.boundFish()
        this.updateLine()
        this.updateShadow()
    }

    move() {
        if (this.force) this.vy += this.force
        else if (this.reachedMax) {
            this.vy -= (this.speed / 15) * Math.sign(this.vy)
            if (Math.abs(this.vy) < this.speed / 15) {
                this.vy = 0
                this.reachedMax = false
            }
        }

        if (Math.abs(this.vy) > this.speed) {
            this.vy = this.speed * Math.sign(this.vy)
            this.reachedMax = true
        }

        this.position.y += this.vy
    }

    bound() {
        const world = this.shadow.parent

        if (this.position.y < this.offset.y) {
            this.position.y = this.offset.y
            this.vy = 0
            this.force = 0
            this.reachedMax = false
            return
        }

        if (this.y > world.height - world.horizon) {
            this.position.y = world.height - world.horizon
            this.vy = 0
            this.force = 0
            this.reachedMax = false
            return
        }
    }

    boundFish() {
        if (this.vy) {
            for (const fish of this.fishes) {
                fish.boundNetY()
                if (fish.isColliding(this.fishes)) {
                    fish.y += this.vy
                }
            }
        }
    }

    updateShadow() {
        const boat = this.parent
        this.shadow.position.set(boat.x + this.x, boat.y + this.y)
    }

    updateLine() {
        const boat = this.parent
        const line = boat.getChildByName('line')

        line.clear()
        line.lineStyle(2, 0xffffff)
        line.moveTo(this.offset.x, -boat.lineHook1)
        line.lineTo(this.offset.x, this.y - this.height + 5)
        line.moveTo(
            this.offset.x + this.size * this.meshSize,
            this.size < 9 ? -boat.lineHook1 : -boat.lineHook2
        )
        line.lineTo(this.offset.x + this.size * this.meshSize, this.y - this.height + 5)
    }

    reset() {
        this.size = gameStatus.netSize
        this.speed = gameStatus.netSpeed
        this.fishes = []
        this.colorNet(0x135c77)
        this.resize()
    }

    getNetSpace() {
        let netSpace = this.capacity
        for (const fish of this.fishes) {
            netSpace -= fish.space
        }

        return netSpace
    }

    getCenter() {
        const boat = this.parent
        const centerX = boat.x + this.x + this.size * this.meshSize - this.meshSize
        const centerY = boat.y + this.y - (this.size * this.meshSize) / 2
        return new PIXI.Point(centerX, centerY)
    }
}
