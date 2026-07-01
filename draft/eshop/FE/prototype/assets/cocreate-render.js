/* ────────────────────────────────────────────
   Ztor 2.0 — Co-create render layer (cocreate-render.js)
   ------------------------------------------------------------
   Reads window.ZTOR_COCREATE (from cocreate-data.js) and renders the
   project INNER PAGE (hero → funding summary → 方案 packages → 關於 →
   共創說明 → 預算 → 團隊 → 劇照 + mobile sticky CTA). Mirrors the
   shop-render.js vanilla idiom (IIFE, esc/fmt/ON_ERR helpers, public
   init on window). Behaviour (countdown, backing drawer, package
   select) lives in cocreate.js via DS.register — NOT here.

   Compliance: reward-only copy only — see HANDOFF.md ban-list (no returns-style wording).
   ──────────────────────────────────────────── */
(function () {
  'use strict';
  var C = window.ZTOR_COCREATE || {};

  /* ── helpers (same shape as shop-render) ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  var ON_ERR = "this.onerror=null;this.style.visibility='hidden';";
  var SHARE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';
  var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  /* preview affordance by media type (film → trailer/clip · song → demo · concert → info+photos) */
  function previewMeta(p) {
    var t = p.mediaType || 'film';
    if (t === 'song') return { label: '試聽 Demo', icon: PLAY_SVG };
    if (t === 'concert') return { label: '更多資訊', icon: '' };
    return { label: '預告片', icon: PLAY_SVG };
  }
  function hasPreview(p) {
    var t = p.mediaType || 'film';
    if (t === 'concert') return !!((p.preview && p.preview.photos && p.preview.photos.length) || (p.stills && p.stills.length) || (p.preview && p.preview.info));
    if (t === 'song') return true;   /* always offer the demo player (placeholder if no audio yet) */
    return !!((p.stills && p.stills.length) || (p.preview && p.preview.trailer));
  }

  /* Local deterministic avatar (ported from shop-render.avatar) — zero network,
     always paints, stable hue per seed. Used for the creator-team row. */
  function avatar(seed, label) {
    var s = String(seed == null ? '' : seed), h = 0, i;
    for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var hue = h % 360;
    var c1 = 'hsl(' + hue + ',52%,46%)';
    var c2 = 'hsl(' + ((hue + 38) % 360) + ',54%,34%)';
    var initial = '';
    if (label != null) { var t = String(label).trim(); if (t) initial = Array.from(t)[0].toUpperCase(); }
    var txt = initial
      ? '<text x="60" y="60" dy=".35em" text-anchor="middle" fill="#ffffff" fill-opacity=".92"'
        + ' font-family="-apple-system,BlinkMacSystemFont,Segoe UI,PingFang TC,Microsoft JhengHei,sans-serif"'
        + ' font-size="54" font-weight="600">' + esc(initial) + '</text>'
      : '';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">'
      + '<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>'
      + '</linearGradient></defs><rect width="120" height="120" fill="url(#a)"/>' + txt + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  /* ── lifecycle stage → status-tag class + label + primary CTA ──
     Reuses ONLY the existing 4 status-tag colours (yellow/green/soon/ended).
     額滿 / 收款中 are reused colours + a small note, never a 5th colour. */
  /* ─────────────────────────────────────────────────────────────────────
     SINGLE SOURCE OF TRUTH for what each lifecycle stage shows. Add a stage
     or change its CTA/countdown/note HERE — the renderer and behaviours read
     this; nothing about a stage is hardcoded downstream.
       tag      → status-tag colour (reuses the existing 4)
       icon     → status-tag inner glyph ('movie' | 'check' | '')
       cta      → { label, kind }  kind ∈ back | remind | follow | watch | disabled
       countdown→ { value, unit('days'|'hours'), label, suffix?, tone? } | null
                  (value is read off the project field named in `from`)
       note     → explanatory line under the CTA (state reassurance) | ''
     ───────────────────────────────────────────────────────────────────── */
  var STAGES = {
    soon:      { tag: 'soon',   label: '即將開放',       icon: '',      cta: { label: '提醒我',   kind: 'remind' },   countdown: null, note: '' },
    funding:   { tag: 'yellow', label: '計畫進行中',     icon: '',      cta: { label: '立即支持', kind: 'back' },     countdown: { from: 'daysLeft', unit: 'days', label: '距結束' }, note: '卡片僅驗證，達標才扣款；未達標全額不扣。' },
    full:      { tag: 'yellow', label: '名額已滿',       icon: '', tagNote: '額滿', cta: { label: '候補登記', kind: 'waitlist' }, countdown: { from: 'daysLeft', unit: 'days', label: '距結束' }, note: '卡片僅驗證，達標才扣款；未達標全額不扣。' },
    charging:  { tag: 'green',  label: '目標達成・收款中', icon: 'check', tagNote: '收款中', cta: { label: '完成付款', kind: 'back' }, countdown: { from: 'cureInHours', unit: 'hours', label: '請在', suffix: '內完成付款', tone: 'warn' }, note: '你已承諾支持、計畫已達標。請完成付款以確認名額；逾時未完成，名額將釋出給候補。' },
    producing: { tag: 'yellow', label: '製作中',         icon: 'movie', cta: { label: '追蹤進度', kind: 'updates' }, countdown: null, note: '' },
    released:  { tag: 'green',  label: '已上架',         icon: 'movie', cta: { label: '立即收看', kind: 'watch' },   countdown: null, note: '' },
    ended:     { tag: 'ended',  label: '未達標・已結束',  icon: '',      cta: { label: '計畫已結束', kind: 'disabled' }, countdown: null, note: '依共創規則未達標，先前僅驗證卡片、未收取任何費用。' },
    cancelled: { tag: 'ended',  label: '已取消',         icon: '',      cta: { label: '計畫已取消', kind: 'disabled' }, countdown: null, note: '計畫已取消，所有支持皆已全額退回或未曾收款。' }
  };

  function stageOf(p) {
    /* derive the waitlist (額滿) stage from data when tiers are exhausted / settling */
    var s = STAGES[isWaitlist(p) ? 'full' : p.status] || STAGES.funding;
    /* flatten to the shape the renderer already consumes; resolve countdown value */
    return {
      tag: s.tag, label: s.label, icon: s.icon || '', note: s.tagNote || '',
      cta: s.cta.label, ctaKind: s.cta.kind,
      live: !!(s.countdown && s.countdown.unit === 'days'),
      countdown: s.countdown ? { value: (p[s.countdown.from] || 0), unit: s.countdown.unit, label: s.countdown.label, suffix: s.countdown.suffix || '', tone: s.countdown.tone || '' } : null,
      bandNote: s.note || ''
    };
  }

  /* status-tag inner icon (movie glyph / check) reused from existing CSS */
  function tagIcon(st) {
    if (st.icon === 'movie') return '<span class="status-tag__icon status-tag__icon--movie" aria-hidden="true"></span>';
    if (st.icon === 'check') return '<span class="status-tag__icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 4.5"/></svg></span>';
    return '';
  }

  function cur(p, n) { return esc(p.currency) + ' ' + fmt(n); }
  function pctOf(p) { return p.goal ? Math.round((p.raised / p.goal) * 100) : 0; }

  /* Data-driven waitlist condition: a still-funding project whose reward tiers are
     ALL sold out, OR that reached its goal and is awaiting settlement. Drives the
     候補登記 (Join waiting list) CTA on ANY project — never hardcoded per page. */
  function allSoldOut(p) {
    return !!(p.packages && p.packages.length) && p.packages.every(function (pk) { return pk.slots && pk.slots.left <= 0; });
  }
  function isWaitlist(p) {
    /* No normal pledge possible → offer the waitlist: every tier sold out, OR the
       goal is reached (100% — verified pledges can still fail/expire within the
       settlement window and free a spot for a waitlister). */
    return p.status === 'funding' && (allSoldOut(p) || p.raised >= p.goal);
  }

  /* ── package / reward-tier card ── */
  function packageHtml(p, pkg) {
    var full = pkg.slots && pkg.slots.left <= 0;
    var slotsLine = pkg.slots
      ? (full
          ? '<span class="pkg__slots pkg__slots--full">名額已滿</span>'
          : '<span class="pkg__slots">尚餘 ' + fmt(pkg.slots.left) + ' / ' + fmt(pkg.slots.total) + ' 個名額</span>')
      : '';
    /* The whole card is the selectable affordance (no per-tier orange button —
       the page has ONE primary CTA). Quiet 選擇 / 候補登記 cue, card is the target. */
    var cue = full
      ? '<span class="pkg__select pkg__select--wait">候補登記</span>'
      : '<span class="pkg__select">選擇<span class="pkg__select-arrow" aria-hidden="true"> →</span></span>';
    var dataAttr = full ? 'data-waitlist-package="' + esc(pkg.id) + '"' : 'data-back-package="' + esc(pkg.id) + '"';
    var aria = esc(pkg.name) + '，' + cur(p, pkg.price) + (full ? '，名額已滿，候補登記' : '，選擇此方案');
    var perks = (pkg.perks || []).map(function (perk) {
      return '<li class="pkg__perk">' + esc(perk) + '</li>';
    }).join('');
    return '<article class="pkg' + (pkg.popular ? ' pkg--popular' : '') + (full ? ' pkg--full' : '') + '" ' + dataAttr + ' role="button" tabindex="0" aria-label="' + aria + '">' +
      (pkg.popular ? '<span class="pkg__flag">熱門選擇</span>' : '') +
      '<div class="pkg__head">' +
        '<h3 class="pkg__name">' + esc(pkg.name) + '</h3>' +
        '<div class="pkg__price">' + cur(p, pkg.price) + '</div>' +
      '</div>' +
      '<ul class="pkg__perks">' + perks + '</ul>' +
      '<div class="pkg__foot">' + slotsLine + cue + '</div>' +
    '</article>';
  }

  /* ── budget allocation — ONE segmented bar + legend (reference anatomy) ── */
  function budgetHtml(p) {
    var segs = (p.budget || []).map(function (b, i) {
      return '<span class="cc-budget__seg cc-budget__seg--' + ((i % 3) + 1) + '" style="width:' + esc(b.pct) + '%"></span>';
    }).join('');
    var legend = (p.budget || []).map(function (b, i) {
      var amt = p.goal ? Math.round(p.goal * b.pct / 100) : 0;
      return '<li class="cc-budget__item">' +
        '<span class="cc-budget__dot cc-budget__dot--' + ((i % 3) + 1) + '"></span>' +
        '<span class="cc-budget__pct">' + esc(b.pct) + '%</span>' +
        '<span class="cc-budget__label">' + esc(b.label) + '</span>' +
        '<span class="cc-budget__amt">' + cur(p, amt) + '</span>' +
      '</li>';
    }).join('');
    return '<div class="cc-budget"><div class="cc-budget__bar">' + segs + '</div>' +
      '<ul class="cc-budget__legend">' + legend + '</ul></div>';
  }

  /* ── creator team — credit list (role + name) ── */
  function teamHtml(p) {
    return '<ul class="cc-team">' + (p.team || []).map(function (m) {
      return '<li class="cc-team__member"><a class="cc-team__link" href="' + esc(m.href || '#') + '">' +
        '<span class="cc-team__role">' + esc(m.role) + '</span>' +
        '<span class="cc-team__name">' + esc(m.name) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* ── stills gallery ── */
  function stillsHtml(p) {
    return '<div class="cc-stills">' + (p.stills || []).map(function (src, i) {
      return '<figure class="cc-stills__item"><img src="' + esc(src) + '" alt="' + esc(p.title) + ' 劇照 ' + (i + 1) + '" loading="lazy" decoding="async" onerror="' + ON_ERR + '"></figure>';
    }).join('') + '</div>';
  }

  function section(title, inner, id) {
    return '<section class="cc-section"' + (id ? ' id="' + esc(id) + '"' : '') + ' data-reveal-section>' +
      '<h2 class="cc-section__title">' + esc(title) + '</h2>' + inner + '</section>';
  }

  /* CTA markup per stage — back (opens drawer) / watch (link) / follow|remind
     (client toggle) / disabled. Shared by the funding band + mobile sticky bar. */
  function ctaMarkup(p, st, size, extraCls) {
    if (st.ctaKind === 'disabled') return '<button class="btn btn--primary btn--' + size + (extraCls ? ' ' + extraCls : '') + '" type="button" disabled>' + esc(st.cta) + '</button>';
    if (st.ctaKind === 'watch')    return '<a class="btn btn--primary btn--' + size + (extraCls ? ' ' + extraCls : '') + '" href="screening-room.html">' + esc(st.cta) + '</a>';
    if (st.ctaKind === 'remind') {
      return '<button class="btn btn--ghost btn--' + size + (extraCls ? ' ' + extraCls : '') + '" type="button" data-cc-remind data-cc-opens="' + (p.opensInDays || 7) + '">' + esc(st.cta) + '</button>';
    }
    if (st.ctaKind === 'updates') {
      return '<button class="btn btn--ghost btn--' + size + (extraCls ? ' ' + extraCls : '') + '" type="button" data-cc-updates>' + esc(st.cta) + '</button>';
    }
    if (st.ctaKind === 'waitlist') {   // main CTA → select-package step in waitlist variant
      return '<button class="btn btn--primary btn--' + size + (extraCls ? ' ' + extraCls : '') + '" type="button" data-waitlist-project="' + esc(p.id) + '">' + esc(st.cta) + '</button>';
    }
    if (st.ctaKind === 'follow') {
      return '<button class="btn btn--ghost btn--' + size + (extraCls ? ' ' + extraCls : '') + '" type="button" data-cc-toggle data-cc-on="追蹤中" data-cc-off="' + esc(st.cta) + '">' + esc(st.cta) + '</button>';
    }
    return '<button class="btn btn--primary btn--' + size + (extraCls ? ' ' + extraCls : '') + '" type="button" data-back-project="' + esc(p.id) + '">' + esc(st.cta) + '</button>';
  }

  /* ── the whole inner page ── */
  function projectHtml(p) {
    var st = stageOf(p);
    var pct = pctOf(p);
    var tagNote = st.note ? ' <span class="status-tag__note">' + esc(st.note) + '</span>' : '';

    /* hero copy — sits in the right column above the funding band */
    var heroCopy =
      '<div class="cc-hero__copy">' +
        '<h1 class="cc-hero__title">' + esc(p.title) + '</h1>' +
        /* No cross-language secondary title: the main title already localises via
           i18n, so each locale shows only its own-language name (zh-Hant shows the
           Chinese title with no English row; English shows the translated title). */
        '<div class="cc-hero__tags">' +
          '<span class="status-tag status-tag--' + st.tag + '">' + tagIcon(st) + esc(st.label) + tagNote + '</span>' +
          (p.genres || []).map(function (g) { return '<span class="cc-genre">' + esc(g) + '</span>'; }).join('') +
        '</div>' +
        (p.langForm ? '<p class="cc-hero__meta">' + esc(p.langForm) + '</p>' : '') +
      '</div>';

    /* funding band — raised · backers · progress (+ % badge) · status · CTA */
    var ctaBtn = ctaMarkup(p, st, 'md', 'cc-fund__cta');
    var pm = previewMeta(p);
    var previewBtn = hasPreview(p)
      ? '<button class="btn btn--ghost btn--md cc-preview-btn" type="button" data-cc-preview>' + pm.icon + esc(pm.label) + '</button>'
      : '';
    var done = pct >= 100;
    var statusLine;
    if (st.countdown) {
      var c = st.countdown;
      var initial = (c.unit === 'hours') ? c.value + ' 小時' : c.value + ' 天';
      statusLine = '<p class="cc-fund__status' + (c.tone === 'warn' ? ' cc-fund__status--warn' : '') + '">' +
        esc(c.label) + ' <span class="cc-fund__count" data-cc-countdown="' + esc(c.value) + '" data-cc-unit="' + esc(c.unit) + '">' + esc(initial) + '</span>' +
        (c.suffix ? ' ' + esc(c.suffix) : '') + '</p>';
    } else if (p.releaseNote) {
      statusLine = '<p class="cc-fund__status">' + esc(p.releaseNote) + '</p>';
    } else {
      statusLine = '<p class="cc-fund__status">' + esc(st.label) + '</p>';
    }
    var fund =
      '<div class="cc-fund">' +
        '<div class="cc-fund__top">' +
          '<div class="cc-fund__figures">' +
            '<span class="cc-fund__raised' + (done ? ' is-done' : '') + '">' + cur(p, p.raised) + '</span>' +
            '<span class="cc-fund__goal">目標 <span class="cc-fund__goal-num">' + cur(p, p.goal) + '</span></span>' +
          '</div>' +
          '<span class="cc-fund__backers"><span class="cc-fund__backers-icon" aria-hidden="true"></span>' + fmt(p.backers) + ' 人</span>' +
        '</div>' +
        '<div class="cc-fund__progress" style="--cc-pct:' + Math.min(pct, 100) + '">' +
          '<span class="cc-fund__badge' + (done ? ' is-done' : '') + '">' + pct + '%</span>' +
          '<div class="cocreation-card__bar"><div class="cocreation-card__bar-fill" data-bar-fill="' + Math.min(pct, 100) + '" style="width:0%"></div></div>' +
        '</div>' +
        statusLine +
        '<div class="cc-fund__cta-row">' + ctaBtn + previewBtn + '</div>' +
        (st.bandNote ? '<p class="cc-fund__note"><span class="cc-fund__note-icon" aria-hidden="true"></span>' + esc(st.bandNote) + '</p>' : '') +
      '</div>';

    /* main content sections (single column) — only render sections with data */
    var sections = [];
    if (p.packages && p.packages.length) {
      sections.push(section('參與此共創計畫福利',
        '<p class="cc-section__lead">每個方案都是共創身分與紀念品：觀影權、周邊、鳴謝與出品人署名。</p>' +
        '<div class="pkg-grid">' + p.packages.map(function (pkg) { return packageHtml(p, pkg); }).join('') + '</div>', 'packages'));
    }
    if (p.about)    sections.push(section('關於這部作品', '<p class="cc-prose">' + esc(p.about) + '</p>'));
    if (p.planDesc) sections.push(section('共創計畫說明', '<p class="cc-prose">' + esc(p.planDesc) + '</p>'));
    if (p.budget && p.budget.length) sections.push(section('預算分配', budgetHtml(p)));
    if (p.team && p.team.length)     sections.push(section('創作團隊', teamHtml(p)));
    if (p.stills && p.stills.length) sections.push(section('劇照', stillsHtml(p)));
    var main = sections.join('');

    /* sticky mobile CTA — mirrors the funding CTA on phones */
    var sticky = '<div class="cc-stickybar"><span class="cc-stickybar__pct">' + pct + '%<small>' +
      (done ? '已達標' : '已集資') + '</small></span>' + ctaMarkup(p, st, 'md', '') + '</div>';

    return '<div class="cocreate-detail"><div class="cc-wrap">' +
      '<div class="cc-backrow">' +
        '<a class="cc-back" href="cocreate.html"><span class="cc-back__icon" aria-hidden="true"></span>返回</a>' +
        '<button class="cc-share-btn" type="button" data-cc-share aria-label="分享計畫">' + SHARE_SVG + '分享</button>' +
      '</div>' +
      '<header class="cc-hero">' +
        '<div class="cc-hero__poster"><img src="' + esc(p.poster) + '" alt="' + esc(p.title) + '" onerror="' + ON_ERR + '"></div>' +
        '<div class="cc-hero__main">' + heroCopy + fund + '</div>' +
      '</header>' +
      main +
    '</div></div>' + sticky;
  }

  function skeletonHtml() {
    return '<div class="cocreate-detail"><div class="cc-wrap">' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--title"></div>' +
      '<div class="ds-skeleton ds-skeleton--media"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--full"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--full"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--short"></div>' +
    '</div></div>';
  }

  function emptyHtml() {
    return '<div class="cc-empty">' +
      '<h1 class="cc-empty__title">找不到這個共創計畫</h1>' +
      '<p class="cc-empty__body">這個計畫可能已結束或網址有誤。</p>' +
      '<a class="btn btn--primary btn--md" href="cocreate.html">回到共創列表</a>' +
    '</div>';
  }

  function getParam(name) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search || '');
    return m ? decodeURIComponent(m[1]) : null;
  }

  function findProject(id) {
    var list = C.projects || [];
    if (id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; }
    return list[0] || null;   /* default to the first project when no/unknown id */
  }

  /* ── public init ── */
  function initProject(mountId) {
    var mount = document.getElementById(mountId || 'ccDetail');
    if (!mount) return;
    var p = findProject(getParam('id'));
    mount.innerHTML = skeletonHtml();
    requestAnimationFrame(function () {
      mount.innerHTML = p ? projectHtml(p) : emptyHtml();
      if (p) document.title = p.title + ' · 影視共創 — Ztor.';
      /* DS auto-attaches behaviours to the injected DOM (MutationObserver),
         but refresh ScrollTrigger so reveals measure the new layout. */
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  /* ════════════════════════════════════════════════════════════════════
     LIST PAGE — render the cocreate.html grid from the same data, each card
     linking to its own inner page (cocreate-project.html?id=<id>).
     ════════════════════════════════════════════════════════════════════ */

  /* card footer per lifecycle stage (mirrors the original static variants) */
  function listFooter(p, st, pct) {
    if (p.status === 'soon') {
      return '<p class="cocreation-card__note">' + esc(p.startNote || '即將開始共創') + '</p>';
    }
    if (p.status === 'producing' && p.releaseNote) {
      return '<p class="cocreation-card__note"><span class="cocreation-card__note-icon" aria-hidden="true"></span>' + esc(p.releaseNote) + '</p>';
    }
    if (p.status === 'released') {
      return '<p class="cocreation-card__note"><span class="cocreation-card__note-icon" aria-hidden="true"></span>已上架，立即收看</p>';
    }
    if (p.status === 'ended' || p.status === 'cancelled') {
      var fp = p.finalPct != null ? p.finalPct : pct;
      return '<div class="cocreation-card__metrics">' +
        '<div class="cocreation-card__amount">' + cur(p, p.goal) + '</div>' +
        '<div class="cocreation-card__bar"><div class="cocreation-card__bar-fill cocreation-card__bar-fill--muted" data-bar-fill="' + fp + '" style="width:0%"></div></div>' +
        '<div class="cocreation-card__meta-row"><span>達成 ' + fp + '%</span></div>' +
      '</div>';
    }
    /* funding / full / charging → funded-progress block */
    var doneCls = pct >= 100 ? ' rf-fund--done' : '';
    var label = pct >= 100 ? '集資成功' : '已集資';
    var metaRight = st.live
      ? fmt(p.backers) + ' 人支持 · ' + p.daysLeft + ' 天倒數'
      : fmt(p.backers) + ' 人支持 · 已結束';
    var metaLeft = pct >= 100 ? cur(p, p.goal) + ' 達標' : cur(p, p.raised) + ' / ' + fmt(p.goal);
    return '<div class="cocreation-card__metrics">' +
      '<div class="rf-fund' + doneCls + '"><span class="rf-fund__pct">' + pct + '<small>%</small></span>' +
      '<span class="rf-fund__label">' + label + '</span></div>' +
      '<div class="cocreation-card__bar"><div class="cocreation-card__bar-fill" data-bar-fill="' + Math.min(pct, 100) + '" style="width:0%"></div></div>' +
      '<div class="cocreation-card__meta-row"><span>' + metaLeft + '</span><span>' + metaRight + '</span></div>' +
    '</div>';
  }

  /* ── user-action ribbons (per signed-in user × project) — single source.
     priority drives the to-the-top sort; lower = more urgent. ── */
  var RIBBONS = {
    'needs-payment':    { label: '待完成付款',      tone: 'urgent',  priority: 1 },
    'cure-failed':      { label: '付款失敗・待更新', tone: 'urgent',  priority: 1 },
    'waitlist-invited': { label: '補位邀請・限時',   tone: 'urgent',  priority: 1 },
    'pledged':          { label: '已承諾・待達標',   tone: 'warn',    priority: 2 },
    'waitlisted':       { label: '候補中',          tone: 'warn',    priority: 2 },
    'backed':           { label: '已支持',          tone: 'success', priority: 3 },
    'reminded':         { label: '已設定提醒',       tone: 'neutral', priority: 4 },
    'following':        { label: '追蹤中',          tone: 'neutral', priority: 4 }
  };
  function loggedIn() { return document.body.getAttribute('data-auth') === 'logged-in'; }
  function userActionKey(p) { return (C.userActions || {})[p.id]; }
  function ribbonOf(p) {
    if (!loggedIn()) return null;
    var k = userActionKey(p);
    return k ? RIBBONS[k] : null;
  }

  function listCardHtml(p) {
    var st = stageOf(p);
    var pct = pctOf(p);
    var tagNote = st.note ? ' <span class="status-tag__note">' + esc(st.note) + '</span>' : '';
    var href = 'cocreate-project.html?id=' + encodeURIComponent(p.id);
    var rb = ribbonOf(p);
    var ribbon = rb ? '<span class="cc-ribbon cc-ribbon--' + rb.tone + '"><span class="cc-ribbon__dot" aria-hidden="true"></span>' + esc(rb.label) + '</span>' : '';
    return '<a class="cocreation-card" href="' + href + '" data-status="' + esc(p.status) + '">' +
      '<span class="cocreation-card__poster">' + ribbon + '<img src="' + esc(p.poster) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async" onerror="' + ON_ERR + '"></span>' +
      '<div class="cocreation-card__body">' +
        '<span class="status-tag status-tag--' + st.tag + '">' + tagIcon(st) + esc(st.label) + tagNote + '</span>' +
        '<h3 class="cocreation-card__title">' + esc(p.title) + '</h3>' +
        '<p class="cocreation-card__desc">' + esc(p.summary) + '</p>' +
        listFooter(p, st, pct) +
      '</div></a>';
  }

  /* filter chip → which statuses it shows */
  var FILTER_GROUPS = {
    all: null,
    soon: ['soon'],
    funding: ['funding', 'full'],
    done: ['charging', 'producing'],
    released: ['released'],
    ended: ['ended', 'cancelled']
  };

  function renderList(grid, statuses) {
    var items = (C.projects || []).filter(function (p) {
      return !statuses || statuses.indexOf(p.status) >= 0;
    });
    /* When signed in, float projects the user has acted on to the top,
       ordered by ribbon priority (action-required first); stable otherwise. */
    if (loggedIn()) {
      items = items.map(function (p, i) {
        var k = userActionKey(p);
        var pr = (k && RIBBONS[k]) ? RIBBONS[k].priority : 99;
        return { p: p, pr: pr, i: i };
      }).sort(function (a, b) { return a.pr - b.pr || a.i - b.i; })
        .map(function (x) { return x.p; });
    }
    grid.innerHTML = items.length
      ? items.map(listCardHtml).join('')
      : '<p class="cc-list-empty">這個分類目前沒有計畫。</p>';
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function wireListFilter(grid) {
    var nav = document.querySelector('[data-cocreate-filter-nav]');
    if (!nav || nav.__ccWired) return;
    nav.__ccWired = true;
    var btns = nav.querySelectorAll('[data-cc-filter]');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          for (var k = 0; k < btns.length; k++) btns[k].classList.toggle('glass-tabs__item--active', btns[k] === btn);
          renderList(grid, FILTER_GROUPS[btn.getAttribute('data-cc-filter')] || null);
        });
      })(btns[i]);
    }
  }

  function initList(mountId) {
    var grid = document.getElementById(mountId || 'ccGrid');
    if (!grid) return;
    renderList(grid, null);
    wireListFilter(grid);
    /* re-render ribbons + re-sort when auth flips (dev toggle / login), keeping
       the active filter — so signing in surfaces the user's projects live. */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        var active = document.querySelector('[data-cocreate-filter-nav] .glass-tabs__item--active');
        var key = active ? active.getAttribute('data-cc-filter') : 'all';
        renderList(grid, FILTER_GROUPS[key] || null);
      }).observe(document.body, { attributes: true, attributeFilter: ['data-auth'] });
    }
  }

  window.ZTOR_COCREATE_RENDER = {
    initProject: initProject,
    initList: initList,
    stageOf: stageOf,
    findProject: findProject,
    avatar: avatar,
    esc: esc,
    fmt: fmt
  };
})();
