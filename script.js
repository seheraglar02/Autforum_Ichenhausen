// Autoforum Ichenhausen – Header & Mobile Navigation

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  const setNavOpen = (open) => {
    mainNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  navToggle.addEventListener('click', () => {
    setNavOpen(!mainNav.classList.contains('is-open'));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const lightSections = document.querySelectorAll('.vehicles, .testimonials, .contact');
  if (lightSections.length && 'IntersectionObserver' in window) {
    const activeLight = new Set();
    let lightObserver;

    const setupLightObserver = () => {
      if (lightObserver) lightObserver.disconnect();
      activeLight.clear();
      const headerHeight = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
      lightObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeLight.add(entry.target);
          } else {
            activeLight.delete(entry.target);
          }
        });
        header.classList.toggle('is-light', activeLight.size > 0);
      }, {
        rootMargin: `0px 0px -${window.innerHeight - headerHeight}px 0px`,
        threshold: 0,
      });
      lightSections.forEach((section) => lightObserver.observe(section));
    };

    setupLightObserver();
    window.addEventListener('resize', setupLightObserver, { passive: true });
  }

  const navLinks = Array.from(mainNav.querySelectorAll('a[href^="#"]'));
  const sectionTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sectionTargets.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = navLinks.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
        if (link) link.classList.toggle('is-active', entry.isIntersecting);
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    });
    sectionTargets.forEach((section) => sectionObserver.observe(section));
  }

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  const choices = Array.from(document.querySelectorAll('.call-choice')).map((wrapper) => ({
    wrapper,
    trigger: wrapper.querySelector('.call-choice-trigger'),
    menu: wrapper.querySelector('.call-choice-menu'),
  })).filter(({ trigger, menu }) => trigger && menu);

  const setChoiceOpen = (choice, open) => {
    choice.menu.hidden = !open;
    choice.trigger.setAttribute('aria-expanded', String(open));
  };

  choices.forEach((choice) => {
    choice.trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = choice.menu.hidden;
      choices.forEach((other) => setChoiceOpen(other, other === choice && willOpen));
    });
  });

  document.addEventListener('click', (event) => {
    choices.forEach((choice) => {
      if (!choice.menu.hidden && !choice.menu.contains(event.target) && event.target !== choice.trigger) {
        setChoiceOpen(choice, false);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    choices.forEach((choice) => {
      if (!choice.menu.hidden) {
        setChoiceOpen(choice, false);
        choice.trigger.focus();
      }
    });
  });

  // Scroll-Reveal-Animationen
  const revealEls = Array.from(document.querySelectorAll('.reveal, .reveal-scale'));
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      });
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // Zähl-Animation für die Kennzahlen (Facts)
  const factsList = document.querySelector('.facts-list');
  const factNumbers = Array.from(document.querySelectorAll('.fact-number'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const parseFactValue = (text) => {
    const match = text.trim().match(/^(\D*)([\d.,]+)(\D*)$/);
    if (!match) return null;
    const [, prefix, numeric, suffix] = match;
    const separator = numeric.includes(',') ? ',' : (numeric.includes('.') ? '.' : '');
    const decimals = separator ? numeric.split(separator)[1].length : 0;
    const value = parseFloat(numeric.replace(',', '.'));
    return { prefix, suffix, separator, decimals, value };
  };

  const animateCount = (el, { prefix, suffix, separator, decimals, value }) => {
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      const formatted = decimals
        ? current.toFixed(decimals).replace('.', separator)
        : Math.round(current).toString();
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  if (factsList && factNumbers.length && !prefersReducedMotion) {
    const parsedFacts = factNumbers
      .map((el) => ({ el, data: parseFactValue(el.textContent) }))
      .filter(({ data }) => data);

    if (parsedFacts.length) {
      if ('IntersectionObserver' in window) {
        const factsObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              parsedFacts.forEach(({ el, data }) => animateCount(el, data));
              obs.disconnect();
            }
          });
        }, { threshold: 0.4 });
        factsObserver.observe(factsList);
      }
    }
  }

});
