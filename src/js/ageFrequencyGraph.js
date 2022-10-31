import { gsap } from 'gsap'
import { gameStatus } from './gameStatus'
import { schoolingfishes } from './schoolingfish'

const AFDom = document.querySelector('#age-frequency-distribution')
const curtain = document.querySelector('#curtain')

function resetAF() {
    gameStatus.AF.fill(0)
    animateAF()
}

function updateAF() {
    resetAF()

    for (const fish of schoolingfishes.children) {
        gameStatus.AF[fish.age]++
    }

    animateAF()
}

function animateAF(AF) {
  if (!AF) AF = gameStatus.AF
  for (let i = 1; i <= 11; i++) {
      const rect = AFDom.querySelector(`#rectangle${i}`)
      gsap.to(rect, { scaleY: AF[i - 1] / Math.max(...AF), transformOrigin: 'bottom' })
  }
}

export { updateAF, animateAF, resetAF }
