import * as PIXI from 'pixi.js'
import { fishes } from './fish'

const world = new PIXI.Container()

world.addChild(fishes)

function gameLoop(deltaTime) {
    const sea = world.getChildByName('sea')
    for (const fish of fishes.children) {
        fish.position.x += deltaTime
        if (fish.position.x - fish.width / 2 > sea.width) fish.position.x = -fish.width / 2
    }
}

function refactor() {
    fishes.zIndex = 10
    world.sortChildren()

    const mask = new PIXI.Graphics();
    const sea = world.getChildByName('sea')
    mask.beginFill(0xFF3300);
    mask.drawRect(0, 0, sea.width, sea.height);
    mask.endFill();

    fishes.mask = mask
}

export { world, gameLoop, refactor }
