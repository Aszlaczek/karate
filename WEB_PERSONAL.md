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
| Style | Tailwind v4 przez `@tailwindcss/vite` + autorskie klasy w `src/index.css` |
| Deploy | GitHub Pages via `.github/workflows/deploy.yml` (push → `main`/`master`) |

```bash
npm install        # instalacja zależności
npm run dev        # dev server (Vite)
npm run build      # tsc -b && vite build -> dist/   ← WERYFIKACJA OBOWIĄZKOWA
npm run preview    # podgląd builda z dist/ (SPA fallback działa dla tras)
```

**Po każdej edycji kodu uruchom `npm run build`.** Build musi przechodzić bez
błędów TypeScript. Repo nie ma jeszcze lintera ani testów (patrz `TODO.md`).

### Base URL i deploy (GitHub Pages)

- `vite.config.ts`: `base: process.env.VITE_BASE ?? "/"` — lokalnie `/`,
  w CI ustawiane na `VITE_BASE: /<nazwa-repo>/` (bezwzględna ścieżka!).
- Workflow kopiuje też `dist/index.html` → `dist/404.html` — oficjalny fallback
  SPA GitHub Pages dla odświeżenia głębokiej trasy (np. `/repo/kyu/9`).
- `BrowserRouter basename={import.meta.env.BASE_URL}` w `src/App.tsx`.
- **NIE wracaj do `base: "./"`** — przy history API i głębokich trasach
  ścieżki assetów by się rozjechały.

## 3. Struktura repozytorium

```
index.html                # punkt wejścia Vite, meta SEO (lang="pl"), favicon
vite.config.ts            # base przez env VITE_BASE
src/
  main.tsx                # mount <App/>
  App.tsx                 # router + layout (Header/main/Footer) + ScrollManager
  index.css               # wszystkie style
  data/                   # ★ JEDNO ŹRÓDŁO PRAWDY (JSON + typy + dostępnicy)
    levels.json           # 12 stopni: start, 10…1 kyu, dan — wymagania per kyu
    techniques.json       # techniki: nazwa, opis, infografia, wideo, stopnie
    glossary.json         # słownik: strefy / części ciała / ustawienia stóp
    dojoKun.json          # 7 zasad dojo
    types.ts              # Level, Technique, Glossary*, DojoKunEntry
    index.ts              # eksporty + getLevel(), filterTechniques()… itd.
  components/             # Icon, Header, Footer, Hero, BeltPath,
                          # RequirementsPanel, TechniquesSection, TechniqueModal,
                          # GlossaryEntryModal, ModalProvider, TechniqueIllustration,
                          # DojoKun
  pages/                  # HomePage, LevelPage, TechniquesPage,
                          # GlossaryPage, NotFoundPage
old_src/                  # ARCHIWUM starego źródła — NIE EDYTOWAĆ
public/favicon.svg
public/videos/test.gif     # przykładowy plik do pola `video` w technice
dist/                     # wynik builda (+ 404.html w CI)
.github/workflows/deploy.yml
WEB_PERSONAL.md  DONE.md  TODO.md  README.md
```

## 4. Routing (react-router, history API)

| Trasa | Strona | Zawartość |
| --- | --- | --- |
| `/` | `HomePage` | Hero, ścieżka 12 stopni (`#stopnie`), atlas (`#techniki`), teaser słownika (`#slownik`), Dojo-kun (`#dojo-kun`) |
| `/kyu/:kyuId` | `LevelPage` | `:kyuId` = `start`, `10`…`1`, `dan` → panel wymagań + techniki stopnia + prev/next |
| `/techniki` | `TechniquesPage` | pełny atlas, filtry: kategoria × stopień × tekst |
| `/slownik` | `GlossaryPage` | zakładki kategorii + wyszukiwarka + karty haseł |
| `*` | `NotFoundPage` | 404 |

- Nieprawidłowy `kyuId` → `<Navigate to="/nie-istnieje" replace />`.
- Kotwice (`/#stopnie`, `/#dojo-kun`) obsługuje `ScrollManager` w `App.tsx`
  (scroll do elementu po `hash`, `scrollTo(0,0` przy zmianie ścieżki).
- Tytuły dokumentu ustawiają strony w `useEffect` (patrz `document.title`).
- **Modale (jeden unified provider `components/ModalProvider.tsx`):**
  - hook `useModals()` → `openTechnique(technique)` / `openGlossaryEntry(entry, category)`,
  - stany: `{kind:"technique"}` lub `{kind:"glossary"}` — tylko jeden naraz,
  - deep-linki przy starcie: `#technika-<id>` (atlas/wymagania) oraz
    `#haslo-<id>` (słownik), zapis przez `replaceState`,
  - klik „Powiązane techniki" w modalu hasła **przełącza** modal na technikę
    (bez zamykania overlaya), zamknięcie: `Esc` / klik w tło / przycisk.

## 5. Dane — jedno źródło prawdy (`src/data/`)

Wszystkie treści **wychodzą z JSON-ów**; komponenty nie trzymają danych.
Typy w `types.ts`, walidacja struktury przez przypisanie do `Level[]` /
`Technique[]` itd. (pole `belt` normalizowane do `BeltId`).

- **`levels.json`** — 12 wpisów (`start`, `10`…`1`, `dan`): `kyu`, `number`
  (0 / 10–1 / 99), `order` (kolejność nawigacji), `belt`, `color`, `stripe`
  (belka II stopnia), `level`, `time`, `intro`, `groups[]` (wymagania).
- **`techniques.json`** — 132 techniki w 7 filtrach (Uderzenia, Kopnięcia,
  Bloki, Pozycje, Kumite, Kata): `name`, `japanese`, `reading`, `category`,
  `description`, `tags`, `focus`, **`levels[]`** (które kyu ją egzaminuje),
  **`aliases[]`** (warianty nazwy w tekście wymagań → auto-linkowanie),
  **`infographic`** (klucz → rysunek w mapie `DRAWINGS`: `zuki`, `uchi`,
  `dachi`, `uke`, `geri`, `kata`, `kumite`), `image`, **`video`**
  (`null` = schemat SVG; nie-null → odtwarzacz/embed zamiast SVG:
  YouTube URL, `*.mp4`, `*.gif`/`*.jpg`…).
- **`glossary.json`** — `categories[]` → `entries[]`:
  `id` (stabilny slug → deep-link `#haslo-<id>`), `term` PL, `japanese`,
  `reading`, `description`, **`image`** (`null` = placeholder z kanji;
  docelowo `"/images/glossary/<id>.jpg"` — plik w `public/images/glossary/`),
  **`related`** (tablica `id` technik → chipy w modalu hasła).
- **`dojoKun.json`** — `japanese` / `reading` / `polish`.

### Jak dodać treść (integracja)

- **Nowa technika:** dopis wpis w `techniques.json` (+ `aliases`, `levels`)
  i ustaw `infographic` na klucz z mapy `DRAWINGS` w
  `TechniqueIllustration.tsx` (`zuki`, `uchi`, `dachi`, `uke`, `geri`,
  `kata`, `kumite`; obcy klucz → fallback ciosu prostego). Jeśli zamiast
  schematu ma się pokazać filmik/gif/zdjęcie — uzupełnij pole `video`
  (YouTube, `*.mp4`, `*.gif`; ścieżki od `/` są automatycznie prefiksowane
  o `BASE_URL`), wtedy karta i modal renderują odtwarzacz zamiast SVG.
- **Nowy stopień / zmiana wymagań:** edytuj `levels.json` — karty pasów,
  panel wymagań, filtr stopni i nawigacja prev/next zaktualizują się same.
- **Nowe hasło słownika:** dopis w `glossary.json` do właściwej kategorii —
  z `id` (slug bez spacji), `image: null` i `related` (id technik z atlasu).
  Karta staje się klikalna automatycznie; zdjęcie wystarczy uzupełnić pole
  `image` ścieżką do pliku w `public/images/glossary/`.
- Wymagania linkują techniki automatycznie przez `aliases` (regex zbudowany
  w `buildTechniqueLinkPattern()`) — nie wpisuj linków ręcznie w JSON.
  Dopasowanie jest odporne na zapis: spacja ≡ myślnik ≡ pauza, makrony
  opcjonalne („Pozycja fudo-dachi" linkuje alias „Fudo dachi") — wspólna
  normalizacja po obu stronach (`normalizeAlias()`), bo panel dzieli tekst
  regexem, a potem szuka aliasem. Dodatkowo aliasy dopasowują się w granicach
  słowa (lookaround z klasą `[\p{L}\p{N}-]`), żeby krótkie aliasy nie łapały
  się w środku innych nazw („Mawashi-geri" nie złapie „Ushiro-mawashi-geri");
  krótkie warianty (np. „Soto-uke", „Yoko-geri") dopisuj jako dodatkowe
  aliasy techniki.

## 6. Konwencje kodu i treści

- **Dane tylko w JSON** — komponenty importują przez `../data`
  (`getLevel`, `filterTechniques`…). Nie twórz stałych z danymi w TSX.
- **Style:** autorskie klasy w `src/index.css` (np. `.tech-card`,
  `.glossary-card`, `.level-nav`). Nie wstawiaj utility Tailwinda
  bezpośrednio do TSX-a, chyba że istnieje już taki wzorzec.
- **Copy po polsku**, ton: rzeczowy, motywujący, bez marketingowego bełkotu.
  Zachowaj ostrzeżenie „programy egzaminacyjne mogą różnić się między
  organizacjami i dojo".
- **Terminologia:** najpierw polska nazwa lub romaji, kanji jako element
  ozdobny/identyfikujący (`japanese`, `reading` w danych).
- **SVG schematy:** `viewBox="0 0 800 480"`, siatka `pattern` co 40px,
  klasy: `figure-head`, `figure-body`, `figure-limb`, `accent-limb`,
  `ghost-limb`, `motion-line` (strzałka `url(#arrowhead)`, czerwony `#b4362e`),
  `target-ring`, `kata-path`. Legenda w modalu: pozycja końcowa / początkowa /
  kierunek ruchu (renderowana tylko, gdy `video == null`).
- **Ilustracje trzymaj w mapie `DRAWINGS`** (`TechniqueIllustration.tsx`):
  klucz `infographic` → funkcja zwracająca JSX; nowy schemat = nowa funkcja
  + wpis w mapie (stare klucze: `maegeri`, `gedan`, `sotouke`, `zenkutsu`,
  `taikyoku` — aliasy do nowych rysunków). Media z pola `video` obsługuje
  `renderMedia()` (YouTube/`<video>`/`<img>`, klasy `.technique-media*`).
- **Ikony** dodawaj do union `IconName` + rekordu `paths` w `components/Icon.tsx`.
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

## 8. Protokół pracy agenta

1. **Start sesji:** przeczytaj `WEB_PERSONAL.md` (ten plik) → `TODO.md` →
   ostatnie wpisy w `DONE.md`.
2. **Wybierz JEDNO zadanie** z `TODO.md` (kolejność priorytetową z listy).
3. **Realizuj** — trzymaj się konwencji z sekcji 6; miej się na baczności
   przed zakazami z sekcji 7.
4. **Weryfikuj:** `npm run build` musi przejść bez błędów; dla zmian routingowych
   dodatkowo `npm run preview` + sprawdzenie tras (`/`, `/kyu/9`, `/slownik`).
5. **Zamknięcie zadania:**
   - w `TODO.md`: zmień `- [ ]` → `- [x]` i dopisz krótki rezultat,
   - w `DONE.md`: dopisz wpis (data, zadanie, 1–2 zdania co zmieniono),
   - jeśli zmieniła się architektura/struktura → zaktualizuj ten plik.
6. **Nowe zadanie wpisuj do `TODO.md`** zamiast realizować „obok" listy —
   kolejny agent ma zobaczyć kontekst.
