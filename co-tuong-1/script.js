const board = document.getElementById("board");

// Tạo bàn cờ
function createBoard() {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", "cross");
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
        }
    }
}

// Tạo quân cờ
function createPieces() {
    const pieces = [
        // Đội đỏ
        { type: "車", color: "red", row: 9, col: 0 },
        { type: "車", color: "red", row: 9, col: 8 },
        { type: "馬", color: "red", row: 9, col: 1 },
        { type: "馬", color: "red", row: 9, col: 7 },
        { type: "相", color: "red", row: 9, col: 2 },
        { type: "相", color: "red", row: 9, col: 6 },
        { type: "仕", color: "red", row: 9, col: 3 },
        { type: "仕", color: "red", row: 9, col: 5 },
        { type: "帥", color: "red", row: 9, col: 4 },
        { type: "炮", color: "red", row: 7, col: 1 },
        { type: "炮", color: "red", row: 7, col: 7 },
        { type: "兵", color: "red", row: 6, col: 0 },
        { type: "兵", color: "red", row: 6, col: 2 },
        { type: "兵", color: "red", row: 6, col: 4 },
        { type: "兵", color: "red", row: 6, col: 6 },
        { type: "兵", color: "red", row: 6, col: 8 },
        // Đội đen
        { type: "車", color: "black", row: 0, col: 0 },
        { type: "車", color: "black", row: 0, col: 8 },
        { type: "馬", color: "black", row: 0, col: 1 },
        { type: "馬", color: "black", row: 0, col: 7 },
        { type: "象", color: "black", row: 0, col: 2 },
        { type: "象", color: "black", row: 0, col: 6 },
        { type: "士", color: "black", row: 0, col: 3 },
        { type: "士", color: "black", row: 0, col: 5 },
        { type: "將", color: "black", row: 0, col: 4 },
        { type: "炮", color: "black", row: 2, col: 1 },
        { type: "炮", color: "black", row: 2, col: 7 },
        { type: "卒", color: "black", row: 3, col: 0 },
        { type: "卒", color: "black", row: 3, col: 2 },
        { type: "卒", color: "black", row: 3, col: 4 },
        { type: "卒", color: "black", row: 3, col: 6 },
        { type: "卒", color: "black", row: 3, col: 8 },
    ];

    pieces.forEach(({ type, color, row, col }) => {
        const piece = document.createElement("div");
        piece.classList.add("piece", color);
        piece.textContent = type;

        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.appendChild(piece);
    });
}

createBoard();
createPieces();
