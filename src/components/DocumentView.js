'use client';

import { useState, useEffect } from 'react';
import { Heart, Download, AlertCircle, Monitor, Smartphone, ExternalLink } from 'lucide-react';

export default function DocumentView({ document, isFavorite, onToggleFavorite }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [viewerKey, setViewerKey] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(mobileRegex.test(userAgent) || (isTouchDevice && isSmallScreen));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setViewerKey(prev => prev + 1);
  }, [document.pdfUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setError(true);
    setLoading(false);
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

  const handleOpenInNewTab = () => {
    window.open(document.pdfUrl, '_blank');
  };

  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(document.pdfUrl)}&embedded=true`;
  const desktopPdfUrl = document.pdfUrl;

  // Auto-clear loading after timeout (object tag may not fire onLoad)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [loading, viewerKey]);

  const renderPdfViewer = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 p-6">
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nie można załadować podglądu</h3>
          <p className="text-gray-500 text-center mb-4">Wystąpił problem z wyświetleniem dokumentu.</p>
          <div className="flex gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium">
              <Download className="w-5 h-5" /> Pobierz
            </button>
            <button onClick={handleOpenInNewTab} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium">
              <ExternalLink className="w-5 h-5" /> Otwórz
            </button>
          </div>
        </div>
      );
    }

    if (isMobile) {
      return (
        <iframe
          key={`mobile-${viewerKey}`}
          src={googleViewerUrl}
          className="w-full border-0"
          style={{ height: '75vh' }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={document.name}
          allowFullScreen
        />
      );
    }

    // Desktop: use object tag for native PDF rendering with Google Viewer fallback
    return (
      <object
        key={`desktop-${viewerKey}`}
        data={desktopPdfUrl}
        type="application/pdf"
        className="w-full border-0"
        style={{ height: '80vh' }}
        onLoad={() => setLoading(false)}
      >
        <iframe
          src={googleViewerUrl}
          className="w-full border-0"
          style={{ height: '80vh' }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={document.name}
          allowFullScreen
        />
      </object>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800 mb-1">{document.name}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-full">
                {document.type || 'DOCUMENT'}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                {isMobile ? <><Smartphone className="w-3 h-3" /> Mobilne</> : <><Monitor className="w-3 h-3" /> Komputer</>}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleFavorite} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium" title="Pobierz">
              <Download className="w-4 h-4" /><span className="hidden sm:inline">Pobierz</span>
            </button>
            <button onClick={handleOpenInNewTab} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium" title="Otwórz w nowej karcie">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm relative" style={{ minHeight: '75vh' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-gray-500">Ładowanie dokumentu...</p>
            </div>
          </div>
        )}
        {renderPdfViewer()}
      </div>
    </div>
  );
}
