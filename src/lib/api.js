// Frontend API client for Boostly
// All data flows through the server API backed by Vercel KV

const API_BASE = '/api';

async function apiFetch(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

// ========== Auth ==========

export async function verifyPin(pin, mode = 'user') {
  const data = await apiFetch('/verify-pin', {
    method: 'POST',
    body: JSON.stringify({ pin, mode }),
  });
  return data.valid;
}

// ========== Config (public, read-only) ==========

export async function fetchConfig() {
  return apiFetch('/config');
}

export async function fetchNotifications() {
  const data = await apiFetch('/notifications');
  return data.notifications || [];
}

// ========== Admin operations ==========

export async function adminChangePin(adminPin, action, newPin) {
  return apiFetch('/admin/pin', {
    method: 'POST',
    body: JSON.stringify({ adminPin, action, newPin }),
  });
}

export async function adminGetUserPin(adminPin) {
  return apiFetch(`/admin/pin?adminPin=${encodeURIComponent(adminPin)}`);
}

export async function adminAction(adminPin, action, payload = {}) {
  return apiFetch('/admin/config', {
    method: 'POST',
    body: JSON.stringify({ adminPin, action, ...payload }),
  });
}

export async function adminInit() {
  return apiFetch('/admin/init', { method: 'POST' });
}

// Upload PDF file
export async function uploadPdf(adminPin, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('adminPin', adminPin);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData, // no Content-Type header - browser sets multipart boundary
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

// ========== Notification read state (local per user) ==========

export function getReadNotificationIds() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('boostly_read_notifs') || '[]');
  } catch {
    return [];
  }
}

export function markNotificationReadLocal(notifId) {
  const ids = getReadNotificationIds();
  if (!ids.includes(notifId)) {
    ids.push(notifId);
    localStorage.setItem('boostly_read_notifs', JSON.stringify(ids));
  }
}

export function markAllNotificationsReadLocal(allIds) {
  localStorage.setItem('boostly_read_notifs', JSON.stringify(allIds));
}

// ========== Helper: build PDF url ==========

import { GITHUB_RAW_BASE } from '@/data/documentsConfig';

export function buildDocumentsForCategory(docsConfig, categoryPaths, categoryId) {
  const docs = docsConfig[categoryId] || [];
  const path = categoryPaths[categoryId] || categoryId;
  return docs.map((doc) => ({
    ...doc,
    type: 'DOCUMENT',
    categoryId,
    pdfUrl: doc.customUrl || `${GITHUB_RAW_BASE}/${path}/${doc.filename}`,
  }));
}

export function findCategoryById(id, structure) {
  if (!structure) return null;
  if (structure.id === id) return structure;
  if (structure.children) {
    for (const child of structure.children) {
      const found = findCategoryById(id, child);
      if (found) return found;
    }
  }
  return null;
}

export function getBreadcrumbPath(id, structure, path = []) {
  if (!structure) return null;
  if (structure.id === id) {
    return [...path, { id: structure.id, name: structure.name }];
  }
  if (structure.children) {
    for (const child of structure.children) {
      const result = getBreadcrumbPath(id, child, [
        ...path,
        { id: structure.id, name: structure.name },
      ]);
      if (result) return result;
    }
  }
  return null;
}
