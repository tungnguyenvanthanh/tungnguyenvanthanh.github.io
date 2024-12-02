const boardSize = 24;
const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");

let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
let currentPlayer = "X";
let gameActive = true;

// Tạo bảng
function createBoard() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      gameBoard.appendChild(cell);
    }
  }
}

// Xử lý sự kiện click
function handleCellClick(event) {
  if (!gameActive) return;

  const row = parseInt(event.target.dataset.row, 10);
  const col = parseInt(event.target.dataset.col, 10);

  if (board[row][col] !== null) return;

  board[row][col] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.style.color = currentPlayer === "X" ? "red" : "green";
  event.target.classList.add("taken");

  const winningCells = checkWin(row, col);
  if (winningCells) {
    highlightWinningCells(winningCells);
    statusText.innerHTML = `<span style="color: ${currentPlayer === "X" ? "red" : "green"};">Người chơi ${currentPlayer} thắng!</span>`;
    gameActive = false;
  } else if (board.flat().every(cell => cell !== null)) {
    statusText.textContent = "Hòa!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusText();
  }
}

// Cập nhật thông báo trạng thái
function updateStatusText() {
  const color = currentPlayer === "X" ? "red" : "green";
  statusText.innerHTML = `Đến lượt người chơi <span style="color: ${color};">${currentPlayer}</span>`;
}

// Kiểm tra thắng
function checkWin(row, col) {
  const directions = [
    { dr: 0, dc: 1 }, // ngang
    { dr: 1, dc: 0 }, // dọc
    { dr: 1, dc: 1 }, // chéo chính
    { dr: 1, dc: -1 } // chéo phụ
  ];

  for (let { dr, dc } of directions) {
    let cells = [{ row, col }];

    // Tìm quân cờ liên tiếp về phía trước
    for (let k = 1; k < boardSize; k++) {
      const r = row + dr * k;
      const c = col + dc * k;
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
        cells.push({ row: r, col: c });
      } else {
        break;
      }
    }

    // Tìm quân cờ liên tiếp về phía sau
    for (let k = 1; k < boardSize; k++) {
      const r = row - dr * k;
      const c = col - dc * k;
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
        cells.push({ row: r, col: c });
      } else {
        break;
      }
    }

    // Sắp xếp lại các ô liên tiếp
    cells.sort((a, b) => a.row - b.row || a.col - b.col);

    const start = cells[0];
    const end = cells[cells.length - 1];

    // Kiểm tra các điểm ngoài cùng
    const isBlockedStart =
      start.row - dr >= 0 &&
      start.row - dr < boardSize &&
      start.col - dc >= 0 &&
      start.col - dc < boardSize &&
      board[start.row - dr][start.col - dc] !== null;

    const isBlockedEnd =
      end.row + dr >= 0 &&
      end.row + dr < boardSize &&
      end.col + dc >= 0 &&
      end.col + dc < boardSize &&
      board[end.row + dr][end.col + dc] !== null;

    // Điều kiện thắng:
    // 1. Chuỗi >= 5 và không bị chặn ở cả hai đầu.
    // 2. Chuỗi >= 6 (bất kể bị chặn ở đầu nào).
    if (cells.length >= 5) {
      if (!isBlockedStart || !isBlockedEnd || cells.length >= 6) {
        return cells;
      }
    }
  }

  return null;
}


// Đổi màu quân thắng
function highlightWinningCells(winningCells) {
  winningCells.forEach(({ row, col }) => {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.style.backgroundColor = "yellow";
  });
}

// Khởi tạo trò chơi
createBoard();
updateStatusText();
