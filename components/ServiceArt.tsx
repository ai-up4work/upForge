import { paletteFor } from "./Showcase";

/**
 * Brand illustrations for each service: precise line-art UI compositions on a lit plate.
 * Replaces stock photography so every service card looks designed, not sourced.
 */
const L = "#AECAE3"; // line
const P = "#0B1438"; // panel
const O = "#F0B888"; // orange
const T = "#79DABD"; // teal
const C = "#8FD4ED"; // cyan

function Win({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: React.ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={P} stroke={L} strokeOpacity=".55" strokeWidth="1.2" />
      <line x1={x} x2={x + w} y1={y + 18} y2={y + 18} stroke={L} strokeOpacity=".25" />
      <circle cx={x + 11} cy={y + 9} r="2.4" fill={L} fillOpacity=".5" />
      <circle cx={x + 19} cy={y + 9} r="2.4" fill={L} fillOpacity=".35" />
      <circle cx={x + 27} cy={y + 9} r="2.4" fill={L} fillOpacity=".25" />
      {children}
    </g>
  );
}
const Bar = ({ x, y, w, o = 0.35, c = L, h = 5 }: { x: number; y: number; w: number; o?: number; c?: string; h?: number }) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c} fillOpacity={o} />;

const makeArts = (hero: string, glow: string): Record<string, React.ReactNode> => ({
  "web-development-sri-lanka": (
    <g>
      <Win x={58} y={46} w={284} h={200}>
        <Bar x={74} y={78} w={46} o={0.6} />
        <Bar x={250} y={78} w={22} /><Bar x={278} y={78} w={22} /><Bar x={306} y={78} w={22} />
        <rect x={74} y={98} width={252} height={70} rx="6" fill={hero} />
        <Bar x={88} y={118} w={110} o={0.9} c="#fff" h={8} />
        <Bar x={88} y={134} w={78} o={0.55} c="#fff" />
        <rect x={88} y={148} width={44} height={12} rx="6" fill={O} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={74 + i * 86} y={180} width={78} height={52} rx="5" fill="none" stroke={L} strokeOpacity=".35" />
            <Bar x={82 + i * 86} y={214} w={44} o={0.4} />
            <Bar x={82 + i * 86} y={222} w={28} o={0.25} h={4} />
          </g>
        ))}
      </Win>
      <path d="M300 150l16 40 6-16 16-6z" fill="#fff" stroke={P} strokeWidth="1.5" />
    </g>
  ),
  "mobile-app-development-sri-lanka": (
    <g>
      <g transform="rotate(-8 150 160)">
        <rect x={98} y={46} width={112} height={220} rx="20" fill={P} stroke={L} strokeOpacity=".6" strokeWidth="1.4" />
        <rect x={136} y={56} width={36} height={8} rx="4" fill={L} fillOpacity=".35" />
        <rect x={110} y={76} width={88} height={64} rx="10" fill={hero} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}><rect x={110} y={152 + i * 26} width={18} height={18} rx="5" fill={i === 0 ? O : L} fillOpacity={i === 0 ? 1 : 0.3} /><Bar x={136} y={156 + i * 26} w={52} o={0.45} /><Bar x={136} y={164 + i * 26} w={34} o={0.25} h={4} /></g>
        ))}
      </g>
      <g transform="rotate(6 260 160)">
        <rect x={204} y={64} width={104} height={204} rx="20" fill={P} stroke={L} strokeOpacity=".6" strokeWidth="1.4" />
        <rect x={238} y={74} width={36} height={8} rx="4" fill={L} fillOpacity=".35" />
        <circle cx={256} cy={136} r={34} fill="none" stroke={L} strokeOpacity=".25" strokeWidth="8" />
        <path d="M256 102a34 34 0 0 1 32 46" fill="none" stroke={T} strokeWidth="8" strokeLinecap="round" />
        <Bar x={222} y={190} w={68} o={0.45} />
        <rect x={222} y={208} width={68} height={22} rx="11" fill={C} fillOpacity=".9" />
      </g>
    </g>
  ),
  "custom-software-development-sri-lanka": (
    <Win x={46} y={44} w={308} h={212}>
      <rect x={46} y={62} width={64} height={194} fill={L} fillOpacity=".05" />
      {[0, 1, 2, 3, 4].map((i) => <Bar key={i} x={58} y={80 + i * 20} w={i === 0 ? 40 : 32} o={i === 0 ? 0.8 : 0.3} c={i === 0 ? O : L} />)}
      {[0, 1, 2].map((i) => (
        <g key={i}><rect x={124 + i * 74} y={76} width={66} height={42} rx="5" fill="none" stroke={L} strokeOpacity=".3" /><Bar x={132 + i * 74} y={86} w={28} o={0.35} h={4} /><Bar x={132 + i * 74} y={98} w={40} o={0.85} c={i === 1 ? T : "#fff"} h={7} /></g>
      ))}
      {[46, 70, 58, 88, 76, 104, 96].map((h, i) => <rect key={i} x={128 + i * 18} y={226 - h} width="10" height={h} rx="3" fill={i === 5 ? O : C} fillOpacity={i === 5 ? 1 : 0.55} />)}
      <circle cx={308} cy={180} r={26} fill="none" stroke={L} strokeOpacity=".2" strokeWidth="9" />
      <path d="M308 154a26 26 0 0 1 24 34" fill="none" stroke={T} strokeWidth="9" />
      <path d="M332 188a26 26 0 0 1 -30 18" fill="none" stroke={O} strokeWidth="9" />
    </Win>
  ),
  "ecommerce-website-development-sri-lanka": (
    <g>
      <Win x={56} y={48} w={288} h={206}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={72 + i * 90} y={80} width={80} height={96} rx="6" fill={L} fillOpacity=".06" stroke={L} strokeOpacity=".3" />
            <ellipse cx={112 + i * 90} cy={124} rx={18} ry={26} fill={hero} opacity={0.9 - i * 0.15} />
            <Bar x={80 + i * 90} y={188} w={50} o={0.5} />
            <Bar x={80 + i * 90} y={198} w={30} o={0.9} c={O} />
          </g>
        ))}
        <rect x={72} y={220} width={256} height={22} rx="11" fill={T} fillOpacity=".9" />
        <Bar x={168} y={228} w={64} o={0.9} c={P} h={6} />
      </Win>
      <g transform="translate(300 40)">
        <circle cx="22" cy="22" r="22" fill={O} />
        <path d="M12 16h4l4 14h12l3-10H18" fill="none" stroke={P} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="34" r="2" fill={P} /><circle cx="31" cy="34" r="2" fill={P} />
      </g>
    </g>
  ),
  "ai-development-sri-lanka": (
    <g>
      {[[110, 90], [100, 200], [300, 80], [310, 210], [200, 250], [200, 50]].map(([x, y], i) => (
        <g key={i}>
          <line x1={200} y1={150} x2={x} y2={y} stroke={L} strokeOpacity=".35" strokeDasharray="3 5" />
          <circle cx={x} cy={y} r={i % 2 ? 9 : 12} fill={P} stroke={i === 2 ? O : L} strokeOpacity={i === 2 ? 1 : 0.6} strokeWidth="1.5" />
          <circle cx={x} cy={y} r={3} fill={i === 2 ? O : C} />
        </g>
      ))}
      <circle cx={200} cy={150} r={48} fill={glow} />
      <circle cx={200} cy={150} r={30} fill={P} stroke={T} strokeWidth="2" />
      <path d="M200 134l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill={T} />
      <g transform="translate(232 98)">
        <rect width="104" height="34" rx="12" fill={P} stroke={L} strokeOpacity=".5" />
        <Bar x={12} y={11} w={60} o={0.6} /><Bar x={12} y={20} w={40} o={0.3} h={4} />
      </g>
      <g transform="translate(64 168)">
        <rect width="92" height="30" rx="12" fill={C} fillOpacity=".9" />
        <Bar x={12} y={12} w={56} o={0.9} c={P} h={6} />
      </g>
    </g>
  ),
  "ui-ux-design-sri-lanka": (
    <g>
      <rect x={60} y={58} width={120} height={180} rx="10" fill={P} stroke={L} strokeOpacity=".5" strokeDasharray="4 4" />
      <rect x={72} y={74} width={96} height={56} rx="6" fill={hero} />
      <Bar x={72} y={142} w={70} o={0.6} /><Bar x={72} y={152} w={50} o={0.3} h={4} />
      <rect x={72} y={204} width={96} height={20} rx="10" fill={O} />
      <rect x={200} y={58} width={140} height={100} rx="10" fill={P} stroke={L} strokeOpacity=".5" />
      <path d="M216 138c30-62 64 10 108-52" fill="none" stroke={T} strokeWidth="2.4" />
      {[[216, 138], [324, 86]].map(([x, y], i) => <g key={i}><rect x={x - 5} y={y - 5} width="10" height="10" fill="#fff" stroke={P} /><line x1={x} y1={y} x2={x + (i ? -34 : 34)} y2={y + (i ? 24 : -30)} stroke={L} strokeOpacity=".6" /><circle cx={x + (i ? -34 : 34)} cy={y + (i ? 24 : -30)} r="4" fill={C} /></g>)}
      {[O, T, C, L, "#fff"].map((c, i) => <circle key={i} cx={216 + i * 28} cy={196} r={11} fill={c} fillOpacity={c === L ? 0.5 : 1} stroke={P} strokeWidth="2" />)}
      <rect x={200} y={222} width={140} height={16} rx="8" fill={L} fillOpacity=".12" />
      <rect x={200} y={222} width={84} height={16} rx="8" fill={L} fillOpacity=".4" />
    </g>
  ),
});

export default function ServiceArt({ slug, className }: { slug: string; className?: string }) {
  const pal = paletteFor(slug);
  const id = slug.replace(/[^a-z0-9]/gi, "");
  const arts = makeArts(`url(#sa-hero-${id})`, `url(#sa-glow-${id})`);
  const style = { ["--pa" as string]: pal.a, ["--pb" as string]: pal.b, ["--pc" as string]: pal.c };
  return (
    <span className={`show show-art ${className ?? ""}`} style={style} aria-hidden="true">
      <span className="show-plate" />
      <span className="show-grid" />
      <svg className="art-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`sa-hero-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={pal.c} />
            <stop offset="1" stopColor={pal.b} />
          </linearGradient>
          <radialGradient id={`sa-glow-${id}`}>
            <stop offset="0" stopColor={T} stopOpacity=".45" />
            <stop offset="1" stopColor={T} stopOpacity="0" />
          </radialGradient>
        </defs>
        {arts[slug] ?? arts["web-development-sri-lanka"]}
      </svg>
    </span>
  );
}
