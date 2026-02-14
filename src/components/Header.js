'use client';

import { useState } from 'react';
import { Search, Bell, Menu, ArrowLeft } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  onSearch, 
  onOpenSettings, 
  onOpenNotifications,
  unreadNotificationsCount,
  showBack, 
  onBack 
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          ) : null}
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <img src="/boostly-logo.png" alt="Boostly" className="w-9 h-9 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="text-primary">Boostly</span>
              </span>
              <span className="text-[10px] text-gray-500 -mt-1">by M. Szewczyk</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Menu */}
          <button 
            onClick={onOpenSettings}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Wyszukaj tutaj"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl py-3 pl-4 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
