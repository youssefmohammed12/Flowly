/* ==========================================================================
   Flowly — Landing page scripts (vanilla JS)
   Navbar · mobile menu · pricing · FAQ · reveal + product motion ·
   counters · modals · prototype forms
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) document.documentElement.classList.add('js-anim');

  /* ---------- 1. Sticky navbar state ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.hidden = true;
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeMenu(); return; }
      mobileMenu.hidden = false;
      navToggle.setAttribute('aria-expanded', 'true');
    });
    // Close drawer after tapping any link or button inside it
    mobileMenu.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    // Close on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) closeMenu();
    });
  }

  /* ---------- 3. Pricing toggle (monthly / annual) ---------- */
  const btnMonthly = document.getElementById('btnMonthly');
  const btnAnnual  = document.getElementById('btnAnnual');
  const amounts    = document.querySelectorAll('.price .amount');
  if (btnMonthly && btnAnnual && amounts.length) {
    const setBilling = (period) => {
      const isAnnual = period === 'annual';
      btnMonthly.setAttribute('aria-pressed', String(!isAnnual));
      btnAnnual.setAttribute('aria-pressed', String(isAnnual));
      amounts.forEach(el => {
        el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        if (prefersReducedMotion) return;
        el.classList.remove('tick');
        void el.offsetWidth; // restart animation
        el.classList.add('tick');
      });
    };
    btnMonthly.addEventListener('click', () => setBilling('monthly'));
    btnAnnual.addEventListener('click', () => setBilling('annual'));
  }

  /* ---------- 4. FAQ accordion (smooth open/close, reduced-motion safe) ---------- */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    if (!panel.hidden) panel.classList.add('is-open'); // first item starts open
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) {
        // Smooth close: animate first, then hide for screen readers.
        if (prefersReducedMotion) { panel.hidden = true; panel.classList.remove('is-open'); return; }
        panel.classList.remove('is-open');
        window.setTimeout(() => { if (btn.getAttribute('aria-expanded') !== 'true') panel.hidden = true; }, 280);
      } else {
        panel.hidden = false;
        // Force reflow so the grid-rows transition plays.
        void panel.offsetWidth;
        panel.classList.add('is-open');
      }
    });
  });

  /* ---------- 5. Scroll reveal + one-shot product animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const productEls = document.querySelectorAll('[data-animate-product]');
  // Remember each progress bar's target width (from its inline style or data-w)
  // so CSS can animate 0 → target via --w-fill.
  productEls.forEach(root => {
    root.querySelectorAll('.progress span').forEach(bar => {
      const target = bar.dataset.w || bar.style.width || '72%';
      bar.style.setProperty('--w-fill', target);
    });
  });
  const markAnimated = (el) => {
    el.classList.add('visible');
    if (el.hasAttribute('data-animate-product')) el.classList.add('is-animated');
  };
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(markAnimated);
    productEls.forEach(el => el.classList.add('is-animated'));
  } else {
    // One shared observer handles both section reveals and mini product visuals.
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          markAnimated(entry.target);
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => animObserver.observe(el));
    productEls.forEach(el => { if (!el.classList.contains('reveal')) animObserver.observe(el); });
  }

  /* ---------- 6. Animated stat counters (scoped to the stats band) ---------- */
  const counters = document.querySelectorAll('.stats-band .count');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const stat = el.closest('.stat');
    if (!Number.isFinite(target)) return;
    if (prefersReducedMotion) { el.textContent = target.toFixed(decimals); if (stat) stat.classList.add('pop'); return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else if (stat) stat.classList.add('pop');
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- 7. Modal system (demo / signup / login) ----------
     Frontend prototype only — forms simulate success and send nothing. */
  const overlay   = document.getElementById('modalOverlay');
  const modalEl   = overlay ? overlay.querySelector('.modal-card') : null;
  const closeBtn  = overlay ? overlay.querySelector('.modal-close') : null;
  const panels    = overlay ? overlay.querySelectorAll('.modal-panel') : [];
  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea';
  let lastTrigger = null;
  let lastTriggerFromMobile = false;

  const signupForm     = document.getElementById('signupForm');
  const signupConfirm  = document.getElementById('signupConfirm');
  const confirmHeading = document.getElementById('signupConfirmTitle');
  const planLine       = document.getElementById('signupPlanLine');
  const loginForm      = document.getElementById('loginForm');
  const loginNote      = document.getElementById('loginNote');
  const newsletterForm = document.querySelector('.newsletter');
  const yearEl         = document.getElementById('year');

  // Note: newsletter + footer-year run before the modal guard below so they
  // always work even if a modal node is ever missing from the markup.
  // Demo-only newsletter: replaces the form with a confirmation, sends nothing.
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = document.createElement('p');
      ok.className = 'newsletter-ok';
      ok.textContent = "Thanks — you're on the list.";
      newsletterForm.replaceWith(ok);
    });
  }
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (!overlay || !modalEl || !closeBtn || !signupForm || !signupConfirm || !loginForm || !loginNote) return;

  /* Scroll lock that preserves the sticky navbar + scroll position.
     body{overflow:hidden} breaks `position: sticky` (header scrolls away)
     and can reset the page scroll on close — so we freeze via position:fixed
     and restore the exact Y offset afterwards. */
  let savedScrollY = 0;
  function lockScroll() {
    if (document.body.classList.contains('modal-open')) return; // already locked (e.g. login → signup switch)
    savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${savedScrollY}px`;
  }
  function unlockScroll() {
    if (!document.body.classList.contains('modal-open')) return;
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    // 'instant' so the html{scroll-behavior:smooth} rule doesn't glide the page back
    try { window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, savedScrollY); }
  }

  function setPlan(plan) {
    if (!planLine) return;
    planLine.hidden = !plan;
    if (plan) {
      planLine.textContent = '';
      planLine.append('Selected plan: ');
      const strong = document.createElement('b');
      strong.textContent = plan; // safe: never inject trigger data as HTML
      planLine.append(strong, ' · 14-day free trial');
    }
  }

  function openModal(name, trigger) {
    panels.forEach(p => { p.hidden = p.dataset.panel !== name; });
    const heading = overlay.querySelector('.modal-panel:not([hidden]) .modal-title');
    if (heading) modalEl.setAttribute('aria-labelledby', heading.id);

    // Always start signup from a fresh form
    signupForm.hidden = false;
    signupConfirm.hidden = true;
    // Clear any stale signup validation state
    ['su-email', 'su-size'].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.removeAttribute('aria-invalid');
    });
    signupForm.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; el.hidden = true; });

    lastTrigger = trigger || null;
    overlay.hidden = false;
    lockScroll(); // freeze background scroll without breaking sticky header

    // Move keyboard focus into the dialog without scrolling the page behind it.
    // Fall back to the close button when a panel has no focusable field (keeps Tab trapped).
    const first = overlay.querySelector('.modal-panel:not([hidden]) input, .modal-panel:not([hidden]) select, .modal-panel:not([hidden]) .demo-tab');
    (first || closeBtn).focus({ preventScroll: true });
  }

  function closeModal() {
    overlay.hidden = true;
    unlockScroll(); // restores the exact scroll position
    // If opened from the mobile drawer, that trigger is hidden again — return to the hamburger instead.
    if (lastTriggerFromMobile && navToggle) navToggle.focus({ preventScroll: true });
    else if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
    lastTriggerFromMobile = false;
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remember mobile-drawer origin BEFORE hiding (incl. login <-> signup switches inside the modal).
      if (mobileMenu && !mobileMenu.hidden && mobileMenu.contains(btn)) lastTriggerFromMobile = true;
      else if (!overlay || overlay.hidden) lastTriggerFromMobile = false;
      // Close the mobile drawer first if it is open (same behavior as tapping a drawer link)
      if (mobileMenu && navToggle && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        navToggle.setAttribute('aria-expanded', 'false');
      }
      setPlan(btn.dataset.plan || '');
      openModal(btn.dataset.openModal, btn);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));

  // Close when clicking the dark backdrop itself (not the dialog)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      // Keep keyboard focus inside the open dialog (based on visibility, not layout).
      // The close button has no panel ancestor, so include it explicitly.
      const focusable = [...overlay.querySelectorAll(FOCUSABLE)]
        .filter(el => !el.disabled && el.getAttribute('aria-hidden') !== 'true'
          && (el === closeBtn || el.closest('.modal-panel:not([hidden])')));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- 9. Demo view switcher (Board / Timeline / Workload) ----------
     Prototype tabs: buttons toggle which demo view is shown. */
  const demoTabs = [...overlay.querySelectorAll('.demo-tab')];
  demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      demoTabs.forEach(t => t.setAttribute('aria-pressed', String(t === tab)));
      overlay.querySelectorAll('.demo-view').forEach(v => { v.hidden = v.dataset.view !== tab.dataset.view; });
    });
  });

  /* ---------- 10. Signup prototype form ----------
     Frontend-only validation: email required + format, team size required.
     Name is optional. Success state shows only when valid; nothing is sent. */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const suEmail = document.getElementById('su-email');
  const suSize = document.getElementById('su-size');
  const suEmailError = document.getElementById('su-email-error');
  const suSizeError = document.getElementById('su-size-error');
  const showFieldError = (field, errEl, message) => {
    if (errEl) { errEl.textContent = message; errEl.hidden = false; }
    if (field) field.setAttribute('aria-invalid', 'true');
  };
  const clearFieldError = (field, errEl) => {
    if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
    if (field) field.removeAttribute('aria-invalid');
  };
  if (suEmail && suSize) {
    suEmail.addEventListener('input', () => clearFieldError(suEmail, suEmailError));
    suSize.addEventListener('change', () => clearFieldError(suSize, suSizeError));
  }
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = suEmail ? suEmail.value.trim() : '';
    let firstInvalid = null;
    if (!email) {
      showFieldError(suEmail, suEmailError, 'Enter your work email address.');
      firstInvalid = firstInvalid || suEmail;
    } else if (!EMAIL_RE.test(email)) {
      showFieldError(suEmail, suEmailError, 'Enter a valid email address, like you@company.com.');
      firstInvalid = firstInvalid || suEmail;
    } else {
      clearFieldError(suEmail, suEmailError);
    }
    if (suSize && !suSize.value) {
      showFieldError(suSize, suSizeError, 'Select your team size to continue.');
      firstInvalid = firstInvalid || suSize;
    } else {
      clearFieldError(suSize, suSizeError);
    }
    // Never show the confirmation state while required fields are invalid.
    if (firstInvalid) { firstInvalid.focus({ preventScroll: true }); return; }
    // Demo behavior: show confirmation, send nothing anywhere.
    signupForm.hidden = true;
    signupConfirm.hidden = false;
    if (confirmHeading) confirmHeading.focus({ preventScroll: true });
  });

  /* ---------- 11. Login prototype interactions ---------- */
  const pwToggle = document.getElementById('pwToggle');
  const passInput = document.getElementById('li-pass');
  const inputWrap = passInput ? passInput.closest('.input-wrap') : null;
  const forgotBtn = document.getElementById('forgotBtn');
  const forgotNote = document.getElementById('forgotNote');
  const googleBtn = document.getElementById('googleBtn');

  // Password visibility toggle
  if (pwToggle && passInput && inputWrap) {
    pwToggle.addEventListener('click', () => {
      const isHidden = passInput.type === 'password';
      passInput.type = isHidden ? 'text' : 'password';
      inputWrap.classList.toggle('revealed', isHidden);
      pwToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      pwToggle.setAttribute('aria-pressed', String(isHidden));
    });
  }

  // Forgot password — prototype message
  if (forgotBtn && forgotNote) {
    forgotBtn.addEventListener('click', () => {
      forgotNote.hidden = !forgotNote.hidden;
      if (!forgotNote.hidden) {
        // Make the status message programmatically focusable, then focus without scrolling
        if (!forgotNote.hasAttribute('tabindex')) forgotNote.setAttribute('tabindex', '-1');
        forgotNote.focus({ preventScroll: true });
      }
    });
  }

  // Continue with Google — prototype behavior
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      googleBtn.textContent = 'Design prototype — no real auth provider.';
      googleBtn.disabled = true;
    });
  }

  // Login form — client-side validation, then prototype message
  const loginEmail = document.getElementById('li-email');
  if (loginEmail && passInput) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      if (!loginEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value.trim())) {
        loginEmail.focus();
        ok = false;
      }
      if (!passInput.value) {
        if (ok) passInput.focus();
        ok = false;
      }
      if (!ok) return;
      // Demo behavior: demonstrate the intended UI, no real authentication.
      loginNote.hidden = false;
    });
  }
})();
