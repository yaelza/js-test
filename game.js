const LEFT_KEY = 37;
const RIGHT_KEY = 39;

const POINS_PER_CATCH = 10;
const LOSES = 3;

const MIN_SECONDS = 1;
const MAX_SECONDS = 7;

const TIMEOUT = 5;

const ctx = document.getElementById("gameCanvas").getContext("2d");
ctx.canvas.setAttribute('width', `${document.body.offsetWidth}px`);
ctx.canvas.setAttribute('height', `${document.body.offsetHeight}px`);

let gameBackground;
let sea;
let plane;
let parachutistArray;
let boat;

setGameParts();

let points = 0;
let loses = 0;

let randomSeconds;
let randomIndex = 0;
let secondCounter = 0;
setRandomSecond();

document.onkeydown = onKeydown;

var interval = setInterval(function () {
    drawGame();
    updatePlaneLocation();
    checkSeconds();
    updateParachutistsLocation();
}, TIMEOUT);

function onKeydown(event) {
    if (event.keyCode === RIGHT_KEY) {
        if (boat.x < ctx.canvas.width - boat.width) {
            boat.x += 20;
        }

    }
    if (event.keyCode === LEFT_KEY) {
        if (boat.x > 0) {
            boat.x -= 20;
        }
    }
}

function setGameParts() {
    setGameBackground();
    setSea();
    setPlane();
    setBoat();
    parachutistArray = [];
}

function setGameBackground() {
    gameBackground = { image: new Image(), x: 0, y: 0, width: ctx.canvas.width, height: ctx.canvas.height };
    gameBackground.image.src = "images/background.png";
}

function setSea() {
    sea = { image: new Image(), x: 0, y: ctx.canvas.height * 2 / 3, width: ctx.canvas.width, height: ctx.canvas.height / 3 };
    sea.image.src = "images/sea.png";
}

function setPlane() {
    plane = { image: new Image(), x: ctx.canvas.width - 30, y: 50, width: 200, height: 100 };
    plane.image.src = 'images/plane.png';
}

function setBoat() {
    boat = { image: new Image(), x: ctx.canvas.width / 2, y: sea.y, width: 200, height: 100 };
    boat.image.src = "images/boat.png";
}

function setRandomSecond() {
    randomSeconds = [];
    for (let i = 0; i < 100; i++) {
        randomSeconds.push(getRandom());
    }
}

function getRandom() {
    return Math.floor(Math.random() * (MAX_SECONDS - MIN_SECONDS) + MIN_SECONDS);
}

function drawGame() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(gameBackground.image, gameBackground.x, gameBackground.y, gameBackground.width, gameBackground.height);
    ctx.drawImage(sea.image, sea.x, sea.y, sea.width, sea.height);
    ctx.drawImage(plane.image, plane.x, plane.y, plane.width, plane.height);
    ctx.drawImage(boat.image, boat.x, boat.y, boat.width, boat.height);

    for (let i = 0; i < parachutistArray.length; i++) {
        const parachutist = parachutistArray[i];
        ctx.drawImage(parachutist.image, parachutist.x, parachutist.y, parachutist.width, parachutist.height);
    }
}

function updatePlaneLocation() {
    plane.x--;
    if (plane.x == 0) {
        plane.x = ctx.canvas.width - plane.width;
    }
}

function checkSeconds() {
    secondCounter += TIMEOUT;
    let isSecondPass = secondCounter / 1000 == randomSeconds[randomIndex];
    if (isSecondPass) {
        pushParachutist();
        randomIndex++;
        secondCounter = 0;
    }
}

function pushParachutist() {
    const parachutist = { image: new Image(), x: plane.x, y: 10, width: 75, height: 140 };
    parachutist.image.src = "images/parachutist.png";
    parachutistArray.push(parachutist);
}

function updateParachutistsLocation() {
    for (let i = 0; i < parachutistArray.length;) {
        const parachutist = parachutistArray[i];
        parachutist.y++;
        if (parachutist.y >= boat.y) {
            updateGameStatus(parachutist);
            parachutistArray.splice(i, 1);
        } else {
            i++;
        }
    }

}

function updateGameStatus(parachutist) {
    if (isParachutistInRange(parachutist)) {
        updatePoints();
    }
    else {
        updateLoses();
        if (loses == LOSES) {
            gameOver();
        }
    }
    console.log(`loses: ${loses} | points: ${points}`);
}

function isParachutistInRange(parachutist) {
    return parachutist.x >= boat.x && parachutist.x + parachutist.width <= boat.x + boat.width;
}

function updatePoints() {
    points += POINS_PER_CATCH;
    document.getElementById('points').innerText = `Points: ${points}`;
}


function updateLoses() {
    loses++;
    document.getElementById('loses').innerText = `Loses: ${loses}`;
}
function gameOver() {
    setTimeout(() => {
        alert("game is over");
        location.reload();
    }, 100);
}