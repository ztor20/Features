/* ════════════════════════════════════════════════════════════════
   checkout.js — single-screen review-hub checkout (window.ZtorCheckout).

   Renders INTO the cart drawer's CHECKOUT view (cart.js delegates to
   ZtorCheckout.mount). Checkout is account-gated (cart.js requireLogin) — there
   is NO guest checkout — so the hub is built around a saved profile:

     HUB (one screen)         收件 row · 配送 method · 付款 row · promo · 下單
       ├─ saved → shown with 編輯 / 更換  (logged-in + data-has-address/card)
       └─ missing → an "＋ 新增" prompt; 下單 disabled until address + card set
     SUB-SHEETS (focused)     address form · payment (ZtorPay) — return to hub
     CONFIRM                  order placed (ZtorLedger)

   Returning user with both saved = instant express (one screen, one tap).
   The drawer's top-left chevron is the ONLY back (sub-sheet → hub, hub → cart);
   no per-step 返回. MOCK payment via ZtorPay, persistence via ZtorLedger.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZtorCheckout) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function money(cur, n) { return (cur || 'NT$') + ' ' + fmt(n); }
  function devOn(attr) { return document.body.dataset[attr] === 'true'; }

  var SHIP_METHODS = [
    { id: 'standard', label: '標準宅配', eta: '3–5 個工作天', fee: 120 },
    { id: 'express',  label: '快遞急件', eta: '1–2 個工作天', fee: 220 }
  ];
  var FREE_SHIP_OVER = 3000;
  var TAX_RATE = 0.05;
  var PROMOS = {
    ZTOR10:    { kind: 'pct',   val: 0.10, label: 'ZTOR10' },
    WELCOME50: { kind: 'flat',  val: 50,   label: 'WELCOME50' },
    FREESHIP:  { kind: 'ship',  val: 0,    label: 'FREESHIP' }
  };

  /* The mock account profile a logged-in user has on file. data-has-address /
     data-has-card (dev-state.js) decide whether each is pre-loaded. */
  var SAVED = {
    address: { name: '王小明', phone: '0912 345 678', zip: '100', addr: '台北市中正區忠孝東路一段 1 號' },
    card:    { last4: '4242', brand: '信用卡' }
  };

  function mount(ctx) {
    var store = ctx.store;
    var body = ctx.body, foot = ctx.foot;
    var titleEl = ctx.root && ctx.root.querySelector('[data-view-checkout] .ztor-cart__title');
    var topBack = ctx.root && ctx.root.querySelector('[data-cart-toback]');

    var state = {
      view: 'hub',                   /* 'hub' | 'address' | 'payment' */
      shipping: devOn('hasAddress') ? Object.assign({}, SAVED.address) : null,
      method: SHIP_METHODS[0].id,
      payment: devOn('hasCard') ? { last4: SAVED.card.last4 } : null,
      saveCard: true,
      promo: null
    };

    /* ── money ── */
    function subtotal() { return store.subtotal(); }
    function cur() { return store.currency(); }
    function shipFee() {
      if (state.promo && state.promo.kind === 'ship') return 0;
      var m = SHIP_METHODS.filter(function (x) { return x.id === state.method; })[0] || SHIP_METHODS[0];
      if (subtotal() >= FREE_SHIP_OVER) return 0;
      return m.fee;
    }
    function discount() {
      if (!state.promo) return 0;
      if (state.promo.kind === 'pct') return Math.round(subtotal() * state.promo.val);
      if (state.promo.kind === 'flat') return Math.min(subtotal(), state.promo.val);
      return 0;
    }
    function tax() { return Math.round((subtotal() - discount()) * TAX_RATE); }
    function total() { return Math.max(0, subtotal() - discount()) + shipFee() + tax(); }
    function ready() { return !!(state.shipping && state.payment); }

    /* ── order summary ── */
    function summaryHtml(opts) {
      opts = opts || {};
      var c = cur();
      var lines = opts.showLines ? store.getItems().map(function (it) {
        return '<div class="checkout-sum__line"><span class="checkout-sum__line-title">' + esc(it.title) +
          (it.qty > 1 ? ' ×' + it.qty : '') + '</span><span>' + money(it.currency, it.price * it.qty) + '</span></div>';
      }).join('') : '';
      var rows =
        '<div class="cc-pay__sumrow"><span>小計</span><span>' + money(c, subtotal()) + '</span></div>' +
        (state.promo ? '<div class="cc-pay__sumrow checkout-sum__discount"><span>折扣 ' + esc(state.promo.label) + '</span><span>−' + money(c, discount()) + '</span></div>' : '') +
        '<div class="cc-pay__sumrow"><span>運費</span><span>' + (shipFee() === 0 ? '免運' : money(c, shipFee())) + '</span></div>' +
        '<div class="cc-pay__sumrow"><span>稅金（5%）</span><span>' + money(c, tax()) + '</span></div>' +
        '<div class="cc-pay__sumrow cc-pay__sumrow--total"><span>總計</span><span>' + money(c, total()) + '</span></div>';
      return '<div class="checkout-sum">' +
        (opts.showLines ? '<div class="checkout-sum__lines">' + lines + '</div>' : '') +
        '<div class="cc-pay__summary">' + rows + '</div>' +
      '</div>';
    }

    /* ── HUB (the single review screen) ── */
    function rowSaved(k, value, action, label) {
      return '<div class="checkout-hub__row"><div class="checkout-hub__row-main">' +
        '<span class="checkout-hub__row-k">' + esc(k) + '</span>' +
        '<span class="checkout-hub__row-v">' + value + '</span></div>' +
        '<button class="checkout-hub__edit" type="button" ' + action + '>' + esc(label) + '</button></div>';
    }
    function rowAdd(text, action) {
      return '<button class="checkout-hub__add" type="button" ' + action + '>' +
        '<span class="checkout-hub__add-icon" aria-hidden="true">+</span>' + esc(text) + '</button>';
    }

    function renderHub() {
      if (titleEl) titleEl.textContent = '結帳';
      if (topBack) topBack.style.visibility = '';
      var s = state.shipping, p = state.payment;

      var addrBlock = s
        ? rowSaved('收件', esc(s.name) + ' · ' + esc(s.phone) + '<br>' + esc(s.addr) + '（' + esc(s.zip) + '）', 'data-go="address"', '編輯')
        : rowAdd('新增收件地址', 'data-go="address"');

      var methods = '<div class="checkout-methods" role="radiogroup" aria-label="配送方式">' + SHIP_METHODS.map(function (m) {
        var sel = m.id === state.method;
        var fee = subtotal() >= FREE_SHIP_OVER ? '免運' : money(cur(), m.fee);
        return '<button class="checkout-method' + (sel ? ' is-selected' : '') + '" type="button" role="radio" aria-checked="' + (sel ? 'true' : 'false') + '" data-method="' + m.id + '">' +
          '<span class="checkout-method__radio" aria-hidden="true"></span>' +
          '<span class="checkout-method__main"><span class="checkout-method__label">' + esc(m.label) + '</span>' +
            '<span class="checkout-method__eta">' + esc(m.eta) + '</span></span>' +
          '<span class="checkout-method__fee">' + fee + '</span></button>';
      }).join('') + '</div>';

      var payBlock = p
        ? rowSaved('付款', esc(SAVED.card.brand) + ' •••• ' + esc(p.last4), 'data-go="payment"', '更換')
        : rowAdd('新增付款方式', 'data-go="payment"');

      body.innerHTML =
        '<div class="checkout-hub">' +
          '<div class="checkout-hub__group"><p class="checkout-hub__label">收件資訊</p>' + addrBlock + '</div>' +
          '<div class="checkout-hub__group"><p class="checkout-hub__label">配送方式</p>' + methods + '</div>' +
          '<div class="checkout-hub__group"><p class="checkout-hub__label">付款方式</p>' + payBlock + '</div>' +
          '<div class="checkout-hub__group"><p class="checkout-hub__label">折扣碼</p>' +
            '<div class="checkout-promo" data-promo><div class="checkout-promo__row">' +
              '<input class="cc-field__input checkout-promo__input" type="text" placeholder="輸入折扣碼（試試 ZTOR10）" data-promo-input ' + (state.promo ? 'disabled value="' + esc(state.promo.label) + '"' : '') + '>' +
              (state.promo ? '<button class="btn btn--ghost btn--md" type="button" data-promo-remove>移除</button>'
                           : '<button class="btn btn--ghost btn--md" type="button" data-promo-apply>套用</button>') +
            '</div><p class="checkout-promo__msg" data-promo-msg hidden></p></div>' +
          '</div>' +
          summaryHtml({ showLines: true }) +
        '</div>';

      foot.innerHTML =
        (ready() ? '' : '<p class="checkout-foot__hint">' + (!state.shipping ? '請先新增收件地址' : '請先新增付款方式') + '</p>') +
        '<button class="btn btn--primary btn--lg checkout-cta" type="button" data-place' + (ready() ? '' : ' disabled') + '>下單 · ' + money(cur(), total()) + '</button>';
    }

    /* ── ADDRESS sub-sheet ── */
    function field(name, label, type, ph, val, mode) {
      return '<label class="cc-field"><span class="cc-field__label">' + esc(label) + '</span>' +
        '<input class="cc-field__input" type="' + type + '" name="' + name + '" ' + (mode ? 'inputmode="' + mode + '" ' : '') +
        'placeholder="' + esc(ph) + '" value="' + esc(val || '') + '" data-req></label>';
    }
    function renderAddress() {
      if (titleEl) titleEl.textContent = '收件資訊';
      var a = state.shipping || {};
      body.innerHTML =
        '<form class="checkout-form" data-checkout-form novalidate>' +
          field('name', '收件人', 'text', '王小明', a.name) +
          '<div class="checkout-form__row">' +
            field('phone', '手機', 'tel', '0912 345 678', a.phone, 'tel') +
            field('zip', '郵遞區號', 'text', '100', a.zip, 'numeric') +
          '</div>' +
          field('addr', '配送地址', 'text', '台北市中正區忠孝東路一段 1 號', a.addr) +
          '<p class="cc-pay__err" data-err hidden></p>' +
        '</form>';
      foot.innerHTML = '<button class="btn btn--primary btn--lg checkout-cta" type="button" data-save-address>儲存收件資訊</button>';
    }

    /* ── PAYMENT sub-sheet (ZtorPay captures the card; charge is at 下單) ── */
    function renderPayment() {
      if (titleEl) titleEl.textContent = '付款方式';
      body.innerHTML = '<div data-pay-mount></div>';
      foot.innerHTML = '';
      if (window.ZtorPay) {
        window.ZtorPay.open({
          mount: body.querySelector('[data-pay-mount]'),
          amount: total(), currency: cur(), title: '新增付款方式',
          confirmLabel: '儲存並使用此卡片', backLabel: false,   /* top chevron owns back */
          onSuccess: function (r) { state.payment = { last4: r.last4 }; state.view = 'hub'; render(); },
          onFail: function () {}
        });
      } else {
        body.querySelector('[data-pay-mount]').innerHTML = '<p class="cc-pay__err">付款模組未載入。</p>';
      }
    }

    /* ── CONFIRM ── */
    function renderConfirm(order) {
      if (titleEl) titleEl.textContent = '訂單完成';
      if (topBack) topBack.style.visibility = 'hidden';
      body.innerHTML =
        '<div class="cc-success checkout-confirm">' +
          '<span class="cc-success__check ds-success-tick" aria-hidden="true"><svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg></span>' +
          '<h2 class="cc-success__title">訂單已成立 · 感謝你的支持</h2>' +
          '<p class="cc-success__msg">確認信將寄送到你的信箱。你支持的每一筆，都是台灣電影的養分。</p>' +
          '<div class="checkout-confirm__order">訂單編號 <b>' + esc(order.id) + '</b></div>' +
          '<div class="order-tracker order-tracker--mini">' +
            ['已下單', '備貨中', '已出貨', '已送達'].map(function (n, i) {
              return '<div class="order-tracker__node' + (i === 0 ? ' is-current' : '') + '"><span class="order-tracker__dot"></span><span class="order-tracker__label">' + n + '</span></div>';
            }).join('') +
          '</div>' +
        '</div>';
      foot.innerHTML =
        '<a class="btn btn--primary btn--lg" href="my-orders.html">查看我的訂單</a>' +
        '<button class="btn btn--ghost btn--md" type="button" data-done>完成</button>';
    }

    /* ── place order ── */
    function placeOrder() {
      var items = store.getItems();
      var order = {
        type: 'goods', currency: cur(),
        items: items.map(function (it) { return { id: it.id, title: it.title, price: it.price, qty: it.qty, image: it.image }; }),
        shipping: { name: state.shipping.name, phone: state.shipping.phone, zip: state.shipping.zip, addr: state.shipping.addr, method: state.method },
        payment: { last4: (state.payment || {}).last4 || '', method: 'card' },
        subtotal: subtotal(), discount: discount(), ship: shipFee(), tax: tax(),
        promo: state.promo ? state.promo.label : null, total: total(), status: 'paid'
      };
      var rec = window.ZtorLedger ? window.ZtorLedger.addOrder(order) : Object.assign({ id: 'ZT-MOCK' }, order);
      store.clear();
      renderConfirm(rec);
    }

    /* ── render dispatch ── */
    function render() {
      if (state.view === 'address') renderAddress();
      else if (state.view === 'payment') renderPayment();
      else renderHub();
    }

    function saveAddress() {
      var form = body.querySelector('[data-checkout-form]');
      var reqs = form.querySelectorAll('[data-req]');
      for (var i = 0; i < reqs.length; i++) {
        if (!reqs[i].value.trim()) { var err = body.querySelector('[data-err]'); if (err) { err.textContent = '請填寫所有收件欄位。'; err.hidden = false; } return; }
      }
      state.shipping = { name: form.name.value.trim(), phone: form.phone.value.trim(), zip: form.zip.value.trim(), addr: form.addr.value.trim() };
      state.view = 'hub';
      render();
    }
    function applyPromo() {
      var inp = body.querySelector('[data-promo-input]');
      var msg = body.querySelector('[data-promo-msg]');
      var code = (inp.value || '').trim().toUpperCase();
      var def = PROMOS[code];
      if (!def) { if (msg) { msg.textContent = '折扣碼無效，請重新輸入。'; msg.hidden = false; msg.classList.add('is-error'); } return; }
      state.promo = { code: code, kind: def.kind, val: def.val, label: def.label };
      render();
    }

    /* Expose THIS session's handlers; the drawer body persists across sessions
       so the once-bound listeners always drive the latest mount. */
    body.__checkout = {
      atSubSheet: function () { return state.view !== 'hub'; },
      back: function () { if (state.view !== 'hub') { state.view = 'hub'; render(); } },
      go: function (v) { state.view = v; render(); },
      method: function (id) { state.method = id; renderHub(); },
      saveAddress: saveAddress,
      applyPromo: applyPromo,
      removePromo: function () { state.promo = null; render(); },
      place: placeOrder,
      done: function () { if (ctx.close) ctx.close(); }
    };
    if (!body.__checkoutWired) {
      body.__checkoutWired = true;
      var hostClick = function (e) {
        var api = body.__checkout; if (!api) return;
        var go = e.target.closest('[data-go]'); if (go) return api.go(go.getAttribute('data-go'));
        if (e.target.closest('[data-save-address]')) return api.saveAddress();
        var m = e.target.closest('[data-method]'); if (m) return api.method(m.getAttribute('data-method'));
        if (e.target.closest('[data-promo-apply]')) return api.applyPromo();
        if (e.target.closest('[data-promo-remove]')) return api.removePromo();
        var pl = e.target.closest('[data-place]'); if (pl) { if (pl.disabled) return; pl.disabled = true; pl.textContent = '處理中…'; return api.place(); }
        if (e.target.closest('[data-done]')) return api.done();
      };
      body.addEventListener('click', hostClick);
      foot.addEventListener('click', hostClick);
    }

    render();
  }

  window.ZtorCheckout = { mount: mount };
})();
