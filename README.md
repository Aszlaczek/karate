# KIHON — droga do egzaminu

Polskojęzyczny przewodnik po karate Kyokushin, który pomaga uporządkować przygotowania do egzaminu i zrozumieć nazwy używane na treningu. Łączy wymagania na poszczególne stopnie z atlasem technik, słownikiem japońskich pojęć oraz praktycznymi poradnikami.

Aplikacja działa w przeglądarce jako SPA (Single Page Application). Treści są przechowywane w plikach JSON i dołączane podczas budowania projektu. Uruchomienie nie wymaga backendu, bazy danych, kont użytkowników ani kluczy API.

## Funkcje

- **Ścieżka stopni:** poziom początkujący, 10–1 kyu oraz 1–5 dan. Każdy stopień ma oznaczenie pasa i belek, opis, staż, wymagania egzaminacyjne oraz przypisane techniki.
- **Atlas technik:** wyszukiwanie po nazwie, zapisie japońskim, wymowie i opisie oraz filtrowanie według kategorii i stopnia. Kategorie obejmują uderzenia, kopnięcia, bloki, pozycje, kumite i kata.
- **Szczegóły technik i postaw:** polskie znaczenie nazwy, tłumaczenie jej członów, opisy wykonania i ilustracje. Wymagania egzaminacyjne prowadzą bezpośrednio do odpowiednich kart.
- **Słownik karate:** strefy ciała, powierzchnie uderzające, postawy, etykieta dojo, komendy treningowe oraz strój i sprzęt. Hasła zawierają zapis japoński, wymowę, objaśnienie i powiązania z technikami.
- **Poradniki:** wiązanie pasa, składanie karategi, zakładanie taśm na dłonie i wiązanie troczków stroju — instrukcje krok po kroku z odnośnikami do źródeł.
- **Historia i ciekawostki:** oś czasu karate i Kyokushin oraz krótkie artykuły z bibliografią.
- **Dojo-kun:** przysięga dojo w zapisie japońskim, z wymową i polskim tłumaczeniem, dostępna na stronie głównej.
- **Zgłaszanie pomysłów i poprawek:** formularz przygotowuje wiadomość w programie pocztowym przez `mailto:` albo pozwala skopiować jej treść. Użytkownik wysyła wiadomość we własnej poczcie.

Obecna baza zawiera **16 poziomów, 118 technik, 56 haseł słownika w 6 kategoriach (w tym 15 postaw), 4 poradniki, 6 wydarzeń historycznych i 6 ciekawostek**.

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
├── .github/workflows/deploy.yml   # Publikacja na GitHub Pages
├── public/                       # Favicon, obraz podglądu i ilustracje
├── scripts/audit-danych.mjs       # Audyt spójności treści
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
| [`src/features/technique/data/genaiImages.json`](src/features/technique/data/genaiImages.json) | Mapa identyfikatorów technik na ścieżki ilustracji. |
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
4. Jeśli dodajesz ilustrację, zapisz ją w `public/images/` i uzupełnij mapę `genaiImages.json`.
5. Uruchom audyt danych i budowanie, a następnie sprawdź kartę w atlasie oraz na stronie stopnia.

Postawy są przechowywane w kategorii `pozycje` w słowniku, a ich szczegóły w sekcji `stances` pliku `techniqueDetails.json`. Atlas dołącza je do listy automatycznie. Źródła poradników, historii i ciekawostek zapisuj jako obiekty z polami `title` i `url` wskazującym adres HTTPS.

### Ilustracje i wideo

Komponent `TechniqueIllustration` wybiera najpierw materiał z pola `video`, następnie ilustrację z mapy `genaiImages.json`, a przy jej braku pokazuje zapis japoński i wymowę. Pole `image` w rekordzie techniki nie jest obecnie używane przez ten mechanizm. Ścieżki zaczynające się od `/` są dostosowywane do ścieżki bazowej aplikacji.

Obrazy technik znajdują się głównie w `public/images/GenAI/`. Obsługa materiałów YouTube i lokalnych plików wideo jest zaimplementowana, ale obecna baza ma wszystkie pola `video` ustawione na `null`.

## Sprawdzanie zmian

Po zmianach w treści lub kodzie uruchom:

```bash
npm run audit
npm run build
```

Audyt sprawdza m.in. identyfikatory technik, wymagane pola, kategorie, referencje między wymaganiami a atlasem, powiązania słownika, kompletność szczegółowych opisów, źródła materiałów edukacyjnych i oznaczenia belek. Zapisuje lub nadpisuje `RAPORT.md` w katalogu głównym. Przy problemach krytycznych kończy się kodem `1`; ostrzeżenia trafiają do raportu i nie powodują błędu polecenia.

Build sprawdza typy TypeScript i możliwość wygenerowania aplikacji. Projekt nie ma obecnie skryptów testów jednostkowych, E2E ani lintowania. Działanie wyszukiwania, filtrów, okien szczegółów i układu mobilnego sprawdzaj w przeglądarce. Workflow publikacji uruchamia build, ale nie wykonuje audytu danych.

## Publikacja

### GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) uruchamia się po pushu do `main` lub `master`, a także ręcznie przez `workflow_dispatch`.

1. W ustawieniach repozytorium wybierz **Settings → Pages → Source → GitHub Actions**.
2. Wypchnij zmiany na jedną z obsługiwanych gałęzi lub uruchom workflow **Deploy to GitHub Pages** z zakładki **Actions**.
3. Odczytaj adres opublikowanej strony z zakończonego wdrożenia. Dla strony projektu ma on postać `https://<USER>.github.io/<REPO>/`.

Workflow instaluje zależności przez `npm ci`, buduje aplikację z `VITE_BASE=/<REPO>/`, kopiuje `dist/index.html` do `dist/404.html` i publikuje katalog `dist/`. Kopia `404.html` umożliwia załadowanie aplikacji przy bezpośrednim wejściu na podstronę, np. `/<REPO>/kyu/9`; odpowiedź serwera GitHub Pages dla takiego wejścia może nadal mieć status HTTP 404.

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
