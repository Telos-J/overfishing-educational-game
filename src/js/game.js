import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { controlFishes } from './fish'
import { updateNet } from './boat'
import { app } from './app'

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
    const net = boat.getChildByName('net')

    if (boat.netDown) net.vy = net.speed
    else if (boat.netUp && net.position.y > 0) net.vy = -net.speed
    else net.vy = 0

    gsap.to(net, { y: `+=${net.vy}` })
}

function updateTime() {
    time -= app.ticker.elapsedMS / 1000
    if (time < 0) time = 0
    let minutes = Math.floor(time / 60)
    let seconds = Math.round(time - 60 * minutes)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    document.querySelector('#time').innerHTML = `${minutes}:${seconds}`
}

export { world, horizon, gameLoop, createBoundary, addControls }
