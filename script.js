const cssColorsOriginal = ["lightblue", "lightgray", "pink", "red", "yellow"];
let cssColors = cssColorsOriginal;

class Player {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }
    getDomElement() {
        if (!this.dom) {
            this.dom = document.createElement("div");
            this.dom.classList.add("player");
            let idx = randIntv1(cssColors.length);
            this.dom.style["background"] = cssColors[idx];
            cssColors.splice(idx, 1);
            this.dom.style["marginLeft"] = `${randIntv1(20)}px`;
            this.dom.style["marginTop"] = `${randIntv1(20)}px`;
            let text = document.createTextNode(this.id);
            this.dom.appendChild(text);
        }
        return this.dom;
    }
}

class Ladder {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
    getAngle() {
        return Math.atan((this.endY - this.startY) / (this.endX - this.startX));
    }
    getLength() {
        return Math.sqrt(Math.pow(this.endY - this.startY, 2) + Math.pow(this.endX - this.startX, 2));
    }
}

class Snake {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
    getAngle() {
        return Math.atan((this.endY - this.startY) / (this.endX - this.startX));
    }
    getLength() {
        return Math.sqrt(Math.pow(this.endY - this.startY, 2) + Math.pow(this.endX - this.startX, 2));
    }
}

const height = 10;
const width = 10;

let players = [];
let currentPlayer, playerIterator;

let ladders = [
    new Ladder(3, 9, 2, 6),  // Ladder from 4 to 38 OKE
	new Ladder(8, 9, 8, 6),  // Ladder from 9 to 32 OKE
    new Ladder(4, 7, 5, 2),  // Ladder from 25 to 75 OKE
    new Ladder(8, 4, 8, 1),  // Ladder from 52 to 89 OKE
    new Ladder(1, 4, 1, 3),  // Ladder from 59 to 62 OKE
];

let snakes = [
    new Snake(5, 5, 6, 9),   // Snake from 46 to 7 OKE
    new Snake(0, 4, 2, 7),   // Snake from 60 to 23 OKE
    new Snake(9, 2, 9, 5),   // Snake from 71 to 50 OKE
    new Snake(6, 2, 8, 4),   // Snake from 74 to 49 OKE
    new Snake(3, 0, 2, 2),   // Snake from 97 to 78 OKE
];

function randIntv1(x) {
    return Math.trunc((Math.random() * 100000) % x);
}

function* cyclicIterator(v) {
    let i = 0;
    let j = v.length;
    while (true) {
        yield { idx: i, value: v[i] };
        j = v.length;
        i = (i + 1) % j;
    }
}

function startGame() {
    let selector = document.querySelector("#player-num");
    if (!selector.checkValidity()) {
        alert("Please select a valid number from 2 to 4");
        selector.valueAsNumber = 2;
        return;
    }
    let v = selector.valueAsNumber;
    for (let i = 0; i < v; i++) {
        players.push(new Player(0, 9, i + 1));
    }
    playerIterator = cyclicIterator(players);
    currentPlayer = playerIterator.next().value;
    document.querySelector("#gameboard").hidden = false;
    document.querySelector("#welcome").hidden = true;
    document.getElementById("dice-results").innerText = `Player ${currentPlayer.idx + 1}'s turn`;
    document.getElementById("roll-dice").disabled = false;
    renderBoard();
}

function restart() {
    document.getElementById("win").hidden = true;
    document.querySelector("#gameboard").hidden = true;
    document.querySelector("#welcome").hidden = false;
    players = [];
    cssColors = cssColorsOriginal;
    currentPlayer = undefined;
    playerIterator = undefined;
}

function initializeBoard() {
    let board = [];
    for (let y = 0; y < height; y++) {
        let array = [];
        for (let x = 0; x < width; x++) {
            array.push(new Tile(x, y));
        }
        board.push(array);
    }
    return board;
}

function renderBoard() {
    let output = document.getElementById("board");
    output.innerHTML = "";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");

            players.forEach((player) => {
                if (player.x == x && player.y == y) {
                    tile.appendChild(player.getDomElement());
                }
            });
            output.append(tile);
        }
    }
}

async function rollDice() {
    let result = randIntv1(6) + 1;
	// result = 96;
    document.getElementById("dice-results").innerText = `dice: ${result}`;
    document.getElementById("roll-dice").disabled = true;
    for (let i = 0; i < result; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        movePlayer(currentPlayer.value);
        if (checkWin(currentPlayer)) return i + 1;
    }
    document.getElementById("roll-dice").disabled = false;
    await new Promise(resolve => setTimeout(resolve, 200));
    checkLadder(currentPlayer.value);
    checkSnakes(currentPlayer.value);
    currentPlayer = playerIterator.next().value;
    document.getElementById("dice-results").innerText = `Player ${currentPlayer.idx + 1}'s turn`;
    return result;
}

function movePlayer(player) {
	console.log(player);
    if (player.y % 2 == 0) {
		if (player.x <= 0) {
            player.y--;
        } else {
            player.x--;
        }
    } else {
        if (player.x >= width - 1) {
            player.y--;
        } else {
            player.x++;
        }
    }
    renderBoard();
}

function checkLadder(player) {
    ladders.forEach(ladder => {
        if (ladder.startX == player.x && ladder.startY == player.y) {
            player.x = ladder.endX;
            player.y = ladder.endY;
            renderBoard();
        }
    });
}

function checkSnakes(player) {
    snakes.forEach(snake => {
        if (snake.startX == player.x && snake.startY == player.y) {
            player.x = snake.endX;
            player.y = snake.endY;
            renderBoard();
        }
    });
}

function checkWin(data) {
    let player = data.value;
    let idx = data.idx;
    if (height % 2 == 0) {
        if (player.y <= 0 && player.x <= 0) {
            document.getElementById("win").hidden = false;
            document.getElementById("win-text").innerHTML = `Player ${idx + 1} wins`;
            return true;
        }
    } else {
		if (player.y <= 0 && player.x >= width - 1) {
            document.getElementById("win").hidden = false;
            document.getElementById("win-text").innerHTML = `Player ${idx + 1} wins`;
            return true;
        }
    }
}

function openDrawer() {
    document.getElementById('drawer').style.width = "250px";
}

function closeDrawer() {
    document.getElementById('drawer').style.width = "0";
}
