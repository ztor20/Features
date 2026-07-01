/* ════════════════════════════════════════════════════════════════
   mock-pay.js — the SINGLE mock-payment module (window.ZtorPay).

   Lifts the card form + validation + Stripe-style test-card outcomes from
   cocreate.js (cc-pay). Reuses the GLOBAL .cc-pay / .cc-field classes
   (cocreate-detail.css, already in the bundle) — no new CSS. Renders INTO a
   caller-supplied mount node (checkout step / ticket / auction / top-up).

   MOCK — never a real charge. Test cards: …0002 declined · …3220/…3155 SCA.
   mode:'verify' = capture-no-charge (auction bid). See HANDOFF.md (Stripe stub).
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZtorPay) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }

  function payField(name, label, type, ph) {
    return '<label class="cc-field"><span class="cc-field__label">' + esc(label) + '</span>' +
      '<input class="cc-field__input" type="' + type + '" name="' + name + '" placeholder="' + esc(ph) + '" data-req autocomplete="off"></label>';
  }

  function formHtml(o) {
    var verify = o.mode === 'verify';
    var amountStr = (o.currency || 'NT$') + ' ' + fmt(o.amount || 0);
    var confirmLabel = o.confirmLabel || (verify ? '驗證卡片' : '確認付款');
    return '<div class="cc-pay" data-ztorpay>' +
      '<div class="cc-pay__summary">' +
        '<div class="cc-pay__sumrow"><span>' + esc(o.title || '訂單') + '</span><span></span></div>' +
        '<div class="cc-pay__sumrow cc-pay__sumrow--total"><span>' + (verify ? '驗證金額（未得標不扣款）' : '應付金額') + '</span><span>' + amountStr + '</span></div>' +
      '</div>' +
      '<div class="cc-pay__express"><button type="button" class="cc-pay__express-btn" data-cc-express disabled> Pay</button>' +
        '<button type="button" class="cc-pay__express-btn" data-cc-express disabled>G Pay</button></div>' +
      '<div class="cc-pay__or"><span>或使用信用卡 / 扣帳卡</span></div>' +
      '<form class="cc-pay__form" data-cc-pay-form novalidate>' +
        payField('name', '持卡人姓名', 'text', '王小明') +
        payField('card', '卡號', 'text', '1234 1234 1234 1234') +
        '<div class="cc-pay__grid2">' + payField('exp', '有效期限 (MM/YY)', 'text', '01/30') + payField('cvc', '安全碼', 'text', 'CVC') + '</div>' +
        '<label class="cc-pay__save"><input type="checkbox" checked> 儲存卡片以便日後使用</label>' +
        '<p class="cc-pay__err" data-cc-pay-err hidden></p>' +
        '<div class="cc-pay__secure"><span class="cc-pay__lock" aria-hidden="true"></span>SSL 安全付款 · 卡片由 Stripe 加密處理（示範）' + (verify ? '；現在僅驗證卡片，未得標不扣款。' : '') + '</div>' +
        '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="submit" data-cc-pay>' + esc(confirmLabel) + '</button>' +
          (o.backLabel === false ? '' : '<button class="btn btn--ghost btn--md" type="button" data-cc-pay-back>' + esc(o.backLabel || '返回') + '</button>') +
        '</div>' +
      '</form>' +
    '</div>';
  }

  /* validation — kept identical to cocreate.js validatePay */
  function validate(form) {
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
  /* test-card outcome — identical to cocreate.js payOutcome */
  function outcome(card) { var d = (card || '').replace(/\D/g, ''); if (/0002$/.test(d)) return 'declined'; if (/3220$/.test(d) || /3155$/.test(d)) return 'sca'; return 'ok'; }
  function last4(card) { return (card || '').replace(/\D/g, '').slice(-4); }

  function scaHtml() {
    return '<div class="cc-pay" data-ztorpay-sca>' +
      '<div class="cc-callout cc-callout--info"><span class="cc-callout__icon" aria-hidden="true"></span>你的發卡銀行要求額外驗證，請完成驗證以確認付款（示範）。</div>' +
      '<div class="cc-sca"><div class="cc-sca__bank">Ztor Bank · 3D Secure</div><div class="cc-sca__row">一次性驗證碼已發送至 •••• 8888</div></div>' +
      '<div class="cc-stepview__foot"><button class="btn btn--primary btn--lg" type="button" data-cc-sca-ok>完成驗證</button>' +
        '<button class="btn btn--ghost btn--md" type="button" data-cc-sca-cancel>取消</button></div>' +
    '</div>';
  }

  function render(node, o) {
    node.innerHTML = formHtml(o);
    var form = node.querySelector('[data-cc-pay-form]');
    var err = node.querySelector('[data-cc-pay-err]');
    function showErr(msg) { if (err) { err.textContent = msg; err.hidden = false; } }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = validate(form);
      if (msg) { showErr(msg); return; }
      var cardVal = (form.querySelector('[name="card"]') || {}).value || '';
      var oc = outcome(cardVal);
      if (oc === 'declined') { showErr('卡片遭拒，請改用其他卡片（測試：卡號尾數 0002）。'); if (o.onFail) o.onFail('declined'); return; }
      if (oc === 'sca') {
        node.innerHTML = scaHtml();
        node.querySelector('[data-cc-sca-ok]').addEventListener('click', function () { if (o.onSuccess) o.onSuccess({ last4: last4(cardVal), outcome: 'sca', mode: o.mode || 'charge', ts: Date.now() }); });
        node.querySelector('[data-cc-sca-cancel]').addEventListener('click', function () { render(node, o); });
        return;
      }
      if (o.onSuccess) o.onSuccess({ last4: last4(cardVal), outcome: 'ok', mode: o.mode || 'charge', ts: Date.now() });
    });
    var back = node.querySelector('[data-cc-pay-back]');
    if (back) back.addEventListener('click', function () { if (o.onBack) o.onBack(); });
  }

  function open(o) {
    o = o || {};
    if (!o.mount) { if (window.console) console.warn('ZtorPay.open requires a mount node'); return; }
    render(o.mount, o);
  }

  window.ZtorPay = { open: open, _validate: validate, _outcome: outcome };
})();
