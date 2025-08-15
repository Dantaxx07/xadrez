// Cores das peças
const COLORS = {
  WHITE: 'white',
  BLACK: 'black'
};

// Status do jogo
const GAME_STATUS = {
  PLAYING: 'playing',
  CHECK: 'check',
  CHECKMATE: 'checkmate',
  STALEMATE: 'stalemate'
};

// Tipos de peças
const PIECE_TYPES = {
  KING: 'king',
  QUEEN: 'queen',
  ROOK: 'rook',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  PAWN: 'pawn'
};

// Símbolos Unicode das peças
const PIECE_SYMBOLS = {
  [COLORS.WHITE]: {
    [PIECE_TYPES.KING]: '♔',
    [PIECE_TYPES.QUEEN]: '♕',
    [PIECE_TYPES.ROOK]: '♖',
    [PIECE_TYPES.BISHOP]: '♗',
    [PIECE_TYPES.KNIGHT]: '♘',
    [PIECE_TYPES.PAWN]: '♙'
  },
  [COLORS.BLACK]: {
    [PIECE_TYPES.KING]: '♚',
    [PIECE_TYPES.QUEEN]: '♛',
    [PIECE_TYPES.ROOK]: '♜',
    [PIECE_TYPES.BISHOP]: '♝',
    [PIECE_TYPES.KNIGHT]: '♞',
    [PIECE_TYPES.PAWN]: '♟'
  }
};

// Classe para representar uma peça
class ChessPiece {
  constructor(type, color, row, col) {
    this.type = type;
    this.color = color;
    this.position = { row, col };
    this.hasMoved = false;
  }

  getSymbol() {
    return PIECE_SYMBOLS[this.color][this.type];
  }

  copy() {
    const piece = new ChessPiece(this.type, this.color, this.position.row, this.position.col);
    piece.hasMoved = this.hasMoved;
    return piece;
  }
}

// Inicializar o tabuleiro
function initializeBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  // Peças pretas
  board[0][0] = new ChessPiece(PIECE_TYPES.ROOK, COLORS.BLACK, 0, 0);
  board[0][1] = new ChessPiece(PIECE_TYPES.KNIGHT, COLORS.BLACK, 0, 1);
  board[0][2] = new ChessPiece(PIECE_TYPES.BISHOP, COLORS.BLACK, 0, 2);
  board[0][3] = new ChessPiece(PIECE_TYPES.QUEEN, COLORS.BLACK, 0, 3);
  board[0][4] = new ChessPiece(PIECE_TYPES.KING, COLORS.BLACK, 0, 4);
  board[0][5] = new ChessPiece(PIECE_TYPES.BISHOP, COLORS.BLACK, 0, 5);
  board[0][6] = new ChessPiece(PIECE_TYPES.KNIGHT, COLORS.BLACK, 0, 6);
  board[0][7] = new ChessPiece(PIECE_TYPES.ROOK, COLORS.BLACK, 0, 7);

  // Peões pretos
  for (let col = 0; col < 8; col++) {
    board[1][col] = new ChessPiece(PIECE_TYPES.PAWN, COLORS.BLACK, 1, col);
  }

  // Peões brancos
  for (let col = 0; col < 8; col++) {
    board[6][col] = new ChessPiece(PIECE_TYPES.PAWN, COLORS.WHITE, 6, col);
  }

  // Peças brancas
  board[7][0] = new ChessPiece(PIECE_TYPES.ROOK, COLORS.WHITE, 7, 0);
  board[7][1] = new ChessPiece(PIECE_TYPES.KNIGHT, COLORS.WHITE, 7, 1);
  board[7][2] = new ChessPiece(PIECE_TYPES.BISHOP, COLORS.WHITE, 7, 2);
  board[7][3] = new ChessPiece(PIECE_TYPES.QUEEN, COLORS.WHITE, 7, 3);
  board[7][4] = new ChessPiece(PIECE_TYPES.KING, COLORS.WHITE, 7, 4);
  board[7][5] = new ChessPiece(PIECE_TYPES.BISHOP, COLORS.WHITE, 7, 5);
  board[7][6] = new ChessPiece(PIECE_TYPES.KNIGHT, COLORS.WHITE, 7, 6);
  board[7][7] = new ChessPiece(PIECE_TYPES.ROOK, COLORS.WHITE, 7, 7);

  return board;
}

// Verificar se uma posição está dentro do tabuleiro
function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// ---------------- Movimentos ----------------

// Movimentos do peão (inclui avanços, capturas e en passant)
function getPawnMoves(board, row, col, piece) {
  const moves = [];
  const direction = piece.color === COLORS.WHITE ? -1 : 1;
  const startRow = piece.color === COLORS.WHITE ? 6 : 1;

  // Movimento para frente
  const newRow = row + direction;
  if (isValidPosition(newRow, col) && !board[newRow][col]) {
    moves.push({ row: newRow, col });

    // Movimento duplo inicial
    if (row === startRow && !board[newRow + direction]?.[col]) {
      moves.push({ row: newRow + direction, col });
    }
  }

  // Capturas diagonais
  for (const deltaCol of [-1, 1]) {
    const newCol = col + deltaCol;
    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  // Lógica para En Passant
  const lastMove = window.lastMove;
  if (
    lastMove &&
    lastMove.piece.type === PIECE_TYPES.PAWN &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    lastMove.to.row === row &&
    Math.abs(lastMove.to.col - col) === 1
  ) {
    const enPassantTargetCol = lastMove.to.col;
    const enPassantCaptureRow = row + direction;
    if (isValidPosition(enPassantCaptureRow, enPassantTargetCol)) {
      moves.push({ row: enPassantCaptureRow, col: enPassantTargetCol, enPassant: true });
    }
  }

  return moves;
}

// Somente casas atacadas por peão (sem avanços) — para uso em isInCheck
function getPawnAttacks(board, row, col, piece) {
  const moves = [];
  const direction = piece.color === COLORS.WHITE ? -1 : 1;
  const newRow = row + direction;
  for (const deltaCol of [-1, 1]) {
    const newCol = col + deltaCol;
    if (isValidPosition(newRow, newCol)) {
      moves.push({ row: newRow, col: newCol });
    }
  }
  return moves;
}

// Movimentos da torre
function getRookMoves(board, row, col, piece) {
  const moves = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (const [deltaRow, deltaCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const newRow = row + deltaRow * i;
      const newCol = col + deltaCol * i;

      if (!isValidPosition(newRow, newCol)) break;

      const targetPiece = board[newRow][newCol];
      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  }

  return moves;
}

// Movimentos do cavalo
function getKnightMoves(board, row, col, piece) {
  const moves = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  for (const [deltaRow, deltaCol] of knightMoves) {
    const newRow = row + deltaRow;
    const newCol = col + deltaCol;

    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
}

// Movimentos do bispo
function getBishopMoves(board, row, col, piece) {
  const moves = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (const [deltaRow, deltaCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const newRow = row + deltaRow * i;
      const newCol = col + deltaCol * i;

      if (!isValidPosition(newRow, newCol)) break;

      const targetPiece = board[newRow][newCol];
      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  }

  return moves;
}

// Movimentos da rainha
function getQueenMoves(board, row, col, piece) {
  return [
    ...getRookMoves(board, row, col, piece),
    ...getBishopMoves(board, row, col, piece)
  ];
}

// Movimentos básicos do rei (sem roque) — para uso em isInCheck
function getKingMovesBasic(board, row, col, piece) {
  const moves = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [deltaRow, deltaCol] of directions) {
    const newRow = row + deltaRow;
    const newCol = col + deltaCol;

    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
}

// Movimentos do rei (com roque) — uso normal (com validação posterior de xeque)
function getKingMoves(board, row, col, piece) {
  const moves = getKingMovesBasic(board, row, col, piece);

  // Roque
  if (!piece.hasMoved && !isInCheck(board, piece.color)) {
    const kingRow = piece.color === COLORS.WHITE ? 7 : 0;

    // Roque pequeno (Kingside)
    const kingsideRook = board[kingRow][7];
    if (
      kingsideRook && kingsideRook.type === PIECE_TYPES.ROOK && !kingsideRook.hasMoved &&
      !board[kingRow][5] && !board[kingRow][6] &&
      !wouldBeInCheck(board, piece.color, kingRow, 4, kingRow, 5) &&
      !wouldBeInCheck(board, piece.color, kingRow, 4, kingRow, 6)
    ) {
      moves.push({ row: kingRow, col: 6, castle: true, castleType: 'kingside' });
    }

    // Roque grande (Queenside)
    const queensideRook = board[kingRow][0];
    if (
      queensideRook && queensideRook.type === PIECE_TYPES.ROOK && !queensideRook.hasMoved &&
      !board[kingRow][1] && !board[kingRow][2] && !board[kingRow][3] &&
      !wouldBeInCheck(board, piece.color, kingRow, 4, kingRow, 3) &&
      !wouldBeInCheck(board, piece.color, kingRow, 4, kingRow, 2)
    ) {
      moves.push({ row: kingRow, col: 2, castle: true, castleType: 'queenside' });
    }
  }

  return moves;
}

// Obter movimentos possíveis (com filtro para não deixar o rei em xeque)
function getPossibleMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];

  let moves = [];

  switch (piece.type) {
    case PIECE_TYPES.PAWN:
      moves = getPawnMoves(board, row, col, piece);
      break;
    case PIECE_TYPES.ROOK:
      moves = getRookMoves(board, row, col, piece);
      break;
    case PIECE_TYPES.KNIGHT:
      moves = getKnightMoves(board, row, col, piece);
      break;
    case PIECE_TYPES.BISHOP:
      moves = getBishopMoves(board, row, col, piece);
      break;
    case PIECE_TYPES.QUEEN:
      moves = getQueenMoves(board, row, col, piece);
      break;
    case PIECE_TYPES.KING:
      moves = getKingMoves(board, row, col, piece);
      break;
  }

  // Filtrar movimentos que deixariam o rei em xeque
  return moves.filter(move => !wouldBeInCheck(board, piece.color, row, col, move.row, move.col));
}

// Obter movimentos possíveis sem validação de xeque (para evitar recursão infinita)
// Aqui: peão ataca só em diagonal, e rei sem roque.
function getPossibleMovesWithoutCheckValidation(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];

  switch (piece.type) {
    case PIECE_TYPES.PAWN:
      return getPawnAttacks(board, row, col, piece);
    case PIECE_TYPES.ROOK:
      return getRookMoves(board, row, col, piece);
    case PIECE_TYPES.KNIGHT:
      return getKnightMoves(board, row, col, piece);
    case PIECE_TYPES.BISHOP:
      return getBishopMoves(board, row, col, piece);
    case PIECE_TYPES.QUEEN:
      return getQueenMoves(board, row, col, piece);
    case PIECE_TYPES.KING:
      return getKingMovesBasic(board, row, col, piece);
    default:
      return [];
  }
}

// Verificar se o rei está em xeque
function isInCheck(board, color) {
  // Encontrar o rei
  let kingPosition = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PIECE_TYPES.KING && piece.color === color) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return false;

  // Verificar se alguma peça inimiga pode atacar o rei
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        const moves = getPossibleMovesWithoutCheckValidation(board, row, col);
        if (moves.some(move => move.row === kingPosition.row && move.col === kingPosition.col)) {
          return true;
        }
      }
    }
  }

  return false;
}

// Verificar se um movimento deixaria o rei em xeque
function wouldBeInCheck(board, color, fromRow, fromCol, toRow, toCol) {
  // Simular o movimento (cópia rasa é suficiente pois armazenamos objetos de peça)
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol];
  const capturedPiece = newBoard[toRow][toCol];

  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;

  const result = isInCheck(newBoard, color);

  // Restaurar (não estritamente necessário aqui, pois newBoard é local)
  newBoard[fromRow][fromCol] = piece;
  newBoard[toRow][toCol] = capturedPiece;

  return result;
}
