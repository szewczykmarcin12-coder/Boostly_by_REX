// Vercel KV helper with graceful fallback
// When KV is not configured, returns defaults from static config
import { createClient } from '@vercel/kv';

// Lazy singleton – only created when actually needed
let kvClient = null;

function getKv() {
  if (kvClient) return kvClient;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  kvClient = createClient({ url, token });
  return kvClient;
}

export const KV_KEYS = {
  USER_PIN: 'boostly:user_pin',
  ADMIN_PIN: 'boostly:admin_pin',
  MENU_STRUCTURE: 'boostly:menu_structure',
  DOCS_CONFIG: 'boostly:docs_config',
  CATEGORY_PATHS: 'boostly:category_paths',
  NOTIFICATIONS: 'boostly:notifications',
};

// Default values imported from static config
import { menuStructure as defaultMenuStructure } from '@/data/menuStructure';
import {
  documentsConfig as defaultDocumentsConfig,
  categoryPaths as defaultCategoryPaths,
  GITHUB_RAW_BASE,
} from '@/data/documentsConfig';

const DEFAULT_USER_PIN = '123456';
const DEFAULT_ADMIN_PIN = '000000';

// ============ Generic KV Read/Write ============

async function kvGet(key, fallback) {
  try {
    const kv = getKv();
    if (!kv) return fallback;
    const val = await kv.get(key);
    return val !== null && val !== undefined ? val : fallback;
  } catch (e) {
    console.error(`KV GET error for ${key}:`, e.message);
    return fallback;
  }
}

async function kvSet(key, value) {
  try {
    const kv = getKv();
    if (!kv) throw new Error('KV not configured');
    await kv.set(key, value);
    return true;
  } catch (e) {
    console.error(`KV SET error for ${key}:`, e.message);
    return false;
  }
}

// ============ Public API ============

export async function getUserPin() {
  return kvGet(KV_KEYS.USER_PIN, DEFAULT_USER_PIN);
}

export async function setUserPin(pin) {
  return kvSet(KV_KEYS.USER_PIN, pin);
}

export async function getAdminPin() {
  return kvGet(KV_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
}

export async function setAdminPin(pin) {
  return kvSet(KV_KEYS.ADMIN_PIN, pin);
}

export async function getMenuStructure() {
  return kvGet(KV_KEYS.MENU_STRUCTURE, defaultMenuStructure);
}

export async function saveMenuStructure(structure) {
  return kvSet(KV_KEYS.MENU_STRUCTURE, structure);
}

export async function getDocumentsConfig() {
  return kvGet(KV_KEYS.DOCS_CONFIG, defaultDocumentsConfig);
}

export async function saveDocumentsConfig(config) {
  return kvSet(KV_KEYS.DOCS_CONFIG, config);
}

export async function getCategoryPaths() {
  return kvGet(KV_KEYS.CATEGORY_PATHS, defaultCategoryPaths);
}

export async function saveCategoryPaths(paths) {
  return kvSet(KV_KEYS.CATEGORY_PATHS, paths);
}

export async function getNotifications() {
  return kvGet(KV_KEYS.NOTIFICATIONS, []);
}

export async function saveNotifications(notifications) {
  return kvSet(KV_KEYS.NOTIFICATIONS, notifications);
}

// ============ Derived Helpers ============

export async function getFullConfig() {
  const [menuStructure, docsConfig, categoryPaths, notifications] = await Promise.all([
    getMenuStructure(),
    getDocumentsConfig(),
    getCategoryPaths(),
    getNotifications(),
  ]);
  return { menuStructure, docsConfig, categoryPaths, notifications };
}

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

// ============ Init / Seed ============

export async function initializeDefaults() {
  const kv = getKv();
  if (!kv) return { ok: false, reason: 'KV not configured' };

  // Only seed if user_pin doesn't exist yet (first run)
  const existing = await kv.get(KV_KEYS.USER_PIN);
  if (existing !== null && existing !== undefined) {
    return { ok: true, reason: 'Already initialized' };
  }

  await Promise.all([
    kvSet(KV_KEYS.USER_PIN, DEFAULT_USER_PIN),
    kvSet(KV_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN),
    kvSet(KV_KEYS.MENU_STRUCTURE, defaultMenuStructure),
    kvSet(KV_KEYS.DOCS_CONFIG, defaultDocumentsConfig),
    kvSet(KV_KEYS.CATEGORY_PATHS, defaultCategoryPaths),
    kvSet(KV_KEYS.NOTIFICATIONS, []),
  ]);

  return { ok: true, reason: 'Seeded with defaults' };
}

export async function resetAllData() {
  const kv = getKv();
  if (!kv) return false;

  // Delete all keys
  await Promise.all(
    Object.values(KV_KEYS).map((key) => kv.del(key))
  );

  // Re-seed with defaults
  await Promise.all([
    kvSet(KV_KEYS.USER_PIN, DEFAULT_USER_PIN),
    kvSet(KV_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN),
    kvSet(KV_KEYS.MENU_STRUCTURE, defaultMenuStructure),
    kvSet(KV_KEYS.DOCS_CONFIG, defaultDocumentsConfig),
    kvSet(KV_KEYS.CATEGORY_PATHS, defaultCategoryPaths),
    kvSet(KV_KEYS.NOTIFICATIONS, []),
  ]);

  return true;
}

export function isKvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}
