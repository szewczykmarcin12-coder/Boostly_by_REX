'use client';

import { X, Bell, FileText, FolderPlus, Clock } from 'lucide-react';

export default function NotificationsModal({ onClose, notifications, onMarkAsRead, onClearAll }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Przed chwilą';
    if (diffMins < 60) return `${diffMins} min temu`;
    if (diffHours < 24) return `${diffHours} godz. temu`;
    if (diffDays < 7) return `${diffDays} dni temu`;
    
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_document':
        return <FileText className="w-5 h-5 text-primary" />;
      case 'new_category':
        return <FolderPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 animate-fadeIn">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden animate-scaleIn max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-800">Powiadomienia</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">Brak powiadomień</p>
              <p className="text-gray-400 text-sm text-center mt-1">
                Tutaj pojawią się informacje o nowych dokumentach
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={onClearAll}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Oznacz wszystkie jako przeczytane
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
