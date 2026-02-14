// Centralized data store with localStorage persistence
// This module manages PINs, categories, documents, and notifications

import { menuStructure as defaultMenuStructure } from './menuStructure';
import { documentsConfig as defaultDocumentsConfig, categoryPaths as defaultCategoryPaths, GITHUB_RAW_BASE } from './documentsConfig';

export { GITHUB_RAW_BASE };

const STORAGE_KEYS = {
  USER_PIN: 'boostly_user_pin',
  ADMIN_PIN: 'boostly_admin_pin',
  MENU_STRUCTURE: 'boostly_menu_structure',
  DOCUMENTS_CONFIG: 'boostly_documents_config',
  CATEGORY_PATHS: 'boostly_category_paths',
  NOTIFICATIONS: 'boostly_notifications',
  AUTH_STATUS: 'boostly_auth_status',
  LAST_CONTENT_HASH: 'boostly_content_hash',
};

// Default PINs
const DEFAULT_USER_PIN = '123456';
const DEFAULT_ADMIN_PIN = '000000';

// =====================
// PIN Management
// =====================

export function getUserPin() {
  if (typeof window === 'undefined') return DEFAULT_USER_PIN;
  return localStorage.getItem(STORAGE_KEYS.USER_PIN) || DEFAULT_USER_PIN;
}

export function setUserPin(pin) {
  localStorage.setItem(STORAGE_KEYS.USER_PIN, pin);
}

export function getAdminPin() {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
}

export function setAdminPin(pin) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, pin);
}

export function verifyUserPin(pin) {
  return pin === getUserPin();
}

export function verifyAdminPin(pin) {
  return pin === getAdminPin();
}

// Auth status (session-based with localStorage)
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('boostly_auth') === 'true';
}

export function setAuthenticated(value) {
  if (value) {
    sessionStorage.setItem('boostly_auth', 'true');
  } else {
    sessionStorage.removeItem('boostly_auth');
  }
}

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('boostly_admin_auth') === 'true';
}

export function setAdminAuthenticated(value) {
  if (value) {
    sessionStorage.setItem('boostly_admin_auth', 'true');
  } else {
    sessionStorage.removeItem('boostly_admin_auth');
  }
}

// =====================
// Menu Structure Management
// =====================

export function getMenuStructure() {
  if (typeof window === 'undefined') return defaultMenuStructure;
  const saved = localStorage.getItem(STORAGE_KEYS.MENU_STRUCTURE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultMenuStructure;
    }
  }
  return defaultMenuStructure;
}

export function saveMenuStructure(structure) {
  localStorage.setItem(STORAGE_KEYS.MENU_STRUCTURE, JSON.stringify(structure));
}

// =====================
// Documents Config Management
// =====================

export function getDocumentsConfig() {
  if (typeof window === 'undefined') return defaultDocumentsConfig;
  const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS_CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultDocumentsConfig;
    }
  }
  return defaultDocumentsConfig;
}

export function saveDocumentsConfig(config) {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS_CONFIG, JSON.stringify(config));
}

export function getCategoryPaths() {
  if (typeof window === 'undefined') return defaultCategoryPaths;
  const saved = localStorage.getItem(STORAGE_KEYS.CATEGORY_PATHS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultCategoryPaths;
    }
  }
  return defaultCategoryPaths;
}

export function saveCategoryPaths(paths) {
  localStorage.setItem(STORAGE_KEYS.CATEGORY_PATHS, JSON.stringify(paths));
}

// =====================
// Dynamic document fetcher (replaces static getDocumentsForCategory)
// =====================

export function getDocumentsForCategory(categoryId) {
  const docsConfig = getDocumentsConfig();
  const catPaths = getCategoryPaths();
  const docs = docsConfig[categoryId] || [];
  const path = catPaths[categoryId] || categoryId;

  return docs.map(doc => ({
    ...doc,
    type: 'DOCUMENT',
    categoryId: categoryId,
    pdfUrl: doc.customUrl || `${GITHUB_RAW_BASE}/${path}/${doc.filename}`,
  }));
}

// =====================
// Category helpers (dynamic)
// =====================

export function findCategoryById(id, structure) {
  const menu = structure || getMenuStructure();
  if (menu.id === id) return menu;
  if (menu.children) {
    for (const child of menu.children) {
      const found = findCategoryById(id, child);
      if (found) return found;
    }
  }
  return null;
}

export function getBreadcrumbPath(id, structure, path = []) {
  const menu = structure || getMenuStructure();
  if (menu.id === id) {
    return [...path, { id: menu.id, name: menu.name }];
  }
  if (menu.children) {
    for (const child of menu.children) {
      const result = getBreadcrumbPath(id, child, [...path, { id: menu.id, name: menu.name }]);
      if (result) return result;
    }
  }
  return null;
}

// =====================
// Notifications Management
// =====================

export function getNotifications() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

export function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

export function addNotification(notification) {
  const notifications = getNotifications();
  const newNotification = {
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
  const updated = [newNotification, ...notifications];
  saveNotifications(updated);
  return updated;
}

// =====================
// Admin operations (category & document CRUD)
// =====================

export function addCategory(parentId, category) {
  const menu = getMenuStructure();

  function addToParent(node) {
    if (node.id === parentId) {
      if (!node.children) node.children = [];
      node.children.push({
        id: category.id,
        name: category.name,
        icon: category.icon || 'circle',
        children: [],
        documents: [],
      });
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (addToParent(child)) return true;
      }
    }
    return false;
  }

  addToParent(menu);
  saveMenuStructure(menu);

  // Set up category path
  const paths = getCategoryPaths();
  paths[category.id] = category.path || category.id;
  saveCategoryPaths(paths);

  // Initialize empty docs for this category
  const docs = getDocumentsConfig();
  if (!docs[category.id]) {
    docs[category.id] = [];
    saveDocumentsConfig(docs);
  }

  // Add notification
  addNotification({
    type: 'new_category',
    title: 'Nowa kategoria',
    message: `Dodano nową kategorię "${category.name}"`,
  });

  return menu;
}

export function updateCategory(categoryId, updates) {
  const menu = getMenuStructure();

  function updateInTree(node) {
    if (node.id === categoryId) {
      if (updates.name) node.name = updates.name;
      if (updates.icon) node.icon = updates.icon;
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (updateInTree(child)) return true;
      }
    }
    return false;
  }

  updateInTree(menu);
  saveMenuStructure(menu);
  return menu;
}

export function deleteCategory(categoryId) {
  const menu = getMenuStructure();

  function removeFromTree(node) {
    if (node.children) {
      const idx = node.children.findIndex(c => c.id === categoryId);
      if (idx !== -1) {
        node.children.splice(idx, 1);
        return true;
      }
      for (const child of node.children) {
        if (removeFromTree(child)) return true;
      }
    }
    return false;
  }

  removeFromTree(menu);
  saveMenuStructure(menu);

  // Clean up docs and paths
  const docs = getDocumentsConfig();
  delete docs[categoryId];
  saveDocumentsConfig(docs);

  const paths = getCategoryPaths();
  delete paths[categoryId];
  saveCategoryPaths(paths);

  return menu;
}

export function addDocument(categoryId, document) {
  const docs = getDocumentsConfig();
  if (!docs[categoryId]) docs[categoryId] = [];

  docs[categoryId].push({
    id: document.id || `doc-${Date.now()}`,
    name: document.name,
    filename: document.filename,
    customUrl: document.customUrl || null,
  });

  saveDocumentsConfig(docs);

  // Find category name
  const cat = findCategoryById(categoryId);
  const catName = cat ? cat.name : categoryId;

  addNotification({
    type: 'new_document',
    title: 'Nowy dokument dodany',
    message: `Dodano nowy dokument "${document.name}" w kategorii ${catName}`,
  });

  return docs;
}

export function updateDocument(categoryId, documentId, updates) {
  const docs = getDocumentsConfig();
  if (!docs[categoryId]) return docs;

  const idx = docs[categoryId].findIndex(d => d.id === documentId);
  if (idx !== -1) {
    docs[categoryId][idx] = { ...docs[categoryId][idx], ...updates };
    saveDocumentsConfig(docs);

    addNotification({
      type: 'new_document',
      title: 'Aktualizacja dokumentu',
      message: `Zaktualizowano dokument "${updates.name || docs[categoryId][idx].name}"`,
    });
  }

  return docs;
}

export function deleteDocument(categoryId, documentId) {
  const docs = getDocumentsConfig();
  if (!docs[categoryId]) return docs;

  docs[categoryId] = docs[categoryId].filter(d => d.id !== documentId);
  saveDocumentsConfig(docs);
  return docs;
}

// =====================
// Reset to defaults
// =====================

export function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.MENU_STRUCTURE);
  localStorage.removeItem(STORAGE_KEYS.DOCUMENTS_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.CATEGORY_PATHS);
}
