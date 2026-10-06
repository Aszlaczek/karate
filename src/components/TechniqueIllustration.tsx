import type { ReactElement } from "react";
import type { Technique } from "../data/types";

type Drawing = () => ReactElement;

const zukiArt = (): ReactElement => (
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

const uchiArt = (): ReactElement => (
  <>
    <circle className="figure-head" cx="365" cy="82" r="34" />
    <path className="figure-body" d="M368 120 384 264" />
    <path className="figure-limb" d="M373 147 286 213 365 235" />
    <path className="figure-limb accent-limb" d="M373 147 470 145 565 175" />
    <path className="ghost-limb" d="M373 147 455 95 530 115" />
    <path className="motion-line" d="M545 120Q605 145 618 195" markerEnd="url(#arrowhead)" />
    <path className="figure-limb" d="M384 264 526 321 585 394M384 264 265 394 175 394" />
    <circle className="target-ring" cx="645" cy="235" r="44" />
    <circle className="target-dot" cx="645" cy="235" r="5" />
  </>
);

const dachiArt = (): ReactElement => (
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

const ukeArt = (): ReactElement => (
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

const gedanArt = (): ReactElement => (
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

const geriArt = (): ReactElement => (
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

const kataArt = (): ReactElement => (
  <>
    <path className="kata-path" d="M187 130H395V356H604M395 130H604M395 130V356H187" />
    {[[187, 130], [395, 130], [604, 130], [395, 356], [604, 356], [187, 356]].map(([x, y], index) => (
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

const kumiteArt = (): ReactElement => (
  <>
    <circle className="figure-head" cx="225" cy="95" r="32" />
    <path className="figure-body" d="M228 131 240 252" />
    <path className="figure-limb accent-limb" d="M232 155 330 168 388 156" />
    <path className="figure-limb" d="M232 158 270 212 318 196" />
    <path className="figure-limb" d="M240 252 315 394M240 252 172 394" />
    <circle className="figure-head" cx="585" cy="100" r="32" />
    <path className="figure-body" d="M582 136 570 256" />
    <path className="figure-limb" d="M576 160 524 176 548 204" />
    <path className="figure-limb" d="M576 164 618 210 578 232" />
    <path className="figure-limb" d="M570 256 505 394M570 256 640 394" />
    <path className="motion-line" d="M400 156Q490 162 533 179" markerEnd="url(#arrowhead)" />
    <circle className="target-ring" cx="575" cy="185" r="40" />
    <circle className="target-dot" cx="575" cy="185" r="5" />
    <path className="measure-line" d="M330 425V445M500 425V445M330 435H500" />
    <text className="svg-note" x="378" y="470">ma-ai</text>
    <text className="svg-kanji" x="400" y="330">組</text>
  </>
);

const DRAWINGS: Record<string, Drawing> = {
  zuki: zukiArt,
  uchi: uchiArt,
  dachi: dachiArt,
  uke: ukeArt,
  gedan: gedanArt,
  geri: geriArt,
  kata: kataArt,
  kumite: kumiteArt,
  maegeri: geriArt,
  sotouke: ukeArt,
  zenkutsu: dachiArt,
  taikyoku: kataArt,
};

const resolveMediaSrc = (value: string): string =>
  value.startsWith("/") ? `${import.meta.env.BASE_URL}${value.slice(1)}` : value;

const renderMedia = (video: string, technique: Technique): ReactElement => {
  const youtube = video.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (youtube) {
    return (
      <iframe
        className="technique-media"
        src={`https://www.youtube.com/embed/${youtube[1]}`}
        title={`Wideo: ${technique.name}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  const src = resolveMediaSrc(video);
  if (/\.(gif|webp|jpe?g|png)(\?|#|$)/i.test(video)) {
    return <img className="technique-media" src={src} alt={technique.name} />;
  }
  return <video className="technique-media" src={src} controls />;
};

function TechniqueIllustration({ technique }: { technique: Technique }) {
  if (technique.video) {
    return <div className="technique-media-frame">{renderMedia(technique.video, technique)}</div>;
  }

  const draw = DRAWINGS[technique.infographic] ?? DRAWINGS.zuki;

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
      {draw()}
    </svg>
  );
}

export default TechniqueIllustration;
