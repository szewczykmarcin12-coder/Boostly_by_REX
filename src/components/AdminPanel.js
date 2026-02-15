'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Shield, Key, FolderPlus, FilePlus, Trash2, Edit3,
  Save, X, ChevronRight, ChevronDown, FileText, Folder,
  AlertCircle, Check, LogOut, RefreshCw, Eye, EyeOff, Link, Loader2,
  Upload, File
} from 'lucide-react';
import { fetchConfig, adminAction, adminChangePin, adminGetUserPin, uploadPdf } from '@/lib/api';

export default function AdminPanel({ adminPin: initialAdminPin, onClose }) {
  const [adminPin, setAdminPinState] = useState(initialAdminPin);
  const [activeSection, setActiveSection] = useState('categories');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addCategoryParent, setAddCategoryParent] = useState('main');
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [addDocumentCategory, setAddDocumentCategory] = useState('');
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // PIN management
  const [currentUserPin, setCurrentUserPinDisplay] = useState('••••••');
  const [newUserPin, setNewUserPin] = useState('');
  const [confirmUserPin, setConfirmUserPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [showPins, setShowPins] = useState(false);

  // Add category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatPath, setNewCatPath] = useState('');

  // Add document form
  const [newDocName, setNewDocName] = useState('');
  const [newDocFile, setNewDocFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null); // null | 'uploading' | 'done'
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try { setConfig(await fetchConfig()); }
    catch (e) { showToast('Błąd ładowania konfiguracji', 'error'); }
    finally { setLoading(false); }
  };

  const loadUserPin = async () => {
    try { const data = await adminGetUserPin(adminPin); setCurrentUserPinDisplay(data.userPin); }
    catch { /* ignore */ }
  };

  useEffect(() => {
    if (activeSection === 'pin' && showPins) loadUserPin();
  }, [activeSection, showPins]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const doAction = async (action, payload = {}) => {
    setActionLoading(true);
    try {
      await adminAction(adminPin, action, payload);
      await loadData();
      return true;
    } catch (e) {
      showToast(e.message || 'Błąd operacji', 'error');
      return false;
    } finally { setActionLoading(false); }
  };

  // ========== PIN ==========
  const handleChangeUserPin = async () => {
    if (newUserPin.length !== 6 || !/^\d{6}$/.test(newUserPin)) { showToast('PIN musi składać się z 6 cyfr', 'error'); return; }
    if (newUserPin !== confirmUserPin) { showToast('PIN-y nie są identyczne', 'error'); return; }
    try {
      await adminChangePin(adminPin, 'changeUserPin', newUserPin);
      setNewUserPin(''); setConfirmUserPin('');
      showToast('PIN użytkownika został zmieniony');
      if (showPins) loadUserPin();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleChangeAdminPin = async () => {
    if (newAdminPin.length !== 6 || !/^\d{6}$/.test(newAdminPin)) { showToast('PIN musi składać się z 6 cyfr', 'error'); return; }
    if (newAdminPin !== confirmAdminPin) { showToast('PIN-y nie są identyczne', 'error'); return; }
    try {
      await adminChangePin(adminPin, 'changeAdminPin', newAdminPin);
      // Update local admin PIN so subsequent API calls use the new one
      setAdminPinState(newAdminPin);
      setNewAdminPin(''); setConfirmAdminPin('');
      showToast('PIN administratora został zmieniony');
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ========== Category ops ==========
  const handleAddCategory = async () => {
    if (!newCatName.trim()) { showToast('Podaj nazwę kategorii', 'error'); return; }
    const id = newCatId.trim() || newCatName.toLowerCase().replace(/[ąćęłńóśźż]/g, c => 'acelnoszz'['ąćęłńóśźż'.indexOf(c)]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const ok = await doAction('addCategory', {
      parentId: addCategoryParent,
      category: { id, name: newCatName.trim(), path: newCatPath.trim() || id, icon: 'circle' },
    });
    if (ok) { setNewCatName(''); setNewCatId(''); setNewCatPath(''); setShowAddCategory(false); showToast(`Kategoria "${newCatName.trim()}" została dodana`); }
  };

  const handleUpdateCategory = async (categoryId, newName) => {
    await doAction('updateCategory', { categoryId, updates: { name: newName } });
    setEditingCategory(null);
    showToast('Kategoria zaktualizowana');
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Usunąć tę kategorię i jej dokumenty?')) return;
    await doAction('deleteCategory', { categoryId });
    showToast('Kategoria usunięta');
  };

  // ========== Document ops ==========
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Dozwolone są tylko pliki PDF', 'error');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast('Plik jest za duży (max 50MB)', 'error');
      return;
    }
    setNewDocFile(file);
    if (!newDocName) {
      // Auto-fill name from filename
      setNewDocName(file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
    }
  };

  const handleAddDocument = async () => {
    if (!newDocName.trim()) { showToast('Podaj nazwę dokumentu', 'error'); return; }
    if (!newDocFile) { showToast('Wybierz plik PDF', 'error'); return; }

    // Step 1: Upload PDF
    setUploadProgress('uploading');
    let fileUrl;
    try {
      const result = await uploadPdf(adminPin, newDocFile);
      fileUrl = result.url;
      setUploadedUrl(fileUrl);
    } catch (e) {
      setUploadProgress(null);
      showToast('Błąd przesyłania: ' + e.message, 'error');
      return;
    }

    // Step 2: Add document to config with uploaded URL
    setUploadProgress('done');
    const ok = await doAction('addDocument', {
      categoryId: addDocumentCategory,
      document: {
        id: `doc-${Date.now()}`,
        name: newDocName.trim(),
        filename: newDocFile.name,
        customUrl: fileUrl,
      },
    });

    if (ok) {
      setNewDocName('');
      setNewDocFile(null);
      setUploadedUrl('');
      setUploadProgress(null);
      setShowAddDocument(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast(`Dokument "${newDocName.trim()}" został dodany`);
    }
  };

  const handleUpdateDocument = async (categoryId, docId, updates) => {
    await doAction('updateDocument', { categoryId, documentId: docId, updates });
    setEditingDocument(null);
    showToast('Dokument zaktualizowany');
  };

  const handleDeleteDocument = async (categoryId, docId) => {
    if (!window.confirm('Usunąć ten dokument?')) return;
    await doAction('deleteDocument', { categoryId, documentId: docId });
    showToast('Dokument usunięty');
  };

  const handleReset = async () => {
    if (!window.confirm('Przywrócić domyślną konfigurację? Wszystkie zmiany zostaną utracone.')) return;
    await doAction('resetToDefaults');
    showToast('Przywrócono domyślne');
  };

  const toggleExpand = (id) => setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));

  // ========== Render category tree ==========
  const renderCategoryTree = (node, depth = 0) => {
    if (!node) return null;
    if (node.id === 'main') return node.children?.map(child => renderCategoryTree(child, 0));

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedCategories[node.id];
    const docs = config?.docsConfig?.[node.id] || [];
    const isEditing = editingCategory === node.id;

    return (
      <div key={node.id} className="mb-1">
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50 ${depth === 0 ? 'bg-white shadow-sm' : 'ml-4'}`}>
          <button onClick={() => toggleExpand(node.id)} className="p-0.5 text-gray-400 hover:text-gray-600">
            {hasChildren || docs.length > 0 ? (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : <div className="w-4 h-4" />}
          </button>
          <Folder className="w-4 h-4 text-primary flex-shrink-0" />

          {isEditing ? (
            <EditCategoryInline initialName={node.name} onSave={(name) => handleUpdateCategory(node.id, name)} onCancel={() => setEditingCategory(null)} />
          ) : (
            <>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{node.name}</span>
              <span className="text-xs text-gray-400 mr-1">{docs.length} dok.</span>
              <button onClick={() => setEditingCategory(node.id)} className="p-1 text-gray-400 hover:text-blue-500" title="Edytuj"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={() => { setAddDocumentCategory(node.id); setShowAddDocument(true); setNewDocName(''); setNewDocFile(null); setUploadedUrl(''); setUploadProgress(null); }} className="p-1 text-gray-400 hover:text-green-500" title="Dodaj dokument"><FilePlus className="w-3.5 h-3.5" /></button>
              <button onClick={() => { setAddCategoryParent(node.id); setShowAddCategory(true); }} className="p-1 text-gray-400 hover:text-primary" title="Dodaj podkategorię"><FolderPlus className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDeleteCategory(node.id)} className="p-1 text-gray-400 hover:text-red-500" title="Usuń"><Trash2 className="w-3.5 h-3.5" /></button>
            </>
          )}
        </div>
        {isExpanded && docs.length > 0 && (
          <div className="ml-8 mt-1 space-y-1">
            {docs.map(doc => (
              <DocumentItem key={doc.id} doc={doc} categoryId={node.id} isEditing={editingDocument === doc.id} onEdit={() => setEditingDocument(doc.id)} onCancelEdit={() => setEditingDocument(null)} onSave={(u) => handleUpdateDocument(node.id, doc.id, u)} onDelete={() => handleDeleteDocument(node.id, doc.id)} />
            ))}
          </div>
        )}
        {isExpanded && hasChildren && <div className="ml-2">{node.children.map(child => renderCategoryTree(child, depth + 1))}</div>}
      </div>
    );
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Ładowanie panelu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-500" /><h1 className="text-lg font-bold text-gray-800">Panel administratora</h1></div>
          </div>
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg"><LogOut className="w-4 h-4" /> Wyjdź</button>
        </div>
        {!config.kvConfigured && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-yellow-800 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Upstash Redis nie jest skonfigurowany. Zmiany nie będą zapisywane.</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {[
          { id: 'categories', label: 'Katalogi i dokumenty', icon: Folder },
          { id: 'pin', label: 'Zarządzanie PIN', icon: Key },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSection === tab.id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-24">
        {/* PIN Section */}
        {activeSection === 'pin' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2"><Key className="w-5 h-5 text-primary" />PIN użytkownika</h3>
              <p className="text-xs text-gray-500 mb-4">
                Obecny PIN: <span className="font-mono font-bold">{showPins ? currentUserPin : '••••••'}</span>
                <button onClick={() => setShowPins(!showPins)} className="ml-2 text-primary">{showPins ? <EyeOff className="w-3.5 h-3.5 inline" /> : <Eye className="w-3.5 h-3.5 inline" />}</button>
              </p>
              <div className="space-y-3">
                <input type="tel" maxLength={6} placeholder="Nowy PIN (6 cyfr)" value={newUserPin} onChange={(e) => setNewUserPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono tracking-widest" />
                <input type="tel" maxLength={6} placeholder="Potwierdź nowy PIN" value={confirmUserPin} onChange={(e) => setConfirmUserPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono tracking-widest" />
                <button onClick={handleChangeUserPin} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">Zmień PIN użytkownika</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-red-500" />PIN administratora</h3>
              <p className="text-xs text-gray-500 mb-4">Zmiana PIN-u administratora</p>
              <div className="space-y-3">
                <input type="tel" maxLength={6} placeholder="Nowy PIN administratora (6 cyfr)" value={newAdminPin} onChange={(e) => setNewAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 font-mono tracking-widest" />
                <input type="tel" maxLength={6} placeholder="Potwierdź nowy PIN administratora" value={confirmAdminPin} onChange={(e) => setConfirmAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 font-mono tracking-widest" />
                <button onClick={handleChangeAdminPin} className="w-full bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Zmień PIN administratora</button>
              </div>
            </div>
          </div>
        )}

        {/* Categories & Documents */}
        {activeSection === 'categories' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex gap-2 mb-4">
              <button onClick={() => { setAddCategoryParent('main'); setShowAddCategory(true); }} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                <FolderPlus className="w-4 h-4" /> Nowa kategoria
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-300 transition-colors" title="Przywróć domyślne">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {!config.blobConfigured && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2 text-blue-800 text-xs mb-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Upload PDF wymaga Vercel Blob.</strong> Aby przesyłać pliki z urządzenia, dodaj Blob Store w Vercel → Storage → Create Database → Blob.
                </div>
              </div>
            )}
            <div className="space-y-1">{renderCategoryTree(config.menuStructure)}</div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <Modal onClose={() => setShowAddCategory(false)} title="Dodaj kategorię">
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Nazwa kategorii *</label><input type="text" placeholder="np. Nowa kategoria" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" autoFocus /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">ID kategorii (opcjonalnie)</label><input type="text" placeholder="Auto-generowane" value={newCatId} onChange={(e) => setNewCatId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Ścieżka w repo GitHub (opcjonalnie)</label><input type="text" placeholder="np. brand-manual/nowa-kategoria" value={newCatPath} onChange={(e) => setNewCatPath(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" /></div>
            <p className="text-xs text-gray-400">Kategoria dodana do: <strong>{addCategoryParent === 'main' ? 'Główny katalog' : addCategoryParent}</strong></p>
            <button onClick={handleAddCategory} disabled={actionLoading} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors">
              {actionLoading ? 'Dodawanie...' : 'Dodaj kategorię'}
            </button>
          </div>
        </Modal>
      )}

      {/* Add Document Modal - with file upload */}
      {showAddDocument && (
        <Modal onClose={() => { setShowAddDocument(false); setUploadProgress(null); setNewDocFile(null); setUploadedUrl(''); }} title="Dodaj dokument PDF">
          <div className="space-y-4">
            {/* File picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Wybierz plik PDF *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  newDocFile ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-orange-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {newDocFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <File className="w-10 h-10 text-green-500" />
                    <p className="text-sm font-semibold text-green-700">{newDocFile.name}</p>
                    <p className="text-xs text-green-600">{(newDocFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setNewDocFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Usuń plik
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">Kliknij aby wybrać plik PDF</p>
                    <p className="text-xs text-gray-400">Maksymalny rozmiar: 50 MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Document name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nazwa dokumentu *</label>
              <input
                type="text"
                placeholder="np. Instrukcja obsługi"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <p className="text-xs text-gray-400">Dokument dodany do: <strong>{addDocumentCategory}</strong></p>

            {/* Upload progress */}
            {uploadProgress === 'uploading' && (
              <div className="flex items-center gap-2 text-primary text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Przesyłanie pliku...</span>
              </div>
            )}

            <button
              onClick={handleAddDocument}
              disabled={actionLoading || uploadProgress === 'uploading' || !newDocFile}
              className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {uploadProgress === 'uploading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Przesyłanie...</>
              ) : (
                <><Upload className="w-4 h-4" /> Prześlij i dodaj dokument</>
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-4 right-4 mx-auto max-w-sm z-[100] animate-fadeIn">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white"><h3 className="text-lg font-bold text-gray-800">{title}</h3><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-600" /></button></div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function EditCategoryInline({ initialName, onSave, onCancel }) {
  const [name, setName] = useState(initialName);
  return (
    <div className="flex items-center gap-2 flex-1">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-2 py-1 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') onSave(name); if (e.key === 'Escape') onCancel(); }} />
      <button onClick={() => onSave(name)} className="p-1 text-green-500 hover:text-green-700"><Check className="w-4 h-4" /></button>
      <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
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
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa" className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm" autoFocus />
        <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="Plik" className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm" />
        <input type="url" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="URL (opcjonalnie)" className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm" />
        <div className="flex gap-2">
          <button onClick={() => onSave({ name, filename, customUrl: customUrl || null })} className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-semibold"><Save className="w-3.5 h-3.5" /> Zapisz</button>
          <button onClick={onCancelEdit} className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg text-xs font-semibold">Anuluj</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
      <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-700 truncate block">{doc.name}</span>
        <span className="text-[10px] text-gray-400 truncate block">{doc.customUrl ? '☁️ Przesłany' : doc.filename}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1 text-gray-400 hover:text-blue-500"><Edit3 className="w-3.5 h-3.5" /></button>
        <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}
