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
      className="bg-gray-100 rounded-2xl p-4 h-36 flex flex-col justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 animate-scaleIn"
      style={style}
    >
      <h3 className="text-gray-800 font-semibold text-sm uppercase leading-tight line-clamp-3">
        {document.name}
      </h3>
      
      <div className="flex items-center justify-between">
        <button
          onClick={handleFavoriteClick}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400'
            }`}
          />
        </button>
        
        <span className="bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-full">
          {document.type || 'DOCUMENT'}
        </span>
      </div>
    </div>
  );
}
