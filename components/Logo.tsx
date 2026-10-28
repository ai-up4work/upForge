/**
 * Upforge mark: a crucible-shaped U whose right arm rises into a forged blade,
 * holding an ember (diamond). Gradient on dark backgrounds; `mono` for single-colour use.
 */
const U = "M8 18H20V40A12 12 0 0 0 44 40V12L56 4V40A24 24 0 0 1 8 40Z";
const EMBER = "M32 18.5l6 6-6 6-6-6z";

export function LogoMark({ className, mono }: { className?: string; mono?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {!mono && (
        <defs>
          <linearGradient id="uf-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E3EFFB" />
            <stop offset=".55" stopColor="#AECAE3" />
            <stop offset="1" stopColor="#6F95C2" />
          </linearGradient>
          <linearGradient id="uf-ember" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE0BC" />
            <stop offset="1" stopColor="#E9895A" />
          </linearGradient>
        </defs>
      )}
      <path d={U} fill={mono ?? "url(#uf-steel)"} />
      <path className="logo-ember" d={EMBER} fill={mono ?? "url(#uf-ember)"} />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function LogoLockup({ className, sub = "Studio · Sri Lanka" }: { className?: string; sub?: string }) {
  return (
    <span className={`lockup ${className ?? ""}`}>
      <LogoMark />
      <span className="lockup-word">
        UPFORGE
        {sub && <small>{sub}</small>}
      </span>
    </span>
  );
}

/** App-icon tile (admin, small UI). */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className={className}>
      <rect width="96" height="96" rx="24" fill="#0A1636" />
      <g transform="translate(16 15)">
        <path d={U} fill="#AECAE3" />
        <path d={EMBER} fill="#F0B888" />
      </g>
    </svg>
  );
}
