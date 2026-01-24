'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import CategoriesScreen from '@/components/CategoriesScreen';
import RecentScreen from '@/components/RecentScreen';
import FavoritesScreen from '@/components/FavoritesScreen';
import SettingsModal from '@/components/SettingsModal';
import NotificationsModal from '@/components/NotificationsModal';
import CategoryView from '@/components/CategoryView';
import DocumentView from '@/components/DocumentView';
import SearchResults from '@/components/SearchResults';

// Initial notifications about new documents
const initialNotifications = [
  {
    id: 'notif-1',
    type: 'new_document',
    title: 'Nowy dokument dodany',
    message: 'Dodano nowy dokument "Procedury otwarcia restauracji" w kategorii Zarządzanie restauracją',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    read: false,
  },
  {
    id: 'notif-2',
    type: 'new_document',
    title: 'Aktualizacja dokumentu',
    message: 'Zaktualizowano dokument "HACCP" w kategorii Bezpieczeństwo żywności',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 'notif-3',
    type: 'new_category',
    title: 'Nowa kategoria',
    message: 'Dodano nową kategorię "LTO" z aktualnymi promocjami',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: 'notif-4',
    type: 'new_document',
    title: 'Nowe standardy',
    message: 'Dodano dokumenty dotyczące produktów smażonych w kategorii Standardy',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('boostly_favorites');
    const savedRecent = localStorage.getItem('boostly_recent');
    const savedNotifications = localStorage.getItem('boostly_notifications');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentDocuments(JSON.parse(savedRecent));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Set initial notifications if none saved
      setNotifications(initialNotifications);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('boostly_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recent to localStorage
  useEffect(() => {
    localStorage.setItem('boostly_recent', JSON.stringify(recentDocuments));
  }, [recentDocuments]);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('boostly_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Mark all notifications as read
  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNavigateToCategory = (categoryId) => {
    setNavigationStack(prev => [...prev, { type: 'category', id: currentCategory }]);
    setCurrentCategory(categoryId);
    setCurrentDocument(null);
  };

  const handleNavigateToDocument = (document) => {
    setNavigationStack(prev => [...prev, { type: 'category', id: currentCategory }]);
    setCurrentDocument(document);
    
    // Add to recent
    const newRecent = [
      { ...document, viewedAt: new Date().toISOString() },
      ...recentDocuments.filter(d => d.id !== document.id)
    ].slice(0, 20);
    setRecentDocuments(newRecent);
  };

  const handleBack = () => {
    if (currentDocument) {
      setCurrentDocument(null);
      return;
    }
    
    if (navigationStack.length > 0) {
      const lastNav = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setCurrentCategory(lastNav.id);
    } else {
      setCurrentCategory(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentCategory(null);
    setCurrentDocument(null);
    setNavigationStack([]);
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const toggleFavorite = (document) => {
    const isFavorite = favorites.some(f => f.id === document.id);
    if (isFavorite) {
      setFavorites(favorites.filter(f => f.id !== document.id));
    } else {
      setFavorites([...favorites, document]);
    }
  };

  const renderContent = () => {
    if (isSearching) {
      return (
        <SearchResults 
          query={searchQuery}
          onSelectCategory={handleNavigateToCategory}
          onSelectDocument={handleNavigateToDocument}
        />
      );
    }

    if (currentDocument) {
      return (
        <DocumentView 
          document={currentDocument}
          isFavorite={favorites.some(f => f.id === currentDocument.id)}
          onToggleFavorite={() => toggleFavorite(currentDocument)}
        />
      );
    }

    if (currentCategory) {
      return (
        <CategoryView 
          categoryId={currentCategory}
          onNavigateToCategory={handleNavigateToCategory}
          onNavigateToDocument={handleNavigateToDocument}
          onBack={handleBack}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            recentDocuments={recentDocuments}
            favorites={favorites}
            onNavigateToDocument={handleNavigateToDocument}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'categories':
        return (
          <CategoriesScreen 
            onNavigateToCategory={handleNavigateToCategory}
          />
        );
      case 'recent':
        return (
          <RecentScreen 
            recentDocuments={recentDocuments}
            onNavigateToDocument={handleNavigateToDocument}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen 
            favorites={favorites}
            onNavigateToDocument={handleNavigateToDocument}
            onToggleFavorite={toggleFavorite}
          />
        );
      default:
        return (
          <HomeScreen 
            recentDocuments={recentDocuments}
            favorites={favorites}
            onNavigateToDocument={handleNavigateToDocument}
            onToggleFavorite={toggleFavorite}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <Header 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onOpenSettings={() => setShowSettings(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        showBack={currentCategory !== null || currentDocument !== null}
        onBack={handleBack}
      />
      
      <div className="pt-4 px-4">
        {renderContent()}
      </div>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onClearAll={handleClearAllNotifications}
        />
      )}
    </main>
  );
}
