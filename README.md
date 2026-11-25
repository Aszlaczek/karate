# KIHON — droga do egzaminu

[![CI + Deploy to GitHub Pages](https://github.com/Aszlaczek/web_karate/actions/workflows/deploy.yml/badge.svg)](https://github.com/Aszlaczek/web_karate/actions/workflows/deploy.yml)

Polskojęzyczny przewodnik po karate Kyokushin, który pomaga uporządkować przygotowania do egzaminu i zrozumieć nazwy używane na treningu. Łączy wymagania na poszczególne stopnie z atlasem technik, słownikiem japońskich pojęć oraz praktycznymi poradnikami.

Aplikacja działa w przeglądarce jako SPA (Single Page Application). Treści są przechowywane w plikach JSON i dołączane podczas budowania projektu. Uruchomienie nie wymaga backendu, bazy danych, kont użytkowników ani kluczy API.

## Funkcje

- **Ścieżka stopni:** poziom początkujący, 10–1 kyu oraz 1–5 dan. Każdy stopień ma oznaczenie pasa i belek, opis, staż, wymagania egzaminacyjne oraz przypisane techniki.
- **Atlas technik:** wyszukiwanie po nazwie, zapisie japońskim, wymowie i opisie oraz filtrowanie według kategorii i stopnia. Kategorie obejmują uderzenia, kopnięcia, bloki, pozycje, kumite i kata.
- **Szczegóły technik i postaw:** polskie znaczenie nazwy, tłumaczenie jej członów, opisy wykonania oraz galerie 2–4 filmów i zdjęć z wyborem ujęcia i filtrem „Filmy / Zdjęcia”. Wymagania egzaminacyjne prowadzą bezpośrednio do odpowiednich kart.
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
| `npm run media:prepare` | Wybiera do 4 ujęć na wpis, transkoduje je do 1080×1920 (CRF 18 slow, bez audio) i robi postery/klatki JPEG q:v 2 w `media-build/`. |
| `npm run media:upload` | Wysyła przygotowane pliki do Cloudflare R2 (czyta sekrety z `.env.r2` lub środowiska, 3 próby na plik). |
| `npm run media:check-remote` | Sprawdza HEAD-requestami wszystkie zdalne URL-e z `media.json`. |
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
├── media-build/                       # Przygotowane klipy 480p (gitignored)
├── public/                            # Favicon, obraz podglądu i starsze media
│   └── images/{techniques,stances,glossary}/  # Fallback i lokalne zdjęcia
├── scripts/audit-danych.mjs           # Audyt spójności treści i plików galerii
├── scripts/generate-media.mjs         # Generator manifestu (R2 albo lokalny)
├── src/
│   ├── app/                      # Definicje tras i obsługa okien szczegółów
│   ├── components/ui/            # Wspólne elementy interfejsu
│   ├── data/                     # Treści JSON, typy i funkcje dostępu do danych
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

Moduły w `src/features/` obejmują stronę główną, nawigację, stopnie, techniki, słownik, dojo-kun, materiały edukacyjne i kontakt. Alias `@/` wskazuje na katalog `src/`. Treści są pobierane przez funkcje z `src/data/index.ts` i `src/data/learning.ts`; filtrowanie odbywa się w przeglądarce.

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
| [`src/data/media.json`](src/data/media.json) | Galerie 2–4 filmów/zdjęć technik i haseł słownika (także postaw). |
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

Każda technika, postawa oraz hasło „Ustawienia dłoni/stóp” może mieć **galerię 2–4 materiałów** — filmów, zdjęć albo obu typów naraz. W modalu wybierasz ujęcie klikając miniaturę; każda miniatura ma wyraźną etykietę „▶ Film” albo „▣ Zdjęcie”, a przy miksie typów pojawia się filtr „Wszystkie / Filmy / Zdjęcia”. Karty w atlasie i słowniku pokazują tylko pierwszą miniaturę (dla filmu — jego poster), więc nie ładują kilku filmów naraz.

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

Folder nazywa się **kanonicznym `id` z `techniques.json` albo `glossary.json`** (np. `seiken-morote-tsuki`, `fudo`, `seiken`). Nie ma osobnych sekcji `techniques`/`stances` — postawy są hasłami słownika. Sufiksy w nazwach plików oznaczają: `f` — widok z przodu, `s` — widok z boku, `d` — detal, `b` — dodatkowe ujęcie, `a` — wariant ujęcia. `scripts/media-map.mjs` wybiera do 4 ujęć w kolejności `f1 → s1 → f2 → s2 → …`. Pliki bez pewnego przypisania trafiają do `media-source/videos/_nieprzypisane/` i nie są publikowane.

#### Jak opublikować nagrania z dojo

1. Wrzuć surowe pliki do `public/videos/techniques/` i uruchom `npm run media:organize`. Skrypt przeniesie je do `media-source/videos/<id>/video/` (z poprawieniem oczywistych literówek) i zapisze `media-source/MAPPING.md`.
2. Skopiuj [.env.r2.example](.env.r2.example) do `.env.r2` i uzupełnij sekrety: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`. Plik `.env.r2` jest gitignored; zmienne ustawione w środowisku mają pierwszeństwo. Szczegóły w [media-source/README.md](media-source/README.md).
3. Uruchom `npm run media:prepare` (jednolity wymiar 1080×1920, CRF 18 slow, bez audio; postery i klatki q:v 2; zdjęcia samodzielne kopiowane bez rekompresji z lokalnych oryginałów 1448×1086) i `npm run media:upload`. Przy 276 filmach i 291 obrazach daje to około 882 MB w R2 — daleko poniżej darmowego limitu 10 GB-month, a egress jest bezpłatny.
4. Uruchom `R2_PUBLIC_BASE_URL=https://… npm run media:manifest` — `src/data/media.json` dostanie pełne URL-e, a opisy z poprzedniego manifestu zostaną zachowane.
5. Uruchom `npm run media:cleanup` (podgląd), a po weryfikacji `npm run media:cleanup -- --apply` — usunie z R2 klucze nieużywane przez manifest (np. po przeniesieniu filmu).
6. Sprawdź `npm run media:check`, `npm run media:check-remote` i `npm run check`, po czym wypchnij zmiany.

Alternatywnie uruchom workflow **Upload mediów do R2** z zakładki **Actions** — wykonuje powyższe kroki 3–6 (czyszczenie z `--apply`) i sam commituje `src/data/media.json`. Wymaga tych samych sekretów w ustawieniach repozytorium.

Tryb lokalny pozostaje wsparciem dla istniejących materiałów: bez `R2_PUBLIC_BASE_URL` generator skanuje `public/videos/{techniques,stances,glossary}/` i `public/images/…`. Postawy czytają zdjęcia z `public/images/glossary/stances/`, a `haito`, `kakato`, `chusoku`, `haisoku`, `teisoku` i `hiza` z `public/images/glossary/human-parts/`. Grafiki GenAI i nagrania `*-demo.mp4` zostały usunięte.

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
        "type": "image",
        "src": "https://pub-example.r2.dev/seiken-morote-tsuki/image/seiken-morote-tsuki-ilustracja.jpg",
        "label": "Ułożenie pięści",
        "alt": "Zbliżenie na ułożenie obu pięści"
      }
    ]
  }
}
```

Pole `type` (`video` albo `image`) jest obowiązkowe. Pełne URL-e (`https://…`) są przepuszczane przez `resolveMediaSrc()` bez dodawania bazy aplikacji; ścieżki lokalne zaczynają się od `/` i dostają bazę GitHub Pages. `label` to krótka nazwa miniaturki, `alt` to opis dla czytnika ekranu (`aria-label` wideo), a opcjonalny `caption` jest **jedynym widocznym podpisem** pod odtwarzaczem. Generator zachowuje ręczne `label`, `alt`, `caption` i `poster`. Pole `video` w `techniques.json` jest mechanizmem awaryjnym; galeria z `media.json` ma zawsze priorytet. Wyjątki od reguły 2–4 elementów: cztery techniki z jednym filmem oraz `seiken` z jednym zdjęciem pięści.

## Sprawdzanie zmian

Po zmianach w treści lub kodzie uruchom:

```bash
npm run check
```

`npm run check` to skrót do `npm run audit && npm test && npm run build` — ta sama kolejność, której używa CI. Poszczególne kroki możesz uruchomić osobno, jeśli diagnozujesz konkretny problem.

Audyt sprawdza m.in. identyfikatory technik, wymagane pola, kategorie, referencje między wymaganiami a atlasem, powiązania słownika, kompletność szczegółowych opisów, galerie `media.json` (2–4 elementy, typ, rozszerzenie, folder `video`/`poster`/`image`, istnienie lokalnego pliku albo poprawny URL HTTPS i poster wideo), źródła materiałów edukacyjnych i oznaczenia belek. Zapisuje lub nadpisuje `RAPORT.md` w katalogu głównym. Przy problemach krytycznych kończy się kodem `1`; ostrzeżenia trafiają do raportu i nie powodują błędu polecenia. `npm run media:check-remote` dodatkowo wykonuje HEAD-requesty do zdalnych źródeł — nie jest częścią głównej bramki, żeby CI nie zależał od dostępności R2.

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
