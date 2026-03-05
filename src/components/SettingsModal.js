'use client';

import { useState, useEffect } from 'react';
import { X, User, Globe, LogOut, ChevronLeft, Check } from 'lucide-react';

export default function SettingsModal({ onClose, onLogout }) {
  const [view, setView] = useState('main'); // main, brand, language
  const [selectedBrand, setSelectedBrand] = useState('Popeyes');
  const [selectedLanguage, setSelectedLanguage] = useState('Polski');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Czy na pewno chcesz się wylogować?')) {
      onLogout();
      onClose();
    }
  };

  // Brand selection subview
  if (view === 'brand') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 animate-fadeIn" onClick={onClose}>
        <div className="bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <button onClick={() => setView('main')} className="p-1.5 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
            <h2 className="text-lg font-medium text-gray-700">Wybierz brand</h2>
          </div>
          <div className="p-4 space-y-2">
            {['Popeyes', 'Burger King'].map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedBrand === brand
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <span>{brand}</span>
                {selectedBrand === brand && <Check className="w-4.5 h-4.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Language selection subview
  if (view === 'language') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 animate-fadeIn" onClick={onClose}>
        <div className="bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <button onClick={() => setView('main')} className="p-1.5 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
            <h2 className="text-lg font-medium text-gray-700">Wybierz język</h2>
          </div>
          <div className="p-4 space-y-2">
            {['Polski', 'Angielski'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <span>{lang}</span>
                {selectedLanguage === lang && <Check className="w-4.5 h-4.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 animate-fadeIn" onClick={onClose}>
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-700">Dane i preferencje</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Profile avatar */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center border-4 border-gray-500">
              <User className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Paszport Popeyes card */}
          <div className="relative bg-primary rounded-2xl p-5 mb-5 overflow-hidden" style={{ minHeight: '120px' }}>
            {/* White chicken logo - large, filling left corner, center of logo at edge */}
            <div className="absolute left-[-38px] top-1/2 -translate-y-1/2 pointer-events-none">
              <img
                src="/popeyes-white-logo.png"
                alt=""
                className="w-44 h-44 object-contain opacity-80"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Card content */}
            <div className="relative z-10 ml-24 text-right">
              <h3 className="text-white font-bold text-base tracking-wide mb-4">
                PASZPORT POPEYES
              </h3>
              <p className="text-white/80 text-sm mb-1.5">IMIĘ I NAZWISKO</p>
              <p className="text-white/80 text-sm">E-MAIL</p>
            </div>
          </div>

          {/* Brand & Language buttons */}
          <div className="flex gap-4 mb-5">
            <button
              onClick={() => setView('brand')}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/rc-logo.png" alt="RC" className="w-9 h-9 object-contain rounded-lg" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Brand</span>
            </button>

            <button
              onClick={() => setView('language')}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Globe className="w-8 h-8 text-gray-800" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-gray-700 font-medium">Język</span>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-4 py-3.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Wyloguj się
          </button>

          {/* Version */}
          <div className="text-center mt-5">
            <span className="text-gray-400 text-xs">v. 2.0.0 | Boostly by Marcin Szewczyk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
