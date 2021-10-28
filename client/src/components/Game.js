import { useEffect, useRef } from 'react'
import { startGame } from '../game/app'

export default function Sim() {
    const canvas = useRef()

    useEffect(() => {
        startGame(canvas.current)
    }, [])

    return <canvas ref={canvas} id="sim" />
}
