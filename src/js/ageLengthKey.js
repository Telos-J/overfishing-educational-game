import { schoolingfishes } from './schoolingfish'

function resetAgeLengthKey() {
    const ageLengthKey = document.querySelector('#age-length-key')

    for (let row = 1; row <= 12; row++) {
        for (let col = 1; col <= 11; col++) {
            const cell = ageLengthKey.querySelector(`#data${row}-${col} tspan`)
            cell.innerHTML = ''
        }
    }
}

function updateAgeLengthKey() {
    const ageLengthKey = document.querySelector('#age-length-key')

    resetAgeLengthKey()

    for (const fish of schoolingfishes.children) {
        const col = fish.age + 1
        const row = Math.ceil((fish.length - 60) * 0.2)
        const cell = ageLengthKey.querySelector(`#data${row}-${col} tspan`)
        if (!cell.innerHTML) cell.innerHTML = '  1'
        else {
            cell.innerHTML = parseInt(cell.innerHTML) + 1
            cell.innerHTML = ' '.repeat(3 - cell.innerHTML.length) + cell.innerHTML
        }
    }
}

export { updateAgeLengthKey }
