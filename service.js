
/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 40);
});

function toggleMobile() {
  const m = document.getElementById('mobileMenu');
  const h = document.getElementById('hamburger');
  const open = m.classList.toggle('hidden');
  m.style.display = open ? 'none' : 'flex';
  h.classList.toggle('ham-open', !open);
}
function closeMobile() {
  document.getElementById('mobileMenu').style.display = 'none';
  document.getElementById('mobileMenu').classList.add('hidden');
  document.getElementById('hamburger').classList.remove('ham-open');
}

document.getElementById('heroBg').addEventListener('load', function(){ this.classList.add('loaded'); });


/* ─────────────────────────────────────────
   SERVICES SIDEBAR
───────────────────────────────────────── */
const services = [
  {
    id: 'solar',
    label: 'Solar / Inverter',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773162890/Batteries-removebg-preview_prvaqa.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773165293/Solar_Panel-removebg-preview_ggtcpy.png',
    title: 'Solar / Inverter Installation',
    desc: 'Efficient solar and inverter systems delivering reliable, clean, and uninterrupted electricity for homes and businesses. We design, supply, install, and maintain solar power systems tailored to your energy needs.',
    features: ['Solar panel installation', 'Inverter & battery setup', 'Hybrid power systems', 'Energy monitoring', 'Maintenance & support'],
    bg: 'from-amber-50 to-orange-50'
  },
  {
    id: 'network',
    label: 'Enterprise Networking',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773163080/Networking-removebg-preview_dtxomv.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773166480/routers_xxslmx.jpg',
    title: 'Enterprise Networking',
    desc: 'Secure, scalable LAN/WAN deployments ensuring reliable connectivity and high-performance communication infrastructure for businesses of any size.',
    features: ['LAN / WAN deployment', 'Structured cabling', 'Network security', 'Wireless (Wi-Fi) setup', 'Firewall & routing'],
    bg: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'cctv',
    label: 'CCTV Surveillance',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773163416/icons8-cctv-100_prsuqc.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773165965/CCTV_with_Monitoring-removebg-preview_qjjb0b.png',
    title: 'CCTV Installation & Maintenance',
    desc: 'Advanced surveillance systems enabling real-time monitoring using high-definition IP and analog cameras. We cover design, installation, and ongoing support.',
    features: ['HD IP & analog cameras', '24/7 remote monitoring', 'DVR / NVR installation', 'Motion detection alerts', 'Preventive maintenance'],
    bg: 'from-gray-50 to-slate-50'
  },
  {
    id: 'access',
    label: 'Access Control',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773163548/icons8-access-control-64_xcxsb3.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773168227/GuardMe_Access_Control_nudwjl.jpg',
    title: 'Access Control Systems',
    desc: 'Intelligent systems regulating entry across facilities, ensuring secure authentication and protection of critical infrastructure through biometric and card-based solutions.',
    features: ['Biometric readers', 'Card & PIN systems', 'Door lock integration', 'Visitor management', 'Audit trail & reporting'],
    bg: 'from-green-50 to-emerald-50'
  },
  {
    id: 'telephony',
    label: 'IP Telephony',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773163652/icons8-telephone-64_p7tmwu.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773124696/Telephone-removebg-preview_soj0ac.png',
    title: 'IP Telephony',
    desc: 'Modern IP telephony systems delivering reliable, scalable, and high-quality voice communication for organizations — replacing legacy phone systems with flexible VoIP.',
    features: ['VoIP PBX setup', 'SIP trunk integration', 'IP desk phones', 'Call recording', 'Multi-site connectivity'],
    bg: 'from-purple-50 to-violet-50'
  },
  {
    id: 'web',
    label: 'Web & Software Dev',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773169104/icons8-full-stack-64_sw7vml.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773169424/Full_Stack_Software_Developer_i2vbnf.png',
    title: 'Web & Software Development',
    desc: 'Modern, responsive websites and web applications using full-stack technologies. From business websites to custom software solutions, we build your digital presence.',
    features: ['Responsive web design', 'Custom web apps', 'API integrations', 'CMS platforms', 'Ongoing maintenance'],
    bg: 'from-rose-50 to-pink-50'
  },
  {
    id: 'internet',
    label: 'Internet Connectivity',
    icon: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773209354/icons8-internet-100_1_boicth.png',
    heroImg: 'https://res.cloudinary.com/dezoqbzim/image/upload/v1773208930/Starlink-removebg-preview_tpx6ho.png',
    title: 'Internet Connectivity Installation',
    desc: 'High-speed internet solutions including Starlink and other broadband technologies providing reliable, fast, and secure internet access for homes and businesses.',
    features: ['Starlink installation', 'Broadband setup', 'Point-to-point links', 'Wi-Fi coverage extension', 'Network optimization'],
    bg: 'from-cyan-50 to-teal-50'
  },
];

const srvSidebar   = document.getElementById('srvSidebar');
const srvPanelArea = document.getElementById('srvPanelArea');
const srvTabBar    = document.getElementById('srvTabBar');
let activeSrv = 0;

services.forEach((s, i) => {
  // ── Sidebar item
  const item = document.createElement('button');
  item.className = 'srv-sidebar-item w-full text-left' + (i === 0 ? ' active' : '');
  item.innerHTML = `
    <div class="srv-icon"><img src="${s.icon}" alt="${s.label}"/></div>
    <span class="srv-label">${s.label}</span>
    <i class="fa-solid fa-chevron-right srv-arrow"></i>
  `;
  item.addEventListener('click', () => switchSrv(i));
  srvSidebar.appendChild(item);

  // ── Mobile tab
  const tab = document.createElement('button');
  tab.className = 'srv-tab' + (i === 0 ? ' active' : '');
  tab.textContent = s.label;
  tab.addEventListener('click', () => switchSrv(i));
  srvTabBar.appendChild(tab);

  // ── Panel
  const isImg = s.heroImg.match(/\.(jpg|jpeg|png|webp)/i) && !s.heroImg.includes('removebg');
  const panel = document.createElement('div');
  panel.className = 'srv-panel flex-col lg:flex-row items-stretch' + (i === 0 ? ' active' : '');
  panel.innerHTML = `
    <!-- Left: content -->
    <div class="flex-1 p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br ${s.bg}">
      <p class="text-red-600 font-bold text-[10px] tracking-[0.2em] uppercase mb-2">Service 0${i+1}</p>
      <h3 class="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">${s.title}</h3>
      <p class="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">${s.desc}</p>
      <ul class="flex flex-col gap-2 mb-8">
        ${s.features.map(f => `
          <li class="flex items-center gap-2.5 text-sm text-gray-700">
            <span class="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-check text-red-600 text-[8px]"></i>
            </span>
            ${f}
          </li>`).join('')}
      </ul>
      <a href="#contact" class="btn-red bg-red-700 text-white font-display font-bold px-6 py-3 rounded-lg text-sm self-start inline-block">Get a Quote</a>
    </div>
    <!-- Right: image -->
    <div class="w-full lg:w-72 xl:w-80 bg-white flex items-center justify-center p-8 border-t lg:border-t-0 lg:border-l border-gray-100">
      <img src="${s.heroImg}" alt="${s.title}"
        class="max-h-52 lg:max-h-72 w-full ${isImg ? 'object-cover rounded-xl' : 'object-contain'}"
        loading="${i === 0 ? 'eager' : 'lazy'}" />
    </div>
  `;
  srvPanelArea.appendChild(panel);
});

function switchSrv(index) {
  const sidebarItems = srvSidebar.querySelectorAll('.srv-sidebar-item');
  const tabs         = srvTabBar.querySelectorAll('.srv-tab');
  const panels       = srvPanelArea.querySelectorAll('.srv-panel');

  sidebarItems[activeSrv].classList.remove('active');
  tabs[activeSrv].classList.remove('active');
  panels[activeSrv].classList.remove('active');

  activeSrv = index;

  sidebarItems[activeSrv].classList.add('active');
  tabs[activeSrv].classList.add('active');
  panels[activeSrv].classList.add('active');

  // Scroll mobile tab into view
  tabs[activeSrv].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}


/* ─────────────────────────────────────────
   GALLERY SLIDESHOW
───────────────────────────────────────── */
const galImages = [
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640005/Feyi_climbing_ladder_mo0nc8.jpg',        cap: 'Climbing' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640076/Installing_Starlink_kbuvbt.jpg',         cap: 'Installing Starlink' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640120/Configuring_poe_access_point_uqms9f.jpg', cap: 'Configuring POE Access Point' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640153/Rack_tpqmfi.jpg',                        cap: 'Rack Setup' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640190/Feyi_cabling_ncud97.jpg',                cap: 'Cabling' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640241/CCTV_Installed_aupb2l.jpg',              cap: 'CCTV Installed' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640278/Inverter_connection_zz87tx.jpg',         cap: 'Inverter Connection' },
  { src: 'https://res.cloudinary.com/dezoqbzim/image/upload/q_auto,f_auto/v1773640310/2_cctv_qtzoa9.jpg',                     cap: 'CCTV Overview' },
];

const galTrack   = document.getElementById('galTrack');
const galDots    = document.getElementById('galDots');
const galCounter = document.getElementById('galCounter');

let galCurrent = 0, galTimer = null;

const galSlideEls = galImages.map((img, i) => {
  const slide = document.createElement('div');
  slide.className = 'slide' + (i === 0 ? ' active' : '');
  slide.innerHTML = `
    <div class="w-full bg-gray-100 rounded-2xl overflow-hidden shadow-md">
      <img src="${img.src}" alt="${img.cap}"
        loading="${i < 2 ? 'eager' : 'lazy'}"
        class="w-full h-auto max-h-[65vh] object-contain block bg-gray-900" />
    </div>
    <div class="mt-3 flex items-center justify-between">
      <span class="font-display font-bold text-xs tracking-widest uppercase text-gray-800">${img.cap}</span>
      <span class="text-[0.65rem] tracking-[0.2em] text-red-500 font-medium">${String(i+1).padStart(2,'0')} / ${String(galImages.length).padStart(2,'0')}</span>
    </div>`;
  galTrack.appendChild(slide);
  return slide;
});

const galDotEls = galImages.map((_, i) => {
  const dot = document.createElement('div');
  dot.className = `prog-dot relative flex-1 h-[3px] bg-gray-200 overflow-hidden cursor-pointer${i === 0 ? ' active' : ''}`;
  dot.innerHTML = `<div class="prog-fill absolute inset-0 bg-red-600"></div>`;
  dot.addEventListener('click', () => galGoTo(i));
  galDots.appendChild(dot);
  return dot;
});

function updateGalCounter() {
  galCounter.textContent = `${String(galCurrent+1).padStart(2,'0')} / ${String(galImages.length).padStart(2,'0')}`;
}

function galResetDot(dotEl) {
  const f = dotEl.querySelector('.prog-fill');
  f.style.animation = 'none'; dotEl.offsetHeight; f.style.animation = '';
}

function galGoTo(index) {
  if (index === galCurrent) return;
  clearTimeout(galTimer);
  const prev = galCurrent;
  galCurrent = ((index % galImages.length) + galImages.length) % galImages.length;
  galSlideEls[prev].classList.remove('active'); galSlideEls[prev].classList.add('exit');
  setTimeout(() => galSlideEls[prev].classList.remove('exit'), 700);
  galSlideEls[galCurrent].classList.add('active');
  galDotEls[prev].classList.remove('active'); galDotEls[prev].classList.add('done');
  if (galCurrent === 0) galDotEls.forEach(d => d.classList.remove('done'));
  galDotEls[galCurrent].classList.remove('done'); galDotEls[galCurrent].classList.add('active');
  galResetDot(galDotEls[galCurrent]);
  updateGalCounter();
  galTimer = setTimeout(() => galGoTo(galCurrent + 1), 4000);
}

document.getElementById('galPrev').addEventListener('click', () => galGoTo(galCurrent - 1));
document.getElementById('galNext').addEventListener('click', () => galGoTo(galCurrent + 1));
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') galGoTo(galCurrent + 1);
  if (e.key === 'ArrowLeft')  galGoTo(galCurrent - 1);
});
updateGalCounter();
galTimer = setTimeout(() => galGoTo(1), 4000);


/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    const duration = 1800, steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const val = target * (step / steps);
      el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (step >= steps) { el.textContent = target + suffix; clearInterval(timer); }
    }, duration / steps);
  });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL + COUNTER TRIGGER
───────────────────────────────────────── */
let counterDone = false;
const statsSection = document.querySelector('.stat-card');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (e.target.classList.contains('reveal')) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
      if (e.target.classList.contains('stat-card') && !counterDone) {
        counterDone = true;
        animateCounters();
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
if (statsSection) io.observe(statsSection);
