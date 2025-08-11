

let gameState = {
    board: initializeBoard(),
    currentPlayer: COLORS.WHITE,
    selectedSquare: null,
    validMoves: [],
    gameStatus: GAME_STATUS.PLAYING,
    moveHistory: [],
    capturedPieces: { white: [], black: [] }
};

const chessboardElement = document.getElementById("chessboard");
const newGameBtn = document.getElementById("newGameBtn");
const undoBtn = document.getElementById("undoBtn");
const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");
const gameStatusDisplay = document.getElementById("gameStatusDisplay");
const capturedPiecesDisplay = document.getElementById("capturedPiecesDisplay");
const moveHistoryDisplay = document.getElementById("moveHistoryDisplay");

function renderBoard() {
    chessboardElement.innerHTML = "";
    gameState.board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.classList.add((rowIndex + colIndex) % 2 === 0 ? "light" : "dark");
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;

            if (piece) {
                square.innerHTML = piece.getSymbol();
            }

            if (gameState.selectedSquare && gameState.selectedSquare.row === rowIndex && gameState.selectedSquare.col === colIndex) {
                square.classList.add("selected");
            }

            if (gameState.validMoves.some(move => move.row === rowIndex && move.col === colIndex)) {
                square.classList.add("valid-move");
            }

            square.addEventListener("click", () => handleSquareClick(rowIndex, colIndex));
            chessboardElement.appendChild(square);
        });
    });
    updateGameInfo();
}

function handleSquareClick(row, col) {
    const clickedPiece = gameState.board[row][col];

    if (!gameState.selectedSquare) {
        if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
            const moves = getPossibleMoves(gameState.board, row, col);
            gameState.selectedSquare = { row, col };
            gameState.validMoves = moves;
        }
    } else {
        if (gameState.selectedSquare.row === row && gameState.selectedSquare.col === col) {
            gameState.selectedSquare = null;
            gameState.validMoves = [];
        } else if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
            const moves = getPossibleMoves(gameState.board, row, col);
            gameState.selectedSquare = { row, col };
            gameState.validMoves = moves;
        } else {
            const isValidMove = gameState.validMoves.some(move => move.row === row && move.col === col);
            if (isValidMove) {
                makeMove(gameState.selectedSquare.row, gameState.selectedSquare.col, row, col);
            } else {
                gameState.selectedSquare = null;
                gameState.validMoves = [];
            }
        }
    }
    renderBoard();
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];

    const move = {
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece: { ...piece },
        capturedPiece: capturedPiece ? { ...capturedPiece } : null,
        pieceHadMoved: piece.hasMoved
    };

    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    piece.position = { row: toRow, col: toCol };
    piece.hasMoved = true;

    const newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece) {
        newCapturedPieces[capturedPiece.color].push(capturedPiece);
    }

    const nextPlayer = gameState.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

    let newGameStatus = GAME_STATUS.PLAYING;
    if (isInCheck(newBoard, nextPlayer)) {
        const hasValidMoves = checkForValidMoves(newBoard, nextPlayer);
        newGameStatus = hasValidMoves ? GAME_STATUS.CHECK : GAME_STATUS.CHECKMATE;
    } else {
        const hasValidMoves = checkForValidMoves(newBoard, nextPlayer);
        if (!hasValidMoves) {
            newGameStatus = GAME_STATUS.STALEMATE;
        }
    }

    gameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedSquare: null,
        validMoves: [],
        gameStatus: newGameStatus,
        moveHistory: [...gameState.moveHistory, move],
        capturedPieces: newCapturedPieces
    };
    renderBoard();
}

function checkForValidMoves(board, color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const moves = getPossibleMoves(board, row, col);
                if (moves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function handleNewGame() {
    gameState = {
        board: initializeBoard(),
        currentPlayer: COLORS.WHITE,
        selectedSquare: null,
        validMoves: [],
        gameStatus: GAME_STATUS.PLAYING,
        moveHistory: [],
        capturedPieces: { white: [], black: [] }
    };
    renderBoard();
}

function handleUndo() {
    if (gameState.moveHistory.length === 0) return;

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const newBoard = gameState.board.map(row => [...row]);

    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;

    if (lastMove.capturedPiece) {
        newBoard[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece;
    } else {
        newBoard[lastMove.to.row][lastMove.to.col] = null;
    }

    if (lastMove.piece) {
        lastMove.piece.position = { row: lastMove.from.row, col: lastMove.from.col };
        lastMove.piece.hasMoved = lastMove.pieceHadMoved;
    }

    const newCapturedPieces = { ...gameState.capturedPieces };
    if (lastMove.capturedPiece) {
        const capturedColor = lastMove.capturedPiece.color;
        newCapturedPieces[capturedColor] = newCapturedPieces[capturedColor].slice(0, -1);
    }

    gameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE,
        selectedSquare: null,
        validMoves: [],
        gameStatus: GAME_STATUS.PLAYING,
        moveHistory: gameState.moveHistory.slice(0, -1),
        capturedPieces: newCapturedPieces
    };
    renderBoard();
}

function updateGameInfo() {
    currentPlayerDisplay.textContent = `Turno: ${gameState.currentPlayer === COLORS.WHITE ? 'Brancas' : 'Pretas'}`;
    gameStatusDisplay.textContent = `Status: ${gameState.gameStatus}`;

    const whiteCaptured = gameState.capturedPieces.white.map(p => PIECE_SYMBOLS[p.color][p.type]).join(" ");
    const blackCaptured = gameState.capturedPieces.black.map(p => PIECE_SYMBOLS[p.color][p.type]).join(" ");
    capturedPiecesDisplay.innerHTML = `Peças Capturadas:<br>Brancas: ${whiteCaptured}<br>Pretas: ${blackCaptured}`;

    moveHistoryDisplay.innerHTML = `Histórico de Movimentos:<br>${gameState.moveHistory.map(move => {
        const from = String.fromCharCode(97 + move.from.col) + (8 - move.from.row);
        const to = String.fromCharCode(97 + move.to.col) + (8 - move.to.row);
        return `${move.piece.getSymbol()} ${from}-${to}`;
    }).join("<br>")}`;

    undoBtn.disabled = gameState.moveHistory.length === 0;
}

newGameBtn.addEventListener("click", handleNewGame);
undoBtn.addEventListener("click", handleUndo);

renderBoard();


