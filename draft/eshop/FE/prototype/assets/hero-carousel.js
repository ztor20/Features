/* hero-carousel.js — Swiper 11 init + persistent-caption cross-fade.
   Loaded deferred after swiper-bundle.min.js so Swiper is already defined.

   ARCHITECTURE (post-restructure):
   • The .swiper-wrapper slides carry ONLY their background (img / particles).
   • The darken gradients and the 4 caption blocks live at FRAME level
     (.hero-carousel__darken-*, .hero-carousel__captions > .hero-carousel__content),
     OUTSIDE the swiper-wrapper — so they never ride the slide transform.
   • On every slide change we just toggle .is-active on the matching caption;
     CSS cross-fades it in place (opacity). Nothing re-mounts, nothing blanks.

   WHY (the bug this fixes): previously the gradients + text were nested INSIDE
   each swiper-slide and their opacity was driven by GSAP per slide. On swipe —
   and on every loop clone↔real swap — they re-mounted/re-animated together, so
   the vignette and the headline visibly disappeared and reappeared in sync.
   Persistent layers + a pure-CSS cross-fade remove the entire failure class.

   • .is-active is also kept on the original slides so the particle-constellation
     MutationObserver (inline IIFE) still gates its animation.
   • window.__heroSwiper exposed for dev tooling. */

(function () {
  'use strict';

  var carousel = document.querySelector('.hero-carousel');
  if (!carousel || typeof Swiper === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var captions = Array.prototype.slice.call(
    carousel.querySelectorAll('.hero-carousel__content[data-caption]')
  );
  /* Original (non-clone) slides only — index position == realIndex. */
  var slides = Array.prototype.slice.call(
    carousel.querySelectorAll('.hero-carousel__slide:not(.swiper-slide-duplicate)')
  );

  function setActive(realIdx) {
    captions.forEach(function (c) {
      c.classList.toggle('is-active', Number(c.dataset.caption) === realIdx);
    });
    /* particle-constellation gate — watches .is-active on the slide */
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === realIdx);
    });
    /* frame flag → CSS softens darken-left for the constellation slide (0) */
    carousel.dataset.active = String(realIdx);
  }

  var swiper = new Swiper('.hero-carousel', {
    slidesPerView: 1,
    speed: 1260,               /* cinematic slide transition */
    grabCursor: true,
    resistanceRatio: 0.85,
    loop: true,                /* clones now carry only bg → safe to loop */
    autoplay: reduce ? false : {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    navigation: {
      prevEl: '.hero-carousel__nav--prev',
      nextEl: '.hero-carousel__nav--next'
    },
    pagination: {
      el: '.hero-carousel__dots',
      clickable: true,
      bulletClass: 'hero-carousel__dot',
      bulletActiveClass: 'is-active'
    },
    keyboard: { enabled: true },
    a11y: true,
    on: {
      afterInit: function (s) { setActive(s.realIndex); },
      slideChange: function (s) { setActive(s.realIndex); }
    }
  });

  window.__heroSwiper = swiper;

})();
