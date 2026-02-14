'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock, Shield, AlertCircle } from 'lucide-react';

export default function PinScreen({ onSuccess, onAdminAccess }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [mode, setMode] = useState('user'); // 'user' | 'admin'
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [mode]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5) {
      const fullPin = newPin.join('');
      handleSubmit(fullPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newPin = pasted.split('');
      setPin(newPin);
      handleSubmit(pasted);
    }
  };

  const handleSubmit = (fullPin) => {
    if (mode === 'user') {
      onSuccess(fullPin);
    } else {
      onAdminAccess(fullPin);
    }
  };

  const triggerError = (message) => {
    setError(message);
    setShake(true);
    setPin(['', '', '', '', '', '']);
    setTimeout(() => setShake(false), 600);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  // Expose triggerError via parent callback
  useEffect(() => {
    window.__pinScreenTriggerError = triggerError;
    return () => { delete window.__pinScreenTriggerError; };
  }, []);

  const switchMode = () => {
    setMode(mode === 'user' ? 'admin' : 'user');
    setPin(['', '', '', '', '', '']);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
      {/* Logo section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4C20 4 12 12 12 20C12 24.4 14.4 28 18 30V36H22V30C25.6 28 28 24.4 28 20C28 12 20 4 20 4Z" fill="#F57C00"/>
            <path d="M16 18C16 18 14 22 16 26C18 30 20 30 20 30C20 30 18 26 18 22C18 18 20 14 20 14C20 14 16 14 16 18Z" fill="#FFB74D"/>
            <path d="M24 18C24 18 26 22 24 26C22 30 20 30 20 30C20 30 22 26 22 22C22 18 20 14 20 14C20 14 24 14 24 18Z" fill="#E65100"/>
            <circle cx="20" cy="18" r="3" fill="#FFF3E0"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Boostly</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">by Rex Concepts</p>
      </div>

      {/* Lock icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
        mode === 'admin' 
          ? 'bg-red-100' 
          : 'bg-orange-100'
      }`}>
        {mode === 'admin' ? (
          <Shield className="w-8 h-8 text-red-500" />
        ) : (
          <Lock className="w-8 h-8 text-primary" />
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {mode === 'admin' ? 'Panel administracyjny' : 'Wprowadź PIN'}
      </h2>
      <p className="text-gray-500 text-sm mb-8 text-center">
        {mode === 'admin' 
          ? 'Wprowadź PIN administratora aby kontynuować'
          : 'Wprowadź 6-cyfrowy PIN aby uzyskać dostęp'
        }
      </p>

      {/* PIN input boxes */}
      <div className={`flex gap-3 mb-6 ${shake ? 'animate-shake' : ''}`}>
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200 ${
              digit 
                ? mode === 'admin'
                  ? 'border-red-400 bg-red-50 text-red-700' 
                  : 'border-primary bg-orange-50 text-primary'
                : error 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-white'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
            style={{ caretColor: 'transparent' }}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mb-4 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Dots indicator */}
      <div className="flex gap-2 mb-8">
        {pin.map((digit, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              digit ? (mode === 'admin' ? 'bg-red-500' : 'bg-primary') : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Switch mode button */}
      <button
        onClick={switchMode}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline decoration-dotted underline-offset-4"
      >
        {mode === 'admin' ? 'Powrót do logowania użytkownika' : 'Logowanie administratora'}
      </button>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
