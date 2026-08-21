/* ==========================================================================
   Fancybox 6 (@fancyapps/ui) initialisation
   — Lightbox for photo galleries
   — Inline modal popups (feedback / callback form) replacing legacy popups
   Sliders use a lightweight native CSS scroll-snap track (see initCarousels
   below) — Fancybox itself is reserved for the lightbox/modal role it is
   built for.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.Fancybox) return;

  var qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* -------------------- Lightbox for image galleries -------------------- */
  Fancybox.bind('[data-fancybox]', {
    Thumbs: { autoStart: false },
    Toolbar: { display: { left: [], middle: [], right: ['close'] } }
  });

  /* -------------------- Inline modal popups (order / callback forms) -------------------- */
  qsa('[data-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var targetSel = trigger.getAttribute('data-modal');
      var target = qs(targetSel);
      if (!target) return;

      var title = trigger.getAttribute('data-modal-title');
      if (title) {
        var titleEl = qs('[data-modal-title-slot]', target);
        if (titleEl) titleEl.textContent = title;
      }
      var themeInput = qs('input[name="theme"]', target);
      if (themeInput) themeInput.value = title || trigger.getAttribute('data-modal-theme') || '';

      Fancybox.show([{ src: targetSel, type: 'inline' }], {
        dragToClose: false,
      });
    });
  });

  /* -------------------- Slider tracks (scroll-snap + prev/next buttons) -------------------- */
  function initCarousels() {
    qsa('[data-carousel-scroll]').forEach(function (track) {
      var head = track.closest('.wrapper');
      if (!head) return;
      var prevBtn = qs('[data-carousel-prev]', head);
      var nextBtn = qs('[data-carousel-next]', head);
      if (!prevBtn && !nextBtn) return;

      function step() {
        var card = track.firstElementChild;
        var gap = parseFloat(getComputedStyle(track).gap || '24');
        return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      }
      function updateButtons() {
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
        if (nextBtn) nextBtn.disabled = track.scrollLeft >= max;
      }
      if (prevBtn) prevBtn.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
      if (nextBtn) nextBtn.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
      track.addEventListener('scroll', updateButtons, { passive: true });
      updateButtons();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
})();
