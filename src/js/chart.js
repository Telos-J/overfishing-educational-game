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
    const graph = document.querySelector('#graph')
    const curve = graph.querySelector('#population-curve')
    const pointer = graph.querySelector('#pointer')
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
    const graph = document.querySelector('#graph')
    const harvest = graph.querySelector('#harvest')
    const harvestRate = harvest.querySelector('#harvest-rate')
    const numFish = graph.querySelector('#numFish')

    let caughtPerSec = gameStatus.caughtFish / (gameStatus.maxTime - gameStatus.time)
    caughtPerSec = Math.round(caughtPerSec * 100) / 100

    harvestRate.innerHTML = caughtPerSec
    let y = -244 * caughtPerSec + 3
    if (y < -180) y = -180
    gsap.set(harvest, { y })

    numFish.innerHTML = schoolingfishes.children.length
    chartTimeline.progress(schoolingfishes.children.length / schoolingfishes.k)
}

export { setupChart, updateChart }
