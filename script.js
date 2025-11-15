// Game state
let board = Array(9).fill(null);
let isPlayerTurn = true;
let gameOver = false;
let scores = { player: 0, computer: 0, ties: 0 };
let playerName = 'Player';

// Win patterns
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

// DOM elements
const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const playerNameInput = document.getElementById('playerName');
const startBtn = document.getElementById('startBtn');
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const tieScoreElement = document.getElementById('tieScore');
const playerLabelElement = document.getElementById('playerLabel');

// Event listeners
startBtn.addEventListener('click', startGame);
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});
resetBtn.addEventListener('click', resetGame);
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Check for winner
function checkWinner(currentBoard) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            return { winner: currentBoard[a], line: pattern };
        }
    }
    if (currentBoard.every(cell => cell !== null)) {
        return { winner: 'tie', line: null };
    }
    return { winner: null, line: null };
}

// Computer AI
function getComputerMove(currentBoard) {
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
            const testBoard = [...currentBoard];
            testBoard[i] = 'O';
            if (checkWinner(testBoard).winner === 'O') return i;
        }
    }

    // Block player
    for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
            const testBoard = [...currentBoard];
            testBoard[i] = 'X';
            if (checkWinner(testBoard).winner === 'X') return i;
        }
    }

    // Take center
    if (currentBoard[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => currentBoard[i] === null);
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available
    const available = currentBoard.map((cell, i) => cell === null ? i : null).filter(i => i !== null);
    return available[Math.floor(Math.random() * available.length)];
}

// Start game
function startGame() {
    const name = playerNameInput.value.trim();
    playerName = name || 'Player';
    playerLabelElement.textContent = playerName;
    
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    updateDisplay();
}

// Handle cell click
function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (board[index] || gameOver || !isPlayerTurn) return;
    
    makeMove(index, 'X');
    
    const result = checkWinner(board);
    if (result.winner) {
        endGame(result);
    } else {
        isPlayerTurn = false;
        updateStatus();
        setTimeout(computerMove, 600);
    }
}

// Make a move
function makeMove(index, symbol) {
    board[index] = symbol;
    const cell = cells[index];
    cell.textContent = symbol;
    cell.classList.add(symbol === 'X' ? 'cell-x' : 'cell-o');
}

// Computer move
function computerMove() {
    if (gameOver) return;
    
    const move = getComputerMove(board);
    makeMove(move, 'O');
    
    const result = checkWinner(board);
    if (result.winner) {
        endGame(result);
    } else {
        isPlayerTurn = true;
        updateStatus();
    }
}

// End game
function endGame(result) {
    gameOver = true;
    
    if (result.line) {
        result.line.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }
    
    if (result.winner === 'X') {
        scores.player++;
        statusText.textContent = `${playerName} Wins! 🏆`;
    } else if (result.winner === 'O') {
        scores.computer++;
        statusText.textContent = 'Computer Wins! 🤖';
    } else {
        scores.ties++;
        statusText.textContent = "It's a Tie! 🤝";
    }
    
    statusElement.className = 'status game-over';
    updateScores();
}

// Reset game
function resetGame() {
    board = Array(9).fill(null);
    isPlayerTurn = true;
    gameOver = false;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    
    updateDisplay();
}

// Update status
function updateStatus() {
    if (gameOver) return;
    
    if (isPlayerTurn) {
        statusText.textContent = 'Your Turn (X)';
        statusElement.className = 'status player-turn';
    } else {
        statusText.textContent = 'Computer Thinking...';
        statusElement.className = 'status computer-turn';
    }
}

// Update scores
function updateScores() {
    playerScoreElement.textContent = scores.player;
    computerScoreElement.textContent = scores.computer;
    tieScoreElement.textContent = scores.ties;
}

// Update display
function updateDisplay() {
    updateStatus();
    updateScores();
}
