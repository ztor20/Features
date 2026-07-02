import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import { MermaidRender } from "@/components/MermaidRender";

export const metadata = {
  title: "Ztor Watch Party — Business Overview",
  description: "Lean, business-facing overview: user flows + what the product does. Rendered from the repo markdown.",
};

function slug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function render(file: string): string {
  let html: string;
  try {
    const md = readFileSync(join(process.cwd(), file), "utf8");
    html = marked.parse(md, { async: false, gfm: true }) as string;
  } catch {
    return `<p style="color:#6f6f6f">(missing: ${file})</p>`;
  }
  // Carbon touches on the marked output: heading anchors, mono BR ids, "Who" role pills.
  html = html.replace(/<h2>([^<]+)<\/h2>/g, (_m, t) => `<h2 id="${slug(t)}">${t}</h2>`);
  html = html.replace(/<td>(BR-\d+)<\/td>/g, '<td><span class="cell-mono">$1</span></td>');
  const who: Record<string, string> = {
    Ops: "who-ops", Host: "who-host", Fan: "who-fan", Automatic: "who-auto", Future: "who-future",
  };
  for (const [label, cls] of Object.entries(who)) {
    html = html.replace(
      new RegExp(`<td>${label}</td>`, "g"),
      `<td><span class="who ${cls}">${label}</span></td>`
    );
  }
  return html;
}

export default function OverviewPage() {
  const html = render("_docs/BRD/watch-party/Biz.md");

  return (
    <div className="carbon-doc">
      {/* IBM Plex — Carbon's typeface (matches the Beamco BRD) */}
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <header className="cb-shell">
        <div className="cb-inner">
          <div className="cb-title">
            Ztor Watch Party — Business Overview <span className="cb-tag">BIZ</span>
          </div>
          <div className="cb-sub">
            For the business team · user flows + what the product does · v3 · 2026-06-26
          </div>
          <nav className="cb-crumb">
            <a href="#user-flows">User flows</a>
            <a href="#what-the-product-does">Requirements</a>
            <a href="#email-notifications">Emails</a>
            <Link className="ext" href="/brd">Full dev BRD</Link>
            <Link className="ext" href="/bo">Back office</Link>
            <Link className="ext" href="/">Site</Link>
          </nav>
        </div>
      </header>

      <main className="cb-canvas">
        <div className="doc" dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <MermaidRender variant="carbon" />

      <footer className="cb-footer">
        Ztor Watch Party · business overview · the full technical spec is the{" "}
        <Link href="/brd" style={{ color: "#0f62fe" }}>dev BRD</Link>. Rendered from <code>_docs/BRD/watch-party/Biz.md</code>.
      </footer>
    </div>
  );
}
