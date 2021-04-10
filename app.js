const mode = "display";

const skyWidth = 1920;
const skyHeight = 362;
const sealevel = canvas.width / skyWidth * skyHeight;

let numFishes = 1;
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

async function init() {
    await assets.loadAssets();

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
    });
    addEventListener('keyup', (e) => {
        boat.haltNet();
    });

    start();
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
        if (!boat.collideNet(fish)) fish.move();
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
    update();
    render();
    window.requestAnimationFrame(loop);
};

function start() {
    if (mode === "display") loop()
    else if (mode === "nodisplay") {
        while (fishes.length && sharks.length && populationChart.data.datasets[0].data.length < 10000) {
            update()
            populationChart.data.labels.push('')
            populationChart.data.datasets[0].data.push(sharks.length)
            populationChart.data.datasets[1].data.push(fishes.length)
        }
        populationChart.update()
    }
}

init()

