import { gsap } from 'gsap'
import { gameStatus } from './gameStatus'
import { schoolingfishes } from './schoolingfish'

const AF = document.querySelector('#age-frequency-distribution')
const curtain = document.querySelector('#curtain')

function updateAF() {
    gameStatus.AF.fill(0)

    for (const fish of schoolingfishes.children) {
        gameStatus.AF[fish.age]++
    }

    animateAF()
}

function animateAF() {
    for (let i = 1; i <= 11; i++) {
        const rect = AF.querySelector(`#rectangle${i}`)
        gsap.to(rect, { scaleY: gameStatus.AF[i - 1] / 30, transformOrigin: 'bottom' })
    }
}

export { updateAF, animateAF }
