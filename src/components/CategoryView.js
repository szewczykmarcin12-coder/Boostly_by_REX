'use client';

import { useState, useEffect } from 'react';
import { findCategoryById, getBreadcrumbPath } from '@/data/menuStructure';
import { getDocumentsForCategory } from '@/data/documentsConfig';
import { ArrowLeft, FolderOpen, LayoutGrid, Heart } from 'lucide-react';
import DocumentCard from './DocumentCard';

export default function CategoryView({ 
  categoryId, 
  onNavigateToCategory, 
  onNavigateToDocument,
  onBack,
  favorites,
  onToggleFavorite
}) {
  const [category, setCategory] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = findCategoryById(categoryId);
    const path = getBreadcrumbPath(categoryId);
    
    setCategory(cat);
    setBreadcrumb(path ? path.filter(p => p.id !== 'main') : []);
    
    // Pobierz dokumenty z konfiguracji
    const categoryDocuments = getDocumentsForCategory(categoryId);
    setDocuments(categoryDocuments);
    setLoading(false);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Kategoria nie znaleziona</p>
      </div>
    );
  }

  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <div className="animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-gray-400">|</span>
        <FolderOpen className="w-4 h-4 text-gray-500" />
        <div className="flex items-center gap-1 text-gray-600 font-medium truncate">
          {breadcrumb.length > 2 && <span>...</span>}
          {breadcrumb.slice(-2).map((item, index, arr) => (
            <span key={item.id} className="flex items-center gap-1">
              {index > 0 && <span className="text-gray-400">/</span>}
              <span className={index === arr.length - 1 ? 'text-gray-800' : ''}>
                {item.name.toUpperCase()}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Subcategories as tiles */}
      {hasSubcategories && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {category.children.map((subcat, index) => (
            <button
              key={subcat.id}
              onClick={() => onNavigateToCategory(subcat.id)}
              className="bg-gray-600 rounded-2xl p-4 h-32 flex flex-col justify-between text-left hover:bg-gray-700 transition-colors animate-scaleIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-white font-semibold text-sm uppercase leading-tight">
                {subcat.name}
              </span>
              <div className="flex justify-end">
                <LayoutGrid className="w-6 h-6 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Documents */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {documents.map((doc, index) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isFavorite={favorites.some(f => f.id === doc.id)}
              onToggleFavorite={() => onToggleFavorite(doc)}
              onClick={() => onNavigateToDocument(doc)}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      ) : !hasSubcategories ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Brak dokumentów w tej kategorii</p>
          <p className="text-gray-400 text-sm mt-1">Dokumenty PDF pojawią się tutaj po dodaniu</p>
        </div>
      ) : null}
    </div>
  );
}
