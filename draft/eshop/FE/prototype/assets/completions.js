/* ════════════════════════════════════════════════════════════════
   completions.js — per-type transaction completions (window.ZtorTicket /
   ZtorBid / ZtorRedeem), wired to the PDP CTAs.

   Each is a self-hosted ds-drawer sheet that reuses the shared substrate:
   ZtorAuth.requireLogin (login gate + resume) · ZtorPay (mock card) ·
   ZtorLedger (persist) · global cc-pay / cc-success / cc-field / checkout
   classes. MOCK only — no real charge / bid / ticket. See HANDOFF.md.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function money(cur, n) { return (cur || 'NT$') + ' ' + fmt(n); }

  /* deterministic pseudo-QR (static placeholder, never a real code) */
  function qrSvg(seed) {
    var s = String(seed || ''), h = 0, i;
    for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var n = 9, cells = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      var on = ((h >> 8) & 1) || (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
      if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg class="ticket-qr__svg" viewBox="0 0 ' + n + ' ' + n + '" aria-hidden="true">' + cells + '</svg>';
  }

  /* ── shared sheet (ds-drawer) ── */
  function openSheet(id, title) {
    var d = document.querySelector('[data-ds-drawer="' + id + '"]');
    if (!d) {
      d = document.createElement('div');
      d.className = 'ds-drawer'; d.setAttribute('data-ds-drawer', id); d.setAttribute('aria-hidden', 'true');
      d.innerHTML =
        '<div class="ds-drawer__scrim" data-ds-drawer-close></div>' +
        '<div class="ds-drawer__panel" role="dialog" aria-modal="true">' +
          '<header class="ds-drawer__head"><h2 class="ds-drawer__title" data-sheet-title></h2>' +
            '<button class="ds-drawer__close" type="button" data-ds-drawer-close aria-label="關閉"></button></header>' +
          '<div class="ds-drawer__body" data-sheet-body></div>' +
        '</div>';
      document.body.appendChild(d);
    }
    var body = d.querySelector('[data-sheet-body]');
    var titleEl = d.querySelector('[data-sheet-title]');
    if (titleEl) titleEl.textContent = title;
    function open() {
      if (d.dsDrawer) d.dsDrawer.open();
      else { d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false'); document.body.classList.add('ds-drawer-open'); }
    }
    setTimeout(open, 0);   /* let the DS registry attach el.dsDrawer to a fresh node */
    function close() {
      if (d.dsDrawer) d.dsDrawer.close();
      else { d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); document.body.classList.remove('ds-drawer-open'); }
    }
    return { drawer: d, body: body, title: titleEl, setTitle: function (t) { if (titleEl) titleEl.textContent = t; }, close: close };
  }

  function gate(action, reason) {
    if (window.ZtorAuth && window.ZtorAuth.requireLogin) window.ZtorAuth.requireLogin(action, reason);
    else action();
  }

  /* ════════ EVENT TICKET — select(done on PDP) → contact → pay → QR ════════ */
  function ticketOpen(ctx, tierIndex, qty) {
    gate(function () {
      var item = ctx.item;
      var tier = (item.ticketTiers || [])[tierIndex] || { label: '一般票', ntd: item.ntd || 0 };
      qty = Math.max(1, qty || 1);
      var price = tier.ntd || 0, totalAmt = price * qty;
      var sheet = openSheet('ztor-ticket', '購票');
      var body = sheet.body;
      var contact = { email: '' };

      function summaryHtml() {
        return '<div class="cc-pay__summary">' +
          '<div class="cc-pay__sumrow"><span>' + esc(item.name) + '</span><span></span></div>' +
          '<div class="cc-pay__sumrow"><span>' + esc(tier.label) + ' ×' + qty + '</span><span>' + money('NT$', totalAmt) + '</span></div>' +
          '<div class="cc-pay__sumrow cc-pay__sumrow--total"><span>應付金額</span><span>' + money('NT$', totalAmt) + '</span></div>' +
        '</div>';
      }
      function renderContact() {
        sheet.setTitle('購票');
        body.innerHTML = summaryHtml() +
          '<form class="checkout-form completion-form" data-contact novalidate>' +
            '<label class="cc-field"><span class="cc-field__label">電子郵件（接收電子票券）</span><input class="cc-field__input" type="email" name="email" placeholder="you@example.com" value="' + esc(contact.email) + '" data-req></label>' +
            '<p class="cc-pay__err" data-err hidden></p>' +
          '</form>' +
          '<div class="cc-stepview__foot completion-foot"><button class="btn btn--primary btn--lg" type="button" data-next>前往付款</button></div>';
        body.querySelector('[data-next]').addEventListener('click', function () {
          var em = body.querySelector('[name="email"]').value.trim();
          if (!em) { var er = body.querySelector('[data-err]'); er.textContent = '請輸入電子郵件。'; er.hidden = false; return; }
          contact.email = em; renderPay();
        });
      }
      function renderPay() {
        sheet.setTitle('付款');
        body.innerHTML = '<div data-pay></div>';
        window.ZtorPay.open({
          mount: body.querySelector('[data-pay]'), amount: totalAmt, currency: 'NT$', title: '票券付款',
          confirmLabel: '確認付款', backLabel: '返回',
          onSuccess: function (r) { finalize(r); }, onBack: function () { renderContact(); }
        });
      }
      function finalize(pay) {
        var rec = window.ZtorLedger
          ? window.ZtorLedger.addTicket({ eventId: ctx.id, eventTitle: item.name, tier: { label: tier.label, price: price }, qty: qty, currency: 'NT$' })
          : { id: 'TK-MOCK', qr: 'ZTOR-MOCK' };
        sheet.setTitle('購票完成');
        body.innerHTML =
          '<div class="cc-success completion-success">' +
            '<span class="cc-success__check ds-success-tick" aria-hidden="true"><svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg></span>' +
            '<h2 class="cc-success__title">購票成功</h2>' +
            '<p class="cc-success__msg">電子票券已寄至 ' + esc(contact.email) + '，並可在「我的票券」隨時出示。</p>' +
            '<div class="ticket-qr completion-qr">' + qrSvg(rec.qr || rec.id) + '<span class="ticket-qr__code">' + esc(rec.qr || rec.id) + '</span></div>' +
            '<div class="cc-stepview__foot completion-foot"><a class="btn btn--primary btn--lg" href="my-library.html#tickets">查看我的票券</a>' +
              '<button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>完成</button></div>' +
          '</div>';
      }
      renderContact();
    }, '登入後即可購票');
  }

  window.ZtorTicket = { open: ticketOpen };

  /* ════════ AUCTION — bid → card-verify (no charge) → leading ════════ */
  function bidOpen(ctx) {
    gate(function () {
      var item = ctx.item;
      var cur = item.bid || item.startBid || 0;
      var inc = item.bidIncrement || 1000;
      var minNext = cur + inc;
      var amount = minNext;
      var sheet = openSheet('ztor-bid', '出價');
      var body = sheet.body;

      function statusHtml() {
        return '<div class="bid-sheet__status">' +
          '<div class="bid-sheet__row"><span class="bid-sheet__k">目前最高出價</span><span class="bid-sheet__cur">' + money('NT$', cur) + '</span></div>' +
          '<div class="bid-sheet__row"><span class="bid-sheet__k">最低下一口</span><span>' + money('NT$', minNext) + '</span></div>' +
          '<div class="bid-sheet__row"><span class="bid-sheet__k">出價次數</span><span>' + (item.bidders || item.bids || 0) + ' 次</span></div>' +
        '</div>';
      }
      function renderBid() {
        sheet.setTitle('出價');
        body.innerHTML = statusHtml() +
          '<div class="bid-sheet__chips">' + [1, 2, 3].map(function (k) { var v = cur + inc * k; return '<button class="bid-sheet__chip' + (v === amount ? ' is-selected' : '') + '" type="button" data-chip="' + v + '">' + money('NT$', v) + '</button>'; }).join('') + '</div>' +
          '<form class="completion-form" data-bid-form novalidate>' +
            '<label class="cc-field"><span class="cc-field__label">自訂出價金額（NT$）</span><input class="cc-field__input" type="text" name="amount" inputmode="numeric" value="' + amount + '" data-req></label>' +
            '<p class="cc-pay__err" data-err hidden></p>' +
          '</form>' +
          '<p class="bid-sheet__note">出價即同意：得標後將以此金額付款；未得標不扣款。出價前需驗證信用卡。</p>' +
          '<div class="completion-foot"><button class="btn btn--primary btn--lg" type="button" data-next>驗證卡片並出價</button></div>';
        body.querySelectorAll('[data-chip]').forEach(function (c) { c.addEventListener('click', function () { amount = +c.getAttribute('data-chip'); body.querySelector('[name="amount"]').value = amount; body.querySelectorAll('.bid-sheet__chip').forEach(function (x) { x.classList.toggle('is-selected', x === c); }); }); });
        body.querySelector('[name="amount"]').addEventListener('input', function (e) { amount = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0; body.querySelectorAll('.bid-sheet__chip').forEach(function (x) { x.classList.remove('is-selected'); }); });
        body.querySelector('[data-next]').addEventListener('click', function () {
          if (amount < minNext) { var er = body.querySelector('[data-err]'); er.textContent = '出價需至少 ' + money('NT$', minNext) + '。'; er.hidden = false; return; }
          renderVerify();
        });
      }
      function renderVerify() {
        sheet.setTitle('驗證卡片');
        body.innerHTML = '<div data-pay></div>';
        window.ZtorPay.open({ mount: body.querySelector('[data-pay]'), amount: amount, currency: 'NT$', title: '競標', mode: 'verify', confirmLabel: '驗證卡片並出價', backLabel: '返回', onSuccess: function (r) { finalize(r); }, onBack: function () { renderBid(); } });
      }
      function finalize(pay) {
        if (window.ZtorLedger) window.ZtorLedger.addBid({ auctionId: ctx.id, title: item.name, amount: amount, currency: 'NT$', status: 'leading', cardLast4: (pay || {}).last4 || '' });
        var curEl = document.querySelector('[data-cur-bid]'); if (curEl) { curEl.setAttribute('data-cur-bid', amount); curEl.textContent = 'NT$ ' + fmt(amount); }
        var bEl = document.querySelector('[data-bidders]'); if (bEl) { var nb = (parseInt(bEl.textContent, 10) || 0) + 1; bEl.textContent = nb + ' 次出價'; }
        item.bid = amount;
        sheet.setTitle('出價完成');
        body.innerHTML = '<div class="cc-success completion-success">' +
          '<span class="cc-success__check ds-success-tick" aria-hidden="true"><svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg></span>' +
          '<h2 class="cc-success__title">出價成功 · 你目前是最高出價者</h2>' +
          '<p class="cc-success__msg">出價 ' + money('NT$', amount) + ' 已送出。若被超越我們會通知你；未得標不扣款。</p>' +
          '<div class="completion-foot"><a class="btn btn--primary btn--lg" href="my-library.html#bids">查看我的競標</a><button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>完成</button></div>' +
        '</div>';
      }
      renderBid();
    }, '登入後即可出價');
  }

  /* won → pay & claim (called from my-bids when a leading bid resolves to 'won') */
  function bidClaim(bid) {
    gate(function () {
      var amount = bid.amount || 0;
      var premium = Math.round(amount * 0.1);   // 10% 服務費
      var ship = 220;
      var total = amount + premium + ship;
      var sheet = openSheet('ztor-claim', '付款領取');
      var body = sheet.body;
      function renderReview() {
        sheet.setTitle('付款領取');
        body.innerHTML =
          '<div class="bid-sheet__status"><div class="bid-sheet__row"><span class="bid-sheet__k">' + esc(bid.title || '得標拍品') + '</span><span class="status-tag status-tag--green">已得標</span></div></div>' +
          '<div class="pop-sheet__row"><span>得標金額</span><span>' + money('NT$', amount) + '</span></div>' +
          '<div class="pop-sheet__row"><span>服務費（10%）</span><span>' + money('NT$', premium) + '</span></div>' +
          '<div class="pop-sheet__row"><span>運送</span><span>' + money('NT$', ship) + '</span></div>' +
          '<div class="pop-sheet__row pop-sheet__row--total"><span>應付總計</span><span>' + money('NT$', total) + '</span></div>' +
          '<div class="completion-foot"><button class="btn btn--primary btn--lg" type="button" data-pay-now>前往付款</button><button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>稍後</button></div>';
        body.querySelector('[data-pay-now]').addEventListener('click', renderPay);
      }
      function renderPay() {
        sheet.setTitle('付款');
        body.innerHTML = '<div data-pay></div>';
        window.ZtorPay.open({ mount: body.querySelector('[data-pay]'), amount: total, currency: 'NT$', title: '得標付款', confirmLabel: '確認付款', backLabel: '返回', onSuccess: function (r) { finalize(r); }, onBack: renderReview });
      }
      function finalize() {
        if (window.ZtorLedger) window.ZtorLedger.updateBid(bid.id, { status: 'claimed' });
        sheet.setTitle('領取完成');
        body.innerHTML = '<div class="cc-success completion-success">' +
          '<span class="cc-success__check ds-success-tick" aria-hidden="true"><svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg></span>' +
          '<h2 class="cc-success__title">付款完成 · 已安排寄送</h2>' +
          '<p class="cc-success__msg">「' + esc(bid.title || '') + '」已付款領取，我們將盡快安排寄送與保險。</p>' +
          '<div class="completion-foot"><a class="btn btn--primary btn--lg" href="my-library.html#bids">查看我的競標</a><button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>完成</button></div>' +
        '</div>';
      }
      renderReview();
    }, '登入後即可付款');
  }
  window.ZtorBid = { open: bidOpen, claim: bidClaim };

  /* ════════ POPCORN — redeem / rent · top-up (insufficient → resume) ════════ */
  var POP_PACKS = [{ pop: 260, ntd: 32 }, { pop: 1250, ntd: 152 }, { pop: 3320, ntd: 392 }];
  function redeemOpen(ctx) {
    gate(function () {
      var item = ctx.item;
      var cost = item.popPrice || item.pop || 0;
      var isRent = !!item.rentDays;
      var sheet = openSheet('ztor-redeem', isRent ? '租借' : '兌換');
      var body = sheet.body;
      function bal() { return (window.ZtorLedger && window.ZtorLedger.popcorn) ? window.ZtorLedger.popcorn.balance() : 8400; }

      function renderSpend() {
        var b = bal(), after = b - cost, insufficient = after < 0;
        sheet.setTitle(isRent ? '租借' : '兌換');
        body.innerHTML =
          '<div class="pop-sheet__balance"><span>你的爆米花餘額</span><span class="pop-sheet__balance-v">' + fmt(b) + ' 顆</span></div>' +
          '<div class="pop-sheet__row"><span>' + esc(item.name) + '</span><span>' + (isRent ? '租借 ' + item.rentDays + ' 天' : '兌換') + '</span></div>' +
          '<div class="pop-sheet__row"><span>花費</span><span>' + fmt(cost) + ' 顆</span></div>' +
          '<div class="pop-sheet__row pop-sheet__row--total"><span>' + (isRent ? '租借後餘額' : '兌換後餘額') + '</span><span>' + fmt(Math.max(0, after)) + ' 顆</span></div>' +
          (item.redeemNote ? '<p class="bid-sheet__note">' + esc(item.redeemNote) + '</p>' : '') +
          (insufficient ? '<div class="pop-sheet__insufficient">爆米花不足，還差 ' + fmt(-after) + ' 顆。</div>' : '') +
          '<div class="completion-foot">' +
            (insufficient
              ? '<button class="btn btn--primary btn--lg" type="button" data-topup>立即儲值</button>'
              : '<button class="btn btn--primary btn--lg" type="button" data-confirm>確認' + (isRent ? '租借' : '兌換') + '</button>') +
            '<button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>取消</button>' +
          '</div>';
        var cf = body.querySelector('[data-confirm]'); if (cf) cf.addEventListener('click', doSpend);
        var tu = body.querySelector('[data-topup]'); if (tu) tu.addEventListener('click', renderTopup);
      }
      function doSpend() {
        var ok = window.ZtorLedger && window.ZtorLedger.popcorn.spend(cost, isRent ? 'rent' : 'redeem', ctx.id);
        if (!ok) { renderSpend(); return; }
        window.ZtorLedger.addRental({ itemId: ctx.id, title: item.name, kind: isRent ? 'rent' : 'redeem', popcornSpent: cost, rentDays: item.rentDays || null });
        document.dispatchEvent(new CustomEvent('popcorn:change', { detail: { balance: bal() } }));
        sheet.setTitle(isRent ? '租借成功' : '兌換成功');
        body.innerHTML = '<div class="cc-success completion-success">' +
          '<span class="cc-success__check ds-success-tick" aria-hidden="true"><svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg></span>' +
          '<h2 class="cc-success__title">' + (isRent ? '已解鎖' : '兌換成功') + '</h2>' +
          '<p class="cc-success__msg">' + (isRent ? '已租借「' + esc(item.name) + '」' + item.rentDays + ' 天。' : '已兌換「' + esc(item.name) + '」，電子券將寄至你的帳戶。') + '目前餘額 ' + fmt(bal()) + ' 顆。</p>' +
          '<div class="completion-foot"><a class="btn btn--primary btn--lg" href="my-library.html#rentals">查看我的兌換／租借</a><button class="btn btn--ghost btn--md" type="button" data-ds-drawer-close>完成</button></div>' +
        '</div>';
      }
      function renderTopup() {
        var b = bal(), need = cost - b;
        var sel = POP_PACKS.filter(function (p) { return p.pop >= need; })[0] || POP_PACKS[POP_PACKS.length - 1];
        var chosen = { pop: sel.pop, ntd: sel.ntd };
        sheet.setTitle('儲值爆米花');
        body.innerHTML =
          '<div class="pop-sheet__balance"><span>目前餘額</span><span class="pop-sheet__balance-v">' + fmt(b) + ' 顆</span></div>' +
          '<div class="pop-sheet__insufficient">兌換需要 ' + fmt(cost) + ' 顆，你還差 ' + fmt(need) + ' 顆。選擇儲值方案：</div>' +
          '<div class="pop-sheet__packages">' + POP_PACKS.map(function (p) { return '<button class="pop-sheet__package' + (p === sel ? ' is-selected' : '') + '" type="button" data-pack="' + p.pop + '" data-price="' + p.ntd + '"><span class="pop-sheet__package-pop">' + fmt(p.pop) + ' 顆</span><span class="pop-sheet__package-price">NT$ ' + p.ntd + '</span></button>'; }).join('') + '</div>' +
          '<div class="completion-foot"><button class="btn btn--primary btn--lg" type="button" data-topup-pay>前往付款</button><button class="btn btn--ghost btn--md" type="button" data-back>返回</button></div>';
        body.querySelectorAll('[data-pack]').forEach(function (p) { p.addEventListener('click', function () { chosen = { pop: +p.getAttribute('data-pack'), ntd: +p.getAttribute('data-price') }; body.querySelectorAll('.pop-sheet__package').forEach(function (x) { x.classList.toggle('is-selected', x === p); }); }); });
        body.querySelector('[data-back]').addEventListener('click', renderSpend);
        body.querySelector('[data-topup-pay]').addEventListener('click', function () {
          sheet.setTitle('儲值付款');
          body.innerHTML = '<div data-pay></div>';
          window.ZtorPay.open({ mount: body.querySelector('[data-pay]'), amount: chosen.ntd, currency: 'NT$', title: '爆米花儲值', confirmLabel: '確認付款', backLabel: '返回',
            onSuccess: function () { if (window.ZtorLedger) window.ZtorLedger.popcorn.topup(chosen.pop); renderSpend(); },
            onBack: function () { renderTopup(); } });
        });
      }
      renderSpend();
    }, '登入後即可兌換');
  }
  window.ZtorRedeem = { open: redeemOpen };
})();
