import { app } from './app'
import { handleClickAnimation } from './button'
import { closeDrawer } from './drawer'
import { nextYear } from './game'
import { animateLF, applySelectivity } from './lengthFrequencyGraph'
import { updateAgeLengthKey, calculatePercentage, applyAgeLengthKey } from './ageLengthKey'
import { updateAF } from './ageFrequencyGraph'

const curtain = document.querySelector('#curtain')
const nextYearButton = document.querySelector('#next-year-button')
const chartIcon = document.querySelector('#chart-icon')
const drawer = document.querySelector('#drawer')
const applySelectivityButton = document.querySelector('#apply-selectivity')

function openCurtain() {
    if (drawer.classList.contains('open')) closeDrawer()
    curtain.classList.add('open')
    app.ticker.stop()
    app.view.classList.add('inactive')
    animateLF()
    // updateAgeLengthKey()
    // updateAF()
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

applySelectivityButton.addEventListener('click', () => {
  const LF = applySelectivity()
  calculatePercentage()
  applyAgeLengthKey(LF)
})

export { openCurtain, closeCurtain }
