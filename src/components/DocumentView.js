'use client';

import { useState } from 'react';
import { Heart, Download, ExternalLink, AlertCircle } from 'lucide-react';

export default function DocumentView({ document, isFavorite, onToggleFavorite }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  // Google Docs Viewer dla PDF
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(document.pdfUrl)}&embedded=true`;

  return (
    <div className="animate-fadeIn">
      {/* Document header */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800 mb-1">
              {document.name}
            </h1>
            <span className="inline-block bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-full">
              {document.type || 'DOCUMENT'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${
                  isFavorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400'
                }`}
              />
            </button>
            
            <a
              href={document.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Otwórz w nowej karcie"
            >
              <ExternalLink className="w-6 h-6 text-gray-400" />
            </a>
            
            <a
              href={document.pdfUrl}
              download
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Pobierz"
            >
              <Download className="w-6 h-6 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {loading && (
          <div className="flex items-center justify-center h-96 bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-gray-500">Ładowanie dokumentu...</p>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 p-6">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nie można załadować dokumentu
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Dokument PDF nie jest dostępny lub wystąpił błąd podczas ładowania.
            </p>
            <div className="flex gap-3">
              <a
                href={document.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Otwórz w nowej karcie
              </a>
              <a
                href={document.pdfUrl}
                download
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                Pobierz PDF
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={googleViewerUrl}
            className={`pdf-viewer ${loading ? 'hidden' : ''}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={document.name}
            allowFullScreen
          />
        )}
      </div>

      {/* Alternative download option */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm mb-2">
          Masz problem z wyświetleniem dokumentu?
        </p>
        <a
          href={document.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm font-medium"
        >
          Kliknij tutaj, aby otworzyć PDF bezpośrednio
        </a>
      </div>
    </div>
  );
}
