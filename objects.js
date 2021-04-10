class SimpleObject {
    constructor(frame) {
        this.frame = frame;
        this.x = 0;
        this.y = 0;
        this.width = frame.width;
        this.height = frame.height;
    }

    draw() {
        context.drawImage(
            this.frame.img,
            this.frame.x,
            this.frame.y,
            this.frame.width,
            this.frame.height,
            this.x,
            this.y,
            this.width,
            this.height,
        )
    }
}

class Boat {
    constructor() {
        this.body = new SimpleObject(assets.frameSets.body.frames[0])
        this.cabin = new SimpleObject(assets.frameSets.cabin.frames[0])
        this.net = new SimpleObject(assets.frameSets.net.frames[0])
        this.net.speed = 0;
        this.resize();
        this.caughtFish = [];
    }

    toWindowCoord(coord) {
        return coord * canvas.width / this.net.frame.width;
    }

    resize() {
        for (let part of [this.body, this.cabin, this.net]) {
            part.width = canvas.width;
            part.height = this.toWindowCoord(part.frame.height);
        }
        this.net.anchors = [this.toWindowCoord(837), this.toWindowCoord(956)]
    }

    draw() {
        this.body.draw();
        this.cabin.draw();
        this.net.draw();
        this.drawAnchors();
    }

    drawAnchors() {
        const y = this.net.y + this.toWindowCoord(363);
        context.strokeStyle = '#135c77';
        context.lineWidth = 3;

        context.beginPath()
        context.moveTo(this.net.anchors[0], sealevel)
        context.lineTo(this.net.anchors[0], y)
        context.stroke()

        context.beginPath()
        context.moveTo(this.net.anchors[1], sealevel)
        context.lineTo(this.net.anchors[1], y)
        context.stroke()

    }

    update() {
        const caughtFish = [];
        this.net.y += this.net.speed;
        if (this.net.y < -this.toWindowCoord(140)) this.net.y = -this.toWindowCoord(140);

        for (let fish of fishes) {
            if (this.collideNet(fish) && this.net.y >= -this.toWindowCoord(140)) {
                fish.position.y += this.net.speed
                if (fish.position.y < sealevel) caughtFish.push(fish);
            }
        }

        if (caughtFish.length) {
            this.caughtFish.push(...caughtFish)
            fishes = fishes.filter((fish) => !caughtFish.includes(fish))
            numFishes = fishes.length;
            console.log(this.caughtFish.length)
        }

    }

    lowerNet() {
        this.net.speed = 3;
    }

    raiseNet() {
        this.net.speed = -3;
    }

    haltNet() {
        this.net.speed = 0;
    }

    collideNet(fish) {
        if (fish.position.y > this.net.y + this.toWindowCoord(386) &&
            fish.position.y < this.net.y + this.toWindowCoord(503) &&
            fish.position.x > this.toWindowCoord(761) &&
            fish.position.x < this.toWindowCoord(909)
        ) return true
    }
}

class Sky {
    constructor() {
        this.frameSet = assets.frameSets.sky;
        this.frameIndex = 0;
    }

    draw() {
        const frame = this.frameSet.frames[this.frameIndex];

        context.drawImage(
            frame.img,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            0,
            0,
            canvas.width,
            canvas.width * skyHeight / skyWidth
        )
        this.frameIndex++
        if (this.frameIndex >= this.frameSet.frames.length)
            this.frameIndex = 0
    }
}

class Sea {
    constructor() {
        this.frameSet = assets.frameSets.sea;
        this.frameIndex = 0;
    }

    draw() {
        const frame = this.frameSet.frames[this.frameIndex];

        context.drawImage(
            frame.img,
            frame.x,
            frame.y,
            frame.width,
            frame.width * canvas.height / canvas.width,
            0,
            canvas.width * skyHeight / skyWidth,
            canvas.width,
            canvas.height - canvas.width * skyHeight / skyWidth
        )
    }
}
