import React from 'react';

const ChessSquare = ({ 
  row, 
  col, 
  piece, 
  isSelected, 
  isValidMove, 
  onClick, 
  isDark 
}) => {
  const baseClasses = "w-full h-full flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-bold cursor-pointer transition-all duration-300 border border-gray-400 relative overflow-hidden";
  
  const backgroundClasses = isDark 
    ? "bg-amber-900 hover:bg-amber-800" 
    : "bg-amber-50 hover:bg-amber-100";
  
  const selectionClasses = isSelected 
    ? "ring-4 ring-blue-500 bg-blue-200 shadow-lg shadow-blue-500/50" 
    : "";
  
  const validMoveClasses = isValidMove 
    ? "shadow-inner shadow-green-500 bg-green-200 hover:bg-green-300 ring-2 ring-green-400" 
    : "";

  // Estilo especial para peças brancas
  const getWhitePieceStyle = () => {
    if (!piece || piece.color !== 'white') return '';
    
    return `
      text-transparent bg-clip-text bg-gradient-to-br from-slate-100 via-white to-gray-200
      filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] 
      drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]
      drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]
      hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.5)]
      transition-all duration-300
      relative
    `;
  };

  const getBlackPieceStyle = () => {
    if (!piece || piece.color !== 'black') return '';
    
    return `
      text-gray-900 
      filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]
      hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]
      transition-all duration-300
    `;
  };

  return (
    <div
      className={`${baseClasses} ${backgroundClasses} ${selectionClasses} ${validMoveClasses}`}
      onClick={onClick}
    >
      {/* Efeito de brilho para peças brancas */}
      {piece && piece.color === 'white' && (
        <>
          {/* Aura de luz de fundo */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-200/20 via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          {/* Reflexo sutil */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent opacity-60 pointer-events-none"></div>
        </>
      )}
      
      {piece && (
        <span 
          className={`
            select-none relative z-10 
            ${piece.color === 'white' ? getWhitePieceStyle() : getBlackPieceStyle()}
            hover:scale-110 transform transition-transform duration-200
          `}
          style={{
            // Gradiente personalizado para peças brancas
            ...(piece.color === 'white' && {
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(0, 0, 0, 0.8)',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.3))'
            })
          }}
        >
          {piece.getSymbol()}
          
          {/* Efeito de cristal para peças brancas */}
          {piece.color === 'white' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-200/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
          )}
        </span>
      )}
      
      {/* Partículas decorativas para peças brancas selecionadas */}
      {piece && piece.color === 'white' && isSelected && (
        <>
          <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-0.5 h-0.5 bg-blue-300 rounded-full animate-bounce"></div>
        </>
      )}
    </div>
  );
};

export default ChessSquare;

