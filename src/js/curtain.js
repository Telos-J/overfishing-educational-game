import { app } from './app'
import { handleClickAnimation } from './button'
import { closeDrawer } from './drawer'
import { nextYear } from './game'
import { animateLF } from './lengthFrequencyChart'

const curtain = document.querySelector('#curtain')
const nextYearButton = document.querySelector('#next-year-button')
const chartIcon = document.querySelector('#chart-icon')
const drawer = document.querySelector('#drawer')

function openCurtain() {
    if (drawer.classList.contains('open')) closeDrawer()
    curtain.classList.add('open')
    app.ticker.stop()
    app.view.classList.add('inactive')
    animateLF()
}

function closeCurtain() {
    curtain.classList.remove('open')
    app.ticker.start()
    app.view.classList.remove('inactive')
}

chartIcon.addEventListener('click', () => {
    if (curtain.classList.contains('open')) closeCurtain()
    else openCurtain()
})

nextYearButton.addEventListener('click', () => {
    handleClickAnimation(nextYearButton, () => {
        closeCurtain()
        nextYear()
    })
})

export { openCurtain, closeCurtain }
