/* =====================================================
   KEEP HOSTING AUTO REPAIR — INTERACTIONS
   ===================================================== */

(function () {
  'use strict';

  // ===== Mobile menu =====
  const navToggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');

  if (navToggle && drawer) {
    navToggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      })
    );
  }

  // ===== Sticky nav shadow on scroll =====
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Reveal on scroll =====
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger items inside the same parent for a softer reveal
            const parent = entry.target.parentElement;
            const siblings = parent ? Array.from(parent.querySelectorAll(':scope > .reveal')) : [];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx, 6) * 80}ms`;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ===== FAQ — only one open at a time =====
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqs.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ===== Year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Contact form — fallback to WhatsApp =====
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const vehicle = (data.get('vehicle') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !phone || !service) {
        if (status) {
          status.style.color = '#ff6b6b';
          status.textContent = 'Please fill in your name, phone and the service you need.';
        }
        return;
      }

      const lines = [
        `Hi Keep Hosting Auto Repair, I'd like a quote.`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        vehicle ? `Vehicle: ${vehicle}` : null,
        `Service: ${service}`,
        message ? `Details: ${message}` : null,
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/27000000000?text=${text}`;

      if (status) {
        status.style.color = '';
        status.textContent = 'Opening WhatsApp with your details…';
      }

      window.open(waUrl, '_blank', 'noopener');
    });
  }

  // ===== Smooth-scroll offset compensation for sticky nav =====
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
