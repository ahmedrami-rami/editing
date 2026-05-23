(() => {
  'use strict';

  // ============================
  //  NAV — scroll background
  // ============================
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // ============================
  //  HERO — line reveal on load
  // ============================
  window.addEventListener('load', () => {
    document.querySelectorAll('.reveal-line').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 120 + i * 140);
    });
  });

  // ============================
  //  REVEAL on scroll
  // ============================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  // ============================
  //  SHOWREEL — Apple-style sticky scale
  //  As user scrolls through the section, frame
  //  expands from 60% width / 32px radius
  //  to 100% width / 8px radius.
  // ============================
  const showreel = document.querySelector('.showreel');
  const frame = document.querySelector('.showreel-frame');

  if (showreel && frame) {
    const updateShowreel = () => {
      const rect = showreel.getBoundingClientRect();
      const total = showreel.offsetHeight - window.innerHeight;
      // progress 0 → 1 across the scroll track
      let p = -rect.top / total;
      p = Math.max(0, Math.min(1, p));
      frame.style.setProperty('--p', p.toFixed(3));
    };
    window.addEventListener('scroll', updateShowreel, { passive: true });
    window.addEventListener('resize', updateShowreel);
    updateShowreel();
  }

  // ============================
  //  CUSTOM CURSOR
  // ============================
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot && window.matchMedia('(min-width: 641px)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover state on interactive elements
    document.querySelectorAll('a, button, .work-card, .service-card, .play-btn').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ============================
  //  SERVICE CARDS — mouse-follow gradient
  // ============================
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // ============================
  //  WORK CARDS — subtle 3D tilt
  // ============================
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const media = card.querySelector('.work-media');
    if (!media) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-y * 6).toFixed(2);
      const ry = (x * 8).toFixed(2);
      media.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      media.style.transform = '';
    });
  });

  // ============================
  //  HERO PARALLAX (subtle)
  // ============================
  const heroGradient = document.querySelector('.hero-gradient');
  if (heroGradient) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroGradient.style.transform = `translateY(${y * 0.25}px) scale(${1 + y * 0.0006})`;
      }
    }, { passive: true });
  }

  // ============================
  //  PLAY BUTTON — toy interaction
  // ============================
  const playBtn = document.querySelector('.play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      playBtn.style.transform = 'scale(0.9)';
      setTimeout(() => (playBtn.style.transform = ''), 200);
      // Hook up a real <video> here when you have your showreel mp4
      console.log('Showreel play clicked — wire up your video here.');
    });
  }

  // ============================
  //  Smooth anchor — handled by CSS scroll-behavior;
  //  but offset for fixed nav on direct clicks
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
