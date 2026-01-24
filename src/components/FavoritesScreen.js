'use client';

import { Heart } from 'lucide-react';
import DocumentCard from './DocumentCard';

export default function FavoritesScreen({ 
  favorites, 
  onNavigateToDocument,
  onToggleFavorite 
}) {
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Ulubione</h2>
      </div>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {favorites.map((doc, index) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isFavorite={true}
              onToggleFavorite={() => onToggleFavorite(doc)}
              onClick={() => onNavigateToDocument(doc)}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Brak ulubionych dokumentów</p>
          <p className="text-gray-400 text-sm mt-1">Dodaj dokumenty do ulubionych klikając serduszko</p>
        </div>
      )}
    </div>
  );
}
