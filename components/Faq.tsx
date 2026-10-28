/** Accessible FAQ list using native <details>; content stays in the HTML for search engines. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} className="faq-item" open={i === 0}>
          <summary>
            <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="faq-q">{f.q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p className="faq-a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
