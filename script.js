// ============================================================
// OBSIDIAN — interactions
// ============================================================
(() => {
  'use strict';

  const html = document.documentElement;
  const isTouch = matchMedia('(hover:none), (pointer:coarse)').matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  let progress = 0;
  const fillTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) progress = 100;
    preloaderFill.style.width = progress + '%';
    if (progress >= 100) clearInterval(fillTimer);
  }, 120);

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloaderFill.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('done');
        const heroEl = document.getElementById('hero');
        if (heroEl) heroEl.classList.add('in-view');
      }, 250);
    }, 350);
  });

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('obsidian-theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') html.removeAttribute('data-theme');
    else html.setAttribute('data-theme', 'light');
    localStorage.setItem('obsidian-theme', next);
  });

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  if (!isTouch) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let gx = mx, gy = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    (function loopGlow() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      cursorGlow.style.left = gx + 'px';
      cursorGlow.style.top = gy + 'px';
      requestAnimationFrame(loopGlow);
    })();

    document.querySelectorAll('a, button, .residence-card, .feature-card, input, textarea, select, .compare')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
      });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const maxShift = 16;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        const x = Math.max(-maxShift, Math.min(maxShift, relX * 0.28));
        const y = Math.max(-maxShift, Math.min(maxShift, relY * 0.35));
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- Tilt on cards ---------- */
  if (!isTouch) {
    function attachTilt(el, strength) {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * strength}deg) rotateY(${px * strength}deg) scale3d(1.01,1.01,1.01)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    }
    document.querySelectorAll('[data-tilt]').forEach(el => attachTilt(el, 8));
    document.querySelectorAll('[data-tilt-soft]').forEach(el => attachTilt(el, 4));
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = pct + '%';

    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 700);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero parallax on mouse ---------- */
  const heroImg = document.getElementById('heroImg');
  if (!isTouch && heroImg) {
    window.addEventListener('mousemove', (e) => {
      const px = (e.clientX / innerWidth - 0.5) * 20;
      const py = (e.clientY / innerHeight - 0.5) * 20;
      heroImg.style.transform = `translate3d(${px}px, ${py}px, 0) scale(1.08)`;
    });
  }
  window.addEventListener('scroll', () => {
    if (!heroImg) return;
    const y = window.scrollY;
    heroImg.style.filter = `saturate(.85) brightness(${Math.max(0.3, 0.55 - y * 0.0003)})`;
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    burger.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Compare slider (day/night) ---------- */
  const compare = document.getElementById('compare');
  const compareNight = document.getElementById('compareNight');
  const compareHandle = document.getElementById('compareHandle');
  if (compare) {
    let dragging = false;
    function setPos(clientX) {
      const r = compare.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      compareNight.style.clipPath = `inset(0 0 0 ${pct}%)`;
      compareHandle.style.left = pct + '%';
    }
    compare.addEventListener('pointerdown', (e) => { dragging = true; setPos(e.clientX); });
    window.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener('pointerup', () => dragging = false);
    // gentle auto demo sweep once, on first view
    const compareIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let t = 0;
          const demo = setInterval(() => {
            t += 1;
            const pct = 50 + Math.sin(t / 10) * 12;
            compareNight.style.clipPath = `inset(0 0 0 ${pct}%)`;
            compareHandle.style.left = pct + '%';
            if (t > 60) clearInterval(demo);
          }, 30);
          compareIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    compareIO.observe(compare);
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'Заявка получена. Куратор свяжется с вами в течение 48 часов.';
      contactForm.querySelectorAll('input, textarea').forEach(f => f.value = '');
    });
  }

  /* ---------- Scroll to top button (created dynamically) ---------- */
  const topBtn = document.createElement('button');
  topBtn.className = 'scroll-top magnetic';
  topBtn.id = 'scrollTopBtn';
  topBtn.setAttribute('aria-label', 'Наверх');
  topBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M8 3L3 8M8 3L13 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (!isTouch) {
    topBtn.addEventListener('mouseenter', () => cursorDot && cursorDot.classList.add('hover'));
    topBtn.addEventListener('mouseleave', () => cursorDot && cursorDot.classList.remove('hover'));
    topBtn.addEventListener('mousemove', (e) => {
      const r = topBtn.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width / 2;
      const relY = e.clientY - r.top - r.height / 2;
      topBtn.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
    });
  }
  document.addEventListener('scroll', () => {
    topBtn.classList.toggle('visible', window.scrollY > 700);
  }, { passive: true });

  /* ---------- Filter tabs (residences page) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    const filterCards = document.querySelectorAll('[data-category]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        filterCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.hidden = !show;
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Lightbox for project galleries ---------- */
  const galleryImgs = document.querySelectorAll('.project-gallery img, .article-body img');
  if (galleryImgs.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button><img alt="">';
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector('img');
    galleryImgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  /* ---------- Easter egg: Konami code reveals a hidden note ---------- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = 0;
  window.addEventListener('keydown', (e) => {
    konamiIndex = (e.key === konami[konamiIndex]) ? konamiIndex + 1 : 0;
    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      document.body.style.transition = 'filter 1.2s ease';
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
      setTimeout(() => { document.body.style.filter = ''; }, 1800);
    }
  });

})();
