/* ════════════════════════════════════════════════════════════════════════
   refine-creator.js  ·  Ztor 2.0 — Creator Profile archetype rework
   ────────────────────────────────────────────────────────────────────────
   Behaviour layer for the Mobbin-benchmarked creator-profile rework. Pure
   vanilla, no new deps. Self-initialising: detects which content grid is on
   the page (商店 / 貼文 / 項目 / 活動) and only acts on what exists. Safe to
   load on all 48 creator pages via a single <script> tag (propagates by
   link, no per-file logic). Runs after the shop-render layer.

   Does three things:
     1) Follow → Following toggle  ([data-follow-toggle])
     2) Hero identity rise on load (.rf-hero-in; honours reduced-motion)
     3) Per-tab empty states (injects .rf-empty when a grid renders blank)
   ════════════════════════════════════════════════════════════════════════ */
(function refineCreator() {
  if (!document.body || !document.body.classList.contains('rf-creator')) return;

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · Follow / Following toggle ───────────────────────────────────── */
  (function followToggle() {
    var btn = document.querySelector('[data-follow-toggle]');
    if (!btn) return;
    var LABEL_FOLLOW = '＋ 加入社群';
    var LABEL_DONE = '✓ 已加入';
    function paint() {
      var on = btn.getAttribute('data-following') === 'true';
      btn.textContent = on ? LABEL_DONE : LABEL_FOLLOW;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    btn.setAttribute('aria-pressed', 'false');
    paint();
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('data-following') === 'true';
      btn.setAttribute('data-following', on ? 'false' : 'true');
      paint();
    });
  })();

  /* ── 2 · Hero rise on load ───────────────────────────────────────────── */
  if (!REDUCED) {
    requestAnimationFrame(function () {
      document.body.classList.add('rf-hero-in');
    });
  }

  /* ── 3 · Per-tab empty states ────────────────────────────────────────────
     The shop-render layer leaves a grid's innerHTML empty when a creator has
     no data for that tab. We check the known per-view containers and, if the
     active one is empty, drop a styled .rf-empty block in its place. zh-TW
     copy is defined here (natural, no placeholders). */
  var ICON_DEFAULT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h7"/></svg>';
  var ICON_GRID =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  var ICON_CAL =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/>' +
    '<path d="M3 9h18M8 3v4M16 3v4"/></svg>';

  /* container id → { title, desc, icon }. Only one of these exists per page. */
  var EMPTIES = {
    creatorProducts: { icon: ICON_GRID, title: '商店即將上架', desc: '這位創作者還沒有上架商品，敬請期待首波周邊與限量品。' },
    igGrid:          { icon: ICON_GRID, title: '還沒有貼文', desc: '這位創作者尚未發佈貼文，加入社群以搶先看到最新動態。' },
    creatorRegistry: { icon: ICON_DEFAULT, title: '還沒有項目', desc: '目前沒有進行中的共創計畫或預售，新項目開放時會在這裡顯示。' },
    creatorTimeline: { icon: ICON_CAL, title: '還沒有活動', desc: '近期沒有安排活動，敬請留意後續的演出與見面會公告。' }
  };

  function buildEmpty(cfg) {
    var wrap = document.createElement('div');
    wrap.className = 'rf-empty';
    wrap.setAttribute('role', 'status');
    wrap.innerHTML =
      '<span class="rf-empty__icon" aria-hidden="true">' + cfg.icon + '</span>' +
      '<span class="rf-empty__title">' + cfg.title + '</span>' +
      '<span class="rf-empty__desc">' + cfg.desc + '</span>';
    return wrap;
  }

  Object.keys(EMPTIES).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    /* "empty" = no element children after the renderer ran. */
    if (el.children.length === 0 && el.textContent.trim() === '') {
      el.appendChild(buildEmpty(EMPTIES[id]));
    }
  });
})();
