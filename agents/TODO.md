# TODO.md — aktywne zadania

> **Dla kolejnych agentów:** to jest Twoja lista zadań do projektu
> **KIHON — Kyokushin Exam Guide**. Kolejność na liście = priorytet.
> Przed pracą przeczytaj `WEB_PERSONAL.md` (kontekst + konwencje), po pracy
> zamknij zadanie w tym pliku i dopisz wpis do `DONE.md`.
>
> Format: `- [ ]` = do zrobienia, `- [x]` = zrobione (+ jednolinijkowy rezultat).
>
> **ID zadań są stałe** — nie nadawaj ponownie istniejących numerów
> (P0.1, P0.2… mają historyczne znaczenie); kolejność na liście = priorytet.

## Legenda priorytetów

- 🔴 **P0** — ułatwia dalszą pracę, rób najpierw
- 🟡 **P1** — ważne dla jakości/utrzymania
- 🟢 **P2** — warto, ale nie blokuje

---

## Zadania

- [x] 🟡 **P1.12 — Poradnik, ciekawostki, słownik i propozycje rozwoju**
  Dodać dwie pozycje nawigacji i strony z instrukcjami sprzętu oraz historią
  karate/Kyokushin, poszerzyć słownik i przygotować wiadomość z sugestią
  na `xyz@gmail.com`. Rezultat (2026-10-11): 4 poradniki, 6 punktów historii,
  6 ciekawostek, 23 nowe hasła (łącznie 56), formularz mailto i kopiowanie
  wiadomości; źródła przy treściach, menu mobile ≤1180px. Build ✅;
  112 asercji w Chrome, 7 szerokości ekranu, brak nowych błędów audytu.

- [ ] 🟡 **P1.13 — Autorskie zdjęcia i filmy do poradników**
  Uzupełnić 4 poradniki o sprawdzone przez instruktora zdjęcia kolejnych
  kroków oraz krótkie filmy (zwłaszcza węzeł pasa i owijanie dłoni).
  Kryteria: każdy poradnik z własną sekwencją ilustracji, tekstem alternatywnym
  i podpisami; prawa do publikacji ustalone, kadry czytelne na telefonie,
  build ✅.

- [ ] 🟡 **P1.14 — Opcjonalne wysyłanie zgłoszeń bez aplikacji pocztowej**
  Obecne mailto i kopiowanie działają bez backendu. Jeśli projekt ma przyjąć
  usługę wysyłkową, dodać endpoint z walidacją, ograniczeniem liczby zgłoszeń
  i sekretami po stronie serwera. Kryteria: wysyłka do skonfigurowanego odbiorcy,
  czytelny stan błędu, potwierdzenie dopiero po przyjęciu wiadomości przez usługę,
  zachowany wariant kopiowania; build ✅. Wymaga zmiany obecnej architektury
  statycznej — nie wdrażać automatycznie.

- [ ] 🟢 **P2.6 — Osobista lista przygotowań do egzaminu**
  Dodać lokalne oznaczanie przećwiczonych technik i ulubionych poradników,
  wybór docelowego stopnia oraz możliwość wyzerowania lub eksportu postępu.
  Kryteria: stan zachowany po odświeżeniu, bez logowania; odznaczenie ćwiczenia
  nie udaje oceny instruktora, build ✅.

- [ ] 🟢 **P2.7 — Fiszki nazw i komend ze słownika**
  Dodać sesję powtórek japoński → polski i polski → japoński z wyborem kategorii,
  odsłanianiem odpowiedzi i ponowną nauką pomyłek. Opcjonalnie nagrania wymowy.
  Kryteria: dane wyłącznie z istniejącego słownika, działanie klawiaturą
  i na telefonie, wynik sesji bez powtarzania tych samych pytań, build ✅.

- [ ] 🟢 **P2.8 — Dostęp offline w drodze do dojo**
  Rozważyć PWA z zapisem poradników, słownika i wymagań wybranego stopnia.
  Najpierw usunąć zależność podstawowych widoków od zewnętrznych mediów
  (P1.5). Kryteria: wybrane treści działają po odłączeniu sieci po pierwszej
  wizycie, aktualizacja cache nie pozostawia starych wersji programu,
  komunikat o niedostępnym filmie online, build ✅.

- [x] 🟡 **P1.10 — Szczegóły wszystkich technik i postaw (2026-10-11)**
  Rozbudować istniejące modale o polskie znaczenie nazwy, tłumaczenie wszystkich
  członów i sekcje opisowe dopasowane do techniki, kata, kumite lub postawy.
  Rezultat: 118 technik + 15 postaw z kompletnymi danymi; 82 indywidualne
  opisy ruchu i kontroli, osobne treści kata/kumite/postaw, audyt pokrycia.
  Build ✅; audyt szczegółów ✅, audyt całego programu nadal wykazuje
  2 znane błędy P0.3 (`gekisai-sho`, `saiha`) bez nowych błędów.
  Test przeglądarkowy: 133 widoki × 5 rozmiarów. Dokumentacja: `TECHNIQUE_DETAILS.md`.

- [ ] 🟡 **P1.11 — Redakcja nazw i spójność krótkich opisów z detalami**
  Po konsultacji z instruktorem rozstrzygnąć zapisy heisoku/haisoku,
  kaage/keage, Gariyu/Garyū, Sushiho, Saiha, Yantsu, Seishin oraz połączony
  morote uchi-uke / gedan-barai (lista i źródła w `TECHNIQUE_DETAILS.md`).
  Ujednolicić kanji, romaji, wymowę i krótkie opisy kart z treścią szczegółów,
  w tym shita-tsuki, seiza i kokutsu-dachi; przetłumaczyć zanshin w polach focus.
  Kryteria: decyzja dla każdej pozycji, spójne karty i detale, build ✅,
  brak nowych błędów audytu.

- [ ] 🟢 **P2.4 — Pełne sekwencje kata i kombinacji zatwierdzone przez dojo**
  Uzupełnić szczegóły o konkretne ruchy, miejsca kiai i nagrania instruktora,
  a renraku i kumite o dokładne układy z programu. Źródło i wersja programu
  powinny być zapisane przy treści. Kryteria: przynajmniej jedna zatwierdzona
  sekwencja dla kata, renraku i kumite, działające media, build ✅.

- [ ] 🟢 **P2.5 — Wyszukiwanie po tłumaczeniach członów nazw**
  Rozszerzyć filtry atlasu o nowe znaczenia i człony z `techniqueDetails.json`
  oraz normalizację znaków diakrytycznych. Kryteria: zapytania „pięta”,
  „leżący smok”, „chudan” znajdują właściwe pozycje, zachowane filtry stopnia
  i kategorii, build ✅.

- [ ] 🟡 **P1.1 — Weryfikacja treści ze sensei**
  Wymagania 16 stopni (`levels.json`: start, 10–1 kyu, 1–5 dan) i ~28 haseł
  słownika (`glossary.json`) powstały programowo na bazie danych kolorowych
  pasów — oznacz do merytorycznej korekty przez instruktora (nazwy, zakres,
  staż, liczby walk `fights` — w tym ekstrapolowane 10/9/8 kyu i dan).
  Kryteria: przegląd + poprawki wpisane bezpośrednio do JSON-ów, build ✅.

- [ ] 🟡 **P1.6 — Brakujące techniki w atlasie (Seienchin, ushiro-mawashi)**
  Wymagania zawierają pozycje bez odpowiednika w `techniques.json`:
  **Seienchin** (1 kyu) i **Ushiro-mawashi-geri** (3 kyu) — trzymają się
  w `levels.json` jako `{type:"text"}` (audyt: sekcja 5). Dopis wpisy
  (`aliases`, `levels`, `infographic`: `kata` / `geri`) i zamień pozycje
  na referencje `{type:"technique", id}`. (Saiha już w atlasie ✅.)
  Kryteria: techniki widoczne w atlasie i wymagane z właściwych stopni,
  `npm run audit` bez pozycji P1.6, `npm run build` ✅.

- [ ] 🟡 **P1.7 — Słownik: Rei / Osu / Bunkai / Kamae + linkowanie opisów**
  Pozycje typu `text` w wymaganiach („Ukłon rei", „Znaczenie słowa Osu",
  „Podstawy bunkai", „kamae i dystans"…) nie linkują, bo odpowiednich haseł
  nie ma. Dopisz hasła do `glossary.json` (Rei, Osu, Bunkai, Kamae — własne
  kategorie lub „Postawa i etykieta"; opcjonalnie Seiza/Mokuso). Infrastruktura
  `{type:"glossary", id}` w `RequirementItem` gotowa (dodano w ramach konsolidacji
  postaw), komponent `GlossaryLink` do renderowania linków. Pozostało: dodać
  4 hasła i podmienić odpowiednie `text` pozycje w `levels.json` na `glossary`.
  Kryteria: wskazane pozycje linkują, `npm run build` ✅.
  Postęp (2026-10-11): Rei, Osu, Bunkai, Kamae i Mokusō już dodane w P1.12.
  Seiza istniała wcześniej. Pozostaje zamiana właściwych opisów wymagań na
  referencje słownika wraz ze zgodnymi `levels[]`; zadanie nadal otwarte.

- [ ] 🟡 **P1.2 — Zdjęcia dla haseł słownika**
  Pola `image` w `glossary.json` są puste (`null`) → modal pokazuje placeholder
  z kanji. Dodaj zdjęcia do `public/images/glossary/` (min. 6–8 haseł: strefy,
  seiken, hiza, zenkutsu-dachi…) i uzupełnij `image` ścieżką
  `"/images/glossary/<id>.jpg"`. Karta w gridzie pokaże miniaturę.
  Kryteria: ≥6 haseł ze zdjęciem, `npm run build` ✅.
  Postęp (2026-10-09): 15 haseł ma zdjęcia (kategoria „Ustawienia stóp"
  — 10 istniejących + 5 dodanych w ramach konsolidacji postaw: yoi, tsuru-ashi,
  moro-ashi, heisoku, uchi-hachiji — pliki w `public/images/glossary/stances/`);
  strefy mają własny diagram SVG zamiast zdjęcia; „Części ciała" nadal bez zdjęć.

- [ ] 🟡 **P1.5 — Self-hosted zdjęcia zamiast Unsplash**
  `techniques[].image` i `hero` używają zewnętrznych URL-i Unsplash (straszy
  429/404 i brak sieci w CI). Pobierz/zasubskrybuj licencjonowane zdjęcia do
  `public/images/`, podmień URL-e na ścieżki względne od base (wraz z hasłami
  słownika z P1.2).
  Kryteria: brak `images.unsplash.com` w `src/`, build ✅.

- [ ] 🟡 **P1.3 — Testy (Vitest + Testing Library)**
  Dodaj `vitest`, `@testing-library/react`, `@testing-library/jest-dom`,
  skrypt `npm test` i pierwsze testy: filtrowanie atlasu, routing
  (`/kyu/9` renderuje wymagania), otwieranie/zamykanie modalu (Esc),
  renderowanie słownika (3 kategorie).
  Kryteria: `npm test` i `npm run build` ✅.

- [ ] 🟡 **P1.4 — ESLint + Prettier**
  Skonfiguruj ESLint (typescript-eslint + react-hooks + react-refresh,
  wzorce z `create-vite`) i Prettier, dodaj skrypty `npm run lint` /
  `npm run format`, napraw wszystkie znalezione ostrzeżenia.
  Kryteria: `npm run lint` bez błędów, `npm run build` ✅.

- [ ] 🟢 **P2.1 — SEO i Open Graph**
  Uzupełnij `index.html`: `og:*`/`twitter:*` meta, `canonical`; rozważ
  generowanie tytułów/OP dla tras (obecnie `document.title` w stronach).
  Kryteria: meta kompletna, build ✅.

- [ ] 🟢 **P2.2 — Dostępność (a11y)**
  Focus-trap + zwracanie fokusu po zamknięciu modalu, widoczny `:focus-visible`,
  kontrast kart pasów (biały/żółty na jasnym tle), szacunek dla
  `prefers-reduced-motion` (scroll smooth, animacje).
  Kryteria: nawigacja klawiaturą po całej stronie, build ✅.

- [ ] 🟢 **P2.3 — Opcjonalnie: wersja angielska (i18n)**
  Tylko jeśli pojawi się potrzeba: wydzielić teksty do słownika
  (`src/content/pl.ts` + `en.ts`) i przełącznik języka. Nie rób, dopóki nie
  zostaniesz o to poproszony.
  Kryteria: brak regresji PL, build ✅.

---

## Zasady dopisywania zadań

1. Nowe zadanie dopisuj **na koniec listy z priorytetem** (P0/P1/P2) albo
   w głąb właściwej grupy — nigdy nie kasuj istniejących pozycji.
2. Każde zadanie ma: tytuł, krótki opis **i mierzalne kryteria ukończenia**
   (zawsze: `npm run build` ✅).
3. Zamykaj tylko jedno zadanie naraz; wynik odnotuj też w `DONE.md`.
4. Zadania zrobione przenieś do archiwum poniżej (kopiuj, nie usuwaj z historii).

---

## Archiwum zamkniętych zadań

- [x] **P0.4 — Kolizja aliasu „Kumite turniejowe"** — rozstrzygnięte przy
  reorganizacji walk: wpisy `jiyu-kumite-*` (7 technik-nosników aliasu)
  usunięte z atlasu, liczbę walk przeniesiono na pole `Level.fights`;
  audyt bez kolizji `KOLIZJA`, build ✅ (2026-10-08).
- [x] **P1.9 — Kolizja aliasów krótkich „Ippon kumite N kyu"** — alias
  „Ippon kumite 10 kyu" usunięty z `ippon-kumite-10-1-kyu` (został przy
  właściwej technikze), audyt bez kolizji, build ✅ (2026-10-08).
- [x] **Wymagania strukturalne + stopnie 1–5 dan + walki w info. głównych** —
  `levels.json` przebudowane: 16 stopni (start, 10–1 kyu, `dan`…`dan5`
  o `number` 11–15), pozycje wymagań jako referencje
  `{technique|text}`, pole `fights` (badge „Walki egzaminacyjne",
  ekstrapolowane 10/9/8 kyu i dan — do weryfikacji w P1.1), genericzna
  technika `kumite` usunięta z atlasu; multi-use `TechniqueLink.tsx`
  (warianty inline/chip); kata danowe z `infographic: "kata"`, przywrócone
  pokrycie `levels[]` kyu-kata wg programu; alias-linkowanie usunięte
  z `src/data/index.ts`; audyt przepisany na strukturalne sprawdzanie
  (zakres 0–15, P0.3 = krytyczne) — 0 krytycznych / 0 ostrzeżeń,
  build ✅ (2026-10-08).

- [x] **Inicjalny rebuild projektu** — kompletny one-pager KIHON na
  React 19 + Vite 7 + TS + Tailwind v4, build ✅ (commit `fa354c3`, 2026-10-05).
- [x] **Dokumentacja dla agentów** — `WEB_PERSONAL.md`, `TODO.md`, `DONE.md`
  z protokołem pracy (2026-10-06).
- [x] **P0.1 (stare) — Podział `App.tsx` na komponenty i wydzielenie danych** —
  routing (react-router), `src/data/*.json` jako jedyne źródło treści,
  `src/components/` + `src/pages/`, build ✅ (2026-10-06).
- [x] **Endpointy stopni (12 tras `/kyu/…`)** — rozbicie kolorów na pojedyncze
  kyu z własnymi wymaganiami + belkami, nawigacja prev/next, build ✅ (2026-10-06).
- [x] **Słownik karate (`/slownik`)** — strefy, części ciała, ustawienia stóp
  z `glossary.json` + teaser na stronie głównej, build ✅ (2026-10-06).
- [x] **Klikalne hasła słownika (modal + zdjęcia + techniki powiązane)** —
  pola `id`/`image`/`related` w JSON, unified `ModalProvider`
  (deep-linki `#technika-…` i `#haslo-…`), `GlossaryEntryModal` z chipami
  przełączającymi na modal techniki, build ✅ (2026-10-06).
- [x] **P0.1 — Renderowanie wideo w modalu techniki** — `TechniqueIllustration`
  renderuje media z pola `video` (YouTube → iframe, `*.mp4` → `<video>`,
  obrazki/gify → `<img>`, ścieżki od `/` prefiksowane o `BASE_URL`), legenda
  SVG tylko dla schematu, testowy `public/videos/test.gif`, build ✅ (2026-10-06).
- [x] **P0.2 — Techniki dla wszystkich stopni** — `techniques.json` rozbudowany
  do 132 technik (kyu 10–1, 6 kategorii incl. Kumite), ilustracje rodzinne
  w mapie `DRAWINGS` (`zuki`/`uchi`/`dachi`/`uke`/`geri`/`kata`/`kumite`),
  każda karta `/kyu/…` (poza start/dan) ma ≥1 technikę, build ✅ (2026-10-06).
- [x] **P1.8 — Mobilna nawigacja (burger w prawym górnym rogu)** — przycisk ☰
  (nowa ikona `menu`) ≤980px, panel `#site-menu` z linkami do sekcji + CTA
  „Sprawdź wymagania" (CTA schowane z headera), zamykanie: link / Escape /
  klik poza / zmiana trasy, `aria-expanded` + `aria-controls`, desktop
  >980px bez zmian, build ✅ (2026-10-06).
- [x] **P0.3 — Spójność `levels[]` ↔ wymagania egzaminacyjne** — dopisano
  brakujące kyu do `levels[]` 28 technik (31 mismatchów → 0), audyt liczy
  MISMATCH-y tylko dla stopni kyu (`start`/`dan` nie mają atlasu, `levels[]`
  ∈ 1–10 — udokumentowane w `RAPORT.md` i `WEB_PERSONAL.md`), build ✅
  (2026-10-07).
- [x] **Diagram stref w słowniku** — `ZoneIllustration.tsx` (karateka
  w fudo-dachi + przerywane linie `JŌDAN`/`CHŪDAN`/`GEDAN` z podpisami
  na liniach, aktywna strefa czerwona) w modalu hasła i w pasku karty;
  kanji `kosa-dachi` → `kake-dachi` (掛け立ち), ścieżki zdjęć dopasowane
  do case plików + prefiks `BASE_URL` przez `resolveMediaSrc()`, build ✅
  (2026-10-07).
- [x] **Statyczne karty „Części ciała"** — karta tej kategorii nie otwiera
  modala: `<article className="glossary-card static">` zamiast `<button>`
  (niefocusowalna, bez hintu „Zobacz hasło", `cursor: default`, bez
  hovera); intro `/slownik` doprecykowane, chipy „Powiązane techniki"
  na kartach świadomie pominięte, build ✅ (2026-10-07).

- [x] **Konsolidacja postaw (Pozycje): atlas = słownik + refaktoring komponentów** —
  usunięto 14 duplikatów postaw z `techniques.json`, dodano 5 brakujących
  do `glossary.json` (yoi, tsuru-ashi, moro-ashi, heisoku, uchi-hachiji),
  19 referencji w `levels.json` zamieniono na `{type:"glossary", id}`,
  rozszerzono `RequirementItem` o typ `glossary` + `GlossaryEntry.levels?`,
  zaktualizowano audyt (P0.3 dla postaw), usunięto 14 kluczy z `genaiImages.json`.
  Refaktoryzacja: nowe komponenty UI (`src/components/ui/` — Card, SectionHeading,
  CategoryTabs, SearchBox, EmptyState), rozbicie `TechniquesSection` na
  `TechniqueCard`, `TechniquesToolbar`, `AllTechniques`, `GlossaryPage` na
  `GlossaryCard`, `GlossaryGrid`, `GlossaryToolbar`, `GlossaryLink`,
  `HomePage`/`LevelPage` używają `SectionHeading`. Build ✅, audit 0/0,
  preview 200 na 6 trasach (2026-10-09).
