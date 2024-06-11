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

//Rumah Tangga
let ladders = [
    new Ladder(3, 9, 2, 6),  // Ladder from 4 to 38 OKE
	new Ladder(8, 9, 8, 6),  // Ladder from 9 to 32 OKE
    new Ladder(4, 7, 5, 2),  // Ladder from 25 to 75 OKE
    new Ladder(8, 4, 8, 1),  // Ladder from 52 to 89 OKE
    new Ladder(1, 4, 1, 3),  // Ladder from 59 to 62 OKE
];

let ladders2 = [
    new Ladder(3, 9, 2, 6),  // Ladder from 4 to 38 OKE
	new Ladder(8, 9, 8, 6),  // Ladder from 9 to 32 OKE
    new Ladder(4, 7, 5, 2),  // Ladder from 25 to 75 OKE
    new Ladder(8, 4, 8, 1),  // Ladder from 52 to 89 OKE
    new Ladder(1, 4, 1, 3),  // Ladder from 59 to 62 OKE
    new Ladder(1, 2, 2, 0),  // Ladder from 79 to 97 OKE
];

let ladders3 = [
    new Ladder(1, 9, 1, 7),  // Ladder from 2 to 22 
    new Ladder(9, 8, 9, 6),  // Ladder from 11 to 31 
    new Ladder(7, 6, 7, 2),  // Ladder from 33 to 73
    new Ladder(4, 3, 4, 0),  // Ladder from 65 to 96
];

let ladders4 = [
    new Ladder(3, 9, 2, 6),  // Ladder from 4 to 38
    new Ladder(8, 9, 9, 8),  // Ladder from 9 to 32
    new Ladder(4, 7, 5, 2),  // Ladder from 25 to 75
    new Ladder(8, 4, 8, 1),  // Ladder from 52 to 89
    new Ladder(1, 4, 1, 3),  // Ladder from 59 to 79
];

let ladders5 = [
    new Ladder(3, 9, 4, 7),  // Ladder from 4 to 25
    new Ladder(8, 9, 8, 7),  // Ladder from 9 to 29
    new Ladder(0, 5, 1, 2),  // Ladder from 41 to 79
    new Ladder(5, 3, 5, 0),  // Ladder from 66 to 95
];

let ladders6 = [
    new Ladder(3, 9, 2, 6),  // Ladder from 4 to 38
    new Ladder(9, 9, 9, 6),  // Ladder from 10 to 31
    new Ladder(8, 7, 7, 5),  // Ladder from 29 to 48
    new Ladder(5, 6, 4, 3),  // Ladder from 35 to 65
    new Ladder(8, 4, 8, 1),  // Ladder from 52 to 89
    new Ladder(1, 2, 2, 0),  // Ladder from 79 to 98
];


//Ulat Nusantara
let snakes = [
    new Snake(5, 5, 6, 9),   // Snake from 46 to 7 OKE
    new Snake(0, 4, 2, 7),   // Snake from 60 to 23 OKE
    new Snake(9, 2, 9, 5),   // Snake from 71 to 50 OKE
    new Snake(6, 2, 8, 4),   // Snake from 74 to 49 OKE
    new Snake(3, 0, 2, 2),   // Snake from 97 to 78 OKE
];

let snakes2 = [
    new Snake(5, 5, 6, 9),   // Snake from 46 to 7 OKE
    new Snake(0, 4, 2, 7),   // Snake from 60 to 23 OKE
    new Snake(9, 2, 9, 5),   // Snake from 71 to 50 OKE
    new Snake(6, 2, 8, 4),   // Snake from 74 to 49 OKE
    new Snake(7, 1, 8, 3),   // Snake from 88 to 69 OKE
    new Snake(3, 0, 2, 2),   // Snake from 97 to 78 OKE
];

let snakes3 = [
    new Snake(9, 6, 8, 8),   // Snake from 31 to 12
    new Snake(5, 6, 4, 8),   // Snake from 35 to 16
    new Snake(9, 5, 7, 7),   // Snake from 50 to 28
    new Snake(1, 5, 3, 7),   // Snake from 42 to 24
    new Snake(1, 2, 1, 5),   // Snake from 79 to 42
    new Snake(2, 1, 5, 5),   // Snake from 83 to 46
    new Snake(8, 1, 9, 3),   // Snake from 89 to 70
    new Snake(2, 0, 1, 2),   // Snake from 98 to 79
];

let snakes4 = [
    new Snake(7, 6, 4, 8),   // Snake from 33 to 16
    new Snake(5, 5, 6, 9),   // Snake from 46 to 7
    new Snake(2, 4, 3, 5),   // Snake from 58 to 44
    new Snake(0, 4, 2, 7),   // Snake from 60 to 13
    new Snake(9, 2, 9, 5),   // Snake from 71 to 50
    new Snake(6, 2, 7, 5),   // Snake from 74 to 53
    new Snake(9, 0, 8, 1),   // Snake from 91 to 89
    new Snake(4, 0, 2, 2),   // Snake from 96 to 78
];

let snakes5 = [
    new Snake(2, 8, 0, 9),  // Snake from 18 to 1
    new Snake(4, 6, 7, 7),  // Snake from 36 to 28
    new Snake(1, 5, 2, 8),  // Snake from 42 to 18
    new Snake(9, 5, 8, 7),  // Snake from 50 to 29
    new Snake(8, 4, 6, 6),  // Snake from 52 to 34
    new Snake(6, 3, 5, 6),  // Snake from 67 to 35
    new Snake(2, 1, 4, 4),  // Snake from 83 to 56
    new Snake(7, 0, 8, 4),  // Snake from 93 to 52
];

let snakes6 = [
    new Snake(7, 7, 4, 9),  // Snake from 33 to 5
    new Snake(1, 4, 2, 7),  // Snake from 59 to 23
    new Snake(9, 2, 9, 5),  // Snake from 71 to 50
    new Snake(6, 2, 8, 4),  // Snake from 74 to 52
    new Snake(7, 1, 8, 3),  // Snake from 88 to 69
    new Snake(4, 0, 5, 3),  // Snake from 96 to 66
    new Snake(3, 0, 2, 2),  // Snake from 97 to 78
    new Snake(1, 0, 0, 5),  // Snake from 99 to 41
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

    // Cek papan yang dipilih
    let boardId = document.querySelector('input[name="board-radio"]:checked').value;

    // Tampilkan board yang dipilih
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
    // result = 9;
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
    let ladder;
    
    if (document.querySelector('input[name="board-radio"]:checked').value == 'board') {
        ladder = ladders.find(l => l.startX == player.x && l.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board2') {
        ladder = ladders2.find(l => l.startX == player.x && l.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board3') {
        ladder = ladders3.find(l => l.startX == player.x && l.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board4') {
        ladder = ladders4.find(l => l.startX == player.x && l.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board5') {
        ladder = ladders5.find(l => l.startX == player.x && l.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board6') {
        ladder = ladders6.find(l => l.startX == player.x && l.startY == player.y);
    }

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
    let snake;
    
    if (document.querySelector('input[name="board-radio"]:checked').value == 'board') {
        snake = snakes.find(s => s.startX == player.x && s.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board2') {
        snake = snakes2.find(s => s.startX == player.x && s.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board3') {
        snake = snakes3.find(s => s.startX == player.x && s.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board4') {
        snake = snakes4.find(s => s.startX == player.x && s.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board5') {
        snake = snakes5.find(s => s.startX == player.x && s.startY == player.y);
    }else if (document.querySelector('input[name="board-radio"]:checked').value == 'board6') {
        snake = snakes6.find(s => s.startX == player.x && s.startY == player.y);
    }

    if (snake) {
        const originalX = player.x;
        const originalY = player.y;
        player.x = snake.endX;
        player.y = snake.endY;

        showQuestionModal('snake', () => {
            // Jawaban salah, kembalikan pemain ke posisi ular awal
            player.x = originalX;
            player.y = originalY;
            renderBoard(document.querySelector('input[name="board-radio"]:checked').value);
            
        }, () => {
            // Jawaban benar, pemain tetap di posisi ular akhir
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