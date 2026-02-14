'use client';

import { Clock, Heart, ChevronRight } from 'lucide-react';
import DocumentCard from './DocumentCard';

export default function HomeScreen({ 
  recentDocuments, 
  favorites, 
  onNavigateToDocument,
  onToggleFavorite 
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner with Popeyes logo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 h-48">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img 
            src="/popeyes-logo.png" 
            alt="Popeyes Louisiana Kitchen" 
            className="max-h-28 w-auto object-contain"
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-400/30 rounded-full"></div>
        <div className="absolute -left-5 -top-5 w-24 h-24 bg-orange-400/20 rounded-full"></div>
      </div>

      {/* Standardy pracy text */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-700">Standardy pracy</h2>
      </div>

      {/* Recently added section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Ostatnio przeglądane</h2>
        </div>
        
        {recentDocuments.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {recentDocuments.slice(0, 4).map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isFavorite={favorites.some(f => f.id === doc.id)}
                onToggleFavorite={() => onToggleFavorite(doc)}
                onClick={() => onNavigateToDocument(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-500">Brak ostatnio przeglądanych dokumentów</p>
          </div>
        )}
      </section>

      {/* Favorites section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Ulubione</h2>
        </div>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {favorites.slice(0, 4).map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(doc)}
                onClick={() => onNavigateToDocument(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Dodaj dokumenty do ulubionych</p>
          </div>
        )}
      </section>
    </div>
  );
}
