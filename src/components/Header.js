'use client';

import { useState } from 'react';
import { Search, Bell, Menu, ArrowLeft } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  onSearch, 
  onOpenSettings, 
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
              {/* Logo Icon - colorful flame/leaf design */}
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4C20 4 12 12 12 20C12 24.4 14.4 28 18 30V36H22V30C25.6 28 28 24.4 28 20C28 12 20 4 20 4Z" fill="#F57C00"/>
                <path d="M16 18C16 18 14 22 16 26C18 30 20 30 20 30C20 30 18 26 18 22C18 18 20 14 20 14C20 14 16 14 16 18Z" fill="#FFB74D"/>
                <path d="M24 18C24 18 26 22 24 26C22 30 20 30 20 30C20 30 22 26 22 22C22 18 20 14 20 14C20 14 24 14 24 18Z" fill="#E65100"/>
                <circle cx="20" cy="18" r="3" fill="#FFF3E0"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="text-primary">Boostly</span>
              </span>
              <span className="text-[10px] text-gray-500 -mt-1">by Rex Concepts</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
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
