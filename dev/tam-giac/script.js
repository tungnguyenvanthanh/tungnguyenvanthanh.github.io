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
let selectedPoints = [];

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
      circle.dataset.cx = x;
      circle.dataset.cy = y;
      circle.dataset.id = point.id;
      gameBoard.appendChild(circle);

      // Thêm sự kiện click cho điểm
      circle.addEventListener("click", handleDotClick);
    }
  }
  return points;
}

// Hàm xử lý khi người chơi click vào điểm (dot)
function handleDotClick(event) {
  const tag = event.target;

  if(!tag.classList.contains('one-click')){
    tag.classList.add('one-click');
  }

  const { cx, cy, id } = tag.dataset; // Lấy thông tin điểm
  selectedPoints.push({ x: +cx, y: +cy, id });

  // Nếu đã chọn đủ hai điểm, thử vẽ đường thẳng
  if (selectedPoints.length === 2) {
    const [p1, p2] = selectedPoints;

    if (isValidLine(p1, p2)) {
      drawLine(p1, p2);
      checkForTriangles();
      switchPlayer();
    }

    selectedPoints = []; // Reset lựa chọn
    document.querySelectorAll('circle').forEach(el => el.classList.remove('one-click'));
  }else{

  }
}

// Hàm kiểm tra tính hợp lệ của đường thẳng
function isValidLine(p1, p2) {
  const dx = Math.abs(p1.x - p2.x);
  const dy = Math.abs(p1.y - p2.y);

  // Kiểm tra xem hai điểm có tạo thành đường thẳng hợp lệ
  if (
    (dx === margin * 3 && dy === 0) || // Ngang qua 4 dot
    (dx === margin * 1.5 && dy === 2 * dx) || // Chéo lên
    (dx === margin * 1.5 && dy === 2 * dx * -1) // Chéo xuống
  ) {
    const lineKey = `${p1.id}-${p2.id}`;
    const reverseKey = `${p2.id}-${p1.id}`;

    // Kiểm tra đường thẳng chưa được vẽ
    if (!drawnLines.has(lineKey) && !drawnLines.has(reverseKey)) {
      return true;
    }
  }
  return false;
}

// Lấy toàn bộ 4 điểm
function getLineDots(p1, p2) {
  const points = [];
  const dx = (p2.x - p1.x) / 3; // Khoảng cách giữa các điểm
  const dy = (p2.y - p1.y) / 3;

  for (let i = 0; i <= 3; i++) {
    const x = p1.x + i * dx;
    const y = p1.y + i * dy;
    const dataId = document.querySelector(`circle[cx="${x}"][cy="${y}"]`).getAttribute("data-id");

    points.push({
      x: x,
      y: y,
      id: dataId, // Hoặc tính toán id khác tùy thuộc vào logic
    });
  }

  return points;
}

// truy xuất các điểm đã được nối
function findDotsInLine(p1, p2) {
  const lineKey = `${p1.id}-${p2.id}`;
  const reverseKey = `${p2.id}-${p1.id}`;

  for (const line of drawnLines) {
    if (line === lineKey || line === reverseKey) {
      return line.split("-").map(dotId => {
        // Tìm dot tương ứng từ danh sách điểm
        return points.find(dot => dot.id === dotId);
      });
    }
  }
  return [];
}

// Lưu id liên kết của toàn bộ điểm
function getAdjacentPairs(lineDots) {
  // Sắp xếp mảng trước
  const sortedDots = sortLineDotsById(lineDots);

  // Tạo mảng kết quả
    const result = [];
    for (let i = 0; i < sortedDots.length - 1; i++) {
        const pair = `${sortedDots[i].id}-${sortedDots[i + 1].id}`;
        result.push(pair);
    }
    return result;
}

function sortLineDotsById(lineDots) {
  return lineDots.sort((a, b) => {
      // Trích xuất số đầu tiên của id và chuyển thành số nguyên
      const numA = parseInt(a.id.split('-')[0]);
      const numB = parseInt(b.id.split('-')[0]);
      return numA - numB;
  });
}

// Hàm vẽ đường thẳng
function drawLine(p1, p2) {
  const lineDots = getLineDots(p1, p2); // Lấy toàn bộ 4 điểm

  // Lưu id liên kết của toàn bộ điểm
  getAdjacentPairs(lineDots).forEach((x) => drawnLines.add(x));

   // Vẽ đường thẳng
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", p1.x);
  line.setAttribute("y1", p1.y);
  line.setAttribute("x2", p2.x);
  line.setAttribute("y2", p2.y);
  line.setAttribute("class", "line");
  gameBoard.appendChild(line);
}

// Hàm kiểm tra và tô màu tam giác
function checkForTriangles() {
  // Duyệt qua các bộ 3 điểm để tìm tam giác
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      for (let k = j + 1; k < points.length; k++) {
        if (isTriangle(points[i], points[j], points[k])) {
          colorTriangle(points[i], points[j], points[k]);
        }
      }
    }
  }
}

// Kiểm tra tam giác hợp lệ
function isTriangle(p1, p2, p3) {

  const dots = [p1, p2, p3];
  // Sắp xếp mảng trước
  const sortedDots = sortLineDotsById(dots);

  const keys = [
    `${p1.id}-${p2.id}`,
    `${p2.id}-${p3.id}`,
    `${p3.id}-${p1.id}`,
  ];

  return keys.every(key => drawnLines.has(key) || drawnLines.has(key.split("-").reverse().join("-")));
}

// Tô màu tam giác
function colorTriangle(p1, p2, p3) {
  const triangleKey = `${p1.id}-${p2.id}-${p3.id}`;
  if (triangles.includes(triangleKey)) return;

  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`);
  polygon.setAttribute("class", `triangle player${currentPlayer + 1}`);
  gameBoard.prepend(polygon);

  triangles.push(triangleKey);
  remainingMoves[currentPlayer] -= 1; // Trừ quân cờ
  updateStatus();
}

// Chuyển đổi người chơi
function switchPlayer() {
  currentPlayer = (currentPlayer + 1) % players.length;
  statusText.textContent = `${players[currentPlayer]}: Lượt của bạn!`;
}

// Cập nhật trạng thái trò chơi
function updateStatus() {
  if (remainingMoves.every(moves => moves === 0)) {
    const winner = remainingMoves[0] > remainingMoves[1] ? players[0] : players[1];
    statusText.textContent = `Trò chơi kết thúc! ${winner} thắng cuộc!`;
  }
}

// Khởi tạo bàn cờ
const points = createBoard();
statusText.textContent = `${players[currentPlayer]}: Lượt của bạn!`;
