import { gsap } from 'gsap'
import { resetFishes, controlFishes } from './fish'
import { app } from './app'
import { openCurtain } from './curtain'
import { addFishes } from './fish'
import { setupPopulationGraph, updatePopulationGraph } from './populationGraph'
import { schoolingfishes, spawnSchoolingfishes } from './schoolingfish'
import { jellyfishes, spawnJellyfishes } from './jellyfish'
import { turtles, spawnTurtles } from './turtle'
import { addControls } from './controls'
import {
    levels,
    gameStatus,
    updateCaughtFish,
    updateCoins,
    updateTime,
    resetStatus,
} from './gameStatus'
import World from './world'
import Boat from './boat'
import Net from './net'
import { updateAgeLengthKey } from './ageLengthKey'

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

    updateAgeLengthKey()

    addControls(app)
    updateCaughtFish()
    updateCoins()
    setupPopulationGraph()
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
    updatePopulationGraph()
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

function endYear() {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat')
    const net = boat.net

    gameStatus.fishing = false

    for (const fish of net.fishes) {
        fish.release()
    }

    gsap.to(world, { y: 0, duration: 1 })
    gsap.to(net, {
        y: net.offset.y,
        duration: 1,
        onComplete: () => {
            setTimeout(openCurtain, 1000)
            boat.leave(world)
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
    gameStatus.prevCoins = gameStatus.coins
    gameStatus.netSize = net.size
    gameStatus.netSpeed = net.speed
    net.reset()
    updateTime(gameStatus.maxTime)
    updateCaughtFish(0)
    boat.enter(world)
    if (gameStatus.level < levels.length) gameStatus.level++
}

export { startGame, gameLoop, reset, nextYear, endYear }
