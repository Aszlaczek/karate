# RAPORT.md — audyt danych KIHON

> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: 2026-10-06).
> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`,
> `src/data/index.ts` (CATEGORIES, normalizacja aliasów), `TechniqueIllustration.tsx` (DRAWINGS).

## 1. Integralność struktury

Krytycznych problemów: **0** ✅ (id unikalne, obowiązkowe pola, kategorie ↔ `CATEGORIES`, `levels`∈1–10, `infographic` ↔ `DRAWINGS`, słownik bez martwych `related`, `levels.json` bez duplikatów/pustych pozycji).

Ostrzeżenia (do zadań P0.3 / P0.4): **32**

## 2. Pokrycie stopni

| Stopień | Techniki (`levels[]`) | Pozycje wymagań | Linkowane |
|---|---:|---:|---:|
| 10 kyu (10) | 10 | 7 | 6 |
| 9 kyu (9) | 12 | 8 | 5 |
| 8 kyu (8) | 12 | 7 | 6 |
| 7 kyu (7) | 14 | 8 | 7 |
| 6 kyu (6) | 15 | 5 | 4 |
| 5 kyu (5) | 10 | 7 | 5 |
| 4 kyu (4) | 21 | 6 | 4 |
| 3 kyu (3) | 11 | 6 | 3 |
| 2 kyu (2) | 14 | 6 | 1 |
| 1 kyu (1) | 14 | 6 | 0 |
| bez stopnia (start) | 0 | 6 | 1 |
| 1 dan+ | 0 | 9 | 0 |

Start i dan celowo nie mają technik w atlasie (`levels[]` ∈ 1–10).

## 3. Techniki ↔ stopnie (mismatchy)

**31 mismatchów** — technika linkowana w wymaganiach stopnia, którego nie ma w jej `levels[]` (audyt trafień = ta sama logika co `RequirementsPanel`):

| Wymagania | Technika | `levels[]` |
|---|---|---|
| bez stopnia — Pozycja fudo-dachi | Fudō dachi | [10] |
| 10 kyu — Taikyoku Sono Ichi | Taikyoku sono ichi | [9] |
| 9 kyu — Pewne fudo-dachi i przejścia | Fudō dachi | [10] |
| 9 kyu — Seiken chudan oi-zuki z rotacją bioder | Seiken oi-tsuki | [10] |
| 9 kyu — Czyste jodan-uke i gedan-barai | Seiken jōdan uke | [10] |
| 9 kyu — Czyste jodan-uke i gedan-barai | Seiken gedan-barai | [10] |
| 8 kyu — Sanchin-dachi | Sanchin dachi | [9] |
| 8 kyu — Soto-uke | Seiken chūdan soto-uke | [9] |
| 8 kyu — Uraken shomen-uchi | Uraken shōmen-uchi | [6] |
| 8 kyu — Mawashi-geri gedan/chudan | Mawashi-geri chūdan (chūsoku, haisoku) | [5] |
| 8 kyu — Yoko-geri | Yoko-geri chūdan | [6] |
| 8 kyu — Taikyoku Sono Ni | Taikyoku sono ni | [9] |
| 7 kyu — Kokutsu-dachi | Kokutsu dachi | [9] |
| 7 kyu — Uchi-uke i zestawy obronne | Seiken chūdan uchi-uke | [9] |
| 7 kyu — Uraken z rotacją bioder | Uraken shōmen-uchi | [6] |
| 7 kyu — Yoko-geri — pełne wykonanie | Yoko-geri chūdan | [6] |
| 7 kyu — Ushiro-geri — wprowadzenie | Ushiro-geri chūdan | [5] |
| 7 kyu — Taikyoku Sono San | Taikyoku sono san | [8] |
| 6 kyu — Kiba-dachi | Kiba dachi | [8] |
| 6 kyu — Tate-zuki i morote-zuki | Seiken tate-tsuki | [8] |
| 6 kyu — Tate-zuki i morote-zuki | Seiken morote-tsuki | [10] |
| 6 kyu — Mawashi-geri jodan | Mawashi-geri jōdan (chūsoku, haisoku) | [4] |
| 5 kyu — Shuto mawashi-uke | Shūto mawashi-uke | [7, 4] |
| 5 kyu — Kansetsu-geri | Kansetsu-geri | [6] |
| 5 kyu — Sanchin-no-kata | Sanchin no kata | [4] |
| 4 kyu — Oroshi-kakato-geri | Oroshi uchi kakato-geri | [1] |
| 4 kyu — Tobi-geri | Mae tobi-geri | [2] |
| 4 kyu — Pinan Sono Yon | Pinan sono yon | [3] |
| 3 kyu — Pinan Sono Go | Pinan sono go | [2] |
| 3 kyu — Yantsu, Tsuki-no-kata | Yantsu | [1] |
| 3 kyu — Yantsu, Tsuki-no-kata | Tsuki no kata | [1] |

Zadanie: **P0.3** w `TODO.md` (dopisać stopnie albo udokumentować semantykę).

## 4. Kolizje aliasów

- ⚠️ „kumite-turniejowe" → 7 technik: jiyu-kumite-4-walk-7-kyu, jiyu-kumite-5-walk-6-kyu, jiyu-kumite-6-walk-5-kyu, jiyu-kumite-6-walk-4-kyu, jiyu-kumite-6-walk-3-kyu, jiyu-kumite-8-walk-2-kyu, jiyu-kumite-8-walk-1-kyu

Zadanie: **P0.4** w `TODO.md`.

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

1. **P0.3** — domknąć spójność `levels[]` ↔ wymagania (sekcja 3).
2. **P0.4** — rozdzielić alias „Kumite turniejowe" (sekcja 4).
3. **P1.6** — dopisać Saiha / Seienchin / Ushiro-mawashi-geri (sekcja 5, grupa „brak w atlasie").
4. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie wymagań do słownika (sekcja 5).
5. **P1.5** — zdjęcia self-hosted zamiast Unsplash (sekcja 6).
