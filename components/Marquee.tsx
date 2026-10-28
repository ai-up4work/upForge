import { stack } from "@/lib/content";

export default function Marquee() {
  const items = [...stack, ...stack];
  return (
    <div className="marquee" aria-label={`Technologies we use: ${stack.join(", ")}`}>
      <div className="marquee-track" aria-hidden="true">
        {items.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}
