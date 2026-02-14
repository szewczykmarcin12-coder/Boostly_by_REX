'use client';

import { useState, useEffect } from 'react';
import { Heart, Download, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function DocumentView({ document, isFavorite, onToggleFavorite }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);

  // Always use Google Docs Viewer - works reliably on ALL devices (mobile + desktop)
  // This displays the PDF inline as a visual preview, never as a download
  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(document.pdfUrl)}&embedded=true`;

  useEffect(() => {
    setLoading(true);
    setError(false);
    setViewerKey(prev => prev + 1);
  }, [document.pdfUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Timeout fallback - Google Viewer can be slow
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [loading, viewerKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setViewerKey(prev => prev + 1);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(document.pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.filename || `${document.name}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(document.pdfUrl, '_blank');
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Document header */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-800 mb-1">{document.name}</h1>
            <span className="inline-block bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-full">
              {document.type || 'DOCUMENT'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={onToggleFavorite} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
            <button onClick={handleDownload} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Pobierz PDF">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
            <button onClick={() => window.open(document.pdfUrl, '_blank')} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Otwórz w nowej karcie">
              <ExternalLink className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer - Google Docs Viewer for all platforms */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm relative" style={{ minHeight: '78vh' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Ładowanie podglądu dokumentu...</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 p-6">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nie można załadować podglądu</h3>
            <p className="text-gray-500 text-center mb-4 text-sm">Sprawdź połączenie z internetem lub spróbuj ponownie.</p>
            <div className="flex gap-3">
              <button onClick={handleRetry} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm">
                <RefreshCw className="w-4 h-4" /> Spróbuj ponownie
              </button>
              <button onClick={() => window.open(document.pdfUrl, '_blank')} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm">
                <ExternalLink className="w-4 h-4" /> Otwórz
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={viewerKey}
            src={googleViewerUrl}
            className="w-full border-0"
            style={{ height: '78vh' }}
            onLoad={handleIframeLoad}
            onError={() => setError(true)}
            title={document.name}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        )}
      </div>
    </div>
  );
}
