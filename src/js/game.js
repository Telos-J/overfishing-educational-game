import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { resetFishes, controlFishes, addFishes } from './fish'
import { updateNet } from './boat'
import { app } from './app'

const world = new PIXI.Container(),
    _width = 1920,
    _height = 5760,
    horizon = 400,
    menu = document.querySelector('#hamburger-menu'),
    drawer = document.querySelector('#drawer'),
    resumeButton = document.querySelector('#resume-button'),
    resetButton = document.querySelector('#reset-button'),
    nextLevelButton = document.querySelector('#next-level-button'),
    message = document.querySelector('#message')

world.sortableChildren = true

let level = 4
const levels = [
    [40, 50],
    [60, 60],
    [80, 70],
    [100, 80]
]


const status = {
    time: levels[level - 1][1],
    caughtFish: 0,
    coins: 0,
    maxTime: levels[level - 1][1],
    objective: levels[level - 1][0],
    maxCoins: 100,
}


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
    addFishes()
    updateNet()
}

function reset() {
    const boat = world.getChildByName('boat')

    world.y = 0
    boat.net.y = boat.y
    message.style.display = 'none'
    resumeButton.style.display = 'block'
    resetButton.style.display = 'block'
    nextLevelButton.style.display = 'none'

    resetFishes()
    updateTime(status.maxTime)
    updateCaughtFish(0)
    updateCoins(0)
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
    const net = world.getChildByName('net')
    const mask = net.getChildByName('mask')

    if (boat.netDown) net.vy = net.speed
    else if (boat.netUp && net.y > boat.y) net.vy = -net.speed
    else net.vy = 0

    gsap.to(net, { y: `+= ${net.vy}` })
    if ((boat.netUp && net.getGlobalPosition().y < world.boundary) ||
        (boat.netDown && net.getGlobalPosition().y > innerHeight - mask.height - world.boundary)) {
        gsap.to(world, { y: `-= ${net.vy}` })
    }
}

function updateTime(time) {
    if (!time) status.time -= 1 / 60
    else status.time = time

    if (status.time < 0) status.time = 0
    let minutes = Math.floor(status.time / 60)
    let seconds = Math.round(status.time - 60 * minutes)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    const timeMeter = document.querySelector('#time-meter').contentDocument
    timeMeter.querySelector('#time').innerHTML = `${minutes}: ${seconds}`
    gsap.to(timeMeter.querySelector('#gauge'), {
        attr: { width: 220 * status.time / status.maxTime }
    })

    if (status.time === 0 && status.caughtFish < status.objective) gameOver()
}

function updateCaughtFish(caughtFish) {
    status.caughtFish = caughtFish
    const fishMeter = document.querySelector('#fish-meter').contentDocument
    fishMeter.querySelector('#caught').innerHTML = `${status.caughtFish}/${status.objective}`
    gsap.to(fishMeter.querySelector('#gauge'), {
        attr: { width: 220 * status.caughtFish / status.objective }
    })

    if (status.caughtFish === status.objective) showObjective(levels[level][0], levels[level][1])
}

function updateCoins(coins) {
    status.coins = coins
    const coinMeter = document.querySelector('#coin-meter').contentDocument
    coinMeter.querySelector('#coin').innerHTML = status.coins
    gsap.to(coinMeter.querySelector('#gauge'), {
        attr: { width: 220 * status.coins / status.maxCoins }
    })
}

function openDrawer() {
    gsap.to(drawer, 0.2, { x: 0, display: 'flex' })
    app.ticker.stop()
    app.view.classList.add('inactive')
}

function closeDrawer() {
    const style = getComputedStyle(drawer)
    gsap.to(drawer, 0.2, { x: `-${style.getPropertyValue('width')}`, display: 'none' })
    app.ticker.start()
    app.view.classList.remove('inactive')
}

function showObjective(objective, time) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.round(time - 60 * minutes)

    nextLevelButton.style.display = 'block'
    message.style.display = 'block'
    message.querySelector('#phrase').innerHTML = 'Good Job!'
    message.querySelector('#content').innerHTML = `Catch ${objective} fish in ${minutes} minutes`
    if (parseInt(seconds) > 0) message.querySelector('#content').innerHTML += ` ${seconds} seconds`

    openDrawer()
}

function gameOver() {
    resumeButton.style.display = 'none'
    nextLevelButton.style.display = 'none'
    message.style.display = 'block'
    message.querySelector('#phrase').innerHTML = 'Game Over'
    message.querySelector('#objective').style.display = 'none'

    openDrawer()
}

function handleClickAnimation(button, callback) {
    const span = button.querySelector('span')
    if (span.classList.contains('running')) return

    animateButton(span)
    window.setTimeout(() => {
        animateButton(span)
        callback()
    }, 1000)
}

function animateButton(span) {
    const text = span.dataset.text
    span.dataset.text = span.innerHTML
    span.innerHTML = text
    span.classList.contains('running') ? span.classList.remove('running') : span.classList.add('running')
}

function goToNextLevel() {
    status.time = levels[level][1]
    status.caughtFish = 0
    status.coins = 0
    status.maxTime = levels[level][1]
    status.objective = levels[level][0]
    status.maxCoins = 100
    if (level < levels.length) level++
}

menu.addEventListener('click', () => {
    if (gsap.isTweening(drawer)) return

    const style = getComputedStyle(drawer)
    if (style.getPropertyValue('display') === 'none') openDrawer()
    //else closeDrawer()
})

resumeButton.addEventListener('click', () => {
    handleClickAnimation(resumeButton, closeDrawer)
})

resetButton.addEventListener('click', () => {
    handleClickAnimation(resetButton, () => {
        reset()
        closeDrawer()
    })
})

nextLevelButton.addEventListener('click', () => {
    handleClickAnimation(nextLevelButton, () => {
        goToNextLevel()
        reset()
        closeDrawer()
    })
})


export { world, horizon, gameLoop, createBoundary, addControls, status, updateCaughtFish, updateCoins }
