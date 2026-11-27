# RAPORT.md — audyt danych KIHON

> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: 2026-11-27).
> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`, `media.json`, `techniqueDetails.json`, `learning.json`,
> `src/data/media-thumbnails.json`, `public/data/`, `src/data/index.ts` (CATEGORIES), zawartość `public/images/` (w tym `hero/`).

## 1. Integralność struktury

Krytycznych problemów: **0** ✅ (id unikalne, obowiązkowe pola, kategorie ↔ `CATEGORIES`, `levels`∈0–15, słownik bez martwych `related`, `levels.json`: wymagania strukturalne wskazują istniejące techniki/haseła zgodne z P0.3, belki zgodne z stopniem P0.4).

Ostrzeżenia: **0**

## 2. Pokrycie stopni

| Stopień | Techniki w atlasie | Wymagania: techniki | Wymagania: postawy (slownik) | Wymagania: opisy | Walki |
|---|---:|---:|---:|---:|---:|
| bez stopnia (start) | 0 | 0 | 1 | 5 | — |
| 10 kyu (10) | 9 | 9 | 3 | 0 | 1 |
| 9 kyu (9) | 12 | 12 | 4 | 2 | 2 |
| 8 kyu (8) | 17 | 17 | 2 | 0 | 3 |
| 7 kyu (7) | 17 | 17 | 2 | 0 | 4 |
| 6 kyu (6) | 17 | 17 | 2 | 0 | 5 |
| 5 kyu (5) | 12 | 12 | 1 | 0 | 6 |
| 4 kyu (4) | 21 | 21 | 3 | 0 | 6 |
| 3 kyu (3) | 12 | 12 | 1 | 1 | 6 |
| 2 kyu (2) | 14 | 14 | 0 | 0 | 8 |
| 1 kyu (1) | 14 | 14 | 0 | 0 | 8 |
| 1 dan (dan) | 2 | 2 | 0 | 8 | 10 |
| 2 dan (dan2) | 2 | 2 | 0 | 5 | 12 |
| 3 dan (dan3) | 1 | 1 | 0 | 4 | 12 |
| 4 dan (dan4) | 1 | 1 | 0 | 3 | 15 |
| 5 dan (dan5) | 1 | 1 | 0 | 3 | 15 |

Zakres `levels[]` technik i numerów stopni: 0 (start) – 15 (5 dan).

## 3. Spójność wymagań ↔ atlas (P0.3)

Wszystkie techniki/haseła w wymaganiach mają właściwy stopień w `levels[]`, a każda technika z atlasu występuje w wymaganiach swojego stopnia ✅

## 4. Kolizje aliasów

Brak kolizji ✅ (aliasy to obecnie tylko metadane — aplikacja nie linkuje po aliasach, wymagania to referencje strukturalne).

## 5. Pozycje wymagań bez techniki (typu `text` i `glossary`)

**31 / 202** pozycji to opisy nielinkowane (etykieta, wiedza, próba).
**19 / 202** pozycji to linki do haseł słownika (postawy).

- **bez stopnia** (5): Ukłon rei przy wejściu · Znaczenie słowa Osu · Bezpieczne zachowanie w dojo · Seiza i mokuso · Oddychanie i rozgrzewka
- **9 kyu** (2): Dojo-kun i znaczenie Osu · Etykieta oraz bezpieczeństwo dojo
- **3 kyu** (1): Ushiro-mawashi-geri
- **1 dan** (8): Precyzyjny kihon · Bunkai i zastosowanie · Dojrzałość w kumite · Pomoc młodszym stopniom · Postawa zgodna z dojo-kun · Wymagania organizacji/branch chiefa · Test kondycyjny · Wielorundowe kumite
- **2 dan** (5): Bunkai i interpretacja kata · Doskonałość kihon · Pomoc młodszym stopniom · Wymagania organizacji/branch chiefa · Test kondycyjny
- **3 dan** (4): Rozwój własnego stylu karate · Korekta technik młodszym stopniom · Wymagania organizacji/branch chiefa · Test kondycyjny
- **4 dan** (3): Prowadzenie zajęć jako instruktor · Etyka i dojo-kun w praktyce · Wymagania organizacji/branch chiefa
- **5 dan** (3): Mentoring kolejnych stopni · Prezentacja karate jako sztuki · Wymagania organizacji/branch chiefa

- **bez stopnia** (1): fudo
- **10 kyu** (3): yoi, fudo, zenkutsu-dachi
- **9 kyu** (4): fudo, sanchin-dachi, kokutsu, musubi
- **8 kyu** (2): sanchin-dachi, kiba
- **7 kyu** (2): kokutsu, neko-ashi
- **6 kyu** (2): kiba, tsuru-ashi
- **5 kyu** (1): moro-ashi
- **4 kyu** (3): heisoku, heiko, uchi-hachiji
- **3 kyu** (1): kake


Z tego braki w atlasie do zadania **P1.6**: „Ushiro-mawashi-geri".

## 6. Media i zdjęcia

- martwe pola `image`/`video` w `techniques.json`: **0/121** ✅ (media wyłącznie w `media.json`)
- zdjęcie Hero: **lokalne `public/images/hero/osu-no-seishin.jpg`**; obrazy Unsplash w `src/`: **0**
- techniki bez galerii (placeholder z kanji): **32/121**
- galerie w `media.json`: **106** (techniki: 89, hasła słownika: 17)
- materiały w galeriach: **342** (filmy technik: 324, zdjęcia słownika: 18) — techniki od 2 filmów, bez górnego limitu (wyjątek: 2 techniki z 1 filmem); słownik wyłącznie obrazy lokalne, również pojedyncze; pliki w R2 albo w `public/`
- dane na żądanie: **189** plików w `public/data/` (techniki: 121, hasła: 68); kafelki czytają tylko `media-thumbnails.json`, galerie i opisy wchodzą do bundle'u dopiero po otwarciu wpisu

## 7. Statystyki

- poradniki: **4**, wydarzenia historyczne: **6**, ciekawostki: **6** (kompletność treści i źródeł sprawdzona)
- szczegóły technik: **121/121**, szczegóły postaw: **15/15** (tłumaczenie, wszystkie człony nazwy, minimum dwie sekcje)
- stopni: **16** (start, 10–1 kyu, 1–5 dan)
- technik łącznie: **121**
- technik powiązanych z wymaganiami: **121** (poza wymaganiami: 0)
- haseł słownika w wymaganiach: **14**
- aliasów łącznie: **272** (kolizje: 0)
- haseł słownika: **68** w 8 kategoriach (Strefy: 3, Części ciała: 11, Postawy (dachi): 15, Ustawienia dłoni: 10, Ustawienia stóp: 6, Dojo i etykieta: 8, Trening i komendy: 10, Strój i sprzęt: 5)

## 8. Rekomendacje

1. **P1.6** — dopisać do atlasu Seienchin i Ushiro-mawashi-geri (sekcja 5).
2. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie opisów wymagań do słownika (sekcja 5); infrastruktura `{type:"glossary"}` gotowa.
3. **P1.1** — weryfikacja treści 16 stopni ze sensei (nazwy, zakres, staż, liczby walk).
