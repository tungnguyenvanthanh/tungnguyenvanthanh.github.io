const boardSize = 24;
let board, currentPlayer, gameActive, playerXName, playerOName, timerX = 0, timerO = 0, timerInterval;

const elements = {
  gameBoard: document.getElementById("game-board"),
  status: document.getElementById("status"),
  playerXInput: document.getElementById("playerX"),
  playerOInput: document.getElementById("playerO"),
  setup: document.getElementById("setup"),
  game: document.getElementById("game"),
  resetGameButton: document.getElementById("resetGame"),
  toggleButton: document.getElementById("toggle-mode"),
  timerX: document.getElementById("timerX"),
  timerO: document.getElementById("timerO")
};

// Khởi tạo trò chơi
function initGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  currentPlayer = "X";
  gameActive = true;
  timerX = timerO = 0;
  elements.timerX.textContent = elements.timerO.textContent = formatTime(0);
  clearInterval(timerInterval);
  updateStatus();
  renderBoard();
}

// Tạo bảng trò chơi
function renderBoard() {
  elements.gameBoard.innerHTML = "";
  board.forEach((row, i) =>
    row.forEach((_, j) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", () => handleMove(i, j, cell));
      elements.gameBoard.appendChild(cell);
    })
  );
}

// Xử lý nước đi
function handleMove(row, col, cell) {
  if (!gameActive || board[row][col]) return;
  board[row][col] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken", "latest-move");
  const winner = checkWin(row, col);
  if (winner) {
    highlightCells(winner);
    elements.status.innerHTML = `Người chơi <b style="color:${currentPlayer === "X" ? "red" : "green"};">${currentPlayer === "X" ? playerXName : playerOName}</b> thắng!`;
    gameActive = false;
    clearInterval(timerInterval);
  } else {
    switchPlayer();
  }
}

// Chuyển lượt
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
  startTimer(currentPlayer);
}

// Cập nhật trạng thái
function updateStatus() {
  elements.status.innerHTML = `Đến lượt <span style="color:${currentPlayer === "X" ? "red" : "green"};"><b>${currentPlayer === "X" ? playerXName : playerOName}</b></span>`;
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
function highlightCells(cells) {
  cells.forEach(({ row, col }) =>
    document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add("highlight")
  );
}

// Định dạng thời gian
const formatTime = (s) =>
  `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// Bộ đếm thời gian
function startTimer(player) {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    player === "X" ? timerX++ : timerO++;
    elements[player === "X" ? "timerX" : "timerO"].textContent = formatTime(player === "X" ? timerX : timerO);
  }, 1000);
}

// Sự kiện bắt đầu trò chơi
document.getElementById("startGame").addEventListener("click", () => {
  playerXName = elements.playerXInput.value || "Người chơi X";
  playerOName = elements.playerOInput.value || "Người chơi O";
  elements.setup.style.display = "none";
  elements.game.style.display = "block";
  initGame();
});

// Sự kiện chơi lại
elements.resetGameButton.addEventListener("click", () => {
  elements.setup.style.display = "block";
  elements.game.style.display = "none";
  elements.playerXInput.value = "";
  elements.playerOInput.value = "";
});

// Chuyển đổi chế độ sáng/tối
elements.toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  elements.toggleButton.textContent = document.body.classList.contains("dark-mode") ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode";
});
