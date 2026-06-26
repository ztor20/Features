"use client";

import { useEffect } from "react";

// Renders any ```mermaid fenced code blocks emitted by `marked` into SVG.
// marked outputs <pre><code class="language-mermaid">…</code></pre>; we swap each
// for a <div class="mermaid"> and run mermaid client-side. Dynamic import keeps
// mermaid out of the initial bundle.
const THEMES = {
  // Dark Ztor theme — used by /brd.
  dark: {
    darkMode: true,
    background: "#0e0e0e",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    primaryColor: "#1a1a1a",
    primaryBorderColor: "#b58850",
    primaryTextColor: "#e8e8e8",
    secondaryColor: "#222222",
    tertiaryColor: "#161616",
    lineColor: "#9a9a9a",
    edgeLabelBackground: "#0e0e0e",
  },
  // IBM Carbon light theme — used by the biz /overview.
  carbon: {
    darkMode: false,
    background: "#ffffff",
    fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
    primaryColor: "#ffffff",
    primaryBorderColor: "#0f62fe",
    primaryTextColor: "#161616",
    secondaryColor: "#f4f4f4",
    tertiaryColor: "#f4f4f4",
    lineColor: "#8d8d8d",
    edgeLabelBackground: "#ffffff",
    clusterBkg: "#f4f4f4",
    clusterBorder: "#e0e0e0",
  },
} as const;

export function MermaidRender({ variant = "dark" }: { variant?: keyof typeof THEMES }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const blocks = Array.from(
        document.querySelectorAll<HTMLElement>("pre > code.language-mermaid")
      );
      if (blocks.length === 0) return;

      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      blocks.forEach((code) => {
        const pre = code.parentElement;
        if (!pre) return;
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = code.textContent || "";
        pre.replaceWith(div);
      });

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        themeVariables: THEMES[variant],
      });

      try {
        await mermaid.run({ querySelector: ".mermaid" });
      } catch {
        /* a malformed diagram shouldn't break the page */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [variant]);

  return null;
}
