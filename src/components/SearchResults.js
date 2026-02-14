'use client';

import { useState, useEffect } from 'react';
import { getMenuStructure, getDocumentsConfig, getDocumentsForCategory } from '@/data/store';
import { Search, FolderOpen, FileText } from 'lucide-react';

export default function SearchResults({ query, onSelectCategory, onSelectDocument }) {
  const [results, setResults] = useState({ categories: [], documents: [] });

  useEffect(() => {
    if (query.length < 2) {
      setResults({ categories: [], documents: [] });
      return;
    }

    const menuStructure = getMenuStructure();
    const docsConfig = getDocumentsConfig();
    const searchResults = searchInStructure(menuStructure, docsConfig, query.toLowerCase());
    setResults(searchResults);
  }, [query]);

  const totalResults = results.categories.length + results.documents.length;

  if (query.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Search className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500">Wpisz co najmniej 2 znaki aby wyszukać</p>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Search className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-700 font-medium mb-2">Brak wyników dla &quot;{query}&quot;</p>
        <p className="text-gray-500">Spróbuj innych słów kluczowych</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-gray-500 text-sm">
        Znaleziono {totalResults} wyników dla &quot;{query}&quot;
      </p>

      {results.categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Kategorie</h3>
          <div className="space-y-2">
            {results.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <FolderOpen className="w-5 h-5 text-gray-500" />
                <span className="text-gray-800 font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.documents.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Dokumenty</h3>
          <div className="space-y-2">
            {results.documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                <div className="text-left">
                  <span className="text-gray-800 font-medium block">{doc.name}</span>
                  <span className="text-gray-500 text-sm">{doc.categoryName}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function searchInStructure(structure, docsConfig, query) {
  const results = { categories: [], documents: [] };

  function traverse(node, path = '') {
    if (node.name && node.name.toLowerCase().includes(query)) {
      if (node.id !== 'main') {
        results.categories.push({ id: node.id, name: node.name, path });
      }
    }

    // Search documents from docsConfig
    const docs = docsConfig[node.id];
    if (docs) {
      docs.forEach(doc => {
        if (doc.name.toLowerCase().includes(query)) {
          // Get full document info via store
          const fullDocs = getDocumentsForCategory(node.id);
          const fullDoc = fullDocs.find(d => d.id === doc.id);
          if (fullDoc) {
            results.documents.push({
              ...fullDoc,
              categoryName: node.name,
              categoryId: node.id,
            });
          }
        }
      });
    }

    if (node.children) {
      node.children.forEach(child => traverse(child, node.id === 'main' ? '' : `${path} > ${node.name}`));
    }
  }

  traverse(structure);
  return results;
}
