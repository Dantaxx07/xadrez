import React from 'react';
import { Crown, AlertTriangle, Trophy, Handshake } from 'lucide-react';

const GameStatus = ({
  gameStatus,
  currentPlayer,
  capturedPieces
}) => {
  const getStatusIcon = () => {
    switch (gameStatus) {
      case 'check':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'checkmate':
        return <Trophy className="w-5 h-5 text-red-600" />;
      case 'stalemate':
        return <Handshake className="w-5 h-5 text-gray-600" />;
      default:
        return <Crown className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (gameStatus) {
      case 'check':
        return `Xeque! ${currentPlayer === 'white' ? 'Brancas' : 'Pretas'} em perigo`;
      case 'checkmate':
        return `Xeque-mate! ${currentPlayer === 'white' ? 'Pretas' : 'Brancas'} vencem`;
      case 'stalemate':
        return 'Empate por afogamento';
      default:
        return 'Jogo em andamento';
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'checkmate':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'stalemate':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Status do Jogo
      </h2>
      
      {/* Status atual */}
      <div className={`flex items-center p-3 rounded-lg border mb-4 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="ml-2 font-medium text-sm">
          {getStatusText()}
        </span>
      </div>

      {/* Peças capturadas */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Peças Capturadas</h3>
        
        {/* Peças brancas capturadas */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-1">Brancas</h4>
          <div className="min-h-[2rem] p-2 bg-gray-50 rounded-lg border">
            {capturedPieces.white.length === 0 ? (
              <span className="text-xs text-gray-400">Nenhuma</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-lg">
                    {piece.getSymbol()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Peças pretas capturadas */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-1">Pretas</h4>
          <div className="min-h-[2rem] p-2 bg-gray-50 rounded-lg border">
            {capturedPieces.black.length === 0 ? (
              <span className="text-xs text-gray-400">Nenhuma</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-lg">
                    {piece.getSymbol()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pontuação material */}
        <div className="pt-2 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-600 mb-1">Vantagem Material</h4>
          <div className="text-sm">
            {(() => {
              const whiteCapturedValue = capturedPieces.white.reduce((sum, piece) => {
                const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9 };
                return sum + (values[piece.type] || 0);
              }, 0);
              
              const blackCapturedValue = capturedPieces.black.reduce((sum, piece) => {
                const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9 };
                return sum + (values[piece.type] || 0);
              }, 0);
              
              const difference = blackCapturedValue - whiteCapturedValue;
              
              if (difference === 0) {
                return <span className="text-gray-600">Equilibrado</span>;
              } else if (difference > 0) {
                return <span className="text-blue-600">Brancas +{difference}</span>;
              } else {
                return <span className="text-red-600">Pretas +{Math.abs(difference)}</span>;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;

