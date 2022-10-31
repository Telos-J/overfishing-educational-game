import { gsap } from 'gsap'
import { gameStatus } from './gameStatus'

const LFDom = document.querySelector('#length-frequency-distribution')
const curtain = document.querySelector('#curtain')

function updateLF(length) {
  gameStatus.LF[Math.floor((length - 60) * 0.2)]++
  if (curtain.classList.contains('open')) animateLF()
}

function animateLF(LF) {
  if (!LF) LF = gameStatus.LF

  for (let i = 1; i <= 12; i++) {
      const number = LFDom.querySelector(`#number${i}`)
      const rect = LFDom.querySelector(`#rectangle${i}`)
      gsap.to(rect, { scaleY: LF[i - 1] / Math.max(...LF, 30), transformOrigin: 'bottom' })
  }
}

function applySelectivity() {
  const LF = gameStatus.LF.map((number, i) => {
    const length = i * 5 + 60
    return number * (1 + Math.E ** (10.3 - 0.12 * length))
  })
  animateLF(LF)

  return LF
}

export { updateLF, animateLF, applySelectivity }
