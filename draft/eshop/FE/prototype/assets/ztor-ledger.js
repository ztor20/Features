/* ════════════════════════════════════════════════════════════════
   ztor-ledger.js — MOCK persistence for the shop completions.

   Orders · tickets · bids · rentals/redemptions · popcorn balance, in
   localStorage (versioned, try/catch-guarded, cross-tab 'storage' sync).
   Mirrors the ZtorCart Store pattern. Emits 'ledger:change' and, for the
   wallet, 'popcorn:change' so balance surfaces re-render live.

   ALL MOCK — no server of record. Real persistence is a backend stub
   (see HANDOFF.md). window.ZtorLedger is the single owner.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.ZtorLedger) return;

  var KEYS = {
    orders:  'ztor_orders_v1',
    tickets: 'ztor_tickets_v1',
    bids:    'ztor_bids_v1',
    rentals: 'ztor_rentals_v1',
    popcorn: 'ztor_popcorn_v1'
  };
  var DEFAULT_POP = 8400;   /* mirrors the popcorn PDP mock balance */

  function read(key, fb) { try { var r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch (e) {} return fb; }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function emit(name, detail) { try { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) {} }
  function list(key) { var v = read(key, []); return Array.isArray(v) ? v : []; }
  function pushTo(key, rec) { var a = list(key); a.unshift(rec); write(key, a); return rec; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function genId(prefix) {
    var d = new Date();
    var ymd = pad(d.getFullYear() % 100) + pad(d.getMonth() + 1) + pad(d.getDate());
    return (prefix || 'ZT') + ymd + '-' + String(1000 + Math.floor(Math.random() * 9000));
  }
  function ts() { return Date.now(); }

  /* ── orders ── */
  function addOrder(o) {
    var rec = Object.assign({ id: genId('ZT'), ts: ts(), status: 'paid', type: 'goods' }, o);
    pushTo(KEYS.orders, rec); emit('ledger:change', { kind: 'order', id: rec.id }); return rec;
  }
  function getOrders() { return list(KEYS.orders); }

  /* ── tickets ── */
  function addTicket(t) {
    var rec = Object.assign({ id: genId('TK'), ts: ts(), status: 'valid', qr: 'ZTOR-' + genId('Q') }, t);
    pushTo(KEYS.tickets, rec); emit('ledger:change', { kind: 'ticket', id: rec.id }); return rec;
  }
  function getTickets() { return list(KEYS.tickets); }

  /* ── bids ── */
  function addBid(b) {
    var rec = Object.assign({ id: genId('BD'), ts: ts(), status: 'leading' }, b);
    pushTo(KEYS.bids, rec); emit('ledger:change', { kind: 'bid', id: rec.id }); return rec;
  }
  function updateBid(id, patch) {
    var a = list(KEYS.bids), changed = false;
    a = a.map(function (b) { if (b.id === id) { changed = true; return Object.assign({}, b, patch); } return b; });
    if (changed) { write(KEYS.bids, a); emit('ledger:change', { kind: 'bid', id: id }); }
    return changed;
  }
  function getBids() { return list(KEYS.bids); }

  /* ── rentals / redemptions ── */
  function addRental(r) {
    var rec = Object.assign({ id: genId('RN'), ts: ts(), status: (r && r.kind === 'rent' ? 'active' : 'redeemed') }, r);
    pushTo(KEYS.rentals, rec); emit('ledger:change', { kind: 'rental', id: rec.id }); return rec;
  }
  function getRentals() { return list(KEYS.rentals); }

  function allByState() { return { orders: getOrders(), tickets: getTickets(), bids: getBids(), rentals: getRentals() }; }

  /* ── popcorn wallet ── */
  function popState() {
    var s = read(KEYS.popcorn, null);
    if (!s || typeof s.balance !== 'number') s = { balance: DEFAULT_POP, ledger: [] };
    if (!Array.isArray(s.ledger)) s.ledger = [];
    return s;
  }
  var popcorn = {
    balance: function () { return popState().balance; },
    spend: function (n, reason, ref) {
      var s = popState(); n = Math.max(0, n | 0);
      if (n > s.balance) return false;
      s.balance -= n; s.ledger.unshift({ ts: ts(), delta: -n, reason: reason || 'spend', ref: ref || '' });
      write(KEYS.popcorn, s); emit('popcorn:change', { balance: s.balance }); return true;
    },
    topup: function (n) {
      var s = popState(); n = Math.max(0, n | 0);
      s.balance += n; s.ledger.unshift({ ts: ts(), delta: n, reason: 'topup', ref: '' });
      write(KEYS.popcorn, s); emit('popcorn:change', { balance: s.balance }); return s.balance;
    },
    setBalance: function (n) { var s = popState(); s.balance = Math.max(0, n | 0); write(KEYS.popcorn, s); emit('popcorn:change', { balance: s.balance }); },
    history: function () { return popState().ledger; }
  };

  /* cross-tab sync */
  window.addEventListener('storage', function (e) {
    if (!e.key) return;
    if (e.key === KEYS.popcorn) emit('popcorn:change', { balance: popcorn.balance() });
    else { for (var k in KEYS) { if (KEYS[k] === e.key) { emit('ledger:change', {}); break; } } }
  });

  window.ZtorLedger = {
    addOrder: addOrder, getOrders: getOrders,
    addTicket: addTicket, getTickets: getTickets,
    addBid: addBid, updateBid: updateBid, getBids: getBids,
    addRental: addRental, getRentals: getRentals,
    allByState: allByState, popcorn: popcorn, genId: genId, KEYS: KEYS
  };
})();
