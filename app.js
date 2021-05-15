let mode = "play";
let time = 90;
let catchGoal = 40;

const skyWidth = 1920;
const skyHeight = 362;
const sealevel = canvas.width / skyWidth * skyHeight;

let numFishes = 50;
let numSharks = 0;
let fishes = [];
let sharks = [];

const KFish = 50;
const rFish = 0.001;
const KShark = 10;
const rShark = 0.0005;

let boat;
let sky;
let sea;

function displayTime() {
    let minutes = Math.floor(time / 60)
    let seconds = time - 60 * minutes

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    document.querySelector('#time').innerHTML = `${minutes}:${seconds}`
}

async function init() {
    document.querySelector('#loading-bar-inner').classList.add('load')
    await assets.loadAssets();
    document.querySelector('#loading-screen').style.display = 'none'

    for (let i = 0; i < numFishes; i++) {
        const fish = new SchoolingFish();
        fishes.push(fish);
    }

    for (let i = 0; i < numSharks; i++) {
        const shark = new Shark();
        shark.buildShark()
        sharks.push(shark);
    }

    boat = new Boat();
    sky = new Sky();
    sea = new Sea()

    addEventListener('keydown', (e) => {
        if (e.code === 'ArrowDown') boat.lowerNet();
        else if (e.code === 'ArrowUp') boat.raiseNet();
        else if (e.code === 'Space') {
            if (mode === 'play') {
                mode = 'paused';
                document.querySelector('#menu-container').style.display = 'flex';
            }
            else {
                mode = 'play';
                document.querySelector('#menu-container').style.display = 'none';
            }
        }
    });
    addEventListener('keyup', (e) => {
        boat.haltNet();
    });

    displayTime()
    setInterval(function() {
        if (mode === 'play' && time > 0) time-- && displayTime()
    }, 1000)

    window.setInterval(pushDataToChart, 1000)
    loop();
}

function update() {
    numFishes = numFishes + rFish * numFishes * (1 - numFishes / KFish);
    numSharks = numSharks + rShark * numSharks * (1 - numSharks / KShark);

    for (let i = 0; i < Math.floor(numFishes - fishes.length); i++) {
        const fish = new SchoolingFish(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
        fishes.push(fish);
    }

    for (let i = 0; i < Math.floor(numSharks - sharks.length); i++) {
        const shark = new Shark(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
        shark.buildShark();
        sharks.push(shark);
    }

    for (let fish of fishes) {
        fish.avoid(fishes);
        fish.align(fishes);
        fish.coerce(fishes);
        fish.avoidSurface();
        fish.avoidBottom();
        fish.avoidShark(sharks);
        fish.level();
        fish.move();
    }

    const tempSharks = sharks;

    for (const shark of tempSharks) {
        shark.move()
        shark.chase(fishes)
        fishes = shark.eat(fishes)
        sharks = sharks.filter((shark) => !shark.starve())
    }

    const numFishDiff = numFishes - fishes.length;
    if (numFishDiff > 1) numFishes = numFishes - numFishDiff;
    const numSharkDiff = numSharks - sharks.length;
    if (numSharkDiff > 1) numSharks = numSharks - numSharkDiff;

    boat.update();

    document.querySelector('#caught').innerHTML = `${boat.caughtFish.length}/${catchGoal}`;
};

function render() {
    sky.draw();
    sea.draw();
    boat.draw();

    for (let fish of fishes) {
        fish.draw()
    }

    for (let shark of sharks) {
        drawFish(shark);
    }


    // context.beginPath()
    // context.moveTo(0, sealevel)
    // context.lineTo(canvas.width, sealevel)
    // context.stroke()
    // drawNeighborhood(fishes[0]);
};

function loop() {
    if (mode === 'play') {
        update();
        render();
    }
    window.requestAnimationFrame(loop);
};

init()

