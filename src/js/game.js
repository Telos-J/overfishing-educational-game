import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { controlFishes } from './fish'
import { updateNet } from './boat'
import { app } from './app'
import { MaskData } from 'pixi.js'

const world = new PIXI.Container(),
    _width = 1920,
    _height = 5760,
    horizon = 400

let time = 90

function createBoundary() {
    const boundary = new PIXI.Graphics()
    boundary.drawRect(0, 0, _width, _height);
    boundary.name = 'boundary'
    world.addChild(boundary)
}

function gameLoop(deltaTime) {
    updateTime()
    control()
    controlFishes(deltaTime)
    updateNet()
}

function addControls() {
    const keyCodes = ['ArrowDown', 'ArrowUp']
    const boat = world.getChildByName('boat')
    boat.netDown = false
    boat.netUp = false

    addEventListener('keydown', (e) => {
        if (keyCodes.includes(e.code)) e.preventDefault()

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
        if (keyCodes.includes(e.code)) e.preventDefault()

        if (e.code === 'ArrowDown') boat.netDown = false
        else if (e.code === 'ArrowUp') boat.netUp = false
    })
}

function control() {
    const boat = world.getChildByName('boat')
    const net = boat.getChildByName('net')
    const mask = net.getChildByName('mask')

    if (boat.netDown) net.vy = net.speed
    else if (boat.netUp && net.y > 0) net.vy = -net.speed
    else net.vy = 0

    gsap.to(net, { y: `+=${net.vy}` })
    //if (boat.netUp && net.y <= 0 && world.y < 0) {
    //    gsap.to(world, { y: `+=${net.speed}` })
    //}
    if ((boat.netUp && net.getGlobalPosition().y < world.boundary) ||
        (boat.netDown && net.getGlobalPosition().y > innerHeight - mask.height - world.boundary)) {
        gsap.to(world, { y: `-=${net.vy}` })
    }
}

function updateTime() {
    time -= app.ticker.elapsedMS / 1000
    if (time < 0) time = 0
    let minutes = Math.floor(time / 60)
    let seconds = Math.round(time - 60 * minutes)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    const timeMeter = document.querySelector('#time-meter').contentDocument
    timeMeter.querySelector('#time').innerHTML = `${minutes}:${seconds}`
    gsap.to(timeMeter.querySelector('#gauge'), {
        attr: { width: 220 * time / 90 }
    })
}

export { world, horizon, gameLoop, createBoundary, addControls }
