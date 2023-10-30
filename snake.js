//board

let blockSize = 25
let rows = 30;
let cols = 30;
let board;
let context;

//snake head
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

//snake speed

let velocityX = 0;
let velocityY = 0;

//snake body
let snakeBody = [];

//food
let foodX;
let foodY;

//gameover
let gameOver = false;

let score = 0;
let highscore = 0;

let scoreText;
let highScoreText;

window.onload = function () {
    board = document.getElementById('board')
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext('2d') // used for drawing on the board

    placeFood();
    document.addEventListener('keyup', changeDirection);

    scoreText = document.getElementById('score')
    scoreText.textContent = scoreText.textContent = `Score : ${score}`;
    highScoreText = document.getElementById('highscore')
    highScoreText.textContext = `Score : ${highscore}`
    setInterval(update, 1000 / 10); // every one hundred milliseconds

    //reset
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame)

}

function update() {

    if (gameOver) {
        return;
    }
    context.fillStyle = 'black';
    context.fillRect(0, 0, board.width, board.height)

    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, blockSize, blockSize)

    //eating food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score += 1;
        scoreText.textContent = `Score : ${score}`; // Update the displayed score
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = 'lime';
    snakeX = (snakeX + velocityX * blockSize + cols * blockSize) % (cols * blockSize); // remove modulo to turn on boundary detection
    snakeY = (snakeY + velocityY * blockSize + rows * blockSize) % (rows * blockSize);

    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        drawSnakeSegment(snakeBody[i][0], snakeBody[i][1]);
    }

    // game over conditions

    // boundary detection

    // if (snakeX < 0 || snakeX > cols * blockSize - 1 || snakeY < 0 || snakeY > rows * blockSize - 1) {
    //     gameOver = true;
    //     alert("Game Over");
    // }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }
}

function drawSnakeSegment(x, y) {
    context.fillStyle = 'lime';
    context.fillRect(x, y, blockSize, blockSize);
    context.strokeStyle = 'black'; // Outline color
    context.lineWidth = 2; // Outline width
    context.strokeRect(x, y, blockSize, blockSize);
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function changeDirection(e) {
    switch (e.code) { // Can not use conditional in case statement
        case 'ArrowUp':
        case 'KeyW':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    gameOver = false;

    // Update the highscore if the current score is higher
    if (score > highscore) {
        highscore = score;
        highScoreText.textContent = `Highscore : ${highscore}`;
    }

    score = 0;
    scoreText.textContent = `Score : ${score}`;

    context.clearRect(0, 0, board.width, board.height);
    placeFood();
}