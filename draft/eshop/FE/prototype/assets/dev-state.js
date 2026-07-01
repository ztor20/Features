/* ════════════════════════════════════════════════════════════════
   dev-state.js — DEV-ONLY state simulator (auth · saved address · saved card).

   Replaces the per-page inline auth toggle. Renders a 3-chip dev bar that
   drives body[data-auth | data-has-address | data-has-card] + localStorage,
   so checkout (and anything reading these) can simulate every returning-user
   state: logged-out · logged-in-empty · has-address-only · has-card-only ·
   full express. Restored before first paint = no flash.

   出貨前移除（this file + the [data-dev-only] markup + 13-dev-state-toggle.css）.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var body = document.body;

  /* attr = camelCase dataset key → data-auth / data-has-address / data-has-card */
  var CHIPS = [
    { key: 'ztor-dev-auth',    attr: 'auth',       on: 'logged-in', off: 'logged-out', onLabel: '已登入', offLabel: '未登入' },
    { key: 'ztor-dev-address', attr: 'hasAddress', on: 'true',      off: 'false',      onLabel: '有地址', offLabel: '無地址' },
    { key: 'ztor-dev-card',    attr: 'hasCard',    on: 'true',      off: 'false',      onLabel: '有卡片', offLabel: '無卡片' }
  ];

  /* Restore from localStorage before paint; fall back to whatever the page
     authored (data-auth) or the chip's off value. */
  CHIPS.forEach(function (c) {
    try {
      var v = localStorage.getItem(c.key);
      if (v === c.on || v === c.off) body.dataset[c.attr] = v;
    } catch (e) {}
    if (body.dataset[c.attr] == null) body.dataset[c.attr] = c.off;
  });

  function render() {
    var bar = document.getElementById('devStateBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'devStateBar';
      bar.className = 'dev-bar';
      bar.setAttribute('data-dev-only', '');
      /* Upgrade the legacy single button in place if present, else append. */
      var legacy = document.getElementById('devAuthToggle');
      if (legacy && legacy.parentNode) legacy.parentNode.replaceChild(bar, legacy);
      else body.appendChild(bar);
    }
    bar.innerHTML = CHIPS.map(function (c) {
      var on = body.dataset[c.attr] === c.on;
      return '<button type="button" class="dev-chip' + (on ? ' is-on' : '') + '" data-dev-chip="' + c.key + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        '<span class="dev-chip__dot" aria-hidden="true"></span>' + (on ? c.onLabel : c.offLabel) +
      '</button>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-dev-chip]');
    if (!chip) return;
    var key = chip.getAttribute('data-dev-chip');
    var c = CHIPS.filter(function (x) { return x.key === key; })[0];
    if (!c) return;
    var next = body.dataset[c.attr] === c.on ? c.off : c.on;
    body.dataset[c.attr] = next;
    try { localStorage.setItem(c.key, next); } catch (e2) {}
    /* Logging out clears the saved-profile simulation — you can't have a saved
       address/card without an account. Keeps the dev states coherent. */
    if (c.attr === 'auth' && next === 'logged-out') {
      ['ztor-dev-address', 'ztor-dev-card'].forEach(function (k) {
        var cc = CHIPS.filter(function (x) { return x.key === k; })[0];
        body.dataset[cc.attr] = cc.off;
        try { localStorage.setItem(k, cc.off); } catch (e3) {}
      });
    }
    render();
  });

  render();
})();
