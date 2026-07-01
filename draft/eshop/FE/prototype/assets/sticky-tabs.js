/* ============================================================
   sticky-tabs.js — NATIVE-sticky filter shelf + mobile header hide/show.
   ONE page-level scroll state machine. Loaded `defer` site-wide
   EXCEPT Spotlight (index.html / index-recolor.html).

   Each primary tab row is wrapped in <div class="tabstick"> and is
   position:sticky in CSS. The browser moves it WITH the scroll and holds
   it at the pin line — continuous, no teleport. The controller only:
     • toggles the STYLE class .is-pinned as a row sticks (the glass
       material morphs in via a CSS transition; position is all native);
     • on pages with MULTIPLE rows, sequentially REPLACES: the later row
       is .is-pinned, earlier ones .is-buried (faded out);
     • (mobile) hides the header on scroll-down / shows on scroll-up and
       rides the stuck pill up via the --tabs-shift var — one welded motion.

   WHY STICKY (not fixed): a relative→fixed swap is an INSTANT position
   change = a hard JUMP; no animation can hide it (this teleport survived
   many attempts). position:sticky is continuous and — crucially — behaves
   IDENTICALLY in Safari and Chrome, killing the "works in dev-tools, jumps
   on iPhone" class of bug. It self-reserves its flow box → zero CLS, no
   spacer. (Trade-off: sticky releases at its containing block's end near
   the footer — acceptable; a continuous release beats a constant teleport.)

   Perf contract: ONE passive scroll listener that only flips a flag; ALL
   work in one rAF; the loop READS only window.pageYOffset and WRITES only
   classes + one CSS var — no layout-reading getters in the loop. All
   geometry is measured OUTSIDE the loop (init/resize/orientation/load/fonts).
   ============================================================ */
(function () {
  'use strict';

  if (window.__ztorStickyTabs) return;          // idempotent
  window.__ztorStickyTabs = true;

  var root = document.documentElement;
  var body = document.body;

  var REVEAL_AT   = 70;  // px before hide-on-scroll-down may engage (top stays crisp)
  var STEP        = 4;   // per-frame px below this = jitter, no direction (velocity floor)
  var HIDE_FRAMES = 2;   // a hide (scroll-down) must persist this many CONSECUTIVE qualifying frames
  var SHOW_AT     = 10;  // px of CONSECUTIVE upward travel required before the header re-shows
                         // (show is the twitchy edge — a jitter/down frame resets it; kills momentum tail)
  var MIN_UP_FRAMES = 3; // AND it must be ≥3 CONSECUTIVE up-frames — a lone large phantom-up frame
                         // during a fast scroll-down (big -dy) can't cross the gate by itself
  var UP_CAP      = 30;  // a single frame contributes at most this much to upAccum (de-spikes flings)
  var VVH_COOLDOWN = 18; // frames (~300ms) after ANY viewport-height change during which an upward
                         // delta CANNOT show the header — the iOS address-bar collapse emits phantom
                         // up-deltas across many frames while it animates; this spans that whole window

  var mqMobile = window.matchMedia('(max-width: 767.98px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var units = [];               // [{el, spacer, originDoc, heightPx, pinTrigger, stateNow}]
  var pinline = 64;
  var isMobile = mqMobile.matches;
  var ticking = false;
  var lastY = Math.max(0, window.pageYOffset);   // clamped previous scroll position
  var downStreak = 0;                            // consecutive scroll-down frames (hide persistence)
  var upAccum = 0;                               // consecutive upward travel (px) for the show-gate
  var upFrames = 0;                              // consecutive up-frames (count) for the show-gate
  var vvhCooldown = 0;                           // frames remaining where SHOW is distrusted (address bar)
  var lastVVH = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
  var headerHidden = false;
  var activeIdx = -2;                    // force the first commit

  // On-device instrument: localStorage.navdebug='1' (or ?navdebug=1) paints a tiny HUD
  // of the live scroll/direction/cooldown state so the flicker trigger is VISIBLE on a
  // real iPhone (the case dev-tools can't reproduce). Off by default, zero cost.
  var DEBUG = false;
  try { DEBUG = localStorage.getItem('navdebug') === '1' || /[?&]navdebug=1/.test(location.search); } catch (e) {}
  var dbgEl = null;
  function navDebug(y, dy, vvh, dvvh) {
    if (!DEBUG) return;
    if (!dbgEl) {
      dbgEl = document.createElement('div');
      dbgEl.style.cssText = 'position:fixed;left:6px;bottom:120px;z-index:99999;font:10px/1.45 monospace;' +
        'color:#5f5;background:rgba(0,0,0,.82);padding:5px 7px;border-radius:6px;pointer-events:none;white-space:pre;';
      document.body.appendChild(dbgEl);
    }
    dbgEl.textContent =
      'y=' + Math.round(y) + '  dy=' + dy.toFixed(1) + '\n' +
      'vvh=' + Math.round(vvh) + '  dvvh=' + dvvh.toFixed(1) + '  cd=' + vvhCooldown + '\n' +
      'hidden=' + headerHidden + '  up=' + Math.round(upAccum) + '  dn=' + downStreak;
  }

  function readHeaderH() {
    var v = parseInt(getComputedStyle(root).getPropertyValue('--header-height'), 10);
    return v > 0 ? v : 64;
  }

  /* The ONLY place geometry is read. The rows are position:sticky, so to read each row's
     FLOW (document) position we neutralise stickiness (inline position:static) for the read,
     then restore. No spacer / reservation — sticky reserves its own flow box (zero CLS).
     Called on init / resize / orientation / load / fonts / breakpoint — never in the rAF loop. */
  function measure() {
    pinline = readHeaderH();
    var els = Array.prototype.slice.call(document.querySelectorAll('.tabstick'));

    // PASS 1 — write-only: clear live + host state up the WHOLE ancestor chain (a prior host may
    // be any ancestor), and neutralise the row's stickiness so PASS 2 reads true FLOW geometry.
    els.forEach(function (el) {
      el.style.position = 'static';
      for (var a = el; a && a !== body; a = a.parentElement) {
        a.classList.remove('is-pinned', 'is-buried', 'tabstick-host');
      }
    });
    root.style.setProperty('--tabs-shift', '0px');
    body.classList.remove('header-hidden');
    headerHidden = false;

    // ── DESKTOP GATE (decoupled 2026-06-23) ────────────────────────────────────
    //    The sticky-pin + glass-morph shelf is a MOBILE-ONLY behaviour. On desktop
    //    the snap/morph read as scroll-hijack and the pinned glass bar ate viewport,
    //    so desktop now leaves the nav/filter bars in normal document flow: no host
    //    promotion, no .is-pinned/.is-buried morph, no scroll-time pinning. PASS 1
    //    above already cleared all state and neutralised stickiness, so we restore
    //    the rows to flow and bail BEFORE promoting any host. onMode() re-runs this
    //    on the 768px crossing, so desktop⇄mobile stays live. Mobile is untouched.
    if (!isMobile) {
      els.forEach(function (el) { el.style.position = ''; });
      units = [];
      activeIdx = -2;
      return;
    }

    // PASS 2 — batched reads. Pick the sticky HOST. A sticky element only sticks WITHIN its parent,
    // so the host must be a THIN element (≈ the nav row) whose PARENT is the tall content container.
    // Promote up through thin wrappers (a "nav + button" row, a flex topbar) until the parent is a
    // real content block (taller than THIN_MAX) — never promote ONTO a tall block (that would pin
    // the whole content). THIN_MAX comfortably exceeds a wrapped 2-line nav row but not a section.
    var THIN_MAX = 220;
    var sy = window.pageYOffset;
    units = els.map(function (el) {
      var host = el;
      while (host.parentElement && host.parentElement !== body &&
             host.parentElement.getBoundingClientRect().height < THIN_MAX) {
        host = host.parentElement;             // parent is itself just a thin wrapper → climb
      }
      var tr = el.getBoundingClientRect();
      return { el: el, host: host, originDoc: tr.top + sy, pinTrigger: 0, stateNow: 'RESTING' };
    });

    // PASS 3 — restore: clear inline position, mark the chosen host sticky (CSS .tabstick-host).
    els.forEach(function (el) { el.style.position = ''; });
    units.forEach(function (u) { u.host.classList.add('tabstick-host'); });

    units.sort(function (a, b) { return a.originDoc - b.originDoc; });
    units.forEach(function (u) { u.pinTrigger = u.originDoc - pinline; });

    activeIdx = -2;
    lastY = Math.max(0, sy);
    downStreak = 0; upAccum = 0; upFrames = 0; vvhCooldown = 0;
    requestApply();                              // restore live state (write-only)
  }

  // The row is position:sticky — the browser moves it continuously with the scroll and holds
  // it at the pin line (NO teleport; behaves identically on Safari and Chrome). So there is no
  // entrance animation to drive in JS: the POSITION glide is native sticky, and the glass
  // MATERIAL morph (plain → glass, eased) is a pure CSS transition on the class. The controller
  // only toggles the STYLE class as the row sticks.
  //   • PINNED : currently stuck (glass on, header-follow transform on).
  //   • BURIED : an earlier row a later one replaced — faded out (multi-nav handoff).
  function setUnitState(u, st) {
    if (u.stateNow === st) return;               // per-unit idempotency
    u.stateNow = st;
    var h = u.host;                              // state lives on the sticky host, not always .tabstick
    if (st === 'PINNED')      { h.classList.add('is-pinned'); h.classList.remove('is-buried'); }
    else if (st === 'BURIED') { h.classList.add('is-buried'); h.classList.remove('is-pinned'); }
    else                      { h.classList.remove('is-pinned', 'is-buried'); }
  }

  function commitHeader(hidden) {
    if (headerHidden === hidden) return;         // idempotent: never restarts the transition
    headerHidden = hidden;
    body.classList.toggle('header-hidden', hidden);
    root.style.setProperty('--tabs-shift', hidden ? 'calc(-1 * var(--header-height))' : '0px');
  }

  function commitActive(active) {
    if (activeIdx === active) return;            // idempotent
    activeIdx = active;
    for (var i = 0; i < units.length; i++) {
      var want = i < active ? 'BURIED' : (i === active ? 'PINNED' : 'RESTING');
      setUnitState(units[i], want);
    }
  }

  function apply() {                             // the ONLY scroll-time DOM writer
    ticking = false;
    var raw = window.pageYOffset;                // the ONLY read — no reflow
    var y = raw < 0 ? 0 : raw;                   // clamp iOS overscroll (negative rubber-band)

    // PART A — header hide/show (MOBILE ONLY). Real-device-hardened, ASYMMETRIC.
    //   • overscroll clamped to 0 above (a rubber-band bounce can't read as scroll-up);
    //   • HIDE (down): needs HIDE_FRAMES CONSECUTIVE down-frames clearing STEP px;
    //   • SHOW (up): needs SHOW_AT px of CONSECUTIVE up-travel — a down OR jitter frame
    //     resets the accumulator, so a momentum-tail sign-flip near stop can't fake it;
    //   • ADDRESS BAR: iOS collapses/expands the URL bar AS YOU SCROLL DOWN. That animates
    //     visualViewport height over ~250ms and emits PHANTOM upward deltas across many
    //     frames (not one) — the old single-frame height guard missed the gradual ones and
    //     the header flickered back mid-down-scroll. Now ANY height change arms a COOLDOWN:
    //     for VVH_COOLDOWN frames an up-delta cannot SHOW the header (hide still works), which
    //     spans the whole bar animation. (Set localStorage.navdebug='1' to watch this live.)
    if (isMobile) {
      var vvh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      // SIGNED, not abs: only the address-bar COLLAPSE (during scroll-DOWN) emits the phantom
      // up-deltas this cooldown defends against — and a collapse makes the viewport TALLER
      // (dvvh > 0). The bar EXPANDING (dvvh < 0) IS the genuine scroll-UP; arming the cooldown
      // then was blocking the reveal until you reached the very top. Only distrust SHOW on growth.
      var dvvh = vvh - lastVVH;
      if (dvvh > 0.5) vvhCooldown = VVH_COOLDOWN;
      lastVVH = vvh;
      var dy = y - lastY;
      lastY = y;

      if (y <= REVEAL_AT) {
        commitHeader(false); downStreak = 0; upAccum = 0;       // near top: always shown
      } else {
        var dir = dy > STEP ? 1 : (dy < -STEP ? -1 : 0);
        if (dir === 1) {                                        // DOWN → hide
          upAccum = 0; upFrames = 0;
          if (++downStreak >= HIDE_FRAMES) commitHeader(true);
        } else if (dir === -1) {                               // UP → show, unless bar is animating
          downStreak = 0;
          if (vvhCooldown > 0) { upAccum = 0; upFrames = 0; }   // phantom up from address bar → ignore
          else {
            upFrames++;
            upAccum += Math.min(-dy, UP_CAP);                   // de-spike: cap one frame's contribution
            if (upFrames >= MIN_UP_FRAMES && upAccum >= SHOW_AT) commitHeader(false);
          }
        } else {                                               // jitter/stall → break both streaks
          downStreak = 0; upAccum = 0; upFrames = 0;
        }
      }
      if (vvhCooldown > 0) vvhCooldown--;
      navDebug(y, dy, vvh, dvvh);
    } else if (headerHidden) {
      commitHeader(false);                       // desktop: header never hides
    }

    // PART B — active unit (ALL breakpoints): highest unit whose origin reached the line
    var active = -1;
    for (var i = 0; i < units.length; i++) {
      if (units[i].pinTrigger <= y) active = i; else break;   // sorted ascending → early-out
    }
    commitActive(active);
  }

  function onScroll()   { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
  function requestApply(){ if (!ticking) { ticking = true; requestAnimationFrame(apply); } }

  // CRITICAL (real-device flicker root cause): on iOS, scrolling collapses/expands the URL
  // bar, which fires `resize` (viewport HEIGHT changes). measure() force-clears header-hidden,
  // so a resize mid-scroll-down would re-SHOW the header every time the bar moved → flicker,
  // worse the faster you scroll (the bar animates harder). But document-relative geometry
  // (originDoc/pinTrigger) does NOT depend on viewport height — only on WIDTH. So we re-measure
  // ONLY when the width actually changes (real resize / rotation); height-only resizes (the
  // address bar) are ignored entirely. This is invisible in dev-tools (no URL bar → no resize).
  var resizeT, lastResizeW = window.innerWidth;
  function onResize() {
    var w = window.innerWidth;
    if (w === lastResizeW) return;        // height-only (iOS address bar) → do NOT re-measure
    lastResizeW = w;
    clearTimeout(resizeT); resizeT = setTimeout(measure, 150);
  }

  function applyReduce() { body.classList.toggle('motion-snap', mqReduce.matches); }

  function onMode() { isMobile = mqMobile.matches; applyReduce(); measure(); }

  function bindMQ(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  applyReduce();
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', function () { setTimeout(measure, 60); }, { passive: true });
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  bindMQ(mqMobile, onMode);
  bindMQ(mqReduce, onMode);
})();
