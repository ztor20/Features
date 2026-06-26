import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import { MermaidRender } from "@/components/MermaidRender";

export const metadata = {
  title: "Ztor Watch Party — BRD (v2)",
  description: "Business requirements for Ztor Watch Party, rendered from the repo markdown.",
};

// Rendered from the canonical markdown in _docs/BRD — single source of truth.
const SECTIONS = [
  { id: "summary", label: "Summary · flows · BR", file: "_docs/BRD/watch-party/Summary.md" },
  { id: "feature", label: "Feature spine", file: "_docs/BRD/watch-party/_feature.md" },
  { id: "bo", label: "Back Office", file: "_docs/BRD/watch-party/BO.md" },
  { id: "frontend", label: "Frontend", file: "_docs/BRD/watch-party/Frontend.md" },
  { id: "emails", label: "Email templates", file: "_docs/BRD/watch-party/email-templates.md" },
  { id: "contract", label: "Shared contract", file: "_docs/BRD/_shared-contract.md" },
  { id: "review", label: "Critic review", file: "_docs/BRD/watch-party/_review.md" },
];

function render(file: string): string {
  try {
    const md = readFileSync(join(process.cwd(), file), "utf8");
    return marked.parse(md, { async: false, gfm: true }) as string;
  } catch {
    return `<p style="color:#9a9a9a">(missing: ${file})</p>`;
  }
}

export default function BrdPage() {
  const rendered = SECTIONS.map((s) => ({ ...s, html: render(s.file) }));

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-line px-4 sm:px-6 py-3 flex items-center gap-3">
        <div className="text-lg font-semibold">
          ztor<span className="text-accent">.</span>
          <span className="text-[10px] ml-1.5 align-top text-muted tracking-widest">WATCH PARTY · BRD v2</span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs">
          <Link href="/overview" className="text-muted hover:text-text">📋 Business overview</Link>
          <a href="/solution-architecture.html" className="text-muted hover:text-text">🎥 Solution diagram</a>
          <Link href="/bo" className="text-muted hover:text-text">⚙ Back office</Link>
          <Link href="/" className="text-muted hover:text-text">← Site</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[200px_1fr] gap-8">
        {/* Sidebar nav */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 text-sm space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted mb-2">Contents</div>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block px-3 py-1.5 rounded-md text-muted hover:text-text hover:bg-surface"
              >
                {s.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-line text-[11px] text-muted/70 leading-relaxed px-3">
              Rendered from the repo&rsquo;s <code className="text-muted">_docs/BRD</code> markdown — the single source of truth.
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Ztor Watch Party — BRD v2</h1>
            <p className="text-sm text-muted mt-2 max-w-2xl">
              Built with the <code>/ztor-brd</code> skill (whole feature). Reconciles the two 2026-06-22 meetings.
              Mobbin baseline: Posh event admin (BO) + Hulu Watch Party (Frontend). Fresh-context critic verdict: PASS.
            </p>
            <p className="text-sm mt-3">
              <a href="#summary" className="text-accent hover:text-accentLight">↓ Start with the Summary — user flows, all business requirements (BR) & email templates</a>
              <span className="text-muted"> — the rest is the full, AI-buildable spec for the dev team.</span>
            </p>
          </div>

          {rendered.map((s) => (
            <section key={s.id} id={s.id} className="mb-12">
              <div className="brd-prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}
        </main>
      </div>

      <MermaidRender />

      <footer className="border-t border-line px-6 py-8 text-center text-xs text-muted">
        Ztor Watch Party BRD v2 · rendered from <code>_docs/BRD</code> · prototype at{" "}
        <Link href="/bo" className="text-accent">/bo</Link>
      </footer>
    </div>
  );
}
