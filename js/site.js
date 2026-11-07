(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const mobileBreakpoint = 1120;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // Small analytics adapter. It is intentionally inert until a consent-aware provider is configured.
  window.RRAnalytics = window.RRAnalytics || {
    track(eventName, data = {}) {
      if (window.RR_ANALYTICS_DEBUG) console.info('[Rhythm Raatri analytics]', eventName, data);
    },
  };

  const normalizePath = (pathname) => {
    let value = pathname.replace(/index\.html$/i, '');
    if (!value.startsWith('/')) value = `/${value}`;
    value = value.replace(/\/{2,}/g, '/');
    return value.endsWith('/') ? value : `${value}/`;
  };

  const setMenuOpen = (open, { returnFocus = false } = {}) => {
    if (!menuToggle || !nav) return;
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    root.classList.toggle('mobile-menu-open', open);
    if (!open) nav.querySelectorAll('.nav-dropdown[open]').forEach((item) => { item.open = false; });
    if (returnFocus) menuToggle.focus({ preventScroll: true });
  };

  // Header scroll treatment.
  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 36);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Accessible mobile navigation. The menu remains visible as a normal list when JS is unavailable.
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      setMenuOpen(open);
    });

    nav.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      setMenuOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
      if (header && !header.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const openDropdown = nav.querySelector('.nav-dropdown[open]');
      if (openDropdown) {
        openDropdown.open = false;
        openDropdown.querySelector('summary')?.focus({ preventScroll: true });
        return;
      }
      if (menuToggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, { returnFocus: true });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > mobileBreakpoint) setMenuOpen(false);
    }, { passive: true });

    // Close an open desktop dropdown after a click elsewhere.
    document.addEventListener('click', (event) => {
      nav.querySelectorAll('.nav-dropdown[open]').forEach((dropdown) => {
        if (!dropdown.contains(event.target)) dropdown.open = false;
      });
    });
  }

  // Mark the best matching navigation item, including section parents on nested pages.
  const currentPath = normalizePath(window.location.pathname);
  document.querySelectorAll('.primary-nav a[href]').forEach((anchor) => {
    try {
      const target = new URL(anchor.getAttribute('href'), document.baseURI);
      if (target.origin !== window.location.origin) return;
      const targetPath = normalizePath(target.pathname);
      if (targetPath === currentPath || (targetPath !== '/' && currentPath.startsWith(targetPath))) {
        anchor.setAttribute('aria-current', 'page');
      }
    } catch (_) { /* Ignore non-navigation or malformed URLs. */ }
  });
  const experiencesDropdown = nav?.querySelector('.nav-dropdown');
  if (experiencesDropdown && currentPath.startsWith('/experiences/')) {
    experiencesDropdown.querySelector('summary')?.setAttribute('aria-current', 'page');
  }

  // Progressive reveal. Without IntersectionObserver, reveal immediately.
  const revealItems = [...document.querySelectorAll('.reveal')];
  let revealObserver = null;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Portfolio filtering (on pages where the filter controls exist).
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const portfolioTiles = [...document.querySelectorAll('[data-category]')];
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      portfolioTiles.forEach((tile) => {
        tile.hidden = !(filter === 'all' || tile.dataset.category === filter);
      });
    });
  });

  // Contact action tracking.
  document.querySelectorAll('a[href^="https://wa.me/"], a[href^="tel:"], a[href^="mailto:"]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      const href = anchor.getAttribute('href') || '';
      const type = href.startsWith('https://wa.me/') ? 'whatsapp_click' : href.startsWith('tel:') ? 'phone_click' : 'email_click';
      window.RRAnalytics.track(type, { location: window.location.pathname });
    });
  });
  document.querySelectorAll('a[href]').forEach((anchor) => {
    try {
      const target = new URL(anchor.getAttribute('href'), document.baseURI);
      if (target.origin === window.location.origin && normalizePath(target.pathname) === '/contact/') {
        anchor.addEventListener('click', () => window.RRAnalytics.track('consultation_cta_click', { location: window.location.pathname }));
      }
    } catch (_) { /* Ignore non-URL links. */ }
  });

  // Multi-step static enquiry form. It prepares an email draft; it does not claim to send email.
  const form = document.querySelector('#enquiry-form');
  if (form) {
    const steps = [...form.querySelectorAll('fieldset[data-step]')];
    const progressItems = [...form.querySelectorAll('[data-progress]')];
    const status = form.querySelector('[data-form-status]');
    const nextButtons = [...form.querySelectorAll('[data-next]')];
    const backButtons = [...form.querySelectorAll('[data-back]')];
    const submitButton = form.querySelector('[data-submit]');
    let activeStep = 1;

    form.classList.add('is-enhanced');

    const setStatus = (message, type = '') => {
      if (!status) return;
      status.textContent = message;
      status.className = `form-status${type ? ` is-${type}` : ''}`;
    };

    const stepFieldset = (step) => steps.find((fieldset) => Number(fieldset.dataset.step) === step);
    const showStep = (step, focusLegend = false) => {
      activeStep = Math.max(1, Math.min(steps.length, step));
      steps.forEach((fieldset) => { fieldset.hidden = Number(fieldset.dataset.step) !== activeStep; });
      progressItems.forEach((item) => {
        const number = Number(item.dataset.progress);
        item.classList.toggle('is-current', number === activeStep);
        item.classList.toggle('is-complete', number < activeStep);
        item.setAttribute('aria-current', number === activeStep ? 'step' : 'false');
      });
      setStatus('');
      if (focusLegend) {
        const legend = stepFieldset(activeStep)?.querySelector('legend');
        if (legend) {
          legend.setAttribute('tabindex', '-1');
          legend.focus({ preventScroll: true });
        }
      }
    };

    const firstInvalidControl = (step) => {
      const fieldset = stepFieldset(step);
      if (!fieldset) return null;
      return [...fieldset.querySelectorAll('input, select, textarea')].find((control) =>
        !control.disabled && control.type !== 'hidden' && control.name !== 'website' && !control.checkValidity()
      ) || null;
    };

    const validateStep = (step) => {
      const invalid = firstInvalidControl(step);
      if (!invalid) return true;
      showStep(step);
      invalid.reportValidity();
      invalid.focus({ preventScroll: false });
      setStatus('Please complete the required fields in this step.', 'error');
      return false;
    };

    nextButtons.forEach((button) => button.addEventListener('click', () => {
      if (validateStep(activeStep)) showStep(activeStep + 1, true);
    }));
    backButtons.forEach((button) => button.addEventListener('click', () => showStep(activeStep - 1, true)));
    showStep(1);

    form.addEventListener('submit', (event) => {
      if (!form.classList.contains('is-enhanced')) return;
      event.preventDefault();

      for (let step = 1; step <= steps.length; step += 1) {
        if (!validateStep(step)) return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());
      if (payload.website) return; // Honeypot: discard automated submissions.
      delete payload.website;

      const fieldLabels = {
        name: 'Full name', phone: 'Phone number', email: 'Email address',
        preferredContact: 'Preferred contact method', eventCategory: 'Event category',
        eventDate: 'Tentative event date', eventLocation: 'Event location',
        guestCount: 'Approximate guest count', eventDays: 'Number of event days',
        services: 'Services required', investmentRange: 'Approximate investment range',
        message: 'Additional details', consent: 'Contact consent',
      };
      const lines = [
        'Hello Rhythm ∞ Raatri,', '',
        'I would like to enquire about event planning and management services.', '',
      ];
      Object.entries(payload).forEach(([key, value]) => {
        if (value) lines.push(`${fieldLabels[key] || key}: ${value}`);
      });
      lines.push('', 'Please contact me to discuss the next steps.', '', 'Thank you.');

      const subject = `Event enquiry — ${payload.name || 'Rhythm ∞ Raatri'}`;
      const mailto = `mailto:info@rhythmooraatri.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      setStatus('Your email application should open with the enquiry details prepared. Please review the draft and press Send. This website does not send the email automatically. If no email application opens, write to info@rhythmooraatri.com or contact us on WhatsApp at +91 97759 91175.', 'success');
      window.RRAnalytics.track('enquiry_email_draft_opened', { location: window.location.pathname });
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Opening email draft…';
      }
      window.location.href = mailto;
      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Open email draft ↗';
        }
      }, 1200);
    });
  }

  // Add the enhancement class only after all setup has completed. If this script fails,
  // the mobile navigation and page content remain visible instead of becoming inaccessible.
  if (revealObserver) revealItems.forEach((item) => revealObserver.observe(item));
  root.classList.add('js-ready');
})();
