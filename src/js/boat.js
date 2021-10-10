import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { loader } from './assets'
import { status, world, horizon } from './game'

function createBoat() {
    const boundary = world.getChildByName('boundary')
    const boat = new PIXI.Container()
    boat.name = 'boat'
    world.addChild(boat);
    createBody()
    boat.position.set(boundary.width / 2 - boat.body.width / 2, horizon - boat.body.height)
    createNet()
}

function createBody() {
    const boat = world.getChildByName('boat')
    const texture = loader.resources.boat.texture
    const body = new PIXI.Sprite(texture)
    body.name = 'body'
    boat.addChild(body)
    boat.body = body
    gsap.to(body, { y: 4, repeat: -1, yoyo: true, ease: 'power1.inOut' })
}

function createNet() {
    const boat = world.getChildByName('boat')
    const net = new PIXI.Container()
    net.size = status.netSize
    net.name = 'net'
    net.speed = status.netSpeed
    net.position.set(boat.x + 30 - net.size * 15, boat.y)
    net.zIndex = 10
    net.cost = 100
    world.addChild(net)

    const outline = new PIXI.Graphics()
    outline.name = 'outline'
    net.addChild(outline)

    const mask = new PIXI.Graphics()
    mask.name = 'mask'
    mask.y = 24
    net.addChild(mask)

    const mesh = new PIXI.Graphics()
    mesh.name = 'mesh'
    mesh.mask = mask
    net.addChild(mesh)

    const line = new PIXI.Graphics();
    line.name = 'line'
    net.addChild(line)
    net.fishes = []
    resizeNet()
    boat.net = net
}

function resizeNet() {
    const net = world.getChildByName('net')
    const mask = net.getChildByName('mask')
    mask.clear()
    mask.beginFill(0xfff, 0.5)
    mask.moveTo(net.size * 15, 0)
    mask.lineTo(0, net.size * 15)
    mask.lineTo(0, (net.size + 1) * 15 + 2)
    mask.lineTo(net.size * 35 - (net.size + 1) * 15, (net.size + 1) * 15 + 2)
    mask.lineTo(net.size * 35 + 2, 0)
    net.capacity = Math.round(20 * (net.size / 6) ** 2)
    colorNet(0x135c77)
}

function colorNet(color) {
    const net = world.getChildByName('net')
    const outline = net.getChildByName('outline')
    const mesh = net.getChildByName('mesh')

    outline.clear()
    outline.lineStyle(2, color);
    outline.moveTo(20 + net.size * 15, 0)
    outline.lineTo(20 + net.size * 15, 5)
    outline.lineTo(0, 25 + net.size * 15)
    outline.lineTo(0, 25 + (net.size + 1) * 15)
    outline.lineTo(-15 + net.size * 20, 25 + (net.size + 1) * 15)
    outline.lineTo(20 + net.size * 35, 5)
    outline.lineTo(20 + net.size * 35, 0)

    mesh.clear()
    mesh.lineStyle(1, color);
    for (let y = 25; y <= 25 + net.size * 15; y += 15) {
        mesh.moveTo(0, y)
        mesh.lineTo(20 + net.size * 35, y)
    }
    for (let x = 0; x < net.size * 20; x += 20) {
        mesh.moveTo(20 + x + net.size * 15, 25)
        mesh.lineTo(x + 5, 25 + (net.size + 1) * 15)
    }
}

function updateNet() {
    const boat = world.getChildByName('boat')
    const body = boat.getChildByName('body')
    const net = world.getChildByName('net')

    drawline(net.position.y - body.height)
}

function resetNet() {
    const net = world.getChildByName('net')
    net.y = boat.y
    net.size = status.netSize
    net.speed = status.netSpeed
    net.fishes = []
    colorNet(0x135c77)
    resizeNet()
}

function drawline(length) {
    const boat = world.getChildByName('boat')
    const net = world.getChildByName('net')
    const line = net.getChildByName('line')

    line.clear()
    line.lineStyle(2, 0x135c77);
    line.moveTo(20 + net.size * 15, 0);
    line.lineTo(20 + net.size * 15, -length + boat.y);
    line.moveTo(20 + net.size * 35, 0);
    line.lineTo(20 + net.size * 35, -length + boat.y);
}

function getNetSpace() {
    const net = world.getChildByName('net')

    return 2
}

export { createBoat, updateNet, colorNet, resetNet, resizeNet, getNetSpace }
