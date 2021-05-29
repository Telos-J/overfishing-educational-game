let mode = "paused";
let catchGoal = 40
let time = 90

const skyWidth = 1920;
const skyHeight = 362;
const sealevel = canvas.width / skyWidth * skyHeight;

let numFishes = 50;
let numSharks = 0;
let fishes = [];
let sharks = [];
let level = -2;

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

function restart() {
    fishes = [];
    sharks = [];
    populationChart.data.datasets[0].data = []
    populationChart.data.datasets[1].data = []

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
}

function displayObjective() {
    document.querySelector('#menu-buttons').style.display = 'none';
    document.querySelector('#next-level-buttons').style.display = 'initial';
    time = level * 20 + 70;
    catchGoal = level * 25 + 10;
    document.querySelector('#catch-goal').innerHTML = catchGoal
    document.querySelector('#catch-time').innerHTML = time
    console.log(time,catchGoal)
    window.setTimeout(() => {
        document.querySelector('#menu-container').style.display = 'none';
        restart()
        mode = 'play'
    }, 1500)
}

async function init() {
    document.querySelector('#loading-bar-inner').classList.add('load')
    document.querySelector('#game-over').style.display = 'none';
    await assets.loadAssets();
    document.querySelector('#loading-screen').style.display = 'none'

    document.querySelector('#menu-container').style.display = 'flex';
    document.querySelector('#menu-buttons').style.display = 'initial';
    document.querySelector('#pause-buttons').style.display = 'none';
    document.querySelector('#next-level-buttons').style.display = 'none';

    restart()

    sky = new Sky();
    sea = new Sea()

    addEventListener('keydown', (e) => {
        if (e.code === 'ArrowDown') boat.lowerNet();
        else if (e.code === 'ArrowUp') boat.raiseNet();
        else if (e.code === 'Space') {
            if (mode === 'play') {
                mode = 'paused';
                document.querySelector('#menu-container').style.display = 'flex';
                document.querySelector('#menu-buttons').style.display = 'none';
                document.querySelector('#pause-buttons').style.display = 'initial';
                document.querySelector('#next-level-buttons').style.display = 'none';
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

    document.querySelector('#start-button').addEventListener('click', () => {
        displayObjective()
    })

    document.querySelector('#back-to-menu-button').addEventListener('click', () => {
        restart()
        update();
        render();
        document.querySelector('#menu-buttons').style.display = 'initial';
        document.querySelector('#pause-buttons').style.display = 'none';
    })

    setInterval(function() {
        if (mode === 'play' && time > 0) time--
    }, 1000)

    window.setInterval(pushDataToChart, 1000)
    update();
    render();
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
    if (boat.caughtFish.length >= catchGoal) {
        mode = 'pause'
        level++
        document.querySelector('#menu-container').style.display = 'flex';
        displayObjective()
    
    }
    if (time <= 0) {
        document.querySelector('#game-over').style.display = 'initial';
        level = 1
    }
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

    displayTime()
};

function loop() {
    if (mode === 'play') {
        update();
        render();
    }
    window.requestAnimationFrame(loop);
};

init()

