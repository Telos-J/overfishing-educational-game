import * as PIXI from 'pixi.js'

const loader = PIXI.Loader.shared

loader.add('fish', 'img/fish.png')
    .add('sea', 'img/sea.png')

loader.onProgress.add(handleProgress)

function handleProgress(loader, resource) {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}

export { loader }
