/* ════════════════════════════════════════════════════════════════
   Ztor 2.0 — Shopping Cart  (assets/cart.js)
   Self-initialising, dependency-free IIFE. Three responsibilities:
     1. STORE   — localStorage-backed cart (ztor_cart_v1), fires
                  `cart:change` so the badge + drawer stay in sync.
     2. ICON    — injects a .header__cart button (+ count badge) into
                  every .header__actions (both auth header variants),
                  placed just before .header__buttons.
     3. DRAWER  — a right slide-over dialog with CART → CHECKOUT →
                  CONFIRMATION views; focus trap, Esc/backdrop close,
                  scroll-lock, return-focus.
   Binds to shop-render.js's product cards via ONE delegated document
   listener on [data-add] — shop-render.js is never edited. The card's
   own "已加入" feedback is left intact; this coexists with it.
   Mobbin: Hers (rows + summary), Instacart (sticky CTA + steppers),
   Apple (address form + radio pay + confirmation), Walmart/Shop
   (collapsed checkout summary).
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__ztorCartInit) return;       /* guard: one instance / page */
  window.__ztorCartInit = true;

  var KEY = 'ztor_cart_v1';
  var SHIPPING_FLAT = 120;                  /* NT$ flat; free over threshold */
  var FREE_SHIP_OVER = 3000;
  var TAX_RATE = 0.05;                      /* 5% — shown on checkout only */

  /* ── tiny helpers ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function slugify(s) {
    return String(s).trim().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w一-鿿-]/g, '')
      .slice(0, 64) || ('item-' + Date.now());
  }
  function money(cur, n) { return (cur || 'NT$') + ' ' + fmt(n); }

  /* ───────────────────────────────────────────────────────────────
     STORE
     items: [{ id, title, price (number), currency, image, qty }]
     ─────────────────────────────────────────────────────────────── */
  var Store = (function () {
    var items = [];
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          items = parsed.filter(function (i) {
            return i && i.id && typeof i.price === 'number';
          }).map(function (i) {
            return {
              id: String(i.id),
              title: String(i.title || '商品'),
              price: Number(i.price) || 0,
              currency: i.currency || 'NT$',
              image: i.image || '',
              qty: Math.max(1, parseInt(i.qty, 10) || 1)
            };
          });
        }
      }
    } catch (e) { items = []; }

    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    }
    function emit(detail) {
      persist();
      document.dispatchEvent(new CustomEvent('cart:change', { detail: detail || {} }));
    }
    function find(id) {
      for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
      return null;
    }
    return {
      getItems: function () { return items.map(function (i) { return Object.assign({}, i); }); },
      count: function () { return items.reduce(function (s, i) { return s + i.qty; }, 0); },
      lineCount: function () { return items.length; },
      subtotal: function () { return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0); },
      currency: function () { return items.length ? items[0].currency : 'NT$'; },
      add: function (p) {
        var existing = find(p.id);
        if (existing) { existing.qty += (p.qty || 1); }
        else {
          items.push({
            id: p.id, title: p.title, price: Number(p.price) || 0,
            currency: p.currency || 'NT$', image: p.image || '',
            qty: Math.max(1, p.qty || 1)
          });
        }
        emit({ type: 'add', id: p.id });
      },
      setQty: function (id, qty) {
        var it = find(id); if (!it) return;
        qty = parseInt(qty, 10) || 0;
        if (qty <= 0) { return this.remove(id); }
        it.qty = qty;
        emit({ type: 'qty', id: id });
      },
      remove: function (id) {
        items = items.filter(function (i) { return i.id !== id; });
        emit({ type: 'remove', id: id });
      },
      clear: function () { items = []; emit({ type: 'clear' }); }
    };
  })();
  window.ZtorCart = Store;   /* expose the public store API */

  /* ───────────────────────────────────────────────────────────────
     ICONS (inline SVG — no new asset files)
     ─────────────────────────────────────────────────────────────── */
  var SVG = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
    cartBig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5 11-11"/></svg>',
    apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.02-.01-2.1-.8-2.1-3.2zM14.5 6.3c.6-.7 1-1.7.9-2.6-.8.03-1.9.5-2.5 1.2-.5.6-1 1.6-.9 2.5.9.07 1.8-.4 2.5-1.1z"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/></svg>',
    cod: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h13l3 3v7H3z"/><circle cx="7" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/></svg>'
  };

  /* ───────────────────────────────────────────────────────────────
     HEADER ICON — inject into every .header__actions
     ─────────────────────────────────────────────────────────────── */
  function wireCart(btn) {
    if (btn.__cartWired) return;             /* one listener per button */
    btn.__cartWired = true;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      Drawer.open(btn);
    });
  }

  function buildIconButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'header__cart';
    btn.setAttribute('aria-label', '購物車');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span class="header__cart__glyph" aria-hidden="true">' + SVG.cart + '</span>' +
      '<span class="header__cart__badge" aria-live="polite" aria-atomic="true"></span>';
    return btn;
  }

  /* The cart icon ships in the static HTML (so it's present at first paint and
     carried across navigations by the view-transition — no pop-in/blink). Here we
     just WIRE the existing button; we only build + inject as a fallback for any
     page that lacks the static markup. */
  function injectIcons() {
    document.querySelectorAll('.header__actions').forEach(function (cluster) {
      var btn = cluster.querySelector('.header__cart');
      if (!btn) {
        btn = buildIconButton();
        var buttons = cluster.querySelector('.header__buttons');
        if (buttons) cluster.insertBefore(btn, buttons);    /* right end of icon cluster */
        else cluster.appendChild(btn);
      }
      wireCart(btn);
    });
  }

  function updateBadges(bump) {
    var n = Store.count();
    document.querySelectorAll('.header__cart').forEach(function (btn) {
      var badge = btn.querySelector('.header__cart__badge');
      btn.classList.toggle('has-items', n > 0);
      if (badge) {
        badge.textContent = n > 99 ? '99+' : String(n);
        if (bump && n > 0) {
          badge.classList.remove('is-bumping');
          void badge.offsetWidth;
          badge.classList.add('is-bumping');
        }
      }
    });
  }

  /* ───────────────────────────────────────────────────────────────
     ADD-TO-CART — read product from the rendered .shop-card
     Price source = the VISIBLE headline price the user sees, parsed
     from .shop-card__price (ignoring the .shop-card__price-sub line).
     We never invent a number; if no numeric price is present (e.g.
     免費) the item is added at 0.
     ─────────────────────────────────────────────────────────────── */
  function parsePrice(card) {
    var priceEl = card.querySelector('.shop-card__price');
    if (!priceEl) return { price: 0, currency: 'NT$' };
    /* clone, strip the secondary HK$ sub-line, read the headline only */
    var clone = priceEl.cloneNode(true);
    clone.querySelectorAll('.shop-card__price-sub, .shop-card__redeem, .shop-card__price-pop-icon')
      .forEach(function (n) { n.remove(); });
    var text = (clone.textContent || '').trim();
    var cur = 'NT$';
    var m = text.match(/(NT\$|HK\$|US\$|\$|NTD|HKD)/i);
    if (m) cur = /NTD/i.test(m[0]) ? 'NT$' : (/HKD/i.test(m[0]) ? 'HK$' : m[0]);
    var num = text.replace(/[^\d.]/g, '');
    return { price: num ? Math.round(parseFloat(num)) : 0, currency: cur };
  }

  function productFromCard(card) {
    var title = card.getAttribute('data-name') ||
      (card.querySelector('.shop-card__title') || {}).textContent || '商品';
    title = String(title).trim();
    var img = card.querySelector('.shop-card__media img');
    var pr = parsePrice(card);
    return {
      id: card.getAttribute('data-id') || slugify(title),
      title: title,
      price: pr.price,
      currency: pr.currency,
      image: img ? img.getAttribute('src') : ''
    };
  }

  function bindAddToCart() {
    /* One delegated listener at document level. Runs in the CAPTURE
       phase so we read the card BEFORE shop-render's bubble handler
       mutates the button label to "已加入" — both still fire; we don't
       preventDefault, so shop-render's own feedback is untouched. */
    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (!add) return;
      var card = add.closest('.shop-card');
      if (!card || card.classList.contains('shop-card--soldout')) return;
      var product = productFromCard(card);
      Store.add(product);
      updateBadges(true);
      Drawer.flash(product.title);
    }, true);
  }

  /* ───────────────────────────────────────────────────────────────
     DRAWER
     ─────────────────────────────────────────────────────────────── */
  var Drawer = (function () {
    var root, panel, opener, scrollY = 0;
    var built = false;

    function shippingFor(sub) { return 0; /* QR pickup — no shipping fee (Phase 1) */ }

    function build() {
      if (built) return;
      built = true;
      root = document.createElement('div');
      root.className = 'ztor-cart';
      root.setAttribute('data-view', 'cart');
      root.innerHTML =
        '<div class="ztor-cart__overlay" data-cart-close></div>' +
        '<div class="ztor-cart__panel" role="dialog" aria-modal="true" aria-label="購物車">' +
          '<div class="ztor-cart__stage">' +
            /* ── CART VIEW ── */
            '<section class="ztor-cart__view" data-view-cart>' +
              '<header class="ztor-cart__head">' +
                '<h2 class="ztor-cart__title">購物車<span class="ztor-cart__title-count" data-cart-headcount></span></h2>' +
                '<button class="ztor-cart__close" type="button" aria-label="關閉" data-cart-close>' +
                  '<span class="ztor-cart__close-icon" aria-hidden="true"></span></button>' +
              '</header>' +
              '<div class="ztor-cart__body" data-cart-body></div>' +
              '<footer class="ztor-cart__foot" data-cart-foot></footer>' +
            '</section>' +
            /* ── CHECKOUT VIEW ── */
            '<section class="ztor-cart__view" data-view-checkout>' +
              '<header class="ztor-cart__head">' +
                '<button class="ztor-cart__back" type="button" aria-label="返回購物車" data-cart-toback>' + SVG.back + '</button>' +
                '<h2 class="ztor-cart__title">結帳</h2>' +
                '<button class="ztor-cart__close" type="button" aria-label="關閉" data-cart-close>' +
                  '<span class="ztor-cart__close-icon" aria-hidden="true"></span></button>' +
              '</header>' +
              '<div class="ztor-cart__body" data-checkout-body></div>' +
              '<footer class="ztor-cart__foot" data-checkout-foot></footer>' +
            '</section>' +
          '</div>' +
        '</div>';
      document.body.appendChild(root);
      panel = root.querySelector('.ztor-cart__panel');

      root.querySelectorAll('[data-cart-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      root.querySelector('[data-cart-toback]').addEventListener('click', function () {
        /* Step-aware single back: inside a checkout sub-sheet → return to the
           hub; on the hub → back to the cart. (No per-step 返回 buttons.) */
        var cob = root.querySelector('[data-checkout-body]');
        var api = cob && cob.__checkout;
        if (api && api.atSubSheet && api.atSubSheet()) { api.back(); return; }
        setView('cart');
      });

      /* delegated controls inside the CART body + footer */
      root.addEventListener('click', onClick);
      root.addEventListener('input', onInput);
      root.addEventListener('submit', function (e) { e.preventDefault(); });

      document.addEventListener('keydown', onKeydown);
    }

    /* ── view switching ── */
    function setView(v) {
      root.setAttribute('data-view', v);
      if (v === 'checkout') renderCheckout();
      /* move focus to the new view's first sensible control */
      requestAnimationFrame(function () {
        var sel = v === 'cart' ? '[data-view-cart] .ztor-cart__close'
                : v === 'checkout' ? '[data-view-checkout] .ztor-cart__back'
                : null;
        var t = sel && root.querySelector(sel);
        if (t) t.focus();
      });
    }

    /* ── CART body + footer render ── */
    function renderCart() {
      if (!built || !root) return;   /* drawer not opened yet — badge alone updates */
      var items = Store.getItems();
      var body = root.querySelector('[data-cart-body]');
      var foot = root.querySelector('[data-cart-foot]');
      var headcount = root.querySelector('[data-cart-headcount]');
      var n = Store.count();
      headcount.textContent = n ? ' (' + n + ')' : '';

      if (!items.length) {
        body.innerHTML =
          '<div class="ztor-cart__empty">' +
            '<span class="ztor-cart__empty-icon">' + SVG.cartBig + '</span>' +
            '<span class="ztor-cart__empty-title">你的購物車是空的</span>' +
            '<span class="ztor-cart__empty-desc">把喜歡的電影周邊、收藏與體驗加進來，這裡就會熱鬧起來。</span>' +
            '<button class="ztor-cart__empty-cta" type="button" data-cart-close>回商店逛逛</button>' +
          '</div>';
        foot.innerHTML = '';
        /* re-bind the empty-state close */
        var ec = body.querySelector('[data-cart-close]');
        if (ec) ec.addEventListener('click', close);
        return;
      }

      var cur = Store.currency();
      body.innerHTML = '<div class="ztor-cart__items">' + items.map(function (it) {
        return (
          '<div class="ztor-cart-line" data-line="' + esc(it.id) + '">' +
            '<span class="ztor-cart-line__media">' +
              (it.image ? '<img src="' + esc(it.image) + '" alt="" loading="lazy">' : '') + '</span>' +
            '<div class="ztor-cart-line__main">' +
              '<h3 class="ztor-cart-line__title">' + esc(it.title) + '</h3>' +
              '<span class="ztor-cart-line__price">' + money(it.currency, it.price) + '</span>' +
              '<span class="ztor-cart-line__stepper">' +
                '<button class="ztor-cart-step" type="button" data-dec="' + esc(it.id) + '" aria-label="減少數量">' + SVG.minus + '</button>' +
                '<span class="ztor-cart-line__qty" aria-label="數量">' + it.qty + '</span>' +
                '<button class="ztor-cart-step" type="button" data-inc="' + esc(it.id) + '" aria-label="增加數量">' + SVG.plus + '</button>' +
              '</span>' +
            '</div>' +
            '<div class="ztor-cart-line__aside">' +
              '<button class="ztor-cart-line__remove" type="button" data-rm="' + esc(it.id) + '" aria-label="移除' + esc(it.title) + '">' + SVG.trash + '</button>' +
              '<span class="ztor-cart-line__line-total">' + money(it.currency, it.price * it.qty) + '</span>' +
            '</div>' +
          '</div>'
        );
      }).join('') + '</div>';

      var sub = Store.subtotal();
      var ship = shippingFor(sub);
      var total = sub + ship;
      foot.innerHTML =
        '<div class="ztor-cart__summary">' +
          '<div class="ztor-cart__sum-row"><span>小計</span><span>' + money(cur, sub) + '</span></div>' +
          '<div class="ztor-cart__sum-row"><span>運費</span><span' + (ship === 0 ? ' class="ztor-cart__sum-free"' : '') + '>' +
            (ship === 0 ? '免運' : money(cur, ship)) + '</span></div>' +
          '<div class="ztor-cart__sum-row ztor-cart__sum-row--total"><span>總計</span><span>' + money(cur, total) + '</span></div>' +
        '</div>' +
        '<button class="ztor-cart__cta" type="button" data-cart-checkout' + (items.length ? '' : ' disabled') + '>前往結帳</button>' +
        '<p class="ztor-cart__foot-note">' + (ship === 0 ? '現場 QR 領取 · 免運' : '滿 NT$ ' + fmt(FREE_SHIP_OVER) + ' 免運') + '</p>';
    }

    /* ── CHECKOUT render ── */
    function renderCheckout() {
      if (!built || !root) return;
      /* Delegate to the multi-step checkout (checkout.js) when present — one
         surface, no duplicate drawer. Falls back to the inline mock below. */
      if (window.ZtorCheckout && window.ZtorCheckout.mount) {
        window.ZtorCheckout.mount({
          root: root,
          body: root.querySelector('[data-checkout-body]'),
          foot: root.querySelector('[data-checkout-foot]'),
          store: Store,
          close: close,
          back: function () { setView('cart'); }
        });
        return;
      }
      var items = Store.getItems();
      var cur = Store.currency();
      var sub = Store.subtotal();
      var ship = shippingFor(sub);
      var tax = Math.round(sub * TAX_RATE);
      var total = sub + ship + tax;
      var body = root.querySelector('[data-checkout-body]');
      var foot = root.querySelector('[data-checkout-foot]');

      var thumbs = items.slice(0, 4).map(function (it) {
        return '<span class="ztor-cart__co-thumb">' + (it.image ? '<img src="' + esc(it.image) + '" alt="">' : '') + '</span>';
      }).join('');
      if (items.length > 4) {
        thumbs += '<span class="ztor-cart__co-thumb ztor-cart__co-thumb--more">+' + (items.length - 4) + '</span>';
      }

      body.innerHTML =
        '<div class="ztor-cart__section">' +
          '<h3 class="ztor-cart__section-title">訂單摘要</h3>' +
          '<div class="ztor-cart__co-items">' +
            '<span class="ztor-cart__co-thumbs">' + thumbs + '</span>' +
            '<span class="ztor-cart__co-itemcount">共 ' + Store.count() + ' 件商品</span>' +
          '</div>' +
          '<div class="ztor-cart__summary" style="margin-bottom:0">' +
            '<div class="ztor-cart__sum-row"><span>小計</span><span>' + money(cur, sub) + '</span></div>' +
            '<div class="ztor-cart__sum-row"><span>運費</span><span' + (ship === 0 ? ' class="ztor-cart__sum-free"' : '') + '>' + (ship === 0 ? '免運' : money(cur, ship)) + '</span></div>' +
            '<div class="ztor-cart__sum-row"><span>稅金（5%）</span><span>' + money(cur, tax) + '</span></div>' +
            '<div class="ztor-cart__sum-row ztor-cart__sum-row--total"><span>總計</span><span>' + money(cur, total) + '</span></div>' +
          '</div>' +
        '</div>' +

        '<div class="ztor-cart__section">' +
          '<h3 class="ztor-cart__section-title">收件資訊</h3>' +
          '<div class="ztor-cart__field">' +
            '<label class="ztor-cart__label" for="ztorco-name">收件人</label>' +
            '<input class="ztor-cart__input" id="ztorco-name" type="text" placeholder="王小明" autocomplete="name">' +
          '</div>' +
          '<div class="ztor-cart__field-row">' +
            '<div class="ztor-cart__field">' +
              '<label class="ztor-cart__label" for="ztorco-phone">手機</label>' +
              '<input class="ztor-cart__input" id="ztorco-phone" type="tel" placeholder="0912 345 678" autocomplete="tel">' +
            '</div>' +
            '<div class="ztor-cart__field">' +
              '<label class="ztor-cart__label" for="ztorco-zip">郵遞區號</label>' +
              '<input class="ztor-cart__input" id="ztorco-zip" type="text" placeholder="100" autocomplete="postal-code">' +
            '</div>' +
          '</div>' +
          '<div class="ztor-cart__field">' +
            '<label class="ztor-cart__label" for="ztorco-addr">配送地址</label>' +
            '<input class="ztor-cart__input" id="ztorco-addr" type="text" placeholder="台北市中正區忠孝東路一段 1 號" autocomplete="street-address">' +
          '</div>' +
        '</div>' +

        '<div class="ztor-cart__section">' +
          '<h3 class="ztor-cart__section-title">付款方式</h3>' +
          '<div class="ztor-cart__pay" role="radiogroup" aria-label="付款方式">' +
            payRow('applepay', SVG.apple, 'Apple Pay', '一鍵安全付款', true) +
            payRow('card', SVG.card, '信用卡 / 簽帳金融卡', 'Visa · Mastercard · JCB', false) +
            payRow('cod', SVG.cod, '貨到付款', '收到商品時以現金支付', false) +
          '</div>' +
        '</div>';

      foot.innerHTML =
        '<div class="ztor-cart__summary">' +
          '<div class="ztor-cart__sum-row ztor-cart__sum-row--total"><span>應付總計</span><span>' + money(cur, total) + '</span></div>' +
        '</div>' +
        '<button class="ztor-cart__cta" type="button" data-cart-place>確認下單</button>' +
        '<p class="ztor-cart__foot-note">此為預覽展示，不會產生實際付款。</p>';
    }

    function payRow(val, mark, label, hint, selected) {
      return '<label class="ztor-cart__pay-row' + (selected ? ' is-selected' : '') + '" data-pay="' + val + '">' +
        '<span class="ztor-cart__pay-radio" aria-hidden="true"></span>' +
        '<span class="ztor-cart__pay-mark" aria-hidden="true">' + mark + '</span>' +
        '<span class="ztor-cart__pay-label">' + label + '</span>' +
        '<span class="ztor-cart__pay-hint">' + hint + '</span>' +
        '<input type="radio" name="ztor-pay" value="' + val + '" ' + (selected ? 'checked' : '') + ' style="position:absolute;opacity:0;width:0;height:0">' +
        '</label>';
    }

    /* ── CONFIRMATION (replaces the checkout body) ── */
    function renderConfirmation() {
      var order = 'ZT' +
        new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' +
        String(Math.floor(1000 + Math.random() * 9000));
      var body = root.querySelector('[data-checkout-body]');
      var foot = root.querySelector('[data-checkout-foot]');
      root.querySelector('[data-view-checkout] .ztor-cart__title').textContent = '訂單完成';
      var backBtn = root.querySelector('[data-cart-toback]');
      if (backBtn) backBtn.style.visibility = 'hidden';

      body.innerHTML =
        '<div class="ztor-cart__confirm">' +
          '<span class="ztor-cart__confirm-mark">' + SVG.check + '</span>' +
          '<span class="ztor-cart__confirm-title">訂單已成立 · 感謝你的支持</span>' +
          '<span class="ztor-cart__confirm-desc">我們已收到你的訂單，確認信將寄送到你的信箱。你支持的每一筆，都是台灣電影的養分。</span>' +
          '<span class="ztor-cart__confirm-order">訂單編號 <b>' + order + '</b></span>' +
        '</div>';
      foot.innerHTML =
        '<button class="ztor-cart__cta" type="button" data-cart-done>完成</button>';

      Store.clear();   /* fires cart:change → cart view + badge reset behind the scenes */
    }

    /* ── delegated clicks inside the drawer ── */
    function onClick(e) {
      var t = e.target;
      var inc = t.closest('[data-inc]');
      var dec = t.closest('[data-dec]');
      var rm = t.closest('[data-rm]');
      var pay = t.closest('[data-pay]');

      if (inc) { var id = inc.getAttribute('data-inc'); Store.setQty(id, qtyOf(id) + 1); return; }
      if (dec) { var id2 = dec.getAttribute('data-dec'); Store.setQty(id2, qtyOf(id2) - 1); return; }
      if (rm) { animateRemove(rm.getAttribute('data-rm')); return; }
      if (t.closest('[data-cart-checkout]')) {
        if (window.ZtorAuth && window.ZtorAuth.requireLogin) window.ZtorAuth.requireLogin(function () { setView('checkout'); }, '登入後即可結帳');
        else setView('checkout');
        return;
      }
      if (t.closest('[data-cart-place]')) { renderConfirmation(); return; }
      if (t.closest('[data-cart-done]')) { close(); return; }
      if (pay) {
        root.querySelectorAll('.ztor-cart__pay-row').forEach(function (r) {
          r.classList.toggle('is-selected', r === pay);
          var radio = r.querySelector('input[type=radio]');
          if (radio) radio.checked = (r === pay);
        });
        return;
      }
    }
    function onInput() { /* reserved for live field validation; no-op in preview */ }

    function qtyOf(id) {
      var items = Store.getItems();
      for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i].qty;
      return 0;
    }

    /* graceful row removal: play the leave animation, then mutate store */
    function animateRemove(id) {
      var line = root.querySelector('.ztor-cart-line[data-line="' + cssEsc(id) + '"]');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!line || reduced) { Store.remove(id); return; }
      line.classList.add('is-leaving');
      var done = false;
      var finish = function () { if (done) return; done = true; Store.remove(id); };
      line.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 320);   /* fallback if animationend doesn't fire */
    }
    function cssEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }

    /* ── open / close ── */
    function open(fromEl) {
      build();
      opener = fromEl || document.activeElement;
      renderCart();
      setView('cart');
      lockScroll();
      root.classList.add('is-open');
      document.body.classList.add('cart-open');   // hides the mobile bottom-nav while the cart overlay is up
      document.querySelectorAll('.header__cart').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      requestAnimationFrame(function () {
        var first = root.querySelector('[data-view-cart] .ztor-cart__close');
        if (first) first.focus();
      });
    }
    function close() {
      if (!root || !root.classList.contains('is-open')) return;
      root.classList.remove('is-open');
      document.body.classList.remove('cart-open');
      unlockScroll();
      document.querySelectorAll('.header__cart').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      /* reset checkout chrome that confirmation mutated */
      var backBtn = root.querySelector('[data-cart-toback]');
      if (backBtn) backBtn.style.visibility = '';
      var coTitle = root.querySelector('[data-view-checkout] .ztor-cart__title');
      if (coTitle) coTitle.textContent = '結帳';
      if (opener && typeof opener.focus === 'function') opener.focus();
    }

    /* ── scroll lock ──
       Centralised in ds.js. The global overlay scroll-lock owns the <body>
       lock, driven by the `cart-open` class this drawer toggles. Keeping the
       lock in ONE place (not here too) means nested overlays — e.g. the auth
       drawer opened from checkout — save/restore the scroll position exactly
       once; two competing locks corrupted it (read scrollY=0 off an already-
       fixed body, then scrolled to top on close). Left as no-ops so the call
       sites still read clearly. */
    function lockScroll() { /* handled by ds.js overlay scroll-lock via .cart-open */ }
    function unlockScroll() { /* handled by ds.js overlay scroll-lock via .cart-open */ }

    /* ── keyboard: Esc closes, Tab is trapped within the panel ── */
    function onKeydown(e) {
      if (!root || !root.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var focusables = panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      var visible = Array.prototype.filter.call(focusables, function (el) {
        return el.offsetParent !== null && el.getBoundingClientRect().width > 0;
      });
      if (!visible.length) return;
      var first = visible[0], last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    /* a tiny flash when an item is added while the drawer is closed
       — re-uses shop-render's toast if present, otherwise silent (the
       badge bump is the primary feedback). Avoids a second toast system. */
    function flash(title) {
      if (root && root.classList.contains('is-open')) renderCart();
    }

    return { open: open, close: close, renderCart: renderCart, flash: flash };
  })();

  /* ───────────────────────────────────────────────────────────────
     WIRING
     ─────────────────────────────────────────────────────────────── */
  function init() {
    injectIcons();
    bindAddToCart();
    updateBadges(false);

    /* Public drawer opener — lets other surfaces (the mobile bottom-nav cart
       cell, a PDP buy-bar, etc.) open the SAME drawer without re-implementing
       it or faking a click on the desktop-only header icon. One store, one
       drawer, many entry points. */
    window.ZtorCart.openDrawer = function (fromEl) { Drawer.open(fromEl); };
    window.ZtorCart.closeDrawer = function () { Drawer.close(); };

    /* keep badge + open drawer in sync on every store mutation */
    document.addEventListener('cart:change', function (e) {
      var bump = e.detail && e.detail.type === 'add';
      updateBadges(bump);
      Drawer.renderCart();
    });

    /* cross-tab sync: another tab edited the cart */
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) { location.reload(); }
    });

    /* re-inject if a header is swapped in later (dev auth toggle just
       flips data-auth via CSS, both headers already exist — but this is
       cheap insurance against late DOM changes). */
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        if (document.querySelectorAll('.header__actions .header__cart').length <
            document.querySelectorAll('.header__actions').length) {
          injectIcons();
          updateBadges(false);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
