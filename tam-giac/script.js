const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");

const rows = 4; // Lục giác với cạnh có 4 trụ
const radius = 10; // Kích thước điểm
const margin = 80; // Khoảng cách giữa các điểm
const players = ["Người chơi 1", "Người chơi 2"];
let currentPlayer = 0;
const centerX = 60; // Tâm của hình lục giác
const centerY = 300;
const totalRows = rows * 2 - 1; // Tổng số hàng trong hình lục giác

// Vẽ bàn cờ
function createBoard() {
  const points = [];

  for (let row = 0; row < totalRows; row++) {
    const isUpperHalf = row < rows; // Xác định nửa trên hoặc dưới
    const count = isUpperHalf ? rows + row : rows * 2 - (row - rows + 2); // Số điểm trong hàng
    const y = centerY + (row - (rows - 1)) * margin; // Vị trí Y của hàng
    const offset = (rows * 2 - 1 - count) * margin / 2; // Dịch chuyển X để cân đối

    for (let col = 0; col < count; col++) {
      const x = centerX + offset + col * margin;
      const point = { x, y, row, col };
      points.push(point);

      // Vẽ điểm
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", radius);
      circle.setAttribute("class", "dot");
      circle.addEventListener("click", () => handlePointClick(point));
      gameBoard.appendChild(circle);
    }
  }
  return points;
}

function handlePointClick(point) {
  // Xử lý khi chọn điểm (mở rộng nếu cần)
  console.log("Clicked:", point);
}

// Khởi tạo bàn cờ
createBoard();
statusText.textContent = `Lượt chơi: ${players[currentPlayer]}`;
