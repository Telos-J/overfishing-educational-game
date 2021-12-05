import { schoolingfishes } from './schoolingfish'

function updateAgeLengthKey() {
    const ageLengthKey = document.querySelector('#age-length-key')

    for (const fish of schoolingfishes.children) {
        const column = fish.age + 1
        const row = Math.ceil((fish.length - 60) * 0.2)
        const cell = ageLengthKey.querySelector(`#data${row}-${column} tspan`)
        if (!cell.innerHTML) cell.innerHTML = '  1'
        else {
            cell.innerHTML = parseInt(cell.innerHTML) + 1
            cell.innerHTML = ' '.repeat(3 - cell.innerHTML.length) + cell.innerHTML
        }
    }
}

export { updateAgeLengthKey }
