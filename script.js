const boardSize = 24;
const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const startGameButton = document.getElementById("startGame");
const setupDiv = document.getElementById("setup");
const gameDiv = document.getElementById("game");
const resetGameButton = document.getElementById("resetGame");

let board, currentPlayer, gameActive, playerXName, playerOName;

// Khởi tạo trò chơi
function initGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  currentPlayer = "X";
  gameActive = true;
  gameBoard.innerHTML = ""; // Xóa bảng cũ
  createBoard();
  updateStatusText();
}

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

var rowActive;
var colActive;

// Xử lý sự kiện click ô
function handleCellClick(event) {
  if (!gameActive) return;

  const row = parseInt(event.target.dataset.row, 10);
  rowActive = row;
  const col = parseInt(event.target.dataset.col, 10);
  colActive = col;

  if (board[row][col] !== null) return;

  // Xóa dấu của nước đi trước đó (nếu có)
  const previousMove = document.querySelector(".latest-move");
  if (previousMove) {
    previousMove.classList.remove("latest-move");
  }
  
  // Đánh dấu nước đi
  board[row][col] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.style.color = currentPlayer === "X" ? "red" : "green";
  event.target.classList.add("taken", "latest-move");

  const winningCells = checkWin(row, col);
  if (winningCells) {
    highlightWinningCells(winningCells);
    const winnerName = currentPlayer === "X" ? playerXName : playerOName;
    const winnerColor = currentPlayer === "X" ? "red" : "green";
    statusText.innerHTML = `Người chơi <b style="color: ${winnerColor};">${winnerName}</b> thắng!`;
    gameActive = false;
    clearInterval(timerInterval); // Dừng đếm thời gian khi trò chơi kết thúc
  } else if (board.flat().every(cell => cell !== null)) {
    statusText.textContent = "Hòa!";
    gameActive = false;
    clearInterval(timerInterval); // Dừng đếm thời gian khi trò chơi kết thúc
  } else {
    // Đổi lượt chơi
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusText();

    // Bắt đầu đếm thời gian cho người chơi tiếp theo
    startTimer(currentPlayer);
  }
}



// Cập nhật thông báo trạng thái
function updateStatusText() {
  const color = currentPlayer === "X" ? "red" : "green";
  const playerName = currentPlayer === "X" ? playerXName : playerOName;
  statusText.innerHTML = `Đến lượt người chơi <span style="color: ${color};"><b>${playerName}</b></span>`;
}

var winPosition;

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
        winPosition = cells;
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

// Bắt đầu trò chơi
startGameButton.addEventListener("click", () => {
  playerXName = playerXInput.value.trim() || "Người chơi X";
  playerOName = playerOInput.value.trim() || "Người chơi O";
  setupDiv.style.display = "none";
  gameDiv.style.display = "block";
  initGame();
  startTimer("X");
});

// Chơi lại trò chơi
resetGameButton.addEventListener("click", () => {
  setupDiv.style.display = "block";
  gameDiv.style.display = "none";
  playerXInput.value = "";
  playerOInput.value = "";
  resetTimer("X");
  location.reload();
});



// Chọn nút chuyển đổi và body
const toggleButton = document.getElementById("toggle-mode");
const body = document.body;

// Thiết lập mặc định là Dark Mode
body.classList.add("dark-mode");

// Lắng nghe sự kiện nhấn nút
toggleButton.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    // Chuyển sang Light Mode
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    toggleButton.textContent = "Chuyển sang Dark Mode";
  } else {
    // Chuyển sang Dark Mode
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    toggleButton.textContent = "Chuyển sang Light Mode";
  }
});


let timerX = 0; // Thời gian của người chơi X
let timerO = 0; // Thời gian của người chơi O
let timerInterval = null; // Bộ đếm thời gian

function startTimer(player) {
  clearInterval(timerInterval); // Dừng bộ đếm hiện tại

  // Bắt đầu đếm thời gian cho người chơi hiện tại
  timerInterval = setInterval(() => {
    if (player === "X") {
      timerX++;
      document.getElementById("timerX").textContent = formatTime(timerX);
    } else {
      timerO++;
      document.getElementById("timerO").textContent = formatTime(timerO);
    }
  }, 1000); // Tăng thời gian mỗi giây
}

function resetTimer(){
  clearInterval(timerInterval);
  timerX = 0;
  document.getElementById("timerX").textContent = formatTime(timerX);
  timerO = 0;
  document.getElementById("timerO").textContent = formatTime(timerO);
}


function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

document.getElementById("startGameSave").addEventListener("click", function() {
  document.getElementById("openSaveGameDialog").style.display = "flex";
});

document.getElementById("saveGameStart").addEventListener("click", function() {
  document.getElementById("saveGameDialog").style.display = "flex";

  const games = getGameItems();

  document.getElementById("gameName").placeholder=`game${games.length + 1}`;
});

window.onload = () => {
  const selectElement = document.getElementById("listGameSave");

  // Xóa các options cũ, giữ lại placeholder
  selectElement.innerHTML = '<option value="">-- Select a Game --</option>';

  const games = getGameItems();

  games.forEach(game => {
      const option = document.createElement("option");
      option.value = game.key; // Đặt value là tên khóa
      option.textContent = game.key.replace("caro-", ""); // Đặt nội dung là giá trị
      selectElement.appendChild(option);
  });
};

function getGameItems() {
  const gameItems = [];
  for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("caro-")) { // Kiểm tra nếu key bắt đầu bằng "game"
          const value = localStorage.getItem(key);
          gameItems.push({ key, value }); // Lưu cả key và value
      }
  }
  return gameItems;
}

document.getElementById("closeOpenGame").addEventListener("click", function() {
  document.getElementById("openSaveGameDialog").style.display = "none";
});

document.getElementById("closeSaveGame").addEventListener("click", function() {
  document.getElementById("saveGameDialog").style.display = "none";
});

function saveGameState() {

  var currentActive = [rowActive, colActive];

  const gameState = {
    board,
    currentPlayer,
    timerX,
    timerO,
    playerXName,
    playerOName,
    gameActive,
    currentActive,
    winPosition
  };

  const games = getGameItems();

  var gameName = document.getElementById("gameName").value;
  gameName = gameName.length == 0 ? `game${games.length + 1}` : gameName;

  localStorage.setItem(`caro-${gameName}` , encodeObjectToBase64(gameState));
  
  alert(`Game [${gameName}] đã được lưu thành công.`);
  location.reload();
}

document.getElementById("saveGame").addEventListener("click", function() {
  saveGameState();
  document.getElementById("saveGameDialog").style.display = "none";
});

document.getElementById("openSaveGame").addEventListener("click", function() {
  openGameState();
});

function openGameState(){
  const game = document.getElementById("listGameSave").value;

  if(game.length == 0){
    alert("Vui lòng chọn game đã lưu trước đó.")
    return;
  }

  try {
    const savedState = localStorage.getItem(game);

    if (savedState) {
      initGame();

      const gameState = decodeBase64ToObject(savedState);
      board = gameState.board;
      currentPlayer = gameState.currentPlayer;
      timerX = gameState.timerX;
      timerO = gameState.timerO;
      playerXName = gameState.playerXName;
      playerOName = gameState.playerOName;
      gameActive = gameState.gameActive;
      winningCells = gameState.winPosition;
      currentActive = gameState.currentActive;

      updateBoardUI();
      updateStatusText();
      if (winningCells){
        highlightWinningCells(winningCells);
      }

      if(currentActive[0] >= 0 && currentActive[1] >= 0 && currentActive[0] < 24 && currentActive[1] < 24){
        var rowCol = Array.from(document.querySelectorAll("[data-row], [data-col]"))
        var currentRowCol = rowCol.find(x => x.dataset.row == currentActive[0] && x.dataset.col == currentActive[1]);
        currentRowCol.classList.add("taken", "latest-move");
        rowActive = currentActive[0];
        colActive = currentActive[1];
      }

      setupDiv.style.display = "none";
      gameDiv.style.display = "block";

      document.getElementById("timerX").textContent = formatTime(timerX);
      document.getElementById("timerO").textContent = formatTime(timerO);
      if (gameActive) startTimer(currentPlayer);
    }

    document.getElementById("openSaveGameDialog").style.display = "none";
  } catch (error) {
    alert("Data lưu trữ mà bạn chọn đã bị lỗi.");
  }
}

// Cập nhật giao diện bàn cờ
function updateBoardUI() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const cellValue = board[row][col];
    if (cellValue) {
      cell.textContent = cellValue;
      cell.style.color = cellValue === "X" ? "red" : "green";
      cell.classList.add("taken");
    } else {
      cell.textContent = "";
      cell.classList.remove("taken");
    }
  });
}



function encodeObjectToBase64(obj) {
  // Chuyển đối tượng thành chuỗi JSON
  const jsonString = JSON.stringify(obj);
  // Mã hóa chuỗi UTF-8 sang Base64
  const utf8Bytes = new TextEncoder().encode(jsonString);
  return btoa(String.fromCharCode(...utf8Bytes));
}

function decodeBase64ToObject(base64String) {
  // Giải mã Base64 về chuỗi UTF-8
  const utf8String = atob(base64String);
  const utf8Bytes = new Uint8Array([...utf8String].map(c => c.charCodeAt(0)));
  // Chuyển chuỗi UTF-8 thành đối tượng
  const jsonString = new TextDecoder().decode(utf8Bytes);
  return JSON.parse(jsonString);
}