import { useId } from "react";

type Zone = "jodan" | "chudan" | "gedan";

const ZONE_BY_ENTRY: Record<string, Zone> = {
  chudan: "chudan",
  jodan: "jodan",
  "gedan-strefa": "gedan",
};

const ZONES: { id: Zone; label: string; y: number }[] = [
  { id: "jodan", label: "JŌDAN", y: 86 },
  { id: "chudan", label: "CHŪDAN", y: 205 },
  { id: "gedan", label: "GEDAN", y: 318 },
];

export const zoneForEntry = (entryId: string): Zone | null =>
  ZONE_BY_ENTRY[entryId] ?? null;

interface ZoneIllustrationProps {
  zone: Zone;
}

function ZoneIllustration({ zone }: ZoneIllustrationProps) {
  const gridId = `zone-grid-${useId().replace(/:/g, "")}`;
  const active = ZONES.find((item) => item.id === zone) ?? ZONES[0];

  return (
    <svg
      className="zone-illustration"
      role="img"
      aria-label="Karateka w pozycji fudo-dachi z liniami stref jodan, chudan i gedan"
      viewBox="0 0 800 480"
    >
      <defs>
        <pattern height="40" id={gridId} patternUnits="userSpaceOnUse" width="40">
          <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity=".07" />
        </pattern>
      </defs>
      <rect className="illustration-ground" height="480" width="800" />
      <rect className="illustration-grid" fill={`url(#${gridId})`} height="480" width="800" />
      <path className="floor-line" d="M150 440H650" />
      {ZONES.filter((item) => item.id !== active.id).map((item) => (
        <line className="zone-line" key={item.id} x1="70" x2="730" y1={item.y} y2={item.y} />
      ))}
      <circle className="figure-head" cx="400" cy="78" r="34" />
      <path className="figure-body" d="M400 120V254" />
      <path className="figure-limb" d="M378 144 348 210 366 266" />
      <path className="figure-limb" d="M422 144 452 210 434 266" />
      <path className="figure-limb accent-limb" d="M386 256 364 336 350 418" />
      <path className="figure-limb accent-limb" d="M414 256 436 336 450 418" />
      <path className="figure-limb" d="M322 424H378" />
      <path className="figure-limb" d="M422 424H478" />
      <line className="zone-line active" x1="70" x2="730" y1={active.y} y2={active.y} />
      {ZONES.map((item) => (
        <g key={item.id}>
          <rect className="zone-label-bg" height="42" width="176" x="556" y={item.y - 21} />
          <text
            className={`zone-label${item.id === active.id ? " active" : ""}`}
            dominantBaseline="central"
            textAnchor="middle"
            x="644"
            y={item.y}
          >
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default ZoneIllustration;
