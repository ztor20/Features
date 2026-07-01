/* Ztor 2.0 — Leaderboard tier-benefits overlay (refine layer).
   Click / Enter / Space a tier card → modal showing that tier's perks
   (stacking), plus the shared 「如何賺積分」 and 「快速攻略」.
   Mobbin-benchmarked (Gymshark / Sephora / Vrbo / Grab): spend→points
   stated, perks as a checklist, climb tips. Brand skin only, no deps;
   motion is CSS-driven and prefers-reduced-motion safe. */
(function () {
  'use strict';
  var body = document.body;
  if (!body || body.className.indexOf('rf-leaderboard') === -1) return;

  var USER_POINTS = 12480; // demo: current season score for the signed-in fan

  var TIERS = {
    inner: {
      name: 'INNER CIRCLE', chip: 'lb-chip--inner', accent: 'var(--yellow-500)',
      threshold: 80000, note: '80,000 分以上 · 每季限額 12 席',
      benefits: ['專屬首映禮入場資格', '創作者親簽珍藏品', '共創計畫署名與早期參與權', '年度限定實體禮盒'],
      inherits: 'SUPER FANS'
    },
    'super': {
      name: 'SUPER FANS', chip: 'lb-chip--super', accent: 'var(--success-500)',
      threshold: 30000, note: '30,000 分以上',
      benefits: ['限量周邊購買資格', '首映場與活動優先購票', '共創投票權重加倍', '專屬客服通道'],
      inherits: 'SUPPORTER'
    },
    supporter: {
      name: 'SUPPORTER', chip: 'lb-chip--supporter', accent: 'var(--info-500)',
      threshold: 8000, note: '8,000 分以上',
      benefits: ['爆米花回饋加碼 1.5 倍', '專屬等級徽章', '搶先看預告與幕後花絮'],
      inherits: 'FANS'
    },
    fans: {
      name: 'FANS', chip: '', accent: 'var(--neutral-400)',
      threshold: 0, note: '開始累積你的第一分',
      benefits: ['解鎖社群發文與投票', '參與每週影片票選', '基本爆米花回饋'],
      inherits: null
    }
  };

  // How you earn — spend-led, then engagement. Same for every tier.
  var EARN = [
    ['儲值 / 消費爆米花', '每 NT$1 ＝ 10 分'],
    ['競標得標限量珍藏', '最高 +5,000'],
    ['購買限量周邊', '每件 +500'],
    ['觀看正片 / 首映', '每部 +200'],
    ['參與共創投票 / 提案', '+150'],
    ['每日簽到', '+50'],
    ['社群發文與互動', '每則 +30'],
    ['邀請好友加入', '每位 +1,000']
  ];

  var TIPS = [
    '賽季加倍週：活動期間積分 ×2，集中在這幾天消費與互動最划算。',
    '競標與限量周邊是單筆分數最高的來源 — 一次得標可抵數十次簽到。',
    '連續簽到 7 天解鎖額外 +200 連續獎勵。',
    '越早升級，共創投票權重越高，之後每一票賺得越多。',
    '賽季每季重置 — 把握當季衝刺 INNER CIRCLE 的 12 席。'
  ];

  function fmt(n) { return n.toLocaleString('en-US'); }
  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var opener = null;
  var currentKey = null;

  /* Dict-driven translate for sentences BUILT in JS. The source Chinese
     (with {tokens}) is the dictionary key; the English lives in
     locales/*.json — nothing is hardcoded per-language here. We translate the
     whole template, THEN substitute the dynamic values, because the i18n
     runtime matches whole text nodes: a sentence assembled as
     "prefix + value + suffix" produces a composite node no key matches, so it
     silently leaks the source language. Falls back to source if i18n isn't
     ready yet (modal only opens on click, well after i18n loads). */
  function T(zh) { return (window.ztorI18n && window.ztorI18n.t) ? window.ztorI18n.t(zh) : zh; }

  // ---- build the shell once ----
  var wrap = document.createElement('div');
  wrap.className = 'lb-bx';
  wrap.setAttribute('hidden', '');
  wrap.innerHTML =
    '<div class="lb-bx__backdrop" data-lb-close></div>' +
    '<div class="lb-bx__dialog" role="dialog" aria-modal="true" aria-labelledby="lbBxTitle" tabindex="-1">' +
      '<button class="lb-bx__close" type="button" aria-label="關閉" data-lb-close>&times;</button>' +
      '<span class="lb-bx__accent" aria-hidden="true"></span>' +
      '<div class="lb-bx__body"></div>' +
      '<footer class="lb-bx__foot" data-lb-foot></footer>' +
    '</div>';
  body.appendChild(wrap);
  var dialog = wrap.querySelector('.lb-bx__dialog');
  var bodyEl = wrap.querySelector('.lb-bx__body');
  var footEl = wrap.querySelector('[data-lb-foot]');

  function render(key) {
    var t = TIERS[key];
    if (!t) return;
    dialog.style.setProperty('--bx-accent', t.accent);

    var reached = USER_POINTS >= t.threshold;
    var pct = t.threshold > 0 ? Math.min(100, Math.round(USER_POINTS / t.threshold * 100)) : 100;
    var status = reached
      ? T('你已達成此等級')
      : T('目前 {pts} 分 · 距離 {tier} 還差 {gap} 分')
          .replace('{pts}', fmt(USER_POINTS))
          .replace('{tier}', t.name)
          .replace('{gap}', fmt(t.threshold - USER_POINTS));

    var perks = t.benefits.map(function (b) {
      return '<li class="lb-bx__perk"><span class="lb-bx__tick" aria-hidden="true"></span>' + esc(b) + '</li>';
    }).join('');
    var inherit = t.inherits
      ? '<p class="lb-bx__inherit">' + T('＋ 包含 {tier} 等級全部權益').replace('{tier}', esc(t.inherits)) + '</p>' : '';

    var earn = EARN.map(function (e) {
      return '<li class="lb-bx__earn-row"><span>' + esc(e[0]) + '</span>' +
             '<span class="lb-bx__pts">' + esc(e[1]) + '</span></li>';
    }).join('');

    var tips = TIPS.map(function (tp) { return '<li class="lb-bx__tip">' + esc(tp) + '</li>'; }).join('');

    var chipClass = 'lb-chip' + (t.chip ? ' ' + t.chip : '');
    var ctaLabel = reached ? '前往爆米花商店' : '儲值爆米花 · 衝高排名';

    bodyEl.innerHTML =
      '<header class="lb-bx__head">' +
        '<span class="' + chipClass + '" id="lbBxTitle">' + esc(t.name) + '</span>' +
        '<p class="lb-bx__note">' + esc(t.note) + '</p>' +
        '<div class="lb-bx__bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
        '<p class="lb-bx__status' + (reached ? ' is-reached' : '') + '">' + esc(status) + '</p>' +
      '</header>' +
      '<section class="lb-bx__sec"><h3 class="lb-bx__h">專屬權益</h3>' +
        '<ul class="lb-bx__perks">' + perks + '</ul>' + inherit + '</section>' +
      '<section class="lb-bx__sec"><h3 class="lb-bx__h">如何賺積分</h3>' +
        '<ul class="lb-bx__earn">' + earn + '</ul></section>' +
      '<section class="lb-bx__sec lb-bx__sec--tips"><h3 class="lb-bx__h">快速攻略</h3>' +
        '<ul class="lb-bx__tips">' + tips + '</ul></section>';
    /* CTA lives in the pinned foot (a sibling of the scroll body, not inside it)
       so it stays reachable without scrolling the long tier content. */
    footEl.innerHTML =
      '<a class="lb-bx__cta" href="shop-popcorn.html">' + esc(ctaLabel) + '</a>';
  }

  function open(key, fromEl) {
    opener = fromEl || null;
    currentKey = key;
    render(key);
    wrap.removeAttribute('hidden');
    void wrap.offsetWidth; // reflow so the transition runs
    wrap.classList.add('is-open');
    body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey, true);
    dialog.focus();
  }

  function close() {
    wrap.classList.remove('is-open');
    document.removeEventListener('keydown', onKey, true);
    body.style.overflow = '';
    var finish = function () { wrap.setAttribute('hidden', ''); };
    if (REDUCED) finish(); else setTimeout(finish, 220);
    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var nodes = Array.prototype.filter.call(
        dialog.querySelectorAll('a[href],button:not([disabled])'),
        function (n) { return n.offsetParent !== null; }
      );
      if (!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  wrap.addEventListener('click', function (e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-lb-close')) close();
  });

  /* Re-render an open modal when the language switches so the templated
     status / inherit lines pick up the new locale (the rest re-translates via
     i18n's MutationObserver on the fresh innerHTML). */
  document.addEventListener('i18n:applied', function () {
    if (currentKey && !wrap.hasAttribute('hidden')) render(currentKey);
  });

  // ---- wire the tier cards ----
  Array.prototype.forEach.call(document.querySelectorAll('.lb-legend__tier[data-tier]'), function (card) {
    var key = card.getAttribute('data-tier');
    card.addEventListener('click', function () { open(key, card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); open(key, card); }
    });
  });
})();
