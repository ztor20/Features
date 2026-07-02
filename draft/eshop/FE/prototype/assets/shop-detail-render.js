/* ════════════════════════════════════════════════════════════════
   shop-detail-render.js — Ztor PDP (product-detail) render layer.

   Param-driven: reads ?id= from the URL, resolves the item across the
   existing PLP arrays (products ∪ creators[].products ∪ popcornItems ∪
   shopEvents ∪ auctions), merges window.ZTOR_SHOP.detail[id] over it, and
   renders the type-correct detail page into #pdpRoot. Mirrors the
   shop-render.js / cart.js patterns; add-to-cart reuses window.ZtorCart.

   Premium/luxury via Ztor tokens (shop-detail.css). Gallery + zoom (ds-zoom),
   variant select (colour swatches + size grid), qty, add-to-cart, wishlist
   (heart icon), delivery/returns micro-line, details section, related rail,
   and a mobile sticky buy-bar (shop-buybar). zh-Hant source; i18n translates.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var S = window.ZTOR_SHOP || {};

  /* ── helpers (mirror shop-render.js) ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function imgFor(id, w, h) {
    return 'https://picsum.photos/seed/' + encodeURIComponent(id) + '/' + (w || 900) + '/' + (h || 1200);
  }
  var ON_ERR = "this.onerror=null;this.style.display='none';this.parentElement.classList.add('brand-tile','brand-tile--3');";

  /* image path: bare archetype filename → assets/images/shop/g/<file> */
  function gImg(file) { return 'assets/images/shop/g/' + file; }
  /* gallery sources: detail.images → [imgMap[id]] → [picsum] (never a dead glyph) */
  function gallerySources(id, detail) {
    if (detail && detail.images && detail.images.length) return detail.images.map(gImg);
    var mapped = (S.imgMap || {})[id];
    if (mapped) return [gImg(mapped)];
    return [imgFor(id)];
  }

  /* ── colour name → hex map ── */
  var COLOUR_HEX = {
    '黑': '#1A1A1A', '墨黑': '#1A1A1A',
    '灰': '#9A9A9A', '霧灰': '#9A9A9A',
    '白': '#EDE7D9', '米白': '#EDE7D9',
    '藍': '#243A5E', '海軍藍': '#243A5E',
    '紅': '#7A2B2B',
    '綠': '#2F4A37'
  };
  function colourHex(label) {
    if (!label) return null;
    /* direct match */
    if (COLOUR_HEX[label]) return COLOUR_HEX[label];
    /* partial match on first character(s) */
    var keys = Object.keys(COLOUR_HEX);
    for (var i = 0; i < keys.length; i++) {
      if (label.indexOf(keys[i]) !== -1 || keys[i].indexOf(label) !== -1) return COLOUR_HEX[keys[i]];
    }
    return null;
  }

  /* ── inline glyphs ── */
  var SVG = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5 11-11"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2M11 8v6M8 11h6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2l10 10-10 10L2 12z"/><path d="M7 12l1.5-1.5M10 9l1.5-1.5M13 12l1.5-1.5"/></svg>'
  };

  /* ── resolve ?id= → { item, type } ───────────────────────────────
     type ∈ goods | bundle | popcorn | event | auction. The non-goods
     branches are filled in as each type's PDP lands; until then a
     resolved item renders as the goods shell (a valid product page). */
  function isBundle(p) { return p && (p.type === 'bundle' || p.badge === 'Bundle' || /套組|組合|珍藏組/.test(p.name || '')); }

  function resolveItem(id) {
    if (!id) return null;
    var pools = [];
    if (S.products) pools.push(S.products);
    if (S.popcornItems) pools.push(S.popcornItems);
    if (S.shopEvents) pools.push(S.shopEvents);
    if (S.auctions) pools.push(S.auctions);
    (S.creators || []).forEach(function (c) { if (c.products) pools.push(c.products); });
    var found = null;
    for (var i = 0; i < pools.length && !found; i++) {
      for (var j = 0; j < pools[i].length; j++) {
        if (String(pools[i][j].id) === String(id)) { found = pools[i][j]; break; }
      }
    }
    if (!found) return null;
    var detail = (S.detail || {})[id] || {};
    var merged = Object.assign({}, found, detail);
    var type = 'goods';
    if (S.popcornItems && S.popcornItems.indexOf(found) >= 0) type = 'popcorn';
    else if (S.shopEvents && S.shopEvents.indexOf(found) >= 0) type = 'event';
    else if (S.auctions && S.auctions.indexOf(found) >= 0) type = 'auction';
    else if (isBundle(merged)) type = 'bundle';
    return { item: merged, detail: detail, type: type, id: String(id) };
  }

  /* ── price block (NTD headline + optional HKD + struck original) ── */
  function priceBlock(item) {
    if (item.ntd == null && item.bid == null && item.pop == null) return '';
    var main = item.ntd === 0 ? '免費' : 'NT$ ' + fmt(item.ntd);
    var sub = item.hkd ? '<span class="pdp-price__sub">HK$ ' + fmt(item.hkd) + '</span>' : '';
    var was = (item.wasNtd && item.wasNtd > item.ntd)
      ? '<span class="pdp-price__was">原價 NT$ ' + fmt(item.wasNtd) + '</span>' : '';
    var save = (item.wasNtd && item.wasNtd > item.ntd)
      ? '<span class="pdp-price__save">省 NT$ ' + fmt(item.wasNtd - item.ntd) + '</span>' : '';
    return '<div class="pdp-price"><span class="pdp-price__now">' + main + '</span>' + sub + was + save + '</div>';
  }

  /* ── gallery ── Desktop: vertical thumb strip left + main image right.
                   Mobile:  main image + horizontal thumb carousel below. */
  function galleryHtml(ctx) {
    var srcs = gallerySources(ctx.id, ctx.item);
    var name = esc(ctx.item.name);

    /* Vertical thumb strip (desktop) / horizontal carousel (mobile) */
    var thumbs = srcs.map(function (src, i) {
      return '<button class="pdp-gallery__thumb' + (i === 0 ? ' is-active' : '') + '" type="button" data-thumb="' + i + '" aria-label="檢視圖片 ' + (i + 1) + '">' +
        '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async" onerror="' + ON_ERR + '"></button>';
    }).join('');

    /* video slot — placeholder player as the final tile */
    var videoThumb = '<button class="pdp-gallery__thumb pdp-gallery__thumb--video" type="button" data-video aria-label="觀看商品影片">' +
      '<img src="' + esc(srcs[0]) + '" alt="" loading="lazy" onerror="' + ON_ERR + '">' +
      '<span class="pdp-gallery__thumb-play" aria-hidden="true">' + SVG.play + '</span></button>';

    return '<div class="pdp-gallery" data-pdp-gallery>' +
      /* Vertical thumb strip — desktop left column */
      '<div class="pdp-gallery__strip" role="group" aria-label="商品圖片">' + thumbs + videoThumb + '</div>' +
      /* Main image stage */
      '<div class="pdp-gallery__stage">' +
        '<button class="pdp-gallery__frame" type="button" data-zoom-open aria-label="放大檢視">' +
          '<img class="pdp-gallery__img" data-hero src="' + esc(srcs[0]) + '" alt="' + name + '" onerror="' + ON_ERR + '">' +
          '<span class="pdp-gallery__zoom-hint" aria-hidden="true">' + SVG.zoom + '</span>' +
        '</button>' +
        /* Mobile horizontal thumbnail carousel — hidden on desktop via CSS */
        '<div class="pdp-gallery__thumbs-mobile" role="group" aria-label="商品圖片">' + thumbs + videoThumb + '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── variant chips (colour swatches + size grid) ── */
  function variantsHtml(item) {
    if (!item.variants || !item.variants.length) return '';
    return '<div class="pdp-variants" data-variants>' + item.variants.map(function (v, vi) {
      var isColour = v.type === 'colour';
      var isSize = v.type === 'size';

      /* Colour: find the currently active option label for the inline display */
      var firstLabel = (v.options && v.options[0]) ? esc(v.options[0].label) : '';
      var labelSuffix = isColour
        ? '：<span class="pdp-variant__colour-name" data-colour-name-' + vi + '>' + firstLabel + '</span>'
        : '';

      var opts = (v.options || []).map(function (o, oi) {
        var oos = o.soldOut;
        var hex = isColour ? colourHex(o.label) : null;

        if (isColour) {
          /* Colour swatch: round chip with fill colour */
          var swatchStyle = hex
            ? 'style="--swatch-bg:' + hex + '"'
            : 'style="--swatch-bg:var(--border-strong)"';
          return '<button class="pdp-swatch' + (oos ? ' is-oos' : '') + (oi === 0 ? ' is-selected' : '') + '" type="button" role="radio"' +
            ' aria-checked="' + (oi === 0 ? 'true' : 'false') + '"' +
            (oos ? ' disabled aria-disabled="true"' : '') +
            ' data-vidx="' + vi + '" data-vval="' + esc(o.value) + '" data-colour-label="' + esc(o.label) + '" title="' + esc(o.label) + '" ' + swatchStyle + '>' +
            '<span class="pdp-swatch__fill" aria-hidden="true"></span>' +
            (oos ? '<span class="sr-only">售完</span>' : '') +
            '</button>';
        } else if (isSize) {
          /* Size grid: square chips */
          return '<button class="pdp-size-chip' + (oos ? ' is-oos' : '') + '" type="button" role="radio"' +
            ' aria-checked="false"' +
            (oos ? ' disabled aria-disabled="true"' : '') +
            ' data-vidx="' + vi + '" data-vval="' + esc(o.value) + '">' +
            '<span class="pdp-size-chip__label">' + esc(o.label) + '</span>' +
            (oos ? '<span class="pdp-size-chip__oos" aria-hidden="true"></span>' : '') +
            '</button>';
        } else {
          /* Generic chip fallback */
          return '<button class="pdp-chip' + (oos ? ' is-oos' : '') + '" type="button" role="radio" aria-checked="false"' +
            (oos ? ' disabled aria-disabled="true"' : '') +
            ' data-vidx="' + vi + '" data-vval="' + esc(o.value) + '">' + esc(o.label) +
            (oos ? '<span class="pdp-chip__oos">售完</span>' : '') + '</button>';
        }
      }).join('');

      var guideLink = isSize
        ? '<button class="pdp-variant__guide" type="button" data-size-guide>' +
            '<span class="pdp-variant__guide-icon" aria-hidden="true">' + SVG.ruler + '</span>尺寸指南</button>'
        : '';

      var rowClass = isColour ? 'pdp-variant__opts pdp-variant__opts--swatches'
        : isSize ? 'pdp-variant__opts pdp-variant__opts--sizes'
        : 'pdp-variant__opts';

      return '<div class="pdp-variant" data-variant="' + esc(v.type) + '" data-vrow="' + vi + '">' +
        '<div class="pdp-variant__header">' +
          '<span class="pdp-variant__label">' + esc(v.label || v.type) + labelSuffix + '</span>' +
          guideLink +
        '</div>' +
        '<div class="' + rowClass + '" role="radiogroup" aria-label="' + esc(v.label || v.type) + '">' + opts + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  /* ── qty stepper ── */
  function qtyHtml() {
    return '<div class="pdp-qty" data-qty>' +
      '<button class="pdp-qty__btn" type="button" data-qty-dec aria-label="減少數量">' + SVG.minus + '</button>' +
      '<span class="pdp-qty__val" data-qty-val aria-live="polite">1</span>' +
      '<button class="pdp-qty__btn" type="button" data-qty-inc aria-label="增加數量">' + SVG.plus + '</button>' +
    '</div>';
  }

  /* ── delivery micro-line ── */
  function deliveryMicroHtml(item) {
    var shippingText = (item.shipping && item.shipping.length > 0)
      ? item.shipping
      : '3–5 工作天出貨 · 滿 NT$1,000 免運';
    var returnsText = (item.returns && item.returns.length > 0)
      ? item.returns
      : '7 天退換';
    /* Compact single-line version */
    return '<div class="pdp-delivery">' +
      '<span class="pdp-delivery__icon" aria-hidden="true">' + SVG.truck + '</span>' +
      '<span class="pdp-delivery__text">現場 QR 領取 · 免運</span>' +
      '<span class="pdp-delivery__sep" aria-hidden="true">·</span>' +
      '<span class="pdp-delivery__text">付款後 Email 寄送取貨 QR</span>' +
    '</div>';
  }

  /* ── details section (full-width, below the 2-col grid) ── */
  function detailsSectionHtml(item) {
    /* Description: use item's, or fallback copy by category */
    var desc = item.description || fallbackDescription(item);

    /* Highlights: derive 3–5 bullets from specs or known fields */
    var highlights = deriveHighlights(item);

    /* Specs definition list */
    var specs = item.specs && item.specs.length ? item.specs : fallbackSpecs(item);

    /* Shipping/returns text */
    var shippingText = item.shipping || '現場 QR 領取：付款後將以 Email 寄送取貨 QR Code，並顯示於「我的訂單」；至 Ztor 門市（台北市信義區松壽路 12 號 2F，每日 12:00–21:00）出示由門市人員核銷領取。';
    var returnsText = item.returns || '收到商品 7 天內可申請退換，商品需保持吊牌完整、未經下水與配戴。';

    var leftCol = '<div class="pdp-details__left">' +
      (highlights.length ? '<ul class="pdp-details__highlights">' +
        highlights.map(function (h) { return '<li class="pdp-details__highlight">' + esc(h) + '</li>'; }).join('') +
      '</ul>' : '') +
    '</div>';

    var rightCol = '<div class="pdp-details__right">' +
      (specs.length ? '<div class="pdp-details__specs-block">' +
        '<h3 class="pdp-details__sub-heading">規格</h3>' +
        '<dl class="pdp-specs">' + specs.map(function (s) {
          return '<div class="pdp-specs__row"><dt>' + esc(s.k) + '</dt><dd>' + esc(s.v) + '</dd></div>';
        }).join('') + '</dl>' +
      '</div>' : '') +
      '<div class="pdp-details__shipping-block">' +
        '<h3 class="pdp-details__sub-heading">取貨與退換</h3>' +
        '<p class="pdp-details__shipping-text">' + esc(shippingText) + '</p>' +
        '<p class="pdp-details__shipping-text">' + esc(returnsText) + '</p>' +
      '</div>' +
    '</div>';

    return '<section class="pdp-details" aria-label="商品詳情">' +
      '<div class="pdp-details__inner container container--wide">' +
        '<h2 class="pdp-details__heading">商品詳情</h2>' +
        '<p class="pdp-details__lead">' + esc(desc) + '</p>' +
        '<div class="pdp-details__cols">' + leftCol + rightCol + '</div>' +
      '</div>' +
    '</section>';
  }

  function fallbackDescription(item) {
    var cat = (item.cat || '').toLowerCase();
    if (/tee|shirt|t-shirt|上衣/.test(cat) || /tee|shirt/.test((item.id || '').toLowerCase())) {
      return '這件商品以高品質面料裁製，是日常穿搭的百搭首選。版型舒適合身，適合各種場合穿著。';
    }
    if (/hoodie|sweater|外套/.test(cat) || /hoodie/.test((item.id || '').toLowerCase())) {
      return '以優質材料製成，保暖舒適，是秋冬必備的百搭單品。';
    }
    return '這件商品結合了精緻工藝與高品質材料，是值得收藏的精選商品。';
  }

  function deriveHighlights(item) {
    var list = [];
    if (item.specs && item.specs.length) {
      item.specs.slice(0, 4).forEach(function (s) {
        list.push(s.k + '：' + s.v);
      });
    } else {
      /* Derive from known fields */
      if (item.cat) list.push('分類：' + item.cat);
      if (item.badge) list.push('標籤：' + item.badge);
      list.push('限量商品，售完不補');
      list.push('台灣本島滿 NT$1,000 免運');
    }
    return list.slice(0, 5);
  }

  function fallbackSpecs(item) {
    var specs = [];
    if (item.cat) specs.push({ k: '分類', v: item.cat });
    if (item.badge) specs.push({ k: '標籤', v: item.badge });
    specs.push({ k: '產地', v: '台灣製造' });
    return specs;
  }

  /* ── related rail with fallback ── */
  function relatedHtml(item) {
    var ids = item.related || [];
    var byId = {};
    (S.products || []).forEach(function (p) { byId[p.id] = p; });
    (S.creators || []).forEach(function (c) { (c.products || []).forEach(function (p) { byId[p.id] = p; }); });

    /* Build cards from related[] first */
    var relatedProducts = ids.map(function (rid) { return byId[rid]; }).filter(Boolean);

    /* Fallback: same-cat products if related is empty or yields <2 items */
    if (relatedProducts.length < 2) {
      var cat = item.cat;
      var fallbacks = (S.products || []).filter(function (p) {
        return p.id !== item.id && (!cat || p.cat === cat) && ids.indexOf(p.id) === -1;
      });
      /* Add fallbacks until we have up to 4 items */
      fallbacks.slice(0, 4 - relatedProducts.length).forEach(function (p) {
        relatedProducts.push(p);
      });
      /* If still empty (no same-cat), grab any 4 products */
      if (!relatedProducts.length) {
        relatedProducts = (S.products || []).filter(function (p) { return p.id !== item.id; }).slice(0, 4);
      }
    }

    if (!relatedProducts.length) return '';

    var cards = relatedProducts.slice(0, 4).map(function (p) {
      var src = gallerySources(p.id, (S.detail || {})[p.id] || {})[0];
      return '<a class="pdp-rec-card" href="shop-item.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="pdp-rec-card__media">' +
          '<img src="' + esc(src) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="' + ON_ERR + '">' +
        '</div>' +
        '<div class="pdp-rec-card__body">' +
          (p.cat ? '<span class="pdp-rec-card__cat">' + esc(p.cat) + '</span>' : '') +
          '<h3 class="pdp-rec-card__title">' + esc(p.name) + '</h3>' +
          '<span class="pdp-rec-card__price">NT$ ' + fmt(p.ntd) + '</span>' +
        '</div>' +
      '</a>';
    }).join('');

    return '<section class="pdp-recs" aria-label="你可能也喜歡">' +
      '<div class="pdp-recs__inner container container--wide">' +
        '<h2 class="pdp-recs__heading">你可能也喜歡</h2>' +
        '<div class="pdp-recs__rail">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  /* ── crumbs ── */
  function crumbsHtml(item) {
    return '<nav class="page-head__crumbs" aria-label="麵包屑">' +
      '<a href="shop.html">商店</a><span class="page-head__crumb-sep" aria-hidden="true">›</span>' +
      (item.cat ? '<span>' + esc(item.cat) + '</span><span class="page-head__crumb-sep" aria-hidden="true">›</span>' : '') +
      '<span class="page-head__crumb-cur" aria-current="page">' + esc(item.name) + '</span></nav>';
  }

  /* ── GOODS / merch / bundle buy column ── */
  function goodsBuyHtml(ctx) {
    var item = ctx.item;
    var sold = item.soldOut;
    var addLabel = sold ? '已售完' : '加入購物車';

    return '<div class="pdp-buy">' +
      (item.badge ? '<span class="pdp-buy__badge status-tag status-tag--yellow">' + esc(item.badge) + '</span>' : '') +
      (item.cat ? '<span class="pdp-buy__eyebrow t-eyebrow">' + esc(item.cat) + '</span>' : '') +
      '<h1 class="pdp-buy__title">' + esc(item.name) + '</h1>' +
      priceBlock(item) +
      variantsHtml(item) +
      '<p class="pdp-buy__guard cc-callout cc-callout--error" data-guard hidden>請先選擇' + (item.variants ? esc((item.variants[0] || {}).label || '選項') : '選項') + '</p>' +
      '<div class="pdp-buy__actions">' +
        (sold ? '' : qtyHtml()) +
        '<button class="btn btn--primary btn--lg pdp-buy__add" type="button" data-pdp-add' + (sold ? ' disabled' : '') + '>' +
          '<span class="pdp-buy__add-glyph" aria-hidden="true">' + SVG.cart + '</span><span data-add-label>' + addLabel + '</span></button>' +
        '<button class="pdp-buy__heart" type="button" data-pdp-wish aria-pressed="false" aria-label="加入願望清單">' +
          SVG.heart +
        '</button>' +
      '</div>' +
      deliveryMicroHtml(item) +
    '</div>';
  }

  function minTier(item) {
    var t = item.ticketTiers;
    if (!t || !t.length) return item.ntd;
    var avail = t.filter(function (x) { return !x.soldOut; });
    var arr = (avail.length ? avail : t).map(function (x) { return x.ntd; });
    return Math.min.apply(null, arr);
  }

  /* ── buy-bar (mobile sticky) — type-aware price + CTA ── */
  function buyBarHtml(ctx) {
    var item = ctx.item, sold = item.soldOut, t = ctx.type;
    var priceStr, cta, dataAttr;
    if (t === 'popcorn') { priceStr = fmt(item.popPrice || item.pop || 0) + ' 顆'; cta = '用爆米花兌換'; dataAttr = 'data-pdp-redeem'; }
    else if (t === 'auction') { priceStr = 'NT$ ' + fmt(item.bid || item.startBid || 0); cta = '出價'; dataAttr = 'data-pdp-bid'; }
    else if (t === 'event') { var mn = minTier(item); priceStr = (mn != null ? 'NT$ ' + fmt(mn) + ' 起' : ''); cta = '選擇票種'; dataAttr = 'data-pdp-ticket'; }
    else { priceStr = item.ntd === 0 ? '免費' : 'NT$ ' + fmt(item.ntd); cta = sold ? '已售完' : '加入購物車'; dataAttr = 'data-pdp-add'; }
    var dis = (sold && (t === 'goods' || t === 'bundle')) ? ' disabled' : '';
    return '<div class="shop-buybar" data-buybar aria-hidden="true">' +
      '<div class="shop-buybar__info"><span class="shop-buybar__name">' + esc(item.name) + '</span>' +
        '<span class="shop-buybar__price">' + priceStr + '</span></div>' +
      '<button class="btn btn--primary shop-buybar__add pdp-buy__add" type="button" ' + dataAttr + dis + '>' + cta + '</button>' +
    '</div>';
  }

  /* ── countdown (auction) ── */
  function endMs(item) {
    var iso = item.endsISO || ((item.ends || '') + 'T23:59:00');
    var d = new Date(iso);
    return d.getTime() - Date.now();
  }
  function countdownText(ms) {
    if (ms <= 0) return '已結標';
    var s = Math.floor(ms / 1000), d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600; var m = Math.floor(s / 60); s -= m * 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    if (d > 0) return '剩餘 ' + d + ' 天 ' + pad(h) + ':' + pad(m);
    return '剩餘 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
  }
  function auctionStatus(item) {
    var ms = endMs(item);
    if (ms <= 0) return 'ended';
    if (ms < 24 * 3600 * 1000) return 'ending-soon';
    return 'live';
  }
  function popcornBalance() {
    if (window.ZtorLedger && window.ZtorLedger.popcorn && window.ZtorLedger.popcorn.balance) return window.ZtorLedger.popcorn.balance();
    try { var v = parseInt(localStorage.getItem('ztor_popcorn_balance'), 10); if (!isNaN(v)) return v; } catch (e) {}
    return 8400;
  }

  /* ── GOODS render ── */
  function renderGoods(root, ctx) {
    root.innerHTML =
      '<div class="pdp__page">' +
        '<div class="container container--wide">' +
          crumbsHtml(ctx.item) +
          '<div class="pdp__grid">' + galleryHtml(ctx) + goodsBuyHtml(ctx) + '</div>' +
        '</div>' +
        detailsSectionHtml(ctx.item) +
        relatedHtml(ctx.item) +
      '</div>' +
      buyBarHtml(ctx);
    root.setAttribute('data-type', ctx.type);
  }

  /* ── BUNDLE 套組 ── */
  function bundleContentsHtml(item) {
    var comps = item.components || [];
    if (!comps.length) return '';
    return '<section class="pdp-bundle"><h2 class="pdp-bundle__title">套組內容 · 共 ' + comps.length + ' 件</h2>' +
      '<div class="pdp-bundle__grid">' + comps.map(function (comp, ci) {
        var imgs = (comp.images || []).map(gImg);
        if (!imgs.length) imgs = [imgFor(item.id + '-c' + ci)];
        var thumbs = imgs.length > 1 ? '<div class="pdp-bundle-item__thumbs">' + imgs.map(function (src, ti) {
          return '<button class="pdp-bundle-item__thumb' + (ti === 0 ? ' is-active' : '') + '" type="button" data-citem="' + ci + '" data-cthumb="' + ti + '" aria-label="圖片 ' + (ti + 1) + '"><img src="' + esc(src) + '" alt="" loading="lazy" onerror="' + ON_ERR + '"></button>';
        }).join('') + '</div>' : '';
        var picker = (comp.variants && comp.variants.length) ? comp.variants.map(function (v) {
          return '<div class="pdp-bundle-item__variant"><span class="pdp-variant__label">' + esc(v.label || v.type) + '</span>' +
            '<div class="pdp-variant__opts glass-tabs" role="radiogroup" aria-label="' + esc(v.label || v.type) + '">' +
            (v.options || []).map(function (o) {
              return '<button class="pdp-chip pdp-bundle-chip glass-tabs__item' + (o.soldOut ? ' is-oos' : '') + '" type="button" role="radio" aria-checked="false"' +
                (o.soldOut ? ' disabled' : '') + ' data-cidx="' + ci + '" data-vval="' + esc(o.value) + '">' + esc(o.label) + '</button>';
            }).join('') + '</div></div>';
        }).join('') : '';
        var link = comp.id ? '<a class="pdp-bundle-item__link" href="shop-item.html?id=' + encodeURIComponent(comp.id) + '">查看單品<span aria-hidden="true"> ›</span></a>' : '';
        return '<div class="pdp-bundle-item" data-bitem="' + ci + '">' +
          '<div class="pdp-bundle-item__media"><img class="pdp-bundle-item__img" data-cmain="' + ci + '" src="' + esc(imgs[0]) + '" alt="' + esc(comp.name) + '" loading="lazy" onerror="' + ON_ERR + '"></div>' +
          thumbs +
          '<div class="pdp-bundle-item__body"><h3 class="pdp-bundle-item__name">' + esc(comp.name) + '</h3>' + picker + link + '</div>' +
        '</div>';
      }).join('') + '</div></section>';
  }

  function renderBundle(root, ctx) {
    root.innerHTML =
      '<div class="pdp__page">' +
        '<div class="container container--wide">' +
          crumbsHtml(ctx.item) +
          '<div class="pdp__grid">' + galleryHtml(ctx) + goodsBuyHtml(ctx) + '</div>' +
          bundleContentsHtml(ctx.item) +
        '</div>' +
        detailsSectionHtml(ctx.item) +
        relatedHtml(ctx.item) +
      '</div>' +
      buyBarHtml(ctx);
    root.setAttribute('data-type', ctx.type);
  }

  /* ── POPCORN — redeem with credit (not shipped) ── */
  function popcornBuyHtml(ctx) {
    var item = ctx.item;
    var pop = item.popPrice || item.pop || 0;
    return '<div class="pdp-buy">' +
      (item.cat ? '<span class="pdp-buy__eyebrow t-eyebrow">' + esc(item.cat) + '</span>' : '') +
      '<h1 class="pdp-buy__title">' + esc(item.name) + '</h1>' +
      '<div class="pdp-pop"><span class="pdp-pop__icon" aria-hidden="true"></span>' +
        '<span class="pdp-pop__val">' + fmt(pop) + '</span><span class="pdp-pop__unit">顆爆米花</span></div>' +
      '<div class="pdp-pop__balance">你的餘額 <b data-pop-balance>' + fmt(popcornBalance()) + '</b> 顆</div>' +
      '<div class="pdp-buy__actions">' +
        '<button class="btn btn--primary btn--lg pdp-buy__add" type="button" data-pdp-redeem><span data-add-label>用爆米花兌換</span></button>' +
        '<button class="pdp-buy__heart" type="button" data-pdp-wish aria-pressed="false" aria-label="加入願望清單">' + SVG.heart + '</button>' +
      '</div>' +
      (item.redeemNote ? '<p class="pdp-buy__note cc-callout">' + esc(item.redeemNote) + '</p>' : '') +
    '</div>';
  }
  function renderPopcorn(root, ctx) {
    root.innerHTML =
      '<div class="pdp__page">' +
        '<div class="container container--wide">' +
          crumbsHtml(ctx.item) +
          '<div class="pdp__grid">' + galleryHtml(ctx) + popcornBuyHtml(ctx) + '</div>' +
        '</div>' +
        detailsSectionHtml(ctx.item) +
        relatedHtml(ctx.item) +
      '</div>' +
      buyBarHtml(ctx);
    root.setAttribute('data-type', ctx.type);
  }

  /* ── EVENT — date/venue/lineup + select-ticket ── */
  function eventBuyHtml(ctx) {
    var item = ctx.item;
    var tiers = item.ticketTiers || [];
    var tiersHtml = tiers.length ? '<div class="pdp-tiers" data-tiers role="radiogroup" aria-label="票種">' + tiers.map(function (t, ti) {
      var oos = t.soldOut;
      return '<button class="pdp-tier' + (oos ? ' is-oos' : '') + '" type="button" role="radio" aria-checked="false"' + (oos ? ' disabled' : '') + ' data-tier="' + ti + '">' +
        '<span class="pdp-tier__label">' + esc(t.label) + (oos ? ' <span class="pdp-tier__oos">售完</span>' : '') + '</span>' +
        '<span class="pdp-tier__price">NT$ ' + fmt(t.ntd) + (t.hkd ? '<span class="pdp-tier__sub"> · HK$ ' + fmt(t.hkd) + '</span>' : '') + '</span></button>';
    }).join('') + '</div>' : '';
    return '<div class="pdp-buy">' +
      (item.badge ? '<span class="pdp-buy__badge status-tag status-tag--yellow">' + esc(item.badge) + '</span>' : '') +
      (item.cat ? '<span class="pdp-buy__eyebrow t-eyebrow">' + esc(item.cat) + '</span>' : '') +
      '<h1 class="pdp-buy__title">' + esc(item.name) + '</h1>' +
      '<div class="pdp-event-meta">' +
        '<div class="pdp-event-meta__row"><span class="pdp-event-meta__k">日期</span><span>' + esc(item.date || '') + '</span></div>' +
        '<div class="pdp-event-meta__row"><span class="pdp-event-meta__k">場館</span><span>' + esc(item.venue || '') + '</span></div>' +
        (item.doorsTime ? '<div class="pdp-event-meta__row"><span class="pdp-event-meta__k">時間</span><span>' + esc(item.doorsTime) + '</span></div>' : '') +
      '</div>' +
      tiersHtml +
      '<p class="pdp-buy__guard cc-callout cc-callout--error" data-guard hidden>請先選擇票種</p>' +
      '<div class="pdp-buy__actions">' + qtyHtml() +
        '<button class="btn btn--primary btn--lg pdp-buy__add" type="button" data-pdp-ticket><span data-add-label>選擇票種</span></button>' +
        '<button class="pdp-buy__heart" type="button" data-pdp-wish aria-pressed="false" aria-label="加入願望清單">' + SVG.heart + '</button>' +
      '</div>' +
    '</div>';
  }
  function eventLineupHtml(item) {
    var l = item.lineup || []; if (!l.length) return '';
    return '<section class="pdp-lineup"><h2 class="pdp-lineup__title">卡司陣容</h2><div class="pdp-lineup__list">' +
      l.map(function (n) { return '<span class="pdp-lineup__chip">' + esc(n) + '</span>'; }).join('') + '</div></section>';
  }
  function renderEvent(root, ctx) {
    root.innerHTML =
      '<div class="pdp__page">' +
        '<div class="container container--wide">' +
          crumbsHtml(ctx.item) +
          '<div class="pdp__grid">' + galleryHtml(ctx) + eventBuyHtml(ctx) + '</div>' +
          eventLineupHtml(ctx.item) +
        '</div>' +
        detailsSectionHtml(ctx.item) +
        relatedHtml(ctx.item) +
      '</div>' +
      buyBarHtml(ctx);
    root.setAttribute('data-type', ctx.type);
  }

  /* ── AUCTION — lot gallery + live status + place-bid ── */
  function auctionBuyHtml(ctx) {
    var item = ctx.item;
    var status = auctionStatus(item);
    var cur = item.bid || item.startBid || 0;
    var minNext = cur + (item.bidIncrement || 1000);
    var ended = status === 'ended';
    var statusLabel = ended ? '已結標' : (status === 'ending-soon' ? '即將結標' : '競標進行中');
    var statusMod = ended ? 'status-tag--ended' : (status === 'ending-soon' ? 'status-tag--yellow' : 'status-tag--green');
    return '<div class="pdp-buy">' +
      (item.badge ? '<span class="pdp-buy__badge status-tag status-tag--yellow">' + esc(item.badge) + '</span>' : '') +
      (item.cat ? '<span class="pdp-buy__eyebrow t-eyebrow">' + esc(item.cat) + '</span>' : '') +
      '<h1 class="pdp-buy__title">' + esc(item.name) + '</h1>' +
      '<div class="pdp-auction">' +
        '<div class="pdp-auction__bidrow"><span class="pdp-auction__bidlabel">' + (ended ? '成交價' : '目前出價') + '</span>' +
          '<span class="pdp-auction__bid" data-cur-bid="' + cur + '">NT$ ' + fmt(cur) + '</span></div>' +
        '<div class="pdp-auction__meta">' +
          '<span class="status-tag ' + statusMod + '">' + statusLabel + '</span>' +
          '<span class="pdp-auction__bidders" data-bidders>' + (item.bidders || item.bids || 0) + ' 次出價</span>' +
          '<span class="pdp-auction__time" data-countdown data-ends="' + esc(item.endsISO || item.ends || '') + '">' + countdownText(endMs(item)) + '</span>' +
        '</div>' +
      '</div>' +
      (ended
        ? '<button class="btn btn--lg pdp-buy__add" type="button" disabled>已結標</button>'
        : '<div class="pdp-buy__actions"><button class="btn btn--primary btn--lg pdp-buy__add" type="button" data-pdp-bid><span data-add-label>出價（最低 NT$ ' + fmt(minNext) + '）</span></button>' +
          '<button class="pdp-buy__heart" type="button" data-pdp-wish aria-pressed="false" aria-label="加入願望清單">' + SVG.heart + '</button></div>') +
      '<p class="pdp-buy__note cc-callout">出價前需綁定信用卡驗證；未得標不扣款。</p>' +
      (item.provenance ? '<div class="pdp-provenance"><span class="pdp-provenance__k">來源證明</span><p class="pdp-provenance__text">' + esc(item.provenance) + '</p></div>' : '') +
    '</div>';
  }
  function renderAuction(root, ctx) {
    root.innerHTML =
      '<div class="pdp__page">' +
        '<div class="container container--wide">' +
          crumbsHtml(ctx.item) +
          '<div class="pdp__grid">' + galleryHtml(ctx) + auctionBuyHtml(ctx) + '</div>' +
        '</div>' +
        detailsSectionHtml(ctx.item) +
        relatedHtml(ctx.item) +
      '</div>' +
      buyBarHtml(ctx);
    root.setAttribute('data-type', ctx.type);
  }

  /* ── skeleton (loading) ── */
  function skeletonHtml() {
    return '<div class="container container--wide"><div class="pdp__grid">' +
      '<div class="ds-skeleton ds-skeleton--poster pdp-skel__hero"></div>' +
      '<div class="pdp-skel__buy">' +
        '<div class="ds-skeleton ds-skeleton--line" style="width:40%"></div>' +
        '<div class="ds-skeleton ds-skeleton--line" style="width:80%;height:22px"></div>' +
        '<div class="ds-skeleton ds-skeleton--line" style="width:32%;height:20px"></div>' +
        '<div class="ds-skeleton ds-skeleton--line" style="width:100%;height:52px;margin-top:24px"></div>' +
      '</div></div></div>';
  }

  /* ── not-found ── */
  function notFoundHtml() {
    return '<div class="container container--wide"><div class="ds-empty pdp-empty">' +
      '<span class="ds-empty__title">找不到這件商品</span>' +
      '<span class="ds-empty__desc">這個連結可能已過期，或商品已下架。</span>' +
      '<a class="btn btn--ghost" href="shop.html">回商店逛逛</a></div></div>';
  }

  /* ════════ behaviours ════════ */
  function wire(root, ctx) {
    var qty = 1;
    var picks = {};
    var bundlePicks = {};
    var selectedTier = null;
    var item = ctx.item;
    var heroImg = root.querySelector('[data-hero]');
    var srcs = gallerySources(ctx.id, item);

    function toast(msg, link, ms) { if (window.DSToast) window.DSToast(msg, link, ms); }

    root.addEventListener('click', function (e) {
      /* ── desktop vertical strip thumb swap ── */
      var strip = e.target.closest('.pdp-gallery__strip [data-thumb]');
      if (strip) {
        var i = +strip.getAttribute('data-thumb');
        if (heroImg && srcs[i]) { heroImg.src = srcs[i]; heroImg.alt = esc(item.name); }
        root.querySelectorAll('[data-thumb]').forEach(function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-thumb') === String(i));
        });
        return;
      }
      /* ── mobile carousel thumb swap ── */
      var mThumb = e.target.closest('.pdp-gallery__thumbs-mobile [data-thumb]');
      if (mThumb) {
        var mi = +mThumb.getAttribute('data-thumb');
        if (heroImg && srcs[mi]) { heroImg.src = srcs[mi]; heroImg.alt = esc(item.name); }
        root.querySelectorAll('[data-thumb]').forEach(function (t) {
          t.classList.toggle('is-active', t.getAttribute('data-thumb') === String(mi));
        });
        return;
      }

      var vid = e.target.closest('[data-video]');
      if (vid) { toast('商品影片即將推出'); return; }
      var zoom = e.target.closest('[data-zoom-open]');
      if (zoom && window.DSZoom) { window.DSZoom.open(srcs, currentIndex()); return; }

      /* bundle: component mini-gallery thumb swap */
      var bthumb = e.target.closest('.pdp-bundle-item__thumb');
      if (bthumb) {
        var bci = bthumb.getAttribute('data-citem');
        var bmain = root.querySelector('[data-cmain="' + bci + '"]');
        var bimg = bthumb.querySelector('img');
        if (bmain && bimg) bmain.src = bimg.src;
        root.querySelectorAll('.pdp-bundle-item__thumb[data-citem="' + bci + '"]').forEach(function (t) { t.classList.toggle('is-active', t === bthumb); });
        return;
      }
      /* bundle: per-component variant select */
      var bchip = e.target.closest('.pdp-bundle-chip');
      if (bchip && !bchip.hasAttribute('disabled')) {
        var bcidx = bchip.getAttribute('data-cidx');
        bundlePicks[bcidx] = bchip.getAttribute('data-vval');
        root.querySelectorAll('.pdp-bundle-chip[data-cidx="' + bcidx + '"]').forEach(function (c) {
          var on = c === bchip; c.classList.toggle('is-selected', on); c.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        var bitem = bchip.closest('.pdp-bundle-item'); if (bitem) bitem.classList.remove('is-flagged');
        var g0 = root.querySelector('[data-guard]'); if (g0) g0.hidden = true;
        return;
      }

      /* colour swatch select */
      var swatch = e.target.closest('.pdp-swatch');
      if (swatch && !swatch.hasAttribute('disabled')) {
        var row = swatch.getAttribute('data-vidx');
        picks[row] = swatch.getAttribute('data-vval');
        var colLabel = swatch.getAttribute('data-colour-label') || '';
        root.querySelectorAll('.pdp-swatch[data-vidx="' + row + '"]').forEach(function (s) {
          var on = s === swatch;
          s.classList.toggle('is-selected', on);
          s.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        /* update inline colour name */
        var nameEl = root.querySelector('[data-colour-name-' + row + ']');
        if (nameEl) nameEl.textContent = colLabel;
        var guard = root.querySelector('[data-guard]'); if (guard) guard.hidden = true;
        return;
      }

      /* size chip select */
      var sizeChip = e.target.closest('.pdp-size-chip');
      if (sizeChip && !sizeChip.hasAttribute('disabled')) {
        var srow = sizeChip.getAttribute('data-vidx');
        picks[srow] = sizeChip.getAttribute('data-vval');
        root.querySelectorAll('.pdp-size-chip[data-vidx="' + srow + '"]').forEach(function (c) {
          var on = c === sizeChip;
          c.classList.toggle('is-selected', on);
          c.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        var sg = root.querySelector('[data-guard]'); if (sg) sg.hidden = true;
        return;
      }

      /* generic chip (fallback variant type) */
      var chip = e.target.closest('.pdp-chip:not(.pdp-bundle-chip)');
      if (chip && !chip.hasAttribute('disabled')) {
        var crow = chip.getAttribute('data-vidx');
        picks[crow] = chip.getAttribute('data-vval');
        root.querySelectorAll('.pdp-chip[data-vidx="' + crow + '"]').forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-selected', on);
          c.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        var cg = root.querySelector('[data-guard]'); if (cg) cg.hidden = true;
        return;
      }

      /* qty */
      if (e.target.closest('[data-qty-inc]')) { qty = Math.min(99, qty + 1); paintQty(); return; }
      if (e.target.closest('[data-qty-dec]')) { qty = Math.max(1, qty - 1); paintQty(); return; }

      /* wishlist (heart icon) */
      var wish = e.target.closest('[data-pdp-wish]');
      if (wish) {
        var on2 = wish.getAttribute('aria-pressed') !== 'true';
        wish.setAttribute('aria-pressed', on2 ? 'true' : 'false');
        wish.setAttribute('aria-label', on2 ? '已加入願望清單' : '加入願望清單');
        toast(on2 ? '已加入願望清單' : '已移除願望清單');
        return;
      }

      /* size guide stub */
      var guide = e.target.closest('[data-size-guide]');
      if (guide) { toast('尺寸指南即將推出'); return; }

      /* event: ticket tier select */
      var tier = e.target.closest('.pdp-tier');
      if (tier && !tier.hasAttribute('disabled')) {
        selectedTier = +tier.getAttribute('data-tier');
        root.querySelectorAll('.pdp-tier').forEach(function (t) { var on = t === tier; t.classList.toggle('is-selected', on); t.setAttribute('aria-checked', on ? 'true' : 'false'); });
        var gt = root.querySelector('[data-guard]'); if (gt) gt.hidden = true;
        var tl = root.querySelector('[data-pdp-ticket] [data-add-label]'); if (tl) tl.textContent = '購票';
        return;
      }

      var redeem = e.target.closest('[data-pdp-redeem]');
      if (redeem) { if (window.ZtorRedeem) window.ZtorRedeem.open(ctx); else toast('兌換功能即將推出'); return; }
      var ticket = e.target.closest('[data-pdp-ticket]');
      if (ticket) {
        if (selectedTier == null && item.ticketTiers && item.ticketTiers.length) { var g3 = root.querySelector('[data-guard]'); if (g3) g3.hidden = false; return; }
        if (window.ZtorTicket) window.ZtorTicket.open(ctx, selectedTier, qty); else toast('購票功能即將推出');
        return;
      }
      var bid = e.target.closest('[data-pdp-bid]');
      if (bid) { if (window.ZtorBid) window.ZtorBid.open(ctx); else toast('出價功能即將推出'); return; }

      /* add to cart */
      var add = e.target.closest('[data-pdp-add]');
      if (add && !add.hasAttribute('disabled')) { doAdd(); return; }
    });

    function currentIndex() {
      var active = root.querySelector('[data-thumb].is-active');
      return active ? Math.max(0, +active.getAttribute('data-thumb') || 0) : 0;
    }
    function paintQty() {
      var v = root.querySelector('[data-qty-val]'); if (v) v.textContent = qty;
    }
    function variantSummary() {
      if (!item.variants || !item.variants.length) return '';
      return item.variants.map(function (v, vi) {
        var val = picks[vi]; if (!val) return null;
        var opt = (v.options || []).filter(function (o) { return o.value === val; })[0];
        return opt ? opt.label : null;
      }).filter(Boolean).join(' / ');
    }
    function allPicked() {
      if (!item.variants) return true;
      for (var vi = 0; vi < item.variants.length; vi++) { if (!picks[vi]) return false; }
      return true;
    }
    function doBundleAdd() {
      var comps = item.components || [];
      var missing = [];
      comps.forEach(function (comp, ci) { if (comp.variants && comp.variants.length && bundlePicks[ci] == null) missing.push(ci); });
      if (missing.length) {
        var guard = root.querySelector('[data-guard]');
        if (guard) { guard.hidden = false; guard.textContent = '請先為套組內的商品選擇選項'; }
        missing.forEach(function (ci) {
          var bi = root.querySelector('.pdp-bundle-item[data-bitem="' + ci + '"]');
          if (bi) { bi.classList.remove('is-flagged'); void bi.offsetWidth; bi.classList.add('is-flagged'); }
        });
        var sec = root.querySelector('.pdp-bundle'); if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (window.ZtorCart) {
        window.ZtorCart.add({ id: ctx.id, title: item.name + '（套組）', price: item.ntd || 0, currency: 'NT$', image: srcs[0], qty: qty });
        toast('「' + item.name + '」已加入購物車', '去結帳', 3600);
        if (window.ZtorCart.openDrawer) window.ZtorCart.openDrawer(add0());
      }
    }
    function doAdd() {
      if (ctx.type === 'bundle') return doBundleAdd();
      if (!allPicked()) {
        var guard = root.querySelector('[data-guard]'); if (guard) guard.hidden = false;
        root.querySelectorAll('.pdp-variant').forEach(function (vr) {
          var vi = vr.getAttribute('data-vrow');
          if (!picks[vi]) { vr.classList.remove('is-flagged'); void vr.offsetWidth; vr.classList.add('is-flagged'); }
        });
        return;
      }
      var vs = variantSummary();
      var lineId = ctx.id + (vs ? '|' + Object.keys(picks).map(function (k) { return picks[k]; }).join('-') : '');
      var title = item.name + (vs ? '（' + vs + '）' : '');
      if (window.ZtorCart) {
        window.ZtorCart.add({ id: lineId, title: title, price: item.ntd || 0, currency: 'NT$', image: srcs[0], qty: qty });
        toast('「' + item.name + '」已加入購物車', '去結帳', 3600);
        if (window.ZtorCart.openDrawer) window.ZtorCart.openDrawer(add0());
      }
    }
    function add0() { return root.querySelector('[data-pdp-add]'); }

    /* mobile sticky buy-bar — reveal when the in-page add button scrolls away */
    var bar = root.querySelector('[data-buybar]');
    var inlineAdd = root.querySelector('.pdp-buy__add');
    if (bar && inlineAdd && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var show = !en.isIntersecting;
          bar.classList.toggle('is-shown', show);
          bar.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      }, { rootMargin: '0px 0px -40px 0px' });
      io.observe(inlineAdd);
    }

    /* auction live countdown */
    if (ctx.type === 'auction') {
      var cdEl = root.querySelector('[data-countdown]');
      if (cdEl) {
        var ctick = function () { cdEl.textContent = countdownText(endMs(item)); };
        ctick();
        setInterval(ctick, 1000);
      }
    }
  }

  /* ════════ init ════════ */
  function init() {
    var root = document.getElementById('pdpRoot');
    if (!root) return;
    var id = (new URLSearchParams(location.search)).get('id');
    root.innerHTML = skeletonHtml();

    requestAnimationFrame(function () {
      var ctx = resolveItem(id);
      if (!ctx) { root.innerHTML = notFoundHtml(); document.title = 'Ztor. 商店 — 找不到商品'; return; }
      document.title = 'Ztor. 商店 — ' + ctx.item.name;
      if (ctx.type === 'bundle') renderBundle(root, ctx);
      else if (ctx.type === 'popcorn') renderPopcorn(root, ctx);
      else if (ctx.type === 'event') renderEvent(root, ctx);
      else if (ctx.type === 'auction') renderAuction(root, ctx);
      else renderGoods(root, ctx);
      wire(root, ctx);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  window.ZTOR_PDP = { init: init, resolveItem: resolveItem };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ════════ DSToast — single global glass toast (PDP + reused by checkout) ════ */
(function () {
  if (window.DSToast) return;
  var el, timer;
  var CHECK = '<svg class="ds-success-tick__svg" viewBox="0 0 36 36"><path class="ds-success-tick__check" fill="none" pathLength="1" d="M10 18.5 l5 5 l11 -12"/></svg>';
  window.DSToast = function (msg, link, ms) {
    if (!el) {
      el = document.createElement('div');
      el.className = 'ds-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = '<span class="ds-toast__dot ds-success-tick" aria-hidden="true">' + CHECK + '</span>' +
      '<span class="ds-toast__msg"></span>' +
      (link ? '<button class="ds-toast__link" type="button"></button>' : '');
    el.querySelector('.ds-toast__msg').textContent = msg;
    if (link) {
      var lk = el.querySelector('.ds-toast__link');
      lk.textContent = link;
      lk.onclick = function () { if (window.ZtorCart && window.ZtorCart.openDrawer) window.ZtorCart.openDrawer(); };
    }
    void el.offsetWidth;
    el.classList.add('is-shown');
    clearTimeout(timer);
    timer = setTimeout(function () { el.classList.remove('is-shown'); }, ms || 2600);
  };
})();

/* ════════ DSZoom — fullscreen product-image viewer (Farfetch-parity) ════════
   tap/click → fullscreen · hi-res swap on open · pinch-zoom (touch) /
   click-toggle + drag-pan (mouse) · swipe carousel + progress scrubber.
   ONE pointer-unified gesture engine: a small state machine where pointer
   count + zoom state pick the mode, and the mode LOCKS for the gesture
   (mode-thrash is what made the old +/− version feel janky). Two fingers
   always win → pinch; zoom is around the FOCAL point (glued to the fingers),
   never the centre. Engine spec by Carmack. Chrome stays on our dark tokens —
   a white field (Farfetch's) would seam against #0a0a0a. */
(function () {
  if (window.DSZoom) return;
  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  var R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

  var MAXS = 4, DBL = 2.5, ARM = 10, TAP = 8, DBLMS = 300;
  var SETTLE = 'transform 280ms cubic-bezier(.23,1,.32,1)', SLIDE = 'transform 340ms cubic-bezier(.23,1,.32,1)';
  var MODE = { IDLE: 0, PENDING: 1, PAN: 2, PINCH: 3, SWIPE: 4 };

  var root, viewport, track, scrubThumb, prevBtn, nextBtn;
  var srcs = [], idx = 0, N = 0, lastFocus;
  var scale = 1, tx = 0, ty = 0;
  var vpW = 0, vpH = 0, C0x = 0, C0y = 0;
  var pointers = new Map(), mode = MODE.IDLE, g = null;
  var lastMidX = 0, lastMidY = 0, lastTapT = 0, lastTapX = 0, lastTapY = 0;

  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function zoomed() { return scale > 1.01; }
  function slideAt(i) { return track ? track.children[i] : null; }
  function curImg() { var s = slideAt(idx); return s ? s.querySelector('img') : null; }
  /* picsum sources (/seed/<id>/<w>/<h>) → a larger variant of the SAME seed;
     other URLs have no known hi-res convention → returned unchanged. */
  function hiResOf(src) { return String(src).replace(/(\/seed\/[^/]+)\/\d+\/\d+/, '$1/1600/2133'); }

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'ds-zoom';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<button class="ds-zoom__close" type="button" data-zoom-close aria-label="關閉">' + X + '</button>' +
      '<button class="ds-zoom__nav ds-zoom__nav--prev" type="button" data-zoom-prev aria-label="上一張">' + L + '</button>' +
      '<button class="ds-zoom__nav ds-zoom__nav--next" type="button" data-zoom-next aria-label="下一張">' + R + '</button>' +
      '<div class="ds-zoom__viewport" role="dialog" aria-modal="true" aria-label="商品圖片放大檢視"><div class="ds-zoom__track"></div></div>' +
      '<div class="ds-zoom__scrub" aria-hidden="true"><span class="ds-zoom__scrub-thumb"></span></div>';
    document.body.appendChild(root);
    viewport = root.querySelector('.ds-zoom__viewport');
    track = root.querySelector('.ds-zoom__track');
    scrubThumb = root.querySelector('.ds-zoom__scrub-thumb');
    prevBtn = root.querySelector('[data-zoom-prev]');
    nextBtn = root.querySelector('[data-zoom-next]');

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-zoom-close]')) return close();
      if (e.target.closest('[data-zoom-prev]')) return go(idx - 1, true);
      if (e.target.closest('[data-zoom-next]')) return go(idx + 1, true);
    });
    document.addEventListener('keydown', function (e) {
      if (!root || root.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') go(idx - 1, true);
      else if (e.key === 'ArrowRight') go(idx + 1, true);
    });

    // gesture surface — Pointer Events drive the engine…
    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    // …and a few raw touch vetoes kill the browser's own pan / pinch-zoom.
    // MUST be non-passive or preventDefault is silently ignored.
    viewport.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    viewport.addEventListener('touchstart', function (e) { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    viewport.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    window.addEventListener('resize', onResize);
  }

  function measure() {
    var r = viewport.getBoundingClientRect();
    vpW = r.width; vpH = r.height; C0x = r.left + vpW / 2; C0y = r.top + vpH / 2;
  }
  function onResize() {
    if (!root || root.getAttribute('aria-hidden') === 'true') return;
    measure(); paintTrack(0, false); clampPan(); paintImg(false);
  }

  /* ── transform writers — raw style.transform (never a CSS var → no child
        recalc), transition OFF during a live gesture, ON only for the settle ── */
  function paintImg(anim) {
    var im = curImg(); if (!im) return;
    im.style.transition = anim ? SETTLE : 'none';
    im.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + scale + ')';
  }
  function paintTrack(dx, anim) {
    track.style.transition = anim ? SLIDE : 'none';
    track.style.transform = 'translate3d(' + (-idx * vpW + (dx || 0)) + 'px,0,0)';
  }
  function clampPan() {
    var im = curImg(); if (!im) return;
    var mx = Math.max(0, (im.offsetWidth * scale - vpW) / 2);
    var my = Math.max(0, (im.offsetHeight * scale - vpH) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  }
  function syncCursor() { var im = curImg(); if (im) im.style.cursor = zoomed() ? 'move' : 'zoom-in'; }
  /* focal-point zoom (centre transform-origin): keep screen point (fx,fy)
     glued as scale goes scale→sNew.  t' = t·k + (focal − restCentre)(1−k).
     midDx/midDy add the pinch-midpoint's own drift so the image follows the hand. */
  function zoomTo(sNew, fx, fy, midDx, midDy, anim) {
    sNew = Math.max(1, Math.min(MAXS, sNew));
    var k = sNew / scale;
    tx = tx * k + (fx - C0x) * (1 - k) + (midDx || 0);
    ty = ty * k + (fy - C0y) * (1 - k) + (midDy || 0);
    scale = sNew;
    if (scale <= 1.01) { scale = 1; tx = 0; ty = 0; } else { clampPan(); }
    paintImg(anim); syncCursor();
  }
  function resetZoom(anim) { scale = 1; tx = 0; ty = 0; paintImg(anim); syncCursor(); }

  /* ── pointer engine ── */
  function twoFinger() {
    var a = null, b = null;
    pointers.forEach(function (p) { if (!a) a = p; else if (!b) b = p; });
    var dx = b.x - a.x, dy = b.y - a.y;
    return { dist: Math.hypot(dx, dy) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  }
  function onDown(e) {
    try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
    if (pointers.size === 2) { beginPinch(); }          // two fingers ALWAYS wins; cancels any pending swipe
    else if (pointers.size === 1) {
      mode = MODE.PENDING;
      g = { sx: e.clientX, sy: e.clientY, stx: tx, sty: ty, lastX: e.clientX, lastT: now(), vx: 0, moved: false, type: e.pointerType, swipeDx: 0 };
    }
  }
  function onMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType });
    if (mode === MODE.PINCH) { updatePinch(); return; }
    if (mode === MODE.PENDING) {
      var dx = e.clientX - g.sx, dy = e.clientY - g.sy;
      if (Math.abs(dx) > TAP || Math.abs(dy) > TAP) g.moved = true;
      if (zoomed()) mode = MODE.PAN;                                  // zoomed → one finger pans
      else if (Math.abs(dx) > ARM && Math.abs(dx) > Math.abs(dy) * 1.2) mode = MODE.SWIPE;  // dominantly-horizontal → page
    }
    var t2 = now(), dt = (t2 - g.lastT) || 1;
    g.vx = (e.clientX - g.lastX) / dt; g.lastX = e.clientX; g.lastT = t2;
    if (mode === MODE.PAN) { tx = g.stx + (e.clientX - g.sx); ty = g.sty + (e.clientY - g.sy); clampPan(); paintImg(false); }
    else if (mode === MODE.SWIPE) {
      var d = e.clientX - g.sx;
      if ((idx === 0 && d > 0) || (idx === N - 1 && d < 0)) d *= 0.35; // rubber-band the ends
      g.swipeDx = d; paintTrack(d, false);
    }
  }
  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (mode === MODE.PINCH) {
      if (pointers.size >= 1) reseatPan();              // one finger remains → continue as pan, re-seated (no jump)
      else { mode = MODE.IDLE; zoomed() ? paintImg(true) : resetZoom(true); }
      return;
    }
    if (mode === MODE.PAN) { if (pointers.size === 0) { mode = MODE.IDLE; paintImg(true); } return; }
    if (mode === MODE.SWIPE) { if (pointers.size === 0) { commitSwipe(); mode = MODE.IDLE; } return; }
    if (mode === MODE.PENDING) { if (!g.moved) handleTap(e); mode = MODE.IDLE; }
  }
  function beginPinch() {
    if (mode === MODE.SWIPE) paintTrack(0, true);       // swipe-becoming-pinch bails cleanly
    mode = MODE.PINCH;
    var m = twoFinger();
    g = { startDist: m.dist, startScale: scale };
    lastMidX = m.mx; lastMidY = m.my;
  }
  function updatePinch() {
    var m = twoFinger();
    zoomTo(g.startScale * (m.dist / g.startDist), m.mx, m.my, m.mx - lastMidX, m.my - lastMidY, false);
    lastMidX = m.mx; lastMidY = m.my;
  }
  function reseatPan() {
    var only = null; pointers.forEach(function (p) { if (!only) only = p; });
    mode = MODE.PAN;
    g = { sx: only.x, sy: only.y, stx: tx, sty: ty, lastX: only.x, lastT: now(), vx: 0, moved: true };
  }
  function commitSwipe() {
    var d = g.swipeDx || 0, fly = Math.abs(g.vx) > 0.5, far = Math.abs(d) > vpW * 0.25, dir = d < 0 ? 1 : -1;
    var edge = (idx === 0 && dir < 0) || (idx === N - 1 && dir > 0);
    if ((fly || far) && !edge) go(idx + dir, true); else paintTrack(0, true);
  }
  function handleTap(e) {
    var fx = e.clientX, fy = e.clientY;
    if (g.type === 'mouse') { zoomed() ? resetZoom(true) : zoomTo(DBL, fx, fy, 0, 0, true); return; }
    var t = now();
    if (t - lastTapT < DBLMS && Math.abs(fx - lastTapX) < 30 && Math.abs(fy - lastTapY) < 30) {
      zoomed() ? resetZoom(true) : zoomTo(DBL, fx, fy, 0, 0, true); lastTapT = 0;
    } else { lastTapT = t; lastTapX = fx; lastTapY = fy; }
  }

  /* ── images + paging ── */
  function resetSlide(im) { if (im) { im.style.transition = 'none'; im.style.transform = 'translate3d(0,0,0) scale(1)'; im.style.cursor = 'zoom-in'; } }
  function go(i, anim) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === idx) { paintTrack(0, anim); return; }
    resetSlide(curImg());                               // clear the outgoing image's transform
    idx = i; scale = 1; tx = 0; ty = 0;
    var ci = curImg(); resetSlide(ci);
    paintTrack(0, anim); updateScrub();
    if (ci && !ci.dataset.hi) loadHi(idx);
    preload(idx - 1); preload(idx + 1);
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === N - 1;
  }
  function loadHi(i) {                                   // decode-then-swap: silent hi-res upgrade, never a blank-then-pop
    var s = slideAt(i); if (!s) return;
    var im = s.querySelector('img'); if (!im || im.dataset.hi) return;
    var hi = hiResOf(srcs[i]);
    if (hi === srcs[i]) { im.dataset.hi = '1'; return; }
    var pre = new Image(); pre.src = hi;
    (pre.decode ? pre.decode() : Promise.resolve()).then(function () { im.src = hi; im.dataset.hi = '1'; }).catch(function () {});
  }
  function preload(i) {                                  // decode the neighbour off the main thread so paging never hitches
    if (i < 0 || i >= N) return;
    var pre = new Image(); pre.src = hiResOf(srcs[i]); if (pre.decode) pre.decode().catch(function () {});
  }
  function updateScrub() {
    if (!scrubThumb || N < 1) return;
    var w = 100 / N;
    scrubThumb.style.width = w + '%';
    scrubThumb.style.left = (idx * w) + '%';
  }

  function open(sources, start) {
    build();
    srcs = (sources || []).slice(); N = srcs.length; idx = Math.max(0, Math.min(N - 1, start || 0));
    lastFocus = document.activeElement;
    var html = '';
    for (var i = 0; i < N; i++) html += '<div class="ds-zoom__slide"><img class="ds-zoom__img" alt="" src="' + String(srcs[i]).replace(/"/g, '&quot;') + '"></div>';
    track.innerHTML = html;
    root.classList.toggle('ds-zoom--single', N < 2);
    updateScrub();
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ds-zoom-open');         // → global iOS-safe scroll-lock (ds.js)
    measure();
    scale = 1; tx = 0; ty = 0;
    paintTrack(0, false); paintImg(false); syncCursor();
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === N - 1;
    loadHi(idx); preload(idx - 1); preload(idx + 1);
    var c = root.querySelector('[data-zoom-close]'); if (c) c.focus();
  }
  function close() {
    if (!root) return;
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ds-zoom-open');
    pointers.clear(); mode = MODE.IDLE;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.DSZoom = { open: open, close: close };
})();
