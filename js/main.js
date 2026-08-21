/* ==========================================================================
   AUTO SERVICE — main.js
   Navigation, mobile menu, accordion, tabs, phone mask, scroll reveal,
   stub form handling. No external framework, vanilla JS only.
   ========================================================================== */
(function () {
  'use strict';

  /* -------------------- Helpers -------------------- */
  var qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* -------------------- Header: normal at top, fixed once scrolled past it --------------------
     At the top of the page the header sits in normal flow (transparent, "full").
     Once the user scrolls past its own height it re-appears as a fixed, solid bar
     sliding down from the top; scrolling back up removes it again until the page
     is back near the top, where the normal header is visible once more. */
  var headerBar = qs('.head_top');
  var headerSpacer = qs('.head_top_spacer');
  if (headerBar) {
    var headerThreshold = headerBar.offsetHeight || 100;
    var onScrollHeader = function () {
      var fixed = window.scrollY > headerThreshold;
      headerBar.classList.toggle('is_fixed', fixed);
      if (headerSpacer) headerSpacer.classList.toggle('is_active', fixed);
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    window.addEventListener('resize', function () {
      if (!headerBar.classList.contains('is_fixed')) {
        headerThreshold = headerBar.offsetHeight || headerThreshold;
      }
    });
  }

  /* -------------------- Mobile burger menu -------------------- */
  var burger = qs('.burger');
  var mobileMenu = qs('.mobile_menu');
  var overlay = qs('.overlay');

  function closeMobileMenu() {
    if (burger) burger.classList.remove('is_active');
    if (mobileMenu) mobileMenu.classList.remove('is_open');
    if (overlay) overlay.classList.remove('is_visible');
    document.body.classList.remove('no_scroll');
  }
  function toggleMobileMenu() {
    var open = mobileMenu && mobileMenu.classList.contains('is_open');
    if (open) {
      closeMobileMenu();
    } else {
      if (burger) burger.classList.add('is_active');
      if (mobileMenu) mobileMenu.classList.add('is_open');
      if (overlay) overlay.classList.add('is_visible');
      document.body.classList.add('no_scroll');
    }
  }
  if (burger) burger.addEventListener('click', toggleMobileMenu);
  if (overlay) overlay.addEventListener('click', function () {
    closeMobileMenu();
    closeSearch();
    closeAllPhonePanels();
  });

  /* Mobile submenu accordions */
  qsa('.mobile_menu li.has_sub > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var li = a.parentElement;
      var wasOpen = li.classList.contains('is_open');
      qsa('.mobile_menu li.is_open', li.parentElement).forEach(function (sib) {
        if (sib !== li) sib.classList.remove('is_open');
      });
      li.classList.toggle('is_open', !wasOpen);
    });
  });

  /* -------------------- Desktop dropdown nav -------------------- */
  var navItems = qsa('.top_menu li.has_sub');
  navItems.forEach(function (li) {
    var trigger = qs(':scope > a', li);
    var closeTimer;
    function open() { clearTimeout(closeTimer); navItems.forEach(function (o) { if (o !== li) o.classList.remove('is_open'); }); li.classList.add('is_open'); }
    function scheduleClose() { closeTimer = setTimeout(function () { li.classList.remove('is_open'); }, 180); }
    li.addEventListener('mouseenter', open);
    li.addEventListener('mouseleave', scheduleClose);
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        if (window.matchMedia('(hover: none)').matches) {
          e.preventDefault();
          var isOpen = li.classList.contains('is_open');
          navItems.forEach(function (o) { o.classList.remove('is_open'); });
          li.classList.toggle('is_open', !isOpen);
        }
      });
    }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.top_menu')) navItems.forEach(function (o) { o.classList.remove('is_open'); });
  });

  /* -------------------- Header phone dropdown -------------------- */
  var phoneWraps = qsa('.head_top_phone_wrap');
  function closeAllPhonePanels() { phoneWraps.forEach(function (w) { w.classList.remove('is_open'); }); }
  phoneWraps.forEach(function (wrap) {
    var btn = qs('.head_top_phone_btn', wrap);
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = wrap.classList.contains('is_open');
      closeAllPhonePanels();
      wrap.classList.toggle('is_open', !isOpen);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.head_top_phone_wrap')) closeAllPhonePanels();
  });

  /* -------------------- Search overlay -------------------- */
  var searchPanel = qs('.search_panel');
  function openSearch() {
    if (!searchPanel) return;
    searchPanel.classList.add('is_open');
    var input = qs('input', searchPanel);
    if (input) setTimeout(function () { input.focus(); }, 200);
  }
  function closeSearch() { if (searchPanel) searchPanel.classList.remove('is_open'); }
  qsa('[data-search-open]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.preventDefault(); openSearch(); }); });
  qsa('[data-search-close]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.preventDefault(); closeSearch(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSearch(); closeMobileMenu(); } });

  /* -------------------- Accordion (FAQ) -------------------- */
  qsa('.accordion_item').forEach(function (item) {
    var head = qs('.accordion_head', item);
    if (!head) return;
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('is_open');
      qsa('.accordion_item', item.parentElement).forEach(function (i) { i.classList.remove('is_open'); });
      item.classList.toggle('is_open', !isOpen);
    });
  });

  /* -------------------- Sidebar nav submenu (services categories) --------------------
     The chevron is a <span> nested inside the link: clicking it must toggle the
     submenu instead of following the link, clicking the rest of the link still
     navigates normally. */
  qsa('.side_nav_toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var li = toggle.closest('.has_sub');
      if (li) li.classList.toggle('is_open');
    });
  });

  /* -------------------- Tabs (services) -------------------- */
  qsa('[data-tabs]').forEach(function (tabsRoot) {
    var buttons = qsa('[data-tab-btn]', tabsRoot);
    var panes = qsa('[data-tab-pane]', tabsRoot);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab-btn');
        buttons.forEach(function (b) { b.classList.toggle('is_active', b === btn); });
        panes.forEach(function (p) { p.classList.toggle('is_active', p.getAttribute('data-tab-pane') === target); });
      });
    });
  });

  /* -------------------- Phone number mask -------------------- */
  function attachPhoneMask(input) {
    input.addEventListener('input', function () {
      var digits = input.value.replace(/\D/g, '');
      if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
      digits = digits.slice(0, 10);
      var out = '+7';
      if (digits.length > 0) out += ' (' + digits.slice(0, 3);
      if (digits.length >= 3) out += ')';
      if (digits.length > 3) out += ' ' + digits.slice(3, 6);
      if (digits.length > 6) out += ' ' + digits.slice(6, 8);
      if (digits.length > 8) out += ' ' + digits.slice(8, 10);
      input.value = out;
    });
    input.addEventListener('focus', function () { if (!input.value) input.value = '+7 '; });
  }
  qsa('input[type="tel"]').forEach(attachPhoneMask);

  /* -------------------- Stub form submit (no backend — visual only) -------------------- */
  qsa('form[data-stub-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successBox = qs('.modal_success', form.parentElement) || qs('.modal_success', form);
      var submitBtn = qs('button[type="submit"], input[type="submit"]', form);
      if (submitBtn) { submitBtn.disabled = true; }
      setTimeout(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (successBox) {
          successBox.classList.add('is_visible');
          setTimeout(function () { successBox.classList.remove('is_visible'); }, 4000);
        }
        form.reset();
      }, 500);
    });
  });

  /* -------------------- Back to top -------------------- */
  var toTop = qs('.back_to_top');
  if (toTop) {
    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------- Scroll reveal (IntersectionObserver) -------------------- */
  var revealTargets = qsa('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is_visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is_visible'); });
  }

  /* Close mobile menu / search on nav link click */
  qsa('.mobile_menu a:not(.has_sub > a)').forEach(function (a) {
    a.addEventListener('click', function () { closeMobileMenu(); });
  });
})();
