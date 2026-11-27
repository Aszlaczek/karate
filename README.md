# KIHON — droga do egzaminu

[![CI + Deploy to GitHub Pages](https://github.com/Aszlaczek/web_karate/actions/workflows/deploy.yml/badge.svg)](https://github.com/Aszlaczek/web_karate/actions/workflows/deploy.yml)

Polskojęzyczny przewodnik po karate Kyokushin, który pomaga uporządkować przygotowania do egzaminu i zrozumieć nazwy używane na treningu. Łączy wymagania na poszczególne stopnie z atlasem technik, słownikiem japońskich pojęć oraz praktycznymi poradnikami.

Aplikacja działa w przeglądarce jako SPA (Single Page Application). Treści są przechowywane w plikach JSON i dołączane podczas budowania projektu. Uruchomienie nie wymaga backendu, bazy danych, kont użytkowników ani kluczy API.

## Funkcje

- **Ścieżka stopni:** poziom początkujący, 10–1 kyu oraz 1–5 dan. Każdy stopień ma oznaczenie pasa i belek, opis, staż, wymagania egzaminacyjne oraz przypisane techniki.
- **Atlas technik:** wyszukiwanie po nazwie, zapisie japońskim, wymowie i opisie oraz filtrowanie według kategorii i stopnia. Kategorie obejmują uderzenia, kopnięcia, bloki, pozycje, kumite i kata.
- **Szczegóły technik i postaw:** polskie znaczenie nazwy, tłumaczenie jej członów, opisy wykonania oraz galerie filmów i zdjęć (minimum 2, bez górnego limitu), z wyborem ujęcia, podziałem na strefy jōdan/chūdan/gedan i filtrem „Filmy / Zdjęcia". Wymagania egzaminacyjne prowadzą bezpośrednio do odpowiednich kart.
- **Słownik karate:** strefy ciała, powierzchnie uderzające, postawy, etykieta dojo, komendy treningowe oraz strój i sprzęt. Hasła zawierają zapis japoński, wymowę, objaśnienie i powiązania z technikami.
- **Poradniki:** wiązanie pasa, składanie karategi, zakładanie taśm na dłonie i wiązanie troczków stroju — instrukcje krok po kroku z odnośnikami do źródeł.
- **Historia i ciekawostki:** oś czasu karate i Kyokushin oraz krótkie artykuły z bibliografią.
- **Dojo-kun:** przysięga dojo w zapisie japońskim, z wymową i polskim tłumaczeniem, dostępna na stronie głównej.
- **Zgłaszanie pomysłów i poprawek:** formularz przygotowuje wiadomość w programie pocztowym przez `mailto:` albo pozwala skopiować jej treść. Użytkownik wysyła wiadomość we własnej poczcie.

Obecna baza zawiera **16 poziomów, 118 technik, 68 haseł słownika w 8 kategoriach (w tym 15 postaw, 10 ustawień dłoni i 6 ustawień stóp), 4 poradniki, 6 wydarzeń historycznych i 6 ciekawostek**.

## Uruchomienie lokalne

Użyj **Node.js 22.12 lub nowszego z linii 22** i npm. Workflow publikacji również korzysta z Node.js 22.

W katalogu projektu wykonaj:

```bash
npm ci
npm run dev
```

Otwórz adres wypisany przez Vite w terminalu, domyślnie `http://localhost:5173`. Zmiany w kodzie i treści są odświeżane automatycznie. `npm ci` instaluje zależności zgodnie z wersjami zapisanymi w `package-lock.json`. Do lokalnego startu nie trzeba tworzyć pliku `.env`.

## Dostępne polecenia

| Polecenie | Działanie |
| --- | --- |
| `npm ci` | Instaluje zależności na podstawie pliku blokady. |
| `npm run dev` | Uruchamia serwer deweloperski Vite. |
| `npm run build` | Sprawdza typy przez `tsc -b` i buduje wersję produkcyjną w `dist/`. |
| `npm run preview` | Udostępnia lokalnie wcześniej zbudowaną aplikację, domyślnie na porcie 4173. |
| `npm run audit` | Sprawdza spójność danych aplikacji i zapisuje raport w `RAPORT.md` w katalogu głównym. |
| `npm run media:manifest` | Tworzy `src/data/media.json` z `media-build/manifest-source.json` (gdy ustawiono `R2_PUBLIC_BASE_URL`) albo skanuje `public/` w trybie lokalnym. Zachowuje ręczne opisy. |
| `npm run media:check` | Alias `npm run audit` — szybkie sprawdzenie galerii i plików. |
| `npm run media:organize` | Przenosi surowe nagrania do `media-source/videos/<id>/video/` i zapisuje raport dopasowań. |
| `npm run media:prepare` | Wybiera wszystkie ujęcia filmu na wpis (bez limitu), transkoduje je do 1080×1920 (CRF 18 slow, bez audio) i robi postery JPEG q:v 2 w `media-build/`. Rozpoznaje strefę i wariant z nazwy pliku. Czyta filmy z `<id>/video/` oraz bezpośrednio z `<id>/`; jeden folder archiwum może zasilać kilka ID (podział `mawashi-geri` na `chūsoku`/`haisoku`). Techniki nie dostają klatek, a słownik czyta lokalne obrazy z `public/images/glossary/`. Tryb przyrostowy: `MEDIA_PREPARE_ONLY=id1,id2 npm run media:prepare` uzupełnia tylko wybrane ID. |
| `npm run media:upload` | Wysyła przygotowane pliki do Cloudflare R2 (czyta sekrety z `.env.r2` lub środowiska, 3 próby na plik). |
| `npm run media:check-remote` | Sprawdza HEAD-requestami wszystkie zdalne URL-e z `media.json`. |
| `npm run media:delete-prefix` | Usuwa cały stary prefiks `<id>/` po zmianie nazwy folderu; blokuje usuwanie aktywnych ID (podgląd, `--apply` wymagany). |
| `npm test` | Uruchamia testy jednostkowe Vitest jednorazowo (tryb CI). |
| `npm run test:watch` | Uruchamia Vitest w trybie obserwowania zmian. |
| `npm run check` | Pełna bramka lokalna: audyt danych → testy → build. |

Podgląd wersji produkcyjnej:

```bash
npm run build
npm run preview
```

`npm run audit` to audyt **treści projektu**. Polecenie `npm audit` jest osobnym narzędziem npm do sprawdzania podatności zależności.

## Technologie i organizacja kodu

| Technologia | Zastosowanie |
| --- | --- |
| React 19 + TypeScript 5.9 | Komponenty interfejsu i typowanie danych. |
| Vite 7 | Serwer deweloperski i budowanie aplikacji. |
| React Router 7 | Nawigacja między podstronami z użyciem `BrowserRouter`. |
| Zustand 5 | Stan menu mobilnego i okien szczegółów. |
| Tailwind CSS 4 + CSS | Style globalne, tokeny wizualne i style poszczególnych funkcji. |
| GitHub Actions + GitHub Pages | Automatyczne budowanie i publikowanie statycznej witryny. |

```text
.
├── .github/workflows/deploy.yml       # CI i publikacja na GitHub Pages
├── .github/workflows/media-upload.yml # Opcjonalny upload nagrań do R2
├── media-source/                      # Lokalne archiwum (gitignored, poza public/)
│   └── videos/<id>/video/*.mp4        # Wszystkie ujęcia danej techniki/postawy
├── media-build/                       # Przygotowane media 1080×1920 (gitignored)
├── public/                            # Favicon, obraz podglądu i lokalne zdjęcia
│   ├── data/{techniques,glossary}/    # Pełne dane wpisów (gitignored, generowane)
│   └── images/{hero,techniques,stances,glossary}/  # Zdjęcia self-hosted
├── scripts/audit-danych.mjs           # Audyt spójności treści i plików galerii
├── scripts/generate-detail-chunks.mjs # Generator danych na żądanie i indeksu miniaturek
├── scripts/generate-media.mjs         # Generator manifestu (R2 albo lokalny)
├── src/
│   ├── app/                      # Definicje tras i obsługa okien szczegółów
│   ├── components/ui/            # Wspólne elementy interfejsu
│   ├── data/                     # Treści JSON, typy i funkcje dostępu do danych
│   │   ├── media-thumbnails.json # Lekki indeks miniaturek dla kafelków
│   │   ├── index.ts              # Indeks startowy (bez pełnych galerii)
│   │   ├── onDemand.ts           # Pobieranie i cache plików z public/data/
│   │   └── fullData.ts           # Pełne dane synchroniczne tylko dla testów
│   ├── features/                 # Moduły funkcjonalne z komponentami i stylami
│   ├── hooks/                    # Tytuły stron, przewijanie i obsługa modali
│   ├── pages/                    # Widoki podstron
│   ├── store/                    # Stan interfejsu w Zustand
│   ├── styles/                   # Style globalne, tokeny i punkt wejścia CSS
│   ├── App.tsx                   # Wspólny układ aplikacji i router
│   └── main.tsx                  # Punkt wejścia React
├── agents/                       # Notatki projektowe, zadania i wcześniejsze raporty
├── index.html                    # Dokument HTML i metadane udostępniania
├── package.json                  # Zależności i skrypty npm
└── vite.config.ts                # Konfiguracja Vite, aliasów i ścieżki bazowej
```

Moduły w `src/features/` obejmują stronę główną, nawigację, stopnie, techniki, słownik, dojo-kun, materiały edukacyjne i kontakt. Alias `@/` wskazuje na katalog `src/`. Treści startowe są pobierane przez funkcje z `src/data/index.ts` i `src/data/learning.ts`; filtrowanie odbywa się w przeglądarce. Galerie i szczegółowe opisy są ładowane z `public/data/` dopiero po otwarciu techniki lub hasła — patrz „Ładowanie danych na żądanie" poniżej.

## Podstrony i odnośniki

| Adres | Zawartość |
| --- | --- |
| `/` | Strona główna, wybór stopnia, atlas, kategorie słownika i dojo-kun. |
| `/kyu/start` | Poziom początkujący, bez stopnia. |
| `/kyu/10` … `/kyu/1` | Wymagania na kolejne stopnie kyu. |
| `/kyu/dan` | Wymagania na 1 dan. |
| `/kyu/dan2` … `/kyu/dan5` | Wymagania na 2–5 dan. |
| `/techniki` | Pełny atlas technik i postaw. |
| `/slownik` | Słownik z wyszukiwaniem i wyborem kategorii. |
| `/poradnik` | Praktyczne instrukcje przed treningiem. |
| `/ciekawostki` | Historia karate i artykuły. |
| `/kontakt` | Formularz zgłaszania propozycji i poprawek. |

Kategorię słownika można wskazać w adresie, np. `/slownik?kategoria=pozycje`. Szczegóły techniki lub hasła można udostępnić przez fragment adresu: `/techniki#technika-seiken-oi-tsuki` albo `/slownik#haslo-fudo`. Przy otwarciu takiego adresu aplikacja wyświetli odpowiednie okno szczegółów. Poradniki mają również własne kotwice oparte na ich `id`.

## Edycja treści

Większość zmian merytorycznych można wprowadzać bez edytowania komponentów React.

| Plik | Zawartość |
| --- | --- |
| [`src/data/levels.json`](src/data/levels.json) | Stopnie, pasy, kolejność, staż, liczba walk i grupy wymagań. |
| [`src/data/techniques.json`](src/data/techniques.json) | Nazwy, opisy, kategorie, wymowa i przypisanie technik do stopni. |
| [`src/data/techniqueDetails.json`](src/data/techniqueDetails.json) | Rozwinięte opisy i tłumaczenia nazw, osobno w `techniques` i `stances`. |
| [`src/data/glossary.json`](src/data/glossary.json) | Kategorie słownika, hasła, postawy i powiązania z technikami. |
| [`src/data/dojoKun.json`](src/data/dojoKun.json) | Treść przysięgi dojo. |
| [`src/data/learning.json`](src/data/learning.json) | Poradniki, historia, ciekawostki, źródła oraz adres i tematy formularza kontaktowego. |
| [`src/data/media.json`](src/data/media.json) | Galerie filmów/zdjęć technik i haseł słownika (także postaw), od 2 elementów, bez górnego limitu; opcjonalne pole `zone`. |
| [`src/data/types.ts`](src/data/types.ts) | Typy opisujące strukturę danych. |

### Powiązania między danymi

Wymagania stopnia korzystają z trzech rodzajów elementów:

```json
[
  { "type": "technique", "id": "seiken-oi-tsuki" },
  { "type": "glossary", "id": "fudo" },
  { "type": "text", "text": "Dodatkowy opis wymagania" }
]
```

Referencje `technique` i `glossary` muszą wskazywać istniejące identyfikatory. Tablica `levels` w technice lub postawie używa pola **`number`** stopnia: `0` oznacza start, `1`–`10` odpowiada stopniom kyu, a `11`–`15` stopniom 1–5 dan. Pole `order` określa kolejność wyświetlania, a tekstowe `id` jest używane w adresach podstron.

Dodając technikę:

1. Dodaj rekord z unikalnym `id` w `techniques.json` i kategorią z `CATEGORIES` w `src/data/index.ts`.
2. Uzupełnij wpis o tym samym `id` w `techniqueDetails.json`: tłumaczenie, człony całej nazwy w ich kolejności i co najmniej dwie sekcje opisu.
3. Przypisz stopnie w `levels` i dodaj odwołania w wymaganiach odpowiednich stopni w `levels.json`.
4. Właściwe filmy i zdjęcia dodaj zgodnie z rozdziałem „Ilustracje i wideo". Technika bez galerii dostaje placeholder z kanji.
5. Uruchom `npm run media:manifest`, audyt danych i budowanie, a następnie sprawdź kartę w atlasie oraz na stronie stopnia.

Postawy są przechowywane w kategorii `pozycje` w słowniku (wyświetlana nazwa: „Postawy (dachi)” — `id` pozostaje niezmienione, więc dotychczasowe odnośniki działają), a ich szczegóły w sekcji `stances` pliku `techniqueDetails.json`. Atlas dołącza je do listy automatycznie. Osobne kategorie `ustawienia-dloni` i `ustawienia-stopy` grupują powierzchnie kontaktu dłoni i stóp; mają takie same galerie multimediów jak postawy. Źródła poradników, historii i ciekawostek zapisuj jako obiekty z polami `title` i `url` wskazującym adres HTTPS.

### Ilustracje i wideo

**Techniki publikują wyłącznie filmy** (od 2, bez górnego limitu; wyjątek: `seiken-shita-tsuki` i `yoko-keage` mają po 1 filmie), a **słownik wyłącznie zdjęcia** zapisane lokalnie w `public/images/glossary/` (pojedyncze zdjęcie jest dopuszczalne). W modalu wybierasz ujęcie klikając miniaturę; filmy z nazwami zawierającymi `jodan`/`chudan`/`gedan` są pogrupowane w sekcje „Jōdan — strefa górna", „Chūdan — strefa środkowa" i „Gedan — strefa dolna", a pozostałe trafiają do „Bez strefy". Karty w atlasie i słowniku pokazują tylko pierwszą miniaturę (dla filmu — jego poster), więc nie ładują kilku filmów naraz.

#### Gdzie leżą pliki

Nagrania z dojo są publikowane na **Cloudflare R2**, a nie w `public/`. Dzięki temu repozytorium i `dist/` pozostają małe, a GitHub Pages nie przekracza limitu 1 GB.

```text
media-source/videos/<id>/video/<oryginalny-stem>.mp4   # archiwum lokalne, gitignored
media-build/<id>/video/<stem>.mp4                      # wersja 1080×1920 do uploadu
media-build/<id>/poster/<stem>.jpg                     # klatka z tego samego filmu

R2: <id>/video/<stem>.mp4
    <id>/poster/<stem>.jpg
    <id>/image/<stem>.jpg
```

Folder nazywa się **kanonicznym `id` z `techniques.json` albo `glossary.json`** (np. `seiken-morote-tsuki`, `fudo`, `seiken`). Nie ma osobnych sekcji `techniques`/`stances` — postawy są hasłami słownika. Jeden folder archiwum może zasilać kilka technik: `mawashi-geri-{chudan,jodan}-chusoku-haisoku` rozdziela się na osobne ID `chusoku`/`haisoku` wg tokenu w nazwie pliku, a `uchi-mawashi-geri-jodan` na `jodan-uchi-haisoku-geri` (alias w `scripts/media-map.mjs`). Po ręcznym `mv` nie uruchamiaj `media:organize`. Sufiksy w nazwach plików oznaczają: `f` — widok z przodu, `s` — widok z boku, `d` — detal, `b` — dodatkowe ujęcie, `a` — wariant ujęcia. `scripts/media-map.mjs` wybiera wszystkie ujęcia w kolejności `f1 → s1 → f2 → s2 → …`, wyznacza strefę (`jodan`/`chudan`/`gedan`) z nazwy pliku — bez oznaczenia film trafia do grupy „Bez strefy" — oraz dopisuje do podpisu rozpoznawalny wariant z nazwy pliku (np. `kakato`, `chūsoku`, `haisoku`, `jūji`, `shōtei`, `morote`, `lewa`/`prawa`). Wariant jest zawsze widoczny w `label` i `alt`, także wtedy, gdy nazwa techniki już go zawiera, ale nie podwaja się. Pliki bez pewnego przypisania trafiają do `media-source/videos/_nieprzypisane/` i nie są publikowane.

#### Jak opublikować nagrania z dojo

1. Wrzuć surowe pliki do `public/videos/techniques/` i uruchom `npm run media:organize`. Skrypt przeniesie je do `media-source/videos/<id>/video/` (z poprawieniem oczywistych literówek) i zapisze `media-source/MAPPING.md`. Przy ręcznym `mv` pomiń ten krok — archiwum już jest uporządkowane.
2. Skopiuj [.env.r2.example](.env.r2.example) do `.env.r2` i uzupełnij sekrety: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`. Plik `.env.r2` jest gitignored; zmienne ustawione w środowisku mają pierwszeństwo. Szczegóły w [media-source/README.md](media-source/README.md).
3. Uruchom `npm run media:prepare` (jednolity wymiar 1080×1920, CRF 18 slow, bez audio; postery q:v 2; zdjęcia słownika zostają lokalne w `public/images/glossary/`) i `npm run media:upload`. Przy 324 filmach i 324 posterach daje to 648 obiektów w R2, czyli około 1 GB — daleko poniżej darmowego limitu 10 GB-month, a egress jest bezpłatny.
4. Uruchom `R2_PUBLIC_BASE_URL=https://… npm run media:manifest` — `src/data/media.json` dostanie pełne URL-e, a opisy z poprzedniego manifestu zostaną zachowane. Obrazy słownika zachowują lokalne ścieżki `/images/glossary/…`.
5. Uruchom `npm run media:cleanup` (podgląd), a po weryfikacji `npm run media:cleanup -- --apply` — usunie z R2 klucze nieużywane przez manifest (np. po przeniesieniu filmu lub wycofaniu galerii). Usunięte ID pozostają w `manifest-source.json` jako grupy z pustą listą `items`, żeby cleanup wiedział o ich starych kluczach. Jeśli zmieniła się nazwa folderu bez śladu w manifeście: `npm run media:delete-prefix -- <stare-id>` (podgląd), a potem z `--apply`. Skrypt odmawia usunięcia prefiksu, który nadal jest aktywnym `id`.
6. Sprawdź `npm run media:check`, `npm run media:check-remote` i `npm run check`, po czym wypchnij zmiany.

Alternatywnie uruchom workflow **Upload mediów do R2** z zakładki **Actions** — wykonuje powyższe kroki 3–6 (czyszczenie z `--apply`) i sam commituje `src/data/media.json`. Wymaga tych samych sekretów w ustawieniach repozytorium.

Tryb lokalny pozostaje wsparciem dla istniejących materiałów: bez `R2_PUBLIC_BASE_URL` generator skanuje `public/videos/{techniques,stances,glossary}/` i `public/images/…`. Słownik zawsze czyta zdjęcia z `public/images/glossary/` — postawy z `stances/`, `haishu` z `ustawienia-dloni/`, `kumite` z `trening-komendy/`, a `haito`, `kakato`, `chusoku`, `haisoku`, `teisoku` i `hiza` z `human-parts/`. Grafiki GenAI i nagrania `*-demo.mp4` zostały usunięte.

```json
{
  "techniques": {
    "seiken-morote-tsuki": [
      {
        "type": "video",
        "src": "https://pub-example.r2.dev/seiken-morote-tsuki/video/seiken-morote-tsuki-f1.mp4",
        "label": "Chūdan — widok z przodu 1",
        "poster": "https://pub-example.r2.dev/seiken-morote-tsuki/poster/seiken-morote-tsuki-f1.jpg",
        "alt": "Seiken morote-tsuki na chūdan, widok z boku"
      },
      {
        "type": "video",
        "src": "https://pub-example.r2.dev/seiken-morote-tsuki/video/seiken-morote-tsuki-s1.mp4",
        "label": "Chūdan — widok z boku 1",
        "poster": "https://pub-example.r2.dev/seiken-morote-tsuki/poster/seiken-morote-tsuki-s1.jpg",
        "alt": "Seiken morote-tsuki na chūdan, widok z boku 1"
      }
    ]
  },
  "glossary": {
    "haishu": [
      {
        "type": "image",
        "src": "/images/glossary/ustawienia-dloni/haishu.jpg",
        "label": "Odwrócona dłoń",
        "alt": "Odwrócona dłoń: zdjęcie."
      }
    ]
  }
}
```

Pole `type` (`video` albo `image`) jest obowiązkowe. Pełne URL-e (`https://…`) są przepuszczane przez `resolveMediaSrc()` bez dodawania bazy aplikacji; ścieżki lokalne zaczynają się od `/` i dostają bazę GitHub Pages. `label` to krótka nazwa miniaturki, `alt` to opis dla czytnika ekranu (`aria-label` wideo), a opcjonalny `caption` jest **jedynym widocznym podpisem** pod odtwarzaczem. Informacji o placeholderze nie wpisuj do `label`/`caption` — tylko do `alt`. Generator zachowuje ręczne `label`, `alt`, `caption` i `poster`; podpisy wygenerowane starszą regułą są odtwarzane na nowo, żeby dodać wariant z nazwy pliku. `src/data/media.json` jest **jedynym źródłem mediów technik i haseł słownika** — pola `image`/`video` zostały usunięte z `techniques.json`, a galerie słownika wskazują lokalne pliki. Zdjęcie Hero jest lokalne (`public/images/hero/osu-no-seishin.jpg`) i wskazywane przez bazę aplikacji. Wyjątki od minimum 2 filmów: `seiken-shita-tsuki` i `yoko-keage` (po 1 filmie); słownik może mieć 1 zdjęcie. Opcjonalne pole `zone` (`jodan`/`chudan`/`gedan`) pozwala galerii pogrupować nagrania wg stref.

## Ładowanie danych na żądanie

Pełny `media.json` (342 materiały: 324 filmy i 18 zdjęć słownika) i `techniqueDetails.json` nie są importowane przez aplikację przy starcie. `npm run data:chunks` — uruchamiany automatycznie przed `dev`, `build`, `audit` i `test` — przygotowuje:

- `src/data/media-thumbnails.json` — dla każdej ze 121 technik i 68 haseł tylko `thumbnail` (pierwszy obraz albo poster) i flagę `firstIsVideo`. To jedyne dane mediów w głównym bundle'u; kafelki czytają je przez `getTechniqueCardMedia()` / `getGlossaryCardMedia()`.
- `public/data/techniques/<id>.json` i `public/data/glossary/<id>.json` — pełna galeria `media` i opis `detail` dla jednego wpisu. Pliki są gitignored i trafiają do `dist/data/`.

`src/data/onDemand.ts` pobiera właściwy plik przy otwarciu modalu i cache'uje obietnicę, więc ponowne otwarcie tej samej techniki nie wysyła drugiego zapytania. Najazd lub focus na kafelku podgrzewa cache (`prefetchTechnique` / `prefetchGlossary`). Przy błędzie sieci modal pokazuje opis z `techniques.json`/`glossary.json` i placeholder z kanji zamiast pustej galerii. Deep-linki `#technika-<id>` i `#haslo-<id>` działają bez zmian.

Efekt pomiarowy: główny plik JS zmalał z **582,45 kB / 139,87 kB gzip** do **401,68 kB / 116,59 kB gzip** — ostrzeżenie Vite o chunku >500 kB zniknęło. Filmy i zdjęcia z R2 nadal nie są częścią bundle'u; w `public/data/` są tylko ich adresy i opisy.

## Sprawdzanie zmian

Po zmianach w treści lub kodzie uruchom:

```bash
npm run check
```

`npm run check` to skrót do `npm run audit && npm test && npm run build` — ta sama kolejność, której używa CI. Poszczególne kroki możesz uruchomić osobno, jeśli diagnozujesz konkretny problem.

Audyt sprawdza m.in. identyfikatory technik, wymagane pola, kategorie, referencje między wymaganiami a atlasem, powiązania słownika, kompletność szczegółowych opisów, galerie `media.json` (od 2 elementów, bez górnego limitu, poprawna wartość `zone`, typ, rozszerzenie, folder `video`/`poster`/`image`, istnienie lokalnego pliku albo poprawny URL HTTPS i poster wideo), źródła materiałów edukacyjnych i oznaczenia belek. Zapisuje lub nadpisuje `RAPORT.md` w katalogu głównym. Przy problemach krytycznych kończy się kodem `1`; ostrzeżenia trafiają do raportu i nie powodują błędu polecenia. `npm run media:check-remote` dodatkowo wykonuje HEAD-requesty do zdalnych źródeł — nie jest częścią głównej bramki, żeby CI nie zależał od dostępności R2.

Build sprawdza typy TypeScript i możliwość wygenerowania aplikacji. Testy jednostkowe (Vitest + Testing Library) obejmują m.in. filtrowanie atlasu, routing, modal z obsługą `Esc`, klikalne kategorie słownika oraz galerię `MediaGallery` — w tym to, że komunikat o placeholderze nie jest widocznym podpisem, tylko trafia do `alt`/`aria-label`. Lintowanie pozostaje w zadaniu `P1.4`; action przeglądarkowe nadal sprawdzaj w przeglądarce. Workflow CI wykonuje audyt danych, testy i build przed publikacją.

## Publikacja

### Nagrania (Cloudflare R2)

Filmy nie są częścią artefaktu GitHub Pages. Bucket R2 musi mieć włączony publiczny dostęp (domena `r2.dev` albo własna), a `R2_PUBLIC_BASE_URL` musi zawierać końcowy `/`. Repozytorium przechowuje tylko `src/data/media.json` z pełnymi URL-ami; oryginały (`media-source/`) i wersje 1080p (`media-build/`) są gitignored. Domena `r2.dev` wystarcza do testów; przy większym ruchu warto ją zmienić na własną domenę.

Lokalnie skrypty ładują sekrety z `.env.r2` (wzór: `.env.r2.example`); w GitHub Actions wartości pochodzą z sekretów repozytorium i nadpisują plik. Wymagane nazwy: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`.

Workflow [`.github/workflows/media-upload.yml`](.github/workflows/media-upload.yml) uruchamiasz ręcznie (**Actions → Upload mediów do R2 → Run workflow**). Przygotowuje klipy, wysyła je na R2, odświeża manifest, wykonuje audyt i sprawdzenie URL-i, a następnie commituje `media.json` — to z kolei uruchamia zwykły CI i deploy strony.

### GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) uruchamia się po pushu do `main` lub `master`, dla każdego pull requestu oraz ręcznie przez `workflow_dispatch`. Pull requesty są tylko weryfikowane — job `deploy` jest pomijany, więc nie publikują zmian.

1. W ustawieniach repozytorium wybierz **Settings → Pages → Source → GitHub Actions**.
2. Wypchnij zmiany na jedną z obsługiwanych gałęzi lub uruchom workflow **CI + Deploy to GitHub Pages** z zakładki **Actions**.
3. Odczytaj adres opublikowanej strony z zakończonego wdrożenia. Dla strony projektu ma on postać `https://<USER>.github.io/<REPO>/`.

Kolejność kroków w jobie `build`:

1. `npm ci` — instalacja z blokady zależności.
2. `npm run audit` — spójność danych i istnienie plików galerii; raport `RAPORT.md` jest dołączany jako artifact nawet przy błędzie.
3. `npm test` — testy jednostkowe Vitest.
4. `npm run build` z `VITE_BASE=/<REPO>/`.
5. `cp dist/index.html dist/404.html` — fallback SPA dla GitHub Pages.
6. Sprawdzenie, czy `dist/index.html`, `dist/404.html` i `dist/images/` istnieją. Filmy są ładowane z R2, więc nie muszą być w `dist/`.
7. Tylko dla push/dispatch: konfiguracja Pages, upload artefaktu i deploy. W pull requestach wykonują się kroki 1–6 (bez publishowania).

Jeśli którykolwiek z kroków 2–6 nie przejdzie, job `deploy` się nie uruchomi. Kopia `404.html` umożliwia załadowanie aplikacji przy bezpośrednim wejściu na podstronę, np. `/<REPO>/kyu/9`; odpowiedź serwera GitHub Pages dla takiego wejścia może nadal mieć status HTTP 404.

### Inny hosting i ścieżka bazowa

Wynik budowania to statyczne pliki w `dist/`. Na innym hostingu skonfiguruj przekierowanie wewnętrzne nieznanych ścieżek do `index.html`, aby odświeżenie podstrony działało z `BrowserRouter`.

Domyślna ścieżka bazowa to `/`. Dla publikacji w podkatalogu ustaw `VITE_BASE` podczas budowania, np. w powłoce Bash lub Zsh:

```bash
VITE_BASE=/karate/ npm run build
VITE_BASE=/karate/ npm run preview
```

Konfiguracja Vite odczytuje tę wartość przez `process.env.VITE_BASE`, więc powyższy przykład przekazuje ją bezpośrednio do procesu. Dla hostingu w katalogu głównym lub domeny własnej użyj `/`; w przypadku GitHub Pages dostosuj również wartość w workflow. Router korzysta z tej samej podstawy przez `import.meta.env.BASE_URL`.

Przy zmianie publicznego adresu strony zaktualizuj także `og:url` oraz bezwzględne adresy obrazów `og:image`, `og:image:secure_url` i `twitter:image` w [`index.html`](index.html).

### Podgląd linku w komunikatorach

Metadane podglądu znajdują się w `index.html`, dzięki czemu są dostępne bez uruchamiania JavaScript. Obraz `public/og-image.jpg` ma wymiary 1200 × 630 px. Parametr `v` w jego adresach zawiera pierwsze 8 znaków sumy SHA-256 pliku; po wymianie grafiki zaktualizuj go we wszystkich trzech znacznikach obrazu.

Jeśli podgląd się nie pojawia, sprawdź odpowiedź HTTP strony i obrazu pod adresem z `og:image`. Oba zasoby powinny być publicznie dostępne z kodem 200. Poprawki lokalne muszą zostać opublikowane przez workflow, zanim zobaczy je komunikator. Nowy adres obrazu pozwala odróżnić jego wersje, ale samo jego zmienienie nie gwarantuje ponownego pobrania metadanych strony przez serwis.

Dla Facebooka diagnostykę podglądu można rozpocząć w [Sharing Debugger](https://developers.facebook.com/tools/debug/), podając dokładny adres udostępnianej strony. Odpowiedź serwera z poprawnymi metadanymi nie jest jeszcze potwierdzeniem, że podgląd został odświeżony w konkretnej aplikacji.
