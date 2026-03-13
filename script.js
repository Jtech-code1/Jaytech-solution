

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  });

  /* ── HERO KEN-BURNS ── */
  document.getElementById('heroBg').classList.add('loaded');

  /* ── MOBILE MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMobile() {
    const isOpen = !mobileMenu.classList.contains('flex');
    mobileMenu.classList.toggle('hidden', !isOpen);
    mobileMenu.classList.toggle('flex',    isOpen);
    hamburger.classList.toggle('ham-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobile() {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    hamburger.classList.remove('ham-open');
    document.body.style.overflow = '';
  }

  /* ── SLIDER ── */
  let current     = 0;
  const track     = document.getElementById('sliderTrack');
  const total     = track.children.length;
  const dotsWrap  = document.getElementById('slideDots');
  let autoTimer;

  // Build dots
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = `dot-pill${i === 0 ? ' active' : ''}`;
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  }

  function updateTrack() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.dot-pill').forEach((d, i) => {
      d.classList.toggle('active', i === current);
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

  function startAuto() { autoTimer = setInterval(nextSlide, 4500); }
  startAuto();

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAuto);

  // Swipe support
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) d > 0 ? nextSlide() : prevSlide();
  });

  /* ── COUNTERS — scroll-triggered, ease-out cubic ── */
  const counters = document.querySelectorAll('.counter');

  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';

    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const isFloat  = !Number.isInteger(target);
    const duration = 1800;
    const t0       = performance.now();

    (function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      const v = target * (1 - Math.pow(1 - p, 3));           // ease-out cubic
      el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    })(t0);
  }

  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) runCounter(e.target); });
  }, { threshold: 0.5 }).observe
    ? new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) runCounter(e.target); });
      }, { threshold: 0.5 })
    : { observe: el => runCounter(el) };

  // Clean observer setup
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) runCounter(e.target); });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));

