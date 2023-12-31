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
let gameOverText;

let lastKeyPressed;

// animation
let growing = false; // Indicates if the snake is currently growing
let growthDuration = 100; // Duration of the growth animation in milliseconds
let growthStartTime = 0; // Time when the growth animation started

//options

let hasWalls = false;

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
    highScoreText.textContent = `Highscore : 0`
    gameOverText = document.getElementById('gameOver')

    const optionsButton = document.getElementById('options');
    const optionsContent = document.getElementById('options-content');

    optionsButton.addEventListener('click', function () {
        if (optionsContent.style.display === 'block') {
            optionsContent.style.display = 'none';
        } else {
            optionsContent.style.display = 'block';
        }
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.name === 'hasWalls') {
                hasWalls = this.checked;
                console.log('Walls turned ' + (hasWalls ? 'on' : 'off'));
            }
        })
    })



    //reset
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame)

    // Starting game loop
    setInterval(update, 1000 / 10); // every one hundred milliseconds

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

        growing = true;
        growthStartTime = Date.now();
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

    if (hasWalls) {
        snakeX += velocityX * blockSize; snakeY += velocityY * blockSize;
    } else {
        snakeX = (snakeX + velocityX * blockSize + cols * blockSize) % (cols * blockSize);
        snakeY = (snakeY + velocityY * blockSize + rows * blockSize) % (rows * blockSize);
    }

    

    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    

    for (let i = 0; i < snakeBody.length; i++) {
        drawSnakeSegment(snakeBody[i][0], snakeBody[i][1]);
    }

    console.log(hasWalls)

    if (hasWalls) {
        console.log('checking walls')
        if (snakeX < 0 || snakeX > cols * blockSize - 1 || snakeY < 0 || snakeY > rows * blockSize - 1) {
            gameOver = true;
            gameOverText.textContent = 'Game Over!'
        }
    }

    if (growing) {
        // Check if the growth animation has finished
        const currentTime = Date.now();
        if (currentTime - growthStartTime >= growthDuration) {
            growing = false;
        } else {
            // Double the snake head size during the growth animation
            let direction = lastKeyPressed === 'W' ? [snakeX - blockSize / 2, snakeY] :
                lastKeyPressed === 'S' ? [snakeX - blockSize / 2, snakeY] :
                    lastKeyPressed === 'A' ? [snakeX, snakeY - blockSize / 2] :
                        lastKeyPressed === 'D' ? [snakeX, snakeY - blockSize / 2] : null
            context.fillRect(direction[0], direction[1], blockSize * 2, blockSize * 2);
        }
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            gameOverText.textContent = 'Game Over!'
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
    const emptyCells = [];

    // Create a list of all empty cells on the board
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const cellX = x * blockSize;
            const cellY = y * blockSize;
            let isOccupied = false;

            // Check if the cell is occupied by the snake's head or body
            if (cellX === snakeX && cellY === snakeY) {
                isOccupied = true;
            }

            for (let i = 0; i < snakeBody.length; i++) {
                if (cellX === snakeBody[i][0] && cellY === snakeBody[i][1]) {
                    isOccupied = true;
                    break;
                }
            }

            if (!isOccupied) {
                emptyCells.push({ x: cellX, y: cellY });
            }
        }
    }

    // Randomly select an empty cell for the food
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        foodX = emptyCells[randomIndex].x;
        foodY = emptyCells[randomIndex].y;
    }
}

function changeDirection(e) {
    switch (e.code) { // Can not use conditional in case statement
        case 'ArrowUp':
        case 'KeyW':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
                lastKeyPressed = 'W'
                // console.log(lastKeyPressed)

            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
                lastKeyPressed = 'S'
                // console.log(lastKeyPressed)
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
                lastKeyPressed = 'A'
                // console.log(lastKeyPressed)

            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
                lastKeyPressed = 'D'
                // console.log(lastKeyPressed)

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
    gameOverText.textContent = null

    context.clearRect(0, 0, board.width, board.height);
    placeFood();
}