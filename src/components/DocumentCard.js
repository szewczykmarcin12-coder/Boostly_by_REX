'use client';

import { Heart } from 'lucide-react';

export default function DocumentCard({ 
  document, 
  isFavorite, 
  onToggleFavorite, 
  onClick,
  style 
}) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 h-36 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-all duration-200 animate-scaleIn relative"
      style={{ backgroundColor: '#00b6ae', ...style }}
    >
      {/* Document name - top left */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-sm uppercase leading-tight line-clamp-3 flex-1">
          {document.name}
        </h3>
        
        {/* Heart icon - top right */}
        <button
          onClick={handleFavoriteClick}
          className="p-1 hover:scale-110 transition-transform flex-shrink-0 -mt-0.5 -mr-1"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite 
                ? 'fill-red-400 text-red-400' 
                : 'text-white/70'
            }`}
          />
        </button>
      </div>
      
      {/* Bottom row: doc lines icon left, DOCUMENT badge right */}
      <div className="flex items-end justify-between">
        {/* White document lines icon - bottom left */}
        <img 
          src="/doc-lines-icon.png" 
          alt="" 
          className="w-8 h-8 object-contain opacity-90"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        
        {/* DOCUMENT badge - orange */}
        <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          {document.type || 'DOCUMENT'}
        </span>
      </div>
    </div>
  );
}
