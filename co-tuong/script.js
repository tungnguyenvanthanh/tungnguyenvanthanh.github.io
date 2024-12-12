// Khởi tạo bàn cờ và quân cờ
const board = document.getElementById("chess-board");

const initialPieces = [
  ["車", "馬", "象", "士", "將", "士", "象", "馬", "車"],
  ["", "", "", "", "", "", "", "", ""],
  ["", "炮", "", "", "", "", "", "炮", ""],
  ["卒", "", "卒", "", "卒", "", "卒", "", "卒"],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["兵", "", "兵", "", "兵", "", "兵", "", "兵"],
  ["", "砲", "", "", "", "", "", "砲", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["車", "馬", "象", "士", "帥", "士", "象", "馬", "車"]
];

// Tạo bảng
for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 9; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (initialPieces[row][col]) {
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.textContent = initialPieces[row][col];
      piece.style.color = row < 5 ? "red" : "black";
      cell.classList.add("occupied");
      cell.appendChild(piece);
    }
    board.appendChild(cell);
  }
}
