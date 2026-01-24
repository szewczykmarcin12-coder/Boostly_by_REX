'use client';

import { Clock } from 'lucide-react';
import DocumentCard from './DocumentCard';

export default function RecentScreen({ 
  recentDocuments, 
  onNavigateToDocument,
  favorites,
  onToggleFavorite 
}) {
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Ostatnio dodane</h2>
      </div>
      
      {recentDocuments.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {recentDocuments.map((doc, index) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isFavorite={favorites.some(f => f.id === doc.id)}
              onToggleFavorite={() => onToggleFavorite(doc)}
              onClick={() => onNavigateToDocument(doc)}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Brak ostatnio przeglądanych dokumentów</p>
          <p className="text-gray-400 text-sm mt-1">Przeglądane dokumenty pojawią się tutaj</p>
        </div>
      )}
    </div>
  );
}
