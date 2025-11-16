// ペグ・ソリティアの基本ロジック
const BOARD_SIZE = 7;
const CENTER = 3;
const INVALID = -1;
const PEG = 1;
const EMPTY = 0;

// 標準型の盤面初期化
function createInitialBoard() {
    const board = Array.from({ length: BOARD_SIZE }, (_, y) =>
        Array.from({ length: BOARD_SIZE }, (_, x) => {
            if ((x < 2 || x > 4) && (y < 2 || y > 4)) return INVALID;
            return PEG;
        })
    );
    board[CENTER][CENTER] = EMPTY;
    return board;
}

let board = createInitialBoard();
let selected = null;

function renderBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    board.forEach((row, y) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        row.forEach((cell, x) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            if (cell === INVALID) {
                cellDiv.classList.add('invalid');
            } else if (cell === PEG) {
                cellDiv.classList.add('peg');
                cellDiv.onclick = () => selectPeg(x, y);
            } else if (cell === EMPTY) {
                cellDiv.classList.add('empty');
                if (selected && canMove(selected.x, selected.y, x, y)) {
                    cellDiv.classList.add('movable');
                    cellDiv.onclick = () => movePeg(selected.x, selected.y, x, y);
                }
            }
            if (selected && selected.x === x && selected.y === y) {
                cellDiv.classList.add('selected');
            }
            rowDiv.appendChild(cellDiv);
        });
        boardDiv.appendChild(rowDiv);
    });
}

function selectPeg(x, y) {
    if (board[y][x] === PEG) {
        selected = { x, y };
        renderBoard();
    }
}

function canMove(sx, sy, tx, ty) {
    if (board[ty][tx] !== EMPTY) return false;
    const dx = tx - sx;
    const dy = ty - sy;
    if (Math.abs(dx) === 2 && dy === 0) {
        const mx = sx + dx / 2;
        return board[sy][mx] === PEG;
    }
    if (Math.abs(dy) === 2 && dx === 0) {
        const my = sy + dy / 2;
        return board[my][sx] === PEG;
    }
    return false;
}

function movePeg(sx, sy, tx, ty) {
    const dx = tx - sx;
    const dy = ty - sy;
    if (!canMove(sx, sy, tx, ty)) return;
    board[sy][sx] = EMPTY;
    board[ty][tx] = PEG;
    if (Math.abs(dx) === 2) {
        board[sy][sx + dx / 2] = EMPTY;
    } else if (Math.abs(dy) === 2) {
        board[sy + dy / 2][sx] = EMPTY;
    }
    selected = null;
    renderBoard();
    if (isGameClear()) {
        setTimeout(() => alert('クリア！'), 100);
    }
}

function isGameClear() {
    let pegCount = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (board[y][x] === PEG) pegCount++;
        }
    }
    return pegCount === 1;
}

document.getElementById('reset').onclick = () => {
    board = createInitialBoard();
    selected = null;
    renderBoard();
};

window.onload = renderBoard;
