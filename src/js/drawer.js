import { app } from './app'
import { handleClickAnimation } from './button'
import { closeCurtain } from './curtain'
import { reset } from './game'
import './shop'

const menu = document.querySelector('#hamburger-menu')
const drawer = document.querySelector('#drawer')
const resumeButton = document.querySelector('#resume-button')
const resetButton = document.querySelector('#reset-button')
const nextLevelButton = document.querySelector('#next-level-button')
const curtain = document.querySelector('#curtain')

function openDrawer() {
    if (curtain.classList.contains('open')) closeCurtain()
    drawer.classList.add('open')
    app.ticker.stop()
    app.view.classList.add('inactive')
}

function closeDrawer() {
    drawer.classList.remove('open')
    app.ticker.start()
    app.view.classList.remove('inactive')
}

menu.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeDrawer()
    else openDrawer()
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
