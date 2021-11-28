import { gsap } from 'gsap'
import { app } from './app'
import { handleClickAnimation } from './button'
import { reset } from './game'
import './shop'

const menu = document.querySelector('#hamburger-menu')
const drawer = document.querySelector('#drawer')
const resumeButton = document.querySelector('#resume-button')
const resetButton = document.querySelector('#reset-button')
const nextLevelButton = document.querySelector('#next-level-button')

function openDrawer() {
    gsap.to(drawer, { x: 0, display: 'flex', duration: 0.2 })
    app.ticker.stop()
    app.view.classList.add('inactive')
}

function closeDrawer() {
    const style = getComputedStyle(drawer)
    gsap.to(drawer, { x: `-${style.getPropertyValue('width')}`, display: 'none', duration: 0.2 })
    app.ticker.start()
    app.view.classList.remove('inactive')
}

menu.addEventListener('click', () => {
    if (gsap.isTweening(drawer)) return

    const style = getComputedStyle(drawer)
    if (style.getPropertyValue('display') === 'none') openDrawer()
    else closeDrawer()
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

export { openDrawer, closeDrawer }
