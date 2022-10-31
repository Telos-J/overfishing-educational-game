import { schoolingfishes } from './schoolingfish'
import { gameStatus } from './gameStatus'
import { animateAF } from './ageFrequencyGraph'

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

function calculatePercentage() {
  const ageLengthKey = document.querySelector('#age-length-key')

  for (let row = 1; row <= 12; row++) {
    let rowSum = 0
    for (let col = 1; col <= 11; col++) {
      const cellValue = parseInt(ageLengthKey.querySelector(`#data${row}-${col} tspan`).innerHTML)
      if (cellValue) rowSum += cellValue
    }

    for (let col = 1; col <= 11; col++) {
      const cellValue = parseInt(ageLengthKey.querySelector(`#data${row}-${col} tspan`).innerHTML) 
      if (cellValue) 
        ageLengthKey.querySelector(`#data${row}-${col} tspan`).innerHTML = `${Math.round(cellValue / rowSum * 100)}%`
    }
  }
}

function applyAgeLengthKey(LF) {
  const ageLengthKey = document.querySelector('#age-length-key')
  const AF = new Array(11).fill(0)

  for (let col = 1; col <= 11; col++) {
    let colSum = 0
    for (let row = 1; row <= 12; row++) {
      const cellValue = ageLengthKey.querySelector(`#data${row}-${col} tspan`).innerHTML
      if (cellValue) colSum += (LF[row - 1] * parseInt(cellValue.slice(0, -1)) * 0.01)
    }
    AF[col - 1] = Math.round(colSum)
  }

  animateAF(AF)
}

export { updateAgeLengthKey, calculatePercentage, applyAgeLengthKey }
