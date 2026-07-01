/* ────────────────────────────────────────────
   ds-drawer — the canonical reusable drawer primitive (ds-drawer.js)
   ------------------------------------------------------------
   The COMPONENTS.md "drawer consolidation target", now real. A right /
   bottom slide-over dialog with scrim, Esc, scroll-lock, and a focus
   trap (trap + scroll-lock pattern lifted from mobile-nav.js's hamburger
   drawer so behaviour is identical across the site).

   Registers via the DS registry → auto-attaches to every [data-ds-drawer],
   including ones injected later (MutationObserver). Loads AFTER ds.js.

   MARKUP CONTRACT
     <div class="ds-drawer" data-ds-drawer="backing" aria-hidden="true">
       <div class="ds-drawer__scrim" data-ds-drawer-close></div>
       <aside class="ds-drawer__panel" role="dialog" aria-modal="true"
              aria-label="…"> … any content … </aside>
     </div>
   OPEN / CLOSE
     • Any control with [data-ds-drawer-open="<id>"] opens the drawer whose
       data-ds-drawer matches <id> (delegated; works on injected buttons).
     • Any element with [data-ds-drawer-close] inside the drawer closes it.
     • Esc closes; scrim click closes; body scroll locks while open.
     • Programmatic: el.dsDrawer.open() / .close() / .toggle(), or
       window.DSDrawer.open('<id>').
   ──────────────────────────────────────────── */
(function () {
  'use strict';
  if (!window.DS) return;            // ds.js must load first

  var openDrawers = [];              // stack, for Esc → close topmost
  var FORM_SEQ = 0;                  // unique ids for forms whose submit CTA we relocate

  function focusables(panel) {
    return Array.prototype.slice.call(panel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return el.offsetParent !== null; });
  }

  DS.register('ds-drawer', '[data-ds-drawer]', function (el) {
    var panel = el.querySelector('.ds-drawer__panel');
    if (!panel) return;
    var lastFocus = null;

    el.setAttribute('aria-hidden', 'true');     // closed at load — hidden from AT

    /* ── Pinned action bar (the canonical fix for "CTA below the fold") ──────
       Give the drawer a foot pinned to the panel bottom and keep the primary
       CTA OUT of the scrolling body. Every consumer (cocreate / completions /
       mock-pay) renders its CTA row as .cc-stepview__foot or .completion-foot
       inside .ds-drawer__body; we relocate that row into a flex-shrink:0
       .ds-drawer__foot sibling so it is always reachable. Relocating the node
       preserves its listeners (delegated OR directly-bound — both ride along);
       a submit button inside a <form> keeps submitting via a set `form` attr.
       ONE source for every drawer — no renderer / copy / handler edits. */
    var dsBody = panel.querySelector('.ds-drawer__body');
    var dsFoot = panel.querySelector('.ds-drawer__foot');
    if (dsBody && !dsFoot) {
      dsFoot = document.createElement('div');
      dsFoot.className = 'ds-drawer__foot ds-actionbar';
      dsFoot.setAttribute('hidden', '');
      dsBody.insertAdjacentElement('afterend', dsFoot);
    }
    function syncFoot() {
      if (!dsBody || !dsFoot) return;
      var src = dsBody.querySelector('.cc-stepview__foot, .completion-foot');
      if (!src) return;                         // steps always emit a foot; once set it stays
      /* keep form submission working if the CTA is a submit inside a body form */
      var subs = src.querySelectorAll('button[type="submit"], input[type="submit"]');
      for (var i = 0; i < subs.length; i++) {
        var frm = subs[i].form;
        if (frm && frm !== src && dsBody.contains(frm)) {
          if (!frm.id) frm.id = 'ds-frm-' + (++FORM_SEQ);
          subs[i].setAttribute('form', frm.id);
        }
      }
      if (dsFoot.firstChild !== src) { dsFoot.textContent = ''; dsFoot.appendChild(src); }
      dsFoot.removeAttribute('hidden');
    }
    el.dsSyncFoot = syncFoot;
    syncFoot();                                 // relocate anything already rendered before init
    if (window.MutationObserver && dsBody) {
      new MutationObserver(syncFoot).observe(dsBody, { childList: true, subtree: true });
    }

    function open() {
      if (el.classList.contains('is-open')) return;
      lastFocus = document.activeElement;
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('ds-drawer-open');
      openDrawers.push(el);
      var f = focusables(panel);
      if (f.length) f[0].focus();
      else panel.setAttribute('tabindex', '-1'), panel.focus();
      el.dispatchEvent(new CustomEvent('ds-drawer:open', { bubbles: true }));
    }
    function close() {
      if (!el.classList.contains('is-open')) return;
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      openDrawers = openDrawers.filter(function (d) { return d !== el; });
      if (!openDrawers.length) document.body.classList.remove('ds-drawer-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      el.dispatchEvent(new CustomEvent('ds-drawer:close', { bubbles: true }));
    }
    function toggle() { el.classList.contains('is-open') ? close() : open(); }

    el.dsDrawer = { open: open, close: close, toggle: toggle };

    /* Delegated close — handles the scrim + head ✕ AND any close button rendered
       into the body later or relocated into the foot (success "完成", empty-state
       "關閉"). A per-element binding at init never caught those dynamic nodes. */
    el.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-ds-drawer-close]')) { e.preventDefault(); close(); }
    });

    /* Focus trap — keep Tab inside the panel while open. */
    el.addEventListener('keydown', function (e) {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'Tab') {
        var f = focusables(panel);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });

  /* Global Esc → close the topmost open drawer. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !openDrawers.length) return;
    var top = openDrawers[openDrawers.length - 1];
    if (top && top.dsDrawer) { e.preventDefault(); top.dsDrawer.close(); }
  });

  /* Delegated opener: [data-ds-drawer-open="<id>"]. */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-ds-drawer-open]');
    if (!trigger) return;
    var id = trigger.getAttribute('data-ds-drawer-open');
    var drawer = document.querySelector('[data-ds-drawer="' + id + '"]');
    if (drawer && drawer.dsDrawer) { e.preventDefault(); drawer.dsDrawer.open(); }
  });

  window.DSDrawer = {
    open: function (id) { var d = document.querySelector('[data-ds-drawer="' + id + '"]'); if (d && d.dsDrawer) d.dsDrawer.open(); },
    close: function (id) { var d = document.querySelector('[data-ds-drawer="' + id + '"]'); if (d && d.dsDrawer) d.dsDrawer.close(); }
  };
})();
