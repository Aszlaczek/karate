# KIHON — droga do egzaminu

[![CI + Deploy to GitHub Pages](https://github.com/Aszlaczek/web_karate/actions/workflows/deploy.yml/badge.svg)](https://github.com/Aszlaczek/web_karate/actions/workflows/deploy.yml)

Polskojęzyczny przewodnik po karate Kyokushin: stopnie, atlas technik, słownik, poradniki i historia. Statyczna aplikacja React bez backendu. Baza: 16 stopni, 120 technik, 68 haseł słownika, 323 nagrania w R2.

## Start

Node.js 22.12+, npm.

```bash
npm ci
npm run dev
```

`npm run check` to pełna bramka lokalna: weryfikacja mediów → audyt danych → testy → build. `npm audit` sprawdza osobno podatności zależności.

## Komendy

| Komenda | Działanie |
| --- | --- |
| `npm run dev` / `npm run build` / `npm run preview` | Serwer deweloperski / build z `tsc -b` / podgląd `dist/`. |
| `npm run data:build` | Buduje `src/data/atlas.json` i `public/data/{techniques,glossary}/<id>.json` z kanonicznych źródeł. Uruchamiana automatycznie przed `dev`, `audit`, `test` i `build`. |
| `npm run technique:new -- <id> [--level <numer>] [--group <tytuł>]` | Tworzy folder techniki z szablonami i dopisuje ją do kolejności oraz wymagań stopnia. |
| `npm run media:prepare` | Transkoduje nagrania z `media-source/` do 1080×1920 z posterami w `media-build/`. Przyrostowo: `MEDIA_PREPARE_ONLY=id1,id2 npm run media:prepare`. |
| `npm run media:verify` | Jedyna bramka kontroli mediów: zgodność treści z plikami w `media-build/`. `MEDIA_VERIFY_REMOTE=1 npm run media:verify` dodaje HEAD-requesty do R2 (tylko lokalnie). |
| `npm run media:sync` | Jedyny zapis na R2: podgląd różnicy. `npm run media:sync -- --apply` wykonuje zmiany; `--force` podnosi limit usunięć. |
| `npm run audit` | Audyt danych; zapisuje `RAPORT.md`. |
| `npm test` / `npm run test:watch` | Vitest jednorazowo / w trybie obserwowania. |
| `npm run check` | `npm run media:verify && npm run audit && npm test && npm run build`. |

## Jedno miejsce na technikę

```
src/content/techniques/
  index.json                 # kolejność ID
  <id>/index.json             # karta + wiedza (translation, nameParts, sections)
  <id>/details.json           # wyłącznie filmy: source, label, alt?, zone?, caption?
```

`source` to tylko nazwa pliku, np. `mae-geri-f1.mp4`. Klucze R2, postery i pełne URL-e **wylicza** `scripts/catalog.mjs`:

```
source:  mae-geri-f1.mp4
wideo:   <id>/video/mae-geri-f1.mp4
poster:  <id>/poster/mae-geri-f1.jpg
URL:     baseUrl + klucz   (baseUrl: src/data/media-config.json)
```

Nie ma już `media/catalog.json`, `src/data/media.json`, lokalnych `media.json`, `poster.jpg` ani plików `techniques.json` / `glossary.json` / `media-thumbnails.json` w `src/data/`. Nie są potrzebne: katalog jest strukturą w pamięci, a widoki są generowane. `src/data/knowledge/` przechowuje wyłącznie słownik (postawy, dłonie, stopy i pozostałe kategorie) z polem `knowledge`; hasła mają jedno zdjęcie z `entry.image` i nie mają galerii.

Pozostałe źródła edytowalne: `src/data/levels.json` (wymagania), `src/data/learning.json` (poradniki, historia, ciekawostki), `src/data/dojoKun.json`, `src/data/media-config.json` (publiczny adres R2, bez sekretów).

Wszystko w `src/data/atlas.json` i `public/data/` jest generowane i nie wolno tego edytować ręcznie. Aplikacja pobiera jeden chunk na wpis dopiero po otwarciu modala; `src/data/onDemand.ts` cache'uje odpowiedź.

## Dodanie lub zmiana techniki

1. `npm run technique:new -- nowa-technika --level 10` — opcjonalnie dopisuje wymaganie do `src/data/levels.json`.
2. Wrzuć nagrania do `media-source/videos/<id>/video/` (gitignored) i uzupełnij dwa pliki w `src/content/techniques/<id>/`: `index.json` (karta + wiedza) i `details.json` (filmy). zmiana nazwy pliku = jedna linijka w `details.json`; zmiana opisu = jedna linijka w `index.json`.
3. `npm run check`. Jeśli pojawiły się nowe pliki: `MEDIA_PREPARE_ONLY=<id> npm run media:prepare`, potem `npm run media:sync` (podgląd). Publikacja: `npm run media:sync -- --apply`.

Technika bez filmów dostaje placeholder z kanji — nie trzeba jej wpisywać do katalogu mediów. Usunięcie techniki = usunięcie folderu i ID z `index.json`; `sync` wyświetli stare klucze do usunięcia, a bramka 5% pilnuje zakresu.

## Media i publikacja

Surowe wideo leży poza repozytorium w `media-source/`, wersje do uploadu w `media-build/` (oba gitignored). `public/` zawiera tylko lokalne zdjęcia słownika i hero. Bucket R2 ma publiczny dostęp; `src/data/media-config.json` trzyma wyłącznie bazowy URL. Sekrety zapisu (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`) ładują się z gitignored `.env.r2` na podstawie `.env.r2.example`; zmienne środowiskowe mają pierwszeństwo. Szczegóły w [media-source/README.md](media-source/README.md).

CI nie ma sekretów zapisu: [deploy.yml](.github/workflows/deploy.yml) sprawdza media, audyt, testy i build, a publikuje na GitHub Pages wyłącznie z `main` (PR-y są tylko weryfikowane). [media-verify.yml](.github/workflows/media-verify.yml) wykonuje samą kontrolę spójności. Wynik audytu trafia do [RAPORT.md](RAPORT.md).

Dla hostingu w podkatalogu ustaw `VITE_BASE`, np. `VITE_BASE=/karate/ npm run build`; react-router używa tej samej podstawy. Metadane strony są w `index.html`.

## Struktura kodu

- `src/app/` — trasy i obsługa modali, `src/pages/` — widoki, `src/features/` — moduły funkcjonalne.
- `src/data/` — typy, dostęp do danych (`index.ts`, `onDemand.ts`), kanoniczny słownik i pliki wygenerowane.
- `scripts/` — `catalog.mjs` (jedno źródło katalogu), `build-content.mjs` (jeden build danych), `audit-danych.mjs`, `verify-media.mjs`, `sync-media.mjs`, `prepare-media.mjs`, `technique-new.mjs`, `r2-ops.mjs`.
- `public/data/` — generowane, gitignored chunki na żądanie.

Główny plik JS ma około 396 kB (115 kB gzip); filmy nie wchodzą do bundle'u.
