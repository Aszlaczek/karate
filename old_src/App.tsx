import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type IconName =
  | "arrow"
  | "book"
  | "check"
  | "chevron"
  | "close"
  | "message"
  | "search"
  | "send"
  | "spark"
  | "target";

const Icon = ({ name, size = 20 }: { name: IconName; size?: number }) => {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    message: <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.4-4.2A9 9 0 1 1 21 12Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></>,
    spark: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z" /><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  };

  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</g>
    </svg>
  );
};

const belts = [
  { id: "white", kyu: "bez stopnia", name: "Biały", color: "#f4f1e8", stripe: "", level: "Początek drogi" },
  { id: "orange", kyu: "10–9 kyu", name: "Pomarańczowy", color: "#e88937", stripe: "#245a91", level: "Fundamenty" },
  { id: "blue", kyu: "8–7 kyu", name: "Niebieski", color: "#2e6193", stripe: "#e8ba36", level: "Stabilność" },
  { id: "yellow", kyu: "6–5 kyu", name: "Żółty", color: "#e8b632", stripe: "#3e7652", level: "Świadomość" },
  { id: "green", kyu: "4–3 kyu", name: "Zielony", color: "#356747", stripe: "#754537", level: "Dojrzałość" },
  { id: "brown", kyu: "2–1 kyu", name: "Brązowy", color: "#70463a", stripe: "#171916", level: "Odpowiedzialność" },
  { id: "black", kyu: "1 dan+", name: "Czarny", color: "#161815", stripe: "#b99025", level: "Nowy początek" },
];

const requirements: Record<string, { intro: string; time: string; groups: { title: string; items: string[] }[] }> = {
  white: {
    intro: "Poznaj etykietę dojo i przygotuj ciało do regularnego treningu.",
    time: "Start",
    groups: [
      { title: "Etykieta", items: ["Ukłon rei przy wejściu", "Znaczenie słowa Osu", "Bezpieczne zachowanie w dojo"] },
      { title: "Podstawy", items: ["Pozycja fudo-dachi", "Seiza i mokuso", "Oddychanie i rozgrzewka"] },
    ],
  },
  orange: {
    intro: "Pierwszy egzamin sprawdza postawy, koordynację i najprostsze techniki ręczne.",
    time: "3–6 mies.",
    groups: [
      { title: "Kihon", items: ["Yoi-dachi, zenkutsu-dachi", "Seiken chudan oi-zuki", "Jodan-uke, gedan-barai"] },
      { title: "Kopnięcia", items: ["Hiza-geri", "Kin-geri", "Mae-geri chudan"] },
      { title: "Kata i sprawność", items: ["Taikyoku Sono Ichi", "Pompki, przysiady, brzuszki", "Dojo-kun"] },
    ],
  },
  blue: {
    intro: "Na tym poziomie liczy się stabilna pozycja, rotacja bioder i kontrola dystansu.",
    time: "6–12 mies.",
    groups: [
      { title: "Kihon", items: ["Sanchin-dachi, kokutsu-dachi", "Soto-uke, uchi-uke", "Uraken shomen-uchi"] },
      { title: "Kopnięcia", items: ["Mawashi-geri gedan/chudan", "Yoko-geri", "Ushiro-geri – wprowadzenie"] },
      { title: "Kata i kumite", items: ["Taikyoku Sono Ni i San", "Pinan Sono Ichi", "Podstawy kumite"] },
    ],
  },
  yellow: {
    intro: "Techniki stają się płynne, a adept łączy obronę z kontratakiem.",
    time: "1–2 lata",
    groups: [
      { title: "Kihon", items: ["Kiba-dachi", "Shuto mawashi-uke", "Tate-zuki i morote-zuki"] },
      { title: "Kopnięcia", items: ["Mawashi-geri jodan", "Uchi/soto mawashi-geri", "Kansetsu-geri"] },
      { title: "Kata i kumite", items: ["Pinan Sono Ni i San", "Sanchin-no-kata", "Walki egzaminacyjne"] },
    ],
  },
  green: {
    intro: "Wymagana jest dynamika, precyzja i świadome użycie całego ciała.",
    time: "2–3 lata",
    groups: [
      { title: "Kihon", items: ["Shuto uchi/uke", "Hiji-ate w wielu kierunkach", "Kombinacje w ruchu"] },
      { title: "Kopnięcia", items: ["Ushiro-mawashi-geri", "Oroshi-kakato-geri", "Tobi-geri"] },
      { title: "Kata i kumite", items: ["Pinan Sono Yon i Go", "Yantsu, Tsuki-no-kata", "Kumite z różnymi partnerami"] },
    ],
  },
  brown: {
    intro: "Zaawansowany stopień wymaga pełnego repertuaru, kondycji i odpowiedzialnej walki.",
    time: "3–5 lat",
    groups: [
      { title: "Technika", items: ["Pełny kihon z komend", "Zaawansowane kombinacje", "Techniki obrotowe i z wyskoku"] },
      { title: "Kata", items: ["Gekisai Dai i Sho", "Saiha, Seienchin", "Interpretacja bunkai"] },
      { title: "Próba", items: ["Rozbudowany test siłowy", "Seria walk kumite", "Wiedza o Kyokushin"] },
    ],
  },
  black: {
    intro: "Czarny pas nie kończy nauki. Potwierdza gotowość do świadomego rozwijania karate.",
    time: "5+ lat",
    groups: [
      { title: "Mistrzostwo podstaw", items: ["Precyzyjny kihon", "Pełen zakres kata", "Bunkai i zastosowanie"] },
      { title: "Charakter", items: ["Dojrzałość w kumite", "Pomoc młodszym stopniom", "Postawa zgodna z dojo-kun"] },
      { title: "Próba", items: ["Wymagania organizacji/branch chiefa", "Test kondycyjny", "Wielorundowe kumite"] },
    ],
  },
};

const techniques = [
  {
    id: "zuki",
    category: "Uderzenia",
    name: "Seiken chūdan oi-zuki",
    japanese: "正拳中段追い突き",
    reading: "sejken czudan oj-zuki",
    description: "Proste uderzenie pięścią na strefę środkową, wykonywane ręką po stronie nogi wykrocznej. Biodro napędza ruch, a druga pięść wraca do hikite.",
    tags: ["Seiken", "Chūdan", "Oi-zuki"],
    image: "https://images.unsplash.com/photo-1514050566906-8d077bae7046?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    focus: "Linia bark–pięść",
  },
  {
    id: "maegeri",
    category: "Kopnięcia",
    name: "Mae-geri",
    japanese: "前蹴り",
    reading: "mae geri",
    description: "Kopnięcie frontalne. Najpierw unieś kolano, następnie dynamicznie wyprostuj nogę i natychmiast wróć po tej samej linii do pozycji.",
    tags: ["Chūsoku", "Hiza", "Kamae"],
    image: "https://images.unsplash.com/photo-1656653121526-a1458317b790?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    focus: "Kolano prowadzi",
  },
  {
    id: "gedan",
    category: "Bloki",
    name: "Gedan-barai",
    japanese: "下段払い",
    reading: "gedan baraj",
    description: "Blok zamiatający strefę dolną. Przedramię prowadzone jest po skosie w dół, z jednoczesnym hikite i stabilną pozycją.",
    tags: ["Gedan", "Uke", "Hikite"],
    image: "https://images.unsplash.com/photo-1656653121475-e33829581294?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    focus: "Łokieć przy ciele",
  },
  {
    id: "sotouke",
    category: "Bloki",
    name: "Soto-uke",
    japanese: "外受け",
    reading: "soto uke",
    description: "Blok przedramieniem prowadzony z zewnątrz do wewnątrz. Pięść rozpoczyna ruch obok głowy, a biodro i przedramię zamykają linię ataku na wysokości chūdan.",
    tags: ["Chūdan", "Uke", "Hikite"],
    image: "",
    focus: "Rotacja przedramienia",
  },
  {
    id: "zenkutsu",
    category: "Pozycje",
    name: "Zenkutsu-dachi",
    japanese: "前屈立ち",
    reading: "zenkucu daczi",
    description: "Długa pozycja wykroczna. Przednie kolano jest ugięte nad stopą, tylna noga wyprostowana, a biodra skierowane zgodnie z techniką.",
    tags: ["Dachi", "Kihon", "Stabilność"],
    image: "https://images.unsplash.com/photo-1525198104776-f6e8a873f9b7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    focus: "Ciężar 60/40",
  },
  {
    id: "taikyoku",
    category: "Kata",
    name: "Taikyoku Sono Ichi",
    japanese: "太極その一",
    reading: "tajkjoku sono iczi",
    description: "Pierwsze kata Kyokushin. Uczy poruszania się po schemacie, obrotów, gedan-barai i seiken oi-zuki w zenkutsu-dachi.",
    tags: ["Kata", "Embusen", "Kiai"],
    image: "https://images.unsplash.com/photo-1598300606161-4019d0dfec28?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
    focus: "Kierunek i rytm",
  },
];

type Technique = (typeof techniques)[number];

function TechniqueIllustration({ technique }: { technique: Technique }) {
  const figure = (() => {
    if (technique.id === "maegeri") {
      return (
        <>
          <circle className="figure-head" cx="330" cy="86" r="35" />
          <path className="figure-body" d="M334 124 350 248" />
          <path className="figure-limb" d="M342 148 438 202 497 164M342 151 272 215 307 238" />
          <path className="figure-limb" d="M350 248 275 391" />
          <path className="figure-limb" d="M350 248 451 270 635 235" />
          <path className="ghost-limb" d="M350 248 452 329 534 378" />
          <path className="motion-line" d="M445 319Q535 309 610 253" markerEnd="url(#arrowhead)" />
          <circle className="target-ring" cx="665" cy="230" r="44" />
          <circle className="target-dot" cx="665" cy="230" r="5" />
        </>
      );
    }
    if (technique.id === "gedan") {
      return (
        <>
          <circle className="figure-head" cx="387" cy="78" r="34" />
          <path className="figure-body" d="M389 117 395 263" />
          <path className="figure-limb" d="M390 143 300 190 345 225" />
          <path className="figure-limb accent-limb" d="M394 140 482 190 520 322" />
          <path className="ghost-limb" d="M394 140 455 87 507 129" />
          <path className="motion-line" d="M490 118Q550 210 523 304" markerEnd="url(#arrowhead)" />
          <path className="figure-limb" d="M395 263 515 392M395 263 264 392" />
          <circle className="target-ring" cx="523" cy="338" r="38" />
        </>
      );
    }
    if (technique.id === "sotouke") {
      return (
        <>
          <circle className="figure-head" cx="387" cy="78" r="34" />
          <path className="figure-body" d="M389 117 395 263" />
          <path className="figure-limb" d="M390 143 300 190 345 225" />
          <path className="figure-limb accent-limb" d="M394 142 478 187 433 246" />
          <path className="ghost-limb" d="M394 142 482 91 522 139" />
          <path className="motion-line" d="M510 126Q500 205 444 238" markerEnd="url(#arrowhead)" />
          <path className="figure-limb" d="M395 263 515 392M395 263 264 392" />
          <circle className="target-ring" cx="447" cy="218" r="39" />
        </>
      );
    }
    if (technique.id === "zenkutsu") {
      return (
        <>
          <circle className="figure-head" cx="378" cy="73" r="34" />
          <path className="figure-body" d="M380 111 393 257" />
          <path className="figure-limb" d="M386 143 310 208 357 237M386 143 472 201 430 234" />
          <path className="figure-limb accent-limb" d="M393 257 535 314 592 391" />
          <path className="figure-limb" d="M393 257 286 391 190 391" />
          <path className="measure-line" d="M188 423H595M392 412V435" />
          <path className="motion-line" d="M418 300Q497 326 558 382" markerEnd="url(#arrowhead)" />
          <text className="svg-note" x="172" y="455">40%</text>
          <text className="svg-note" x="570" y="455">60%</text>
        </>
      );
    }
    if (technique.id === "taikyoku") {
      return (
        <>
          <path className="kata-path" d="M187 130H395V356H604M395 130H604M395 130V356H187" />
          {[[187,130],[395,130],[604,130],[395,356],[604,356],[187,356]].map(([x,y], index) => (
            <g key={`${x}-${y}`}>
              <circle className="kata-point" cx={x} cy={y} r="19" />
              <text className="kata-number" x={x} y={y + 5}>{index + 1}</text>
            </g>
          ))}
          <path className="motion-line" d="M205 130H360" markerEnd="url(#arrowhead)" />
          <path className="motion-line" d="M395 155V320" markerEnd="url(#arrowhead)" />
          <path className="motion-line" d="M420 356H570" markerEnd="url(#arrowhead)" />
          <text className="svg-kanji" x="396" y="252">型</text>
        </>
      );
    }
    return (
      <>
        <circle className="figure-head" cx="365" cy="82" r="34" />
        <path className="figure-body" d="M368 120 384 264" />
        <path className="figure-limb accent-limb" d="M373 147 490 179 637 163" />
        <path className="figure-limb" d="M373 147 286 213 365 235" />
        <path className="figure-limb" d="M384 264 526 321 585 394M384 264 265 394 175 394" />
        <path className="motion-line" d="M447 153Q555 147 620 160" markerEnd="url(#arrowhead)" />
        <circle className="target-ring" cx="675" cy="160" r="43" />
        <circle className="target-dot" cx="675" cy="160" r="5" />
      </>
    );
  })();

  return (
    <svg className="technique-illustration" role="img" aria-label={`Schemat ruchu ${technique.name}`} viewBox="0 0 800 480">
      <defs>
        <pattern height="40" id={`grid-${technique.id}`} patternUnits="userSpaceOnUse" width="40">
          <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity=".07" />
        </pattern>
        <marker id="arrowhead" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#b4362e" />
        </marker>
      </defs>
      <rect className="illustration-ground" height="480" width="800" />
      <rect className="illustration-grid" fill={`url(#grid-${technique.id})`} height="480" width="800" />
      <path className="floor-line" d="M95 395H705" />
      {figure}
    </svg>
  );
}

const dojoKun = [
  ["一、吾々は心身を錬磨し", "Hitotsu, wareware wa shinshin o renma shi", "Będziemy ćwiczyć nasze serca i ciała dla osiągnięcia pewnego, niewzruszonego ducha."],
  ["一、吾々は武の神髄を極め", "Hitotsu, wareware wa bu no shinzui o kiwame", "Będziemy dążyć do prawdziwego opanowania sztuki karate, aby kiedyś nasze ciało i zmysły stały się doskonałe."],
  ["一、吾々は質実剛健を以って", "Hitotsu, wareware wa shitsujitsu gōken o motte", "Z głębokim zapałem będziemy starać się kultywować ducha samowyrzeczenia."],
  ["一、吾々は礼節を重んじ", "Hitotsu, wareware wa reisetsu o omonji", "Będziemy przestrzegać zasad grzeczności, poszanowania starszych i powstrzymywać się od gwałtowności."],
  ["一、吾々は神仏を尊び", "Hitotsu, wareware wa shinbutsu o tōtobi", "Będziemy spoglądać w górę ku prawdziwej mądrości i sile, porzucając inne pragnienia."],
  ["一、吾々は知性と体力とを向上させ", "Hitotsu, wareware wa chisei to tairyoku to o kōjō sase", "Będziemy wierni naszym ideałom i nigdy nie zapomnimy o cnocie pokory."],
  ["一、吾々は生涯の修行を空手の道に通じ", "Hitotsu, wareware wa shōgai no shūgyō o karate no michi ni tsūji", "Przez całe życie, poprzez dyscyplinę karate, dążyć będziemy do poznania prawdziwego znaczenia drogi, którą obraliśmy."],
];

function answerQuestion(question: string) {
  const q = question.toLowerCase();
  if (q.includes("10 kyu") || q.includes("pomarańcz")) return "Na 10 kyu skup się na postawach yoi-dachi i zenkutsu-dachi, seiken chūdan oi-zuki, jōdan-uke, gedan-barai oraz mae-geri. Najczęściej wymagane jest też Taikyoku Sono Ichi i podstawowa sprawność. Dokładny program potwierdź u swojego sensei.";
  if (q.includes("mae") || q.includes("kopni")) return "W mae-geri najpierw wysoko unieś kolano (hiki-ashi), kopnij po prostej chūsoku i szybko cofnij stopę. Nie odchylaj tułowia i utrzymaj gardę. Ćwicz powoli przy ścianie, a potem dodaj dynamikę.";
  if (q.includes("dojo") || q.includes("kun")) return "Dojo-kun to siedem zasad kształtujących postawę karateki: rozwój ciała i ducha, dążenie do mistrzostwa, samowyrzeczenie, szacunek, pokora, wierność ideałom i życie zgodne z drogą karate.";
  if (q.includes("kata") || q.includes("taikyoku")) return "Przy kata oceniane są: poprawny schemat (embusen), stabilne pozycje, technika, rytm, skupienie i kiai. Taikyoku Sono Ichi łączy gedan-barai i oi-zuki w zenkutsu-dachi.";
  if (q.includes("egzamin") || q.includes("przygot")) return "Przed egzaminem ćwicz regularnie krótkimi seriami: kihon, kata i kondycję. Zadbaj o sen, nawodnienie i czyste dogi. W dniu próby słuchaj komend, nie spiesz się i pokaż ducha walki. Osu!";
  if (q.includes("osu")) return "Osu (押忍) wyraża wytrwałość, szacunek i gotowość. W dojo jest powitaniem, potwierdzeniem zrozumienia komendy i podziękowaniem — używaj go świadomie, nie mechanicznie.";
  return "Mogę pomóc w wymaganiach na stopnie kyu, technikach kihon, kata, kumite i słownictwie. Napisz, jaki masz pas albo podaj nazwę techniki. Pamiętaj, że ostateczne wymagania ustala Twoja organizacja i sensei.";
}

function App() {
  const [selectedBelt, setSelectedBelt] = useState("orange");
  const [category, setCategory] = useState("Wszystkie");
  const [query, setQuery] = useState("");
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Osu! Jestem asystentem Kihon. Zapytaj mnie o egzamin, technikę albo japońskie pojęcie." },
  ]);
  const requirementRef = useRef<HTMLElement>(null);
  const currentBelt = belts.find((belt) => belt.id === selectedBelt)!;
  const currentRequirements = requirements[selectedBelt];
  const categories = ["Wszystkie", "Uderzenia", "Kopnięcia", "Bloki", "Pozycje", "Kata"];
  const filteredTechniques = useMemo(
    () =>
      techniques.filter(
        (technique) =>
          (category === "Wszystkie" || technique.category === category) &&
          `${technique.name} ${technique.japanese} ${technique.reading} ${technique.description}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, query],
  );

  useEffect(() => {
    document.body.style.overflow = activeTechnique ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveTechnique(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeTechnique]);

  const openTechnique = (technique: Technique) => {
    setActiveTechnique(technique);
    window.history.replaceState(null, "", `#technika-${technique.id}`);
  };

  const closeTechnique = () => {
    setActiveTechnique(null);
    window.history.replaceState(null, "", "#techniki");
  };

  const renderRequirementItem = (item: string) => {
    const links = [
      ["Seiken chudan oi-zuki", "zuki"],
      ["Taikyoku Sono Ichi", "taikyoku"],
      ["zenkutsu-dachi", "zenkutsu"],
      ["Soto-uke", "sotouke"],
      ["gedan-barai", "gedan"],
      ["Mae-geri", "maegeri"],
    ] as const;
    const pattern = new RegExp(`(${links.map(([label]) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

    return item.split(pattern).map((part, index) => {
      const linked = links.find(([label]) => label.toLowerCase() === part.toLowerCase());
      if (!linked) return <span key={`${part}-${index}`}>{part}</span>;
      const technique = techniques.find(({ id }) => id === linked[1]);
      if (!technique) return <span key={`${part}-${index}`}>{part}</span>;
      return (
        <button className="requirement-tech-link" key={`${part}-${index}`} onClick={() => openTechnique(technique)}>
          {part}<Icon name="arrow" size={12} />
        </button>
      );
    });
  };

  const selectBelt = (id: string) => {
    setSelectedBelt(id);
    window.setTimeout(() => requirementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const clean = chatInput.trim();
    if (!clean) return;
    setMessages((items) => [...items, { role: "user", text: clean }, { role: "bot", text: answerQuestion(clean) }]);
    setChatInput("");
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#start" aria-label="Kihon — strona główna">
          <span className="brand-mark">極</span>
          <span><strong>KIHON</strong><small>droga do egzaminu</small></span>
        </a>
        <nav aria-label="Główna nawigacja">
          <a href="#stopnie">Stopnie</a>
          <a href="#techniki">Techniki</a>
          <a href="#dojo-kun">Dojo-kun</a>
        </nav>
        <a className="header-cta" href="#stopnie">Sprawdź wymagania <Icon name="arrow" size={17} /></a>
      </header>

      <main>
        <section className="hero" id="start">
          <div className="hero-copy">
            <div className="eyebrow"><span /> KYOKUSHIN EXAM GUIDE</div>
            <h1>Każdy pas.<br /><em>Jeden kierunek.</em></h1>
            <p>Przejrzysty przewodnik po wymaganiach egzaminacyjnych, technikach i japońskim słownictwie karate Kyokushin.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#stopnie">Wybierz swój pas <Icon name="arrow" size={18} /></a>
              <a className="text-link" href="#techniki"><Icon name="book" size={18} /> Otwórz bazę technik</a>
            </div>
            <div className="hero-stats">
              <div><strong>7</strong><span>poziomów drogi</span></div>
              <div><strong>5</strong><span>grup technik</span></div>
              <div><strong>24/7</strong><span>asystent wiedzy</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1656653121475-e33829581294?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1400" alt="Karateka zawiązujący czarny pas na białym dogi" />
            <div className="photo-wash" />
            <div className="hero-kanji">押忍</div>
            <div className="image-caption"><span>01</span><p><strong>OSU NO SEISHIN</strong>Duch wytrwałości</p></div>
          </div>
        </section>

        <section className="section belts-section" id="stopnie">
          <div className="section-heading">
            <div><span className="section-number">01</span><h2>Twoja droga do czarnego pasa</h2></div>
            <p>Wybierz stopień, aby zobaczyć zakres egzaminu. Pas z belką oznacza drugi stopień w danym kolorze.</p>
          </div>
          <div className="belt-path">
            {belts.map((belt, index) => (
              <button className={`belt-card ${selectedBelt === belt.id ? "active" : ""}`} key={belt.id} onClick={() => selectBelt(belt.id)}>
                <span className="belt-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="belt-swatch" style={{ backgroundColor: belt.color }}>
                  {belt.stripe && <i style={{ backgroundColor: belt.stripe }} />}
                </span>
                <strong>{belt.name}</strong>
                <span>{belt.kyu}</span>
                <small>{belt.level}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="requirements" ref={requirementRef}>
          <div className="requirement-side">
            <span className="vertical-label">WYMAGANIA EGZAMINACYJNE</span>
            <div className="selected-belt-mark" style={{ backgroundColor: currentBelt.color }}>
              {currentBelt.stripe && <i style={{ backgroundColor: currentBelt.stripe }} />}
            </div>
            <span className="gi-symbol">空手</span>
          </div>
          <div className="requirement-content">
            <div className="requirement-title">
              <div>
                <span>{currentBelt.kyu} / {currentBelt.level}</span>
                <h2>Pas {currentBelt.name.toLowerCase()}</h2>
                <p>{currentRequirements.intro}</p>
              </div>
              <div className="time-badge"><small>Orientacyjny staż</small><strong>{currentRequirements.time}</strong></div>
            </div>
            <div className="requirement-groups">
              {currentRequirements.groups.map((group, index) => (
                <article key={group.title}>
                  <span className="group-number">0{index + 1}</span>
                  <h3>{group.title}</h3>
                  <ul>{group.items.map((item) => <li key={item}><Icon name="check" size={16} /><span>{renderRequirementItem(item)}</span></li>)}</ul>
                </article>
              ))}
            </div>
            <p className="requirements-note"><strong>Ważne:</strong> programy egzaminacyjne mogą różnić się między organizacjami i dojo. Zawsze potwierdź aktualny zakres u swojego sensei.</p>
          </div>
        </section>

        <section className="section techniques-section" id="techniki">
          <div className="section-heading">
            <div><span className="section-number">02</span><h2>Atlas technik</h2></div>
            <p>Japońska nazwa, zapis, wymowa i praktyczne wskazówki w jednym miejscu.</p>
          </div>
          <div className="tech-toolbar">
            <div className="category-tabs">
              {categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <label className="search-box"><Icon name="search" size={18} /><input aria-label="Szukaj techniki" onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj techniki..." value={query} /></label>
          </div>
          <div className="tech-grid">
            {filteredTechniques.map((technique, index) => (
              <article className="tech-card" key={technique.id}>
                <button className="tech-image" onClick={() => openTechnique(technique)} aria-label={`Otwórz wizualizację techniki ${technique.name}`}>
                  <TechniqueIllustration technique={technique} />
                  <span>{technique.category}</span>
                  <small>0{index + 1}</small>
                  <b>Zobacz ruch <Icon name="arrow" size={16} /></b>
                </button>
                <div className="tech-body">
                  <div className="japanese">{technique.japanese}</div>
                  <h3>{technique.name}</h3>
                  <div className="pronunciation">Wymowa: <strong>{technique.reading}</strong></div>
                  <p>{technique.description}</p>
                  <div className="tech-focus"><Icon name="target" size={17} /><span>Klucz:</span><strong>{technique.focus}</strong></div>
                  <div className="tech-tags">{technique.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            ))}
            {filteredTechniques.length === 0 && <div className="empty-state">Nie znaleziono techniki. Spróbuj innej nazwy lub kategorii.</div>}
          </div>
        </section>

        <section className="dojo-section" id="dojo-kun">
          <div className="dojo-intro">
            <span className="section-number light">03</span>
            <p className="japanese-vertical">道場訓</p>
            <h2>Dojo-kun</h2>
            <p>Siedem zasad dojo</p>
            <blockquote>„Ostatecznym celem karate nie jest zwycięstwo lub porażka, lecz doskonalenie charakteru.”</blockquote>
            <small>— Masutatsu Ōyama</small>
          </div>
          <div className="dojo-list">
            {dojoKun.map(([japanese, reading, polish], index) => (
              <details key={reading} open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{reading.replace("Hitotsu, ", "")}</strong><Icon name="chevron" size={20} /></summary>
                <div><p className="dojo-japanese">{japanese}</p><p>{polish}</p></div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="brand inverse"><span className="brand-mark">極</span><span><strong>KIHON</strong><small>droga do egzaminu</small></span></div>
        <p>Ucz się świadomie. Trenuj wytrwale. <strong>Osu.</strong></p>
        <a href="#start">Wróć na górę ↑</a>
      </footer>

      {activeTechnique && (
        <div className="tech-modal" role="dialog" aria-modal="true" aria-label={`Wizualizacja techniki ${activeTechnique.name}`} onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeTechnique();
        }}>
          <div className="tech-modal-panel">
            <button className="modal-close" aria-label="Zamknij wizualizację" onClick={closeTechnique}><Icon name="close" /></button>
            <div className="visualization-stage">
              <div className="visualization-topline">
                <span>{activeTechnique.category}</span>
                <small>Wizualizacja techniki</small>
              </div>
              <TechniqueIllustration technique={activeTechnique} />
              <div className="visualization-legend">
                <span><i className="legend-solid" /> Pozycja końcowa</span>
                <span><i className="legend-ghost" /> Pozycja początkowa</span>
                <span><i className="legend-red" /> Kierunek ruchu</span>
              </div>
            </div>
            <div className="visualization-copy">
              <span className="modal-kanji">{activeTechnique.japanese}</span>
              <p className="modal-eyebrow">Technika krok po kroku</p>
              <h2>{activeTechnique.name}</h2>
              <p className="modal-reading">Wymowa: <strong>{activeTechnique.reading}</strong></p>
              <p className="modal-description">{activeTechnique.description}</p>
              <div className="checkpoint">
                <Icon name="target" size={22} />
                <div><small>Najważniejszy punkt</small><strong>{activeTechnique.focus}</strong></div>
              </div>
              <ol>
                <li><span>01</span><p><strong>Przygotuj pozycję</strong>Ustaw stabilną bazę, rozluźnij barki i utrzymaj wzrok na celu.</p></li>
                <li><span>02</span><p><strong>Poprowadź ruch</strong>Wykonaj technikę po zaznaczonej czerwonej linii, angażując biodra.</p></li>
                <li><span>03</span><p><strong>Zatrzymaj i wróć</strong>Kontroluj punkt końcowy, zachowaj gardę i płynnie wróć do kamae.</p></li>
              </ol>
              <p className="safety-note">Ćwicz pod opieką instruktora. Schemat pokazuje kierunek ruchu i nie zastępuje korekty technicznej sensei.</p>
            </div>
          </div>
        </div>
      )}

      <div className={`chat-widget ${chatOpen ? "open" : ""}`}>
        {chatOpen && (
          <section className="chat-panel" aria-label="Asystent Kihon">
            <header><div className="bot-avatar"><Icon name="spark" size={20} /></div><div><strong>Asystent Kihon</strong><span><i /> online</span></div><button aria-label="Zamknij czat" onClick={() => setChatOpen(false)}><Icon name="close" /></button></header>
            <div className="chat-messages">
              {messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}
            </div>
            <div className="quick-questions">
              {["Co na 10 kyu?", "Jak wykonać mae-geri?"].map((text) => <button key={text} onClick={() => { setMessages((items) => [...items, { role: "user", text }, { role: "bot", text: answerQuestion(text) }]); }}>{text}</button>)}
            </div>
            <form onSubmit={sendMessage}><input aria-label="Twoje pytanie" onChange={(event) => setChatInput(event.target.value)} placeholder="Zapytaj po polsku..." value={chatInput} /><button aria-label="Wyślij pytanie" type="submit"><Icon name="send" size={18} /></button></form>
            <small className="chat-disclaimer">Odpowiedzi edukacyjne • zakres potwierdź u sensei</small>
          </section>
        )}
        <button className="chat-trigger" aria-label="Otwórz asystenta" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? <Icon name="close" /> : <Icon name="message" />}
          {!chatOpen && <span>Zapytaj sensei AI</span>}
        </button>
      </div>
    </div>
  );
}

export default App;
