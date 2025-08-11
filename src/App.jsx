import React, { useState, useCallback } from 'react';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import GameStatus from './components/GameStatus';
import { 
  initializeBoard, 
  getPossibleMoves, 
  isInCheck, 
  COLORS, 
  GAME_STATUS 
} from './lib/chessLogic';
import './App.css';

function App() {
  // Estado inicial do jogo
  const [gameState, setGameState] = useState(() => ({
    board: initializeBoard(),
    currentPlayer: COLORS.WHITE,
    selectedSquare: null,
    validMoves: [],
    gameStatus: GAME_STATUS.PLAYING,
    moveHistory: [],
    capturedPieces: { white: [], black: [] }
  }));

  // Função para iniciar um novo jogo
  const handleNewGame = useCallback(() => {
    setGameState({
      board: initializeBoard(),
      currentPlayer: COLORS.WHITE,
      selectedSquare: null,
      validMoves: [],
      gameStatus: GAME_STATUS.PLAYING,
      moveHistory: [],
      capturedPieces: { white: [], black: [] }
    });
  }, []);

  // Função para desfazer o último movimento
  const handleUndo = useCallback(() => {
    if (gameState.moveHistory.length === 0) return;

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const newBoard = gameState.board.map(row => [...row]);
    
    // Restaurar a peça na posição original
    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    
    // Restaurar a peça capturada (se houver)
    if (lastMove.capturedPiece) {
      newBoard[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece;
    } else {
      newBoard[lastMove.to.row][lastMove.to.col] = null;
    }

    // Restaurar o estado da peça
    if (lastMove.piece) {
      lastMove.piece.position = { row: lastMove.from.row, col: lastMove.from.col };
      lastMove.piece.hasMoved = lastMove.pieceHadMoved;
    }

    // Remover peça capturada da lista
    const newCapturedPieces = { ...gameState.capturedPieces };
    if (lastMove.capturedPiece) {
      const capturedColor = lastMove.capturedPiece.color;
      newCapturedPieces[capturedColor] = newCapturedPieces[capturedColor].slice(0, -1);
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE,
      selectedSquare: null,
      validMoves: [],
      gameStatus: GAME_STATUS.PLAYING,
      moveHistory: prev.moveHistory.slice(0, -1),
      capturedPieces: newCapturedPieces
    }));
  }, [gameState]);

  // Função para lidar com cliques nas casas
  const handleSquareClick = useCallback((row, col) => {
    const { board, currentPlayer, selectedSquare, validMoves } = gameState;
    const clickedPiece = board[row][col];

    // Se não há casa selecionada
    if (!selectedSquare) {
      // Selecionar peça do jogador atual
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        const moves = getPossibleMoves(board, row, col);
        setGameState(prev => ({
          ...prev,
          selectedSquare: { row, col },
          validMoves: moves
        }));
      }
      return;
    }

    // Se clicou na mesma casa, desselecionar
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
      return;
    }

    // Se clicou em outra peça do mesmo jogador, selecionar ela
    if (clickedPiece && clickedPiece.color === currentPlayer) {
      const moves = getPossibleMoves(board, row, col);
      setGameState(prev => ({
        ...prev,
        selectedSquare: { row, col },
        validMoves: moves
      }));
      return;
    }

    // Verificar se é um movimento válido
    const isValidMove = validMoves.some(move => move.row === row && move.col === col);
    if (!isValidMove) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
      return;
    }

    // Executar o movimento
    makeMove(selectedSquare.row, selectedSquare.col, row, col);
  }, [gameState]);

  // Função para executar um movimento
  const makeMove = useCallback((fromRow, fromCol, toRow, toCol) => {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];
    
    // Criar registro do movimento
    const move = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: { ...piece },
      capturedPiece: capturedPiece ? { ...capturedPiece } : null,
      pieceHadMoved: piece.hasMoved
    };

    // Executar o movimento
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Atualizar posição e status da peça
    piece.position = { row: toRow, col: toCol };
    piece.hasMoved = true;

    // Atualizar peças capturadas
    const newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color].push(capturedPiece);
    }

    // Alternar jogador
    const nextPlayer = gameState.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    
    // Verificar status do jogo
    let newGameStatus = GAME_STATUS.PLAYING;
    if (isInCheck(newBoard, nextPlayer)) {
      // Verificar se há movimentos válidos (xeque-mate vs xeque)
      const hasValidMoves = checkForValidMoves(newBoard, nextPlayer);
      newGameStatus = hasValidMoves ? GAME_STATUS.CHECK : GAME_STATUS.CHECKMATE;
    } else {
      // Verificar empate por afogamento
      const hasValidMoves = checkForValidMoves(newBoard, nextPlayer);
      if (!hasValidMoves) {
        newGameStatus = GAME_STATUS.STALEMATE;
      }
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedSquare: null,
      validMoves: [],
      gameStatus: newGameStatus,
      moveHistory: [...prev.moveHistory, move],
      capturedPieces: newCapturedPieces
    }));
  }, [gameState]);

  // Função auxiliar para verificar se há movimentos válidos
  const checkForValidMoves = (board, color) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-7xl">
        {/* Cabeçalho */}
        <header className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Xadrez Online - 2 Jogadores
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Jogo responsivo para dois jogadores
          </p>
        </header>

        {/* Layout principal - Otimizado para manter o tabuleiro sempre visível */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-6 items-start">
          
          {/* Tabuleiro - Sempre prioritário e centralizado */}
          <div className="w-full lg:col-span-6 lg:col-start-4 order-1 flex justify-center">
            <div className="w-full max-w-[min(95vw,70vh,600px)] lg:max-w-[min(85vw,85vh,600px)]">
              <ChessBoard
                board={gameState.board}
                selectedSquare={gameState.selectedSquare}
                validMoves={gameState.validMoves}
                onSquareClick={handleSquareClick}
                currentPlayer={gameState.currentPlayer}
              />
            </div>
          </div>

          {/* Controles - Esquerda no desktop, acima do tabuleiro no mobile */}
          <div className="w-full lg:col-span-3 lg:col-start-1 lg:row-start-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <GameControls
                onNewGame={handleNewGame}
                onUndo={handleUndo}
                canUndo={gameState.moveHistory.length > 0}
                currentPlayer={gameState.currentPlayer}
                moveHistory={gameState.moveHistory}
              />
            </div>
          </div>

          {/* Status - Direita no desktop, abaixo do tabuleiro no mobile */}
          <div className="w-full lg:col-span-3 lg:col-start-10 lg:row-start-1 order-3">
            <div className="lg:sticky lg:top-4">
              <GameStatus
                gameStatus={gameState.gameStatus}
                currentPlayer={gameState.currentPlayer}
                capturedPieces={gameState.capturedPieces}
              />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm">
          <p>Desenvolvido com React e Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App
