/* popcorn-balance.js — bind the popcorn balance display to ZtorLedger.popcorn.
   Replaces the hardcoded value on popcorn.html; updates live on 'popcorn:change'
   (top-up / spend from the redeem sheets). MOCK ledger — see HANDOFF.md. */
(function () {
  'use strict';
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function paint() {
    if (!(window.ZtorLedger && window.ZtorLedger.popcorn)) return;
    var bal = window.ZtorLedger.popcorn.balance();
    document.querySelectorAll('.popcorn-balance-card__value, [data-popcorn-balance]').forEach(function (el) { el.textContent = fmt(bal); });
  }
  function init() { paint(); document.addEventListener('popcorn:change', paint); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
