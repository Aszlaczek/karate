# RAPORT.md — audyt danych KIHON

> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: 2026-10-08).
> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`,
> `src/data/index.ts` (CATEGORIES), `src/features/technique/data/genaiImages.json`.

## 1. Integralność struktury

Krytyczne problemy: **2**

- ❌ P0.3 — "gekisai-sho" (levels=[12]) wymagane w 2 kyu, których nie ma w levels[]
- ❌ P0.3 — "saiha" (levels=[11]) wymagane w 1 kyu, których nie ma w levels[]

Ostrzeżenia: **0**

## 2. Pokrycie stopni

| Stopień | Techniki w atlasie | Wymagania: techniki | Wymagania: opisy | Walki |
|---|---:|---:|---:|---:|
| bez stopnia (start) | 1 | 1 | 5 | — |
| 10 kyu (10) | 11 | 11 | 1 | 1 |
| 9 kyu (9) | 16 | 16 | 2 | 2 |
| 8 kyu (8) | 18 | 18 | 1 | 3 |
| 7 kyu (7) | 19 | 19 | 1 | 4 |
| 6 kyu (6) | 18 | 18 | 0 | 5 |
| 5 kyu (5) | 12 | 12 | 0 | 6 |
| 4 kyu (4) | 23 | 23 | 1 | 6 |
| 3 kyu (3) | 13 | 13 | 2 | 6 |
| 2 kyu (2) | 13 | 14 | 3 | 8 |
| 1 kyu (1) | 13 | 14 | 3 | 8 |
| 1 dan (dan) | 2 | 2 | 8 | 10 |
| 2 dan (dan2) | 2 | 2 | 5 | 12 |
| 3 dan (dan3) | 1 | 1 | 4 | 12 |
| 4 dan (dan4) | 1 | 1 | 3 | 15 |
| 5 dan (dan5) | 1 | 1 | 3 | 15 |

Zakres `levels[]` technik i numerów stopni: 0 (start) – 15 (5 dan).

## 3. Spójność wymagań ↔ atlas (P0.3)

**Mismatches: 2** (krytyczne, sekcja 1).

## 4. Kolizje aliasów

Brak kolizji ✅ (aliasy to obecnie tylko metadane — aplikacja nie linkuje po aliasach, wymagania to referencje strukturalne).

## 5. Pozycje wymagań bez techniki (typu `text`)

**42 / 208** pozycji to opisy nielinkowane (etykieta, wiedza, próba).

- **bez stopnia** (5): Ukłon rei przy wejściu · Znaczenie słowa Osu · Bezpieczne zachowanie w dojo · Seiza i mokuso · Oddychanie i rozgrzewka
- **10 kyu** (1): Pompki, przysiady, brzuszki
- **9 kyu** (2): Dojo-kun i znaczenie Osu · Etykieta oraz bezpieczeństwo dojo
- **8 kyu** (1): Podstawy kumite — kamae i dystans
- **7 kyu** (1): Kumite z partnerem — podstawy
- **4 kyu** (1): Kumite z różnymi partnerami
- **3 kyu** (2): Ushiro-mawashi-geri · Kumite z presją czasu
- **2 kyu** (3): Podstawy bunkai · Test siłowy · Wiedza o Kyokushin
- **1 kyu** (3): Seienchin · Interpretacja bunkai · Rozbudowany test siłowy
- **1 dan** (8): Precyzyjny kihon · Bunkai i zastosowanie · Dojrzałość w kumite · Pomoc młodszym stopniom · Postawa zgodna z dojo-kun · Wymagania organizacji/branch chiefa · Test kondycyjny · Wielorundowe kumite
- **2 dan** (5): Bunkai i interpretacja kata · Doskonałość kihon · Pomoc młodszym stopniom · Wymagania organizacji/branch chiefa · Test kondycyjny
- **3 dan** (4): Rozwój własnego stylu karate · Korekta technik młodszym stopniom · Wymagania organizacji/branch chiefa · Test kondycyjny
- **4 dan** (3): Prowadzenie zajęć jako instruktor · Etyka i dojo-kun w praktyce · Wymagania organizacji/branch chiefa
- **5 dan** (3): Mentoring kolejnych stopni · Prezentacja karate jako sztuki · Wymagania organizacji/branch chiefa


Z tego braki w atlasie do zadania **P1.6**: „Ushiro-mawashi-geri", „Seienchin".

## 6. Media i zdjęcia

- techniki z `image`: 132/132 (unikalnych URL-i: 1, w tym Unsplash: 132) → zadanie **P1.5**
- techniki z `video`: 0/132 (pole zawsze `null` — miejsce na przyszłe filmiki)
- techniki z tymczasowym zdjęciem GenAI: **96/132** (mapa `genaiImages.json`), bez zdjęcia → placeholder z kanji: 36

## 7. Statystyki

- stopni: **16** (start, 10–1 kyu, 1–5 dan)
- technik łącznie: **132**
- technik powiązanych z wymaganiami: **132** (poza wymaganiami: 0)
- aliasów łącznie: **283** (kolizje: 0)
- haseł słownika: **28** w 3 kategoriach (Strefy: 3, Części ciała: 15, Ustawienia stóp: 10)

## 8. Rekomendacje

1. **P1.6** — dopisać do atlasu Seienchin i Ushiro-mawashi-geri (sekcja 5).
2. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie opisów wymagań do słownika (sekcja 5).
3. **P1.5** — zdjęcia self-hosted zamiast Unsplash (sekcja 6).
4. **P1.1** — weryfikacja treści 16 stopni ze sensei (nazwy, zakres, staż, liczby walk).
