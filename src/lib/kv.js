// Upstash Redis helper
// Upstash SDK automatically handles JSON serialization/deserialization
// DO NOT manually JSON.stringify/parse - the SDK does it natively

import { Redis } from '@upstash/redis';

let redisClient = null;

function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redisClient = new Redis({ url, token });
  return redisClient;
}

export const KV_KEYS = {
  USER_PIN: 'boostly:user_pin',
  ADMIN_PIN: 'boostly:admin_pin',
  MENU_STRUCTURE: 'boostly:menu_structure',
  DOCS_CONFIG: 'boostly:docs_config',
  CATEGORY_PATHS: 'boostly:category_paths',
  NOTIFICATIONS: 'boostly:notifications',
};

import { menuStructure as defaultMenuStructure } from '@/data/menuStructure';
import {
  documentsConfig as defaultDocumentsConfig,
  categoryPaths as defaultCategoryPaths,
  GITHUB_RAW_BASE,
} from '@/data/documentsConfig';

const DEFAULT_USER_PIN = '123456';
const DEFAULT_ADMIN_PIN = '000000';

// ============ Generic Read/Write ============
// Upstash SDK .set() auto-serializes objects/arrays to JSON
// Upstash SDK .get() auto-deserializes JSON back to objects/arrays
// Strings are stored/returned as strings - NO manual JSON.stringify needed

async function kvGet(key, fallback) {
  try {
    const redis = getRedis();
    if (!redis) return fallback;
    const val = await redis.get(key);
    return val !== null && val !== undefined ? val : fallback;
  } catch (e) {
    console.error(`Redis GET error for ${key}:`, e.message);
    return fallback;
  }
}

async function kvSet(key, value) {
  try {
    const redis = getRedis();
    if (!redis) throw new Error('Redis not configured');
    // DO NOT JSON.stringify - Upstash SDK handles serialization
    await redis.set(key, value);
    return true;
  } catch (e) {
    console.error(`Redis SET error for ${key}:`, e.message);
    return false;
  }
}

async function kvDel(key) {
  try {
    const redis = getRedis();
    if (!redis) return false;
    await redis.del(key);
    return true;
  } catch (e) {
    console.error(`Redis DEL error for ${key}:`, e.message);
    return false;
  }
}

// ============ Public API ============

export async function getUserPin() {
  const val = await kvGet(KV_KEYS.USER_PIN, DEFAULT_USER_PIN);
  return String(val); // ensure always a string
}

export async function setUserPin(pin) {
  return kvSet(KV_KEYS.USER_PIN, String(pin));
}

export async function getAdminPin() {
  const val = await kvGet(KV_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
  return String(val);
}

export async function setAdminPin(pin) {
  return kvSet(KV_KEYS.ADMIN_PIN, String(pin));
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
  if (structure.id === id) return [...path, { id: structure.id, name: structure.name }];
  if (structure.children) {
    for (const child of structure.children) {
      const result = getBreadcrumbPath(id, child, [...path, { id: structure.id, name: structure.name }]);
      if (result) return result;
    }
  }
  return null;
}

// ============ Init / Reset ============

export async function initializeDefaults() {
  const redis = getRedis();
  if (!redis) return { ok: false, reason: 'Redis not configured' };
  const existing = await redis.get(KV_KEYS.USER_PIN);
  if (existing !== null && existing !== undefined) return { ok: true, reason: 'Already initialized' };

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
  const redis = getRedis();
  if (!redis) return false;
  await Promise.all(Object.values(KV_KEYS).map((key) => kvDel(key)));
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
  return !!(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
  );
}

export function isBlobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}
