import React from 'react';
import { Button } from './ui/button';
import { RotateCcw, Play } from 'lucide-react';

const GameControls = ({
  onNewGame,
  onUndo,
  canUndo,
  currentPlayer,
  moveHistory
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Controles
      </h2>
      
      <div className="space-y-4">
        {/* Botões principais */}
        <div className="space-y-2">
          <Button 
            onClick={onNewGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Novo Jogo
          </Button>
          
          <Button 
            onClick={onUndo}
            disabled={!canUndo}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Desfazer
          </Button>
        </div>

        {/* Turno atual */}
        <div className="pt-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Turno Atual</h3>
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <div className={`w-6 h-6 rounded-full mr-2 ${
              currentPlayer === 'white' ? 'bg-white border-2 border-gray-400' : 'bg-gray-800'
            }`}></div>
            <span className="font-medium">
              {currentPlayer === 'white' ? 'Brancas' : 'Pretas'}
            </span>
          </div>
        </div>

        {/* Histórico de movimentos */}
        <div className="pt-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Movimentos: {moveHistory.length}
          </h3>
          <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 max-h-32 overflow-y-auto">
            {moveHistory.length === 0 ? (
              <p>Nenhum movimento ainda</p>
            ) : (
              <div className="space-y-1">
                {moveHistory.slice(-5).map((move, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{moveHistory.length - 4 + index}.</span>
                    <span>
                      {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} → {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;

