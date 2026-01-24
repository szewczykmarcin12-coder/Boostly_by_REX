'use client';

import { useState } from 'react';
import { Heart, Download, ExternalLink, AlertCircle, FileText } from 'lucide-react';

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

  // Dla GitHub raw URLs, używamy bezpośredniego osadzenia
  // Alternatywnie można użyć Mozilla PDF.js viewer
  const pdfViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(document.pdfUrl)}`;

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

      {/* PDF Viewer - bezpośredni link do otwarcia */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {/* Główna sekcja z przyciskami do otwarcia PDF */}
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-red-500" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            {document.name}
          </h3>
          
          <p className="text-gray-500 text-center mb-6 max-w-sm">
            Kliknij poniżej, aby otworzyć dokument PDF
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <a
              href={document.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              Otwórz PDF
            </a>
            
            <a
              href={document.pdfUrl}
              download
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Pobierz
            </a>
          </div>
        </div>

        {/* Alternatywnie: iframe z PDF.js viewer */}
        <div className="border-t border-gray-200">
          <details className="group">
            <summary className="flex items-center justify-center gap-2 py-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <span className="text-sm">Pokaż podgląd w aplikacji</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-gray-500">Ładowanie podglądu...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={pdfViewerUrl}
                className="w-full h-[70vh] border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={document.name}
                allowFullScreen
              />
              
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6">
                  <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-center text-sm">
                    Podgląd niedostępny. Użyj przycisków powyżej, aby otworzyć lub pobrać dokument.
                  </p>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
