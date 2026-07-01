/* ────────────────────────────────────────────
   shop-filter-sheet.js — MOBILE-ONLY shop nav restructure.

   On phones (≤767.98px), for every shop-umbrella page (商店/爆米花商店/創作者商店/
   活動/拍賣 and any page with a .shop-toolbar .shop-filter):
     • the shop-TYPE nav (.glass-tabs--push) + an injected filter icon share one
       PINNED row (nav left & scrolls, icon pinned right);
     • the per-page category filter (the 2nd nav) moves into a glass BOTTOM SHEET
       (multi-select, "顯示 X 件" apply, scrim, ~CSS-token timing, reduced-motion);
     • 兌換紀錄 (爆米花商店 only) is lifted above the pinned row, non-sticky;
     • applied filters show as removable chips above the grid.

   Desktop is untouched: the trigger/sheet/scrim/chips are CSS-hidden ≥768px, the
   added .shop-typenav-row class has no desktop rules, and the 兌換紀錄 DOM move is
   reverted above the breakpoint. Filtering is driven through the existing
   shop-render.js wireFilter() via barEl.__shopFilter — no second render path.
   ──────────────────────────────────────────── */
(function () {
  'use strict';

  var MQ = window.matchMedia('(max-width: 767.98px)');

  var FILTER_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<line x1="4" y1="7" x2="20" y2="7"/><line x1="7" y1="12" x2="17" y2="12"/>' +
    '<line x1="10" y1="17" x2="14" y2="17"/></svg>';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function init() {
    var nav = document.querySelector('nav.glass-tabs--push');
    var bar = document.querySelector('.shop-toolbar .shop-filter');
    if (!nav || !bar) return;                          // not a shop page
    var navTabstick = nav.closest('.tabstick');
    if (!navTabstick) return;

    // wireFilter() must have run (it sets __shopFilter). It runs in the page's
    // inline init*(); if we beat it, retry next frame.
    if (!bar.__shopFilter) { requestAnimationFrame(init); return; }
    if (navTabstick.__sheetWired) return;
    navTabstick.__sheetWired = true;

    var ctx = bar.__shopFilter;                          // { items, match, unit, countFor, apply }
    var unit = ctx.unit || '件';

    // categories from the inline bar (drop 全部 — that's the cleared state)
    var cats = Array.prototype.slice.call(bar.querySelectorAll('.shop-filter__item'))
      .map(function (b) { return b.getAttribute('data-cat'); })
      .filter(function (c) { return c && c !== '全部'; });

    var pinRow = navTabstick.closest('.popcorn-navrow') || navTabstick;
    var section = pinRow.parentNode;
    var toolbar = bar.closest('.shop-toolbar');     // present on every shop page

    /* ── pinned row: type nav + filter icon ── */
    navTabstick.classList.add('shop-typenav-row');
    var trigger = el('button', 'shop-filter-trigger',
      FILTER_ICON + '<span class="shop-filter-trigger__count" aria-hidden="true"></span>');
    trigger.type = 'button';
    trigger.setAttribute('aria-label', '篩選');
    trigger.setAttribute('aria-haspopup', 'dialog');
    navTabstick.appendChild(trigger);

    /* ── 兌換紀錄 (popcorn) → onto the TITLE row (title left, link right) on
       mobile; restored to its original spot on desktop. ── */
    var history = section.querySelector('.popcorn-history-link');
    var head = section.querySelector('.shop-head');
    var headTitle = head ? head.querySelector('.shop-head__title') : null;
    var histHome = null, histNext = null;
    if (history) { histHome = history.parentNode; histNext = history.nextSibling; }
    function placeHistory() {
      if (!history || !head || !headTitle) return;
      if (MQ.matches) {
        head.insertBefore(history, headTitle.nextSibling);    // right after the title
        head.classList.add('shop-head--with-action');
      } else {
        head.classList.remove('shop-head--with-action');
        if (histHome) histHome.insertBefore(history, histNext);
      }
    }

    /* ── active-filter chips (above the grid, after the now-hidden toolbar) ── */
    var chips = el('div', 'shop-active-filters');
    if (toolbar && toolbar.parentNode) toolbar.parentNode.insertBefore(chips, toolbar.nextSibling);
    else section.insertBefore(chips, pinRow.nextSibling);

    /* ── the bottom sheet + scrim (appended to body) ── */
    var scrim = el('div', 'shop-sheet-scrim');
    var sheet = el('div', 'shop-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-hidden', 'true');
    var title = (bar.getAttribute('aria-label') || '篩選');
    sheet.appendChild(el('h2', 'shop-sheet__title', title));
    var opts = el('div', 'shop-sheet__options');
    cats.forEach(function (c) {
      var o = el('button', 'shop-sheet__opt', c);
      o.type = 'button';
      o.setAttribute('data-cat', c);
      o.setAttribute('aria-pressed', 'false');
      opts.appendChild(o);
    });
    sheet.appendChild(opts);
    var apply = el('button', 'shop-sheet__apply');
    apply.type = 'button';
    sheet.appendChild(apply);
    sheet.appendChild(el('div', 'shop-sheet__grip'));   // bottom handle — swipe up to close
    document.body.appendChild(scrim);
    document.body.appendChild(sheet);

    /* ── state ── */
    var applied = [];          // committed selection (cats; [] = 全部)
    var pending = [];          // working selection while the sheet is open

    function applyLabel(n) { apply.textContent = '顯示 ' + n + ' ' + unit; }
    function syncOpts() {
      opts.querySelectorAll('.shop-sheet__opt').forEach(function (o) {
        o.setAttribute('aria-pressed', pending.indexOf(o.getAttribute('data-cat')) >= 0 ? 'true' : 'false');
      });
      applyLabel(ctx.countFor(pending));
    }
    function renderChips() {
      chips.innerHTML = '';
      applied.forEach(function (c) {
        var chip = el('span', 'shop-chip', '<span>' + c + '</span>');
        var x = el('button', 'shop-chip__x', '×');
        x.type = 'button';
        x.setAttribute('aria-label', '移除篩選：' + c);
        x.addEventListener('click', function () {
          applied = applied.filter(function (k) { return k !== c; });
          ctx.apply(applied);
          renderChips();
          updateBadge();
        });
        chip.appendChild(x);
        chips.appendChild(chip);
      });
    }
    function updateBadge() {
      var b = trigger.querySelector('.shop-filter-trigger__count');
      trigger.classList.toggle('has-active', applied.length > 0);
      if (b) b.textContent = applied.length;
    }

    function open() {
      pending = applied.slice();
      syncOpts();
      sheet.setAttribute('aria-hidden', 'false');
      // force reflow so the open transition runs from the off-screen state
      void sheet.offsetWidth;
      scrim.classList.add('is-open');
      sheet.classList.add('is-open');
      document.body.classList.add('sheet-open');   // joins the overlay convention → ds.js scroll-lock
    }
    function close() {
      scrim.classList.remove('is-open');
      sheet.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sheet-open');
    }

    trigger.addEventListener('click', open);
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) close();
    });
    /* swipe UP to dismiss the top sheet */
    var touchStartY = null;
    sheet.addEventListener('touchstart', function (e) { touchStartY = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchend', function (e) {
      if (touchStartY == null) return;
      var endY = (e.changedTouches[0] || {}).clientY;
      if (endY != null && touchStartY - endY > 40) close();
      touchStartY = null;
    }, { passive: true });
    opts.addEventListener('click', function (e) {
      var o = e.target.closest('.shop-sheet__opt');
      if (!o) return;
      var c = o.getAttribute('data-cat');
      var i = pending.indexOf(c);
      if (i >= 0) pending.splice(i, 1); else pending.push(c);
      syncOpts();                                   // count updates; grid does NOT (apply-only)
    });
    apply.addEventListener('click', function () {
      applied = pending.slice();
      ctx.apply(applied);                            // single render through shop-render
      renderChips();
      updateBadge();
      close();
    });

    /* keep the 兌換紀錄 placement correct across the breakpoint */
    placeHistory();
    if (MQ.addEventListener) MQ.addEventListener('change', placeHistory);
    else if (MQ.addListener) MQ.addListener(placeHistory);

    applyLabel(ctx.countFor([]));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
