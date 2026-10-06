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

- [ ] 🔴 **P0.3 — Spójność `levels[]` ↔ wymagania egzaminacyjne**
  Audyt (`node scripts/audit-danych.mjs` → `RAPORT.md`) wykazuje **31 mismatchów**:
  technika jest linkowana w wymaganiach stopnia, którego nie ma w jej `levels[]`
  (np. *Seiken chudan oi-zuki* wymagany na 9 kyu, a `levels=[10]` — filtr
  atlasu nie pokaże jej na stronie 9). Do wyboru: (a) dopisać brakujące
  stopnie (można wygenerować z linkowanych wymagań), albo (b) udokumentować
  semantykę „pierwszy stopień" w `WEB_PERSONAL.md` i zaakceptować rozjazd.
  Kryteria: audyt bez warningów `MISMATCH`, `npm run build` ✅.

- [ ] 🔴 **P0.4 — Kolizja aliasu „Kumite turniejowe"**
  Ten sam alias należy do 7 technik `jiyu-kumite-*` — `findTechniqueByAlias()`
  zawsze zwraca pierwszą z brzegu. Usunąć alias z 6 (zostawić przy właściwej)
  albo rozróżnić nazwy. Kryteria: audyt bez warningów `KOLIZJA`,
  `npm run build` ✅.

- [ ] 🟡 **P1.1 — Weryfikacja treści ze sensei**
  Wymagania 12 stopni (`levels.json`) i ~25 haseł słownika
  (`glossary.json`) powstały programowo na bazie danych kolorowych pasów —
  oznacz do merytorycznej korekty przez instruktora (nazwy, zakres, staż).
  Kryteria: przegląd + poprawki wpisane bezpośrednio do JSON-ów, build ✅.

- [ ] 🟡 **P1.6 — Brakujące techniki w atlasie (Saiha, Seienchin, ushiro-mawashi)**
  `levels.json` wymienia techniki, których nie ma w `techniques.json`:
  kata **Saiha** i **Seienchin** (1 dan) oraz **Ushiro-mawashi-geri** (3 kyu).
  Dopis wpisy (`aliases`, `levels`, `infographic`: `kata` / `geri`) i sprawdź
  linkowanie z poziomu. Decyzja (2026-10-06): to dalszy rozwój strony,
  na razie pomijamy (te pozycje są celowo nielinkowane).
  Kryteria: techniki widoczne w atlasie i linkowane z właściwych stopni,
  `npm run build` ✅.

- [ ] 🟡 **P1.7 — Słownik: Rei / Osu / Bunkai / Kamae + linkowanie wymagań**
  Pozycje wymagań jak „Ukłon rei", „Znaczenie słowa Osu", „Podstawy bunkai",
  „kamae i dystans" (raport: 8 pozycji, w tym „Seiza i mokuso") nie linkują,
  bo odpowiednich haseł nie ma. Dopisz hasła do `glossary.json` (Rei, Osu,
  Bunkai, Kamae — własne kategorie lub „Postawa i etykieta"; opcjonalnie
  Seiza/Mokuso) i rozszerz `RequirementsPanel` o linkowanie do haseł
  słownika (poza technikami). Kryteria: wskazane pozycje linkują,
  `npm run build` ✅.

- [ ] 🟡 **P1.2 — Zdjęcia dla haseł słownika**
  Pola `image` w `glossary.json` są puste (`null`) → modal pokazuje placeholder
  z kanji. Dodaj zdjęcia do `public/images/glossary/` (min. 6–8 haseł: strefy,
  seiken, hiza, zenkutsu-dachi…) i uzupełnij `image` ścieżką
  `"/images/glossary/<id>.jpg"`. Karta w gridzie pokaże miniaturę.
  Kryteria: ≥6 haseł ze zdjęciem, `npm run build` ✅.

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
