/** Upforge mark: a U whose right arm rises into an arrow. Inherits colour from `currentColor`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <path d="M13 10v24a19 19 0 0 0 38 0v-12" stroke="currentColor" strokeWidth="9.5" strokeLinecap="butt" />
      <path d="M51 2 63.5 20h-25z" fill="currentColor" />
      <path d="M13 10h9.5" stroke="currentColor" strokeWidth="0" />
    </svg>
  );
}

/** Square app-icon version (admin, favicon-like contexts). */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="#0b1a3a" />
      <g transform="translate(4.6 5) scale(.36)" color="#AECAE3">
        <path d="M13 10v24a19 19 0 0 0 38 0v-12" stroke="currentColor" strokeWidth="9.5" fill="none" />
        <path d="M51 2 63.5 20h-25z" fill="currentColor" />
      </g>
    </svg>
  );
}
