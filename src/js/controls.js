import { gameStatus } from './gameStatus'

function addControls(app) {
    const keyCodes = ['ArrowDown', 'ArrowUp']
    const world = app.stage.getChildByName('world')
    const boat = world.getChildByName('boat', true)
    boat.netDown = false
    boat.netUp = false

    addEventListener('keydown', e => {
        if (keyCodes.includes(e.code)) e.preventDefault()

        if (!gameStatus.fishing) {
            boat.netDown = false
            boat.netUp = false
            return
        }

        if (e.code === 'ArrowDown') {
            boat.netDown = true
            boat.netUp = false
        } else if (e.code === 'ArrowUp') {
            boat.netDown = false
            boat.netUp = true
        }
    })

    addEventListener('keyup', e => {
        if (keyCodes.includes(e.code)) e.preventDefault()

        if (e.code === 'ArrowDown') boat.netDown = false
        else if (e.code === 'ArrowUp') boat.netUp = false
    })
}

export { addControls }
