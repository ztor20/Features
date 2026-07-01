/* ────────────────────────────────────────────
   Ztor 2.0 — Co-create behaviours (cocreate.js)
   ------------------------------------------------------------
   Front-end MOCK behaviours for the co-create inner page:
     • cc-countdown — live "距結束" ticker (DS.register, reduced-motion safe).
     • backing drawer — opens the ds-drawer primitive with the reward-tier
       stepper. THIS SLICE builds step 1 (選擇方案) + step 2 (登入閘道 stub);
       the payment / SetupIntent / 承諾成功 steps land in the next build slice.

   Money is NEVER charged here. At pledge the real backend issues a Stripe
   SetupIntent (card verified, not charged) and captures off_session only when
   the goal is hit — all stubbed (see HANDOFF.md). The UI only simulates.

   Loads AFTER ds.js + ds-drawer.js. Idempotent (cart.js-style guard) and
   uses delegated document listeners so it works on JS-rendered triggers.
   ──────────────────────────────────────────── */
(function () {
  'use strict';
  if (window.__ztorCocreateInit) return;
  window.__ztorCocreateInit = true;

  var R = window.ZTOR_COCREATE_RENDER || {};
  var esc = R.esc || function (s) { return String(s == null ? '' : s); };
  var fmt = R.fmt || function (n) { return String(n); };

  /* ── countdown ticker ─────────────────────────────────────── */
  if (window.DS) {
    DS.register('cc-countdown', '[data-cc-countdown]', function (el) {
      var val = parseInt(el.getAttribute('data-cc-countdown'), 10) || 0;
      var unit = el.getAttribute('data-cc-unit') || 'days';
      var end = Date.now() + (unit === 'hours' ? val * 3600000 : val * 86400000);
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      function tick() {
        var ms = end - Date.now();
        if (ms <= 0) { el.textContent = '已結束'; return; }
        var m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
        if (unit === 'hours') {
          el.textContent = pad(Math.floor(ms / 3600000)) + ':' + pad(m) + ':' + pad(s);   // total hours (cure window)
        } else {
          el.textContent = Math.floor(ms / 86400000) + ' 天 ' + pad(Math.floor((ms % 86400000) / 3600000)) + ':' + pad(m) + ':' + pad(s);
        }
        setTimeout(tick, 1000);
      }
      tick();
    });
  }

  /* ── backing drawer ───────────────────────────────────────── */
  function project() {
    return (R.findProject ? R.findProject(param('id')) : null);
  }
  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search || '');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function pkgById(p, id) {
    var list = (p && p.packages) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function isLoggedIn() { return document.body.getAttribute('data-auth') === 'logged-in'; }

  /* ── preview / share overlay (centered modal) ─────────────────────────── */
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  function ccOverlay() {
    var o = document.querySelector('[data-cc-overlay]');
    if (o) return o;
    o = document.createElement('div');
    o.className = 'cc-overlay';
    o.setAttribute('data-cc-overlay', '');
    o.setAttribute('aria-hidden', 'true');
    o.innerHTML =
      '<div class="cc-overlay__scrim" data-cc-overlay-close></div>' +
      '<div class="cc-overlay__dialog" role="dialog" aria-modal="true">' +
        '<button class="cc-overlay__close" type="button" aria-label="關閉" data-cc-overlay-close>&times;</button>' +
        '<div class="cc-overlay__body"></div>' +
      '</div>';
    document.body.appendChild(o);
    return o;
  }
  function openOverlay(html) {
    var o = ccOverlay();
    o.querySelector('.cc-overlay__body').innerHTML = html;
    o.classList.add('is-open');
    o.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ds-drawer-open');
    var c = o.querySelector('.cc-overlay__close'); if (c) c.focus();
  }
  function closeOverlay() {
    var o = document.querySelector('[data-cc-overlay]'); if (!o) return;
    var m = o.querySelector('video, audio'); if (m) { try { m.pause(); } catch (e) {} }
    o.classList.remove('is-open'); o.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ds-drawer-open');
  }

  /* preview content keyed to media type — film → trailer/clip · song → demo
     · concert → info + photos. Real video/audio are backend stubs (HANDOFF). */
  function previewHtml(p) {
    if (!p) return '';
    var t = p.mediaType || 'film';
    if (t === 'song') {
      var cover = (p.preview && p.preview.cover) || p.poster;
      var demo = p.preview && p.preview.demo;
      return '<div class="cc-pv"><h2 class="cc-pv__title">試聽 Demo</h2>' +
        '<div class="cc-pv__song"><img class="cc-pv__cover" src="' + esc(cover) + '" alt="">' +
        '<div class="cc-pv__songbody"><div class="cc-pv__track">' + esc((p.preview && p.preview.track) || p.title) + '</div>' +
        (demo ? '<audio controls src="' + esc(demo) + '"></audio>' : '<div class="cc-pv__placeholder">Demo 音檔為後端整合項目（示範）。</div>') +
        '</div></div></div>';
    }
    if (t === 'concert') {
      var photos = (p.preview && p.preview.photos) || p.stills || [];
      return '<div class="cc-pv"><h2 class="cc-pv__title">活動資訊</h2>' +
        (p.about ? '<p class="cc-pv__info">' + esc(p.about) + '</p>' : '') +
        '<div class="cc-pv__gallery">' + photos.map(function (s) { return '<img src="' + esc(s) + '" alt="" loading="lazy">'; }).join('') + '</div></div>';
    }
    var frame = (p.stills && p.stills[0]) || p.poster;
    var trailer = p.preview && p.preview.trailer;
    var media = trailer
      ? '<video class="cc-pv__video" src="' + esc(trailer) + '" poster="' + esc(frame) + '" controls autoplay playsinline></video>'
      : '<div class="cc-pv__frame"><img src="' + esc(frame) + '" alt=""><span class="cc-pv__play">' + PLAY + '</span><span class="cc-pv__cap">預告片</span></div>';
    return '<div class="cc-pv"><h2 class="cc-pv__title">預告片</h2>' + media +
      '<p class="cc-pv__note">此為前端示範；正片／預告影片連結為後端整合項目。</p></div>';
  }

  /* 追蹤進度 (producing): roadmap timeline of platform / creator updates */
  function updatesHtml(p) {
    var items = (p && p.updates) || [];
    if (!items.length) return '<div class="cc-pv"><h2 class="cc-pv__title">製作進度</h2><p class="cc-pv__info">目前尚無更新，開拍後將在此同步進度。</p></div>';
    return '<div class="cc-pv"><h2 class="cc-pv__title">製作進度</h2>' +
      '<ol class="cc-timeline">' + items.map(function (u) {
        var state = u.state || 'upcoming';
        return '<li class="cc-timeline__item cc-timeline__item--' + esc(state) + '">' +
          '<span class="cc-timeline__dot" aria-hidden="true"></span>' +
          '<div class="cc-timeline__body">' +
            '<div class="cc-timeline__head"><span class="cc-timeline__date">' + esc(u.date || '') + '</span>' +
            (u.by ? '<span class="cc-timeline__by">' + esc(u.by) + '</span>' : '') + '</div>' +
            '<h3 class="cc-timeline__title">' + esc(u.title || '') + '</h3>' +
            (u.body ? '<p class="cc-timeline__text">' + esc(u.body) + '</p>' : '') +
          '</div></li>';
      }).join('') + '</ol></div>';
  }

  function openShare(p) {
    if (!p) return;
    var url = location.href;
    var enc = encodeURIComponent(url), te = encodeURIComponent(p.title + ' ' + url);
    openOverlay('<div class="cc-sh"><h2 class="cc-pv__title">分享這個計畫</h2>' +
      '<p class="cc-sh__sub">' + esc(p.title) + '</p>' +
      '<div class="cc-sh__copy"><input class="cc-sh__url" type="text" readonly value="' + esc(url) + '"><button class="cc-sh__copybtn" type="button" data-cc-copy>複製</button></div>' +
      '<div class="cc-sh__targets">' +
        '<a class="cc-sh__target" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + enc + '">Facebook</a>' +
        '<a class="cc-sh__target" target="_blank" rel="noopener" href="https://www.threads.net/intent/post?text=' + te + '">Threads</a>' +
        '<a class="cc-sh__target" target="_blank" rel="noopener" href="https://wa.me/?text=' + te + '">WhatsApp</a>' +
      '</div></div>');
  }
  function copyLink(btn) {
    var input = document.querySelector('.cc-sh__url');
    var url = input ? input.value : location.href;
    function done() { if (btn) { btn.textContent = '已複製'; setTimeout(function () { btn.textContent = '複製'; }, 1600); } }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { if (input) { input.select(); try { document.execCommand('copy'); } catch (e) {} } done(); });
    } else if (input) { input.select(); try { document.execCommand('copy'); } catch (e) {} done(); }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.querySelector('[data-cc-overlay].is-open')) closeOverlay();
    /* auth Esc is handled by the global auth.js */
  });

  /* Resume the backing flow after the GLOBAL auth.js signs the user in. */
  document.addEventListener('auth:login', function () {
    if (pendingBacking) { var pb = pendingBacking; pendingBacking = null; openBacking(pb.selectedId, pb.mode); }
  });

  /* ── 提醒我 (upcoming): confirm overlay + turn the button into a countdown ── */
  function remindHtml(p) {
    return '<div class="cc-sh">' +
      '<h2 class="cc-pv__title">已為你設定提醒</h2>' +
      '<p class="cc-pv__info">開放投票當天，我們會以站內信、電子郵件或短信通知你，讓你第一時間參與《' + esc(p ? p.title : '') + '》的共創。</p>' +
      '<div class="cc-stepview__foot"><button class="btn btn--primary btn--md" type="button" data-cc-overlay-close>好的</button></div>' +
    '</div>';
  }
  function startRemindCountdown(btn, days) {
    if (btn.__counting) return;
    btn.__counting = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.classList.add('cc-fund__cta--counting');
    var end = Date.now() + (days || 7) * 86400000;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    (function tick() {
      var ms = end - Date.now();
      if (ms <= 0) { btn.textContent = '開放共創'; btn.removeAttribute('aria-disabled'); return; }
      var d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
      btn.textContent = '距開放 ' + d + ' 天 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
      setTimeout(tick, 1000);
    })();
  }

  /* lazily build the drawer shell once; DS.scan attaches the primitive sync. */
  function drawer() {
    var d = document.querySelector('[data-ds-drawer="backing"]');
    if (d) return d;
    d = document.createElement('div');
    d.className = 'ds-drawer ds-drawer--backing';
    d.setAttribute('data-ds-drawer', 'backing');
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML =
      '<div class="ds-drawer__scrim" data-ds-drawer-close></div>' +
      '<aside class="ds-drawer__panel" role="dialog" aria-modal="true" aria-label="支持共創計畫">' +
        '<header class="ds-drawer__head">' +
          '<ol class="cc-step" data-cc-progress></ol>' +
          '<button class="ds-drawer__close" type="button" aria-label="關閉" data-ds-drawer-close>&times;</button>' +
        '</header>' +
        '<div class="ds-drawer__body" data-cc-body></div>' +
      '</aside>';
    document.body.appendChild(d);
    if (window.DS && DS.scan) DS.scan(d);     // force-init the primitive synchronously
    return d;
  }

  var STEPS = ['選擇方案', '付款'];   /* login is a gate, not a step (pops up only if needed) */
  function renderProgress(d, active) {
    var ol = d.querySelector('[data-cc-progress]');
    if (!ol) return;
    ol.innerHTML = STEPS.map(function (label, i) {
      var state = i < active ? ' cc-step__item--done' : (i === active ? ' cc-step__item--active' : '');
      return '<li class="cc-step__item' + state + '"><span class="cc-step__dot">' + (i + 1) + '</span>' +
        '<span class="cc-step__label">' + esc(label) + '</span></li>';
    }).join('');
  }

  /* Is this tier selectable in the given mode?  back → in-stock tiers · waitlist →
     sold-out tiers (you join the waitlist for a full tier). */
  function tierSelectable(pk, mode) {
    /* waitlist: ANY tier can be queued (the whole project is full / settling, so
       you pick the tier you want and join its waitlist). back: only in-stock tiers. */
    if (mode === 'waitlist') return true;
    return !(pk.slots && pk.slots.left <= 0);
  }

  /* Tier picker — selectable reward-tier CARDS. Sold-out tiers are SHOWN (disabled),
     not hidden. Nothing is pre-selected unless a selectable selectedId is passed. */
  function tierPicker(p, selectedId, mode) {
    return '<fieldset class="cc-pick"><legend class="cc-pick__legend">' +
      (mode === 'waitlist' ? '選擇要候補的方案' : '選擇回饋方案') + '</legend>' +
      (p.packages || []).map(function (pk) {
        var full = !!(pk.slots && pk.slots.left <= 0);
        var disabled = !tierSelectable(pk, mode);
        var checked = (pk.id === selectedId && !disabled) ? ' checked' : '';
        var slots = pk.slots
          ? (full
              ? '<span class="cc-pick__slots cc-pick__slots--full">名額已滿</span>'
              : '<span class="cc-pick__slots">尚餘 ' + fmt(pk.slots.left) + ' / ' + fmt(pk.slots.total) + ' 個名額</span>')
          : '';
        return '<label class="cc-pick__opt' + (disabled ? ' cc-pick__opt--disabled' : '') + '">' +
          '<input class="cc-pick__radio" type="radio" name="cc-tier" value="' + esc(pk.id) + '"' + checked + (disabled ? ' disabled' : '') + '>' +
          '<span class="cc-pick__row"><span class="cc-pick__name">' + esc(pk.name) + '</span>' +
          '<span class="cc-pick__price">' + esc(p.currency) + ' ' + fmt(pk.price) + '</span></span>' +
          /* each perk is its OWN node so i18n translates it (a joined string would
             never match a dict key); the ' · ' separator is added in CSS. */
          '<span class="cc-pick__perks">' + (pk.perks || []).map(function (perk) { return '<span class="cc-pick__perk">' + esc(perk) + '</span>'; }).join('') + '</span>' +
          (slots ? '<span class="cc-pick__meta">' + slots + '</span>' : '') +
        '</label>';
      }).join('') + '</fieldset>';
  }

  function pickSkeleton() {
    return '<div class="cc-stepview">' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--title"></div>' +
      '<div class="ds-skeleton ds-skeleton--line ds-skeleton--full"></div>' +
      '<div class="ds-skeleton ds-skeleton--media"></div>' +
      '<div class="ds-skeleton ds-skeleton--media"></div>' +
    '</div>';
  }

  /* The SELECT-PACKAGE step. Loading skeleton → picker. Nothing pre-selected
     unless selectedId is selectable; 下一步 stays disabled until a tier is chosen.
     No selectable tiers → an explicit empty/error state (never a dead-end). */
  function pickStep(d, p, selectedId, mode) {
    var body = d.querySelector('[data-cc-body]');
    renderProgress(d, 0);
    body.innerHTML = pickSkeleton();           // loading state
    body.__mode = mode;
    requestAnimationFrame(function () {
      if (!d.isConnected) return;
      var waitMode = mode === 'waitlist';
      var anySelectable = (p.packages || []).some(function (pk) { return tierSelectable(pk, mode); });
      if (!p.packages || !p.packages.length || !anySelectable) {     // empty / error state
        body.innerHTML =
          '<div class="cc-stepview">' +
            '<h2 class="cc-stepview__title">暫無可選方案</h2>' +
            '<p class="cc-stepview__lead">' + (waitMode ? '目前沒有可候補的方案，請稍後再試。' : '此計畫目前沒有可參與的回饋方案，請稍後再試。') + '</p>' +
            '<div class="cc-stepview__foot"><button class="btn btn--ghost btn--lg" type="button" data-ds-drawer-close>關閉</button></div>' +
          '</div>';
        body.__sel = null;
        return;
      }
      var valid = !!selectedId && (p.packages || []).some(function (pk) { return pk.id === selectedId && tierSelectable(pk, mode); });
      var title = waitMode ? '加入候補' : '選擇你的共創回饋';
      var lead = waitMode
        ? '這些方案的名額已滿。選擇你想候補的方案，若有支持者未完成付款而釋出名額，我們會依序邀請你補位（限時 48 小時）。'
        : '每個方案都是共創身分與紀念品：觀影權、周邊、鳴謝與出品人署名。';
      var callout = waitMode
        ? '加入候補需先驗證卡片，補位成功才會扣款；候補期間不收任何費用。'
        : '下一步<strong>只會驗證卡片、不會扣款</strong>。計畫達標後才收款，未達標全額不扣。';
      body.innerHTML =
        '<div class="cc-stepview">' +
          '<h2 class="cc-stepview__title">' + title + '</h2>' +
          '<p class="cc-stepview__lead">' + lead + '</p>' +
          tierPicker(p, valid ? selectedId : null, mode) +
          '<div class="cc-callout"><span class="cc-callout__icon" aria-hidden="true"></span>' + callout + '</div>' +
          '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="button" data-cc-next' + (valid ? '' : ' disabled') + '>下一步</button></div>' +
        '</div>';
      body.__sel = valid ? selectedId : null;
    });
  }

  function step1(d, p, selectedId, mode) {
    /* Per-package waitlist (data-waitlist-package) carries a chosen tier → keep its
       existing single-tier confirm UNCHANGED. Every other entry → the select step. */
    if (mode === 'waitlist' && selectedId && pkgById(p, selectedId)) {
      var body = d.querySelector('[data-cc-body]');
      var pk = pkgById(p, selectedId);
      renderProgress(d, 0);
      body.innerHTML =
        '<div class="cc-stepview">' +
          '<h2 class="cc-stepview__title">加入候補</h2>' +
          '<p class="cc-stepview__lead">「' + esc(pk.name) + '」名額已滿。加入候補後，若有支持者未完成付款而釋出名額，系統會依序邀請你補位（限時 48 小時）。</p>' +
          '<div class="cc-callout"><span class="cc-callout__icon" aria-hidden="true"></span>' +
            '加入候補需先驗證卡片，補位成功才會扣款；候補期間不收任何費用。</div>' +
          '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="button" data-cc-next>下一步</button></div>' +
        '</div>';
      body.__mode = 'waitlist'; body.__sel = selectedId;
      return;
    }
    pickStep(d, p, selectedId, mode);
  }

  /* login GATE — pops up only when an unauthenticated user proceeds to pay.
     Not a numbered step; after sign-in we drop straight into 付款. */
  var ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>';
  var ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></svg>';
  var ICON_APPLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 1.6c.1 1-.3 2-1 2.8-.7.8-1.7 1.4-2.6 1.3-.2-1 .3-2 1-2.7.6-.8 1.7-1.4 2.6-1.4zM19 17.4c-.5 1.2-.8 1.6-1.5 2.6-1 1.4-2.3 3-4 3-1.5 0-1.9-1-3.9-1s-2.5 1-3.9 1c-1.7 0-3-1.5-4-2.9C-.2 16.8-.6 11.2 1.9 8.5 3 7.2 4.6 6.3 6.3 6.3c1.7 0 2.8 1 4.2 1 1.3 0 2.1-1 4.1-1 1.5 0 3.1.8 4.2 2.2-3.6 2-3 7.2.2 8.6z"/></svg>';

  /* Unified auth (identifier-first / "Continue with…"). One screen, no forced
     login-vs-signup; method routes new + returning. Interim copy — Ogilvy's
     final lines pending (his spawn hit a 529). */
  var pendingBacking = null;
  function authBodyHtml() {
    return '<div class="cc-login2">' +
      '<h2 class="cc-login2__title">登入或註冊</h2>' +
      '<form class="cc-login2__form" data-cc-login-form novalidate>' +
        '<label class="cc-field"><span class="cc-field__label">電子郵件或手機號碼</span>' +
          '<input class="cc-field__input" type="text" name="identifier" placeholder="you@example.com 或 0912 345 678" autocomplete="username"></label>' +
        '<button class="btn btn--primary btn--lg cc-login2__continue" type="submit" data-cc-continue>繼續</button>' +
      '</form>' +
      '<div class="cc-pay__or"><span>或</span></div>' +
      '<button class="cc-login2__sso" type="button" data-cc-login>' + ICON_APPLE + '<span>用 Apple 繼續</span></button>' +
      '<button class="cc-login2__sso" type="button" data-cc-login><span class="cc-login2__glyph">G</span><span>用 Google 繼續</span></button>' +
      '<button class="cc-login2__sso" type="button" data-cc-login><span class="cc-login2__glyph cc-login2__glyph--line">LINE</span><span>用 LINE 繼續</span></button>' +
      '<button class="cc-login2__sso" type="button" data-cc-login><span class="cc-login2__glyph">f</span><span>用 Facebook 繼續</span></button>' +
      '<p class="cc-login2__legal">繼續即表示你同意我們的〈服務條款〉與〈隱私政策〉。</p>' +
    '</div>';
  }
  function ccAuth() {
    var a = document.querySelector('[data-cc-auth]');
    if (a) return a;
    a = document.createElement('div');
    a.className = 'cc-auth';
    a.setAttribute('data-cc-auth', '');
    a.setAttribute('aria-hidden', 'true');
    a.innerHTML =
      '<div class="cc-auth__scrim" data-cc-auth-close></div>' +
      '<aside class="cc-auth__panel" role="dialog" aria-modal="true" aria-label="登入或註冊">' +
        '<button class="cc-auth__close" type="button" aria-label="關閉" data-cc-auth-close>&times;</button>' +
        '<div class="cc-auth__body"></div>' +
      '</aside>';
    document.body.appendChild(a);
    return a;
  }
  function openAuth() {
    var a = ccAuth();
    a.querySelector('.cc-auth__body').innerHTML = authBodyHtml();
    a.classList.add('is-open');
    a.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ds-drawer-open');
    var c = a.querySelector('.cc-auth__close'); if (c) c.focus();
  }
  function closeAuth() {
    var a = document.querySelector('[data-cc-auth]'); if (!a) return;
    a.classList.remove('is-open');
    a.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('[data-ds-drawer="backing"].is-open')) document.body.classList.remove('ds-drawer-open');
  }

  /* MOCK "already in our database" — real backend looks the identifier up. */
  var KNOWN_ACCOUNTS = ['demo@ztor.com', 'fan@ztor.com', '0912345678'];

  function doLogin() {                       // final sign-in (SSO / password / register)
    document.body.setAttribute('data-auth', 'logged-in');
    try { localStorage.setItem('ztor-dev-auth', 'logged-in'); } catch (e) {}
    closeAuth();
    if (pendingBacking) { var pb = pendingBacking; pendingBacking = null; openBacking(pb.selectedId, pb.mode); }
  }

  function authSetBody(html) { var a = document.querySelector('[data-cc-auth] .cc-auth__body'); if (a) { a.innerHTML = html; var f = a.querySelector('input'); if (f) f.focus(); } }

  /* 繼續 → look up the identifier; returning → password, new → register */
  function routeIdentifier() {
    var input = document.querySelector('[data-cc-auth] input[name="identifier"]');
    var id = (input ? input.value : '').trim();
    if (!id) { if (input) input.focus(); return; }
    var known = KNOWN_ACCOUNTS.indexOf(id.toLowerCase()) >= 0;
    authSetBody(known ? authPasswordHtml(id) : authRegisterHtml(id));
  }

  function authPasswordHtml(id) {
    return '<div class="cc-login2">' +
      '<button class="cc-login2__back" type="button" data-cc-auth-back>返回</button>' +
      '<h2 class="cc-login2__title">歡迎回來</h2>' +
      '<p class="cc-login2__ident">' + esc(id) + '</p>' +
      '<form class="cc-login2__form" data-cc-pwd-form novalidate>' +
        '<label class="cc-field"><span class="cc-field__label">密碼</span><input class="cc-field__input" type="password" name="pw" data-req autocomplete="current-password"></label>' +
        '<p class="cc-pay__err" data-cc-auth-err hidden></p>' +
        '<button class="btn btn--primary btn--lg" type="submit" data-cc-login>登入</button>' +
      '</form>' +
      '<button class="cc-login2__link" type="button" data-cc-forgot>忘記密碼？</button>' +
    '</div>';
  }

  function authRegisterHtml(id) {
    return '<div class="cc-login2">' +
      '<button class="cc-login2__back" type="button" data-cc-auth-back>返回</button>' +
      '<h2 class="cc-login2__title">建立帳號</h2>' +
      '<p class="cc-login2__ident">' + esc(id) + '</p>' +
      '<form class="cc-login2__form" data-cc-reg-form novalidate>' +
        payField('nick', '暱稱', 'text', '你的暱稱') +
        payField('pw', '密碼', 'password', '至少 6 碼') +
        payField('pw2', '確認密碼', 'password', '再次輸入密碼') +
        '<label class="cc-field"><span class="cc-field__label">推薦碼或兌換碼（選填）</span><input class="cc-field__input" type="text" name="code" placeholder="選填"></label>' +
        '<label class="cc-check"><input type="checkbox" name="agree"><span>我已閱讀並同意 Ztor〈服務條款〉、〈隱私政策〉與〈Tastemaker 條款〉</span></label>' +
        '<p class="cc-pay__err" data-cc-auth-err hidden></p>' +
        '<button class="btn btn--primary btn--lg" type="submit" data-cc-register>建立帳號</button>' +
      '</form>' +
    '</div>';
  }

  function validateRegister(form) {
    if (!form) return '發生錯誤，請重試。';
    var nick = (form.querySelector('[name="nick"]') || {}).value || '';
    var pw = (form.querySelector('[name="pw"]') || {}).value || '';
    var pw2 = (form.querySelector('[name="pw2"]') || {}).value || '';
    var agree = form.querySelector('[name="agree"]');
    if (!nick.trim()) return '請輸入暱稱。';
    if (pw.length < 6) return '密碼至少 6 碼。';
    if (pw !== pw2) return '兩次輸入的密碼不一致。';
    if (agree && !agree.checked) return '請先勾選同意條款與隱私政策。';
    return null;
  }

  function payField(name, label, type, ph) {
    return '<label class="cc-field"><span class="cc-field__label">' + esc(label) + '</span>' +
      '<input class="cc-field__input" type="' + type + '" name="' + name + '" placeholder="' + esc(ph) + '" data-req autocomplete="off"></label>';
  }

  /* 付款 — GoFundMe-style card form (mock; reward-only). For a FUNDING project
     the card is verified only (達標才扣款); for charging it's a real capture. */
  function stepPay(d) {
    var body = d.querySelector('[data-cc-body]');
    var p = project();
    var pkg = pkgById(p, body.__sel) || (p.packages && p.packages[0]);
    var mode = body.__mode || 'back';
    renderProgress(d, 1);
    var amount = pkg ? (esc(p.currency) + ' ' + fmt(pkg.price)) : '';
    var verifyOnly = (p.status === 'funding' || p.status === 'full' || mode === 'waitlist');
    var confirmLabel = mode === 'waitlist' ? '確認候補登記' : (verifyOnly ? '確認支持（達標才扣款）' : '確認付款');
    var cure = !!(window.ZTOR_COCREATE && ZTOR_COCREATE.userActions && ZTOR_COCREATE.userActions[p.id] === 'cure-failed');
    var cureBanner = cure ? '<div class="cc-callout cc-callout--err"><span class="cc-callout__icon" aria-hidden="true"></span>上次付款失敗，請更新付款方式後重試；逾時名額將釋出給候補。</div>' : '';
    body.innerHTML =
      '<div class="cc-pay">' +
        '<h2 class="cc-stepview__title">付款資料</h2>' + cureBanner +
        '<div class="cc-pay__summary">' +
          '<div class="cc-pay__sumrow"><span>方案</span><span>' + esc(pkg ? pkg.name : '') + '</span></div>' +
          '<div class="cc-pay__sumrow cc-pay__sumrow--total"><span>' + (verifyOnly ? '達標後收取' : '應付金額') + '</span><span>' + amount + '</span></div>' +
        '</div>' +
        '<div class="cc-pay__express"><button type="button" class="cc-pay__express-btn" data-cc-express> Pay</button>' +
          '<button type="button" class="cc-pay__express-btn" data-cc-express>G Pay</button></div>' +
        '<div class="cc-pay__or"><span>或使用信用卡 / 扣帳卡</span></div>' +
        '<form class="cc-pay__form" data-cc-pay-form novalidate>' +
          payField('email', '電子郵件', 'email', 'you@example.com') +
          payField('name', '持卡人姓名', 'text', '王小明') +
          payField('card', '卡號', 'text', '1234 1234 1234 1234') +
          '<div class="cc-pay__grid2">' + payField('exp', '有效期限 (MM/YY)', 'text', '01/30') + payField('cvc', '安全碼', 'text', 'CVC') + '</div>' +
          '<div class="cc-pay__grid2">' +
            '<label class="cc-field"><span class="cc-field__label">國家/地區</span><select class="cc-field__input" name="country"><option>台灣</option><option>香港</option><option>新加坡</option><option>美國</option></select></label>' +
            payField('zip', '郵遞區號', 'text', '100') +
          '</div>' +
          '<label class="cc-pay__save"><input type="checkbox" checked> 儲存卡片以便日後使用</label>' +
          '<p class="cc-pay__err" data-cc-pay-err hidden></p>' +
          '<div class="cc-pay__secure"><span class="cc-pay__lock" aria-hidden="true"></span>SSL 安全付款 · 卡片由 Stripe 加密處理（示範）' + (verifyOnly ? '；現在僅驗證卡片，達標才扣款。' : '') + '</div>' +
          '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="submit" data-cc-pay>' + esc(confirmLabel) + '</button>' +
            '<button class="btn btn--ghost btn--md" type="button" data-cc-back>返回</button></div>' +
        '</form>' +
      '</div>';
  }

  function validatePay(form) {
    var reqs = form.querySelectorAll('[data-req]');
    for (var i = 0; i < reqs.length; i++) { if (!reqs[i].value.trim()) return '請填寫所有欄位。'; }
    var card = (form.querySelector('[name="card"]') || {}).value || '';
    if (card.replace(/\D/g, '').length < 12) return '請輸入有效的卡號。';
    var exp = (form.querySelector('[name="exp"]') || {}).value || '';
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(exp.trim())) return '有效期限格式為 MM/YY。';
    var cvc = (form.querySelector('[name="cvc"]') || {}).value || '';
    if (cvc.replace(/\D/g, '').length < 3) return '安全碼不正確。';
    return null;
  }

  function paySuccess(d) {
    var body = d.querySelector('[data-cc-body]');
    var p = project();
    var pkg = pkgById(p, body.__sel) || (p.packages && p.packages[0]);
    var mode = body.__mode || 'back';
    var verifyOnly = (p.status === 'funding' || p.status === 'full' || mode === 'waitlist');
    var title = mode === 'waitlist' ? '已加入候補' : '承諾成功';
    var msg = mode === 'waitlist'
      ? '你已加入「' + esc(pkg ? pkg.name : '') + '」候補名單。一旦有名額釋出，我們會以限時 48 小時的補位邀請通知你。'
      : (verifyOnly
          ? '感謝你支持《' + esc(p.title) + '》！你的卡片已驗證，計畫達標後才會收取 ' + esc(p.currency) + ' ' + fmt(pkg ? pkg.price : 0) + '；未達標不收費。'
          : '付款完成，感謝你支持《' + esc(p.title) + '》！回饋將於上線後依方案發送。');
    renderProgress(d, 2);
    body.innerHTML =
      '<div class="cc-success">' +
        '<span class="cc-success__check ds-success-tick" aria-hidden="true"><svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg></span>' +
        '<h2 class="cc-success__title">' + title + '</h2>' +
        '<p class="cc-success__msg">' + msg + '</p>' +
        '<div class="cc-stepview__foot">' +
          '<button class="btn btn--primary btn--lg" type="button" data-cc-share>分享給朋友</button>' +
          '<a class="btn btn--ghost btn--md" href="my-library.html">查看我的共創</a>' +
        '</div>' +
      '</div>';
  }

  /* payment outcome by (Stripe-style) test card: …0002 declined · …3220/3155 SCA */
  function payOutcome(card) {
    var d = (card || '').replace(/\D/g, '');
    if (/0002$/.test(d)) return 'declined';
    if (/3220$/.test(d) || /3155$/.test(d)) return 'sca';
    return 'ok';
  }
  function scaConfirm(d) {
    var body = d.querySelector('[data-cc-body]');
    renderProgress(d, 1);
    body.innerHTML =
      '<div class="cc-stepview">' +
        '<h2 class="cc-stepview__title">銀行驗證（3D Secure）</h2>' +
        '<div class="cc-callout cc-callout--info"><span class="cc-callout__icon" aria-hidden="true"></span>你的發卡銀行要求額外驗證，請完成驗證以確認支持（示範）。</div>' +
        '<div class="cc-sca"><div class="cc-sca__bank">Ztor Bank · 3D Secure</div><div class="cc-sca__row">一次性驗證碼已發送至 •••• 8888</div></div>' +
        '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="button" data-cc-sca-ok>完成驗證</button>' +
          '<button class="btn btn--ghost btn--md" type="button" data-cc-back>取消</button></div>' +
      '</div>';
  }
  function startHoursCountdown(el, hours) {
    if (!el) return;
    var end = Date.now() + (hours || 48) * 3600000;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    (function t() {
      var ms = end - Date.now();
      if (ms <= 0) { el.textContent = '已逾時'; return; }
      el.textContent = pad(Math.floor(ms / 3600000)) + ':' + pad(Math.floor((ms % 3600000) / 60000)) + ':' + pad(Math.floor((ms % 60000) / 1000));
      setTimeout(t, 1000);
    })();
  }
  function waitlistInvite(d, p) {
    var body = d.querySelector('[data-cc-body]');
    renderProgress(d, 0);
    body.innerHTML =
      '<div class="cc-stepview">' +
        '<h2 class="cc-stepview__title">補位邀請</h2>' +
        '<p class="cc-stepview__lead">有名額釋出！你在《' + esc(p.title) + '》的候補名單中獲得補位資格。請在時限內完成支持，逾時將釋出給下一位。</p>' +
        '<div class="cc-callout cc-callout--err"><span class="cc-callout__icon" aria-hidden="true"></span>補位倒數 <strong data-cc-invite-count>48:00:00</strong></div>' +
        '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="button" data-cc-invite>立即補位</button>' +
          '<button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>放棄名額</button></div>' +
      '</div>';
    startHoursCountdown(body.querySelector('[data-cc-invite-count]'), 48);
  }

  /* what the backing flow shows once the user IS signed in (resume target) */
  function proceedBacking(d) {
    var p = project();
    var body = d.querySelector('[data-cc-body]');
    var mode = body.__mode || 'back';
    var ua = window.ZTOR_COCREATE && ZTOR_COCREATE.userActions && ZTOR_COCREATE.userActions[p.id];
    if (ua === 'waitlist-invited' && mode === 'back') waitlistInvite(d, p);          // timed 補位邀請
    else if (p.status === 'charging' && mode === 'back') stepPay(d);                  // completing a pledge — no re-pick
    else step1(d, p, body.__sel, mode);                                              // tier picker
  }

  function openBacking(selectedId, mode) {
    var p = project();
    if (!p) return;
    /* GATE AT ENTRY: logged out → top-anchored login overlay first; remember
       intent and resume the backing flow after sign-in. */
    if (!isLoggedIn()) { pendingBacking = { selectedId: selectedId, mode: mode }; if (window.ZtorAuth) window.ZtorAuth.open(); else openAuth(); return; }
    var d = drawer();
    var body = d.querySelector('[data-cc-body]');
    /* Do NOT default to the first package: the main CTA (selectedId == null) must
       open the select-package step with nothing chosen. Per-package entries pass
       their own id and stay pre-selected. */
    body.__mode = mode; body.__sel = selectedId || null;
    proceedBacking(d);
    if (d.dsDrawer) d.dsDrawer.open();
    else if (window.DSDrawer) DSDrawer.open('backing');
  }

  /* delegated triggers (work on JS-rendered cards) */
  document.addEventListener('click', function (e) {
    var t = e.target;

    /* follow / remind toggle (producing / soon stages) — pure client mock */
    var toggle = t.closest && t.closest('[data-cc-toggle]');
    if (toggle) {
      e.preventDefault();
      var on = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', on ? 'false' : 'true');
      toggle.textContent = on ? toggle.getAttribute('data-cc-off') : toggle.getAttribute('data-cc-on');
      return;
    }

    /* preview / share / overlay */
    if (t.closest && t.closest('[data-cc-overlay-close]')) { closeOverlay(); return; }
    if (t.closest && t.closest('[data-cc-copy]')) { copyLink(t.closest('[data-cc-copy]')); return; }
    if (t.closest && t.closest('[data-cc-preview]')) { e.preventDefault(); openOverlay(previewHtml(project())); return; }
    if (t.closest && t.closest('[data-cc-updates]')) { e.preventDefault(); openOverlay(updatesHtml(project())); return; }
    if (t.closest && t.closest('[data-cc-share]')) { e.preventDefault(); openShare(project()); return; }
    var remindBtn = t.closest && t.closest('[data-cc-remind]');
    if (remindBtn) {
      e.preventDefault();
      openOverlay(remindHtml(project()));
      startRemindCountdown(remindBtn, parseInt(remindBtn.getAttribute('data-cc-opens'), 10) || 7);
      return;
    }

    /* auth overlay (login-btn / SSO / identifier / register) → global auth.js */

    var backProj = t.closest && t.closest('[data-back-project]');
    var waitProj = t.closest && t.closest('[data-waitlist-project]');
    var backPkg = t.closest && t.closest('[data-back-package]');
    var waitPkg = t.closest && t.closest('[data-waitlist-package]');
    if (backProj) { e.preventDefault(); openBacking(null, 'back'); return; }
    if (waitProj) { e.preventDefault(); openBacking(null, 'waitlist'); return; }   // main CTA, all tiers full
    if (backPkg) { e.preventDefault(); openBacking(backPkg.getAttribute('data-back-package'), 'back'); return; }
    if (waitPkg) { e.preventDefault(); openBacking(waitPkg.getAttribute('data-waitlist-package'), 'waitlist'); return; }

    var d = document.querySelector('[data-ds-drawer="backing"]');
    if (!d) return;
    if (t.closest('[data-cc-next]')) {
      e.preventDefault();
      var body = d.querySelector('[data-cc-body]');
      var radio = d.querySelector('input[name="cc-tier"]:checked');
      if (radio && body) body.__sel = radio.value;
      stepPay(d);                        // entry-gated → user is signed in here
    } else if (t.closest('[data-cc-express]')) {
      e.preventDefault();
      paySuccess(d);
    } else if (t.closest('[data-cc-invite]')) {
      e.preventDefault();
      /* claiming a released waitlist spot → pick a tier first (don't jump to pay) */
      var ip = project();
      var ib = d.querySelector('[data-cc-body]');
      step1(d, ip, ib && ib.__sel, (ib && ib.__mode) || 'back');
    } else if (t.closest('[data-cc-sca-ok]')) {
      e.preventDefault();
      paySuccess(d);
    } else if (t.closest('[data-cc-pay]')) {
      e.preventDefault();
      var form = d.querySelector('[data-cc-pay-form]');
      var box = d.querySelector('[data-cc-pay-err]');
      var err = validatePay(form);
      if (err) { if (box) { box.textContent = err; box.hidden = false; } return; }
      var oc = payOutcome((form.querySelector('[name="card"]') || {}).value);
      if (oc === 'declined') { if (box) { box.textContent = '卡片遭拒，請改用其他卡片（測試：卡號尾數 0002）。'; box.hidden = false; } return; }
      if (oc === 'sca') { scaConfirm(d); return; }
      paySuccess(d);
    } else if (t.closest('[data-cc-back]')) {
      var p = project();
      var body2 = d.querySelector('[data-cc-body]');
      step1(d, p, body2 && body2.__sel, (body2 && body2.__mode) || 'back');
    }
  });

  /* form submits (Enter): route the identifier, or sign in from password/register */
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f.closest) return;
    if (f.closest('[data-cc-pay-form]')) { e.preventDefault(); return; }
    /* auth forms (identifier / password / register) → global auth.js */
  });

  /* Select-package step: choosing a tier records the pick and enables 下一步. */
  document.addEventListener('change', function (e) {
    var radio = e.target;
    if (!radio || radio.name !== 'cc-tier' || radio.disabled) return;
    var d = document.querySelector('[data-ds-drawer="backing"]');
    if (!d) return;
    var body = d.querySelector('[data-cc-body]');
    if (body) body.__sel = radio.value;
    var next = d.querySelector('[data-cc-next]');
    if (next) next.disabled = false;
  });

  /* Keyboard: the reward cards are role=button tabindex=0 — Enter/Space activate. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var card = e.target.closest && e.target.closest('[data-back-package], [data-waitlist-package]');
    if (!card) return;
    e.preventDefault();
    card.click();
  });
})();
