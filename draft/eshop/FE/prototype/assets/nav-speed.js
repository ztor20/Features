/* nav-speed.js — perceived-instant same-origin navigation (static MPA).
   Layered by engine, because no single mechanism covers both:
     • Chromium (Chrome/Edge/Samsung/Android) → Speculation Rules PRERENDER,
       eagerness "moderate" (hover / ~200ms pointer dwell). The destination is
       fully rendered AND i18n-applied in the background; tap = instant
       activation, no blank, no flash.
     • Safari / Firefox (no Speculation Rules) → pointerdown/touchstart PREFETCH
       warms the HTML in the HTTP cache so the real navigation skips the RTT.
   Same-origin document links only. Skips assets, downloads, new-tab, modified
   clicks, in-page #anchors, [data-no-prefetch], and metered (Save-Data) sessions. */
(function () {
  'use strict';

  var conn = navigator.connection;
  if (conn && conn.saveData) return;                 // respect data-saver

  var ASSET_RE = /\.(zip|pdf|jpg|jpeg|png|webp|avif|gif|svg|mp4|webm|mov|js|css|json|otf|woff2?|ico|txt|xml)($|[?#])/i;

  function eligible(a) {
    if (!a || !a.href) return false;
    if (a.origin !== location.origin) return false;             // same-origin only
    if (a.hasAttribute('download')) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('data-no-prefetch')) return false;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') return false;                   // in-page anchor
    if (ASSET_RE.test(a.pathname)) return false;                // not a document
    if (a.pathname === location.pathname && a.hash) return false;
    return true;
  }

  /* ── Chromium: Speculation Rules (prerender) ── */
  if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    var rules = {
      prerender: [{
        source: 'document',
        where: { and: [
          { href_matches: '/*' },
          { not: { selector_matches: '[data-no-prefetch]' } },
          { not: { selector_matches: '[target=_blank]' } },
          { not: { href_matches: '/*.{zip,pdf,jpg,jpeg,png,webp,avif,gif,svg,mp4,webm,mov,js,css,json,otf,woff,woff2,ico}' } }
        ] },
        eagerness: 'moderate'
      }]
    };
    var s = document.createElement('script');
    s.type = 'speculationrules';
    s.textContent = JSON.stringify(rules);
    document.head.appendChild(s);
    return;                                            // Chromium handled
  }

  /* ── Safari / Firefox: pointerdown / touchstart prefetch ── */
  var seen = Object.create(null);
  function prefetch(url) {
    if (seen[url]) return; seen[url] = 1;
    var l = document.createElement('link');
    l.rel = 'prefetch'; l.href = url; l.as = 'document';
    document.head.appendChild(l);
  }
  function onIntent(e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (eligible(a)) prefetch(a.href);
  }
  /* pointerdown fires ~80-120ms before click on touch — often covers the whole
     warm-CDN RTT before the finger lifts. touchstart + mouseover as backups. */
  var opts = { capture: true, passive: true };
  document.addEventListener('pointerdown', onIntent, opts);
  document.addEventListener('touchstart', onIntent, opts);
  document.addEventListener('mouseover', onIntent, opts);
})();
