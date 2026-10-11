# Widoki szczegółowe atlasu — 2026-10-11

## Zakres

118 technik i 15 postaw ma szczegóły w `src/data/techniqueDetails.json`.
To rozszerzenie istniejących modali, dostępne z kart, wymagań egzaminacyjnych
oraz dotychczasowych adresów `#technika-<id>` i `#haslo-<id>`.
Nie zmieniono identyfikatorów, przypisań stopni, plików mediów ani programu.

Każdy wpis zawiera:

- `translation` — polskie znaczenie całej nazwy;
- `nameParts` — wszystkie człony tytułu w kolejności, z objaśnieniem po polsku;
- `sections` — co najmniej dwie sekcje właściwe dla techniki lub postawy;
- `note` — opcjonalne objaśnienie niejednoznacznego zapisu.

Człony nazw są jednostkami znaczeniowymi, nie mechanicznym rozcięciem kanji.
Objaśnienia złożeń (np. morote, chūdan, taikyoku) podają także ich składniki.
Rozróżniono `uchi` jako uderzenie i wnętrze, `geri`/`keri`, `barai`/`harai`,
numery ćwiczeń oraz nie-japońskie oznaczenia wariantów. Nazwy kata przekazane
przez tradycję okinawską są objaśnione jako nazwy tradycyjne, bez wymyślania
japońskiej etymologii.

## Źródła i sposób opracowania

Punktem wyjścia były treści projektu oraz polskie objaśnienia ruchu przygotowane
na ich podstawie. Podczas sprawdzania nazw wykorzystano:

- [USA-IFK — Kyokushin Kata](https://uskyokushin.com/kyokushin-kata/):
  tradycyjne znaczenia nazw kata, zwłaszcza Garyū i Sushiho.
- [Kyokushin Argentina — Terminología](https://kyokushin.com.ar/kyokushin/tecnica/terminologia/):
  nazwy powierzchni i kierunków (wyniki wyszukiwania; pełna strona była niedostępna).
- [Jasielski Klub Karate Kyokushin — Słownik](https://www.kyokushin-jaslo.pl/slownik/):
  zapis połączonego uchi-uke / gedan-barai (wynik wyszukiwania).

Sprawdzenie źródeł: 2026-10-11. Tłumaczenie dosłowne nie zastępuje interpretacji
technicznej właściwej dla konkretnego dojo. Nie dopisano nieudokumentowanych
pełnych sekwencji kata, renraku ani układów kumite; widoki jasno określają ich
zakres i informują, jakie szczegóły trzeba uzgodnić z instruktorem.

## Nazwy wymagające dalszej weryfikacji (P1.11)

- `heisoku-mawashi-uchi-keage`: heisoku oznacza złączone stopy; nie należy
  utożsamiać go z haisoku (podbicie) ani sokutō (krawędź stopy).
- `mae-chusoku-kaage`: zapis kaage wobec standardowego keage.
- `gariyu`: zapis 我流 w bazie oznacza własny styl, podczas gdy kata Garyū
  objaśnia się jako 臥竜 — leżący smok.
- `sushiho`: zapis 捌子 w bazie nie odpowiada tradycyjnemu 五十四歩 — 54 kroki.
- `saiha`: różne znaki 細破 / 最破, niejednakowe tłumaczenia dosłowne.
- `yantsu`: niejednoznaczna etymologia nazwy własnej; odróżnić interpretację
  tradycyjną od znaczenia poszczególnych znaków 安三.
- `seishin`: potwierdzić, jaką konkretnie formę określa ten program.
- `morote-uchi-uke-gedan-barai`: potwierdzić, czy zapis oznacza łączony blok,
  czy dwie pozycje programu.

Uwagi są widoczne przy odpowiednich technikach. Oryginalne nazwy i kanji
pozostawiono, aby nie zmieniać samodzielnie danych programu egzaminacyjnego.
Krótkie opisy na kartach nadal pochodzą z oryginalnych plików — ich całościowa
korekta powinna odbyć się przy przeglądzie P1.1/P1.11.

## Utrzymanie

Komponent `TechniqueDetailContent` służy zarówno technikom, jak i postawom.
Dane należy pobierać przez `getTechniqueDetail` / `getStanceDetail` z `@/data`.
Nowa pozycja atlasu wymaga nowego wpisu szczegółów. Audyt wykrywa brak wpisu,
puste tłumaczenie, niepełne człony nazwy (także ich kolejność), brak sekcji
oraz wpisy osierocone po usunięciu techniki. Zmiana tytułu wymaga aktualizacji
`nameParts`. Dla postaw źródłem nazwy do podziału jest `reading`.

Audyt nadal ujawnia dwa istniejące błędy P0.3: `gekisai-sho` nie ma 2 kyu
w `levels[]`, a `saiha` nie ma 1 kyu. W tym zadaniu nie zmieniano przypisań.
