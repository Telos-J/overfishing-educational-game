import * as PIXI from 'pixi.js'
import fish from '../images/fish.png'
import jellyfish from '../images/jellyfish.png'
import turtle from '../images/turtle.png'
import sea from '../images/sea.png'
import bigCloud1 from '../images/big-cloud1.png'
import bigCloud2 from '../images/big-cloud2.png'
import bigCloud3 from '../images/big-cloud3.png'
import smallCloud1 from '../images/small-cloud1.png'
import smallCloud2 from '../images/small-cloud2.png'
import smallCloud3 from '../images/small-cloud3.png'
import smallCloud4 from '../images/small-cloud4.png'
import smallCloud5 from '../images/small-cloud5.png'
import boat from '../images/boat.png'
import coin from '../images/coin.png'

const loader = PIXI.Loader.shared

loader.add('fish', fish)
    .add('jellyfish', jellyfish)
    .add('turtle', turtle)
    .add('sea', sea)
    .add('bigCloud1', bigCloud1)
    .add('bigCloud2', bigCloud2)
    .add('bigCloud3', bigCloud3)
    .add('smallCloud1', smallCloud1)
    .add('smallCloud2', smallCloud2)
    .add('smallCloud3', smallCloud3)
    .add('smallCloud4', smallCloud4)
    .add('smallCloud5', smallCloud5)
    .add('boat', boat)
    .add('coin', coin)

loader.onProgress.add(handleProgress)

function handleProgress(loader, resource) {
    // const loadingBar = document.querySelector('#loading-bar-inner')
    // loadingBar.style.width = loader.progress + '%'
    console.log("progress: " + loader.progress + "%");
}

export { loader }
