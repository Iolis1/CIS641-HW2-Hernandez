const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X'; // X = Human, O = Computer
const gameStatusMessage = document.getElementById('gameStatusMessage');
const playAgainButton = document.getElementById('playAgainButton');
let gameState = ['','','','','','','','',''];

function setGameStatusMessage(message) {
    gameStatusMessage.textContent = message;
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ['','','','','','','','',''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setGameStatusMessage('');
    playAgainButton.style.display = 'none';
}

function checkWin(player) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombos.some(combo => {
        return combo.every(index => {
            return gameState[index] === player;
        });
    });
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function computerMove() {
    let moveMade = false;
    const blockIndex = findBlockingMove('X');
    if (blockIndex !== -1) {
        makeMove(blockIndex, 'O');
        moveMade = true;
    } else {
        const availableCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        if (availableCells.length > 0) {
            const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            makeMove(randomCellIndex, 'O');
            moveMade = true;
        }
    }

    if (moveMade) {
        if (checkWin('O')) {
            setGameStatusMessage('O wins!');
            playAgainButton.style.display = 'block';
        } else if (checkDraw()) {
            setGameStatusMessage('Draw!');
            playAgainButton.style.display = 'block';
        } else {
            currentPlayer = 'X';
        }
    }
}

function findBlockingMove(player) {
    const opponent = player === 'X' ? 'O' : 'X';
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const gameStateCombo = combo.map(index => gameState[index]);
        if (gameStateCombo.filter(cell => cell === player).length === 2 && gameStateCombo.filter(cell => cell === '').length === 1) {
            return combo[gameStateCombo.indexOf('')];
        }
    }

    return -1;
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    cells[index].removeEventListener('click', handleClick);
}

function handleClick(e) {
    const cellIndex = e.target.dataset.cellIndex;
    gameState[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.removeEventListener('click', handleClick);
    if (checkWin(currentPlayer)) {
        setGameStatusMessage(`${currentPlayer} wins!`);
        playAgainButton.style.display = 'block';
        return;
    }
    if (checkDraw()) {
        setGameStatusMessage('Draw!');
        playAgainButton.style.display = 'block';
        return;
    }
    if (computerMove()) return;
    currentPlayer = 'X';
}

cells.forEach((cell, index) => {
    cell.setAttribute('data-cell-index', index);
    cell.addEventListener('click', handleClick, { once: true });
});

playAgainButton.addEventListener('click', resetGame);