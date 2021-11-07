import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { resetFishes, controlFishes } from './fish'
import { schoolingfishes } from './schoolingfish'
import { jellyfishes } from './jellyfish'
import { turtles } from './turtle'
import { app } from './app'

gsap.registerPlugin(MotionPathPlugin);

const menu = document.querySelector('#hamburger-menu'),
    chartIcon = document.querySelector('#chart-icon'),
    drawer = document.querySelector('#drawer'),
    curtain = document.querySelector('#curtain'),
    resumeButton = document.querySelector('#resume-button'),
    resetButton = document.querySelector('#reset-button'),
    nextLevelButton = document.querySelector('#next-level-button'),
    shopButton = document.querySelector('#shop-button'),
    closeButton = document.querySelector('#close-button'),
    upgradeSizeButton = document.querySelector('#upgrade-size-button'),
    upgradeSpeedButton = document.querySelector('#upgrade-speed-button'),
    message = document.querySelector('#message'),
    shop = document.querySelector('#shop')

let level = 1
const levels = [
    [40, 1000],//50],
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
    maxCoins: 200,
    prevCoins: 0,
    netSize: 6,
    netSpeed: 2,
}

function gameLoop(deltaTime) {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    const net = boat.net
    updateTime()
    boat.control()
    controlFishes(schoolingfishes, deltaTime)
    controlFishes(jellyfishes, deltaTime)
    controlFishes(turtles, deltaTime)
    net.update()
    updateChart()
    world.moveCamera()
}

function reset() {
    const world = app.stage.getChildByName('world')
    const net = world.getChildByName('net', true)

    world.y = 0
    net.reset()
    resetFishes(schoolingfishes)
    resetFishes(jellyfishes)
    resetStatus()

    message.style.display = 'none'
    resumeButton.style.display = 'block'
    resetButton.style.display = 'block'
    nextLevelButton.style.display = 'none'
    upgradeSizeButton.querySelector('#capacity').innerHTML = net.capacity
    upgradeSizeButton.querySelector('#cost #value').innerHTML = net.cost * 2 ** (net.size - 6)
    upgradeSpeedButton.querySelector('#speed').innerHTML = net.speed
    upgradeSpeedButton.querySelector('#cost #value').innerHTML = net.cost * 2 ** ((net.speed - 20) / 5)
}

function addControls() {
    const keyCodes = ['ArrowDown', 'ArrowUp']
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    boat.netDown = false
    boat.netUp = false

    addEventListener('keydown', (e) => {
        if (keyCodes.includes(e.code)) e.preventDefault()

        if (e.code === 'ArrowDown') {
            boat.netDown = true
            boat.netUp = false
        } else if (e.code === 'ArrowUp') {
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
    if (caughtFish) status.caughtFish = caughtFish
    const fishMeter = document.querySelector('#fish-meter').contentDocument
    fishMeter.querySelector('#caught').innerHTML = `${status.caughtFish}/${status.objective}`
    gsap.to(fishMeter.querySelector('#gauge'), {
        attr: { width: 220 * status.caughtFish / status.objective }
    })

    if (status.caughtFish === status.objective) showObjective(levels[level][0], levels[level][1])
}

function updateCoins(coins) {
    if (coins > status.maxCoins) return
    if (coins) status.coins = coins
    const coinMeter = document.querySelector('#coin-meter').contentDocument
    coinMeter.querySelector('#coin').innerHTML = `${status.coins}/${status.maxCoins}`
    gsap.to(coinMeter.querySelector('#gauge'), {
        attr: { width: 220 * status.coins / status.maxCoins }
    })
}

function resetStatus() {
    updateTime(status.maxTime)
    updateCaughtFish(0)
    updateCoins(status.prevCoins)
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

function openCurtain() {
    gsap.to(curtain, 0.2, { y: 0 })
}

function closeCurtain() {
    const style = getComputedStyle(curtain)
    gsap.to(curtain, 0.2, { y: `-${style.getPropertyValue('height')}` })
}

function showObjective(objective, time) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.round(time - 60 * minutes)

    nextLevelButton.style.display = 'block'
    shopButton.style.display = 'block'
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

function handleErrorAnimation(button, callback) {
    const span = button.querySelector('span')
    if (span.classList.contains('running')) return

    animateError(span, button)
    window.setTimeout(() => {
        animateError(span, button)
        callback()
    }, 1000)
}


function animateButton(span) {
    const text = span.dataset.text
    span.dataset.text = span.innerHTML
    span.innerHTML = text
    span.classList.contains('running') ? span.classList.remove('running') : span.classList.add('running')
}

function animateError(span, button) {
    const text = span.dataset.error
    span.dataset.error = span.innerHTML
    span.innerHTML = text
    span.classList.contains('running') ? span.classList.remove('running') : span.classList.add('running')
    button.classList.contains('error') ? button.classList.remove('error') : button.classList.add('error')
}

function goToNextLevel() {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    const net = boat.getChildByName('net')

    status.time = levels[level][1]
    status.caughtFish = 0
    status.maxTime = levels[level][1]
    status.objective = levels[level][0]
    status.prevCoins = status.coins
    status.netSize = net.size
    status.netSpeed = net.speed

    world.y = 0
    net.y = boat.y
    resetFishes(schoolingfishes)
    resetFishes(jellyfishes)
    updateTime(status.maxTime)
    updateCaughtFish(0)
    if (level < levels.length) level++

    message.style.display = 'none'
    resumeButton.style.display = 'block'
    resetButton.style.display = 'block'
    nextLevelButton.style.display = 'none'
}

const chartTimeline = gsap.timeline()

function setupChart() {
    const graph = document.querySelector('#graph')
    const curve = graph.querySelector('#population-curve')
    const pointer = graph.querySelector('#pointer')
    chartTimeline
        .to(pointer, {
            duration: 2,
            ease: 'none',
            motionPath:
            {
                path: curve,
                align: curve,
                alignOrigin: [0.08, 0.6],
                start: 1,
                end: 0,
            }
        })
}

function updateChart() {
    const graph = document.querySelector('#graph')
    const harvest = graph.querySelector('#harvest')
    const harvestRate = harvest.querySelector('#harvest-rate')
    const numFish = graph.querySelector('#numFish')

    let caughtPerSec = status.caughtFish / (status.maxTime - status.time)
    caughtPerSec = Math.round(caughtPerSec * 100) / 100

    harvestRate.innerHTML = caughtPerSec
    let y = -244 * caughtPerSec + 3
    if (y < -180) y = -180
    gsap.set(harvest, { y })

    numFish.innerHTML = schoolingfishes.children.length
    chartTimeline.progress(schoolingfishes.children.length / schoolingfishes.k)
}

function upgradeNet() {
    const world = app.stage.getChildByName('world')
    const net = world.getChildByName('net', true)
    net.size += 1
    net.resize()
}

function upgradeSpeed() {
    const world = app.stage.getChildByName('world')
    const net = world.getChildByName('net', true)
    net.speed += 5
}

menu.addEventListener('click', () => {
    if (gsap.isTweening(drawer)) return

    const style = getComputedStyle(drawer)
    if (style.getPropertyValue('display') === 'none') openDrawer()
})

chartIcon.addEventListener('click', () => {
    if (gsap.isTweening(curtain)) return
    if (curtain.getBoundingClientRect().top < 0) openCurtain()
    else closeCurtain()
})

resumeButton.addEventListener('click', () => {
    closeDrawer()
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
        closeDrawer()
    })
})

shopButton.addEventListener('click', () => {
    handleClickAnimation(shopButton, () => {
        shop.classList.add('opened')
        closeDrawer()
        app.ticker.stop()
    })
})

closeButton.addEventListener('click', () => {
    shop.classList.remove('opened')
    app.ticker.start()
})

upgradeSizeButton.addEventListener('click', () => {
    const world = app.stage.getChildByName('world')
    const net = world.getChildByName('net', true)
    if (status.coins >= net.cost * 2 ** (net.size - 6)) {
        status.coins -= net.cost * 2 ** (net.size - 7)
        handleClickAnimation(upgradeSizeButton, () => {
            upgradeNet()
            upgradeSizeButton.querySelector('#capacity').innerHTML = net.capacity
            upgradeSizeButton.querySelector('#cost #value').innerHTML = net.cost * 2 ** (net.size - 6)
            updateCoins(status.coins)
        })
    }
    else {
        handleErrorAnimation(upgradeSizeButton, () => {
        })
    }
})

upgradeSpeedButton.addEventListener('click', () => {
    const world = app.stage.getChildByName('world')
    const net = world.getChildByName('net', true)
    if (status.coins >= net.cost * 2 ** ((net.speed - 15) / 5)) {
        status.coins -= net.cost * 2 ** ((net.speed - 20) / 5)
        handleClickAnimation(upgradeSpeedButton, () => {
            upgradeSpeed()
            upgradeSpeedButton.querySelector('#speed').innerHTML = net.speed
            upgradeSpeedButton.querySelector('#cost #value').innerHTML = net.cost * 2 ** ((net.speed - 20) / 5)
            updateCoins(status.coins)
        })
    }
    else {
        handleErrorAnimation(upgradeSpeedButton, () => {
        })
    }
})

export { gameLoop, addControls, status, updateCaughtFish, updateCoins, setupChart, updateChart, reset, resetStatus }
