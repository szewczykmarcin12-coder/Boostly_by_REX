'use client';

import { useState, useEffect } from 'react';
import { Heart, Download, AlertCircle } from 'lucide-react';

export default function DocumentView({ document, isFavorite, onToggleFavorite }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Google Docs Viewer - działa z publicznymi URL
  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(document.pdfUrl)}&embedded=true`;

  useEffect(() => {
    // Reset state when document changes
    setLoading(true);
    setError(false);
  }, [document.pdfUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    
    try {
      // Pobierz plik jako blob
      const response = await fetch(document.pdfUrl);
      const blob = await response.blob();
      
      // Stwórz link do pobrania
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.filename || `${document.name}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback - otwórz w nowej karcie
      window.open(document.pdfUrl, '_blank');
    }
  };

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
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              title="Pobierz"
            >
              <Download className="w-4 h-4" />
              Pobierz
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer - domyślny podgląd */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm relative" style={{ minHeight: '75vh' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
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
              Nie można załadować podglądu
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Wystąpił problem z wyświetleniem dokumentu.
            </p>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Pobierz dokument
            </button>
          </div>
        ) : (
          <iframe
            src={googleViewerUrl}
            className="w-full border-0"
            style={{ height: '75vh' }}
            onLoad={handleIframeLoad}
            onError={() => setError(true)}
            title={document.name}
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
