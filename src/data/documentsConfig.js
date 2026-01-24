// Konfiguracja dokumentów dla aplikacji Boostly
// Edytuj ten plik, aby dodawać/usuwać dokumenty

// Base URL dla dokumentów na GitHub
// Zmień na swoje repozytorium po wdrożeniu
export const GITHUB_RAW_BASE = 'https://github.com/szewczykmarcin12-coder/Boostly_by_REX/tree/main/documents';

// Definicja dokumentów dla każdej kategorii
// Format: categoryId -> lista dokumentów
export const documentsConfig = {
  'micros-symphony': [
    { id: 'ms-1', name: 'Instrukcja obsługi Micros', filename: 'instrukcja-obslugi-micros.pdf' },
    { id: 'ms-2', name: 'Konfiguracja systemu', filename: 'konfiguracja-systemu.pdf' },
    { id: 'ms-3', name: 'Rozwiązywanie problemów', filename: 'rozwiazywanie-problemow.pdf' },
  ],
  
  'zarzadzanie-restauracja': [
    { id: 'zr-1', name: 'Procedury otwarcia restauracji', filename: 'procedury-otwarcia.pdf' },
    { id: 'zr-2', name: 'Procedury zamknięcia restauracji', filename: 'procedury-zamkniecia.pdf' },
    { id: 'zr-3', name: 'Zarządzanie zmianą', filename: 'zarzadzanie-zmiana.pdf' },
    { id: 'zr-4', name: 'Checklist dzienny', filename: 'checklist-dzienny.pdf' },
  ],
  
  'obszar-people': [
    { id: 'op-1', name: 'Rekrutacja pracowników', filename: 'rekrutacja-pracownikow.pdf' },
    { id: 'op-2', name: 'Szkolenia wstępne', filename: 'szkolenia-wstepne.pdf' },
    { id: 'op-3', name: 'Grafik pracy', filename: 'grafik-pracy.pdf' },
    { id: 'op-4', name: 'Motywacja zespołu', filename: 'motywacja-zespolu.pdf' },
  ],
  
  'obszar-product': [
    { id: 'opr-1', name: 'Kontrola jakości', filename: 'kontrola-jakosci.pdf' },
    { id: 'opr-2', name: 'Specyfikacje produktów', filename: 'specyfikacje-produktow.pdf' },
    { id: 'opr-3', name: 'Standardy podawania', filename: 'standardy-podawania.pdf' },
  ],
  
  'obszar-facility': [
    { id: 'of-1', name: 'Utrzymanie czystości', filename: 'utrzymanie-czystosci.pdf' },
    { id: 'of-2', name: 'Konserwacja sprzętu', filename: 'konserwacja-sprzetu.pdf' },
    { id: 'of-3', name: 'Harmonogram sprzątania', filename: 'harmonogram-sprzatania.pdf' },
  ],
  
  'bezpieczenstwo-zywnosci': [
    { id: 'bz-1', name: 'HACCP', filename: 'haccp.pdf' },
    { id: 'bz-2', name: 'Procedury sanitarne', filename: 'procedury-sanitarne.pdf' },
    { id: 'bz-3', name: 'Kontrola temperatur', filename: 'kontrola-temperatur.pdf' },
  ],
  
  'przewodnik-dla-nowych-pracownikow': [
    { id: 'pnp-1', name: 'Twoja praca', filename: 'twoja-praca.pdf' },
    { id: 'pnp-2', name: 'Urlopy, zwolnienia lekarskie', filename: 'urlopy-zwolnienia.pdf' },
    { id: 'pnp-3', name: 'Twój rozwój', filename: 'twoj-rozwoj.pdf' },
    { id: 'pnp-4', name: 'Twoje benefity', filename: 'twoje-benefity.pdf' },
    { id: 'pnp-5', name: 'Twoja satysfakcja', filename: 'twoja-satysfakcja.pdf' },
  ],
  
  'wiedza-o-popeyes': [
    { id: 'wop-1', name: 'Historia marki Popeyes', filename: 'historia-marki.pdf' },
    { id: 'wop-2', name: 'Wartości Popeyes', filename: 'wartosci-popeyes.pdf' },
    { id: 'wop-3', name: 'Kultura Louisiana', filename: 'kultura-louisiana.pdf' },
  ],
  
  'obsluga-gosci': [
    { id: 'og-1', name: 'Standardy obsługi gości', filename: 'standardy-obslugi.pdf' },
    { id: 'og-2', name: 'Obsługa reklamacji', filename: 'obsluga-reklamacji.pdf' },
    { id: 'og-3', name: 'Skrypty rozmów', filename: 'skrypty-rozmow.pdf' },
  ],
  
  'food-safety': [
    { id: 'fs-1', name: 'Bezpieczeństwo żywności', filename: 'bezpieczenstwo-zywnosci.pdf' },
    { id: 'fs-2', name: 'Kontrola temperatur', filename: 'kontrola-temperatur.pdf' },
    { id: 'fs-3', name: 'Alergeny', filename: 'alergeny.pdf' },
    { id: 'fs-4', name: 'Higiena osobista', filename: 'higiena-osobista.pdf' },
  ],
  
  'przechowywanie-i-przygotowywanie-produktow': [
    { id: 'pip-1', name: 'Magazynowanie produktów', filename: 'magazynowanie.pdf' },
    { id: 'pip-2', name: 'Przygotowanie mise en place', filename: 'mise-en-place.pdf' },
    { id: 'pip-3', name: 'Rotacja produktów FIFO', filename: 'rotacja-fifo.pdf' },
  ],
  
  'produkty-smazone-i-pieczone': [
    { id: 'psp-1', name: 'Smażenie kurczaka', filename: 'smazenie-kurczaka.pdf' },
    { id: 'psp-2', name: 'Produkty pieczone', filename: 'produkty-pieczone.pdf' },
    { id: 'psp-3', name: 'Temperatury smażenia', filename: 'temperatury-smazenia.pdf' },
  ],
  
  'wrapy': [
    { id: 'wr-1', name: 'Wrap Classic', filename: 'wrap-classic.pdf' },
    { id: 'wr-2', name: 'Wrap Spicy', filename: 'wrap-spicy.pdf' },
    { id: 'wr-3', name: 'Wrap Louisiana', filename: 'wrap-louisiana.pdf' },
  ],
  
  'burgery': [
    { id: 'bu-1', name: 'Chicken Burger', filename: 'chicken-burger.pdf' },
    { id: 'bu-2', name: 'Spicy Burger', filename: 'spicy-burger.pdf' },
    { id: 'bu-3', name: 'Big Box Burger', filename: 'big-box-burger.pdf' },
  ],
  
  'produkty-smazone': [
    { id: 'ps-1', name: 'Stripsy', filename: 'stripsy.pdf' },
    { id: 'ps-2', name: 'Nuggetsy', filename: 'nuggetsy.pdf' },
    { id: 'ps-3', name: 'Skrzydełka', filename: 'skrzydełka.pdf' },
    { id: 'ps-4', name: 'Kawałki kurczaka', filename: 'kawalki-kurczaka.pdf' },
  ],
  
  'produkty-z-pieca-rational': [
    { id: 'pr-1', name: 'Ustawienia pieca Rational', filename: 'ustawienia-pieca.pdf' },
    { id: 'pr-2', name: 'Receptury pieczenia', filename: 'receptury-pieczenia.pdf' },
    { id: 'pr-3', name: 'Czyszczenie pieca', filename: 'czyszczenie-pieca.pdf' },
  ],
  
  'napoje': [
    { id: 'na-1', name: 'Napoje zimne', filename: 'napoje-zimne.pdf' },
    { id: 'na-2', name: 'Napoje gorące', filename: 'napoje-gorace.pdf' },
    { id: 'na-3', name: 'Koktajle', filename: 'koktajle.pdf' },
  ],
  
  'desery': [
    { id: 'de-1', name: 'Menu deserów', filename: 'menu-deserow.pdf' },
    { id: 'de-2', name: 'Lody i sundae', filename: 'lody-sundae.pdf' },
  ],
  
  'lto': [
    { id: 'lto-1', name: 'Aktualne promocje LTO', filename: 'aktualne-promocje.pdf' },
    { id: 'lto-2', name: 'Kalendarz LTO', filename: 'kalendarz-lto.pdf' },
  ],
  
  'wydawanie-zamowien-kurierowi': [
    { id: 'wzk-1', name: 'Procedura wydawania zamówień', filename: 'procedura-wydawania.pdf' },
    { id: 'wzk-2', name: 'Pakowanie zamówień delivery', filename: 'pakowanie-zamowien.pdf' },
    { id: 'wzk-3', name: 'Weryfikacja zamówień', filename: 'weryfikacja-zamowien.pdf' },
  ],
  
  'dzialania-menadzera': [
    { id: 'dm-1', name: 'Zarządzanie delivery', filename: 'zarzadzanie-delivery.pdf' },
    { id: 'dm-2', name: 'Raporty i statystyki', filename: 'raporty-statystyki.pdf' },
    { id: 'dm-3', name: 'Rozwiązywanie problemów', filename: 'rozwiazywanie-problemow.pdf' },
  ],
};

// Mapowanie categoryId -> ścieżka w katalogu documents
export const categoryPaths = {
  'micros-symphony': 'micros-symphony',
  'zarzadzanie-restauracja': 'brand-manual/zarzadzanie-restauracja',
  'obszar-people': 'brand-manual/obszar-people',
  'obszar-product': 'brand-manual/obszar-product',
  'obszar-facility': 'brand-manual/obszar-facility',
  'bezpieczenstwo-zywnosci': 'brand-manual/bezpieczenstwo-zywnosci',
  'przewodnik-dla-nowych-pracownikow': 'przewodnik-dla-nowych-pracownikow',
  'wiedza-o-popeyes': 'wiedza-o-popeyes',
  'obsluga-gosci': 'obsluga-gosci',
  'food-safety': 'food-safety',
  'przechowywanie-i-przygotowywanie-produktow': 'standardy/przechowywanie-i-przygotowywanie-produktow',
  'produkty-smazone-i-pieczone': 'standardy/produkty-smazone-i-pieczone',
  'wrapy': 'produkty/wrapy',
  'burgery': 'produkty/burgery',
  'produkty-smazone': 'produkty/produkty-smazone',
  'produkty-z-pieca-rational': 'produkty/produkty-z-pieca-rational',
  'napoje': 'produkty/napoje',
  'desery': 'produkty/desery',
  'lto': 'lto',
  'wydawanie-zamowien-kurierowi': 'delivery/wydawanie-zamowien-kurierowi',
  'dzialania-menadzera': 'delivery/dzialania-menadzera',
};

// Funkcja pomocnicza do pobierania dokumentów dla kategorii
export function getDocumentsForCategory(categoryId) {
  const docs = documentsConfig[categoryId] || [];
  const path = categoryPaths[categoryId] || categoryId;
  
  return docs.map(doc => ({
    ...doc,
    type: 'DOCUMENT',
    categoryId: categoryId,
    pdfUrl: `${GITHUB_RAW_BASE}/${path}/${doc.filename}`,
  }));
}
