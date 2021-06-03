import * as PIXI from 'pixi.js'

const loader = PIXI.Loader.shared

loader.add('fish', 'img/fish.png')
    .add('sea', 'img/sea.png')
    .add('bigCloud1', 'img/big-cloud1.png')
    .add('bigCloud2', 'img/big-cloud2.png')
    .add('bigCloud3', 'img/big-cloud3.png')
    .add('smallCloud1', 'img/small-cloud1.png')
    .add('smallCloud2', 'img/small-cloud2.png')
    .add('smallCloud3', 'img/small-cloud3.png')
    .add('smallCloud4', 'img/small-cloud4.png')
    .add('smallCloud5', 'img/small-cloud5.png')
    .add('boat', 'img/boat.png')
    .add('net', 'img/net.png')

loader.onProgress.add(handleProgress)

function handleProgress(loader, resource) {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}

export { loader }
