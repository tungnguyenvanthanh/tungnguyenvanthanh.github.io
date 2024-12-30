const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");

const rows = 4; // Lục giác với cạnh có 4 trụ
const radius = 10; // Kích thước điểm
const margin = 80; // Khoảng cách giữa các điểm
const players = ["Người chơi 1", "Người chơi 2"];
const playerColors = ["red", "blue"];
let currentPlayer = 0;
let remainingMoves = [21, 21]; // Mỗi người chơi có 21 quân cờ
const drawnLines = new Set(); // Đường thẳng đã được vẽ
const triangles = []; // Lưu các tam giác đã được tô

// Vẽ bàn cờ
function createBoard() {
  const points = [];

  for (let row = 0; row < rows * 2 - 1; row++) {
    const isUpperHalf = row < rows;
    const count = isUpperHalf ? rows + row : rows * 2 - (row - rows + 2);
    const y = 300 + (row - (rows - 1)) * margin;
    const offset = (rows * 2 - 1 - count) * margin / 2;

    for (let col = 0; col < count; col++) {
      const x = 60 + offset + col * margin;
      const point = { x, y, row, col, id: `${row}-${col}` };
      points.push(point);

      // Vẽ điểm
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", radius);
      circle.setAttribute("class", "dot");
      gameBoard.appendChild(circle);
    }
  }
  return points;
}

const points = createBoard();

// Vẽ đường thẳng nối giữa các điểm
function drawLine(pointA, pointB) {
  const lineId = `${pointA.id}-${pointB.id}`;
  if (drawnLines.has(lineId)) return false; // Đường đã vẽ trước đó
  drawnLines.add(lineId);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", pointA.x);
  line.setAttribute("y1", pointA.y);
  line.setAttribute("x2", pointB.x);
  line.setAttribute("y2", pointB.y);
  line.setAttribute("class", "line");
  gameBoard.appendChild(line);

  return true;
}

// Kiểm tra tam giác và tô màu nếu tạo được
function checkTriangle(player) {
  // Lấy các đường đã vẽ và kiểm tra tam giác
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      for (let k = j + 1; k < points.length; k++) {
        const p1 = points[i];
        const p2 = points[j];
        const p3 = points[k];

        const isTriangle = drawnLines.has(`${p1.id}-${p2.id}`) &&
          drawnLines.has(`${p2.id}-${p3.id}`) &&
          drawnLines.has(`${p1.id}-${p3.id}`);

        if (isTriangle && !triangles.some(t => t.includes(p1.id) && t.includes(p2.id) && t.includes(p3.id))) {
          // Tạo tam giác mới
          const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          triangle.setAttribute("points", `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`);
          triangle.setAttribute("class", `triangle player${player + 1}`);
          gameBoard.appendChild(triangle);

          triangles.push([p1.id, p2.id, p3.id]); // Lưu tam giác
          remainingMoves[player]--;
          return true;
        }
      }
    }
  }
  return false;
}

// Xử lý click để chọn các điểm và vẽ đường
let selectedPoints = [];
gameBoard.addEventListener("click", event => {
  if (remainingMoves[currentPlayer] <= 0) return; // Hết lượt chơi

  const dot = event.target;
  if (dot.tagName !== "circle") return;

  const cx = +dot.getAttribute("cx");
  const cy = +dot.getAttribute("cy");
  const point = points.find(p => p.x === cx && p.y === cy);

  if (selectedPoints.includes(point)) return;
  selectedPoints.push(point);

  if (selectedPoints.length === 2) {
    const [pointA, pointB] = selectedPoints;
    if (drawLine(pointA, pointB)) {
      if (!checkTriangle(currentPlayer)) {
        // Không tạo được tam giác -> đổi lượt chơi
        currentPlayer = 1 - currentPlayer;
      }
      statusText.textContent = `Lượt chơi: ${players[currentPlayer]} (${remainingMoves[currentPlayer]} quân cờ còn lại)`;
    }
    selectedPoints = [];
  }
});

// Kiểm tra thắng/thua
function checkGameOver() {
  if (remainingMoves[0] <= 0 && remainingMoves[1] <= 0) {
    const player1Triangles = triangles.filter(t => t.player === 0).length;
    const player2Triangles = triangles.filter(t => t.player === 1).length;

    if (player1Triangles > player2Triangles) {
      alert("Người chơi 1 thắng!");
    } else if (player2Triangles > player1Triangles) {
      alert("Người chơi 2 thắng!");
    } else {
      alert("Hòa!");
    }
  }
}
