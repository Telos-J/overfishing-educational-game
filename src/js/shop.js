import { app } from './app'
import { handleClickAnimation, handleErrorAnimation } from './button'
import { gameStatus } from './gameStatus'
import { closeDrawer } from './drawer'
import { updateCoins } from './game'

const shopButton = document.querySelector('#shop-button')
const closeButton = document.querySelector('#close-button')
const shop = document.querySelector('#shop')
const upgradeSizeButton = document.querySelector('#upgrade-size-button')
const upgradeSpeedButton = document.querySelector('#upgrade-speed-button')

function upgradeSize() {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    const net = boat.net
    net.size += 1
    net.resize()
}

function upgradeSpeed() {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    const net = boat.net
    net.speed += 5
}

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
    const boat = world.getChildByName('boat', true)
    const net = boat.net
    if (gameStatus.coins >= net.cost * 2 ** (net.size - 6)) {
        gameStatus.coins -= net.cost * 2 ** (net.size - 7)
        handleClickAnimation(upgradeSizeButton, () => {
            upgradeSize()
            upgradeSizeButton.querySelector('#capacity').innerHTML = net.capacity
            upgradeSizeButton.querySelector('#cost #value').innerHTML =
                net.cost * 2 ** (net.size - 6)
            updateCoins(gameStatus.coins)
        })
    } else {
        handleErrorAnimation(upgradeSizeButton, () => {})
    }
})

upgradeSpeedButton.addEventListener('click', () => {
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    const net = boat.net
    if (gameStatus.coins >= net.cost * 2 ** ((net.speed - 15) / 5)) {
        gameStatus.coins -= net.cost * 2 ** ((net.speed - 20) / 5)
        handleClickAnimation(upgradeSpeedButton, () => {
            upgradeSpeed()
            upgradeSpeedButton.querySelector('#speed').innerHTML = net.speed
            upgradeSpeedButton.querySelector('#cost #value').innerHTML =
                net.cost * 2 ** ((net.speed - 20) / 5)
            updateCoins(gameStatus.coins)
        })
    } else {
        handleErrorAnimation(upgradeSpeedButton, () => {})
    }
})
