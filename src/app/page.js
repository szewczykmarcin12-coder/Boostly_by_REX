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
import PinScreen from '@/components/PinScreen';
import AdminPanel from '@/components/AdminPanel';
import {
  verifyUserPin, verifyAdminPin,
  isAuthenticated, setAuthenticated,
  isAdminAuthenticated, setAdminAuthenticated,
  getNotifications, saveNotifications,
} from '@/data/store';

export default function Home() {
  const [authState, setAuthState] = useState('loading'); // loading, pin, authenticated, admin
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

  // Check auth state on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setAuthState('authenticated');
    } else {
      setAuthState('pin');
    }
    // Load data
    loadLocalData();
  }, []);

  const loadLocalData = () => {
    if (typeof window === 'undefined') return;
    const savedFavorites = localStorage.getItem('boostly_favorites');
    const savedRecent = localStorage.getItem('boostly_recent');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentDocuments(JSON.parse(savedRecent));
    setNotifications(getNotifications());
  };

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('boostly_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Save recent to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('boostly_recent', JSON.stringify(recentDocuments));
    }
  }, [recentDocuments]);

  // ========== PIN Handlers ==========
  const handlePinSuccess = (pin) => {
    if (verifyUserPin(pin)) {
      setAuthenticated(true);
      setAuthState('authenticated');
    } else {
      // Trigger error in PinScreen
      if (window.__pinScreenTriggerError) {
        window.__pinScreenTriggerError('Nieprawidłowy PIN');
      }
    }
  };

  const handleAdminAccess = (pin) => {
    if (verifyAdminPin(pin)) {
      setAdminAuthenticated(true);
      setAuthState('admin');
    } else {
      if (window.__pinScreenTriggerError) {
        window.__pinScreenTriggerError('Nieprawidłowy PIN administratora');
      }
    }
  };

  const handleAdminClose = () => {
    setAdminAuthenticated(false);
    setAuthState('authenticated');
    // Refresh notifications after admin changes
    setNotifications(getNotifications());
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setAdminAuthenticated(false);
    setAuthState('pin');
  };

  // ========== Notification Handlers ==========
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMarkNotificationAsRead = (notificationId) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  // ========== Navigation ==========
  const handleNavigateToCategory = (categoryId) => {
    setNavigationStack(prev => [...prev, { type: 'category', id: currentCategory }]);
    setCurrentCategory(categoryId);
    setCurrentDocument(null);
  };

  const handleNavigateToDocument = (document) => {
    setNavigationStack(prev => [...prev, { type: 'category', id: currentCategory }]);
    setCurrentDocument(document);
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

  // ========== Render ==========

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // PIN screen
  if (authState === 'pin') {
    return (
      <PinScreen
        onSuccess={handlePinSuccess}
        onAdminAccess={handleAdminAccess}
      />
    );
  }

  // Admin panel
  if (authState === 'admin') {
    return <AdminPanel onClose={handleAdminClose} />;
  }

  // Main app (authenticated)
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
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
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
