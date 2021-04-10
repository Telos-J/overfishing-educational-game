class Assets {
    constructor() {
        this.frameSets = {};
    }

    addFrameSets(...frameSets) {
        for (let frameSet of frameSets) {
            this.frameSets[frameSet[0]] = frameSet[1];
        }
    }

    loadFrameSets() {
        const frameSets = [];
        for (let frameSet in this.frameSets) {
            frameSets.push(this.frameSets[frameSet].loadFrameSet());
        }

        return Promise.all(frameSets)
    }

    loadAssets() {
        const assets = [];
        assets.push(this.loadFrameSets());

        return Promise.all(assets)
    }
}

class Frame {
    constructor(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class FrameSet {
    constructor(prefix, extension, numFrames = 1) {
        this.frames = [];
        this.prefix = prefix;
        this.extension = extension;
        this.numFrames = numFrames;
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (err) => reject(err));
            img.src = url;
        });
    }

    loadFrameSet() {
        const imgs = [];
        const self = this;
        for (let i = 0; i < this.numFrames; i++) {
            const url = this.prefix + i + '.' + this.extension;
            imgs.push(this.loadImage(url))
        }

        const frameSet = Promise.all(imgs)
        frameSet.then(imgs => {
            for (let img of imgs) {
                const frame = new Frame(img, 0, 0, img.width, img.height)
                self.frames.push(frame)
            }
            console.log("Frameset loaded")
        })

        return frameSet
    }
}

const assets = new Assets();
assets.addFrameSets(
    ["schoolingFish", new FrameSet('assets/img/schoolingFish/fish', 'png')],
    ["sky", new FrameSet('assets/img/sky/sky', 'png', 900)],
    ["boulder", new FrameSet('assets/img/boulder', 'png')],
    ["sea", new FrameSet('assets/img/sea', 'png')],
    ["body", new FrameSet('assets/img/body', 'png')],
    ["cabin", new FrameSet('assets/img/cabin', 'png')],
    ["net", new FrameSet('assets/img/net', 'png')],
)
