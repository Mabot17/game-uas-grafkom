const cssColorsOriginal = ["lightblue", "lightgray", "pink", "red", "yellow"];
let cssColors = [...cssColorsOriginal];

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
let questions = [];
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

async function loadQuestions() {
    const response = await fetch('pertanyaan.txt');
    const text = await response.text();
    questions = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

// Panggil fungsi ini saat halaman dimuat
loadQuestions();

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
        alert("Mohon masukkan angka 2 - 4 pemain");
        selector.valueAsNumber = 2;
        return;
    }
    let v = selector.valueAsNumber;
    for (let i = 0; i < v; i++) {
        players.push(new Player(0, 9, i + 1));
    }
    playerIterator = cyclicIterator(players);
    currentPlayer = playerIterator.next().value;

    // Get the selected board ID
    let boardId = document.querySelector('input[name="board-radio"]:checked').value;

    // Hide all boards and show the selected one
    let boards = document.querySelectorAll(".board");
    boards.forEach(board => board.hidden = true);
    document.getElementById(boardId).hidden = false;

    document.querySelector("#gameboard").hidden = false;
    document.querySelector("#welcome").hidden = true;
    document.getElementById("dice-results").innerText = `Giliran Player ${currentPlayer.idx + 1}`;
    document.getElementById("roll-dice").disabled = false;
    renderBoard(boardId);
}



function restart() {
    document.getElementById("win").hidden = true;
    document.querySelector("#gameboard").hidden = true;
    document.querySelector("#welcome").hidden = false;
    players = [];
    cssColors = [...cssColorsOriginal];
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

function renderBoard(boardId) {
    let output = document.getElementById(boardId);
    // console.log(output);
    // console.log(boardId);
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
    result = 3;
    moveDice(result);
    await new Promise(resolve => setTimeout(resolve, 3700));
    document.getElementById("dice-results").innerText = `dice: ${result}`;
    document.getElementById("roll-dice").disabled = true;
    for (let i = 0; i < result; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      movePlayer(currentPlayer.value);
      if (checkWin(currentPlayer)) return i + 1;
    }
    document.getElementById("roll-dice").disabled = false;
    await new Promise(resolve => setTimeout(resolve, 400));
    checkLadder(currentPlayer.value);
    checkSnakes(currentPlayer.value);
    currentPlayer = playerIterator.next().value;
    document.getElementById("dice-results").innerText = `Giliran Player ${currentPlayer.idx + 1}`;
    return result;
  }

function moveDice(randomFace) {
    const dice = document.getElementById('dice');

    const faces = {
        1: 'rotateX(0deg) rotateY(0deg)',
        2: 'rotateX(0deg) rotateY(-90deg)',
        3: 'rotateX(0deg) rotateY(180deg)',
        4: 'rotateX(0deg) rotateY(90deg)',
        5: 'rotateX(-90deg) rotateY(0deg)',
        6: 'rotateX(90deg) rotateY(0deg)',
    };

    const interval = 600; // Interval in milliseconds
    let delay = 0;

    // Iterate through each face and rotate the dice
    for (let i = 1; i <= 6; i++) {
        setTimeout(() => {
            dice.style.transform = faces[i];
        }, delay);
        delay += interval;
    }

    // Set the final random face after all rotations
    setTimeout(() => {
        dice.style.transform = faces[randomFace];
    }, delay);
}

function movePlayer(player) {
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
    // Pass the current board ID to renderBoard
    renderBoard(document.querySelector('input[name="board-radio"]:checked').value);
}

function showQuestionModal(type, onCorrect, onWrong) {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const parts = randomQuestion.split(" | ");
    const questionText = parts[0];
    const correctAnswer = parts[1];
    const answers = parts.slice(2);
  
    document.getElementById("question-text").innerText = questionText;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
  
    answers.forEach(answer => {
      const button = document.createElement("button");
      button.className = "btn btn-primary m-1";
      button.innerText = answer;
      button.onclick = () => {
        if (answer === correctAnswer) {
          alert("Jawaban benar!");
          onCorrect();
        } else {
          alert("Jawaban salah!");
          onWrong();
        }
        $('#questionModal').modal('hide');
      };
      answersDiv.appendChild(button);
    });
  
    $('#questionModal').modal('show');
}

function checkLadder(player) {
    let ladder = ladders.find(l => l.startX == player.x && l.startY == player.y);
    if (ladder) {
        const originalX = player.x;
        const originalY = player.y;
        player.x = ladder.endX;
        player.y = ladder.endY;

        showQuestionModal('ladder', () => {
            // Jawaban benar, pemain tetap di posisi tangga akhir
            renderBoard(document.querySelector('input[name="board-radio"]:checked').value);
        }, () => {
            // Jawaban salah, kembalikan pemain ke posisi tangga awal
            player.x = originalX;
            player.y = originalY;
            renderBoard(document.querySelector('input[name="board-radio"]:checked').value);
        });
    }
}

function checkSnakes(player) {
    let snake = snakes.find(s => s.startX == player.x && s.startY == player.y);
    if (snake) {
        const originalX = player.x;
        const originalY = player.y;
        player.x = snake.endX;
        player.y = snake.endY;

        showQuestionModal('snake', () => {
            // Jawaban benar, pemain tetap di posisi ular akhir
            renderBoard(document.querySelector('input[name="board-radio"]:checked').value);
        }, () => {
            // Jawaban salah, kembalikan pemain ke posisi ular awal
            player.x = originalX;
            player.y = originalY;
            renderBoard(document.querySelector('input[name="board-radio"]:checked').value);
        });
    }
}


function checkWin(player) {
    if (player.y == 0 && player.x == 0) {
        let winner = currentPlayer.idx + 1;
        document.getElementById("winner").innerText = `Player ${winner} won!`;
        document.getElementById("win").hidden = false;
        return true;
    }
    return false;
}

function openDrawer() {
    document.getElementById('drawer').style.width = "450px";
}

function closeDrawer() {
    document.getElementById('drawer').style.width = "0";
}