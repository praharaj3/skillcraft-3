let cells, resetBtn, message, gameBoard, currentPlayer, gameState, gameActive, gameMode, computerTurn;

document.addEventListener('DOMContentLoaded', () => {
    const playerVsPlayerBtn = document.getElementById('player-vs-player');
    const playerVsComputerBtn = document.getElementById('player-vs-computer');
    cells = document.querySelectorAll('.cell');
    resetBtn = document.getElementById('reset-btn');
    message = document.getElementById('message');
    gameBoard = document.getElementById('game-board');
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    gameMode = 'pvp';
    computerTurn = false;

    playerVsPlayerBtn.addEventListener('click', () => startGame('pvp'));
    playerVsComputerBtn.addEventListener('click', () => startGame('pvc'));

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
});

function startGame(mode) {
    document.querySelector('.start-screen').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');
    gameMode = mode;
    resetGame();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || (gameMode === 'pvc' && computerTurn)) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
        computerTurn = true;
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';

    checkResult();
    currentPlayer = 'X';
    computerTurn = false;
}

function checkResult() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        showMessage(`${currentPlayer} Wins! 🎉`);
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        showMessage("It's a Draw! 🤝");
        gameActive = false;
        return;
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    hideMessage();
}

function showMessage(msg) {
    message.textContent = msg;
    message.classList.remove('hidden');
    setTimeout(hideMessage, 3000);
}

function hideMessage() {
    message.classList.add('hidden');
}
