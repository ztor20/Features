/* ────────────────────────────────────────────
   Ztor Shop v2 — vanilla render layer.
   Luxury-PLP card anatomy (chromeless, 2:3, three text lines at one
   size), creator storefront (pickup slot → grid → event rows → fans),
   and the tier leaderboard. Reads window.ZTOR_SHOP from the
   shop-data-*.js files. Tier thresholds:
   INNER CIRCLE ≥80,000 · SUPER FANS ≥30,000 · SUPPORTER ≥8,000 · FANS
   ──────────────────────────────────────────── */
(function () {
  'use strict';
  var S = window.ZTOR_SHOP || {};

  /* ── helpers ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function imgFor(id, w, h) {
    return 'https://picsum.photos/seed/' + encodeURIComponent(id) + '/' + (w || 480) + '/' + (h || 720);
  }
  /* product thumbnails: generated image when mapped, else seeded photo,
     else gradient tile — never a broken glyph */
  function prodImg(id) {
    var f = (S.imgMap || {})[id];
    return f ? 'assets/images/shop/g/' + f : imgFor(id, 480, 720);
  }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  var ON_ERR = "this.onerror=null;this.style.display='none';this.parentElement.classList.add('brand-tile','brand-tile--3');";

  /* ── refine-shop additions ──────────────────────────────────
     Wishlist heart + quick-add + flag-on-media markup, an add-to-cart
     toast, the live auction countdown/state, loading skeletons and an
     empty state. All presentational mock behavior for the preview. */
  var HEART_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  var CART_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>';
  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5 11-11"/></svg>';
  var GAVEL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14 9-7 7"/><path d="M11 6.5 17.5 13"/><path d="m9 4.5 6 6"/><path d="M4 20h8"/></svg>';
  var SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>';

  /* a flag pill sitting over the media; brand-yellow for limited/new, neutral otherwise */
  function flagPill(badge) {
    if (!badge) return '';
    var neutral = /Bundle/i.test(badge);
    return '<span class="rf-flag' + (neutral ? ' rf-flag--neutral' : '') + '">' + esc(badge) + '</span>';
  }
  function wishBtn() {
    return '<button class="rf-wish" type="button" aria-pressed="false" aria-label="加入願望清單" data-wish>' + HEART_SVG + '</button>';
  }
  /* Quick-add — icon-only, lives in the card FOOTER (not clipped inside the
     2:3 overflow:hidden media frame, which is what made the old static touch
     fallback invisible on phones). Styled by css/components/shop-quickadd.css.
     Add behaviour stays cart.js's delegated [data-add]. kind 'ticket' = event. */
  function quickAdd(kind) {
    var aria = kind === 'ticket' ? '購票' : '加入購物車';
    return '<button class="shop-card__qa" type="button" data-add aria-label="' + aria + '">' +
      '<span class="shop-card__qa-icon" aria-hidden="true">' + CART_SVG + '</span></button>';
  }

  function tierOf(points) {
    if (points >= 80000) return { key: 'inner', label: 'INNER CIRCLE' };
    if (points >= 30000) return { key: 'super', label: 'SUPER FANS' };
    if (points >= 8000) return { key: 'supporter', label: 'SUPPORTER' };
    return { key: 'fans', label: 'FANS' };
  }
  /* Local, dependency-free avatar — deterministic gradient + initial rendered
     as an inline SVG data-URI. Replaces the old picsum.photos placeholder,
     which hung indefinitely when the service rate-limited (every request stuck
     in 'pending', so the <img> 'error' fallback never even fired and the
     avatar stayed an empty circle). Zero network, always paints, same hue for
     the same seed across reloads. Pass the display name for a monogram. */
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

  /* ── product card: image on matte field, three quiet lines ── */
  function productCardHtml(p) {
    var sold = p.soldOut ? ' shop-card--soldout' : '';
    var flag = p.soldOut
      ? '<span class="rf-flag rf-flag--sold">售完</span>'
      : flagPill(p.badge);
    var price = p.soldOut
      ? '<span class="shop-card__price"><span class="shop-card__price-sub">售完補貨中</span></span>'
      : '<span class="shop-card__price">' + (p.ntd === 0 ? '免費' : 'NT$ ' + fmt(p.ntd)) +
        (p.hkd ? '<span class="shop-card__price-sub">HK$ ' + fmt(p.hkd) + '</span>' : '') + '</span>';
    var overlay = flag + wishBtn();   /* quick-add now lives in the footer, not the media */
    return '<a class="shop-card' + sold + '" href="shop-item.html?id=' + encodeURIComponent(p.id) + '" data-id="' + esc(p.id) + '" data-cat="' + esc(p.cat || '') + '" data-name="' + esc(p.name) + '">' +
      '<div class="shop-card__media"><img src="' + prodImg(p.id) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="' + ON_ERR + '">' + overlay + '</div>' +
      '<div class="shop-card__body">' +
      (p.cat ? '<span class="shop-card__cat">' + esc(p.cat) + '</span>' : '') +
      '<h3 class="shop-card__title">' + esc(p.name) + '</h3>' +
      '<div class="shop-card__foot">' + price + (p.soldOut ? '' : quickAdd()) + '</div>' +
      '</div></a>';
  }

  /* ── popcorn redemption card ── */
  function popcornCardHtml(p) {
    var media = p.tile
      ? '<div class="brand-tile brand-tile--' + p.tile + '">' + esc(p.name.split('（')[0].split(' HK$')[0].split(' NT$')[0]) + '</div>'
      : '<img src="' + prodImg(p.id) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="' + ON_ERR + '">';
    return '<a class="shop-card" href="shop-item.html?id=' + encodeURIComponent(p.id) + '" data-id="' + esc(p.id) + '" data-cat="' + esc(p.cat || '') + '">' +
      '<div class="shop-card__media">' + media + '</div>' +
      '<div class="shop-card__body">' +
      '<span class="shop-card__cat">' + esc(p.cat || '') + '</span>' +
      '<h3 class="shop-card__title">' + esc(p.name) + '</h3>' +
      '<span class="shop-card__price"><span class="shop-card__price-pop-icon" aria-hidden="true"></span>' + fmt(p.pop) +
      '<span class="shop-card__redeem">兌換</span></span>' +
      '<span class="shop-card__note">' + esc(p.note || '') + '</span>' +
      '</div></a>';
  }

  /* ── event card (2:3 like everything else, date as the cat line) ── */
  function eventCardHtml(p) {
    var sold = p.soldOut ? ' shop-card--soldout' : '';
    var flag = p.soldOut
      ? '<span class="rf-flag rf-flag--sold">完售</span>'
      : flagPill(p.badge);
    var price = p.soldOut
      ? '<span class="shop-card__price"><span class="shop-card__price-sub">已完售</span></span>'
      : '<span class="shop-card__price">' + (p.ntd === 0 ? '免費入場' : 'NT$ ' + fmt(p.ntd)) +
        (p.hkd ? '<span class="shop-card__price-sub">HK$ ' + fmt(p.hkd) + '</span>' : '') + '</span>';
    var overlay = flag + wishBtn();   /* quick-add now lives in the footer, not the media */
    return '<a class="shop-card' + sold + '" href="shop-item.html?id=' + encodeURIComponent(p.id) + '" data-id="' + esc(p.id) + '" data-name="' + esc(p.name) + '">' +
      '<div class="shop-card__media"><img src="' + prodImg(p.id) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="' + ON_ERR + '">' + overlay + '</div>' +
      '<div class="shop-card__body">' +
      '<span class="shop-card__cat">' + esc(p.date) + ' · ' + esc(p.venue) + '</span>' +
      '<h3 class="shop-card__title">' + esc(p.name) + '</h3>' +
      '<div class="shop-card__foot">' + price + (p.soldOut ? '' : quickAdd('ticket')) + '</div>' +
      '</div></a>';
  }

  /* ── auction card: Rarible/Foundation timed-auction pattern ──
     live countdown · current bid as the headline · bid count · a
     leading/outbid/ending-soon state. Countdown ticks via initAuction. */

  /* remaining ms until an ISO date (treated as 23:59 local of that day) */
  function endMs(ends) {
    var d = new Date(ends + 'T23:59:00');
    return d.getTime() - Date.now();
  }
  /* "3 天 04:21" / "04:21:08" when <24h / "已結束" */
  function countdownText(ms) {
    if (ms <= 0) return '已結束';
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);    s -= m * 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    if (d > 0) return d + ' 天 ' + pad(h) + ':' + pad(m);
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }
  /* deterministic per-item bidder state so it's stable across re-renders.
     ~1/3 of items the user is leading; of the rest a few are outbid. */
  function bidderState(p) {
    var seed = 0, id = String(p.id);
    for (var i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) & 0xffff;
    var r = seed % 10;
    if (r < 3) return 'leading';
    if (r < 5) return 'outbid';
    return 'none';
  }
  var SOON_MS = 24 * 3600 * 1000; /* under a day = ending soon */

  function auctionCardHtml(p) {
    var ms = endMs(p.ends);
    var ended = ms <= 0;
    var soon = !ended && ms < SOON_MS;
    var flag = p.badge ? flagPill(p.badge) : '';

    var pillMod = ended ? ' rf-auc-pill--ended' : (soon ? ' rf-auc-pill--soon' : '');
    var pill = '<span class="rf-auc-pill' + pillMod + '" data-countdown data-ends="' + esc(p.ends) + '">' +
      '<span class="rf-auc-pill__tick" aria-hidden="true"></span>' +
      '<span data-cd-text>' + (ended ? '已結束' : countdownText(ms)) + '</span></span>';

    var state = bidderState(p);
    var stateHtml = '';
    if (!ended && state === 'leading') stateHtml = '<span class="rf-auc-state rf-auc-state--leading">最高出價</span>';
    else if (!ended && state === 'outbid') stateHtml = '<span class="rf-auc-state rf-auc-state--outbid">已被超越</span>';

    var bidLabel = ended ? '成交價' : '目前出價';
    var cta = ended
      ? '<span class="rf-bid rf-bid--ended">' + GAVEL_SVG + '拍賣結束</span>'
      : '<button class="rf-bid" type="button" data-bid aria-label="出價">' + GAVEL_SVG + '出價</button>';

    return '<a class="shop-card shop-card--auction" href="shop-item.html?id=' + encodeURIComponent(p.id) + '" data-id="' + esc(p.id) + '" data-cat="' + esc(p.cat || '') + '" data-name="' + esc(p.name) + '">' +
      '<div class="shop-card__media"><img src="' + prodImg(p.id) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="' + ON_ERR + '">' +
      flag + pill + cta + '</div>' +
      '<div class="shop-card__body">' +
      '<h3 class="shop-card__title">' + esc(p.name) + '</h3>' +
      '<div class="rf-auc-row">' +
      '<span class="rf-auc-bid"><span class="rf-auc-bid__label">' + bidLabel + '</span>' +
      '<span class="rf-auc-bid__val" data-bid-val="' + p.bid + '">NT$ ' + fmt(p.bid) + '</span></span>' +
      '<span class="rf-auc-meta"><span class="rf-auc-meta__bids">' + p.bids + ' 次出價</span>' + stateHtml + '</span>' +
      '</div></div></a>';
  }

  /* ── creator directory card ── */
  function creatorCardHtml(c) {
    return '<a class="creator-card" href="creator-' + esc(c.slug) + '.html">' +
      '<div class="creator-card__media"><img src="assets/images/shop/creator-' + esc(c.slug) + '.webp" alt="' + esc(c.name) + '" loading="lazy" onerror="' + ON_ERR + '"></div>' +
      '<div class="creator-card__body">' +
      '<span class="creator-card__name">' + esc(c.name) + '</span>' +
      '<span class="creator-card__meta"><span>' + esc(c.role) + '</span><span>' + esc(c.followers) + ' 追蹤</span></span>' +
      '</div></a>';
  }

  /* ── grid plumbing ── */
  function renderInto(el, items, toHtml, unit) {
    if (!el) return;
    if (!items.length) { el.innerHTML = emptyHtml(); return; }
    el.innerHTML = items.map(toHtml).join('');
  }
  function emptyHtml() {
    return '<div class="rf-empty">' +
      '<span class="rf-empty__icon">' + SEARCH_SVG + '</span>' +
      '<span class="rf-empty__title">這個分類暫時沒有商品</span>' +
      '<span class="rf-empty__desc">換個分類，或稍後再回來逛逛</span></div>';
  }
  /* loading skeleton — n placeholder cards, shown until data fills */
  /* Product-card skeleton — composed from the SHARED .ds-skeleton primitive
     (components.css), so it shimmers on every page, not just body.rf-shop.
     Shape mirrors the real shop-card: 2:3 poster + cat/title/price lines. */
  function skeletonHtml(n) {
    var one = '<div class="ds-skeleton-card">' +
      '<div class="ds-skeleton ds-skeleton--poster"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--cat"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--title"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--price"></div></div>';
    var out = ''; for (var i = 0; i < (n || 10); i++) out += one; return out;
  }
  function showSkeleton(gridEl, n) { if (gridEl) gridEl.innerHTML = skeletonHtml(n); }

  function setCount(id, n, unit) {
    var el = document.getElementById(id);
    if (!el) return;
    /* brief fade so the count change registers when filtering */
    el.classList.add('is-updating');
    setTimeout(function () {
      el.textContent = n + ' ' + (unit || '件');
      el.classList.remove('is-updating');
    }, 120);
  }
  function wireFilter(barEl, gridEl, countId, items, toHtml, matchFn, unit) {
    if (!barEl || !gridEl) return;
    var match = matchFn || function (p, cat) { return p.cat === cat; };

    /* "all" = no cats, or the catch-all 全部 is in the set */
    function isAll(cats) { return !cats || !cats.length || cats.indexOf('全部') >= 0; }
    function filtered(cats) {
      return isAll(cats) ? items
        : items.filter(function (p) { return cats.some(function (c) { return match(p, c); }); });
    }
    /* count for a tentative selection — used by the mobile sheet's "Show X results"
       WITHOUT touching the grid (no live-refresh mid-selection) */
    function countFor(cats) { return filtered(cats).length; }
    /* apply a (multi-cat) selection: render + count + sync the inline bar's
       active state. Drives both the desktop click path and the mobile sheet. */
    function apply(cats) {
      var all = isAll(cats);
      var list = filtered(cats);
      renderInto(gridEl, list, toHtml, unit);
      setCount(countId, list.length, unit);
      barEl.querySelectorAll('.shop-filter__item').forEach(function (b) {
        var c = b.getAttribute('data-cat');
        b.classList.toggle('shop-filter__item--active', all ? (c === '全部') : (cats.indexOf(c) >= 0));
      });
    }

    /* expose context so assets/shop-filter-sheet.js can build the mobile sheet
       from this bar and drive multi-select filtering through the same render */
    barEl.__shopFilter = { items: items, match: match, unit: unit, countFor: countFor, apply: apply };

    /* desktop (and no-JS-sheet) path: clicking a bar item selects just that one */
    barEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.shop-filter__item');
      if (!btn) return;
      apply([btn.getAttribute('data-cat')]);
    });
  }

  /* ── add-to-cart toast (single, lazy instance) ── */
  var _toast, _toastTimer;
  function toast(msg, linkText, ms, onLink) {
    if (!_toast) {
      _toast = document.createElement('div');
      _toast.className = 'rf-toast';
      _toast.setAttribute('role', 'status');
      _toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(_toast);
    }
    _toast.innerHTML = '<span class="rf-toast__dot">' + CHECK_SVG + '</span>' +
      '<span>' + esc(msg) + '</span>' +
      (linkText ? '<button type="button" class="rf-toast__link">' + esc(linkText) + '</button>' : '');
    /* Wire the action link (e.g. 去結帳 → open the cart). The toast lives on
       <body>, OUTSIDE the grid's delegated click listener, so it needs its own
       handler — and the CSS gives .is-open pointer-events:auto so taps land. */
    if (linkText && onLink) {
      var _lk = _toast.querySelector('.rf-toast__link');
      if (_lk) _lk.onclick = onLink;
    }
    /* force reflow so the transition runs even on rapid repeat */
    void _toast.offsetWidth;
    _toast.classList.add('is-open');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { _toast.classList.remove('is-open'); }, ms || 2400);
  }

  /* ── delegated card interactions: wishlist · quick-add · bid ──
     One listener on the grid; the card <a> href="#" is suppressed so a
     control click never navigates. Mock behavior for the preview. */
  function wireCardActions(gridEl) {
    if (!gridEl || gridEl.__rfWired) return;
    gridEl.__rfWired = true;
    gridEl.addEventListener('click', function (e) {
      var wish = e.target.closest('[data-wish]');
      var add = e.target.closest('[data-add]');
      var bid = e.target.closest('[data-bid]');
      if (!wish && !add && !bid) return;
      e.preventDefault();
      e.stopPropagation();
      var card = (wish || add || bid).closest('.shop-card');
      var name = card ? (card.getAttribute('data-name') || '商品') : '商品';

      if (wish) {
        var on = wish.getAttribute('aria-pressed') !== 'true';
        wish.setAttribute('aria-pressed', on ? 'true' : 'false');
        wish.setAttribute('aria-label', on ? '已加入願望清單' : '加入願望清單');
        if (on) { wish.classList.remove('rf-wish--pop'); void wish.offsetWidth; wish.classList.add('rf-wish--pop'); toast('已加入願望清單', '查看'); }
        return;
      }
      if (add) {
        add.classList.add('is-added');
        add.innerHTML = '<span class="shop-card__qa-icon" aria-hidden="true">' + CHECK_SVG + '</span>';
        toast('「' + name + '」已加入購物車', '去結帳', 3400, function () {
          if (window.ZtorCart && window.ZtorCart.openDrawer) window.ZtorCart.openDrawer();
        });
        setTimeout(function () {
          add.classList.remove('is-added');
          add.innerHTML = '<span class="shop-card__qa-icon" aria-hidden="true">' + CART_SVG + '</span>';
        }, 1600);
        return;
      }
      if (bid) {
        /* mock a successful bid: bump the current bid + count, flip state to leading */
        var valEl = card.querySelector('[data-bid-val]');
        if (valEl) {
          var cur = Number(valEl.getAttribute('data-bid-val')) || 0;
          var inc = cur >= 50000 ? 2000 : (cur >= 10000 ? 1000 : 500);
          var next = cur + inc;
          valEl.setAttribute('data-bid-val', next);
          valEl.textContent = 'NT$ ' + fmt(next);
        }
        var bidsEl = card.querySelector('.rf-auc-meta__bids');
        if (bidsEl) { var nb = (parseInt(bidsEl.textContent, 10) || 0) + 1; bidsEl.textContent = nb + ' 次出價'; }
        var metaEl = card.querySelector('.rf-auc-meta');
        if (metaEl) {
          var st = metaEl.querySelector('.rf-auc-state');
          if (!st) { st = document.createElement('span'); metaEl.appendChild(st); }
          st.className = 'rf-auc-state rf-auc-state--leading';
          st.textContent = '最高出價';
        }
        toast('出價成功，你目前是最高出價者', '查看');
        return;
      }
    });
  }

  /* ── live auction countdown ticker (one rAF-throttled interval) ── */
  function startCountdowns(gridEl) {
    if (!gridEl) return;
    function tick() {
      var pills = gridEl.querySelectorAll('[data-countdown]');
      pills.forEach(function (pill) {
        var ends = pill.getAttribute('data-ends');
        var ms = endMs(ends);
        var txt = pill.querySelector('[data-cd-text]');
        if (txt) txt.textContent = countdownText(ms);
        if (ms <= 0) { pill.classList.add('rf-auc-pill--ended'); pill.classList.remove('rf-auc-pill--soon'); }
        else if (ms < SOON_MS && !pill.classList.contains('rf-auc-pill--soon')) { pill.classList.add('rf-auc-pill--soon'); }
      });
    }
    tick();
    if (gridEl.__rfTimer) clearInterval(gridEl.__rfTimer);
    gridEl.__rfTimer = setInterval(tick, 1000);
  }

  function fanHtml(f, extraClass) {
    var t = tierOf(f.points);
    return '<div class="top-fan top-fan--' + t.key + (extraClass || '') + '"><span class="top-fan__avatar">' +
      '<img src="' + avatar(f.seed, f.nick) + '" alt="' + esc(f.nick) + '" loading="lazy">' +
      '<span class="top-fan__rank">' + f.rank + '</span></span>' +
      '<span class="top-fan__nick">' + esc(f.nick) + '</span>' +
      '<span class="top-fan__pts">' + fmt(f.points) + '</span></div>';
  }

  /* shared: fill the identity hero (name / tagline / portrait / meta) */
  function fillCreatorHead(slug) {
    var c = (S.creators || []).filter(function (x) { return x.slug === slug; })[0];
    if (!c) return null;
    document.title = 'Ztor. 創作者商店 — ' + c.name;
    var hero = document.getElementById('creatorHeroBg');
    if (hero) hero.style.backgroundImage = "url('assets/images/shop/creator-" + slug + ".webp')";
    var put = function (id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
    put('creatorName', c.name);
    put('creatorTagline', c.tagline);
    put('creatorFollowers', c.role + ' · ' + c.followers + ' 追蹤');
    return c;
  }

  /* ── page initializers ── */
  window.ZTOR_SHOP_RENDER = {
    avatar: avatar,
    initShop: function () {
      var grid = document.getElementById('shopGrid');
      var items = S.products || [];
      showSkeleton(grid, 10);
      requestAnimationFrame(function () {
        renderInto(grid, items, productCardHtml);
        setCount('shopCount', items.length);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
      wireFilter(document.getElementById('shopFilter'), grid, 'shopCount', items, productCardHtml);
      wireCardActions(grid);
    },
    initPopcorn: function () {
      var grid = document.getElementById('popcornGrid');
      var items = S.popcornItems || [];
      showSkeleton(grid, 10);
      requestAnimationFrame(function () {
        renderInto(grid, items, popcornCardHtml);
        setCount('popcornCount', items.length);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
      wireFilter(document.getElementById('popcornFilter'), grid, 'popcornCount', items, popcornCardHtml);
      wireCardActions(grid);
    },
    initShopEvents: function () {
      var grid = document.getElementById('shopEventsGrid');
      var items = S.shopEvents || [];
      showSkeleton(grid, 8);
      requestAnimationFrame(function () {
        renderInto(grid, items, eventCardHtml);
        setCount('shopEventsCount', items.length);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
      wireFilter(document.getElementById('shopEventsFilter'), grid, 'shopEventsCount', items, eventCardHtml);
      wireCardActions(grid);
    },
    initAuction: function () {
      var grid = document.getElementById('auctionGrid');
      var items = S.auctions || [];
      showSkeleton(grid, 8);
      requestAnimationFrame(function () {
        renderInto(grid, items, auctionCardHtml, '件');
        setCount('auctionCount', items.length);
        startCountdowns(grid);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
      /* re-arm the ticker after a filter re-render */
      var bar = document.getElementById('auctionFilter');
      wireFilter(bar, grid, 'auctionCount', items, auctionCardHtml);
      if (bar) bar.addEventListener('click', function () { startCountdowns(grid); });
      wireCardActions(grid);
    },
    initCreators: function () {
      var grid = document.getElementById('creatorGrid');
      var items = S.creators || [];
      showSkeleton(grid, 8);
      requestAnimationFrame(function () {
        renderInto(grid, items, creatorCardHtml);
        setCount('creatorCount', items.length, '位');
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
      /* role filter matches by containment: 歌手／演員 answers to both */
      wireFilter(document.getElementById('creatorFilter'), grid, 'creatorCount',
        items, creatorCardHtml,
        function (c, cat) { return (c.role || '').indexOf(cat) >= 0; }, '位');
    },

    initCreatorPage: function (slug) {
      var c = fillCreatorHead(slug);
      if (!c) return;
      var put = function (id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
      put('creatorBio', c.bio);
      put('creatorShopCount', (c.products || []).length + ' 件');

      /* pickup slot: the first badged, in-stock product is the drop */
      var pick = (c.products || []).filter(function (p) { return p.badge && !p.soldOut; })[0] || (c.products || [])[0];
      if (pick) {
        var pm = document.getElementById('creatorPickupMedia');
        if (pm) pm.innerHTML = '<img src="' + prodImg(pick.id) + '" alt="' + esc(pick.name) + '" onerror="' + ON_ERR + '">';
        put('creatorPickupName', pick.name);
        put('creatorPickupPrice', 'NT$ ' + fmt(pick.ntd) + (pick.hkd ? ' · HK$ ' + fmt(pick.hkd) : ''));
      }

      /* Shop sub-nav (商品 / 套組 / 拍賣). 套組 = products badged "Bundle";
         商品 = everything else. Panels render up-front; ds.js shop-subnav
         toggles which is visible. */
      var prods = c.products || [];
      var isBundle = function (p) { return p.badge === 'Bundle' || /套組/.test(p.name || ''); };
      var goods = prods.filter(function (p) { return !isBundle(p); });
      renderInto(document.getElementById('creatorProducts'), goods, productCardHtml);
      var bundlesEl = document.getElementById('creatorBundles');
      if (bundlesEl) renderInto(bundlesEl, prods.filter(isBundle), productCardHtml);

      /* 拍賣 — use c.auctions if the data provides it, else derive a few
         signed/limited lots from the creator's priciest goods (image reused via
         the same id). End dates are computed relative to today so the live
         countdown never expires in the preview. */
      var aucEl = document.getElementById('creatorAuction');
      if (aucEl) {
        var auctions = c.auctions;
        if (!auctions || !auctions.length) {
          var plusDays = function (n) { var d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
          var ENDS = [plusDays(4), plusDays(8), plusDays(13)];
          var aucHash = function (s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff; return h; };
          auctions = goods.slice().sort(function (a, b) { return (b.ntd || 0) - (a.ntd || 0); }).slice(0, 3)
            .map(function (p, i) {
              return {
                id: p.id,
                name: '【親筆簽名・限量】' + p.name,
                ends: ENDS[i % ENDS.length],
                bid: Math.max(500, Math.round((p.ntd || 500) * 2.4 / 100) * 100),
                bids: (aucHash(p.id) % 26) + 4,
                badge: '限量'
              };
            });
        }
        renderInto(aucEl, auctions, auctionCardHtml);
        startCountdowns(aucEl);
        wireCardActions(aucEl);
      }

      var ev = document.getElementById('creatorEvents');
      if (ev) {
        ev.innerHTML = (c.events || []).map(function (e) {
          return '<div class="creator-event"><span class="creator-event__date">' + esc(e.date) + ' · ' + esc(e.type) + '</span>' +
            '<span class="creator-event__title">' + esc(e.title) + '</span>' +
            '<span class="creator-event__venue">' + esc(e.venue) + '</span></div>';
        }).join('');
      }

      /* top-5 fans strip from the leaderboard data */
      var board = (S.fanboards || {})[slug] || [];
      var fans = document.getElementById('creatorFans');
      if (fans) fans.innerHTML = board.slice(0, 5).map(function (f) { return fanHtml(f); }).join('');
    },

    /* 活動 — vertical timeline roadmap (upcoming lit, past dimmed) */
    initCreatorEvents: function (slug) {
      fillCreatorHead(slug);
      var evs = (S.creatorEventsFull || {})[slug] || [];
      var cnt = document.getElementById('creatorEventsCount');
      if (cnt) cnt.textContent = evs.length + ' 場';
      var el = document.getElementById('creatorTimeline');
      if (!el) return;
      el.innerHTML = evs.map(function (e) {
        var past = e.status === '已結束';
        var mod = past ? ' timeline-item--past' : ' timeline-item--live';
        var sMod = e.status === '開售中' ? ' timeline-item__status--onsale' : '';
        var cta = e.status === '開售中' ? '<button class="btn btn--yellow-ghost btn--sm" type="button">購票</button>' : '';
        return '<div class="timeline-item' + mod + '">' +
          '<div class="timeline-item__poster"><img src="' + imgFor(e.id, 330, 495) + '" alt="' + esc(e.title) + '" loading="lazy" onerror="' + ON_ERR + '"></div>' +
          '<div class="timeline-item__copy">' +
          '<span class="timeline-item__date">' + esc(e.date) + ' · ' + esc(e.type) + '</span>' +
          '<span class="timeline-item__title">' + esc(e.title) + '</span>' +
          '<span class="timeline-item__meta">' + esc(e.venue) + '</span>' +
          '<span class="timeline-item__status' + sMod + '">' + esc(e.status) + '</span>' +
          cta + '</div></div>';
      }).join('');
    },

    /* 貼文 — IG-style profile grid */
    initCreatorPosts: function (slug) {
      var c = fillCreatorHead(slug);
      var posts = (S.creatorPostsFull || {})[slug] || [];
      var av = document.getElementById('igAvatar');
      if (av) av.innerHTML = '<img src="assets/images/shop/creator-' + esc(slug) + '.webp" alt="">';
      var nm = document.getElementById('igName');
      if (nm && c) nm.textContent = c.name;
      var st = document.getElementById('igStats');
      if (st && c) {
        st.innerHTML = '<span class="ig-stat"><b>' + posts.length + '</b>貼文</span>' +
          '<span class="ig-stat"><b>' + esc(c.followers) + '</b>追蹤者</span>' +
          '<span class="ig-stat"><b>' + ((S.creatorEventsFull || {})[slug] || []).length + '</b>場活動</span>';
      }
      var grid = document.getElementById('igGrid');
      if (grid) {
        grid.innerHTML = posts.map(function (po) {
          return '<div class="ig-cell"><img src="' + imgFor(po.id, 600, 600) + '" alt="" loading="lazy" onerror="' + ON_ERR + '">' +
            '<div class="ig-cell__overlay"><span class="ig-cell__likes">♡ ' + fmt(po.likes) + '</span>' +
            '<span class="ig-cell__caption">' + esc(po.caption) + '</span></div></div>';
        }).join('');
      }
    },

    /* 項目 — the working register, rendered as cocreate-style cards
       (same .cocreation-card anatomy as cocreate.html) */
    initCreatorRegistry: function (slug) {
      var c = fillCreatorHead(slug) || {};
      var el = document.getElementById('creatorRegistry');
      if (!el) return;
      var CHECK = '<span class="status-tag__icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 4.5"/></svg></span>';

      function card(kind, seed, tagCls, tagHtml, title, descHtml, metricsHtml) {
        return '<a class="cocreation-card" href="#" data-cat="' + kind + '">' +
          '<span class="cocreation-card__poster"><img src="' + imgFor(seed, 600, 400) + '" alt="' + esc(title) + '" loading="lazy" onerror="' + ON_ERR + '"></span>' +
          '<div class="cocreation-card__body">' +
          '<span class="status-tag ' + tagCls + '">' + tagHtml + '</span>' +
          '<h3 class="cocreation-card__title">' + esc(title) + '</h3>' +
          descHtml + metricsHtml + '</div></a>';
      }
      function bar(progress, leftMeta, rightMeta) {
        return '<div class="cocreation-card__metrics">' +
          '<div class="cocreation-card__bar"><div class="cocreation-card__bar-fill" style="width: ' + progress + '%;"></div></div>' +
          '<div class="cocreation-card__meta-row"><span>' + leftMeta + '</span><span>' + rightMeta + '</span></div></div>';
      }

      var items = [];
      ((S.creatorProjects || {})[slug] || []).forEach(function (pr, i) {
        var seed = slug + '-proj-' + i;
        if (pr.status === '即將開放') {
          items.push(card('共創計畫', seed, 'status-tag--soon', '即將開放', pr.title,
            '<p class="cocreation-card__note">敬請期待</p>', ''));
        } else if (pr.status === '已達標') {
          items.push(card('共創計畫', seed, 'status-tag--green', CHECK + '目標達成', pr.title, '',
            bar(100, '達成 100%', fmt(pr.backers) + ' 位支持者')));
        } else {
          items.push(card('共創計畫', seed, 'status-tag--yellow', '計畫進行中', pr.title, '',
            bar(pr.progress, '達成 ' + pr.progress + '%', fmt(pr.backers) + ' 位支持者')));
        }
      });
      ((c.products || []).filter(function (p) { return p.badge && !p.soldOut; }).slice(0, 6)).forEach(function (p) {
        items.push(card('預售與限量', p.id, 'status-tag--yellow', esc(p.badge) + '販售中', p.name,
          '<p class="cocreation-card__note">NT$ ' + fmt(p.ntd) + '</p>', ''));
      });
      (((S.creatorEventsFull || {})[slug]) || []).forEach(function (e, i) {
        var past = e.status === '已結束';
        var cls = past ? 'status-tag--ended' : (e.status === '開售中' ? 'status-tag--yellow' : 'status-tag--soon');
        items.push(card('活動', e.id, cls, esc(e.status), e.title,
          '<p class="cocreation-card__note">' + esc(e.date) + ' · ' + esc(e.venue) + '</p>', ''));
      });

      el.innerHTML = items.join('');
      var cnt = document.getElementById('creatorRegistryCount');
      if (cnt) cnt.textContent = items.length + ' 項';

      var barEl = document.getElementById('registryFilter');
      if (barEl) {
        barEl.addEventListener('click', function (ev) {
          var btn = ev.target.closest('.shop-filter__item');
          if (!btn) return;
          barEl.querySelectorAll('.shop-filter__item').forEach(function (b) {
            b.classList.toggle('shop-filter__item--active', b === btn);
          });
          var cat = btn.getAttribute('data-cat');
          var shown = 0;
          el.querySelectorAll('.cocreation-card').forEach(function (cd) {
            var show = (cat === '全部') || cd.getAttribute('data-cat') === cat;
            cd.style.display = show ? '' : 'none';
            if (show) shown++;
          });
          if (cnt) cnt.textContent = shown + ' 項';
        });
      }
    },

    initLeaderboard: function () {
      var slug = (new URLSearchParams(location.search)).get('creator') || 'jay-chou';
      var c = fillCreatorHead(slug);
      var board = (S.fanboards || {})[slug] || [];
      if (!c || !board.length) return;
      document.title = 'Ztor. 頭號粉絲積分榜 — ' + c.name;
      /* tab row: same five doors as every creator page */
      document.querySelectorAll('#lbTabs [data-link]').forEach(function (t) {
        t.href = 'creator-' + slug + t.getAttribute('data-link') + '.html';
      });

      /* podium: 2 · 1 · 3 */
      var podium = document.getElementById('lbPodium');
      if (podium && board.length >= 3) {
        podium.innerHTML =
          fanHtml(board[1]) +
          fanHtml(board[0], ' top-fan--first') +
          fanHtml(board[2]);
      }

      /* table from #4 */
      var table = document.getElementById('lbTable');
      if (table) {
        table.innerHTML = board.slice(3).map(function (f) {
          var t = tierOf(f.points);
          return '<div class="lb-row lb-row--' + t.key + '">' +
            '<span class="lb-row__rank">' + f.rank + '</span>' +
            '<span class="lb-row__avatar"><img src="' + avatar(f.seed, f.nick) + '" alt="" loading="lazy"></span>' +
            '<span class="lb-row__nick">' + esc(f.nick) + '</span>' +
            '<span class="lb-chip lb-chip--' + t.key + '">' + t.label + '</span>' +
            '<span class="lb-row__pts">' + fmt(f.points) + '</span>' +
            '</div>';
        }).join('');
      }
    }
  };
})();
