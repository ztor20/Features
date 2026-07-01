/* liquid-glass.js — FAITHFUL 1:1 port of the 21st.dev "Apple Tahoe liquid glass
   button" (easemize) refraction, inspected live and replicated exactly.
   ────────────────────────────────────────────────────────────────────────
   21st.dev uses ONE shared SVG filter with primitiveUnits="objectBoundingBox",
   so the displacement is normalised to each element's own box — one filter + one
   map works for every size (button, pill, navs), no per-element baking.

   Their exact filter graph (verbatim):
     <filter id="liquid-glass" primitiveUnits="objectBoundingBox">
       <feImage href="<displacement map>" width="100%" height="100%"
                preserveAspectRatio="none" result="map"/>
       <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur"/>
       <feDisplacementMap in="blur" in2="map" scale="0.5"
                          xChannelSelector="R" yChannelSelector="G"/>
     </filter>

   The displacement map is 21st.dev's own asset (assets/liquid-glass-map.webp,
   extracted from their component). The lens material — background:white 5% +
   backdrop-filter:blur(8px) url(#liquid-glass) saturate(1.5) + the 10-layer
   specular box-shadow — lives in CSS (tokens.css + 52-liquid-glass-refraction.css).

   This file only (1) injects the filter — it MUST be live in the DOM (not
   display:none) for url(#…) to resolve — and (2) flips html.glass-refract so the
   CSS opts the surfaces in. Ungated, exactly like 21st.dev; the plain frost in the
   component CSS is the fallback for any engine that can't render url() backdrops. */
(function () {
  'use strict';

  var mq = window.matchMedia;
  if (mq && (mq('(prefers-reduced-transparency: reduce)').matches ||
             mq('(prefers-contrast: more)').matches)) return;   // a11y → frost only

  // The REFRACTION (backdrop-filter: url() feDisplacementMap) renders ONLY in
  // Chromium. Safari + Firefox never implemented it (WebKit bug #245510, open
  // since 2022) and the url() can take the WHOLE backdrop-filter down with it —
  // which is why the glass went "totally transparent" on iOS. So gate it: non-
  // Chromium engines never get .glass-refract and keep the clean blur(8px)
  // saturate() frost from the component CSS (no url() to break). iOS Chrome is
  // WebKit under the hood, so exclude iOS too.
  var uad = navigator.userAgentData;
  var isChromium =
    !!(uad && uad.brands && uad.brands.some(function (b) {
      return b.brand === 'Chromium' || b.brand === 'Google Chrome';
    })) ||
    (typeof HTMLScriptElement !== 'undefined' && !!HTMLScriptElement.supports &&
     HTMLScriptElement.supports('speculationrules'));
  if (!isChromium || /iP(hone|ad|od)/.test(navigator.userAgent)) return;

  function init() {
    if (!document.getElementById('liquid-glass')) {
      var wrap = document.createElement('div');
      wrap.id = 'lg-defs';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
      wrap.innerHTML =
        '<svg width="0" height="0">' +
          '<filter id="liquid-glass" primitiveUnits="objectBoundingBox">' +
            '<feImage result="map" x="0" y="0" width="100%" height="100%" ' +
              'preserveAspectRatio="none" href="assets/liquid-glass-map.webp"/>' +
            '<feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur"/>' +
            '<feDisplacementMap in="blur" in2="map" scale="0.5" ' +
              'xChannelSelector="R" yChannelSelector="G"/>' +
          '</filter>' +
        '</svg>';
      (document.body || document.documentElement).appendChild(wrap);
    }
    document.documentElement.classList.add('glass-refract');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
