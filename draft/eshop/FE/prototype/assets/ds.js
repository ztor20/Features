/* ============================================================
   Ztor 2.0 — Design-System Runtime  (ds.js)
   ------------------------------------------------------------
   The component registry. Behaviour is keyed to a component's
   selector (a class or data-* hook), registered ONCE here, and
   auto-attached to every matching element on every page —
   including elements injected later (JS-rendered grids, drawers).

   WHY THIS EXISTS
   Before this, a component's animation/behaviour was either
   page-keyed CSS (`body.rf-x .thing`) or copy-pasted inline
   <script> per page — so behaviour got left behind when the
   component moved to a new page. Here, behaviour follows the
   COMPONENT, not the page. Drop the markup anywhere → it works.

   HOW TO ADD A COMPONENT BEHAVIOUR
     DS.register('fundbar', '.cocreation-card__bar-fill[data-bar-fill]', function (el) {
       // el is a fresh, not-yet-initialised match. Wire it.
     });
   That's it. Load order: ds.js loads on every page (after
   components.css, before other component scripts) so later
   scripts can call DS.register before/after DOM ready safely.

   CONTRACT
   - init(el) runs exactly once per element (WeakSet-guarded).
   - Register any time; late registrations back-scan the document.
   - A throwing init never breaks other components (isolated).
   - Honour prefers-reduced-motion inside each init.
   See COMPONENTS.md for the full catalogue + variant convention.
   ============================================================ */
window.DS = (function () {
  'use strict';

  var registry = [];           // { name, selector, init }
  var initialised = new WeakSet();
  var started = false;

  function initOne(comp, el) {
    if (initialised.has(el)) return;
    initialised.add(el);
    try { comp.init(el); }
    catch (e) { if (window.console) console.warn('[DS] ' + comp.name + ' init failed', e, el); }
  }

  /* Scan a subtree and init every match for every registered component. */
  function scan(root) {
    root = root || document;
    for (var i = 0; i < registry.length; i++) {
      var comp = registry[i];
      var nodes = root.querySelectorAll(comp.selector);
      for (var j = 0; j < nodes.length; j++) initOne(comp, nodes[j]);
      /* root itself may match (MutationObserver hands us the added node) */
      if (root.nodeType === 1 && root.matches && root.matches(comp.selector)) initOne(comp, root);
    }
  }

  /* Register a component behaviour. Safe before or after DOM ready. */
  function register(name, selector, init) {
    if (typeof selector === 'function') { init = selector; selector = name; }
    var comp = { name: name, selector: selector, init: init };
    registry.push(comp);
    if (started) {                       // late registration → back-scan now
      var nodes = document.querySelectorAll(selector);
      for (var k = 0; k < nodes.length; k++) initOne(comp, nodes[k]);
    }
    return DS;
  }

  function start() {
    if (started) return;
    started = true;
    scan(document);
    /* Auto-attach to anything added later: JS-rendered grids, drawers,
       injected cards. This is what makes "add a component to any page"
       work with zero per-page wiring. */
    if ('MutationObserver' in window) {
      new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var added = mutations[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            if (added[j].nodeType === 1) scan(added[j]);
          }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  var DS = { register: register, scan: scan, get reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } };
  return DS;
})();

/* ============================================================
   REGISTERED COMPONENTS
   (Behaviours migrate here from inline/page scripts one by one.
    Each is idempotent and reduced-motion-safe.)
   ============================================================ */

/* fundbar — crowdfunding/presale progress bar grows 0 → target on
   reveal. Replaces index's GSAP copy + cocreate's inline IO copy.
   Single owner now: works on ANY page the card appears (incl. the
   mobile copies that previously had static bars). */
DS.register('fundbar', '.cocreation-card__bar-fill[data-bar-fill]', function (el) {
  var grow = function () {
    el.style.width = (parseInt(el.getAttribute('data-bar-fill'), 10) || 0) + '%';
  };
  if (DS.reduced || !('IntersectionObserver' in window)) { grow(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { grow(); io.unobserve(e.target); } });
  }, { threshold: 0.35 });
  io.observe(el);
});

/* ────────────────────────────────────────────────────────────
   zebra — brand stripe rhythm, COMPUTED not hand-typed.

   WHY THIS EXISTS
   Section backgrounds used to be hand-coded per <section>
   (section-bg-page = dark / section-bg-surface = brand-yellow).
   Insert or reorder ONE section and every stripe below it is
   silently wrong — exactly the off-by-one that the 探索愛情 banner
   caused. This derives the alternation from DOM order so it
   self-heals. That is the contract a CMS needs: the editor sets
   ORDER, the stripe colour follows automatically.

   OPT-IN  — only runs inside <main data-zebra-auto>; every other
   page keeps its hand-set classes until migrated.

   PER-SECTION CONTRACT  (data-zebra on a direct-child <section>):
     (absent)  → participates; alternates surface ↔ page
     "skip"    → ignored entirely (hero / full-bleed feature)
     "dark"    → pinned dark (cinema rail); does NOT consume a slot
     "hold"    → keeps its own background (e.g. the gradient banner)
                 but DOES consume a slot, so the rhythm stays in phase
   START PHASE — data-zebra-start="surface" (default) | "page".

   CMS NOTE: after injecting/reordering sections at runtime, call
   DS.scan(document) (or re-set the attribute) to recompute.
   ──────────────────────────────────────────────────────────── */
DS.register('zebra', 'main[data-zebra-auto]', function (main) {
  var startSurface = (main.getAttribute('data-zebra-start') || 'surface') !== 'page';
  var slot = 0;
  for (var n = main.firstElementChild; n; n = n.nextElementSibling) {
    if (n.tagName !== 'SECTION') continue;
    var mode = n.getAttribute('data-zebra');
    if (mode === 'skip') continue;
    n.classList.remove('section-bg-page', 'section-bg-surface');
    if (mode === 'dark') { n.classList.add('section', 'section-bg-page'); continue; }
    if (mode !== 'hold') {
      var even = (slot % 2 === 0);
      var surface = startSurface ? even : !even;
      n.classList.add('section', surface ? 'section-bg-surface' : 'section-bg-page');
    }
    slot++;   // 'hold' consumes a slot but paints nothing
  }
});

/* ────────────────────────────────────────────────────────────
   feed-tabs — primary feed filter (community / mobile-community).

   Owns the tab's VISUAL STATE + the sliding underline only. Clicking
   a tab moves --feed-active (0-based index) on the <nav>; CSS slides the
   single ::after bar to that segment (reduced-motion snaps it). --feed-count
   lets the bar width track any number of tabs.

   NOTE: this does NOT filter the feed yet — the list is static. When the
   feed becomes data-driven, hook the swap here (spec: new list fades in
   120ms ease-out, no stagger; data's already loaded, so no skeleton).
   ──────────────────────────────────────────────────────────── */
/* Card-expiry auto-slash — typing MM auto-inserts "/" → MM/YY. Site-wide via the
   exp input name (mock-pay + cocreate payment forms, and any future one). */
DS.register('exp-autoslash', 'input[name="exp"]', function (el) {
  el.setAttribute('inputmode', 'numeric');
  el.setAttribute('maxlength', '5');
  el.addEventListener('input', function (e) {
    var d = el.value.replace(/\D/g, '').slice(0, 4);
    el.value = (d.length > 2 || (d.length === 2 && e.inputType !== 'deleteContentBackward'))
      ? d.slice(0, 2) + '/' + d.slice(2)
      : d;
  });
});

DS.register('feed-tabs', '.feed-tabs', function (nav) {
  var tabs = nav.querySelectorAll('.feed-tab');
  if (!tabs.length) return;
  nav.style.setProperty('--feed-count', tabs.length);

  var setActive = function (i) {
    for (var k = 0; k < tabs.length; k++) {
      tabs[k].classList.toggle('feed-tab--active', k === i);
    }
    nav.style.setProperty('--feed-active', i);
  };

  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].classList.contains('feed-tab--active')) {
      nav.style.setProperty('--feed-active', i);   // sync bar to the shipped-active tab
    }
    (function (idx) {
      tabs[idx].addEventListener('click', function () { setActive(idx); });
    })(i);
  }
});

/* ────────────────────────────────────────────────────────────
   lib-filter — 我的片庫 section filter (the .glass-tabs sub-nav).

   A personal library is a return-with-intent surface: "just show my 共創".
   全部 (all) = the stacked-rail overview; a specific chip scopes the view to
   ONE category, so each section keeps its own card anatomy (Letterboxd model,
   not Spotify's flat list). 繼續觀看 is the overview hero — it shows only under
   全部, never under a specific chip.

   Markup contract:
     nav[data-lib-filter-nav] > button[data-lib-filter="all|<cat>"]
     .library-row[data-lib-cat="<cat>"]   (continue = "continue")
   ──────────────────────────────────────────────────────────── */
DS.register('lib-filter', '[data-lib-filter-nav]', function (nav) {
  var scope = nav.closest('.section') || document;
  var rows = scope.querySelectorAll('.library-row[data-lib-cat]');
  var btns = nav.querySelectorAll('[data-lib-filter]');
  if (!rows.length || !btns.length) return;

  function apply(filter) {
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var show = filter === 'all' ? true : row.getAttribute('data-lib-cat') === filter;
      row.hidden = !show;
      /* Guarantee visibility: a section we promote to the top may never have
         tripped its scroll-reveal (it was below the fold). Clear the gsap-set
         opacity/transform so it can't stay invisible. Only on show, and only
         on click (never at load) so the initial entrance animation survives. */
      if (show) {
        var hidden = row.querySelectorAll('.page-head__title, [data-reveal-stack] > *');
        for (var h = 0; h < hidden.length; h++) {
          hidden[h].style.opacity = '';
          hidden[h].style.transform = '';
        }
      }
    }
  }

  for (var i = 0; i < btns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        for (var k = 0; k < btns.length; k++) {
          btns[k].classList.toggle('glass-tabs__item--active', btns[k] === btn);
        }
        apply(btn.getAttribute('data-lib-filter'));
      });
    })(btns[i]);
  }
});

/* ────────────────────────────────────────────────────────────
   shop-subnav — creator shop inner-page tabs (商品 / 套組 / 拍賣).

   A secondary .glass-tabs row inside the creator 商店 section. Each tab maps
   to one [data-shop-panel] grid (goods / bundles / auction); the panels are
   rendered up-front by shop-render and this just toggles which is visible.

   Markup contract:
     nav[data-shop-subnav] > button[data-shop-tab="goods|bundles|auction"]
     .shop-grid[data-shop-panel="goods|bundles|auction"]
   ──────────────────────────────────────────────────────────── */
DS.register('shop-subnav', '[data-shop-subnav]', function (nav) {
  var scope = nav.closest('.section') || document;
  var panels = scope.querySelectorAll('[data-shop-panel]');
  var btns = nav.querySelectorAll('[data-shop-tab]');
  if (!panels.length || !btns.length) return;

  function show(tab) {
    for (var p = 0; p < panels.length; p++) {
      panels[p].hidden = panels[p].getAttribute('data-shop-panel') !== tab;
    }
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  for (var i = 0; i < btns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        for (var k = 0; k < btns.length; k++) {
          btns[k].classList.toggle('shop-filter__item--active', btns[k] === btn);
        }
        show(btn.getAttribute('data-shop-tab'));
      });
    })(btns[i]);
  }
});

/* ────────────────────────────────────────────────────────────
   header-dropdown — language picker + profile menu open/close.

   MIGRATED from a per-page inline <script> that was copy-pasted onto
   69 pages. That duplication is exactly where the language-switcher
   rot lived — behaviour stranded per page instead of following the
   component. Now ONE owner: drop a [data-dropdown-trigger] +
   [data-dropdown] pair inside a .header__popover-anchor on ANY page
   (incl. future ones) and it works, with zero per-page wiring.

   We register the TRIGGER selector, never the panel, so the panel can
   be portaled to <body> without the global MutationObserver re-firing
   this init (the moved node carries no [data-dropdown-trigger]). The
   header owns a backdrop-filter stacking context, so the glass panel
   must escape it to blur the page behind — we portal LAZILY on first
   open (Carmack: never mutate the DOM at attach-time under a sitewide
   childList observer), and only the variant the user actually opens.

   i18n.js owns the language apply + active tick; choosing a language
   here only confirms-and-dismisses. Outside-click / Esc / focus-out /
   reposition are bound once, globally.
   ──────────────────────────────────────────────────────────── */
(function () {
  if (!window.DS) return;
  var openPanel = null;   // at most one panel open across all triggers

  function position(trigger, panel) {
    var r = trigger.getBoundingClientRect();
    var top = r.bottom + 16;
    panel.style.position = 'fixed';
    panel.style.top = top + 'px';
    panel.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
    panel.style.left = 'auto';
    /* cap to viewport so a tall menu scrolls internally, never spills */
    panel.style.maxHeight = (window.innerHeight - top - 16) + 'px';
  }
  function hide(panel) {
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    if (panel.__trigger) panel.__trigger.setAttribute('aria-expanded', 'false');
    if (openPanel === panel) openPanel = null;
  }
  function closeOpen() { if (openPanel) hide(openPanel); }

  DS.register('header-dropdown', '[data-dropdown-trigger]', function (trigger) {
    var anchor = trigger.closest('.header__popover-anchor');
    if (!anchor) return;
    var panel = anchor.querySelector('[data-dropdown]');
    if (!panel) return;
    trigger.__panel = panel;
    panel.__trigger = trigger;
    var portaled = false;

    function ensurePortaled() {
      if (portaled) return;
      document.body.appendChild(panel);   // escape the header's backdrop-filter context
      portaled = true;
    }
    function show() {
      if (openPanel === panel) return;
      closeOpen();
      ensurePortaled();
      position(trigger, panel);
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      openPanel = panel;
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      (openPanel === panel) ? hide(panel) : show();
    });

    /* Language menu: a choice confirms + dismisses. i18n's capture
       listener performs the actual translate; we only close. */
    if (panel.getAttribute('data-dropdown') === 'lang') {
      panel.addEventListener('click', function (e) {
        if (e.target.closest('[data-lang]')) hide(panel);
      });
    }
  });

  /* Global dismiss + reposition — bound once, keyed off the open panel. */
  document.addEventListener('click', function (e) {
    if (!openPanel) return;
    if (e.target.closest('[data-dropdown-trigger]') || e.target.closest('[data-dropdown]')) return;
    closeOpen();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOpen();
  });
  document.addEventListener('focusin', function (e) {
    if (!openPanel) return;
    if (openPanel.contains(e.target)) return;
    if (openPanel.__trigger && openPanel.__trigger.contains(e.target)) return;
    closeOpen();
  });
  function reposition() {
    if (openPanel && openPanel.__trigger) position(openPanel.__trigger, openPanel);
  }
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, { passive: true });
})();

/* ============================================================
   Global overlay scroll-lock — iOS-safe, ref-counted by body class.
   ------------------------------------------------------------
   THE PROBLEM: `overflow:hidden` on <body> does NOT stop touch
   scrolling on iOS Safari, so the page behind a drawer / sheet /
   menu still scrolled on phones. Only the cart had a real lock.
   THE FIX (systematic, not per-overlay): ONE controller watches
   <body> for ANY take-over-overlay class and applies the proven
   position:fixed technique (which DOES hold on iOS), saving and
   restoring the scroll position. An overlay gets a full background
   lock simply by following the convention — add its `*-open` class
   to <body>. No per-overlay lock code; no double-lock on nested
   overlays (lock once while ANY class is present, release when none).
   ============================================================ */
(function () {
  var LOCK_CLASSES = ['cart-open', 'ds-drawer-open', 'mdrawer-open', 'ds-zoom-open', 'sheet-open'];
  function setup() {
    var body = document.body;
    var locked = false, savedY = 0;
    function anyOpen() {
      for (var i = 0; i < LOCK_CLASSES.length; i++) {
        if (body.classList.contains(LOCK_CLASSES[i])) return true;
      }
      return false;
    }
    function lock() {
      if (locked) return;
      locked = true;
      savedY = window.scrollY || window.pageYOffset || 0;
      var sbw = window.innerWidth - document.documentElement.clientWidth;  // scrollbar width (desktop)
      var s = body.style;
      s.position = 'fixed';
      s.top = (-savedY) + 'px';
      s.left = '0';
      s.right = '0';
      s.width = '100%';
      if (sbw > 0) s.paddingRight = sbw + 'px';   // no layout shift when the scrollbar disappears
    }
    function unlock() {
      if (!locked) return;
      locked = false;
      var s = body.style;
      s.position = ''; s.top = ''; s.left = ''; s.right = ''; s.width = ''; s.paddingRight = '';
      window.scrollTo(0, savedY);
    }
    function sync() { anyOpen() ? lock() : unlock(); }
    new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['class'] });
    sync();   // catch an overlay already open at load
  }
  if (document.body) setup();
  else document.addEventListener('DOMContentLoaded', setup);
})();
