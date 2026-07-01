/* mobile-nav.js — behaviour for the floating pill bottom navigation.
   • Marks the active destination from the current path.
   • Community → Create contextual swap on the Community page.
   • Scroll-shrink: condense to icons on scroll-down, expand on scroll-up/top.
   Framework-free; pairs with css/components/43-bottom-nav.css. */
(function () {
  'use strict';

  /* Resilient thumbnails — avatars are now generated locally (see
     shop-render.js avatar()), but content thumbs/covers can still fall back to
     an external placeholder that may fail. When such an image errors, hide it
     so the element's own background shows instead of a broken-image icon + alt
     text. Capture phase: img 'error' doesn't bubble. */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG' && img.closest &&
        img.closest('.top-fan__avatar, .lb-row__avatar, .avatar, .profile-post__avatar, .notif-item__thumb, .watch-item__cover, .profile-hero__avatar')) {
      img.style.visibility = 'hidden';
    }
  }, true);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* (The bottom nav's liquid glass is now provided by the shared #liquid-glass
     system — assets/liquid-glass.js + css/components/52-liquid-glass-refraction.css.
     The previous per-element canvas displacement-map generator was removed: it
     re-ran a full canvas pixel loop + toDataURL on every resize tick during the
     condense animation, which made the shrink janky, and it fed a now-unreferenced
     #ztor-liquid-glass filter.) */

  ready(function () {
    var nav = document.querySelector('[data-botnav]');
    if (!nav) return;
    /* iOS Safari won't composite a STATIC backdrop-filter on a position:fixed
       element; applying it one frame AFTER first paint forces the composite (the
       sticky snap nav gets this for free via its scroll class-toggle). See the
       .botnav.lg-ready rule in 43-bottom-nav.css. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { nav.classList.add('lg-ready'); });
    });
    /* (Removed the old per-element canvas displacement-map glass: it regenerated a
       full canvas + toDataURL on every resize tick DURING the condense animation,
       which made the shrink janky, and it fed a #ztor-liquid-glass filter that is
       no longer referenced. The bottom nav's glass now comes from the shared
       #liquid-glass system: assets/liquid-glass.js + 52-liquid-glass-refraction.css.) */

    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '') path = 'index.html';

    var map = {
      spotlight: ['index.html', 'index-recolor.html'],
      cocreate:  ['cocreate.html', 'cocreate-project.html'],
      community: ['community.html'],
      contest:   ['zorigin.html'],
      shop:      ['shop.html', 'shop-auction.html', 'shop-creators.html', 'shop-events.html', 'shop-popcorn.html', 'leaderboard.html', 'events.html']
    };
    if (/^creator-/.test(path)) map.shop.push(path);   // creator stores live under Shop
    if (/^shop-/.test(path))    map.shop.push(path);   // every shop-* sub-page (PDP shop-item.html, auction, etc.) lives under Shop

    var activeKey = null;
    Object.keys(map).forEach(function (k) { if (map[k].indexOf(path) >= 0) activeKey = k; });

    var items = nav.querySelectorAll('.botnav__item');
    for (var i = 0; i < items.length; i++) {
      var a = items[i];
      if (a.getAttribute('data-nav') === activeKey) { a.setAttribute('aria-current', 'page'); a.classList.add('is-active'); }
      else a.removeAttribute('aria-current');
    }

    /* Community → Create when already on Community (dimensions unchanged) */
    var comm = nav.querySelector('[data-community]');
    if (comm && path === 'community.html') {
      var icon = comm.querySelector('.botnav__icon');
      var label = comm.querySelector('.botnav__label');
      comm.classList.add('botnav__item--create', 'is-active');
      comm.setAttribute('aria-current', 'page');       // still indicate we're inside Community
      if (icon) icon.style.setProperty('--i', "url('assets/icons/plus.svg')");
      function paintCreateLabel(ev) {
        // Read the lang from the i18n:applied event detail — it fires before
        // window.ztorI18n is assigned, which previously left the label as 發佈.
        var en = (ev && ev.detail && ev.detail.lang) ? (ev.detail.lang === 'en')
                 : (window.ztorI18n && window.ztorI18n.lang === 'en');
        if (label) label.textContent = en ? 'Create' : '發佈';
        comm.setAttribute('aria-label', en ? 'Create post' : '建立貼文');
      }
      paintCreateLabel();
      document.addEventListener('i18n:applied', paintCreateLabel);
      comm.setAttribute('href', '#');
      comm.addEventListener('click', function (e) {
        e.preventDefault();
        var trigger = document.querySelector('[data-new-post], [data-create-post], .side-rail__post');
        if (trigger && trigger !== comm) { trigger.click(); return; }
        var composer = document.querySelector('#composer, .composer, [data-composer], .post-composer');
        if (composer) composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    /* ── Hamburger drawer: open/close, focus trap, Esc, scrim, scroll-lock ── */
    var drawer = document.querySelector('[data-mdrawer]');
    /* Pages ship TWO headers (logged-out + logged-in); CSS shows one via
       body[data-auth]. Bind EVERY burger — otherwise, when the logged-in
       header is the visible one, its burger has no handler and nothing opens. */
    var burgers = document.querySelectorAll('.header__burger');
    if (drawer && burgers.length) {
      var panel = drawer.querySelector('.mdrawer__panel');
      var lastFocus = null;
      drawer.setAttribute('aria-hidden', 'true');    // closed at load — hide from AT
      function focusables() {
        return Array.prototype.slice.call(panel.querySelectorAll(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )).filter(function (el) { return el.offsetParent !== null; });
      }
      function setBurgerState(open) {
        burgers.forEach(function (b) {
          b.classList.toggle('is-open', open);         // morph burger ↔ X on all
          b.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }
      function openDrawer() {
        lastFocus = document.activeElement;
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mdrawer-open');
        setBurgerState(true);
        var f = focusables(); if (f.length) f[0].focus();
      }
      function closeDrawer() {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mdrawer-open');
        setBurgerState(false);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
      burgers.forEach(function (b) {
        b.addEventListener('click', function () {
          drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
        });
      });
      drawer.querySelectorAll('[data-mdrawer-close]').forEach(function (el) {
        el.addEventListener('click', closeDrawer);
      });
      // close after navigating via a link
      drawer.querySelectorAll('.mdrawer__link[href]').forEach(function (a) {
        a.addEventListener('click', function () { setTimeout(closeDrawer, 0); });
      });
      document.addEventListener('keydown', function (e) {
        if (!drawer.classList.contains('is-open')) return;
        if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
        if (e.key === 'Tab') {
          var f = focusables(); if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    /* ── Mobile header right cluster: CART + PROFILE, side by side in the
       header's right cell. Injected into every header (one shows per auth
       state); CSS reveals the cluster on phones only. The cart opens the SAME
       drawer as the desktop .header__cart (one store, one drawer) and carries a
       live count badge; it only appears where the cart bundle is loaded, so it
       is never a dead control. ── */
    document.querySelectorAll('.header .header__inner').forEach(function (inner) {
      if (inner.querySelector('.header__m-cluster')) return;
      var cluster = document.createElement('div');
      cluster.className = 'header__m-cluster';

      /* Cart — sits LEFT of the profile icon. Only where cart.js is loaded. */
      if (document.querySelector('script[src*="cart.js"]')) {
        var CART_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>';
        var cartBtn = document.createElement('button');
        cartBtn.type = 'button';
        cartBtn.className = 'header__cart-m';
        cartBtn.setAttribute('aria-label', '購物車');
        cartBtn.innerHTML = '<span class="header__cart-m-glyph" aria-hidden="true">' + CART_SVG +
          '<span class="header__cart-m-badge"></span></span>';
        cluster.appendChild(cartBtn);

        var mBadge = cartBtn.querySelector('.header__cart-m-badge');
        cartBtn.addEventListener('click', function () {
          /* resolve the store lazily — cart.js inits on DOMContentLoaded, after
             this deferred script's ready() runs */
          if (window.ZtorCart && typeof window.ZtorCart.openDrawer === 'function') { window.ZtorCart.openDrawer(cartBtn); return; }
          var hc = document.querySelector('.header__cart');   // fallback opener
          if (hc) hc.click();
        });
        var syncMCart = function () {
          var n = (window.ZtorCart && window.ZtorCart.count) ? window.ZtorCart.count() : 0;
          var en = document.documentElement.getAttribute('lang') === 'en' ||
                   (window.ztorI18n && window.ztorI18n.lang === 'en');
          cartBtn.classList.toggle('has-items', n > 0);
          mBadge.textContent = n > 9 ? '9+' : String(n);
          cartBtn.setAttribute('aria-label',
            n > 0 ? (en ? ('Cart, ' + n + ' items') : ('購物車，' + n + ' 件'))
                  : (en ? 'Cart' : '購物車'));
          if (n > 0) { mBadge.classList.remove('is-bumping'); void mBadge.offsetWidth; mBadge.classList.add('is-bumping'); }
        };
        syncMCart();
        document.addEventListener('cart:change', syncMCart);
        document.addEventListener('DOMContentLoaded', syncMCart);   // ZtorCart ready → persisted count
        document.addEventListener('i18n:applied', syncMCart);       // language toggle → re-label
        window.addEventListener('load', syncMCart);
      }

      /* Profile */
      var pa = document.createElement('a');
      pa.className = 'header__profile';
      pa.href = 'profile.html';
      pa.setAttribute('aria-label', '個人檔案');
      pa.innerHTML = '<span class="header__profile-icon" aria-hidden="true"></span>';
      cluster.appendChild(pa);

      inner.appendChild(cluster);
    });

    /* ── Drawer: active-page highlight + auth-aware login / logout ──────────
       Marks the current page in the drawer, and swaps the foot button between
       登入・註冊 (→ start-here onboarding) and 登出 (flips body[data-auth]) so the
       menu reflects sign-in state. Language-aware + self-heals on auth change. */
    var mdrawer = document.querySelector('[data-mdrawer]');
    if (mdrawer) {
      /* Inject a search field at the top of the panel (mirrors desktop's
         persistent search; the drawer is phone-only so this is mobile-scoped).
         Submitting takes you to the Library with the query. */
      var mhead = mdrawer.querySelector('.mdrawer__head');
      if (mhead && !mdrawer.querySelector('.mdrawer__search')) {
        var sform = document.createElement('form');
        sform.className = 'mdrawer__search';
        sform.setAttribute('role', 'search');
        sform.setAttribute('aria-label', '站內搜尋');
        sform.innerHTML =
          '<span class="mdrawer__search-icon" aria-hidden="true"></span>' +
          '<input class="mdrawer__search-input" type="search" placeholder="搜尋電影、創作者、計畫" aria-label="搜尋">';
        mhead.insertAdjacentElement('afterend', sform);
        sform.addEventListener('submit', function (e) {
          e.preventDefault();
          var q = sform.querySelector('input').value.trim();
          location.href = 'screening-room.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
        });
      }

      var curPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      mdrawer.querySelectorAll('a.mdrawer__link').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (href && href === curPage) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); }
      });

      var loginBtn = mdrawer.querySelector('.mdrawer__login');
      function syncDrawerAuth() {
        if (!loginBtn) return;
        // Write the Chinese source text; i18n.js's MutationObserver translates
        // it (登出→"Sign out", 登入・註冊→"Sign in") — same pattern as the rest of
        // the site, so it stays correct in both languages with no lang check.
        if (document.body.getAttribute('data-auth') === 'logged-in') {
          loginBtn.textContent = '登出';
          loginBtn.onclick = function () {
            document.body.setAttribute('data-auth', 'logged-out');   // mirror desktop dev-toggle behaviour
          };
        } else {
          loginBtn.textContent = '登入・註冊';
          loginBtn.onclick = function () {
            var desk = document.querySelector('.header__login-btn');
            if (desk && typeof desk.onclick === 'function') { desk.click(); }
            else { location.href = 'start-here.html'; }              // onboarding / auth entry
          };
        }
      }
      syncDrawerAuth();
      if (window.MutationObserver) {
        new MutationObserver(syncDrawerAuth)
          .observe(document.body, { attributes: true, attributeFilter: ['data-auth'] });
      }
    }

    /* Platform filter chips are presentational (no JS until now). Wire a simple
       active toggle so tapping a platform selects it — and on phones, where the
       chips are icon-only, the selected one expands to reveal its name. */
    document.querySelectorAll('.ranking-platforms, .library-platforms').forEach(function (pnav) {
      var chips = pnav.querySelectorAll('.glass-tabs__item');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.toggle('glass-tabs__item--active', c === chip); });
        });
      });
    });

    /* Scroll-shrink */
    var lastY = window.scrollY || 0, ticking = false, THRESH = 8;
    function onScroll() {
      var y = window.scrollY || 0;
      if (y < 40) nav.classList.remove('is-condensed');
      else if (y - lastY > THRESH) nav.classList.add('is-condensed');
      else if (lastY - y > THRESH) nav.classList.remove('is-condensed');
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    /* ── Footer: collapsible link sections on phone (luxury fashion pattern:
       SSENSE / Net-a-Porter / Best Buy). Desktop is untouched — the accordion
       class + collapse CSS only apply at ≤767.98px. Progressive enhancement:
       with JS off, the footer just renders as a normal expanded stack. ── */
    var footer = document.querySelector('.site-footer');
    if (footer) {
      var fnavs = footer.querySelectorAll('.site-footer__nav');
      var fmq = window.matchMedia('(max-width: 767.98px)');
      fnavs.forEach(function (fnav) {
        var title = fnav.querySelector('.site-footer__nav-title');
        var list = fnav.querySelector('.site-footer__nav-list');
        if (!title || !list) return;
        if (!list.id) list.id = 'footnav-' + Math.random().toString(36).slice(2, 8);
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        title.setAttribute('aria-controls', list.id);
        function toggleSection() {
          var open = fnav.classList.toggle('is-open');
          title.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        title.addEventListener('click', function () { if (fmq.matches) toggleSection(); });
        title.addEventListener('keydown', function (e) {
          if (!fmq.matches) return;
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection(); }
        });
      });
      function syncFooter() {
        if (fmq.matches) {
          footer.classList.add('site-footer--accordion');
          fnavs.forEach(function (n) {
            var t = n.querySelector('.site-footer__nav-title');
            if (t && !t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
          });
        } else {
          footer.classList.remove('site-footer--accordion');
          fnavs.forEach(function (n) { n.classList.remove('is-open'); });
        }
      }
      syncFooter();
      if (fmq.addEventListener) fmq.addEventListener('change', syncFooter);
      else if (fmq.addListener) fmq.addListener(syncFooter);
    }
  });
})();
