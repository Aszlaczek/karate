# RAPORT.md — audyt danych KIHON

> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: 2026-10-07).
> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`,
> `src/data/index.ts` (CATEGORIES, normalizacja aliasów), `TechniqueIllustration.tsx` (DRAWINGS).

## 1. Integralność struktury

Krytycznych problemów: **0** ✅ (id unikalne, obowiązkowe pola, kategorie ↔ `CATEGORIES`, `levels`∈1–10, `infographic` ↔ `DRAWINGS`, słownik bez martwych `related`, `levels.json` bez duplikatów/pustych pozycji).

Ostrzeżenia (do zadań P0.4 / P1.9): **2**

## 2. Pokrycie stopni

| Stopień | Techniki (`levels[]`) | Pozycje wymagań | Linkowane |
|---|---:|---:|---:|
| 10 kyu (10) | 11 | 7 | 6 |
| 9 kyu (9) | 16 | 8 | 5 |
| 8 kyu (8) | 18 | 7 | 6 |
| 7 kyu (7) | 20 | 8 | 7 |
| 6 kyu (6) | 19 | 5 | 4 |
| 5 kyu (5) | 13 | 7 | 5 |
| 4 kyu (4) | 24 | 6 | 4 |
| 3 kyu (3) | 14 | 6 | 3 |
| 2 kyu (2) | 14 | 6 | 1 |
| 1 kyu (1) | 14 | 6 | 0 |
| bez stopnia (start) | 0 | 6 | 1 |
| 1 dan+ | 0 | 9 | 0 |

Start i dan celowo nie mają technik w atlasie (`levels[]` ∈ 1–10).

## 3. Techniki ↔ stopnie (mismatchy)

Brak mismatchów ✅

Sprawdzane są tylko stopnie kyu (1–10) — `start` i `dan` nie mają technik w atlasie (`levels[]` ∈ 1–10), więc link w ich wymaganiach nie jest rozjazdem danych.

## 4. Kolizje aliasów

- ⚠️ „ippon-kumite-10-kyu" → 2 technik: ippon-kumite-1-10-kyu, ippon-kumite-10-1-kyu
- ⚠️ „kumite-turniejowe" → 7 technik: jiyu-kumite-4-walk-7-kyu, jiyu-kumite-5-walk-6-kyu, jiyu-kumite-6-walk-5-kyu, jiyu-kumite-6-walk-4-kyu, jiyu-kumite-6-walk-3-kyu, jiyu-kumite-8-walk-2-kyu, jiyu-kumite-8-walk-1-kyu

Zadania w `TODO.md`: **P0.4**, **P1.9**.

## 5. Linkowanie wymagań

**42 / 81** pozycji wymagań linkuje do techniki.

Nielinkowane (39) wg powodu:

- **hasło słownika → P1.7** (8):
  - bez stopnia: Ukłon rei przy wejściu
  - bez stopnia: Znaczenie słowa Osu
  - bez stopnia: Seiza i mokuso
  - 9 kyu: Dojo-kun i znaczenie Osu
  - 8 kyu: Podstawy kumite — kamae i dystans
  - 2 kyu: Podstawy bunkai
  - 1 kyu: Interpretacja bunkai
  - 1 dan+: Bunkai i zastosowanie
- **nietechniczne (nie wymaga linku)** (9):
  - bez stopnia: Bezpieczne zachowanie w dojo
  - bez stopnia: Oddychanie i rozgrzewka
  - 10 kyu: Pompki, przysiady, brzuszki
  - 9 kyu: Etykieta oraz bezpieczeństwo dojo
  - 2 kyu: Test siłowy
  - 2 kyu: Wiedza o Kyokushin
  - 1 kyu: Rozbudowany test siłowy
  - 1 dan+: Postawa zgodna z dojo-kun
  - 1 dan+: Test kondycyjny
- **opisowe/zbiorcze (patrz P0.3/P1.7)** (20):
  - 9 kyu: Serie kopnięć bez utraty równowagi
  - 7 kyu: Kumite z partnerem — podstawy
  - 6 kyu: Walki egzaminacyjne — podstawy
  - 5 kyu: Pewne pozycje w ruchu
  - 5 kyu: Walki egzaminacyjne z różnymi partnerami
  - 4 kyu: Kombinacje w ruchu
  - 4 kyu: Kumite z różnymi partnerami
  - 3 kyu: Zaawansowane kombinacje
  - 3 kyu: Kumite z presją czasu
  - 2 kyu: Pełny kihon z komend
  - 2 kyu: Techniki obrotowe i z wyskoku
  - 1 kyu: Zaawansowane kombinacje
  - 1 kyu: Precyzja technik z wyskoku
  - 1 kyu: Seria walk kumite
  - 1 dan+: Precyzyjny kihon
  - 1 dan+: Pełen zakres kata
  - 1 dan+: Dojrzałość w kumite
  - 1 dan+: Pomoc młodszym stopniom
  - 1 dan+: Wymagania organizacji/branch chiefa
  - 1 dan+: Wielorundowe kumite
- **brak w atlasie → P1.6** (2):
  - 3 kyu: Ushiro-mawashi-geri
  - 1 kyu: Saiha, Seienchin

## 6. Media i zdjęcia

- techniki z `image`: 132/132 (unikalnych URL-i: 1, w tym Unsplash: 132) → zadanie **P1.5**
- techniki z `video`: 0/132 (pole zawsze `null` — miejsce na przyszłe filmiki)

## 7. Statystyki technik i aliasów

- technik łącznie: **132**
- technik linkowanych z wymagań: **39**
- aliasów łącznie: **305** (użytych w wymaganiach: 49, nieużywanych: 256)
- haseł słownika: **28** w 3 kategoriach (Strefy: 3, Części ciała: 15, Ustawienia stóp: 10)

## 8. Rekomendacje

1. **P0.4** — rozdzielić alias „Kumite turniejowe" (sekcja 4).
2. **P1.9** — poprawić aliasy krótkie ippon-kumite, kolizja „Ippon kumite 10 kyu" (sekcja 4).
3. **P1.6** — dopisać Saiha / Seienchin / Ushiro-mawashi-geri (sekcja 5, grupa „brak w atlasie").
4. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie wymagań do słownika (sekcja 5).
5. **P1.5** — zdjęcia self-hosted zamiast Unsplash (sekcja 6).
