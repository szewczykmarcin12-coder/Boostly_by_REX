'use client';

import { useState } from 'react';
import { X, User, Languages, LogOut } from 'lucide-react';

export default function SettingsModal({ onClose, onLogout }) {
  const [selectedLanguage, setSelectedLanguage] = useState('Polish');
  const languages = ['Polish'];

  const handleLogout = () => {
    if (window.confirm('Czy na pewno chcesz się wylogować?')) {
      onLogout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 animate-fadeIn">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Ustawienia</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User profile */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-red-500 flex items-center justify-center mb-4">
              <User className="w-14 h-14 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Użytkownik Popeyes</h3>
            <div className="mt-4">
              <img
                src="/popeyes-logo.png"
                alt="Popeyes"
                className="h-12 w-auto"
                style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(1000%) hue-rotate(360deg) brightness(103%) contrast(106%)' }}
              />
            </div>
          </div>

          {/* Brand selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 text-gray-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z M8 2v4 M16 2v4 M8 18v4 M16 18v4"/>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Wybierz brand</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                Popeyes - PL
              </span>
            </div>
          </div>

          {/* Language selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Język</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Logout button */}
          <div className="mb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Wyloguj się
            </button>
          </div>

          {/* Version info */}
          <div className="text-center pt-4 border-t border-gray-100">
            <span className="text-gray-400 text-sm">Ver. 2.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
