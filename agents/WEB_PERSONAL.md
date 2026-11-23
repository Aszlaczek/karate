# WEB_PERSONAL.md — główny prompt agenta

> **Ten plik jest punktem wejścia dla każdego agenta.** Przeczytaj go w całości,
> zanim cokolwiek zmienisz w repozytorium. Następnie otwórz `TODO.md` (zadania)
> i `DONE.md` (historia prac).

## 1. Tożsamość projektu

**KIHON — Kyokushin Exam Guide** (`web-karate`) — wielostronicowy serwis SPA
przewodnik po egzaminach na pasy w karate kyokushin, z osobnym adresem dla
każdego stopnia (kyu), atlasem technik i słownikiem.

- **Język treści:** polski (copy, opisy, requirements). Terminologia techniczna
  japońska: zapis kanji + romaji (np. `正拳中段追い突き` / `sejken czudan oj-zuki`).
- **Odbiorca:** ćwiczący kyokushin, którzy chcą sprawdzić wymagania egzaminacyjne
  swojego stopnia i nauczyć się nazw technik.
- **Charakter:** statyczny, edukacyjny przewodnik. **Bez backendu, bez czatu AI,
  bez logowania, bez CMS-a** — wszystkie dane pochodzą z plików JSON
  w `src/data/` (jedno źródło prawdy).

## 2. Stack i komendy

| Element | Wersja / wartość |
| --- | --- |
| Framework | React 19 + **react-router 7 (history API)** |
| Bundler | Vite 7 (`@vitejs/plugin-react`) |
| Język | TypeScript ~5.9, `tsc -b` przy buildzie (`resolveJsonModule`) |
| Style | Tailwind v4 przez `@tailwindcss/vite` + autorskie klasy CSS per feature (`src/styles/` + `src/features/*/styles/`) |
| Stan | **Zustand 5** (`src/store/*`, bez `persist`) — modale i menu mobilne |
| Alias | `@/*` → `src/*` (w `tsconfig.app.json` i `vite.config.ts`) |
| Deploy | GitHub Pages via `.github/workflows/deploy.yml` (push → `main`/`master`, PR tylko weryfikacja) |
| Testy | Vitest + Testing Library (`jsdom`), konfiguracja w `vitest.config.ts`, setup w `src/test/setup.ts` |

```bash
npm install        # instalacja zależności
npm run dev        # dev server (Vite)
npm run build      # tsc -b && vite build -> dist/   ← WERYFIKACJA OBOWIĄZKOWA
npm run preview    # podgląd builda z dist/ (SPA fallback działa dla tras)
npm run audit      # audyt danych -> RAPORT.md (read-only, exit 1 przy problemach)
npm test           # testy Vitest jednorazowo (tryb CI)
npm run test:watch # testy w trybie obserwowania zmian
npm run check      # audit -> test -> build (bramka lokalna, jak w CI)
```

**Po każdej edycji kodu uruchom `npm run check`.** Build musi przechodzić bez
błędów TypeScript, testy i audyt tak samo. Linter pozostaje w `P1.4` (`TODO.md`).

### Base URL i deploy (GitHub Pages)

- `vite.config.ts`: `base: process.env.VITE_BASE ?? "/"` — lokalnie `/`,
  w CI ustawiane na `VITE_BASE: /<nazwa-repo>/` (bezwzględna ścieżka!).
- Workflow kopiuje też `dist/index.html` → `dist/404.html` — oficjalny fallback
  SPA GitHub Pages dla odświeżenia głębokiej trasy (np. `/repo/kyu/9`).
- `BrowserRouter basename={import.meta.env.BASE_URL}` w `src/App.tsx`.
- **NIE wracaj do `base: "./"`** — przy history API i głębokich trasach
  ścieżki assetów by się rozjechały.
- CI w jobie `build` wykonuje kolejno: `npm ci` → `npm run audit` → `npm test`
  → `npm run build` → `404.html` → smoke-check `dist/` → upload artefaktu.
  `RAPORT.md` jest wysyłany jako artifact także przy nieudanym audycie.
  Kroki Pages-specific (`configure-pages`, `upload-pages-artifact`) są pomijane
  dla PR-ów (także z forków) — PR sprawdza tylko audyt, testy, build i `dist/`.
- Job `deploy` ma `needs: build` i `if: github.event_name != 'pull_request'` —
  PR-y są tylko sprawdzane, publikacja następuje po pushu/dispatchu.
- Rozszerzanie testów: `src/**/__tests__/*.test.tsx`, alias `@` działa w
  `vitest.config.ts`; `src/test/setup.ts` czyści DOM i mockuje `window.scrollTo`.

## 3. Struktura repozytorium

```
index.html                # punkt wejścia Vite, meta SEO (lang="pl"), favicon
vite.config.ts            # base przez env VITE_BASE + alias `@` → `src/`
vitest.config.ts          # Vitest: jsdom, alias `@`, setupFiles, mocki
src/
  test/setup.ts           # jest-dom, cleanup DOM, mock window.scrollTo
  main.tsx                # mount <App/> + import stylów `./styles/index.css`
  App.tsx                 # BrowserRouter + layout (.app-shell: Header/main/Footer)
                          # + <ModalHost /> (poza app-shell)
  app/
    router.tsx            # <Routes> + useScrollManager() (kotwice, scroll-to-top)
    ModalHost.tsx         # renderuje aktywny modal + deep-linki
                          # `#technika-<id>` / `#haslo-<id>`
  store/                  # stan globalny — Zustand 5, bez persist
    modalStore.ts         # aktywny modal (technika | hasło) + hook useModals()
    uiStore.ts            # menu mobilne (mobileMenuOpen, toggle/close)
  hooks/
    useScrollManager.ts   # kotwice #stopnie… + scroll(0,0) przy zmianie trasy
    useDocumentTitle.ts   # tytuły stron (null = nie zmieniaj, np. przed <Navigate>)
    useModalBase.ts       # Esc + blokada scrolla + onBackdropMouseDown (modale)
  styles/                 # style wspólne + agregator
    index.css             # ★ punkt wejścia stylów — kolejność importów = kaskada
    globals.css           # reset, typografia, klasy współdzielone
                          # (.app-shell, .primary-button, .section-heading…)
    tokens.css            # :root — zmienne (kolory, fonty, odstępy)
    modal.css             # szkielet modala — importowany PRZED glossary.css
  components/ui/          # współdzielone UI (Icon)
  features/               # kod per sekcja: components/ + styles/ obok siebie
    navigation/           # Header, Footer + styles/navigation.css
    home/                 # Hero + styles/home.css
    level/                # BeltPath, RequirementsPanel + styles/level.css
                          # (render belki: `belt-stripes` flex, `getStripeCount`);
                          # RequirementsPanel używa `GlossaryLink` dla typ `glossary`
    technique/            # TechniquesSection, TechniqueModal, TechniqueLink,
                          # TechniqueIllustration (legacy `video` + fallback GenAI),
                          # MediaFrame, MediaGallery, media.ts (resolveMediaSrc,
                          # youtubeId, miniatury), TechniqueCard, TechniquesToolbar,
                          # AllTechniques + data/genaiImages.json (fallback)
                          # + styles/technique.css, technique-modal.css, media-gallery.css
    glossary/             # GlossaryEntryModal, ZoneIllustration, GlossaryCard,
                          # GlossaryGrid, GlossaryToolbar, GlossaryLink
                          # + styles/glossary.css
    learning/             # wspólne źródła ContentSources + styles/learning.css
    feedback/             # FeedbackForm (mailto + kopiowanie) + styles/feedback.css
    dojo/                 # DojoKun + styles/dojo.css
  data/                   # ★ JEDNO ŹRÓDŁO PRAWDY (JSON + typy + dostępnicy)
    levels.json           # 16 stopni: start, 10…1 kyu, 1–5 dan — wymagania
                          # strukturalne (referencje: technique | glossary | text + fights)
    techniques.json       # 118 technik: nazwa, opis, aliasy, legacy `video`, stopnie (bez kategorii Pozycje)
    techniqueDetails.json # szczegóły 118 technik + 15 postaw: znaczenia, człony nazw, sekcje, uwagi
    media.json            # ★ galerie 2–4 mediów: sekcje `techniques` i `glossary` (również postawy)
    learning.json         # 4 poradniki, 6 wydarzeń, 6 ciekawostek, źródła i konfiguracja kontaktu
    learning.ts           # typowane eksporty treści nowych stron (poza głównym index.ts)
    glossary.json         # 68 haseł / 8 kategorii: strefy, części ciała, pozycje (15 postaw),
                          # ustawienia-dloni (10), ustawienia-stopy (6), etykieta, komendy, strój
    dojoKun.json          # 7 zasad dojo
    types.ts              # Level, RequirementItem, Technique, GlossaryEntry, MediaItem/MediaKind/MediaManifest
    index.ts              # eksporty + getLevel(), filterTechniques(), filterAtlas(), filterStances(),
                          # getStanceEntries(), getTechniqueMedia(), getGlossaryMedia() …
  pages/                  # cienkie wrappery tras: HomePage, LevelPage,
                          # TechniquesPage, GlossaryPage, NotFoundPage;
                          # GuidesPage, TriviaPage, FeedbackPage ładowane przez lazy
old_src/                  # ARCHIWUM starego źródła — NIE EDYTOWAĆ
public/favicon.svg
public/videos/
  techniques/<id>/...      # filmy techniki, po jednym folderze na canonical id
  stances/<stance>-*.mp4   # filmy postaw (płasko, wg przykładu fudo-dachi.mp4)
  glossary/<id>-*.mp4      # filmy haseł dłoni/stóp
public/images/
  techniques/<id>/...      # zdjęcia techniki + postery do jej filmów
  stances/<stance>-*.jpg   # zdjęcia postaw + postery
  glossary/<id>-*.jpg      # zdjęcia dłoni/stóp + postery
  GenAI/, glossary/stances/# stare fallbacki, NIE migruj automatycznie
scripts/audit-danych.mjs   # audyt danych + istnienia plików galerii (npm run audit)
scripts/generate-media.mjs # skaner folderów → media.json (npm run media:manifest)
RAPORT.md                  # wynik audytu — generowany, NIE edytować ręcznie
dist/                     # wynik builda (+ 404.html w CI)
.github/workflows/deploy.yml
agents/                   # dokumentacja agenta: WEB_PERSONAL.md, DONE.md,
                          # TODO.md, RAPORT.md (kopia audytu)
```

## 4. Routing (react-router, history API)

| Trasa | Strona | Zawartość |
| --- | --- | --- |
| `/` | `HomePage` | Hero, ścieżka 16 stopni (`#stopnie`), atlas (`#techniki`), teaser słownika (`#slownik`), Dojo-kun (`#dojo-kun`) |
| `/kyu/:kyuId` | `LevelPage` | `:kyuId` = `start`, `10`…`1`, `dan`, `dan2`…`dan5` → panel wymagań (**z nawigacją prev / wszystkie / next** na dole panelu) + techniki stopnia |
| `/techniki` | `TechniquesPage` | pełny atlas, filtry: kategoria × stopień × tekst |
| `/slownik` | `GlossaryPage` | zakładki kategorii + wyszukiwarka + karty haseł |
| `/poradnik` | `GuidesPage` | wiązanie pasa, składanie karategi, bandaże, troczki; kotwice do instrukcji |
| `/ciekawostki` | `TriviaPage` | oś historii karate/Kyokushin i karty ciekawostek ze źródłami |
| `/kontakt` | `FeedbackPage` | propozycje/poprawki na `xyz@gmail.com`: mailto, schowek i podgląd do skopiowania |
| `*` | `NotFoundPage` | 404 |

- Nieprawidłowy `kyuId` → `<Navigate to="/nie-istnieje" replace />`.
- Kotwice (`/#stopnie`, `/#dojo-kun`) obsługuje hook `useScrollManager()`
  w `src/app/router.tsx` (scroll do elementu po `hash`, `scrollTo(0,0`
  przy zmianie ścieżki).
- Tytuły dokumentu ustawiają strony przez `useDocumentTitle(title)`
  (`src/hooks/useDocumentTitle.ts`; `null` = nie zmieniaj — np. strona,
  która zaraz przekieruje).
- Nowe strony (`/poradnik`, `/ciekawostki`, `/kontakt`) używają `React.lazy`
  i wspólnego `Suspense`. Treści pobierają z `@/data/learning`, dzięki czemu
  nie powiększają głównego modułu atlasu. Nie eksportuj ich ponownie z `@/data`.
  `useScrollManager` czeka na kotwicę przez `MutationObserver`, jeżeli strona
  jeszcze się ładuje; odłącza obserwację po znalezieniu celu / zmianie trasy.
  Prefiksy modali `#technika-` i `#haslo-` są pomijane przez ten hook.
- Słownik przyjmuje `?kategoria=<id>`; nieznany identyfikator wybiera pierwszą
  kategorię. Zmiana kategorii czyści wyszukiwanie. Teasery na stronie głównej
  prowadzą bezpośrednio do swojej kategorii.
- **Modale (stan w `store/modalStore.ts`, render w `app/ModalHost.tsx`):**
  - hook `useModals()` → `openTechnique(technique)` /
    `openGlossaryEntry(entry, category)` / `close()` (wrapper nad store),
  - stany: `{kind:"technique"}` lub `{kind:"glossary"}` — tylko jeden naraz,
  - deep-linki: `#technika-<id>` (atlas/wymagania) oraz `#haslo-<id>`
    (słownik) — odczyt przy starcie w `ModalHost`, zapis przez `replaceState`
    przy otwarciu/zamknięciu,
  - klik „Powiązane techniki" w modalu hasła **przełącza** modal na technikę
    (bez zamykania overlaya), zamknięcie: `Esc` / klik w tło / przycisk.

## 5. Dane — jedno źródło prawdy (`src/data/`)

Wszystkie treści **wychodzą z JSON-ów**; komponenty nie trzymają danych.
Typy w `types.ts`, walidacja struktury przez przypisanie do `Level[]` /
`Technique[]` itd. (pole `belt` normalizowane do `BeltId`).

- **`levels.json`** — 16 wpisów (`start`, `10`…`1`, `dan`, `dan2`…`dan5`):
  `kyu`, `number` (0 / 10–1 / 11–15 dla 1–5 dan), `order` (kolejność
  nawigacji), `belt`, `color`, `stripe` (belka II stopnia, kolor),
  **`stripes?`** (liczba belek: 1 dan = 1, N dan = N; kyue z belką = 1;
  `stripe:null` → brak belek; pilnuje audyt **P0.4**), `level`, `time`,
  `intro`, **`fights`** (`null` albo liczba walk egzaminacyjnych → badge
  „Walki egzaminacyjne" w panelu wymagań), `groups[]` (wymagania).
  **Pozycje wymagań są strukturalne** (union `RequirementItem` z `types.ts`):
  `{ "type": "technique", "id": "<id z techniques.json>" }` albo
  `{ "type": "glossary", "id": "<id z glossary.json>" }` albo
  `{ "type": "text", "text": "…" }` (etykieta / wiedza / próba — pozycje
  bez odpowiednika w atlasie/słowniku). Referencje technik **muszą** wskazywać
  istniejący wpis, którego `levels[]` zawiera `number` stopnia; referencje
  haseł słownika (typ `glossary`) — analogicznie, wpis w `glossary.json`
  musi mieć `levels[]` zawierający `number` stopnia. Pilnuje tego audyt
  (`npm run audit`, błędy krytyczne P0.3), renderuje `TechniqueLink`
  (dla `technique`) lub `GlossaryLink` (dla `glossary`).
- **`techniques.json`** — 118 technik w 6 filtrach (Uderzenia, Kopnięcia,
  Bloki, Kumite, Kata): `name`, `japanese`, `reading`, `category`,
  `description`, `tags`, `focus`,   **`levels[]`** (które stopnie ją egzaminują — musi zawierać **każdy**
  stopień, w których wymaganiach technika występuje; zakres 0–15: 0 = start,
  11–15 = 1–5 dan; pilnuje audyt P0.3),
  **`aliases[]`** (warianty nazwy — metadane i chronologia; aplikacja **nie**
  linkuje już po aliasach — wymagania to referencje strukturalne),
  **`infographic`** (pole zostaje w JSON-ach jako metadane, ale **kod je
  ignoruje** — mapa `DRAWINGS` nie istnieje), `image`, **`video`**
  (`null` → tymczasowe zdjęcie GenAI z mapy `genaiImages.json`, a gdy go
  brak — galeria z `media.json`, potem placeholder z kanji; nie-null →
  `MediaFrame` renderuje YouTube/`*.mp4`/`*.gif`/`*.jpg`). Kategoria
  "Pozycje" usunięta z atlasu technik (postawy żyją w `glossary.json`).
- **`glossary.json`** — `categories[]` → `entries[]`:
  `id` (stabilny slug → deep-link `#haslo-<id>`), `term` PL, `japanese`,
  `reading`, `description`, **`image`** (`null` = placeholder z kanji;
  docelowo `"/images/glossary/<id>.jpg"` — plik w `public/images/glossary/`),
  **`related`** (tablica `id` technik → chipy w modalu hasła).
  **`levels[]`** (opcjonalne, dla postaw w kategorii `pozycje` — które stopnie
  je egzaminują; zakres 0–15, pilnuje audyt P0.3). Nazwa wyświetlana tej
  kategorii to "Postawy (dachi)", ale jej `id` pozostaje `pozycje`
  (deep-linki i `STANCE_CATEGORY_ID` bez zmian). Nowe kategorie:
  `ustawienia-dloni` (10 haseł: seiken, shuto, nukite, hiraken, tettsui,
  uraken, koken, haishu, shotei, haito) i `ustawienia-stopy`
  (6 haseł: kakato, chusoku, haisoku, teisoku, sokuto, heisoku-ashi).
  `image: null` w hasłach `jodan` / `chudan` / `gedan-strefa` zamiast
  placeholdera renderuje diagram stref (`ZoneIllustration.tsx`).
  Ścieżki lokalne zapisuj z **dokładnym case'em** pliku na dysku
  (macOS ukrywa różnice wielkości liter, Linux/GH Pages zwraca 404)
  i przepuszczaj przez `resolveMediaSrc()` (prefiks `BASE_URL`).
- **`dojoKun.json`** — `japanese` / `reading` / `polish`.

### Jak dodać treść (integracja)

- **Poradnik/ciekawostki:** dopisz dane w `learning.json`; poradnik ma `id`,
  `title`, `tag`, `intro`, `equipment`, `steps: {title, body}[]`, `note`,
  `sources: {title, url}[]`. Historia i ciekawostki mają `id`, `title`, `body`,
  `sources`, a historia dodatkowo `period`. Linki źródeł muszą być HTTPS.
  Audyt sprawdza integralność i źródła. `GlossaryCategory.sources` jest
  opcjonalne — nowe kategorie słownika pokazują swoją bibliografię pod kartami.
- **Kontakt:** odbiorca i kategorie zgłoszeń są w `learning.json.feedback`.
  Formularz wymaga 10–1200 znaków (sprawdza też same spacje), koduje temat
  i treść przez `encodeURIComponent`. Przycisk otwiera program pocztowy,
  a użytkownik sam wysyła e-mail. Nie pokazuj „wysłano”, bo aplikacja nie ma
  potwierdzenia dostarczenia. Bez klienta pocztowego: schowek lub ręczne
  kopiowanie z podglądu. Brak backendu, zewnętrznych API wysyłkowych i nowych
  zależności. Link do kontaktu w stopce oraz na końcu poradnika.

- **Szczegóły atlasu (2026-10-11):** `techniqueDetails.json` ma osobne mapy
  `techniques` i `stances` indeksowane istniejącym id. Typ `TechniqueDetail`
  obejmuje `translation`, `nameParts: {term, polish}[]`,
  `sections: {title, body}[]` oraz opcjonalne `note`. Dostępnicy:
  `getTechniqueDetail(id)` / `getStanceDetail(id)` w `@/data`.
  `TechniqueDetailContent` renderuje wspólną treść w `TechniqueModal`
  oraz w modalu postawy ze słownika. Dotychczasowe deep-linki zachowane.
  Nowa technika lub postawa wymaga szczegółów; audyt sprawdza kompletność,
  kolejność wszystkich członów nazwy i osierocone wpisy. Dla postaw człony
  bazują na `reading`, bo `term` może być polski. Nie generuj opisów w TSX.
  Źródła, ograniczenia etymologii i dalsza redakcja: `agents/TECHNIQUE_DETAILS.md`.

### Galerie mediów (2026-11-23)

- `src/data/media.json` ma dwie sekcje: `techniques` (klucz = id techniki)
  i `glossary` (klucz = id hasła słownika, **również postawy**). Każdy wpis
  to 2–4 obiekty `MediaItem { type: "video"|"image", src, label, poster?, caption?, alt? }`.
  `type` jest obowiązkowy — UI filtruje po nim („Wszystkie / Filmy / Zdjęcia”),
  oznacza każdą miniaturę jako „▶ Film” / „▣ Zdjęcie” i audyt go waliduje.
  `label` to nazwa miniaturki, `alt` opis dla czytnika ekranu (`aria-label`
  wideo), a `caption` — jedyny opcjonalny, widoczny podpis pod odtwarzaczem.
  Informacji o placeholderze nie wpisuj do `label`/`caption`, tylko do `alt`.
- Dostępnicy: `getTechniqueMedia(id)` / `getGlossaryMedia(id)` w `@/data`.
  `MediaGallery` jest używany w `TechniqueModal` i `GlossaryEntryModal`;
  karty (`TechniqueCard`, `GlossaryCard`) biorą tylko pierwszy obraz/poster
  przez `getMediaThumbnail()` i nie montują odtwarzaczy.
- `MediaFrame` to jedyny renderer jednego medium (YouTube, `<video>`, `<img>`);
  `TechniqueIllustration` obsługuje już tylko legacy `video` i fallback GenAI.
  `resolveMediaSrc()` przeniesiono do `media.ts` i re-eksportuje go
  `TechniqueIllustration` (stare importy w słowniku działają).
- Ścieżki: techniki `/videos/techniques/<id>/…` i `/images/techniques/<id>/…`;
  postawy `/videos/stances/<reading>-*.mp4`, `/images/stances/…`;
  pozostałe hasła `/videos/glossary/<reading>-*.mp4`, `/images/glossary/…`.
  Pliki posterów mają ten sam stem co film i **nie są** osobnymi galeriami.
- Dodawanie mediów: wrzuć pliki do folderu, uruchom `npm run media:manifest`
  (`scripts/generate-media.mjs` skanuje foldery, dopasowuje hasła po `reading`,
  zachowuje ręczne `label`/`alt`/`caption` i dobiera poster po stemie), a następnie
  dopisz własne opisy w `media.json`. `npm run audit` sprawdza 2–4 elementy,
  rozszerzenia, zgodność folderu, istnienie pliku i poster dla wideo.
- Przykładowe pliki w repozytorium (`*-demo.mp4`, grafiki GenAI) to wyraźnie
  oznaczone placeholdery techniczne — do zastąpienia nagraniami z dojo.

- **Nowa technika:** dopis wpis w `techniques.json` (+ `aliases`, `levels`).
  Zdjęcie tymczasowe: plik w `public/images/GenAI/techniques/<folder>/<id>.png`
  (`<folder>` = `start` dla poziomu 0, `dan` dla ≥11, inaczej numer poziomu —
  decyduje pierwszy level techniki mający plik) **oraz** wpis w
  `src/features/technique/data/genaiImages.json` (`id` → ścieżka od `/`,
  rozwiązywana przez `resolveTechniqueImage()`); audyt porównuje klucze mapy
  z atlasem (martwe klucze = ostrzeżenie). Brak wpisu = karta i modal
  pokazują placeholder z kanji. Pole `video` jest legacy i zostaje jako
  awaryjne jedno medium. Właściwe media dodawaj do galerii (patrz niżej).
- **Nowy stopień / zmiana wymagań:** edytuj `levels.json` — karty pasów,
  panel wymagań, filtr stopni i nawigacja prev/next zaktualizują się same.
- **Nowe hasło słownika:** dopis w `glossary.json` do właściwej kategorii —
  z `id` (slug bez spacji),   `image: null` i `related` (id technik z atlasu).
  Karta staje się klikalna automatycznie (wyjątek: kategoria **Części
  ciała** — statyczny `<article className="glossary-card static">`,
  bez modala); zdjęcie wystarczy uzupełnić pole
  `image` ścieżką do pliku w `public/images/glossary/`. Kolejność zawartości
  wizualnej (karta i modal): galeria `media.json` → `image` → dla stref
  `ZoneIllustration` → placeholder z kanji. Kategorie `ustawienia-dloni`
  i `ustawienia-stopy` są klikalne (nie są na liście `isStatic` w
  `GlossaryGrid.tsx`).
- Wymagania **nie zawierają surowego tekstu technik** — każdy wpis to
  referencja `{type:"technique", id}` albo opis `{type:"text"}`. Renderuje
  je wspólny komponent **`features/technique/components/TechniqueLink.tsx`**
  (warianty:
  `inline` → czerwony link w panelu wymagań, `chip` → przycisk „Powiązane
  techniki" w modalu hasła); oba warianty otwierają modal techniki przez
  `useModals().openTechnique`. Nie wpisuj linków ręcznie w JSON i nie
  przywracaj auto-linkowania po aliasach (`buildTechniqueLinkPattern()` /
  `findTechniqueByAlias()` zostały usunięte z `src/data/index.ts` — aliasy
  to teraz tylko metadane).
- **Audyt danych:** `npm run audit` (`scripts/audit-danych.mjs`) generuje
  `RAPORT.md`: integralność struktury (krytyczne), pokrycie 16 stopni
  (atlas ↔ wymagania ↔ opisy ↔ `fights`), spójność strukturalną P0.3
  (referencja techniki musi istnieć i mieć stopień w `levels[]`; technika
  z atlasu poza wymaganiami = ostrzeżenie), **spójność belek P0.4**
  (`stripes` zgodne z `number` stopnia: 1 dan = 1, N dan = N; `stripe:null` → brak `stripes`), kolizje aliasów (ostrzeżenia),
  lista opisów `text` (m.in. braki P1.6), media i statystyki. Skrypt jest
  read-only — po zmianach w JSON-ach uruchom go ponownie
  (exit 0 = brak problemów krytycznych).

## 6. Konwencje kodu i treści

- **Dane tylko w JSON** — komponenty importują przez `@/data`
  (`getLevel`, `filterTechniques`…). Nie twórz stałych z danymi w TSX.
- **Importy:** wewnątrz `src/` używaj aliasu `@/…` (np. `@/store/modalStore`,
  `@/features/technique/components/…`) — skonfigurowany w `tsconfig.app.json`
  i `vite.config.ts`; nie wpisuj ścieżek przez `../../../…`.
- **Style:** autorskie klasy per feature (np. `.tech-card`,
  `.glossary-card`, `.level-nav`) w plikach `src/features/*/styles/*.css`,
  importowane przez `src/styles/index.css`. Nie wstawiaj utility Tailwinda
  bezpośrednio do TSX-a, chyba że istnieje już taki wzorzec. **Nie dodawaj
  CSS Modules** (decyzja projektu: zwykły CSS per folder, zero zmian
  className w TSX). **Kolejność importów w `styles/index.css` niesie
  kaskadę** (`globals.css` pierwszy, `styles/modal.css` przed
  `glossary.css`) — nie zmieniaj jej bez sprawdzenia renderu obu modali.
- **Copy po polsku**, ton: rzeczowy, motywujący, bez marketingowego bełkotu.
  Zachowaj ostrzeżenie „programy egzaminacyjne mogą różnić się między
  organizacjami i dojo".
- **Terminologia:** najpierw polska nazwa lub romaji, kanji jako element
  ozdobny/identyfikujący (`japanese`, `reading` w danych).
- **Wizualizacja techniki = zdjęcie GenAI, nie rysunki SVG** — generowane
  postacie (mapa `DRAWINGS`, funkcje `*Art`, legenda pozycji) zostały
  usunięte. **Karta:** `.tech-image .technique-photo-frame` — biała ramka,
  `object-fit: contain`, `filter: grayscale(1) contrast(1.05)` (hover: skala
  1.035, powrót koloru); `.tech-image::after` ma `z-index: 1`, nakładki
  karty (`.tech-image > span/small/b`) mają `z-index: 2`. **Modal:**
  `.visualization-stage > .technique-photo-frame` — jak `.glossary-photo`
  (białe tło, padding 12, `max-width: min(100%, 520px)`, `flex: 1 1 0` +
  `height: 0`, **pełny kolor** — bez grayscale). Brak zdjęcia →
  `.technique-visual-placeholder` (kanji + wymowa; wzór z
  `.glossary-visual-placeholder`). Mapa obrazów:
  `src/features/technique/data/genaiImages.json`, wszystkie ścieżki
  lokalne przechodzą przez `resolveMediaSrc()` (prefiks `BASE_URL`).
- **Media z pola `video`** obsługuje `renderMedia()` w
  `TechniqueIllustration.tsx` (YouTube/`<video>`/`<img>`, klasy
  `.technique-media*`), karta przekazuje `controls={false}`. Wcześniejsza
  legenda SVG w modalu została usunięta (kopia kroków + nota zastępują ją).
- **Diagram stref (`ZoneIllustration.tsx`)** — jedyny zostawiony SVG
  postaci (karateka w fudo-dachi + przerywane linie z podpisami stref)
  dla haseł `jodan` / `chudan` / `gedan-strefa`; mapowanie id → strefa w
  `zoneForEntry()`, renderowany w modalu i pasku karty `.glossary-image.diagram`,
  gdy `image` jest `null`. Korzeń SVG ma klasę **`zone-illustration`**
  (dawniej `technique-illustration` — nie przywracaj starej nazwy), a style
  rysunku (`.illustration-ground`, `.illustration-grid`, `.floor-line`,
  `figure-*`, `.accent-limb`, `.visualization-stage > .zone-illustration`)
  żyją w `features/glossary/styles/glossary.css`. Styl: klasy `.zone-line` /
  `.zone-label`, aktywna strefa (hasło otwarte przez użytkownika) przez
  `.active`.
- **Media (obraz / gif / wideo):** kadruj przez `object-fit: contain` —
  `.glossary-image img`, `.glossary-photo`, `.tech-image .technique-media`;
  nigdy `cover` w kartach i modalach (mamy pokazywać całość, bez ucięcia),
  letterbox na ciemnym tle (`--ink` / `.technique-media-frame`). Media w
  karcie mają `pointer-events: none`, żeby klik trafił do przycisku karty,
  a `<video>` dostaje `controls` **tylko w modalu** — karta przekazuje
  `controls={false}` (`TechniqueIllustration`), więc klik w media otwiera
  modal z odtwarzaczem. Otwieranie: klik w **całą** kartę techniki
  (`onClick` na `<article>`, przycisk `.tech-image` zostaje punktem
  klawiaturowym — jedno zdarzenie, bez zagnieżdżonych handlerów) albo w
   całą kartę hasła (`<button className="glossary-card">`, a w kategorii
   „Części ciała" — statyczny `<article className="glossary-card static">`
   bez otwierania).
  W modalach obowiązuje **skalowanie bez ucięcia**: `.glossary-photo` ma
  `flex: 1 1 0` + `height: 0` — nigdy `flex: 1`, bo `flex-basis: 0%` przy
  nieokreślonej wysokości kontenera flex daje wysokość = proporcja naturalna
  obrazu i stage wyrasta ponad `max-height` panelu (obcinał dół zdjęcia o
  81–186px). Zdjęcie siedzi w białej ramce `max-width: min(100%, 520px)`
  na `#fff` (`.glossary-photo`, `.glossary-image`). Kolumna
  `.visualization-copy` ma `max-height: calc(100vh - 68px)` — jej długa
  treść nie może rozpychać wiersza grid ponad panel, tylko scrolluje się
   wewnątrz; `.visualization-stage > .technique-media-frame` i
   `> .zone-illustration` mają `max-height: calc(100vh - 192px)` dla
   niskich/szerokich okien (letterbox niewidoczny — tło stage ==
   `.illustration-ground` `#252723`). Oba clampa'y resetowane przez
  `max-height: none` w media ≤700px, gdzie panel ma `max-height: none` i
  stronę przewinąć może modal. Zdjęcia z `glossary.json` (karta i modal)
  przechodzą przez `resolveMediaSrc()` (eksportowane z
  `TechniqueIllustration.tsx`) — ścieżka od `/` dostaje prefiks `BASE_URL`,
  bo na GitHub Pages base to `/web_karate/`.
- **Linki technik = jeden styl:** `TechniqueLink` renderuje klasę
  `technique-ref` (+ modyfikator `chip`), a style obu wariantów żyją w
  `features/technique/styles/technique.css` (komponent → styl w folderze
  swojego feature). Nie odtwarzaj `.requirement-tech-link`,
  `.tech-ref-chip` ani `.glossary-related button` — to stare duplikaty
  (usunięte przy konsolidacji DRY).
- **Modale — wspólna logika zamykania:** Esc, blokada scrolla i
  `onBackdropMouseDown` pochodzą z `src/hooks/useModalBase.ts`
  (używają jej `TechniqueModal` i `GlossaryEntryModal`) — nie duplikuj
  `useEffect`-ów w kolejnym modalu.
- **Ikony** dodawaj do union `IconName` + rekordu `paths` w
  `components/ui/Icon.tsx`.
- **Nawigacja (sticky):** header `.site-header` jest `position: sticky; top: 0`
  i podąża za użytkownikiem **zarówno na desktopie, jak i na telefonie**.
  Działa tylko dlatego, że `.app-shell` ma `overflow-x: clip`, a **nie**
  `overflow: hidden/auto/scroll` — jakikolwiek overflow na przodku tworzy
  scroll container i zabija sticky (nie „naprawiaj" tego wracając do
  `hidden`). Kotwice (`#stopnie`, `#techniki`…) mają `section[id] {
  scroll-margin-top: 84px }` (70px ≤700px), żeby nagłówki nie chowały się
  pod headerem.
- **Nawigacja mobilna:** ≤1180px desktopowy nav jest zastępowany przyciskiem
  ☰ (`.menu-toggle`,
  ikona `menu` → `close` po otwarciu) w prawym górnym rogu — rozwija panel
  `#site-menu` pod headerem po prawej (linki do sekcji + `.nav-cta`
  „Sprawdź wymagania"; `.header-cta` jest wtedy ukryty). Zamykanie: klik
  w link / Escape / klik poza headerem / zmiana trasy (`Header.tsx`);
  a11y: `aria-expanded`, `aria-controls`. Desktop >1180px pokazuje sześć linków
  (w tym Poradnik i Ciekawostki); próg podniesiono po rozbudowie nawigacji.
- **Nawigacja między stopniami:** pasek prev / „Wszystkie stopnie" / next
  (`.level-nav`) jest **wewnątrz panelu wymagań** (`RequirementsPanel`,
  pod `requirements-note`), jako siatka `repeat(3, 1fr)` — 3 równe sekcje.
  Nie przenoś go na dół `LevelPage` (pod techniki) i nie zmieniaj siatki na
  `1fr auto 1fr`. Brakujący sąsiad (`start`/`dan5`) = sekcja-placeholder z
  „—". Dane: `getNeighbourLevels(level.order)` z `levels.json`.
- **A11y:** przyciski mają `aria-label`, modal ma `role="dialog"
  aria-modal="true"`, SVG ilustracji `role="img"` + `aria-label`.

## 7. Czego NIE robić

1. **Nie przywracaj czatu AI** — został świadomie usunięty przy przebudowie.
2. **Nie edytuj `old_src/`** to archiwum starej wersji (referencja).
3. **Nie zmieniaj `base` na `"./"`** i nie kasuj kroku `404.html` w workflow —
   history API na GH Pages tego wymaga.
4. **Nie duplikuj treści z JSON w komponentach** — dane czytaj z `src/data/`.
5. **Nie dodawaj ciężkich zależności** bez uzasadnienia (router już jest —
   nie dokładaj drugiego).
6. **Nie kasuj ostrzeżeń bezpieczeństwa/egzaminacyjnych** z treści.
7. **Nie kasuj wpisów w `DONE.md`** — historia jest append-only.
8. **Nie importuj plików CSS w TSX-ach** — style wchodzą jednym importem
   `./styles/index.css` w `main.tsx`; nie zmieniaj kolejności importów
   w `styles/index.css` bez weryfikacji renderu (kaskada).
9. **Nie trzymaj stanu modali / menu mobilnego w `useState`** — źródłem
   prawdy jest `src/store/*` (Zustand); komponenty czytają go selektorami.
10. **Nie odtwarzaj rysunków SVG postaci ani mapy `DRAWINGS`** — wizualizacja
    techniki to zdjęcia z `public/images/GenAI/` (mapa `genaiImages.json`)
    + placeholder kanji; zostaje tylko diagram stref (`ZoneIllustration`).
11. **Nie edytuj plików w `src/data/`** bez wyraźnej prośby użytkownika —
    dane poprawia on sam (wpisy w historii pokazują, że edycje „obok"
    rozbijają audyt P0.3).

## 8. Protokół pracy agenta

1. **Start sesji:** przeczytaj `WEB_PERSONAL.md` (ten plik) → `TODO.md` →
   ostatnie wpisy w `DONE.md`.
2. **Wybierz JEDNO zadanie** z `TODO.md` (kolejność priorytetową z listy).
3. **Realizuj** — trzymaj się konwencji z sekcji 6; miej się na baczności
   przed zakazami z sekcji 7.
4. **Weryfikuj:** `npm run build` musi przejść bez błędów; dla zmian routingowych
   dodatkowo `npm run preview` + sprawdzenie tras (`/`, `/kyu/9`, `/slownik`);
   dla zmian w `src/data/*.json` dodatkowo `npm run audit` (odświeży `RAPORT.md`).
5. **Zamknięcie zadania:**
   - w `TODO.md`: zmień `- [ ]` → `- [x]` i dopisz krótki rezultat,
   - w `DONE.md`: dopisz wpis (data, zadanie, 1–2 zdania co zmieniono),
   - jeśli zmieniła się architektura/struktura → zaktualizuj ten plik.
6. **Nowe zadanie wpisuj do `TODO.md`** zamiast realizować „obok" listy —
   kolejny agent ma zobaczyć kontekst.
