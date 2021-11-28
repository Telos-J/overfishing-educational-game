import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { openCurtain, closeCurtain } from './curtain'
import { gameStatus } from './game'
import { schoolingfishes } from './schoolingfish'

gsap.registerPlugin(MotionPathPlugin)

const chartTimeline = gsap.timeline()
const chartIcon = document.querySelector('#chart-icon')

chartIcon.addEventListener('click', () => {
    const rect = curtain.getBoundingClientRect()
    if (gsap.isTweening(curtain)) return
    if (rect.top < -rect.height / 2) openCurtain()
    else closeCurtain()
})

function setupChart() {
    const populationGraph = document.querySelector('#population-graph')
    const curve = populationGraph.querySelector('#population-curve')
    const pointer = populationGraph.querySelector('#pointer')
    chartTimeline.to(pointer, {
        duration: 3,
        ease: 'none',
        motionPath: {
            path: curve,
            align: curve,
            alignOrigin: [0.1, 0.7],
            start: 1,
            end: 0,
        },
    })
}

function updateChart() {
    const populationGraph = document.querySelector('#population-graph')
    const harvest = populationGraph.querySelector('#harvest')
    const harvestRate = harvest.querySelector('#harvest-rate')
    const numFish = populationGraph.querySelector('#numFish')

    let caughtPerSec = gameStatus.biomass / (gameStatus.maxTime - gameStatus.time)
    caughtPerSec = Math.round(caughtPerSec * 100) / 100

    harvestRate.innerHTML = caughtPerSec
    let y = -244 * caughtPerSec + 3
    if (y < -180) y = -180
    gsap.set(harvest, { y })

    numFish.innerHTML = schoolingfishes.children.length
    chartTimeline.progress(schoolingfishes.children.length / schoolingfishes.k)
}

function updateLF() {
    const LF = document.querySelector('#length-frequency-distribution')
    for (let i = 1; i <= 12; i++) {
        const number = LF.querySelector(`#number${i}`)
        const rect = LF.querySelector(`#rectangle${i}`)
        gsap.to(rect, { scaleY: gameStatus.LF[i - 1] / 30, transformOrigin: 'bottom' })
    }
}

export { setupChart, updateChart, updateLF }
