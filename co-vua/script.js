const chessboard = document.getElementById("chessboard");
const statusEl = document.getElementById("status");

// Sử dụng Chess.js để quản lý logic
const game = new Chess();

// Tạo bàn cờ
// Tạo bàn cờ
function drawBoard() {
    chessboard.innerHTML = ""; // Xóa bàn cờ cũ
    const board = game.board();
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.classList.add((row + col) % 2 === 0 ? "white" : "black");
  
        const piece = board[row][col];
        if (piece) {
          const pieceEl = document.createElement("div");
          pieceEl.classList.add("piece");
          pieceEl.classList.add(piece.color === "w" ? "white-piece" : "black-piece"); // Phân biệt màu
          pieceEl.textContent = getUnicodePiece(piece);
          pieceEl.draggable = true;
  
          // Kéo và thả
          pieceEl.addEventListener("dragstart", dragStart);
          square.appendChild(pieceEl);
        }
  
        square.dataset.position = getPosition(row, col);
        square.addEventListener("dragover", dragOver);
        square.addEventListener("drop", drop);
  
        chessboard.appendChild(square);
      }
    }
  
    updateStatus();
  }
  

// Lấy vị trí trong format cờ vua (vd: "e2")
function getPosition(row, col) {
  const files = "abcdefgh";
  return files[col] + (8 - row);
}

// Lấy ký hiệu quân cờ Unicode
function getUnicodePiece(piece) {
  const unicodePieces = {
    p: "♟︎",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔"
  };
  return unicodePieces[piece.type.toLowerCase()];
}

// Cập nhật trạng thái trò chơi
function updateStatus() {
  if (game.in_checkmate()) {
    statusEl.textContent = `Chiếu bí! Người chơi ${game.turn() === "w" ? "Đen" : "Trắng"} thắng!`;
  } else if (game.in_draw()) {
    statusEl.textContent = "Hòa!";
  } else {
    statusEl.textContent = `Lượt chơi của ${game.turn() === "w" ? "Trắng" : "Đen"}.`;
  }
}

// Xử lý kéo và thả
let draggedFrom = null;

function dragStart(e) {
  draggedFrom = e.target.parentElement.dataset.position;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const targetSquare = e.target.dataset.position || e.target.parentElement.dataset.position;

  // Thực hiện bước đi
  const move = game.move({
    from: draggedFrom,
    to: targetSquare,
    promotion: "q" // Phong hậu nếu tốt đến cuối
  });

  if (move) {
    drawBoard();
  } else {
    alert("Bước đi không hợp lệ!");
  }
}

drawBoard();
