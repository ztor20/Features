/* reveal.js — Ztor 2.0 shared scroll-reveal module (single source of truth).
   Replaces the reveal half of the inline IIFE copy-pasted across ~68 pages.
   Reads the motion scale from tokens.css (--ease-*, --dur-*, --reveal-y-*,
   --stagger-*, --seq-*) via getComputedStyle, with literal fallbacks so it
   still works if loaded before the stylesheet parses.

   Hooks (unchanged from the old inline version):
     [data-reveal-section]  header cascade — eyebrow→title→sub→cta (role-sequenced)
     [data-reveal-stack]    card grid stagger (capped cascade)
     [data-tagline-split]   footer tagline per-character wave
     [data-bar-fill]        fundbar grow (transform:scaleX, GPU — not width)

   NOT owned here (keep page-specific, e.g. in a page-fx.js): hero carousel,
   score-orb count-ups, parallax tilt, particle constellation, section-link beckon.

   Reduced-motion → paint finals, no movement. GSAP absent → paint finals, bail. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE  = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  var cs = getComputedStyle(document.documentElement);
  function tok(name, fb) { var v = cs.getPropertyValue(name).trim(); return v || fb; }
  function ms(name, fb) {                    /* "440ms" | "0.44s" -> seconds */
    var v = tok(name, fb);
    if (v.indexOf('ms') > -1) return parseFloat(v) / 1000;
    if (v.indexOf('s')  > -1) return parseFloat(v);
    return parseFloat(v) / 1000;
  }
  function px(name, fb) { return parseFloat(tok(name, fb)) || 0; }

  var EASE_OUT    = tok('--ease-out',    'cubic-bezier(0.16,1,0.3,1)');
  var EASE_SETTLE = tok('--ease-settle', 'cubic-bezier(0.22,1,0.36,1)');
  var DUR = {
    xs:  ms('--dur-xs',  '360ms'),
    sm:  ms('--dur-sm',  '440ms'),
    md:  ms('--dur-md',  '520ms'),
    tag: ms('--dur-tag', '460ms')
  };
  var Y = {
    sm: MOBILE ? px('--reveal-y-sm-m', '8px')  : px('--reveal-y-sm', '12px'),
    md: MOBILE ? px('--reveal-y-md-m', '12px') : px('--reveal-y-md', '16px'),
    lg: MOBILE ? px('--reveal-y-lg-m', '14px') : px('--reveal-y-lg', '20px')
  };
  var STAGGER     = MOBILE ? ms('--stagger-base-m', '38ms') : ms('--stagger-base', '60ms');
  var STAGGER_TAG = MOBILE ? ms('--stagger-tag-m',  '16ms') : ms('--stagger-tag',  '26ms');
  var SEQ = {
    eyebrow: ms('--seq-eyebrow', '0ms'),
    title:   ms('--seq-title',  '90ms'),
    sub:     ms('--seq-sub',   '160ms'),
    media:   ms('--seq-media', '210ms'),
    cta:     ms('--seq-cta',   '260ms')
  };

  function paintFinals() {
    document.querySelectorAll('[data-bar-fill]').forEach(function (el) {
      var pct = parseInt(el.getAttribute('data-bar-fill'), 10) || 0;
      el.style.transformOrigin = 'left center';
      el.style.transform = 'scaleX(' + (pct / 100) + ')';
    });
    /* reveals/tagline: natural opacity:1 is the resting state — nothing to do */
  }

  if (REDUCED || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    paintFinals();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  gsap.defaults({ ease: EASE_OUT, duration: DUR.sm });
  document.documentElement.classList.add('js-reveal-ready');

  /* 1. Section header — role-sequenced cascade */
  document.querySelectorAll('[data-reveal-section]').forEach(function (section) {
    var eyebrow = section.querySelector('.section-eyebrow, .page-head__title');
    var title   = section.querySelector('.section-header__title');
    var sub     = section.querySelector('.section-header__sub, .page-head__desc, .page-head__info');
    var link    = section.querySelector('.section-link');
    var tabs    = section.querySelector('.glass-tabs');

    var groups = [
      { els: [eyebrow],    y: Y.sm, dur: DUR.xs, delay: SEQ.eyebrow },
      { els: [title],      y: Y.md, dur: DUR.sm, delay: SEQ.title },
      { els: [sub],        y: Y.md, dur: DUR.sm, delay: SEQ.sub },
      { els: [link, tabs], y: Y.sm, dur: DUR.xs, delay: SEQ.cta }
    ].map(function (g) { g.els = g.els.filter(Boolean); return g; })
     .filter(function (g) { return g.els.length; });
    if (!groups.length) return;

    groups.forEach(function (g) { gsap.set(g.els, { opacity: 0, y: g.y }); });

    ScrollTrigger.create({
      trigger: section, start: 'top 72%', once: true,
      onEnter: function () {
        groups.forEach(function (g) {
          gsap.to(g.els, {
            opacity: 1, y: 0, duration: g.dur, delay: g.delay,
            ease: EASE_OUT, clearProps: 'transform'
          });
        });
      }
    });
  });

  /* 2. Card grid — calmest move, cascade capped so long grids don't drag */
  document.querySelectorAll('[data-reveal-stack]').forEach(function (grid) {
    var cards;
    if (grid.classList.contains('ai-mosaic__grid')) cards = grid.querySelectorAll('.ai-mosaic__tile');
    else if (grid.classList.contains('news-grid'))  cards = grid.querySelectorAll('.news-card--hero, .news-card--list');
    else cards = grid.children;
    cards = Array.prototype.slice.call(cards);
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: Y.lg });
    ScrollTrigger.create({
      trigger: grid, start: 'top 78%', once: true,
      onEnter: function () {
        gsap.to(cards, {
          opacity: 1, y: 0, duration: DUR.md, ease: EASE_OUT,
          stagger: { amount: Math.min(cards.length, 6) * STAGGER, from: 'start' },
          clearProps: 'transform'
        });
      }
    });
  });

  /* 3. Footer tagline — per-char, subtle travel, heavier settle curve */
  (function taglineSplit() {
    var tagline = document.querySelector('[data-tagline-split]');
    if (!tagline) return;
    var text = tagline.textContent;
    tagline.textContent = '';
    var spans = Array.from(text).map(function (ch) {
      var s = document.createElement('span');
      s.className = 'tagline-char';
      s.textContent = ch === ' ' ? ' ' : ch;
      tagline.appendChild(s);
      return s;
    });
    gsap.set(spans, { opacity: 0, y: Y.sm });
    ScrollTrigger.create({
      trigger: tagline, start: 'top 82%', once: true,
      onEnter: function () {
        gsap.to(spans, { opacity: 1, y: 0, duration: DUR.tag, ease: EASE_SETTLE, stagger: STAGGER_TAG });
      }
    });
  })();

  /* 4. Fundbar — transform:scaleX (GPU), never width (layout thrash) */
  document.querySelectorAll('[data-bar-fill]').forEach(function (el) {
    var pct = parseInt(el.getAttribute('data-bar-fill'), 10) || 0;
    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () { gsap.to(el, { scaleX: pct / 100, duration: DUR.md, ease: EASE_OUT, delay: 0.1 }); }
    });
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
