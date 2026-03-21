/* ============================================================
   landing.js  —  JayTech Smart Systems Ltd
   All nav / mobile-menu links route to their own HTML files.
   Fully responsive helpers included.
   ============================================================ */

/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 60);
}, { passive: true });

/* ── HERO KEN-BURNS ── */
const heroBg = document.getElementById('heroBg');
if (heroBg) heroBg.classList.add('loaded');

/* ── MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobile() {
  const isOpen = mobileMenu.classList.contains('hidden');
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

/* Close mobile menu on resize to desktop */
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) closeMobile();
}, { passive: true });

/* ── ROUTE ALL NAV LINKS TO EXTERNAL PAGES ──
   Intercept every <a> inside #mainNav and #mobileMenu
   that points to a same-page anchor (#…) when we're NOT
   on index.html, and convert it to the correct page URL.
   Links already pointing to *.html are left untouched.   */
(function patchLinks() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // const linkMap = {
  //   '#':        'index.html',
  //   '#about':   'about.html',
  //   '#services':'service.html',
  //   '#gallery': 'gallery.html',
  //   '#contact': 'contactus.html',
  // };

  const navAreas = [
    document.getElementById('mainNav'),
    document.getElementById('mobileMenu'),
  ].filter(Boolean);

  navAreas.forEach(area => {
    area.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href').trim();

      /* If href is a hash-only anchor, remap to proper page */
      if (linkMap[href] && !href.endsWith('.html')) {
        a.setAttribute('href', linkMap[href]);
      }

      /* Mark the active page link */
      const target = a.getAttribute('href').split('/').pop();
      if (target === currentPage) {
        a.classList.add('active-link');
        a.style.color = '#f87171';
      }
    });
  });
})();

/* ── SLIDER ── */
let current    = 0;
const track    = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('slideDots');
let autoTimer;

if (track && dotsWrap) {
  const total = track.children.length;

  /* Build dots */
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

  /* Touch / swipe support */
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) d > 0 ? nextSlide() : prevSlide();
  });

  /* Expose globally for inline onclick buttons */
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
}

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
    const v = target * (1 - Math.pow(1 - p, 3)); // ease-out cubic
    el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  })(t0);
}

if (counters.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) runCounter(e.target); });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ── SCROLL REVEAL (optional progressive enhancement) ──
   Any element with class "reveal" fades up on scroll.    */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revObs.observe(el));
}