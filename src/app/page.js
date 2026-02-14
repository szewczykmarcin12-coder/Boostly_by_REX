'use client';

import { useState, useEffect, useCallback } from 'react';
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
  fetchConfig, fetchNotifications,
  getReadNotificationIds, markNotificationReadLocal, markAllNotificationsReadLocal,
} from '@/lib/api';

export default function Home() {
  const [authState, setAuthState] = useState('loading'); // loading, pin, authenticated, admin
  const [adminPin, setAdminPin] = useState(''); // store admin pin for session
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Global config from server
  const [config, setConfig] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState([]);

  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);

  // Load config from server
  const loadConfig = useCallback(async () => {
    try {
      const data = await fetchConfig();
      setConfig(data);
    } catch (e) {
      console.error('Failed to load config:', e);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('boostly_auth') === 'true';
    if (isAuth) {
      setAuthState('authenticated');
    } else {
      setAuthState('pin');
    }
    // Load local data
    const savedFavorites = localStorage.getItem('boostly_favorites');
    const savedRecent = localStorage.getItem('boostly_recent');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentDocuments(JSON.parse(savedRecent));
    setReadNotifIds(getReadNotificationIds());
  }, []);

  // Load server data when authenticated
  useEffect(() => {
    if (authState === 'authenticated') {
      loadConfig();
      loadNotifications();
    }
  }, [authState, loadConfig, loadNotifications]);

  // Save favorites/recent to localStorage
  useEffect(() => {
    localStorage.setItem('boostly_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('boostly_recent', JSON.stringify(recentDocuments));
  }, [recentDocuments]);

  // ========== PIN Handlers ==========
  const handlePinSuccess = () => {
    sessionStorage.setItem('boostly_auth', 'true');
    setAuthState('authenticated');
  };

  const handleAdminAccess = (pin) => {
    setAdminPin(pin);
    setAuthState('admin');
  };

  const handleAdminClose = () => {
    setAdminPin('');
    setAuthState('authenticated');
    // Refresh config after admin changes
    loadConfig();
    loadNotifications();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('boostly_auth');
    setAuthState('pin');
    setAdminPin('');
  };

  // ========== Notifications ==========
  const enrichedNotifications = notifications.map(n => ({
    ...n,
    read: readNotifIds.includes(n.id),
  }));
  const unreadNotificationsCount = enrichedNotifications.filter(n => !n.read).length;

  const handleMarkNotificationAsRead = (notificationId) => {
    markNotificationReadLocal(notificationId);
    setReadNotifIds(prev => [...prev, notificationId]);
  };

  const handleClearAllNotifications = () => {
    const allIds = notifications.map(n => n.id);
    markAllNotificationsReadLocal(allIds);
    setReadNotifIds(allIds);
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
    if (currentDocument) { setCurrentDocument(null); return; }
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
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authState === 'pin') {
    return <PinScreen onSuccess={handlePinSuccess} onAdminAccess={handleAdminAccess} />;
  }

  if (authState === 'admin') {
    return <AdminPanel adminPin={adminPin} onClose={handleAdminClose} />;
  }

  // Wait for config
  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isSearching) {
      return (
        <SearchResults
          query={searchQuery}
          config={config}
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
          config={config}
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
        return <HomeScreen recentDocuments={recentDocuments} favorites={favorites} onNavigateToDocument={handleNavigateToDocument} onToggleFavorite={toggleFavorite} />;
      case 'categories':
        return <CategoriesScreen config={config} onNavigateToCategory={handleNavigateToCategory} />;
      case 'recent':
        return <RecentScreen recentDocuments={recentDocuments} onNavigateToDocument={handleNavigateToDocument} favorites={favorites} onToggleFavorite={toggleFavorite} />;
      case 'favorites':
        return <FavoritesScreen favorites={favorites} onNavigateToDocument={handleNavigateToDocument} onToggleFavorite={toggleFavorite} />;
      default:
        return <HomeScreen recentDocuments={recentDocuments} favorites={favorites} onNavigateToDocument={handleNavigateToDocument} onToggleFavorite={toggleFavorite} />;
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
      <div className="pt-4 px-4">{renderContent()}</div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onLogout={handleLogout} />}
      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          notifications={enrichedNotifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onClearAll={handleClearAllNotifications}
        />
      )}
    </main>
  );
}
