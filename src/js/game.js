import * as PIXI from 'pixi.js'
import { moveFishes } from './fish'

const world = new PIXI.Container(),
    _width = 1920,
    _height = 5760,
    horizon = 400

function createBoundary() {
    const boundary = new PIXI.Graphics()
    boundary.beginFill(0x49536a);
    boundary.drawRect(0, 0, _width, _height);
    boundary.endFill();
    boundary.name = 'boundary'
    world.addChild(boundary)
}

function gameLoop(deltaTime) {
    moveFishes(deltaTime)
}

export { world, gameLoop, createBoundary, horizon }
