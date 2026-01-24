# Boostly by Rex Concepts - Popeyes Standards App

Aplikacja zawierająca standardy pracy w sieci restauracji Popeyes.

## 🚀 Wdrożenie na Vercel

### Krok 1: Przygotowanie repozytorium GitHub

1. Utwórz nowe repozytorium na GitHub (np. `boostly-popeyes`)
2. Skopiuj wszystkie pliki z tego projektu do repozytorium
3. Utwórz strukturę katalogów dla dokumentów PDF:

```
documents/
├── micros-symphony/
├── brand-manual/
│   ├── zarzadzanie-restauracja/
│   ├── obszar-people/
│   ├── obszar-product/
│   ├── obszar-facility/
│   └── bezpieczenstwo-zywnosci/
├── przewodnik-dla-nowych-pracownikow/
├── wiedza-o-popeyes/
├── obsluga-gosci/
├── food-safety/
├── standardy/
│   ├── przechowywanie-i-przygotowywanie-produktow/
│   └── produkty-smazone-i-pieczone/
├── produkty/
│   ├── wrapy/
│   ├── burgery/
│   ├── produkty-smazone/
│   ├── produkty-z-pieca-rational/
│   ├── napoje/
│   └── desery/
├── lto/
└── delivery/
    ├── wydawanie-zamowien-kurierowi/
    └── dzialania-menadzera/
```

### Krok 2: Konfiguracja URL do dokumentów

W pliku `src/components/CategoryView.js` zmień linię:

```javascript
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/boostly-popeyes-docs/main/documents';
```

Na swoje repozytorium:

```javascript
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/TWOJA_NAZWA/boostly-popeyes/main/documents';
```

### Krok 3: Wdrożenie na Vercel

1. Zaloguj się na [vercel.com](https://vercel.com)
2. Kliknij "New Project"
3. Zaimportuj swoje repozytorium GitHub
4. Vercel automatycznie wykryje Next.js
5. Kliknij "Deploy"

### Krok 4: Dodawanie dokumentów PDF

1. Umieść pliki PDF w odpowiednich katalogach w `documents/`
2. Nazwy plików powinny być w formacie: `nazwa-dokumentu.pdf` (małe litery, myślniki zamiast spacji)
3. Po każdym dodaniu plików wykonaj commit i push do GitHub
4. Vercel automatycznie zaktualizuje aplikację

## 📁 Struktura projektu

```
boostly-app/
├── src/
│   ├── app/
│   │   ├── globals.css      # Style globalne
│   │   ├── layout.js        # Layout główny
│   │   └── page.js          # Strona główna
│   ├── components/
│   │   ├── Header.js        # Nagłówek z wyszukiwaniem
│   │   ├── BottomNav.js     # Nawigacja dolna
│   │   ├── HomeScreen.js    # Ekran główny
│   │   ├── CategoriesScreen.js  # Lista kategorii
│   │   ├── CategoryView.js  # Widok kategorii
│   │   ├── DocumentCard.js  # Karta dokumentu
│   │   ├── DocumentView.js  # Widok PDF
│   │   ├── RecentScreen.js  # Ostatnio przeglądane
│   │   ├── FavoritesScreen.js   # Ulubione
│   │   ├── SearchResults.js # Wyniki wyszukiwania
│   │   └── SettingsModal.js # Ustawienia
│   └── data/
│       └── menuStructure.js # Struktura menu
├── public/                  # Pliki statyczne
├── documents/               # Dokumenty PDF (na GitHub)
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Dostosowanie

### Zmiana kolorów
Edytuj plik `tailwind.config.js`:

```javascript
colors: {
  primary: '#F57C00',      // Główny kolor (pomarańczowy Popeyes)
  secondary: '#FF9800',    // Kolor dodatkowy
  accent: '#E65100',       // Akcent
}
```

### Zmiana logo
Edytuj komponent `Header.js` - sekcja SVG logo.

### Dodawanie nowych kategorii
Edytuj plik `src/data/menuStructure.js`.

## 📱 Funkcje

- ✅ Responsywny design (mobile-first)
- ✅ Wyszukiwanie dokumentów
- ✅ System ulubionych
- ✅ Historia przeglądania
- ✅ Wyświetlanie PDF w aplikacji
- ✅ Nawigacja breadcrumb
- ✅ Offline-ready (PWA-ready)

## 🔧 Rozwój lokalny

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Budowanie produkcyjne
npm run build
```

## 📄 Licencja

© 2024 Rex Concepts. Wszelkie prawa zastrzeżone.
