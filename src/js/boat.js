import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { world, horizon } from './game'

function createBoat() {
    const boundary = world.getChildByName('boundary')
    const boat = new PIXI.Container()
    boat.name = 'boat'
    world.addChild(boat);

    const body = createBody()
    const net = createNet()

    boat.position.set(boundary.width / 2 - body.width / 2, horizon - body.height)
}

function createBody() {
    const boat = world.getChildByName('boat')
    const texture = loader.resources.boat.texture
    const body = new PIXI.Sprite(texture)
    body.name = 'body'
    boat.addChild(body)

    gsap.to(body, { y: 4, repeat: -1, yoyo: true, ease: 'power1.inOut' })

    return body
}

function createNet() {
    const boat = world.getChildByName('boat')
    const body = boat.getChildByName('body')
    const netTexture = loader.resources.net.texture
    const netRef = new PIXI.Sprite(netTexture)
    netRef.name = 'netRef'
    netRef.alpha = 0.5
    netRef.position.set(-70, boat.height)
    //boat.addChild(netRef)

    const net = new PIXI.Container()
    net.name = 'net'
    net.speed = 10
    net.position.set(53, body.height)
    boat.addChild(net)

    const outline = new PIXI.Graphics()
    outline.name = 'outline'
    outline.lineStyle(2, 0x135c77);
    outline.moveTo(0, 0)
    outline.lineTo(0, 5)
    outline.lineTo(-120, 125)
    outline.lineTo(-120, 145)
    outline.lineTo(-20, 145)
    outline.lineTo(120, 5)
    outline.lineTo(120, 0)
    net.addChild(outline)

    const mask = new PIXI.Graphics()
    mask.name = 'mask'
    mask.beginFill(0xfff, 0.5)
    mask.moveTo(0, 5)
    mask.lineTo(-120, 125)
    mask.lineTo(-120, 145)
    mask.lineTo(-20, 145)
    mask.lineTo(120, 5)
    net.addChild(mask)

    const mesh = new PIXI.Graphics()
    mesh.name = 'mesh'
    mesh.lineStyle(1, 0x135c77);
    for (let y = 25; y <= 145; y += 15) {
        mesh.moveTo(-120, y)
        mesh.lineTo(100, y)
    }
    for (let x = 0; x <= 90; x += 20) {
        mesh.moveTo(x, 25)
        mesh.lineTo(-120 + x, 145)
    }
    mesh.mask = mask
    net.addChild(mesh)

    const line = new PIXI.Graphics();
    line.name = 'line'
    net.addChild(line)
    drawline(10)

    return net
}

function updateNet() {
    const boat = world.getChildByName('boat')
    const body = boat.getChildByName('body')
    const net = boat.getChildByName('net')

    drawline(net.position.y - body.height)
}

function drawline(length) {
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')
    const line = net.getChildByName('line')

    line.clear()
    line.lineStyle(2, 0x135c77);
    line.moveTo(0, 0);
    line.lineTo(0, -length);
    line.moveTo(120, 0);
    line.lineTo(120, -length);
}

export { createBoat, updateNet }
