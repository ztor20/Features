/* ============================================================
   auth.js — Ztor 2.0 global auth modal + auth-gate (mock)
   ------------------------------------------------------------
   ONE owner for login, sign-up, and gated actions on EVERY page.

   WHY THIS EXISTS
   The identifier-first auth overlay used to live only inside
   cocreate.js (loaded on a single page), so the 登入 button and
   every follow / save / like did nothing on the other 69 pages.
   The overlay design is REUSED verbatim (.cc-auth / .cc-login2,
   styled in cocreate-detail.css — already bundled site-wide); this
   module just makes it global and wires the gate.

   AUTH IS MOCK. "Login" flips body[data-auth]='logged-in' +
   localStorage 'ztor-dev-auth', fires a global 'auth:login' event,
   and resumes whatever the user was doing. No real identity/SSO.

   ARCHITECTURE (per the Carmack review)
   - ONE document-level CAPTURE delegate gates every [data-auth-action]
     / [data-follow] / [data-save] and opens the modal from any login
     trigger. Capture + stopImmediatePropagation guarantees a logged-out
     click is intercepted before the control's own handler.
   - ZtorState is an async adapter (Promises today over localStorage,
     a fetch() backend tomorrow) — call-sites never change. Key shape:
     ztor:state:<kind>:<id> -> { on, ts }.
   - Optimistic UI + rollback on reject (the mock never rejects; a real
     backend will — the path exists).

   LOADS: after ds.js (uses DS.register for state hydration of injected
   controls). Plain <script src="assets/auth.js"> near </body>.
   ============================================================ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isLoggedIn() { return document.body.getAttribute('data-auth') === 'logged-in'; }

  /* ── mock persistence adapter ───────────────────────────────────────────
     BACKEND STUB: replace the localStorage bodies with fetch() calls; the
     async signature is already in place so no call-site changes. */
  var ZtorState = (function () {
    var PREFIX = 'ztor:state:';
    function key(kind, id) { return PREFIX + kind + ':' + id; }
    return {
      get: function (kind, id) {
        return new Promise(function (resolve) {
          var v = null;
          try { v = JSON.parse(localStorage.getItem(key(kind, id)) || 'null'); } catch (e) {}
          resolve(!!(v && v.on));
        });
      },
      set: function (kind, id, on) {
        return new Promise(function (resolve) {
          try { localStorage.setItem(key(kind, id), JSON.stringify({ on: !!on, ts: Date.now() })); } catch (e) {}
          resolve(!!on);
        });
      }
    };
  })();

  /* ── auth overlay (generalized from cocreate.js — same markup/classes) ── */
  var ICON_APPLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 1.6c.1 1-.3 2-1 2.8-.7.8-1.7 1.4-2.6 1.3-.2-1 .3-2 1-2.7.6-.8 1.7-1.4 2.6-1.4zM19 17.4c-.5 1.2-.8 1.6-1.5 2.6-1 1.4-2.3 3-4 3-1.5 0-1.9-1-3.9-1s-2.5 1-3.9 1c-1.7 0-3-1.5-4-2.9C-.2 16.8-.6 11.2 1.9 8.5 3 7.2 4.6 6.3 6.3 6.3c1.7 0 2.8 1 4.2 1 1.3 0 2.1-1 4.1-1 1.5 0 3.1.8 4.2 2.2-3.6 2-3 7.2.2 8.6z"/></svg>';

  function authBodyHtml() {
    return '<div class="cc-login2">' +
      '<h2 class="cc-login2__title">登入或註冊</h2>' +
      '<p class="cc-login2__sub">追蹤你喜歡的創作者，收藏電影，支持你想看見的作品</p>' +
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
  function payField(name, label, type, ph) {
    return '<label class="cc-field"><span class="cc-field__label">' + esc(label) + '</span>' +
      '<input class="cc-field__input" type="' + type + '" name="' + name + '" placeholder="' + esc(ph) + '" data-req autocomplete="off"></label>';
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

  var KNOWN_ACCOUNTS = ['demo@ztor.com', 'fan@ztor.com', '0912345678'];

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
  var lastFocus = null;
  function openAuth() {
    var a = ccAuth();
    lastFocus = document.activeElement;
    a.querySelector('.cc-auth__body').innerHTML = authBodyHtml();
    a.classList.add('is-open');
    a.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ds-drawer-open');     // shared scroll-lock class
    var f = a.querySelector('input, button'); if (f) f.focus();
  }
  function closeAuth() {
    var a = document.querySelector('[data-cc-auth]'); if (!a) return;
    a.classList.remove('is-open');
    a.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('[data-ds-drawer].is-open, .cc-overlay.is-open')) {
      document.body.classList.remove('ds-drawer-open');
    }
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function authSetBody(html) {
    var b = document.querySelector('[data-cc-auth] .cc-auth__body');
    if (b) { b.innerHTML = html; var f = b.querySelector('input'); if (f) f.focus(); }
  }
  function routeIdentifier() {
    var input = document.querySelector('[data-cc-auth] input[name="identifier"]');
    var id = (input ? input.value : '').trim();
    if (!id) { if (input) input.focus(); return; }
    var known = KNOWN_ACCOUNTS.indexOf(id.toLowerCase()) >= 0;
    authSetBody(known ? authPasswordHtml(id) : authRegisterHtml(id));
  }
  function doLogin() {                                   // MOCK sign-in (SSO / password / register)
    document.body.setAttribute('data-auth', 'logged-in');
    try { localStorage.setItem('ztor-dev-auth', 'logged-in'); } catch (e) {}
    closeAuth();
    try { document.dispatchEvent(new CustomEvent('auth:login')); } catch (e) {}
    resumePending();
  }

  /* ── focus trap while the modal is open ── */
  document.addEventListener('keydown', function (e) {
    var a = document.querySelector('[data-cc-auth].is-open');
    if (!a) return;
    if (e.key === 'Escape') { e.preventDefault(); closeAuth(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.slice.call(a.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── auth overlay internals (bubble; elements live inside the modal) ── */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-cc-auth-close]')) { closeAuth(); return; }
    if (t.closest('[data-cc-auth-back]')) { e.preventDefault(); authSetBody(authBodyHtml()); return; }
    if (t.closest('[data-cc-continue]')) { e.preventDefault(); routeIdentifier(); return; }
    if (t.closest('[data-cc-forgot]')) {
      e.preventDefault();
      authSetBody('<div class="cc-login2"><button class="cc-login2__back" type="button" data-cc-auth-back>返回</button>' +
        '<h2 class="cc-login2__title">重設密碼</h2><p class="cc-login2__legal">若帳號存在，重設密碼的連結已寄出（示範）。</p></div>');
      return;
    }
    if (t.closest('[data-cc-register]')) {
      e.preventDefault();
      var rf = document.querySelector('[data-cc-reg-form]');
      var err = validateRegister(rf);
      var box = document.querySelector('[data-cc-auth-err]');
      if (err) { if (box) { box.textContent = err; box.hidden = false; } return; }
      doLogin();
      return;
    }
    if (t.closest('[data-cc-login]')) { e.preventDefault(); doLogin(); return; }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f.closest) return;
    if (f.closest('[data-cc-login-form]')) { e.preventDefault(); routeIdentifier(); return; }
    if (f.closest('[data-cc-pwd-form]')) { e.preventDefault(); doLogin(); return; }
    if (f.closest('[data-cc-reg-form]')) {
      e.preventDefault();
      var err = validateRegister(f);
      var box = document.querySelector('[data-cc-auth-err]');
      if (err) { if (box) { box.textContent = err; box.hidden = false; } return; }
      doLogin();
    }
  });

  /* ── the gate: ONE capture delegate for login triggers + gated actions ── */
  var pending = null;   // a gated control awaiting login

  function actionKind(el) {
    return el.getAttribute('data-auth-action')
      || (el.hasAttribute('data-save') ? 'save'
        : (el.hasAttribute('data-follow-toggle') || el.hasAttribute('data-cc-toggle')) ? 'follow'
        : 'follow');
  }
  function actionId(el) {
    var explicit = el.getAttribute('data-auth-id') || el.getAttribute('data-id')
      || (el.getAttribute('data-follow') || '').trim() || (el.getAttribute('data-save') || '').trim();
    if (explicit) return explicit;
    var c = el.closest('[data-creator],[data-project-id],[data-card-id],[data-id]');
    if (c) return c.getAttribute('data-creator') || c.getAttribute('data-project-id') || c.getAttribute('data-card-id') || c.getAttribute('data-id');
    var card = el.closest('article, li, [class*="card"]');
    var h = card && card.querySelector('h1,h2,h3,h4,[class*="title"],[class*="name"]');
    return ((h && h.textContent) || el.getAttribute('aria-label') || el.textContent || 'x').replace(/\s+/g, ' ').trim().slice(0, 48);
  }
  function reflect(el, on) {
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.classList.toggle('is-active', on);
    if (el.hasAttribute('data-following')) el.setAttribute('data-following', on ? 'true' : 'false');
    var onLbl = el.getAttribute('data-on'), offLbl = el.getAttribute('data-off');
    if (onLbl != null && offLbl != null) {
      var lbl = el.querySelector('[data-auth-label]') || el;
      lbl.textContent = on ? onLbl : offLbl;
    }
  }
  function performAction(el) {
    var kind = actionKind(el), id = actionId(el);
    var cur = el.getAttribute('aria-pressed') === 'true';
    var next = !cur;
    reflect(el, next);                                   // optimistic
    ZtorState.set(kind, id, next).catch(function () { reflect(el, cur); });   // rollback path (mock never rejects)
  }
  function resumePending() {
    if (!pending) return;
    var el = pending; pending = null;
    if (!isLoggedIn()) return;
    if (el.hasAttribute('data-auth-action')) performAction(el);   // gate-owned → toggle + persist + relabel
    else el.click();                                              // own-handler control → replay (now logged-in, gate passes through)
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    // login trigger — always opens the modal
    var trigger = e.target.closest('.header__login-btn, [data-auth-open]');
    if (trigger && !trigger.closest('[data-cc-auth]')) { e.preventDefault(); e.stopImmediatePropagation(); openAuth(); return; }
    // gated action (follow / save / like / playlist + existing follow toggles)
    var act = e.target.closest('[data-auth-action], [data-follow-toggle], [data-cc-toggle], [data-save]');
    if (!act) return;
    if (!isLoggedIn()) {                                  // GATE → modal, remember intent
      e.preventDefault(); e.stopImmediatePropagation();
      pending = act; openAuth(); return;
    }
    /* logged-in: controls WE own (data-auth-action) toggle + persist here, with
       stopImmediatePropagation so an old per-feature handler can't double-fire.
       Controls that keep their own handler (data-follow-toggle / data-cc-toggle
       when NOT tagged) are left to run untouched. */
    if (act.hasAttribute('data-auth-action')) {
      e.preventDefault(); e.stopImmediatePropagation();
      performAction(act);
    }
  }, true);   // CAPTURE: beat the control's own handler and i18n's capture listener

  /* ── hydrate saved state onto controls (incl. JS-injected, via DS) ── */
  function hydrate(el) {
    var kind = actionKind(el), id = actionId(el);
    ZtorState.get(kind, id).then(function (on) { if (on) reflect(el, true); });
  }
  if (window.DS && DS.register) {
    DS.register('auth-action', '[data-auth-action]', hydrate);   // only controls the gate persists
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('[data-auth-action]').forEach(hydrate);
    });
  }

  /* Login-gate wrapper (single owner). Resumes the pending action after the
     MOCK sign-in fires 'auth:login'. Used by checkout / bid / ticket / redeem. */
  function requireLogin(action, reason) {
    if (isLoggedIn()) { if (typeof action === 'function') action(); return; }
    var once = function () { document.removeEventListener('auth:login', once); if (typeof action === 'function') action(); };
    document.addEventListener('auth:login', once);
    try { window.__ztorAuthReason = reason || ''; } catch (e) {}
    openAuth();
  }
  window.ZtorAuth = { open: openAuth, close: closeAuth, isLoggedIn: isLoggedIn, requireLogin: requireLogin };
  window.ZtorState = ZtorState;
})();
