
  /* ── NAV SCROLL ── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── HERO KEN-BURNS ── */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    if (heroBg.complete) heroBg.classList.add('loaded');
    else heroBg.addEventListener('load', () => heroBg.classList.add('loaded'));
  }

  /* ── MOBILE MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMobile() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  function closeMobile() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobile();
  }, { passive: true });

  /* Close mobile menu on backdrop tap */
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) closeMobile();
  });

  /* ── ACTIVE NAV LINK ── */
  (function markActive() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const areas = [document.getElementById('mainNav'), document.getElementById('mobileMenu')];
    areas.forEach(area => {
      if (!area) return;
      area.querySelectorAll('a[href]').forEach(a => {
        const target = a.getAttribute('href').split('/').pop();
        if (target === page) {
          a.style.color = '#f87171';
        }
      });
    });
  })();

  /* ── SLIDER ── */
  let current  = 0;
  const track    = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('slideDots');
  let autoTimer;

  if (track && dotsWrap) {
    const total = track.children.length;

    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }

    function updateTrack() {
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current);
      });
    }
    function goTo(n) {
      current = (n + total) % total;
      updateTrack();
      clearInterval(autoTimer);
      startAuto();
    }
    function nextSlide() { goTo(current + 1); }
    function prevSlide()  { goTo(current - 1); }
    function startAuto()  { autoTimer = setInterval(nextSlide, 4500); }
    startAuto();

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', startAuto);

    /* Touch / swipe */
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 40) d > 0 ? nextSlide() : prevSlide();
    });

    /* Keyboard for accessibility */
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft')  prevSlide();
    });

    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
  }

  /* ── COUNTERS ── */
  document.querySelectorAll('.counter').forEach(el => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || el.dataset.done) return;
        el.dataset.done = '1';
        const target   = parseFloat(el.dataset.target);
        const suffix   = el.dataset.suffix || '';
        const isFloat  = el.dataset.float === '1';
        const duration = 1800;
        const t0       = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / duration, 1);
          const v = target * (1 - Math.pow(1 - p, 3));
          el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        })(t0);
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ── SCROLL REVEAL ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ── REDUCED MOTION ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('in');
    });
  }
