// Struktura katalogów aplikacji Boostly dla Popeyes
export const menuStructure = {
  id: 'main',
  name: 'Main',
  children: [
    {
      id: 'micros-symphony',
      name: 'Micros Symphony',
      icon: 'monitor',
      children: [],
      documents: []
    },
    {
      id: 'brand-manual',
      name: 'Brand Manual',
      icon: 'book',
      children: [
        {
          id: 'zarzadzanie-restauracja',
          name: 'Zarządzanie restauracją',
          icon: 'building',
          children: [],
          documents: []
        },
        {
          id: 'obszar-people',
          name: 'Obszar People',
          icon: 'users',
          children: [],
          documents: []
        },
        {
          id: 'obszar-product',
          name: 'Obszar Product',
          icon: 'package',
          children: [],
          documents: []
        },
        {
          id: 'obszar-facility',
          name: 'Obszar Facility',
          icon: 'home',
          children: [],
          documents: []
        },
        {
          id: 'bezpieczenstwo-zywnosci',
          name: 'Bezpieczeństwo żywności',
          icon: 'shield',
          children: [],
          documents: []
        }
      ],
      documents: []
    },
    {
      id: 'przewodnik-dla-nowych-pracownikow',
      name: 'Przewodnik dla nowych pracowników',
      icon: 'user-plus',
      children: [],
      documents: []
    },
    {
      id: 'wiedza-o-popeyes',
      name: 'Wiedza o Popeyes',
      icon: 'info',
      children: [],
      documents: []
    },
    {
      id: 'obsluga-gosci',
      name: 'Obsługa gości',
      icon: 'smile',
      children: [],
      documents: []
    },
    {
      id: 'food-safety',
      name: 'Food Safety',
      icon: 'alert-triangle',
      children: [],
      documents: []
    },
    {
      id: 'standardy',
      name: 'Standardy',
      icon: 'check-circle',
      children: [
        {
          id: 'przechowywanie-i-przygotowywanie-produktow',
          name: 'Przechowywanie i przygotowywanie produktów',
          icon: 'archive',
          children: [],
          documents: []
        },
        {
          id: 'produkty-smazone-i-pieczone',
          name: 'Produkty smażone i pieczone',
          icon: 'flame',
          children: [],
          documents: []
        }
      ],
      documents: []
    },
    {
      id: 'produkty',
      name: 'Produkty',
      icon: 'shopping-bag',
      children: [
        {
          id: 'wrapy',
          name: 'Wrapy',
          icon: 'circle',
          children: [],
          documents: []
        },
        {
          id: 'burgery',
          name: 'Burgery',
          icon: 'circle',
          children: [],
          documents: []
        },
        {
          id: 'produkty-smazone',
          name: 'Produkty smażone',
          icon: 'circle',
          children: [],
          documents: []
        },
        {
          id: 'produkty-z-pieca-rational',
          name: 'Produkty z pieca Rational',
          icon: 'circle',
          children: [],
          documents: []
        },
        {
          id: 'napoje',
          name: 'Napoje',
          icon: 'coffee',
          children: [],
          documents: []
        },
        {
          id: 'desery',
          name: 'Desery',
          icon: 'cake',
          children: [],
          documents: []
        }
      ],
      documents: []
    },
    {
      id: 'lto',
      name: 'LTO',
      icon: 'clock',
      children: [],
      documents: []
    },
    {
      id: 'delivery',
      name: 'Delivery',
      icon: 'truck',
      children: [
        {
          id: 'wydawanie-zamowien-kurierowi',
          name: 'Wydawanie zamówień kurierowi',
          icon: 'package',
          children: [],
          documents: []
        },
        {
          id: 'dzialania-menadzera',
          name: 'Działania menadżera',
          icon: 'user-check',
          children: [],
          documents: []
        }
      ],
      documents: []
    }
  ]
};

// Funkcja pomocnicza do znajdowania kategorii po ID
export function findCategoryById(id, structure = menuStructure) {
  if (structure.id === id) return structure;
  
  if (structure.children) {
    for (const child of structure.children) {
      const found = findCategoryById(id, child);
      if (found) return found;
    }
  }
  
  return null;
}

// Funkcja do generowania breadcrumb path
export function getBreadcrumbPath(id, structure = menuStructure, path = []) {
  if (structure.id === id) {
    return [...path, { id: structure.id, name: structure.name }];
  }
  
  if (structure.children) {
    for (const child of structure.children) {
      const result = getBreadcrumbPath(id, child, [...path, { id: structure.id, name: structure.name }]);
      if (result) return result;
    }
  }
  
  return null;
}

// Funkcja do pobierania ścieżki plików PDF na GitHubie
export function getGitHubPdfPath(categoryId) {
  const pathMap = {
    'micros-symphony': 'micros-symphony',
    'brand-manual': 'brand-manual',
    'zarzadzanie-restauracja': 'brand-manual/zarzadzanie-restauracja',
    'obszar-people': 'brand-manual/obszar-people',
    'obszar-product': 'brand-manual/obszar-product',
    'obszar-facility': 'brand-manual/obszar-facility',
    'bezpieczenstwo-zywnosci': 'brand-manual/bezpieczenstwo-zywnosci',
    'przewodnik-dla-nowych-pracownikow': 'przewodnik-dla-nowych-pracownikow',
    'wiedza-o-popeyes': 'wiedza-o-popeyes',
    'obsluga-gosci': 'obsluga-gosci',
    'food-safety': 'food-safety',
    'standardy': 'standardy',
    'przechowywanie-i-przygotowywanie-produktow': 'standardy/przechowywanie-i-przygotowywanie-produktow',
    'produkty-smazone-i-pieczone': 'standardy/produkty-smazone-i-pieczone',
    'produkty': 'produkty',
    'wrapy': 'produkty/wrapy',
    'burgery': 'produkty/burgery',
    'produkty-smazone': 'produkty/produkty-smazone',
    'produkty-z-pieca-rational': 'produkty/produkty-z-pieca-rational',
    'napoje': 'produkty/napoje',
    'desery': 'produkty/desery',
    'lto': 'lto',
    'delivery': 'delivery',
    'wydawanie-zamowien-kurierowi': 'delivery/wydawanie-zamowien-kurierowi',
    'dzialania-menadzera': 'delivery/dzialania-menadzera'
  };
  
  return pathMap[categoryId] || categoryId;
}
