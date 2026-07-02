/* ════════════════════════════════════════════════════════════════
   my-orders.js — the unified "我的訂單" surface (my-library.html).

   Reads window.ZtorLedger and renders orders / tickets / bids / rentals into
   #ordersPanel, switched by the glass-tabs. Re-renders live on 'ledger:change'.
   Reuses status-tag + ds-empty + btn; cards/tracker/QR in 48-order-tracker.css.
   MOCK data (localStorage) — see HANDOFF.md.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function money(cur, n) { return (cur || 'NT$') + ' ' + fmt(n); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateStr(ts) { var d = new Date(ts); return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()); }

  var LABEL = { paid: '已付款', placed: '已下單', shipped: '可取貨', done: '已取貨', valid: '有效', used: '已使用', refunded: '已退款', leading: '最高出價', outbid: '已被超越', won: '已得標', claimed: '已付款領取', active: '租借中', redeemed: '已兌換', expired: '已過期' };
  var TAG = { paid: 'status-tag--green', valid: 'status-tag--green', leading: 'status-tag--green', won: 'status-tag--green', active: 'status-tag--green', redeemed: 'status-tag--green', claimed: 'status-tag--green', outbid: 'status-tag--yellow', shipped: 'status-tag--yellow', placed: 'status-tag--yellow', used: 'status-tag--ended', refunded: 'status-tag--ended', expired: 'status-tag--ended', done: 'status-tag--ended' };
  function tag(status) { return '<span class="status-tag ' + (TAG[status] || '') + '">' + esc(LABEL[status] || status) + '</span>'; }

  function emptyHtml(msg) {
    return '<div class="ds-empty orders-empty"><span class="ds-empty__title">' + esc(msg) + '</span>' +
      '<a class="btn btn--ghost btn--md" href="shop.html">去商店逛逛</a></div>';
  }

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

  function orderCard(o) {
    var thumbs = (o.items || []).slice(0, 4).map(function (it) { return '<span class="orders-card__thumb">' + (it.image ? '<img src="' + esc(it.image) + '" alt="" loading="lazy">' : '') + '</span>'; }).join('');
    var qty = (o.items || []).reduce(function (s, it) { return s + (it.qty || 1); }, 0);
    var nodes = ['已下單', '備貨中', '可取貨', '已取貨'];
    var idx = o.status === 'done' ? 3 : (o.status === 'shipped' ? 2 : (o.status === 'paid' ? 1 : 0));
    var track = '<div class="order-tracker order-tracker--mini">' + nodes.map(function (nm, i) {
      return '<div class="order-tracker__node' + (i <= idx ? ' is-done' : '') + (i === idx ? ' is-current' : '') + '"><span class="order-tracker__dot"></span><span class="order-tracker__label">' + nm + '</span></div>';
    }).join('') + '</div>';
    return '<article class="orders-card">' +
      '<div class="orders-card__head"><span class="orders-card__id">訂單 ' + esc(o.id) + '</span><span class="orders-card__date">' + dateStr(o.ts) + '</span></div>' +
      '<div class="orders-card__thumbs">' + thumbs + '<span class="orders-card__count">共 ' + qty + ' 件</span></div>' +
      track +
      (o.status === 'done' ? '' :
        '<div class="pickup-qr pickup-qr--sm">' + qrSvg('ZTOR-PICKUP-' + o.id) +
          '<div class="pickup-qr__meta">' +
            '<p class="pickup-qr__title">取貨 QR</p>' +
            '<p class="pickup-qr__line">Ztor 門市 · 信義區松壽路 12 號 2F · 每日 12:00–21:00</p>' +
            '<p class="pickup-qr__note">到店出示核銷領取</p>' +
          '</div>' +
        '</div>') +
      '<div class="orders-card__foot">' + tag(o.status) + '<span class="orders-card__total">' + money(o.currency, o.total) + '</span></div>' +
    '</article>';
  }

  function ticketCard(t) {
    return '<article class="orders-card orders-card--ticket">' +
      '<div class="orders-card__qr ticket-qr">' + qrSvg(t.qr || t.id) + '<span class="ticket-qr__code">' + esc(t.qr || t.id) + '</span></div>' +
      '<div class="orders-card__main">' +
        '<div class="orders-card__head"><span class="orders-card__title">' + esc(t.eventTitle || '活動票券') + '</span></div>' +
        '<span class="orders-card__meta">' + esc((t.tier && t.tier.label) || '') + ' · ' + (t.qty || 1) + ' 張 · ' + dateStr(t.ts) + '</span>' +
        '<div class="orders-card__foot">' + tag(t.status) + '<span class="orders-card__total">' + money(t.currency, (t.tier && t.tier.price ? t.tier.price * (t.qty || 1) : 0)) + '</span></div>' +
      '</div>' +
    '</article>';
  }

  function bidCard(b) {
    var actions = tag(b.status);
    if (b.status === 'outbid') actions += '<button class="btn btn--yellow-ghost btn--sm" type="button" data-rebid="' + esc(b.auctionId || '') + '">提高出價</button>';
    else if (b.status === 'won') actions += '<button class="btn btn--primary btn--sm" type="button" data-claim="' + esc(b.id) + '">付款領取</button>';
    else if (b.status === 'leading') actions += '<span class="orders-card__sim"><button class="btn btn--ghost btn--sm" type="button" data-sim="outbid" data-bid="' + esc(b.id) + '">模擬被超越</button><button class="btn btn--ghost btn--sm" type="button" data-sim="won" data-bid="' + esc(b.id) + '">模擬得標</button></span>';
    return '<article class="orders-card orders-card--bid">' +
      '<div class="orders-card__head"><span class="orders-card__title">' + esc(b.title || '競標') + '</span><span class="orders-card__date">' + dateStr(b.ts) + '</span></div>' +
      '<span class="orders-card__meta">你的出價 ' + money(b.currency, b.amount) + (b.cardLast4 ? ' · 卡片 •••• ' + esc(b.cardLast4) : '') + '</span>' +
      '<div class="orders-card__foot">' + actions + '</div>' +
    '</article>';
  }

  function rentalCard(r) {
    var kind = r.kind === 'rent' ? '租借' : '兌換';
    return '<article class="orders-card orders-card--rental">' +
      '<div class="orders-card__head"><span class="orders-card__title">' + esc(r.title || '') + '</span><span class="orders-card__date">' + dateStr(r.ts) + '</span></div>' +
      '<span class="orders-card__meta">' + kind + ' · 花費 ' + fmt(r.popcornSpent || 0) + ' 顆爆米花' + (r.rentDays ? ' · ' + r.rentDays + ' 天' : '') + '</span>' +
      '<div class="orders-card__foot">' + tag(r.status) + '</div>' +
    '</article>';
  }

  function renderTab(panel, tab) {
    var L = window.ZtorLedger;
    if (!L) { panel.innerHTML = emptyHtml('購物模組尚未載入。'); return; }
    var html, arr;
    if (tab === 'tickets') { arr = L.getTickets(); html = arr.length ? arr.map(ticketCard).join('') : emptyHtml('你還沒有票券'); }
    else if (tab === 'bids') { arr = L.getBids(); html = arr.length ? arr.map(bidCard).join('') : emptyHtml('你還沒有競標紀錄'); }
    else if (tab === 'rentals') { arr = L.getRentals(); html = arr.length ? arr.map(rentalCard).join('') : emptyHtml('你還沒有兌換或租借'); }
    else { arr = L.getOrders(); html = arr.length ? arr.map(orderCard).join('') : emptyHtml('你還沒有訂單'); }
    panel.innerHTML = '<div class="orders-list">' + html + '</div>';
  }

  function init() {
    var panel = document.getElementById('ordersPanel');
    var tabs = document.querySelector('[data-orders-tabs]');
    if (!panel || !tabs) return;
    var current = 'orders';
    var hash = (location.hash || '').replace('#', '');
    if (['tickets', 'bids', 'rentals'].indexOf(hash) >= 0) current = hash;
    if (current !== 'orders') {
      tabs.querySelectorAll('.glass-tabs__item').forEach(function (x) { x.classList.toggle('glass-tabs__item--active', x.getAttribute('data-orders-tab') === current); });
    }
    renderTab(panel, current);
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-orders-tab]'); if (!b) return;
      current = b.getAttribute('data-orders-tab');
      tabs.querySelectorAll('.glass-tabs__item').forEach(function (x) { x.classList.toggle('glass-tabs__item--active', x === b); });
      renderTab(panel, current);
    });
    /* bid-card actions: simulate (demo) win/outbid · claim · re-bid */
    panel.addEventListener('click', function (e) {
      var sim = e.target.closest('[data-sim]');
      if (sim && window.ZtorLedger) { window.ZtorLedger.updateBid(sim.getAttribute('data-bid'), { status: sim.getAttribute('data-sim') }); return; }
      var claim = e.target.closest('[data-claim]');
      if (claim) {
        var id = claim.getAttribute('data-claim');
        var b = (window.ZtorLedger ? window.ZtorLedger.getBids() : []).filter(function (x) { return x.id === id; })[0];
        if (b && window.ZtorBid && window.ZtorBid.claim) window.ZtorBid.claim(b);
        return;
      }
      var rebid = e.target.closest('[data-rebid]');
      if (rebid) { var aid = rebid.getAttribute('data-rebid'); if (aid) location.href = 'shop-item.html?id=' + encodeURIComponent(aid); return; }
    });
    document.addEventListener('ledger:change', function () { renderTab(panel, current); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
