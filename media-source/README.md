# media-source/

Lokalne archiwum nagrań z dojo. Katalog jest trackowany, pliki wideo nie.

- Filmy leżą w `videos/<id>/video/`, gdzie `<id>` to ID techniki z `src/content/techniques/<id>/`. Tylko techniki publikują filmy; słownik używa lokalnych zdjęć w `public/images/glossary/`.
- Nazwa pliku w `details.json` (`source`) jest jedynym wpisem dotyczącym danego nagrania. Klucze `<id>/video/<stem>.mp4` i `<id>/poster/<stem>.jpg` wylicza `scripts/catalog.mjs`; nie zapisuje ich żaden plik danych.
- `npm run media:prepare` tworzy w `media-build/` wersje 1080×1920 (9:16 z pasami, bez audio, `libx264 -preset slow -crf 18`) oraz postery JPEG `-q:v 2`.
- `npm run media:sync` to jedyny zapis na R2: domyślnie podgląd, `--apply` wykonuje zmiany, usuwanie ogranicza zakres znanych ID i limit 5% bucketu (min. 20 obiektów). Niepublikowane pliki w archiwum są ignorowane.

## Sekrety R2

Skopiuj `.env.r2.example` do `.env.r2` (gitignored) i uzupełnij `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`. Skrypty ładują plik automatycznie; zmienne środowiskowe mają pierwszeństwo (można też wskazać inny plik przez `R2_ENV_FILE`). Publiczny adres (`R2_PUBLIC_BASE_URL`, z końcowym `/`) jest zapisany bez sekretów w `src/data/media-config.json`. CI nie ma sekretów zapisu.
