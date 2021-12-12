import { gsap } from 'gsap'
import { endYear } from './game'

const levels = [{ catchGoal: 40 }, { catchGoal: 60 }, { catchGoal: 80 }, { catchGoal: 100 }]

const gameStatus = {
    level: 1,
    time: 60,
    biomass: 0,
    coins: 100,
    maxTime: 60,
    objective: 100,
    maxCoins: 200,
    prevCoins: 0,
    netSize: 6,
    netSpeed: 2,
    fishing: true,
    LF: new Array(13).fill(0),
    AF: new Array(11).fill(0),
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

function resetStatus() {
    updateTime(gameStatus.maxTime)
    updateCaughtFish(0)
    updateCoins(gameStatus.prevCoins)
}

export { levels, gameStatus, updateCaughtFish, updateCoins, updateTime, resetStatus }
