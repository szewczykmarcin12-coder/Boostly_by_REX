'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import CategoriesScreen from '@/components/CategoriesScreen';
import RecentScreen from '@/components/RecentScreen';
import FavoritesScreen from '@/components/FavoritesScreen';
import SettingsModal from '@/components/SettingsModal';
import CategoryView from '@/components/CategoryView';
import DocumentView from '@/components/DocumentView';
import SearchResults from '@/components/SearchResults';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);

  // Load favorites and recent from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('boostly_favorites');
    const savedRecent = localStorage.getItem('boostly_recent');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentDocuments(JSON.parse(savedRecent));
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
    </main>
  );
}
