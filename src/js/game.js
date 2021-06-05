import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { moveFishes } from './fish'
import { updateNet } from './boat'

const world = new PIXI.Container(),
    _width = 1920,
    _height = 5760,
    horizon = 400

function createBoundary() {
    const boundary = new PIXI.Graphics()
    boundary.drawRect(0, 0, _width, _height);
    boundary.name = 'boundary'
    world.addChild(boundary)
}

function gameLoop(deltaTime) {
    moveFishes(deltaTime)
    control()
    updateNet()
}

function addControls() {
    const boat = world.getChildByName('boat')
    boat.netDown = false
    boat.netUp = false

    addEventListener('keydown', (e) => {
        e.preventDefault()
        if (e.code === 'ArrowDown') {
            boat.netDown = true
            boat.netUp = false
        }
        else if (e.code === 'ArrowUp') {
            boat.netDown = false
            boat.netUp = true
        }
    })

    addEventListener('keyup', (e) => {
        e.preventDefault()
        if (e.code === 'ArrowDown') boat.netDown = false
        else if (e.code === 'ArrowUp') boat.netUp = false
    })
}

function control() {
    const boat = world.getChildByName('boat')
    const body = boat.getChildByName('body')
    const net = boat.getChildByName('net')

    if (boat.netDown)
        net.speed = 10
    else if (boat.netUp && net.position.y > 0)
        net.speed = -10
    else
        net.speed = 0

    gsap.to(net, { y: `+=${net.speed}` })
}

export { world, horizon, gameLoop, createBoundary, addControls }
