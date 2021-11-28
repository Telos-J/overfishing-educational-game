import { gsap } from 'gsap'
import { resetFishes, controlFishes } from './fish'
import { app } from './app'
import { openCurtain } from './curtain'
import { updateChart } from './chart'
import { addFishes } from './fish'
import { schoolingfishes, spawnSchoolingfishes } from './schoolingfish'
import { jellyfishes, spawnJellyfishes } from './jellyfish'
import { turtles, spawnTurtles } from './turtle'
import { setupChart } from './chart'
import World from './world'
import Boat from './boat'
import Net from './net'

let level = 1
const levels = [{ catchGoal: 40 }, { catchGoal: 60 }, { catchGoal: 80 }, { catchGoal: 100 }]

const gameStatus = {
    time: 10,
    biomass: 0,
    coins: 100,
    maxTime: 60,
    objective: levels[level - 1].catchGoal,
    maxCoins: 200,
    prevCoins: 0,
    netSize: 6,
    netSpeed: 2,
    fishing: true,
    LF: new Array(13).fill(0),
}

function startGame() {
    const world = new World()
    app.stage.addChild(world)

    const boat = new Boat()
    boat.name = 'boat'
    boat.dispatch(world)

    const net = new Net()
    boat.addNet(net)

    spawnSchoolingfishes(world)
    //spawnJellyfishes(world)
    //spawnTurtles(world)

    addControls()
    updateCaughtFish()
    updateCoins()
    setupChart()
    app.ticker.add(gameLoop)
    setInterval(() => {
        if (gameStatus.fishing) {
            addFishes(schoolingfishes)
            //addFishes(jellyfishes)
            //addFishes(turtles)
        }
    }, 1000)
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
    const boat = world.getChildByName('boat')
    const net = boat.net

    world.y = 0
    net.reset()
    resetFishes(schoolingfishes)
    resetFishes(jellyfishes)
    resetStatus()

    upgradeSizeButton.querySelector('#capacity').innerHTML = net.capacity
    upgradeSizeButton.querySelector('#cost #value').innerHTML = net.cost * 2 ** (net.size - 6)
    upgradeSpeedButton.querySelector('#speed').innerHTML = net.speed
    upgradeSpeedButton.querySelector('#cost #value').innerHTML =
        net.cost * 2 ** ((net.speed - 20) / 5)
}

function addControls() {
    const keyCodes = ['ArrowDown', 'ArrowUp']
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    boat.netDown = false
    boat.netUp = false

    addEventListener('keydown', e => {
        if (keyCodes.includes(e.code)) e.preventDefault()

        if (e.code === 'ArrowDown') {
            boat.netDown = true
            boat.netUp = false
        } else if (e.code === 'ArrowUp') {
            boat.netDown = false
            boat.netUp = true
        }
    })

    addEventListener('keyup', e => {
        if (keyCodes.includes(e.code)) e.preventDefault()

        if (e.code === 'ArrowDown') boat.netDown = false
        else if (e.code === 'ArrowUp') boat.netUp = false
    })
}

function updateTime(time) {
    if (!time) gameStatus.time -= 1 / 60
    else gameStatus.time = time

    if (gameStatus.time < 0) gameStatus.time = 0
    let minutes = Math.floor(gameStatus.time / 60)
    let seconds = Math.round(gameStatus.time - 60 * minutes)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    const timeMeter = document.querySelector('#time-meter').contentDocument
    timeMeter.querySelector('#time').innerHTML = `${minutes}: ${seconds}`
    gsap.to(timeMeter.querySelector('#gauge'), {
        attr: { width: (220 * gameStatus.time) / gameStatus.maxTime },
    })

    if (gameStatus.time === 0 && gameStatus.fishing) endYear()
}

function updateCaughtFish(biomass) {
    if (biomass) gameStatus.biomass = biomass
    const fishMeter = document.querySelector('#fish-meter').contentDocument
    fishMeter.querySelector('#caught').innerHTML = `${Math.round(gameStatus.biomass)}/${
        gameStatus.objective
    }kg`
    gsap.to(fishMeter.querySelector('#gauge'), {
        attr: { width: (220 * gameStatus.biomass) / gameStatus.objective },
    })
}

function updateCoins(coins) {
    if (coins > gameStatus.maxCoins) return
    if (coins) gameStatus.coins = coins
    const coinMeter = document.querySelector('#coin-meter').contentDocument
    coinMeter.querySelector('#coin').innerHTML = `${gameStatus.coins}/${gameStatus.maxCoins}`
    gsap.to(coinMeter.querySelector('#gauge'), {
        attr: { width: (220 * gameStatus.coins) / gameStatus.maxCoins },
    })
}

function updateLF(length) {
    gameStatus.LF[Math.floor((length - 0.6) * 20)]++
}

function endYear() {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat')
    const net = boat.net

    gameStatus.fishing = false

    gsap.to(world, { y: 0, duration: 1 })
    gsap.to(net, {
        y: net.offset.y,
        duration: 1,
        onComplete: () => {
            openCurtain()
            //gsap.to(boat, { x: world.width + boat.width, duration: 3 })
        },
    })
}

function nextYear() {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    const net = boat.net
    gameStatus.fishing = true
    gameStatus.time = gameStatus.maxTime
    gameStatus.biomass = 0
    gameStatus.objective = levels[level].catchGoal
    gameStatus.prevCoins = gameStatus.coins
    gameStatus.netSize = net.size
    gameStatus.netSpeed = net.speed
    net.reset()
    updateTime(gameStatus.maxTime)
    updateCaughtFish(0)
    if (level < levels.length) level++
}

function resetStatus() {
    updateTime(gameStatus.maxTime)
    updateCaughtFish(0)
    updateCoins(gameStatus.prevCoins)
}

export {
    startGame,
    gameLoop,
    addControls,
    gameStatus,
    updateCaughtFish,
    updateCoins,
    reset,
    resetStatus,
    nextYear,
}
