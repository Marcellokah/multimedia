/**
 * CrashDown - JavaScript Game Logic
 * Handles gameplay mechanics, UI interaction, and game state.
 */

// === DOM ELEMENTS ===
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const clicksDisplay = document.getElementById('clicks');
const leaderboardDisplay = document.getElementById('leaderboard');
const nextRowDisplay = document.getElementById('next-row');
const clickSound = document.getElementById('clickSound');
const backgroundMusic = document.getElementById('backgroundMusic');

// === CONSTANTS ===
const colors = ['red', 'green', 'blue', 'yellow'];
const rows = 10;
const cols = 10;

// === GAME STATE ===
let activeRows = 3;
let score = 0;
let time = 0;
let clicks = 3;
let interval;
let nextRowColors = [];
let playerName = '';
const grid = [];

// === PLAYER NAME ===
function askPlayerName() {
    while (!playerName) {
        playerName = prompt('Add meg a neved:');
    }
}

// === GRID INITIALIZATION ===
function createGrid() {
    game.innerHTML = '';
    grid.length = 0;
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            const div = document.createElement('div');
            div.classList.add('block');
            div.classList.add(r >= rows - activeRows ? colors[Math.floor(Math.random() * colors.length)] : 'hidden');
            div.dataset.row = r;
            div.dataset.col = c;
            div.addEventListener('click', onClick);
            game.appendChild(div);
            grid[r][c] = div;
        }
    }
    renderNextRow();
}

// === GET COLOR OF BLOCK ===
function getColor(el) {
    return colors.find(c => el.classList.contains(c));
}

// === DISPLAY NEXT INCOMING ROW ===
function renderNextRow() {
    nextRowDisplay.innerHTML = '';
    nextRowColors = [];
    for (let i = 0; i < cols; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        nextRowColors.push(color);
        const div = document.createElement('div');
        div.classList.add('preview-block', color);
        nextRowDisplay.appendChild(div);
    }
}

// === HANDLE BLOCK CLICK ===
function onClick(e) {
    if (clicks <= 0) return;
    const div = e.target;
    const row = parseInt(div.dataset.row);
    const col = parseInt(div.dataset.col);
    const color = getColor(div);
    const toRemove = [];

    floodFill(row, col, color, toRemove);

    if (toRemove.length > 1) {
        clickSound.currentTime = 0;
        clickSound.play();
        toRemove.forEach(el => {
            el.classList.add('hidden');
            el.removeEventListener('click', onClick);
        });
        score += toRemove.length;
        scoreDisplay.textContent = `Pontszám: ${score}`;
        clicks--;
        clicksDisplay.textContent = `Következő sor: ${clicks}`;
        applyGravity();
        if (clicks === 0) {
            addRow();
            clicks = 3;
            clicksDisplay.textContent = `Következő sor: ${clicks}`;
        }
    }
}

// === FLOOD FILL ALGORITHM ===
function floodFill(r, c, color, found) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const block = grid[r][c];
    if (!block || block.classList.contains('hidden') || getColor(block) !== color || found.includes(block)) return;
    found.push(block);
    floodFill(r + 1, c, color, found);
    floodFill(r - 1, c, color, found);
    floodFill(r, c + 1, color, found);
    floodFill(r, c - 1, color, found);
}

// === APPLY GRAVITY: MOVE BLOCKS DOWN ===
function applyGravity() {
    for (let c = 0; c < cols; c++) {
        for (let r = rows - 1; r >= 0; r--) {
            if (grid[r][c].classList.contains('hidden')) {
                for (let k = r - 1; k >= 0; k--) {
                    if (!grid[k][c].classList.contains('hidden')) {
                        grid[r][c].className = grid[k][c].className;
                        grid[k][c].className = 'block hidden';
                        break;
                    }
                }
            }
        }
    }
    centerColumns();
}

// === CENTER COLUMNS AFTER BLOCK SHIFT ===
function centerColumns() {
    let columns = [];
    for (let c = 0; c < cols; c++) {
        let hasBlock = false;
        for (let r = 0; r < rows; r++) {
            if (!grid[r][c].classList.contains('hidden')) {
                hasBlock = true;
                break;
            }
        }
        if (hasBlock) columns.push(c);
    }

    const emptyCols = cols - columns.length;
    const leftPadding = Math.floor(emptyCols / 2);

    const newClasses = Array.from({ length: rows }, () => Array(cols).fill('block hidden'));
    for (let r = 0; r < rows; r++) {
        for (let i = 0; i < columns.length; i++) {
            const origCol = columns[i];
            newClasses[r][i + leftPadding] = grid[r][origCol].className;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].className = newClasses[r][c];
        }
    }
}

// === ADD NEW ROW AT THE BOTTOM ===
function addRow() {
    if (activeRows >= rows) {
        stopTimer();
        alert('Játék vége! Elérted a maximális sort.');
        saveScore();
        return;
    }

    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
            const current = grid[r][c];
            const below = grid[r + 1][c];
            current.className = below.className;
            current.removeEventListener('click', onClick);
            current.addEventListener('click', onClick);
        }
    }

    for (let c = 0; c < cols; c++) {
        const color = nextRowColors[c];
        const block = grid[rows - 1][c];
        block.className = `block ${color}`;
        block.removeEventListener('click', onClick);
        block.addEventListener('click', onClick);
    }

    activeRows++;
    renderNextRow();
}

// === TIMER CONTROL ===
function startTimer() {
    interval = setInterval(() => {
        time++;
        timerDisplay.textContent = `Idő: ${time}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

// === LEADERBOARD HANDLING ===
function saveScore() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5)));
    showLeaderboard();
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboardDisplay.innerHTML = '<h3>Toplista</h3>' +
        leaderboard.map(entry => `<div>${entry.name}: ${entry.score} pont</div>`).join('');
}

// === MUSIC CONTROL ===
let musicPlaying = false;
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm') {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicPlaying = false;
        } else {
            backgroundMusic.play().catch(err => console.warn('Background music error:', err));
            musicPlaying = true;
        }
    }
});

window.addEventListener('beforeunload', stopTimer);

// === GAME INITIALIZATION ===
askPlayerName();
createGrid();
startTimer();
showLeaderboard();