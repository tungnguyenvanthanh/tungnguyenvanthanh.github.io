// Define game variables
const boardSize = 300;
const pieceRadius = 15;
let selectedPiece = null;
let currentPlayer = 'A';

// Check if a move is within board bounds and allowed by rules
function isValidMove(x, y, piece) {
    const px = piece.cx.baseVal.value;
    const py = piece.cy.baseVal.value;

    if (x < 0 || y < 0 || x > boardSize || y > boardSize) return false; // Out of bounds
    if ((x === 0 || y === 0) && (px === 0 && py === 300)) return false;
    if ((x === 0 || y === 300) && (px === 0 && py === 0)) return false;

    // Allow movement only along edges and diagonals from/to corners/center
    const dx = Math.abs(x - px);
    const dy = Math.abs(y - py);
    return dx === boardSize || dy === boardSize || dx === dy || (x === 150 && y === 150);
}

// Handle piece selection
document.querySelectorAll('.piece').forEach(piece => {
    piece.addEventListener('click', () => {
        if (selectedPiece) {
            selectedPiece = null; // Cancel selection
        } else if (piece.dataset.player === currentPlayer) {
            selectedPiece = piece;
        }
    });
});

function findUniqueLocation() {
    // Lấy tất cả các thẻ 'location'
    const locations = Array.from(document.querySelectorAll('.location'));
    // Lấy tất cả các thẻ 'piece'
    const pieces = Array.from(document.querySelectorAll('.piece'));

    for (let loc of locations) {
        let isUnique = true;
        for (let piece of pieces) {
            if (loc.getAttribute('cx') === piece.getAttribute('cx') && loc.getAttribute('cy') === piece.getAttribute('cy')) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            return loc;
        }
    }
    return null;
}

// Handle location click to move the selected piece
document.querySelectorAll('.location').forEach(location => {
    location.addEventListener('click', (event) => {
        if (selectedPiece) {
            const x = location.cx.baseVal.value;
            const y = location.cy.baseVal.value;
            if (isValidMove(x, y, selectedPiece)) {
                selectedPiece.cx.baseVal.value = x;
                selectedPiece.cy.baseVal.value = y;
                checkGameOver();
                selectedPiece = null;
                currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
            } else {
                selectedPiece = null; // Cancel selection
            }
        }
    });
});

// Check if a player has any valid moves left
function hasValidMoves(player) {
    const location = findUniqueLocation();
    if(location){
        const cx = location.cx.baseVal.value;
        const cy = location.cy.baseVal.value;
        if(cx === 0 && cy === 0){
            let num = 0;
            Array.from(document.querySelectorAll(`.piece[data-player="${player}"]`)).some(piece => {
                const x = piece.cx.baseVal.value;
                const y = piece.cy.baseVal.value;
        
                if((x === 0 && y === 300) || (x === 300 && y === 300)){
                    num++;
                }
            });

            if(num == 2){
                return false;
            }
        }else if(cx === 0 && cy === 300){
            let num = 0;
            Array.from(document.querySelectorAll(`.piece[data-player="${player}"]`)).some(piece => {
                const x = piece.cx.baseVal.value;
                const y = piece.cy.baseVal.value;
        
                if((x === 0 && y === 0) || (x === 300 && y === 0)){
                    num++;
                }
            });

            if(num == 2){
                return false;
            }
        }
    }
    return true;
}

// Check for game over after each move
function checkGameOver() {
    if (!hasValidMoves(currentPlayer === 'A' ? 'B' : 'A')) {
        const color = currentPlayer === 'A' ? 'Xanh' : 'Đỏ';
        alert(`Player ${color} wins!`);
    }
}
