"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { LightboxProvider, useLightbox } from "./Lightbox";
import { cld, slugify } from "@/lib/format";

const textOf = (node: ReactNode): string =>
  Children.toArray(node)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement(c) ? textOf((c.props as { children?: ReactNode }).children) : ""))
    .join("");

function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, theme: "neutral", fontFamily: "inherit", securityLevel: "strict" });
        const { svg } = await mermaid.render(`m${id}`, chart);
        if (alive) setSvg(svg);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [chart, id]);
  if (failed) return <pre className="code"><code>{chart}</code></pre>;
  return <div className="mermaid-wrap" dangerouslySetInnerHTML={{ __html: svg }} />;
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="code-block">
      <div className="code-head">
        <span>{lang || "code"}</span>
        <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function Body({ source }: { source: string }) {
  const { open } = useLightbox();
  const ref = useRef<HTMLDivElement>(null);

  const zoom = (src: string) => {
    const imgs = Array.from(ref.current?.querySelectorAll<HTMLImageElement>("img[data-zoom]") ?? []);
    const items = imgs.map((i) => ({ src: i.dataset.zoom!, alt: i.alt }));
    open(items, Math.max(0, items.findIndex((i) => i.src === src)));
  };

  const heading = (Tag: "h2" | "h3" | "h4") =>
    function H({ children }: { children?: ReactNode }) {
      const id = slugify(textOf(children));
      return (
        <Tag id={id}>
          <a href={`#${id}`} className="anchor" aria-hidden="true">#</a>
          {children}
        </Tag>
      );
    };

  const components: Components = {
    h1: heading("h2"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    a: ({ href = "", children }) => {
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
    img: ({ src = "", alt = "" }) => {
      const s = typeof src === "string" ? src : "";
      const big = cld(s, 2000);
      return (
        <span className="md-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cld(s, 1400)} alt={alt} loading="lazy" data-zoom={big} onClick={() => zoom(big)} />
          {alt && <span className="md-caption">{alt}</span>}
        </span>
      );
    },
    table: ({ children }) => (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    ),
    pre: ({ children }) => {
      const child = Children.only(children) as React.ReactElement<{ className?: string; children?: ReactNode }>;
      const lang = /language-(\w+)/.exec(child?.props?.className || "")?.[1] ?? "";
      const code = textOf(child?.props?.children).replace(/\n$/, "");
      if (lang === "mermaid") return <Mermaid chart={code} />;
      return <CodeBlock lang={lang} code={code} />;
    },
  };

  return (
    <div className="prose" ref={ref}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}

/** Renders project and journal content written in Markdown (GFM tables, code, Mermaid diagrams, zoomable images). */
export default function Markdown({ source }: { source: string }) {
  return (
    <LightboxProvider>
      <Body source={source} />
    </LightboxProvider>
  );
}
