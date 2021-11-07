import * as PIXI from 'pixi.js'

class Species extends PIXI.Container {
    constructor({ num, r, k, name, className }) {
        super()
        this.num = num
        this.r = r
        this.k = k
        this.name = name
        this.className = className
    }
}

export { Species }
