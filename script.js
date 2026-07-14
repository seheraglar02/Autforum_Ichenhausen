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
});
