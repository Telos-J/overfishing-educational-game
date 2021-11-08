import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { scale } from './vector'

/*
 * The World class is responsible for creating the sea and sky.
 * Properties are independent of the application or the stage.
 * That means that the sea and sky are created inside of the world
 * and they operate on their own.
 *
 */

export default class World extends PIXI.Container {
    constructor() {
        super()
        this.sortableChildren = true
        this.species = []
        this.name = 'world'
        this.initWidth = 1920
        this.initHeight = 5760
        this.horizon = 400
        this.createBoundary()
        this.createWorld()
    }

    createBoundary() {
        const boundary = new PIXI.Graphics()
        boundary.drawRect(0, 0, this.initWidth, this.initHeight)
        boundary.name = 'boundary'
        this.boundary = boundary
        this.mask = boundary
    }

    createWorld() {
        this.createSea()
        this.createSky()
        this.createBottom()
    }

    createSea() {
        const texture = loader.resources.sea.texture
        const sea = new PIXI.Sprite(texture)
        sea.name = 'sea'
        this.addChild(sea)
    }

    createBottom() {
        const texture = loader.resources.bottom.texture
        const bottom = new PIXI.Sprite(texture)
        bottom.name = 'bottom'
        bottom.anchor.set(0, 1)
        bottom.position.y = this.height
        bottom.zIndex = 20
        bottom.mask = this.boundary
        this.addChild(bottom)
        const background = new PIXI.Graphics()
        background.beginFill(0x232024)
        background.drawRect(0, 0, this.width, bottom.height)
        bottom.addChild(background)
    }

    createSky() {
        const sky = new PIXI.Graphics()
        sky.beginFill(0x49536a)
        sky.drawRect(0, 0, this.width, this.horizon)
        sky.name = 'sky'
        sky.mask = this.boundary
        this.addChild(sky)
        this.createClouds()
    }

    createClouds() {
        const sky = this.getChildByName('sky')
        const clouds = new PIXI.Container()
        clouds.name = 'clouds'
        sky.addChild(clouds)

        this.createBigClouds()
        this.createSmallClouds()
    }

    createBigClouds() {
        const clouds = this.getChildByName('clouds', true)
        const bigClouds = new PIXI.Container()
        bigClouds.name = 'bigClouds'
        clouds.addChild(bigClouds)

        for (const key in loader.resources) {
            if (key.includes('bigCloud')) this.createBigCloud(key)
        }
    }

    createSmallClouds() {
        const clouds = this.getChildByName('clouds', true)
        const smallClouds = new PIXI.Container()
        smallClouds.name = 'smallClouds'
        clouds.addChild(smallClouds)

        for (const key in loader.resources) {
            if (key.includes('smallCloud')) this.createSmallCloud(key)
        }
    }

    createBigCloud(key) {
        const bigClouds = this.getChildByName('bigClouds', true)
        const texture = loader.resources[key].texture
        const cloud = new PIXI.Sprite(texture)

        cloud.name = key
        cloud.position.set(this.boundary.width - cloud.width, this.horizon - cloud.height)
        bigClouds.addChild(cloud)

        gsap.timeline({ repeat: -1 })
            .fromTo(cloud, { alpha: 0 }, { alpha: 1, ease: 'none', duration: 1 }, 0)
            .to(cloud, { x: -200, ease: 'none', duration: 10 }, 0)
            .to(cloud, { alpha: 0, ease: 'none', duration: 1 }, 9)
    }

    createSmallCloud(key) {
        const smallClouds = this.getChildByName('smallClouds', true)
        const texture = loader.resources[key].texture
        const cloud = new PIXI.Sprite(texture)

        cloud.name = key
        cloud.vx = 0.005 * Math.random() + 0.005
        cloud.position.set(
            Math.random() * this.boundary.width,
            Math.random() * (this.horizon - cloud.height)
        )
        smallClouds.addChild(cloud)

        gsap.timeline({ repeat: -1 })
            .fromTo(
                cloud,
                { x: cloud.position.x },
                {
                    x: this.boundary.width,
                    ease: 'none',
                    duration: (this.boundary.width - cloud.position.x) * cloud.vx,
                },
                0
            )
            .fromTo(
                cloud,
                { x: -cloud.width },
                {
                    x: cloud.position.x,
                    ease: 'none',
                    duration: (cloud.position.x + cloud.width) * cloud.vx,
                },
                (this.boundary.width - cloud.position.x) * cloud.vx
            )
    }

    moveCamera() {
        const boat = this.getChildByName('boat')
        const net = boat.net

        if (
            (this.y < 0 && boat.netUp && net.getBounds().top < innerHeight * 0.25) ||
            (this.y > -this.height + (this.width / innerWidth) * innerHeight &&
                boat.netDown &&
                net.getBounds().bottom > innerHeight * 0.75)
        ) {
            this.y -= net.vy
        }
    }

    getWorldPosition(target) {
        return scale(target.getGlobalPosition(), this.width / innerWidth)
    }
}
