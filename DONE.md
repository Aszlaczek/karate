# DONE.md — co zostało zrobione + zasady utrzymania

> **Dla kolejnych agentów:** ten plik to historia prac projektu **KIHON —
> Kyokushin Exam Guide**. Jest append-only (nie kasuj starych wpisów).
> Aktywne zadania znajdziesz w `TODO.md`, kontekst projektu w
> `WEB_PERSONAL.md`.

---

## Status projektu (stan: 2026-10-06)

**Faza: atlas treści kompletny (132 techniki) + audyt danych.** Strona buduje
się bez błędów (`npm run build` → `tsc -b && vite build`), ma 5 tras (w tym
12 endpointów stopni `/kyu/…`), dane w `src/data/*.json` (techniki w 7
filtrach kategorii, wymagania linkowane automatycznie, ilustracje SVG per
klucz infografii + gotowość na wideo z pola `video`). Odtwarzalny audyt
danych: `npm run audit` → `RAPORT.md` (0 problemów krytycznych; otwarte:
31 mismatchów `levels[]`↔wymagania = P0.3, kolizja aliasu = P0.4).
Nawigacja mobilna: burger w prawym górnym rogu (≤980px) z panelem sekcji.
Przed nami zadania z `TODO.md` (m.in. weryfikacja treści ze sensei,
brakujące kata Saiha/Seienchin).

Poprzedni stan (2026-10-05, commit `fa354c3`): wersja first — jednostronicowy
one-pager bez routera.

### Zrealizowane

- [x] **Przebudowa z `old_src/` na nowy stack** — React 19 + Vite 7 +
      TypeScript 5.9 + Tailwind v4; stary kod (z czatem AI) zachowany jako
      archiwum w `old_src/`, nowa implementacja w `src/`.
- [x] **Usunięcie czatu AI** — świadoma decyzja: projekt jest statycznym
      przewodnikiem, bez backendu i bez zewnętrznych API.
- [x] **Sekcja hero (`#start`)** — nagłówek „Każdy pas. Jeden kierunek.",
      statystyki (7 poziomów / 5 grup / 6 technik), CTA, wizualizacja z kanji
      押忍.
- [x] **Atlas stopni (`#stopnie`)** — 7 pasów (biały → czarny) z kyu, kolorem,
      belką i poziomem; kliknięcie wybiera pas i płynnie przewija do wymagań.
- [x] **Wymagania egzaminacyjne** — panel per pas: intro, orientacyjny staż,
      3 grupy tematyczne (Kihon / Kopnięcia / Kata i kumite itd.), linkowane
      techniki otwierające modal, ostrzeżenie o różnicach między
      organizacjami.
- [x] **Atlas technik (`#techniki`)** — 6 technik (uderzenia, kopnięcia,
      bloki, pozycje, kata) z kanji, romanizacją, opisem, tagiem „Klucz";
      filtry kategorii + wyszukiwarka (nazwa/kanji/wymowa/opis) + stan pusty.
- [x] **Schematy SVG ruchu** — ręcznie rysowane ilustracje 800×480 per
      technika (sylwetka, duch pozycji początkowej, czerwona linia ruchu,
      cel, siatka, linia podłogi); japońska ścieżka kata z numeracją.
- [x] **Modal wizualizacji** — otwieranie z URL `#technika-<id>`, blokada
      scrolla, zamykanie Esc / klik w tło / przycisk, legenda, kroki 01–03,
      nota bezpieczeństwa.
- [x] **Dojo-kun (`#dojo-kun`)** — 7 zasad w akordeonie (kanji + romaji +
      polskie tłumaczenie), cytat Ōyamy.
- [x] **Nawigacja i footer** — sticky header z anchorami, CTA, stopka z
      powrotem na górę.
- [x] **Responsywność i SEO bazowe** — `index.html` z `lang="pl"`, meta
      description, theme-color, favicon.
- [x] **CI/CD** — `.github/workflows/deploy.yml`: Node 22, `npm ci`,
      typecheck + build, deploy na GitHub Pages przy pushu do `main`/`master`.
- [x] **Konfiguracja builda** — `vite.config.ts` z `base: "./"` (działa dla
      dowolnej nazwy repo), `dist/` w gitignore.
- [x] **Routing (react-router 7, history API)** — trasy `/`, `/kyu/:kyuId`
      (12 stopni: start, 10–1 kyu, dan), `/techniki`, `/slownik`, `*` → 404;
      `ScrollManager` (kotwice + scroll-to-top), tytuły per strona,
      `basename` z `BASE_URL`, fallback `404.html` i `VITE_BASE` w workflow.
- [x] **Dane w jednym źródle (`src/data/`)** — `levels.json` (wymagania per
      kyu), `techniques.json` (nazwa/opus/infografia/`video`/`levels`/
      `aliases`), `glossary.json`, `dojoKun.json` + typy i dostępnicy
      (`getLevel`, `filterTechniques`…); komponenty nie trzymają treści.
- [x] **Podział kodu** — `src/components/` (11 komponentów) i `src/pages/`
      (5 stron); `App.tsx` to router + layout; modal udostępniony przez
      `TechniqueModalContext` (dostępny z wymagań i atlasu).
- [x] **Słownik karate (`/slownik`)** — 3 kategorie (strefy, części ciała,
      ustawienia stóp), ~25 haseł z kanji/romanizacją, zakładki + wyszukiwarka
      + teaser na stronie głównej.
- [x] **Wymagania per kyu** — rozbite z 7 kolorów na 12 stopni (belka = II
      stopień koloru), nawigacja prev/next między stopniami.
- [x] **Filtr stopnia w atlasie** — select pobierany z `levels.json`, karty
      technik pokazują chipy kyu, do których należą.

---

## Zasady dla kolejnych agentów (utrzymywanie `TODO.md`)

1. **Źródłem zadań jest wyłącznie `TODO.md`.** Nie zaczynaj pracy „obok" listy —
   jeśli pojawi się pomysł, najpierw dopisz go do `TODO.md` jako `- [ ]`.
2. **Przed pracą:** przeczytaj `WEB_PERSONAL.md` (kontekst i konwencje),
   potem `TODO.md`, potem ostatnie wpisy poniżej.
3. **Jedno zadanie na sesję** — bierz górne niezamknięte zadanie z priorytetu.
4. **Po ukończeniu:**
   - w `TODO.md`: `- [ ]` → `- [x]` + jednolinijkowy rezultat,
   - w `DONE.md`: nowy wpis w „Dzienniku zmian" (patrz niżej),
   - przy zmianie architektury → zaktualizuj `WEB_PERSONAL.md`.
5. **Weryfikacja:** `npm run build` musi przejść. Bez zielonego builda zadanie
   nie jest zamknięte.
6. **Historia jest append-only** — nie kasuj ani nie przerabiaj starych wpisów
   w tym pliku.

### Format wpisu w dzienniku

```markdown
### YYYY-MM-DD — <tytuł zadania>
- Zmienione pliki: `src/...`
- Rezultat: 1–2 zdania.
- Weryfikacja: `npm run build` ✅
```

---

## Dziennik zmian

### 2026-10-06 — Raport audytu danych, reorganizacja TODO i mobilna nawigacja
- Zmienione pliki: `scripts/audit-danych.mjs` (nowy skrypt audytu),
  `RAPORT.md` (generowany), `TODO.md` (nowe P0.3/P0.4/P1.7/P1.8, kolejność =
  priorytet, nota o stałych ID), `src/components/Header.tsx` (burger +
  panel `#site-menu`), `src/components/Icon.tsx` (ikona `menu`),
  `src/index.css` (style ≤980px), `package.json` (skrypt `audit`).
- Rezultat: audyt read-only `npm run audit` → `RAPORT.md`: 0 problemów
  krytycznych, 31 mismatchów `levels[]`↔wymagania (→ P0.3), 1 kolizja aliasu
  „kumite-turniejowe" ×7 technik (→ P0.4), linkowanie 42/81, klasyfikacja 39
  nielinkowanych; na telefonie przycisk ☰ w prawym górnym rogu (sticky
  header) rozwija panel ze Stopniami/Technikami/Słownikiem/Dojo-kun + CTA,
  zamknięcie: link / Escape / klik poza / zmiana trasy.
- Weryfikacja: `npm run build` ✅, `npm run audit` ✅ (exit 0),
  `vite preview` 200 na `/`, `/techniki`, `/slownik`, `/kyu/9` ✅,
  render-check Headera (toggle/aria/nav/CTA/ikona) ✅.

### 2026-10-06 — Krótkie aliasy: linkowanie wymagań 42/81
- Zmienione pliki: `src/data/techniques.json` (16 krótkich aliasów:
  `Jodan-uke`, `Gedan-barai`, `Mae-geri chudan`, `Soto-uke`, `Uchi-uke`,
  `Mawashi-geri`, `Mawashi-geri jodan`, `Yoko-geri`, `Ushiro-geri`, `Uraken`,
  `Tate-zuki`, `Morote-zuki`, `Shuto`, `Hiji-ate`, `Tobi-geri`,
  `Oroshi-kakato-geri`), `src/data/index.ts` (granice słowa w regexie
  linkującym: lookaround `[\p{L}\p{N}-]` na początku/końcu aliasu).
- Rezultat: 42/81 pozycji wymagań linkowanych (18 przed dzisiejszą sesją),
  bez regresji. Granice (z myślnikiem) zapobiegają fałszywym trafieniom —
  „Ushiro-mawashi-geri" (3 kyu) NIE linkuje się do zwykłego mawashi-geri,
  bo właściwej techniki nie ma w atlasie. Pozostałe 39 pozycji: wymagania
  nietechniczne (etykieta, dojo-kun, testy, bunkai, wiedza), opisowe/
  zbiorcze („Kombinacje w ruchu", „Seria walk kumite", „Pełen zakres kata")
  oraz „Saiha, Seienchin" i „Ushiro-mawashi-geri" bez techniki w atlasie.
- Weryfikacja: `npm run build` ✅, `techniques.json` parsuje się ✅,
  symulacja `split` + `findTechniqueByAlias`: 42/81 ✅.

### 2026-10-06 — Atlas 132 technik: ilustracje rodzinne, Kumite i normalizacja linków
- Zmienione pliki: `src/data/index.ts` (`CATEGORIES` + „Kumite",
  `normalizeAlias()`, przebudowane `buildTechniqueLinkPattern()` i
  `findTechniqueByAlias()`), `src/data/glossary.json` (15 martwych `related`
  → nowe id technik), `src/components/TechniqueIllustration.tsx` (mapa
  `DRAWINGS` zamiast if-chain: nowe rysunki `kumite` (dwie sylwetki + ma-ai)
  i `uchi` (zamach), przeniesione `dachi`/`uke`/`geri`/`kata` + stare klucze
  jako aliasy, ścieżka `video` → embed), `src/components/TechniqueModal.tsx`
  (legenda tylko gdy brak wideo), `src/index.css` (`.technique-media*`),
  nowe `public/videos/test.gif`, `TODO.md`, `WEB_PERSONAL.md`.
- Rezultat: 132 technik w atlasie z 7 kluczami infografii (pełne pokrycie
  rysunków), zakładka Kumite (24 techniki), linki wymagań odporne na
  myślniki/spacje i makrony (25/81 pozycji linkowanych, reszta to frazy
  niebędące nazwami technik), pole `video` gotowe na filmik/gif/zdjęcie.
- Weryfikacja: `npm run build` ✅, render-check przez `react-dom/server`
  (svg/img/video/iframe ✓), GIF zwalidowany `file` + `sips`,
  `vite preview` + curl 5 tras (200).

### 2026-10-05 — Projekt initialny
- Utworzono: `index.html`, `src/App.tsx`, `src/index.css`, `vite.config.ts`,
  `tsconfig*`, workflow deploy, `README.md`.
- Rezultat: kompletny, budujący się one-pager KIHON (hero, pasy, wymagania,
  atlas technik, Dojo-kun) z archiwum starej wersji w `old_src/`.
- Weryfikacja: `npm run build` ✅, commit `fa354c3`.

### 2026-10-06 — Dokumentacja dla agentów
- Utworzono: `WEB_PERSONAL.md`, `TODO.md`, `DONE.md`.
- Rezultat: wprowadzony protokół pracy kolejnych agentów (kontekst → zadania →
  dziennik).
- Weryfikacja: `npm run build` ✅ (dokumentacja poza `src/` nie wpływa na build).

### 2026-10-06 — Routing, dane w JSON i słownik
- Zmienione pliki: `src/App.tsx`, nowe `src/data/*` (5 JSON + `types.ts` +
  `index.ts`), `src/components/*` (11), `src/pages/*` (5), `src/index.css`,
  `vite.config.ts`, `.github/workflows/deploy.yml`, `index.html`,
  `tsconfig.app.json`, `WEB_PERSONAL.md`, `TODO.md`.
- Rezultat: 12 endpointów stopni (`/kyu/10` … `/kyu/1`, `/kyu/start`,
  `/kyu/dan`) z własnymi wymaganiami, atlas i słownik pobierające treść
  z `src/data/*.json` (jedno źródło prawdy), modal udostępniony przez context,
  base URL przez `VITE_BASE` + `404.html` fallback na GitHub Pages.
- Weryfikacja: `npm run build` ✅, `npm run preview` + curl wszystkich tras
  (200), build z `VITE_BASE=/web_karate/` poprawnie prefixuje assety.

### 2026-10-06 — Klikalne hasła słownika (modal + zdjęcia + powiązane techniki)
- Zmienione pliki: `src/data/glossary.json` (28 haseł: `id`, `image: null`,
  `related[]`), `src/data/types.ts`, `src/data/index.ts`
  (`getGlossaryEntry`, `getRelatedTechniques`), nowe
  `src/components/ModalProvider.tsx` (unified) i `GlossaryEntryModal.tsx`,
  usunięte `TechniqueModalProvider.tsx`, aktualizacje importów w `App.tsx`,
  `TechniquesSection`, `RequirementsPanel`, `GlossaryPage` (karty → buttony),
  `src/index.css`, `WEB_PERSONAL.md`, `TODO.md`.
- Rezultat: karta słownika otwiera modal (zdjęcie lub placeholder z kanji,
  kanji + wymowa + opis), deep-link `#haslo-<id>`, sekcja „Powiązane
  techniki" przełącza modal na technikę bez zamykania overlaya; pola `image`
  gotowe do uzupełnienia zdjęciami z `public/images/glossary/`.
- Weryfikacja: `npm run build` ✅, `npm run preview` + curl `/slownik`,
  `/techniki`, `/kyu/9` (200), bundle zawiera dane słownika i `#haslo-`.
