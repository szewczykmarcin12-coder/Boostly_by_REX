'use client';

import { Home, Folder, Clock, Heart } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'categories', icon: Folder, label: 'Katalogi' },
    { id: 'recent', icon: Clock, label: 'Ostatnie' },
    { id: 'favorites', icon: Heart, label: 'Ulubione' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-6 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-gray-800' : 'text-gray-400'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
