import { gsap } from 'gsap'
import { handleClickAnimation } from './button'
import { nextYear } from './game'
import { updateLF } from './chart'

const curtain = document.querySelector('#curtain')
const nextYearButton = document.querySelector('#next-year-button')

function openCurtain() {
    gsap.to(curtain, { y: 0, duration: 0.2 })
    updateLF()
}

function closeCurtain() {
    const style = getComputedStyle(curtain)
    gsap.to(curtain, { y: `-${style.getPropertyValue('height')}`, duration: 0.2 })
}

nextYearButton.addEventListener('click', () => {
    handleClickAnimation(nextYearButton, () => {
        closeCurtain()
        nextYear()
    })
})

export { openCurtain, closeCurtain }
