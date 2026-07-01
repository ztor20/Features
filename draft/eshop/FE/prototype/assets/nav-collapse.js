/* ============================================================
   nav-collapse.js — when a SNAPPED filter/type nav is wider than the screen, collapse it to a
   compact "[active] ⌄" trigger; tap opens a dropdown panel with the full list.

   Pairs with sticky-tabs.js (it only READS the `.is-pinned` class sticky-tabs sets on the host —
   it never touches the scroll/stick logic, so it can't regress it). Isolated on purpose.

   Behaviour:
     • At rest: untouched — the nav shows its full bar/pill.
     • Snapped + the nav OVERFLOWS the viewport: collapse → show only a trigger (the active item's
       label + a chevron). Tap → the real item list drops down as a glass panel (vertical, scrolls
       if very long). Pick one → its own handler runs (filter or navigate) → panel closes.
     • Snapped + fits, or not snapped: no trigger, normal pill.
   ============================================================ */
(function () {
  'use strict';
  if (window.__ztorNavCollapse) return;
  window.__ztorNavCollapse = true;

  var units = [];   // [{ tabstick, pill, trigger, label, overflow }]

  function activeItem(pill) {
    return pill.querySelector('.glass-tabs__item--active, .shop-filter__item--active') ||
           pill.querySelector('.glass-tabs__item, .shop-filter__item');
  }

  // Overflow = would the single-line list exceed the viewport? Measure the items' intrinsic widths
  // (they're visible at rest, even when the bar wraps), independent of the collapsed display state.
  function computeOverflow(pill) {
    var items = pill.querySelectorAll('.glass-tabs__item, .shop-filter__item');
    var total = 0;
    for (var i = 0; i < items.length; i++) total += items[i].getBoundingClientRect().width;
    total += items.length * 16;                 // approx gaps + pill padding
    return total > (window.innerWidth - 24);
  }

  function syncLabel(u) {
    var a = activeItem(u.pill);
    if (a && u.label) u.label.textContent = a.textContent.trim();
  }

  function hostOf(ts) {
    if (ts.classList.contains('tabstick-host')) return ts;
    var p = ts.parentElement;
    return (p && p.classList.contains('tabstick-host')) ? p : ts;
  }

  function refresh(u) {
    var pinned = hostOf(u.tabstick).classList.contains('is-pinned');
    var collapse = pinned && u.overflow;
    u.tabstick.classList.toggle('is-collapsed', collapse);
    if (!collapse) u.tabstick.classList.remove('is-open');
    else syncLabel(u);
  }

  function open(u, on) {
    if (on == null) on = !u.tabstick.classList.contains('is-open');
    closeAll(u);
    u.tabstick.classList.toggle('is-open', on);
  }
  function closeAll(except) {
    units.forEach(function (u) { if (u !== except) u.tabstick.classList.remove('is-open'); });
  }

  function init() {
    var tabsticks = Array.prototype.slice.call(document.querySelectorAll('.tabstick'));
    units = tabsticks.map(function (ts) {
      var pill = ts.querySelector('.glass-tabs, .shop-filter');
      if (!pill) return null;
      var u = { tabstick: ts, pill: pill, overflow: computeOverflow(pill) };

      // build the trigger once (hidden until collapsed via CSS)
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'nav-trigger';
      t.setAttribute('aria-haspopup', 'true');
      t.innerHTML = '<span class="nav-trigger__label"></span><span class="nav-trigger__chev" aria-hidden="true"></span>';
      t.addEventListener('click', function (e) { e.stopPropagation(); open(u); });
      ts.appendChild(t);
      u.trigger = t;
      u.label = t.querySelector('.nav-trigger__label');
      syncLabel(u);

      // picking an item closes the panel + re-syncs the trigger label (filter navs change active)
      pill.addEventListener('click', function (e) {
        if (e.target.closest('.glass-tabs__item, .shop-filter__item')) {
          u.tabstick.classList.remove('is-open');
          setTimeout(function () { syncLabel(u); }, 0);
        }
      });
      return u;
    }).filter(Boolean);

    // Re-evaluate collapse on scroll (sticky-tabs.js sets .is-pinned in its own rAF; we just read
    // it here, rAF-throttled). NO MutationObserver — toggling our own classes on the .tabstick must
    // not feed back into a re-trigger loop. Closing an open panel also rides the same scroll tick.
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        units.forEach(function (u) { refresh(u); if (u.tabstick.classList.contains('is-open')) u.tabstick.classList.remove('is-open'); });
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', function (e) { if (!e.target.closest('.tabstick.is-open')) closeAll(); });
    window.addEventListener('resize', function () {
      units.forEach(function (u) { u.overflow = computeOverflow(u.pill); refresh(u); });
    });
    units.forEach(refresh);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  // re-measure once fonts settle (zh-TW widths shift the overflow threshold)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    units.forEach(function (u) { u.overflow = computeOverflow(u.pill); refresh(u); });
  });
})();
