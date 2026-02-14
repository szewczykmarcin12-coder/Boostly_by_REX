'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft, Shield, Key, FolderPlus, FilePlus, Trash2, Edit3,
  Save, X, ChevronRight, ChevronDown, FileText, Folder, Plus,
  AlertCircle, Check, LogOut, RefreshCw, Eye, EyeOff, Link
} from 'lucide-react';
import {
  getMenuStructure, saveMenuStructure,
  getDocumentsConfig, saveDocumentsConfig,
  getCategoryPaths, saveCategoryPaths,
  getUserPin, setUserPin, getAdminPin, setAdminPin,
  addCategory, updateCategory, deleteCategory,
  addDocument, updateDocument, deleteDocument,
  getNotifications, addNotification,
  resetToDefaults, findCategoryById,
  GITHUB_RAW_BASE
} from '@/data/store';

export default function AdminPanel({ onClose }) {
  const [activeSection, setActiveSection] = useState('menu'); // menu, pin, categories, documents
  const [menuStructure, setMenuStructure] = useState(null);
  const [docsConfig, setDocsConfig] = useState({});
  const [catPaths, setCatPaths] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addCategoryParent, setAddCategoryParent] = useState('main');
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [addDocumentCategory, setAddDocumentCategory] = useState('');
  const [toast, setToast] = useState(null);

  // PIN management state
  const [currentUserPin, setCurrentUserPin] = useState('');
  const [newUserPin, setNewUserPin] = useState('');
  const [confirmUserPin, setConfirmUserPin] = useState('');
  const [currentAdminPin, setCurrentAdminPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [showPins, setShowPins] = useState(false);

  // New category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatPath, setNewCatPath] = useState('');

  // New document form
  const [newDocName, setNewDocName] = useState('');
  const [newDocFilename, setNewDocFilename] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setMenuStructure(getMenuStructure());
    setDocsConfig(getDocumentsConfig());
    setCatPaths(getCategoryPaths());
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ========== PIN Section ==========
  const handleChangeUserPin = () => {
    if (newUserPin.length !== 6 || !/^\d{6}$/.test(newUserPin)) {
      showToast('PIN musi składać się z 6 cyfr', 'error');
      return;
    }
    if (newUserPin !== confirmUserPin) {
      showToast('PIN-y nie są identyczne', 'error');
      return;
    }
    setUserPin(newUserPin);
    setNewUserPin('');
    setConfirmUserPin('');
    showToast('PIN użytkownika został zmieniony');
  };

  const handleChangeAdminPin = () => {
    if (currentAdminPin !== getAdminPin()) {
      showToast('Obecny PIN administratora jest nieprawidłowy', 'error');
      return;
    }
    if (newAdminPin.length !== 6 || !/^\d{6}$/.test(newAdminPin)) {
      showToast('PIN musi składać się z 6 cyfr', 'error');
      return;
    }
    if (newAdminPin !== confirmAdminPin) {
      showToast('PIN-y nie są identyczne', 'error');
      return;
    }
    setAdminPin(newAdminPin);
    setCurrentAdminPin('');
    setNewAdminPin('');
    setConfirmAdminPin('');
    showToast('PIN administratora został zmieniony');
  };

  // ========== Category Operations ==========
  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      showToast('Podaj nazwę kategorii', 'error');
      return;
    }
    const id = newCatId.trim() || newCatName.toLowerCase()
      .replace(/[ąćęłńóśźż]/g, c => 'acelnoszz'['ąćęłńóśźż'.indexOf(c)])
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    addCategory(addCategoryParent, {
      id,
      name: newCatName.trim(),
      path: newCatPath.trim() || id,
      icon: 'circle',
    });

    setNewCatName('');
    setNewCatId('');
    setNewCatPath('');
    setShowAddCategory(false);
    refreshData();
    showToast(`Kategoria "${newCatName.trim()}" została dodana`);
  };

  const handleUpdateCategory = (categoryId, newName) => {
    updateCategory(categoryId, { name: newName });
    setEditingCategory(null);
    refreshData();
    showToast('Kategoria została zaktualizowana');
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę kategorię? Zostaną usunięte również wszystkie dokumenty w niej.')) {
      deleteCategory(categoryId);
      refreshData();
      showToast('Kategoria została usunięta');
    }
  };

  // ========== Document Operations ==========
  const handleAddDocument = () => {
    if (!newDocName.trim()) {
      showToast('Podaj nazwę dokumentu', 'error');
      return;
    }
    if (!newDocFilename.trim() && !newDocUrl.trim()) {
      showToast('Podaj nazwę pliku lub URL dokumentu', 'error');
      return;
    }

    addDocument(addDocumentCategory, {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      filename: newDocFilename.trim() || `${newDocName.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`,
      customUrl: newDocUrl.trim() || null,
    });

    setNewDocName('');
    setNewDocFilename('');
    setNewDocUrl('');
    setShowAddDocument(false);
    refreshData();
    showToast(`Dokument "${newDocName.trim()}" został dodany`);
  };

  const handleUpdateDocument = (categoryId, docId, updates) => {
    updateDocument(categoryId, docId, updates);
    setEditingDocument(null);
    refreshData();
    showToast('Dokument został zaktualizowany');
  };

  const handleDeleteDocument = (categoryId, docId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten dokument?')) {
      deleteDocument(categoryId, docId);
      refreshData();
      showToast('Dokument został usunięty');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Czy na pewno chcesz przywrócić domyślną konfigurację? Wszystkie zmiany zostaną utracone.')) {
      resetToDefaults();
      refreshData();
      showToast('Przywrócono domyślną konfigurację');
    }
  };

  const toggleExpand = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Get all leaf categories (that can hold documents)
  const getLeafCategories = (node = menuStructure, path = '') => {
    const results = [];
    if (!node) return results;
    const currentPath = path ? `${path} > ${node.name}` : node.name;

    if (node.id !== 'main') {
      results.push({ id: node.id, name: node.name, path: currentPath });
    }

    if (node.children) {
      node.children.forEach(child => {
        results.push(...getLeafCategories(child, node.id === 'main' ? '' : currentPath));
      });
    }
    return results;
  };

  // Render category tree
  const renderCategoryTree = (node, depth = 0) => {
    if (!node || node.id === 'main') {
      return node?.children?.map(child => renderCategoryTree(child, 0));
    }

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedCategories[node.id];
    const docs = docsConfig[node.id] || [];
    const isEditing = editingCategory === node.id;

    return (
      <div key={node.id} className="mb-1">
        <div
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50 ${
            depth === 0 ? 'bg-white shadow-sm' : 'ml-4'
          }`}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(node.id)}
            className="p-0.5 text-gray-400 hover:text-gray-600"
          >
            {hasChildren || docs.length > 0 ? (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          <Folder className="w-4 h-4 text-primary flex-shrink-0" />

          {isEditing ? (
            <EditCategoryInline
              initialName={node.name}
              onSave={(name) => handleUpdateCategory(node.id, name)}
              onCancel={() => setEditingCategory(null)}
            />
          ) : (
            <>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                {node.name}
              </span>
              <span className="text-xs text-gray-400 mr-1">
                {docs.length} dok.
              </span>
              <button
                onClick={() => setEditingCategory(node.id)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Edytuj"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setAddDocumentCategory(node.id);
                  setShowAddDocument(true);
                }}
                className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                title="Dodaj dokument"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setAddCategoryParent(node.id);
                  setShowAddCategory(true);
                }}
                className="p-1 text-gray-400 hover:text-primary transition-colors"
                title="Dodaj podkategorię"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteCategory(node.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Usuń"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Documents list */}
        {isExpanded && docs.length > 0 && (
          <div className="ml-8 mt-1 space-y-1">
            {docs.map(doc => (
              <DocumentItem
                key={doc.id}
                doc={doc}
                categoryId={node.id}
                isEditing={editingDocument === doc.id}
                onEdit={() => setEditingDocument(doc.id)}
                onCancelEdit={() => setEditingDocument(null)}
                onSave={(updates) => handleUpdateDocument(node.id, doc.id, updates)}
                onDelete={() => handleDeleteDocument(node.id, doc.id)}
              />
            ))}
          </div>
        )}

        {/* Subcategories */}
        {isExpanded && hasChildren && (
          <div className="ml-2">
            {node.children.map(child => renderCategoryTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!menuStructure) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <h1 className="text-lg font-bold text-gray-800">Panel administratora</h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Wyjdź
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {[
          { id: 'categories', label: 'Katalogi i dokumenty', icon: Folder },
          { id: 'pin', label: 'Zarządzanie PIN', icon: Key },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-24">
        {/* PIN Management Section */}
        {activeSection === 'pin' && (
          <div className="space-y-4 animate-fadeIn">
            {/* User PIN */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                PIN użytkownika
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Obecny PIN: <span className="font-mono font-bold">{showPins ? getUserPin() : '••••••'}</span>
                <button onClick={() => setShowPins(!showPins)} className="ml-2 text-primary">
                  {showPins ? <EyeOff className="w-3.5 h-3.5 inline" /> : <Eye className="w-3.5 h-3.5 inline" />}
                </button>
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  maxLength={6}
                  placeholder="Nowy PIN (6 cyfr)"
                  value={newUserPin}
                  onChange={(e) => setNewUserPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono tracking-widest"
                />
                <input
                  type="tel"
                  maxLength={6}
                  placeholder="Potwierdź nowy PIN"
                  value={confirmUserPin}
                  onChange={(e) => setConfirmUserPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono tracking-widest"
                />
                <button
                  onClick={handleChangeUserPin}
                  className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Zmień PIN użytkownika
                </button>
              </div>
            </div>

            {/* Admin PIN */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                PIN administratora
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Wymagane podanie obecnego PIN-u administratora
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  maxLength={6}
                  placeholder="Obecny PIN administratora"
                  value={currentAdminPin}
                  onChange={(e) => setCurrentAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 font-mono tracking-widest"
                />
                <input
                  type="tel"
                  maxLength={6}
                  placeholder="Nowy PIN administratora (6 cyfr)"
                  value={newAdminPin}
                  onChange={(e) => setNewAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 font-mono tracking-widest"
                />
                <input
                  type="tel"
                  maxLength={6}
                  placeholder="Potwierdź nowy PIN administratora"
                  value={confirmAdminPin}
                  onChange={(e) => setConfirmAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 font-mono tracking-widest"
                />
                <button
                  onClick={handleChangeAdminPin}
                  className="w-full bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Zmień PIN administratora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories & Documents Section */}
        {activeSection === 'categories' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Action bar */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setAddCategoryParent('main');
                  setShowAddCategory(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                Nowa kategoria
              </button>
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-300 transition-colors"
                title="Przywróć domyślne"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Category tree */}
            <div className="space-y-1">
              {renderCategoryTree(menuStructure)}
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <Modal onClose={() => setShowAddCategory(false)} title="Dodaj kategorię">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nazwa kategorii *</label>
              <input
                type="text"
                placeholder="np. Nowa kategoria"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ID kategorii (opcjonalnie)</label>
              <input
                type="text"
                placeholder="Auto-generowane z nazwy"
                value={newCatId}
                onChange={(e) => setNewCatId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ścieżka w repo GitHub (opcjonalnie)</label>
              <input
                type="text"
                placeholder="np. brand-manual/nowa-kategoria"
                value={newCatPath}
                onChange={(e) => setNewCatPath(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <p className="text-xs text-gray-400">
              Kategoria zostanie dodana do: <strong>{addCategoryParent === 'main' ? 'Główny katalog' : addCategoryParent}</strong>
            </p>
            <button
              onClick={handleAddCategory}
              className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Dodaj kategorię
            </button>
          </div>
        </Modal>
      )}

      {/* Add Document Modal */}
      {showAddDocument && (
        <Modal onClose={() => setShowAddDocument(false)} title="Dodaj dokument">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nazwa dokumentu *</label>
              <input
                type="text"
                placeholder="np. Instrukcja obsługi"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nazwa pliku PDF</label>
              <input
                type="text"
                placeholder="np. instrukcja-obslugi.pdf"
                value={newDocFilename}
                onChange={(e) => setNewDocFilename(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <Link className="w-3 h-3 inline mr-1" />
                Lub pełny URL do pliku PDF
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={newDocUrl}
                onChange={(e) => setNewDocUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <p className="text-xs text-gray-400">
              Dokument dodany do: <strong>{addDocumentCategory}</strong>
            </p>
            <p className="text-xs text-gray-400">
              Jeśli podasz URL, zostanie on użyty zamiast ścieżki GitHub.
              W przeciwnym razie plik musi być wgrany do repozytorium GitHub.
            </p>
            <button
              onClick={handleAddDocument}
              className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Dodaj dokument
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-4 right-4 mx-auto max-w-sm z-[100] animate-fadeIn`}>
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-gray-800 text-white'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Check className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== Sub-components ==========

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden animate-scaleIn">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function EditCategoryInline({ initialName, onSave, onCancel }) {
  const [name, setName] = useState(initialName);

  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-2 py-1 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(name);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <button onClick={() => onSave(name)} className="p-1 text-green-500 hover:text-green-700">
        <Check className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function DocumentItem({ doc, categoryId, isEditing, onEdit, onCancelEdit, onSave, onDelete }) {
  const [name, setName] = useState(doc.name);
  const [filename, setFilename] = useState(doc.filename);
  const [customUrl, setCustomUrl] = useState(doc.customUrl || '');

  if (isEditing) {
    return (
      <div className="bg-blue-50 rounded-xl p-3 space-y-2 animate-fadeIn">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nazwa dokumentu"
          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          autoFocus
        />
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Nazwa pliku"
          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="url"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="URL (opcjonalnie)"
          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSave({ name, filename, customUrl: customUrl || null })}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-semibold"
          >
            <Save className="w-3.5 h-3.5" /> Zapisz
          </button>
          <button
            onClick={onCancelEdit}
            className="flex-1 flex items-center justify-center gap-1 bg-gray-200 text-gray-600 py-2 rounded-lg text-xs font-semibold"
          >
            Anuluj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
      <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-700 truncate block">{doc.name}</span>
        <span className="text-[10px] text-gray-400 truncate block">{doc.customUrl || doc.filename}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1 text-gray-400 hover:text-blue-500">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
