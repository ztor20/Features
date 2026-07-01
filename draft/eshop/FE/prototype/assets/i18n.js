/* ────────────────────────────────────────────────────────────
   i18n.js — Ztor bilingual runtime (framework-free, vanilla).

   Model: source-text dictionary. The Chinese text already in the
   HTML is the source/default (zh-Hant). locales/en.json maps each
   trimmed source string → English:  { "焦點": "Spotlight", … }.

   • Default language = zh-Hant (the markup as authored).
   • Toggle to "en" swaps matching text nodes + translatable
     attributes (placeholder / aria-label / title / alt / data-tip).
   • Choice persists in localStorage; restored before first paint.
   • A MutationObserver re-translates nodes injected at runtime
     (shop-render.js / cart.js) so dynamic content stays localized.
   • Missing key → original Chinese is kept (safe fallback).
   • For the rare phrase that needs different English in different
     places, add data-i18n="explicit key" on the element and a
     matching entry in en.json — it overrides the source-text match.

   PERFORMANCE — English-nav FCP:
   • en.json is cached in localStorage under key 'ztor-i18n-en'.
   • On every load, if a cached dict exists we apply it SYNCHRONOUSLY
     (no network wait) and reveal immediately — FCP is no longer gated
     on the network. A background fetch then refreshes the cache for
     the next navigation.
   • If no cache (first-ever English visit): fetch, apply, reveal.
     The inline FOUC guard failsafe (in each page <head>) is capped at
     300 ms, so the blank is bounded even if the fetch is slow.
   • Chinese (default) is never gated — no dict needed, source text
     is already correct.

   Pure HTML/CSS handoff: pages only need <script src="assets/i18n.js"
   defer></script>. No build step, no framework.
   ──────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var KEY      = 'ztor-lang';
  var CACHE_KEY = 'ztor-i18n-en';          // localStorage key for the en.json dict
  var ATTRS    = ['placeholder', 'aria-label', 'title', 'alt', 'data-tip', 'aria-placeholder'];
  /* Only elements that actually carry a translatable attribute — replaces a
     wasteful querySelectorAll('*') + 6 hasAttribute() checks per element. */
  var ATTR_SEL = ATTRS.map(function (a) { return '[' + a + ']'; }).join(',');
  var SKIP     = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };

  var dict = {};          // zh -> en
  var lang = 'zh-Hant';

  /* Dynamic units & counts (number + Chinese unit) → natural English with
     pluralization. Applied only when the whole-node dict lookup misses, so
     fixed strings in en.json always win. Handles the values shop-render.js /
     cart.js / countdowns build at runtime. */
  function plural(n, s, p) { return n === '1' ? '1 ' + s : n + ' ' + (p || s + 's'); }
  function wan(numStr) {
    var t = parseFloat(numStr.replace(/,/g, '')) * 10000;
    if (t >= 1e6) return +(t / 1e6).toFixed(2) + 'M';
    if (t >= 1e3) return Math.round(t / 1e3) + 'K';
    return String(t);
  }
  var PATTERNS = [
    // co-create card stat line (runtime-assembled per project: backers + countdown)
    [/^([\d,]+)\s*人支持\s*·\s*(\d+)\s*天倒數$/, function (m) { return m[1] + ' backers · ' + m[2] + 'd left'; }],
    [/^([\d,]+)\s*人支持\s*·\s*已結束$/, function (m) { return m[1] + ' backers · ended'; }],
    // co-create countdown "8 天 23:55:51" and slots "尚餘 430 / 1,500 個名額"
    [/^(\d[\d,]*)\s*天\s+(\d{1,2}:\d{2}:\d{2})$/, function (m) { return m[1] + 'd ' + m[2]; }],
    [/^尚餘\s*([\d,]+)\s*\/\s*([\d,]+)\s*個名額$/, function (m) { return m[1] + ' / ' + m[2] + ' spots left'; }],
    // composite: "role · 612 萬 追蹤" (creator hero stat) — role via dict
    [/^(.+?)\s*·\s*(\d[\d.,]*)\s*萬\s*追蹤$/, function (m) { return (dict[m[1].trim()] || m[1].trim()) + ' · ' + wan(m[2]) + ' followers'; }],
    // auction countdown "126 天 10:34" → "126d 10:34"
    [/^(\d[\d,]*)\s*天\s+(\d{1,2}:\d{2})$/, function (m) { return m[1] + 'd ' + m[2]; }],
    [/^(\d[\d,]*)\s*次出價$/, function (m) { return plural(m[1], 'bid'); }],
    [/^(?:剩餘|剩|還剩|尚餘)\s*(\d[\d,]*)\s*[件個張]$/, function (m) { return m[1] + ' left'; }],
    [/^共\s*(\d[\d,]*)\s*件商品$/, function (m) { return plural(m[1], 'item'); }],
    [/^(\d[\d,]*)\s*件商品$/, function (m) { return plural(m[1], 'item'); }],
    [/^(\d[\d,]*)\s*件$/, function (m) { return plural(m[1], 'item'); }],
    [/^(\d[\d,]*)\s*張$/, function (m) { return plural(m[1], 'ticket'); }],
    [/^(\d[\d,]*)\s*[人位]$/, function (m) { return plural(m[1], 'person', 'people'); }],
    [/^(\d[\d,]*)\s*[名席]$/, function (m) { return plural(m[1], 'spot'); }],
    [/^(\d[\d,]*)\s*天$/, function (m) { return plural(m[1], 'day'); }],
    [/^(\d[\d,]*)\s*(?:小時|時)$/, function (m) { return plural(m[1], 'hour'); }],
    [/^(\d[\d,]*)\s*(?:分鐘|分)$/, function (m) { return plural(m[1], 'min'); }],
    [/^(\d[\d,]*)\s*秒$/, function (m) { return m[1] + 's'; }],
    [/^(\d[\d.]*)\s*萬\s*追蹤$/, function (m) { return wan(m[1]) + ' followers'; }],
    [/^(\d[\d.]*)\s*萬\s*粉絲$/, function (m) { return wan(m[1]) + ' fans'; }],
    [/^(\d[\d.]*)\s*萬$/, function (m) { return wan(m[1]); }],
    // ── dynamic JS-assembled strings (KEEP IN SYNC with tools/i18n-audit.mjs) ──
    // shop filter-sheet apply button "顯示 54 件"
    [/^顯示\s*(\d[\d,]*)\s*(件|位|張|個|名|部|集)$/, function (m) { var u = { '件': 'items', '位': 'people', '張': 'tickets', '個': 'items', '名': 'spots', '部': 'titles', '集': 'episodes' }[m[2]] || 'items'; return 'Show ' + m[1] + ' ' + u; }],
    // filter chip remove aria-label "移除篩選：分類"
    [/^移除篩選：(.+)$/, function (m) { return 'Remove filter: ' + (dict[m[1].trim()] || m[1].trim()); }],
    // cart item remove aria-label "移除 商品名"
    [/^移除\s+(.+)$/, function (m) { return 'Remove ' + (dict[m[1].trim()] || m[1].trim()); }],
    // cocreate remind countdown "距開放 7 天 12:00:00"
    [/^距開放\s*(\d[\d,]*)\s*天\s+(\d{1,2}:\d{2}:\d{2})$/, function (m) { return 'Opens in ' + m[1] + 'd ' + m[2]; }],
    // cocreate-render still alt "片名 劇照 1"
    [/^(.+?)\s*劇照\s*(\d+)$/, function (m) { return (dict[m[1].trim()] || m[1].trim()) + ' still ' + m[2]; }],
    // cocreate backing-flow sentences — title/name/amount interpolated mid-string
    [/^開放投票當天，我們會以站內信、電子郵件或短信通知你，讓你第一時間參與《(.+?)》的共創。$/, function (m) { return 'On voting day we’ll notify you by in-app message, email or SMS, so you can join the co-creation of 《' + m[1] + '》 the moment it opens.'; }],
    [/^「(.+?)」名額已滿。加入候補後，若有支持者未完成付款而釋出名額，系統會依序邀請你補位（限時 48 小時）。$/, function (m) { return '「' + m[1] + '」 is full. Join the waitlist and if a backer doesn’t complete payment and a spot opens, we’ll invite you to claim it in order (48-hour window).'; }],
    [/^你已加入「(.+?)」候補名單。一旦有名額釋出，我們會以限時 48 小時的補位邀請通知你。$/, function (m) { return 'You’ve joined the 「' + m[1] + '」 waitlist. Once a spot opens, we’ll send you a 48-hour invitation to claim it.'; }],
    [/^感謝你支持《(.+?)》！你的卡片已驗證，計畫達標後才會收取 (.+?)；未達標不收費。$/, function (m) { return 'Thanks for backing 《' + m[1] + '》! Your card is verified — we’ll only charge ' + m[2] + ' once the project hits its goal; nothing if it doesn’t.'; }],
    [/^付款完成，感謝你支持《(.+?)》！回饋將於上線後依方案發送。$/, function (m) { return 'Payment complete — thanks for backing 《' + m[1] + '》! Rewards ship by tier after launch.'; }],
    [/^有名額釋出！你在《(.+?)》的候補名單中獲得補位資格。請在時限內完成支持，逾時將釋出給下一位。$/, function (m) { return 'A spot has opened! You’re up on the 《' + m[1] + '》 waitlist. Complete your support before time runs out, or it passes to the next person.'; }],
    // reward-tier card aria-label "方案名，NT$ 1,200，選擇此方案" / "…，名額已滿，候補登記"
    [/^(.+?)，([^，]+)，選擇此方案$/, function (m) { return (dict[m[1].trim()] || m[1].trim()) + ', ' + m[2].trim() + ', select this reward'; }],
    [/^(.+?)，([^，]+)，名額已滿，候補登記$/, function (m) { return (dict[m[1].trim()] || m[1].trim()) + ', ' + m[2].trim() + ', full · join waitlist'; }],
    // PDP runtime composites — keep these LAST so specific patterns above win first.
    // guard prompts: "請先選擇尺寸/顏色/票種", spec highlights "鍵：值", trailing-colon labels "顏色："
    [/^請先選擇(.+)$/, function (m) { return 'Please select ' + (dict[m[1].trim()] || m[1].trim()); }],
    [/^請先為(.+?)選擇選項$/, function (m) { return 'Please choose options for ' + (dict[m[1].trim()] || m[1].trim()) + ' first'; }],
    // event doorsTime "18:30 入場 · 19:30 開演" and from-price "NT$ 1,200 起"
    [/^(\d{1,2}:\d{2})\s*(入場|紅毯|報到)\s*·\s*(\d{1,2}:\d{2})\s*(開演|開始|開課|開播)$/, function (m) { var a = { '入場': 'Doors', '紅毯': 'Red carpet', '報到': 'Check-in' }[m[2]] || 'Doors'; var b = { '開演': 'Show', '開始': 'Starts', '開課': 'Class', '開播': 'Live' }[m[4]] || 'Show'; return a + ' ' + m[1] + ' · ' + b + ' ' + m[3]; }],
    [/^NT\$\s*([\d,]+)\s*起$/, function (m) { return 'From NT$ ' + m[1]; }],
    // auction countdown "剩餘 109 天 00:43" / "剩餘 23:45:10", bid CTA, popcorn count, bundle heading
    [/^剩餘\s*(\d[\d,]*)\s*天\s*(\d{1,2}:\d{2})$/, function (m) { return m[1] + 'd ' + m[2] + ' left'; }],
    [/^剩餘\s*(\d{1,2}:\d{2}:\d{2})$/, function (m) { return m[1] + ' left'; }],
    [/^出價（最低\s*NT\$\s*([\d,]+)）$/, function (m) { return 'Bid (min NT$ ' + m[1] + ')'; }],
    [/^([\d,]+)\s*顆$/, function (m) { return m[1] + ' Popcorn'; }],
    [/^套組內容\s*·\s*共\s*(\d+)\s*件$/, function (m) { return "What's inside · " + m[1] + ' items'; }],
    [/^(.+?)：(.+)$/, function (m) { return (dict[m[1].trim()] || m[1].trim()) + ': ' + (dict[m[2].trim()] || m[2].trim()); }],
    [/^(.+?)：$/, function (m) { return (dict[m[1].trim()] || m[1].trim()) + ':'; }]
  ];
  function matchPattern(key) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = PATTERNS[i][0].exec(key);
      if (m) return PATTERNS[i][1](m);
    }
    return null;
  }

  function initialLang() {
    try { var s = localStorage.getItem(KEY); if (s === 'en' || s === 'zh-Hant') return s; } catch (e) {}
    return 'zh-Hant';
  }

  /* Read the cached dict from localStorage. Returns null if absent or corrupt. */
  function loadCachedDict() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  /* Persist dict to localStorage. Silently swallows quota errors. */
  function saveDict(d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) {}
  }

  /* Translate a single text node (idempotent — original cached on the node). */
  function tNode(node) {
    /* Language endonyms inside the switcher never translate — each language
       always shows its own name in its own script (繁體中文 stays 繁體中文,
       English stays English) regardless of the active UI language. The
       switcher rows are the only [data-lang] elements on the page. */
    var pe = node.parentElement;
    if (pe && pe.closest && pe.closest('[data-lang]')) return;
    if (node.__o == null) {
      if (!node.nodeValue || !node.nodeValue.trim()) return;
      node.__o = node.nodeValue;
    }
    var orig = node.__o, key = orig.replace(/\s+/g, ' ').trim();
    if (!key) return;
    if (lang === 'en') {
      var en = lookup(node, key);
      if (en == null) en = matchPattern(key);          // dynamic units / counts fallback
      if (en != null) node.nodeValue = orig.replace(key, en);  // preserve surrounding whitespace
    } else {
      node.nodeValue = orig;
    }
  }

  /* Explicit data-i18n override on the closest element wins over source-text. */
  function lookup(node, key) {
    var el = node.parentElement;
    if (el && el.hasAttribute('data-i18n')) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] != null) return dict[k];
    }
    return dict[key] != null ? dict[key] : null;
  }

  function tAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var prop = '__a_' + a;
      if (el[prop] == null) el[prop] = el.getAttribute(a);
      var orig = el[prop], key = (orig || '').replace(/\s+/g, ' ').trim();
      if (!key) continue;
      if (lang === 'en') {
        var en = dict[el.getAttribute('data-i18n-' + a)];
        if (en == null) en = dict[key];
        if (en == null) en = matchPattern(key);   // dynamic attrs (aria-label/alt) → same fallback as text nodes
        if (en != null) el.setAttribute(a, orig.replace(key, en));
      } else {
        el.setAttribute(a, el[prop]);
      }
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { tNode(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        return (n.nodeValue && n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n; while ((n = tw.nextNode())) tNode(n);
    if (root.nodeType === 1) tAttrs(root);
    var els = root.querySelectorAll(ATTR_SEL);
    for (var i = 0; i < els.length; i++) tAttrs(els[i]);
  }

  /* Footer tagline is split into per-character spans by an animation script,
     so the dict can't match the single-char text nodes. Translate it as one
     unit using the element's combined text. */
  function taglines() {
    var els = document.querySelectorAll('[data-tagline-split]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], cur = el.textContent.replace(/\s+/g, ' ').trim();
      if (lang === 'en') {
        if (el.__o == null) el.__o = cur;
        var en = dict[el.__o];
        if (en != null && cur !== en) el.textContent = en;
      } else if (el.__o != null && cur !== el.__o) {
        el.textContent = el.__o;
      }
    }
  }

  function apply() {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
    walk(document.body);
    taglines();
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-dropdown__item--active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    try { document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang: lang } })); } catch (e) {}
  }

  /* Non-blocking, time-sliced version of apply() for the initial full-page pass.
     The synchronous apply() walks the whole DOM + 152KB dict in ONE task
     (~300–1000ms on a phone). Behind the old blank gate that read as a delay;
     with the de-gated paint it froze taps (the main thread couldn't process
     input mid-walk). This slices the work into ≤28ms chunks, yielding to the
     main thread between them so taps register throughout; reveal() fades the
     translated text in once the last chunk lands. */
  var yieldToMain = (window.scheduler && scheduler.postTask)
    ? function (cb) { scheduler.postTask(cb, { priority: 'user-visible' }); }
    : function (cb) { setTimeout(cb, 0); };
  function nowMs() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  function applyAsync(done) {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');

    // Collect the work up front (cheap — DOM traversal, no string ops yet).
    var nodes = [];
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        return (n.nodeValue && n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var tn; while ((tn = tw.nextNode())) nodes.push(tn);
    var attrEls = document.body.querySelectorAll(ATTR_SEL);

    var i = 0, j = 0;
    function chunk() {
      var t0 = nowMs();
      while (i < nodes.length && (nowMs() - t0) < 28) tNode(nodes[i++]);
      while (i >= nodes.length && j < attrEls.length && (nowMs() - t0) < 28) tAttrs(attrEls[j++]);
      if (i < nodes.length || j < attrEls.length) { yieldToMain(chunk); return; }
      // Finishing touches (cheap): taglines, toggle state, applied event.
      taglines();
      document.querySelectorAll('[data-lang]').forEach(function (btn) {
        var on = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('lang-dropdown__item--active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      try { document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang: lang } })); } catch (e) {}
      if (done) done();
    }
    chunk();
  }

  /* Lazily ensure the EN dict is in memory before an English (re)translate.
     PERF CONTRACT — this runs ONLY on a user-initiated switch to English, never
     on page load. Chinese page loads still fetch nothing. Warm cache = zero
     network (synchronous). Cold = one fetch, then cached for every later visit.
     So the switcher adds nothing to the critical FCP path.

     ROOT-CAUSE FIX (switcher bug): setLang used to call apply() with an empty
     dict on a default-Chinese page (the dict is only fetched at boot when the
     SAVED language is already 'en'). A runtime toggle therefore flipped the
     lang attr + persisted, but translated nothing. Loading the dict on demand
     here is the actual fix. */
  function ensureDict(cb) {
    if (lang !== 'en') { cb(); return; }                       // zh = source text, no dict
    if (dict && Object.keys(dict).length) { cb(); return; }    // already in memory
    var cached = loadCachedDict();
    if (cached) { dict = cached; cb(); return; }               // warm: instant, no network
    fetch('locales/en.json')                                   // cold: fetch once, then cache
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { dict = j || {}; saveDict(dict); })
      .catch(function () { if (!dict) dict = {}; })
      .finally(cb);
  }

  function setLang(l) {
    lang = (l === 'en') ? 'en' : 'zh-Hant';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    /* applyAsync (time-sliced) keeps taps responsive during the 152KB DOM walk;
       ensureDict guarantees the dictionary is present before we translate. */
    ensureDict(function () { applyAsync(); });
  }

  function wireToggle() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-lang]');
      if (!btn) return;
      setLang(btn.getAttribute('data-lang'));
    }, true);
  }

  function observe() {
    if (!window.MutationObserver) return;
    new MutationObserver(function (muts) {
      if (lang !== 'en') return;           // zh = source; injected nodes already correct
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) walk(added[j]);
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  /* English-locale webfonts: Satoshi (UI/body, Fontshare) + Afacad (display
     headings, Google Fonts). Loaded once on every page so switching to English
     is instant. The actual font-family mapping is driven by html[lang="en"]
     rules in tokens.css. */
  function addFont(id, href) {
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
  }
  function loadFonts() {
    addFont('ztor-satoshi', 'https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap');
    addFont('ztor-afacad', 'https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap');
  }

  /* Reveal the page once English has been applied. A no-FOUC guard (inline in
     each page <head>) hides the body when the saved language is English, so the
     Chinese source never flashes before translation. We remove it here. */
  function reveal() {
    var d = document.documentElement;
    d.classList.add('ztor-en-ready');         // fade the now-translated text in
    setTimeout(function () {                    // after the .14s fade, drop the gate
      d.classList.remove('ztor-en-ready');     // so no universal text-fill transition
      d.classList.remove('ztor-en-pending');   // lingers on every text element
    }, 220);
  }

  /* ── Core startup ──────────────────────────────────────────────────────────

     FAST PATH (repeat English visits):
       cached dict found → apply synchronously → reveal → schedule background
       refresh of the cache (no FCP dependency on network).

     SLOW PATH (first-ever English visit):
       no cache → fetch en.json → apply → reveal → save to cache.
       Worst-case blank is capped by the 300 ms failsafe in each page <head>.

     Chinese (default) visits: never gated — source text is already correct,
     no dict needed, reveal is called immediately.
  */
  function start(fromCache) {
    lang = initialLang();
    loadFonts();
    wireToggle();
    observe();

    if (lang === 'en') {
      if (fromCache) {
        // FAST PATH (warm cache): the dict is already in memory. i18n.js is
        // deferred, so this runs BEFORE first paint — translate SYNCHRONOUSLY
        // now so English text paints in place. No hide-then-fade blink: the
        // text is already correct and visible at first paint, exactly like the
        // always-visible nav icons. (The head gate still hides text until this
        // runs, so the Chinese source can never flash.)
        apply();
        reveal();
        // Refresh the cache for the next visit, off the critical path.
        fetch('locales/en.json')
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (j) { if (j) saveDict(j); })
          .catch(function () {});
      } else {
        // SLOW PATH (first-ever English visit, dict just fetched): apply
        // time-sliced to keep taps responsive; reveal when the last chunk lands.
        applyAsync(reveal);
      }
    } else {
      // Chinese: apply just syncs toggle button state; no dict needed.
      apply();
      reveal();
    }

    window.ztorI18n = {
      setLang: setLang,
      get lang() { return lang; },
      t: function (zh) { return (lang === 'en' && dict[zh] != null) ? dict[zh] : zh; },
      retranslate: apply
    };
  }

  // ── Boot sequence ──────────────────────────────────────────────────────────

  var savedLang = initialLang();

  if (savedLang === 'en') {
    // Try the cache first.
    var cached = loadCachedDict();
    if (cached) {
      // FAST PATH: dict is available synchronously — no network wait.
      dict = cached;
      // Script is deferred, so DOM is already parsed. Fire immediately.
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { start(true); });
      } else {
        start(true);
      }
    } else {
      // SLOW PATH (first visit): fetch, then apply, then save.
      fetch('locales/en.json')
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (j) {
          dict = j || {};
          saveDict(dict);
        })
        .catch(function () { dict = {}; })
        .finally(function () {
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { start(false); });
          } else {
            start(false);
          }
        });
    }
  } else {
    // Chinese: no fetch needed at all.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { start(false); });
    } else {
      start(false);
    }
  }
})();
