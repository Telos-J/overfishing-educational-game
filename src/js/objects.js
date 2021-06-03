import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'

function createSea() {
    const texture = loader.resources.sea.texture
    const sea = new PIXI.Sprite(texture)
    sea.name = 'sea'
    sea.position.y = horizon;
    world.addChild(sea);
}

function createSky() {
    const boundary = world.getChildByName('boundary')
    const sky = new PIXI.Container()
    sky.name = 'sky'
    sky.mask = boundary
    world.addChild(sky)

    createClouds()
}

function createClouds() {
    for (const key in loader.resources) {
        if (key.includes('bigCloud')) createBigCloud(key)
        else if (key.includes('smallCloud')) createSmallCloud(key)
    }
}

function createBigCloud(key) {
    const boundary = world.getChildByName('boundary')
    const sky = world.getChildByName('sky')
    const texture = loader.resources[key].texture
    const cloud = new PIXI.Sprite(texture)

    cloud.name = key
    cloud.position.set(boundary.width - cloud.width, horizon - cloud.height)
    sky.addChild(cloud)

    gsap.timeline({ repeat: -1 })
        .fromTo(cloud, 1, { alpha: 0 }, { alpha: 1, ease: 'none' }, 0)
        .to(cloud, 10, { x: -200, ease: 'none' }, 0)
        .to(cloud, 1, { alpha: 0, ease: 'none' }, 9)
}

function createSmallCloud(key) {
    const boundary = world.getChildByName('boundary')
    const sky = world.getChildByName('sky')
    const texture = loader.resources[key].texture
    const cloud = new PIXI.Sprite(texture)

    cloud.name = key
    cloud.vx = 0.005 * Math.random() + 0.005
    cloud.position.set(Math.random() * boundary.width, Math.random() * (horizon - cloud.height))
    sky.addChild(cloud)

    gsap.timeline({ repeat: -1 })
        .fromTo(cloud, (boundary.width - cloud.position.x) * cloud.vx, { x: cloud.position.x }, { x: boundary.width, ease: 'none' }, 0)
        .fromTo(cloud, (cloud.position.x + cloud.width) * cloud.vx, { x: -cloud.width }, { x: cloud.position.x, ease: 'none' }, (boundary.width - cloud.position.x) * cloud.vx)
}

export { createSea, createSky }
