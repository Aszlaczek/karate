# DONE.md — co zostało zrobione + zasady utrzymania

> **Dla kolejnych agentów:** ten plik to historia prac projektu **KIHON —
> Kyokushin Exam Guide**. Jest append-only (nie kasuj starych wpisów).
> Aktywne zadania znajdziesz w `TODO.md`, kontekst projektu w
> `WEB_PERSONAL.md`.

---

## Status projektu (stan: 2026-10-08)

**Faza: atlas treści kompletny (132 techniki) + jedno źródło prawdy dla
odnośników.** Strona buduje się bez błędów (`npm run build` → `tsc -b && vite
build`), ma 5 tras (w tym 16 endpointów stopni `/kyu/…`: start, 10–1 kyu,
1–5 dan), dane w `src/data/*.json` (techniki w 7 filtrach kategorii,
**wymagania strukturalne** — referencje technik `{type:"technique", id}`
renderowane przez wspólny `TechniqueLink` + opisy `{type:"text"}`, liczba walk
w polu `fights` jako badge w informacjach głównych, wizualizacja technik =
zdjęcia GenAI (mapa `features/technique/data/genaiImages.json`, 96/132;
reszta → placeholder z kanji; karta grayscale, modal pełny kolor) + gotowość
na wideo z pola `video`). Odtwarzalny audyt danych:
`npm run audit` → `RAPORT.md` (0 ostrzeżeń; **2 znane błędy krytyczne
P0.3** — `gekisai-sho`/`saiha` bez stopnia kyu w `levels[]` po zewnętrznej
edycji `techniques.json` 2026-10-08 21:08, decyzja użytkownika: nie ruszać
danych). Nawigacja: sticky header
działa też po scrollu (`overflow-x: clip` na `.app-shell`), pasek prev /
wszystkie / next jest w panelu wymagań, nie pod technikami; burger w prawym
górnym rogu (≤980px). **Architektura frontendu przebudowana (2026-10-08):**
kod w folderach `src/app/` (router, ModalHost), `src/store/` (Zustand —
modale + menu mobilne), `src/hooks/`, `src/components/ui/`, `src/features/*`
(komponent + style obok siebie); style CSS per feature importowane przez
`src/styles/index.css` (kolejność importów = kaskada); importy przez alias
`@/*`. Przed nami zadania z `TODO.md` (m.in. weryfikacja
treści ze sensei — w tym ekstrapolowane liczby walk, brakujące kata
Seienchin/Ushiro-mawashi, linkowanie opisów do słownika).

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

### 2026-10-08 — Zdjęcia GenAI zamiast SVG + DRY modali i linków technik
- Zmienione pliki:
  - `src/features/technique/components/TechniqueIllustration.tsx` — usunięte
    wszystkie rysunki SVG postaci (mapa `DRAWINGS`, funkcje `*Art`);
    renderuje teraz: film/wideo → zdjęcie z mapy GenAI
    (`.technique-photo-frame`) → placeholder z kanji
    (`.technique-visual-placeholder`); nowe `resolveTechniqueImage()`,
    `resolveMediaSrc()` nadal eksportowany dla słownika;
  - nowe `src/features/technique/data/genaiImages.json` — 96/132 technik →
    `/images/GenAI/techniques/{start|N|dan}/{id}.png` (folder = pierwszy
    level techniki mający plik);
  - usunięte `src/features/technique/styles/illustration.css` (+ import
    z `styles/index.css`); style rysunku stref przeniesione do
    `glossary.css`, klasa SVG `technique-illustration` → `zone-illustration`
    (`ZoneIllustration.tsx`);
  - `TechniqueModal.tsx` — usunięta legenda SVG, nowe copy kroku 02 i noty
    poglądowej; nowy `src/hooks/useModalBase.ts` — wspólny Esc / blokada
    scrolla / backdrop dla `TechniqueModal` i `GlossaryEntryModal`;
  - `src/data/types.ts` — usunięte `infographic: string` z `Technique`
    (pole zostaje w JSON-ach — kod je ignoruje);
  - DRY stylów `TechniqueLink`: klasa `technique-ref` (+ modyfikator
    `.chip`) w `technique.css`; usunięte duplikaty `.requirement-tech-link`
    (`level.css`), `.tech-ref-chip` i `.glossary-related button`
    (`glossary.css`);
  - `technique.css` / `technique-modal.css` — biała ramka zdjęcia
    (karta: grayscale + hover scale, modal: pełny kolor jak
    `.glossary-photo`, placeholder z clampowanym kanji);
  - `scripts/audit-danych.mjs` — check mapy GenAI (martwe klucze),
    statystyka pokrycia, bez parsowania DRAWINGS/`tsx`.
- Rezultat: karty i modale technik na wzorcu słownika (biała ramka,
  `contain`; karta grayscale, modal pełny kolor), 36 technik bez zdjęcia
  ma placeholder kanji; równolegle usunięty drugi system ilustracji
  (SVG + pole `infographic`) i trzy zduplikowane style linku techniki;
  logika zamykania modali w jednym hooku.
- Weryfikacja: `npm run build` ✅ (CSS 35.01 kB), `npm run audit` —
  0 ostrzeżeń (mapa GenAI spójna z atlasem); 2 znane błędy krytyczne
  P0.3 (`gekisai-sho`/`saiha` — zewnętrzna edycja `techniques.json`
  2026-10-08 21:08, decyzja użytkownika: nie ruszać danych);
  dymek CDP przez preview: 22/22 asercji + 4 zrzuty (karta grayscale,
  modal ze zdjęciem, placeholder kanji, strefy z chipami `.technique-ref.chip`).

### 2026-10-08 — Refaktor architektury frontendu (foldery, Zustand, style per feature)
- Zmienione pliki:
  - przeniesienia (`git mv`): `src/components/Icon.tsx` → `components/ui/`,
    `Header/Footer` → `features/navigation/`, `Hero` → `features/home/`,
    `BeltPath/RequirementsPanel` → `features/level/`,
    `TechniqueIllustration/TechniqueLink/TechniqueModal/TechniquesSection` →
    `features/technique/`, `GlossaryEntryModal/ZoneIllustration` →
    `features/glossary/`, `DojoKun` → `features/dojo/`;
    usunięty `src/components/ModalProvider.tsx`;
  - nowe: `src/app/router.tsx` (`<Routes>` + `useScrollManager`),
    `src/app/ModalHost.tsx` (render modali + deep-linki `#technika-`/`#haslo-`),
    `src/store/modalStore.ts` (Zustand, hook `useModals()`) i
    `src/store/uiStore.ts` (menu mobilne), `src/hooks/useScrollManager.ts`
    i `useDocumentTitle.ts`, `src/styles/{index,globals,tokens,modal}.css`,
    `src/features/*/styles/*.css` (navigation, home, level, technique,
    illustration, technique-modal, dojo, glossary);
  - przepisane: `App.tsx` (BrowserRouter + `ModalHost` poza `.app-shell`),
    `main.tsx` (import `./styles/index.css`), `Header.tsx` (uiStore zamiast
    `useState`), 5 stron w `pages/` (importy `@/…`, `useDocumentTitle`);
  - config: `tsconfig.app.json` + `vite.config.ts` (alias `@/*` → `src/*`),
    `package.json` (+`zustand` 5.0.15);
  - `src/index.css` (2067 linii) **rozbity** na `src/styles/` + pliki per
    feature (walidacja: multizbiór reguł wejście == wyjście); usunięta martwa
    reguła `.glossary-modal-panel` (zawsze nadpisywana przez media ≤700px);
    kolejność importów w `styles/index.css` niesie kaskadę (globals pierwszy,
    `modal.css` przed `glossary.css`);
  - dane: `src/data/techniques.json` — naprawione 4 tablice `levels[]`
    (`yantsu` 1+3, `tsuki-no-kata` 1+3, `gekisai-sho` 2+12, `saiha` 1+11);
  - `scripts/audit-danych.mjs` (ścieżka do `features/technique/…`), `agents/*`
    (WEB_PERSONAL: struktura, konwencje `@/`, zakaz CSS Modules/ponownego
    `useState` dla stanu globalnego).
- Rezultat: kod posegregowany per feature (komponent + style obok siebie),
  stan globalny (modale, menu) w Zustand bez persist, monolityczny CSS
  rozbity na czytelne pliki — **render bez zmian wizualnych/behavioralnych**.
  Świadomie pominięte: CSS Modules (zbyt duże ryzyko zmiany klas),
  warstwa `services/` dla `src/data` (YAGNI — tam jest już getter + cache),
  `persist` (stan nie przeżywa odświeżenia).
- Weryfikacja: `npm run build` ✅ (tsc + vite), `npm run audit` ✅
  (0 krytycznych, 0 ostrzeżeń), `npm run preview` + curl 7 tras (200),
  smoke w Chrome headless/CDP: wygląd desktop/mobile identyczny jak przed
  refaktorem, modal techniki przez deep-link otwiera się, burger ≤980px
  (computed styles `display:flex`, ciemne tło).

### 2026-10-08 — Wymagania strukturalne, stopnie 1–5 dan, walki w info. głównych
- Zmienione pliki: `src/data/levels.json` (przebudowany: **16 stopni** —
  start, 10–1 kyu, `dan`…`dan5` o `number` 11–15; pozycje wymagań to teraz
  referencje `{type:"technique", id}` / opisy `{type:"text"}`; pole
  **`fights`** = liczba walk egzaminacyjnych, usuwane z tekstu grup),
  `src/data/types.ts` (`RequirementItem`, `Level.fights`),
  `src/data/techniques.json` (usunięte: duplikat `gariyu` i genericzna
  technika `kumite` — jej rolę przejął badge walk; kata danowe
  `infographic: "kata"` zamiast nieistniejących kluczy; przywrócone pokrycie
  `levels[]` kyu-kata wg programu: taikyoku 9+10/8+9/7+8, sanchin 4+5,
  pinan-yon 3+4, pinan-go 2+3, yantsu/tsuki 1+3, gekisai-sho 2+12,
  saiha 1+11, fudo-dachi 0+9+10; usunięte kolizyjne aliasy „Kata 1/2 dan"
  i „Ippon kumite 10 kyu"; literówki „stopien"), nowe
  `src/components/TechniqueLink.tsx` (multi-use: wariant `inline` w panelu
  wymagań, `chip` w modalu hasła — oba otwierają modal techniki),
  `src/components/RequirementsPanel.tsx` (render strukturalne, badge
  „Walki egzaminacyjne", „16 stopni egzaminu" z `levels.length`),
  `GlossaryEntryModal.tsx` + `ModalProvider.tsx` (chipy przez `TechniqueLink`,
  usunięty prop `onSelectTechnique`), `src/data/index.ts` (mapowanie
  `RequirementItem`/`fights`; **usunięty martwy machinery aliasów** —
  `buildTechniqueLinkPattern`, `findTechniqueByAlias`, `normalizeAlias`),
  `src/index.css` (`.requirement-badges`, `.fights-badge`, `.tech-ref-chip`,
  granice 4 grup `:nth-child(3n)`), `scripts/audit-danych.mjs` (przepisany:
  zakres `levels[]` 0–15, walidacja strukturalnych referencji = krytyczna
  P0.3, pokrycie 16 stopni, lista opisów `text`), `agents/*` (WEB_PERSONAL,
  TODO: zamknięte P0.4/P1.9, aktualne P1.1/P1.6/P1.7; RAPORT.md skopiowany).
- Rezultat: (1) jedno źródło prawdy dla odnośników — wymagania nie zależą
  już od regexu aliasów, każda technika w panelu to referencja do
  `techniques.json` (audyt gwarantuje zgodność z P0.3); (2) stopnie dan
  1–5 mają własne trasy/wymagania/kata (kata dan: tensho+saiha, gekisai-sho
  +gariyu, seishin, kanku-dai, sushiho); (3) liczby walk (1–15) przeniesione
  do informacji głównych jako badge, treści wymagań są konkretnymi
  technikami z atlasu zamiast ogólników; (4) P0.4 (alias „Kumite
  turniejowe" — nośniki `jiyu-kumite-*` już nie istnieją) i P1.9
  („Ippon kumite 10 kyu") zamknięte — audyt bez kolizji.
- Weryfikacja: `npm run build` ✅, `npm run audit` ✅ (0 krytycznych,
  0 ostrzeżeń: 166 referencji technik + 42 opisy, 16 stopni),
  spójność levels↔atlas sprawdzona osobnym skryptem (0 błędów).

### 2026-10-09 — Konsolidacja postaw (Pozycje): atlas = słownik + refaktoring komponentów
- Zmienione pliki:
  - `src/data/glossary.json` — dodano 5 haseł (yoi, tsuru-ashi, moro-ashi, heisoku, uchi-hachiji), `levels[]` do 9 postaw, usunięto 8 martwych `related`
  - `src/data/techniques.json` — usunięto 14 wpisów kategorii "Pozycje" (132 → 118 technik)
  - `src/data/levels.json` — 19 referencji `{type:"technique"}` → `{type:"glossary"}` (mapowanie: fudo-dachi→fudo, zenkutsu-dachi→zenkutsu-dachi, kiba-dachi→kiba, neko-ashi-dachi→neko-ashi, itd.)
  - `src/data/types.ts` — `RequirementItem` + `{type:"glossary", id}`, `GlossaryEntry.levels?`
  - `src/data/index.ts` — `mapRequirementItem` obsługuje `glossary`, nowe `filterAtlas`, `filterStances`, `getStanceEntries`, `AtlasItem` union
  - `src/features/technique/data/genaiImages.json` — usunięto 14 kluczy postaw
  - `scripts/audit-danych.mjs` — walidacja `{type:"glossary"}` (id + levels), kolumna `gloss` w pokryciu, statystyki haseł
  - `src/components/ui/` — nowe: `Card.tsx`, `SectionHeading.tsx`, `CategoryTabs.tsx`, `SearchBox.tsx`, `EmptyState.tsx`
  - `src/features/technique/components/` — `TechniqueCard.tsx`, `TechniquesToolbar.tsx`, `AllTechniques.tsx`, zaktualizowane `TechniquesSection.tsx`
  - `src/features/glossary/components/` — `GlossaryCard.tsx`, `GlossaryGrid.tsx`, `GlossaryToolbar.tsx`, `GlossaryLink.tsx`
  - `src/pages/` — `HomePage.tsx`, `LevelPage.tsx`, `GlossaryPage.tsx` używają `SectionHeading`, nowe komponenty
  - `src/features/level/components/RequirementsPanel.tsx` — obsługa 3 typów `RequirementItem`, `GlossaryLink`
- Rezultat: jednorodowe źródło prawdy dla postaw (karta = karta słownika, zdjęcia stance z `public/images/glossary/stances/`, modal = modal hasła), usunięto duplikaty, refaktoryzacja monolitycznych komponentów na wzorzec UI primitives + feature components, `npm run build` ✅, `npm run audit` ✅ (0 krytycznych, 0 ostrzeżeń), `npm run preview` + curl 200 na 6 trasach.

### 2026-10-07 — Statyczne karty „Części ciała" (bez modala)
- Zmienione pliki: `src/pages/GlossaryPage.tsx`, `src/index.css`,
  `TODO.md`, `WEB_PERSONAL.md`.
- Rezultat: karty kategorii „Części ciała" nie otwierają już modala hasła —
  renderują się jako statyczny `<article className="glossary-card static">`
  (dynamiczny `Card`: `article` ↔ `button`), bez `onClick`, `aria-label`
  i podpowiedzi „Zobacz hasło →", z `cursor: default` oraz bez efektów
  hover (`.glossary-card.static:hover` wyłącza zmianę tła, cień
  i podniesienie). Reszta kategorii (Strefy, Ustawienia stóp) otwiera modal
  bez zmian; `related[]` tych haseł zostaje w JSON jako dane. Poprawiony
  też intro `/slownik` — instrukcja „kliknij hasło" dotyczy już tylko stref
  i ustawień stóp. Chipów „Powiązane techniki" na kartach nie dodajemy
  (decyzja: karty części ciała mają być samowystarczalne).
- Weryfikacja: `npm run build` ✅, `npm run audit` ✅ (0 krytycznych,
  0 MISMATCH), headless Chrome (CDP) 1440×900 / 390×844 — **10/10**:
  15 kart = `ARTICLE`, brak `aria-label`/hintu/`onclick`,
  `cursor: default`, `tabIndex: -1`, hover bez efektu
  (`rgb(244, 240, 231)` / `none` / `none`), klik → brak modala i brak
  `#haslo-…` w hashu (aktywny element zostaje `BODY`); regresja-check:
  Strefy otwierają modal z diagramem (12 `.zone-line`), Ustawienia stóp
  otwierają modal; zrzuty ekranu kart bez podpowiedzi.

### 2026-10-07 — Diagram stref w słowniku + poprawki ścieżek zdjęć
- Nowy plik: `src/components/ZoneIllustration.tsx`. Zmienione:
  `src/pages/GlossaryPage.tsx`, `src/components/GlossaryEntryModal.tsx`,
  `src/components/TechniqueIllustration.tsx` (eksport `resolveMediaSrc`),
  `src/index.css`, `src/data/glossary.json`, `TODO.md`, `WEB_PERSONAL.md`.
- Rezultat: kategorie Strefy mają własną wizualizację — karateka w fudo-dachi
  + trzy przerywane poziome linie z podpisami `JŌDAN` / `CHŪDAN` / `GEDAN`
  na liniach (podpis „przecina" kreskowanie tłem w kolorze stage). Linia
  aktywnej strefy (hasło, które użytkownik otworzył) jest czerwona
  i podświetlona, pozostałe wyszarzone. Diagram renderuje się w modalu
  (priorytet: `image` → diagram → placeholder z kanji) oraz jako ciemny
  pasek 140px w kartach `.glossary-image.diagram`. SVG `viewBox 0 0 800 480`
  z klasą `.technique-illustration` skaluje się bez dodatkowych reguł
  mobilnych (podpis ~31px desktop, ~13px telefon, ~8.8px w karcie);
  `zoneForEntry()` mapuje `jodan`/`chudan`/`gedan-strefa` → strefa.
  Ponadto: (1) kanji `kosa-dachi` → `kake-dachi` (掛け立ち, `id`/`term`/
  `reading` były już zmienione na `kake`); (2) 7 ścieżek zdjęć
  w `glossary.json` poprawionych pod dokładny case plików na dysku
  (`Fudo-Dachi.png` itd. — macOS ukrywa różnice wielkości liter,
  GitHub Pages zwraca 404); (3) `image` w karcie i modalu przechodzi przez
  `resolveMediaSrc()` — prefiks `BASE_URL` dla ścieżek od `/`, żeby zdjęcia
  działały też pod `/web_karate/`.
- Weryfikacja: `npm run build` ✅, `npm run audit` ✅ (0 krytycznych,
  0 MISMATCH), headless Chrome (CDP) na 1440×900 / 1280×720 / 390×844:
  3 paski diagramów w kartach + unikalne `id` patternów, każde z 3 haseł
  otwiera modal z **jedną** czerwoną linią właściwej strefy
  (`stroke: rgb(197, 68, 59)`, aktywny podpis zgodny: JŌDAN/CHŪDAN/GEDAN),
  `stageOver ≤ 0`, `Kake-Dachi.png` (458px) ładuje się w modalu; zrzuty
  ekranu kart i modalów bez ucięć.

### 2026-10-07 — Skalowanie zdjęcia w modalu hasła i legenda modalu techniki
- Zmienione pliki: `src/index.css`.
- Rezultat: (1) zdjęcie w modalu słownika nie jest już ucinane —
  `.glossary-photo` miało `flex: 1` (= `flex-basis: 0%`), co przy
  nieokreślonej wysokości kontenera flex dawało wysokość = proporcja
  naturalna (827×827), więc stage wyrastał ponad
  `max-height: calc(100vh - 68px)` panelu i `overflow: hidden` obcinał dół
  o 81px (1440×900) / 186px (1280×720); zmienione na `flex: 1 1 0` +
  `height: 0`, zdjęcie w białej ramce `max-width: min(100%, 520px)`
  (`.glossary-image` i `.glossary-photo` mają tło `#fff`). Rozmycie
  220px miniatury Google skalowanej do ~520px zostaje — jakościowe
  rozwiązanie to P1.2 / P1.5 (własne zdjęcia). (2) modal techniki przy
  niskich viewportach (1280×720) ucinał legendę — kolumna
  `.visualization-copy` wyznaczała wysokość wiersza grid (713px > 652px
  `max-height` panelu); dodane `max-height: calc(100vh - 68px)` na kolumnie
  (treść scrolluje się wewnątrz zamiast rozpychać panel) oraz
  `max-height: calc(100vh - 192px)` na `.visualization-stage >
  .technique-illustration` / `.technique-media-frame` dla niskich i szerokich
  okien (letterbox niewidoczny — tło stage = `.illustration-ground`
  `#252723`), oba clampa'y z `max-height: none` w media ≤700px.
- Weryfikacja: `npm run build` ✅, `npm run audit` ✅ (0 krytycznych,
  0 MISMATCH, 2 KOLIZJA z `techniques.json`), headless Chrome (CDP) na
  11 viewportach (1440×900, 1280×720, 1920×1080, 1600×720, 900×700,
  390×844, 844×390, 1440×650, 1366×600, 1280×600, 1024×576):
  `stageOver ≤ 0`, `photoCut ≤ 0`, `object-fit: contain`, legenda
  `legendCut ≤ 0`, kolumna tekstu scrolluje się, gdy treść nie mieści się
  w panelu; screenshoty modalów bez ucięć.

### 2026-10-07 — Media bez ucięcia w kartach i modalach + klik w całą kartę techniki
- Zmienione pliki: `src/index.css`, `src/pages/GlossaryPage.tsx`,
  `src/components/TechniquesSection.tsx`, `src/components/TechniqueIllustration.tsx`.
- Rezultat: obrazy słownika (`object-fit: contain` w ramce 140px na ciemnym
  tle, bez hover-zoomu) i zdjęcie w modalu hasła już się nie ucinają;
  media w kartach atlasu (obraz/gif/mp4) też `contain` + `pointer-events:
  none`, więc klik w media przechodzi do przycisku karty. Cała karta
  techniki (nie tylko obraz) otwiera modal — jedno zdarzenie na `<article>`,
  przycisk `.tech-image` zostaje punktem klawiaturowym. `<video>` dostaje
  `controls` dopiero w modalu (`controls={false}` w karcie), klik w kartę →
  modal z odtwarzaczem. Dodane `loading="lazy" decoding="async"` na obrazie
  w `GlossaryPage`.
- Weryfikacja: `npm run build` ✅, `npm run audit` ✅ (0 krytycznych,
  0 MISMATCH), `npm run preview` + curl `/slownik`, `/techniki`, `/kyu/9`
  (200), render-check SSR (karty: 132 × `.tech-card` + `.tech-image`,
  słownik: 3 karty z `loading="lazy"`, mp4 bez `controls` w karcie /
  z `controls` w modalu, gif i YouTube renderują się w obu kontekstach) ✅.

### 2026-10-07 — Sticky nawigacja, przyciski kyu w panelu i spójność `levels[]`
- Zmienione pliki: `src/index.css`, `src/components/RequirementsPanel.tsx`,
  `src/pages/LevelPage.tsx`, `src/data/techniques.json` (28 technik),
  `scripts/audit-danych.mjs`, `RAPORT.md`, `TODO.md`, `WEB_PERSONAL.md`.
- Rezultat: (1) header faktycznie podąża za użytkownikiem — `.app-shell`
  miał `overflow: hidden`, które tworzyło scroll container i zabijało
  `position: sticky`; zamienione na `overflow-x: clip` + `scroll-margin-top`
  dla kotwic pod 84/70px header. (2) Nawigacja prev / „Wszystkie stopnie" /
  next przeniesiona z dołu strony do wnętrza panelu wymagań, jako pasek
  **3 równych sekcji** z wyraźnymi przyciskami (5 kyu → `6 kyu`,
  `Wszystkie stopnie`, `4 kyu`; `start`/`dan` mają sekcję-pusta). (3)
  większy odstęp „Stopień" ↔ „Szukaj" w toolbarze atlasu (`gap` 22 → 48px,
  zawijanie wierszy). (4) domknięty P0.3: dopisane brakujące kyu do
  `levels[]` 28 technik wg wymagań, audyt liczy MISMATCH-y tylko dla
  poziomów kyu (start/dan bez atlasu).
- Weryfikacja: `npm run audit` ✅ (0 krytycznych, 0 MISMATCH, exit 0),
  `npm run build` ✅, `npm run preview` + curl 200 na `/`, `/kyu/9`,
  `/kyu/start`, `/kyu/dan`, `/techniki`, `/slownik`, render-check SSR
  (`LevelPage`/`TechniquesPage`/`HomePage`) — nav po `requirements-note`,
  brak `level-nav` pod technikami, 3 komórki nawigacji ✅.

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
