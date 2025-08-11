import React from 'react';
import ChessSquare from './ChessSquare';

const ChessBoard = ({ 
  board, 
  selectedSquare, 
  validMoves, 
  onSquareClick,
  currentPlayer 
}) => {
  return (
    <div className="chess-board-container w-full flex justify-center p-2">
      {/* Layout assimétrico com bordas diferentes e rotação sutil */}
      <div className="chess-board-wrapper relative">
        {/* Sombra assimétrica */}
        <div className="absolute -inset-2 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-800/30 rounded-2xl blur-xl transform rotate-1"></div>
        
        {/* Tabuleiro principal com formato assimétrico */}
        <div className="chess-board relative grid grid-cols-8 gap-0 w-full max-w-[min(85vw,85vh,600px)] aspect-square border-l-8 border-t-4 border-r-2 border-b-6 border-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-3xl overflow-hidden shadow-2xl bg-white transform -rotate-1 hover:rotate-0 transition-transform duration-500">
          
          {/* Borda interna assimétrica */}
          <div className="absolute inset-0 border-2 border-amber-600/50 rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-3xl pointer-events-none"></div>
          
          {/* Padrão decorativo no canto superior esquerdo */}
          <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-80 shadow-lg"></div>
          
          {/* Padrão decorativo no canto inferior direito */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-tl from-amber-500 to-amber-700 rounded-lg opacity-70 shadow-xl transform rotate-45"></div>
          
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                piece={piece}
                isSelected={
                  selectedSquare && 
                  selectedSquare.row === rowIndex && 
                  selectedSquare.col === colIndex
                }
                isValidMove={validMoves.some(
                  move => move.row === rowIndex && move.col === colIndex
                )}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                isDark={(rowIndex + colIndex) % 2 === 1}
              />
            ))
          )}
        </div>
        
        {/* Elementos decorativos assimétricos ao redor */}
        <div className="absolute -top-4 -right-6 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-6 -left-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 -left-8 w-1 h-6 bg-gradient-to-b from-amber-400 to-transparent rounded-full"></div>
        <div className="absolute top-1/4 -right-8 w-1 h-4 bg-gradient-to-b from-amber-500 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default ChessBoard;

