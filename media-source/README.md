# media-source/

Lokalne archiwum nagrań z dojo. **Ta dokumentacja jest trackowana, pliki wideo nie.**

## Zasady

- Wszystkie filmy leżą w `videos/<id>/video/`, gdzie `<id>` to kanoniczny
  identyfikator z `src/data/techniques.json` albo `src/data/glossary.json`
  (postawy też są w słowniku). Nie ma osobnych sekcji `techniques`/`stances`.
- Pliki bez pewnego przypisania trafiają do `videos/_nieprzypisane/` i nie są
  publikowane.
- `MAPPING.md` (generowany, gitignored) opisuje, jak pliki z oryginalnego
  zestawu zostały przypisane do wpisów oraz które ujęcia wybrano do publikacji.
- Publikacja odbywa się przez `npm run media:prepare` → `npm run media:upload`
  → `R2_PUBLIC_BASE_URL=… npm run media:manifest`. `public/` nie zawiera filmów.
- Do R2 trafiają klucze `<id>/video/<stem>.mp4`, `<id>/poster/<stem>.jpg`
  i `<id>/image/<stem>.jpg` (maks. 4 filmy na wpis). Filmy i postery mają
  identyczny wymiar 1080×1920 (pion 9:16 z pasami zamiast ucinania), bez
  audio, `libx264 -preset slow -crf 18`, JPEG `-q:v 2`. Samodzielne zdjęcia
  (`seiken`, `sokuto`) są kopiowane bez rekompresji z lokalnych oryginałów
  1448×1086. Całość to około 882 MB — daleko poniżej darmowego limitu
  10 GB-month; egress z R2 jest bezpłatny.
- `npm run media:cleanup` pokazuje obiekty R2 nieużyte przez manifest;
  `npm run media:cleanup -- --apply` je usuwa (tylko klucze znanych wpisów).

## Konfiguracja R2

Skopiuj `.env.r2.example` do `.env.r2` (gitignored) i uzupełnij:

```
R2_ACCOUNT_ID=…
R2_ACCESS_KEY_ID=…
R2_SECRET_ACCESS_KEY=…
R2_BUCKET=…
R2_PUBLIC_BASE_URL=https://pub-xxxxxxxx.r2.dev/
```

Skrypty ładują ten plik automatycznie. Zmienne ustawione w środowisku — np. GitHub Secrets dla workflow `media-upload` — mają pierwszeństwo. Inny plik można wskazać przez `R2_ENV_FILE`.

`R2_PUBLIC_BASE_URL` musi kończyć się `/` i wskazywać na publiczny dostęp
do bucketa (np. włączony dostęp `r2.dev` albo własna domena).
