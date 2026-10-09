# RAPORT.md — audyt danych KIHON

> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: 2026-10-09).
> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`,
> `src/data/index.ts` (CATEGORIES), `src/features/technique/data/genaiImages.json`.

## 1. Integralność struktury

Krytyczne problemy: **2**

- ❌ P0.3 — "gekisai-sho" (levels=[12]) wymagane w 2 kyu, których nie ma w levels[]
- ❌ P0.3 — "saiha" (levels=[11]) wymagane w 1 kyu, których nie ma w levels[]

Ostrzeżenia: **0**

## 2. Pokrycie stopni

| Stopień | Techniki w atlasie | Wymagania: techniki | Wymagania: postawy (slownik) | Wymagania: opisy | Walki |
|---|---:|---:|---:|---:|---:|
| bez stopnia (start) | 0 | 0 | 1 | 5 | — |
| 10 kyu (10) | 8 | 8 | 3 | 0 | 1 |
| 9 kyu (9) | 12 | 12 | 4 | 2 | 2 |
| 8 kyu (8) | 16 | 16 | 2 | 0 | 3 |
| 7 kyu (7) | 17 | 17 | 2 | 0 | 4 |
| 6 kyu (6) | 16 | 16 | 2 | 0 | 5 |
| 5 kyu (5) | 11 | 11 | 1 | 0 | 6 |
| 4 kyu (4) | 20 | 20 | 3 | 0 | 6 |
| 3 kyu (3) | 12 | 12 | 1 | 1 | 6 |
| 2 kyu (2) | 13 | 14 | 0 | 0 | 8 |
| 1 kyu (1) | 13 | 14 | 0 | 0 | 8 |
| 1 dan (dan) | 2 | 2 | 0 | 8 | 10 |
| 2 dan (dan2) | 2 | 2 | 0 | 5 | 12 |
| 3 dan (dan3) | 1 | 1 | 0 | 4 | 12 |
| 4 dan (dan4) | 1 | 1 | 0 | 3 | 15 |
| 5 dan (dan5) | 1 | 1 | 0 | 3 | 15 |

Zakres `levels[]` technik i numerów stopni: 0 (start) – 15 (5 dan).

## 3. Spójność wymagań ↔ atlas (P0.3)

**Mismatches: 2** (krytyczne, sekcja 1).

## 4. Kolizje aliasów

Brak kolizji ✅ (aliasy to obecnie tylko metadane — aplikacja nie linkuje po aliasach, wymagania to referencje strukturalne).

## 5. Pozycje wymagań bez techniki (typu `text` i `glossary`)

**31 / 197** pozycji to opisy nielinkowane (etykieta, wiedza, próba).
**19 / 197** pozycji to linki do haseł słownika (postawy).

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

- techniki z `image`: 118/118 (unikalnych URL-i: 1, w tym Unsplash: 118) → zadanie **P1.5**
- techniki z `video`: 0/118 (pole zawsze `null` — miejsce na przyszłe filmiki)
- techniki z tymczasowym zdjęciem GenAI: **82/118** (mapa `genaiImages.json`), bez zdjęcia → placeholder z kanji: 36

## 7. Statystyki

- stopni: **16** (start, 10–1 kyu, 1–5 dan)
- technik łącznie: **118**
- technik powiązanych z wymaganiami: **118** (poza wymaganiami: 0)
- haseł słownika w wymaganiach: **14**
- aliasów łącznie: **267** (kolizje: 0)
- haseł słownika: **33** w 3 kategoriach (Strefy: 3, Części ciała: 15, Ustawienia stóp: 15)

## 8. Rekomendacje

1. **P1.6** — dopisać do atlasu Seienchin i Ushiro-mawashi-geri (sekcja 5).
2. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie opisów wymagań do słownika (sekcja 5); infrastruktura `{type:"glossary"}` gotowa.
3. **P1.5** — zdjęcia self-hosted zamiast Unsplash (sekcja 6).
4. **P1.1** — weryfikacja treści 16 stopni ze sensei (nazwy, zakres, staż, liczby walk).
