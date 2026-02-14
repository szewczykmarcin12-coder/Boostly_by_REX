import { NextResponse } from 'next/server';
import {
  getAdminPin,
  getMenuStructure, saveMenuStructure,
  getDocumentsConfig, saveDocumentsConfig,
  getCategoryPaths, saveCategoryPaths,
  getNotifications, saveNotifications,
  findCategoryById, isKvConfigured,
} from '@/lib/kv';

async function verifyAdmin(adminPin) {
  const correctPin = await getAdminPin();
  return adminPin === correctPin;
}

async function addNotification(notification) {
  const notifications = await getNotifications();
  const newNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
  const updated = [newNotification, ...notifications].slice(0, 100); // keep max 100
  await saveNotifications(updated);
  return updated;
}

export async function POST(request) {
  try {
    if (!isKvConfigured()) {
      return NextResponse.json(
        { error: 'Baza danych nie jest skonfigurowana. Skonfiguruj Upstash Redis w panelu Vercel.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { adminPin, action } = body;

    if (!await verifyAdmin(adminPin)) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN administratora' }, { status: 403 });
    }

    switch (action) {
      // ========== CATEGORIES ==========
      case 'addCategory': {
        const { parentId, category } = body;
        const menu = await getMenuStructure();

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
        await saveMenuStructure(menu);

        const paths = await getCategoryPaths();
        paths[category.id] = category.path || category.id;
        await saveCategoryPaths(paths);

        const docs = await getDocumentsConfig();
        if (!docs[category.id]) {
          docs[category.id] = [];
          await saveDocumentsConfig(docs);
        }

        await addNotification({
          type: 'new_category',
          title: 'Nowa kategoria',
          message: `Dodano nową kategorię "${category.name}"`,
        });

        return NextResponse.json({ ok: true });
      }

      case 'updateCategory': {
        const { categoryId, updates } = body;
        const menu = await getMenuStructure();

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
        await saveMenuStructure(menu);

        return NextResponse.json({ ok: true });
      }

      case 'deleteCategory': {
        const { categoryId } = body;
        const menu = await getMenuStructure();

        function removeFromTree(node) {
          if (node.children) {
            const idx = node.children.findIndex((c) => c.id === categoryId);
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
        await saveMenuStructure(menu);

        const docs = await getDocumentsConfig();
        delete docs[categoryId];
        await saveDocumentsConfig(docs);

        const paths = await getCategoryPaths();
        delete paths[categoryId];
        await saveCategoryPaths(paths);

        return NextResponse.json({ ok: true });
      }

      // ========== DOCUMENTS ==========
      case 'addDocument': {
        const { categoryId, document } = body;
        const docs = await getDocumentsConfig();
        if (!docs[categoryId]) docs[categoryId] = [];

        docs[categoryId].push({
          id: document.id || `doc-${Date.now()}`,
          name: document.name,
          filename: document.filename,
          customUrl: document.customUrl || null,
        });
        await saveDocumentsConfig(docs);

        const menu = await getMenuStructure();
        const cat = findCategoryById(categoryId, menu);
        const catName = cat ? cat.name : categoryId;

        await addNotification({
          type: 'new_document',
          title: 'Nowy dokument dodany',
          message: `Dodano nowy dokument "${document.name}" w kategorii ${catName}`,
        });

        return NextResponse.json({ ok: true });
      }

      case 'updateDocument': {
        const { categoryId, documentId, updates } = body;
        const docs = await getDocumentsConfig();
        if (!docs[categoryId]) return NextResponse.json({ ok: false, error: 'Kategoria nie istnieje' });

        const idx = docs[categoryId].findIndex((d) => d.id === documentId);
        if (idx !== -1) {
          docs[categoryId][idx] = { ...docs[categoryId][idx], ...updates };
          await saveDocumentsConfig(docs);

          await addNotification({
            type: 'new_document',
            title: 'Aktualizacja dokumentu',
            message: `Zaktualizowano dokument "${updates.name || docs[categoryId][idx].name}"`,
          });
        }

        return NextResponse.json({ ok: true });
      }

      case 'deleteDocument': {
        const { categoryId, documentId } = body;
        const docs = await getDocumentsConfig();
        if (docs[categoryId]) {
          docs[categoryId] = docs[categoryId].filter((d) => d.id !== documentId);
          await saveDocumentsConfig(docs);
        }
        return NextResponse.json({ ok: true });
      }

      // ========== NOTIFICATIONS ==========
      case 'markNotificationRead': {
        const { notificationId } = body;
        const notifications = await getNotifications();
        const updated = notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        await saveNotifications(updated);
        return NextResponse.json({ ok: true });
      }

      case 'markAllNotificationsRead': {
        const notifications = await getNotifications();
        const updated = notifications.map((n) => ({ ...n, read: true }));
        await saveNotifications(updated);
        return NextResponse.json({ ok: true });
      }

      // ========== RESET ==========
      case 'resetToDefaults': {
        const { resetAllData } = await import('@/lib/kv');
        await resetAllData();
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: `Nieznana akcja: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin config error:', error);
    return NextResponse.json({ error: 'Błąd serwera: ' + error.message }, { status: 500 });
  }
}
