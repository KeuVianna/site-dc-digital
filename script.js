const whatsappNumber = document.documentElement.dataset.whatsappNumber || '5577999172059';
const defaultWhatsappMessage = 'Olá! Vim pelo site da DC Digital e quero saber mais.';
const heroConfig = {
  searchTerms: [
    'restaurante perto de mim',
    'clínica odontológica',
    'barbearia aberta agora',
    'esmalteria no centro'
  ],
  rotatingNiches: [
    'negócios locais',
    'sua clínica',
    'seu restaurante',
    'sua barbearia',
    'seu salão',
    'sua empresa'
  ],
  weeklyReach: 127
};

// WhatsApp Link Formatter
document.querySelectorAll('.whatsapp-link').forEach((link) => {
  const customMessage = link.getAttribute('data-whatsapp-text') || defaultWhatsappMessage;
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  link.target = '_blank';
  link.rel = 'noreferrer';
});

// Navbar & Reading Progress Bar
const navbar = document.querySelector('.navbar');
const scrollProgress = document.querySelector('[data-scroll-progress]');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobileMenu');
const navLinks = Array.from(document.querySelectorAll('.navbar-links a[href^="#"]'));
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateScrollUI() {
  const scrollTop = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollTop > 20);
  }
  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    scrollProgress.style.width = `${pct}%`;
  }
  if (trackedSections.length) {
    const currentPos = scrollTop + 220;
    let activeId = '';
    for (const sec of trackedSections) {
      if (sec.offsetTop <= currentPos) {
        activeId = `#${sec.id}`;
      }
    }
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeId);
    });
  }
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

// Mobile Navigation Toggle
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    navbar.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      navbar.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal Observer for io-reveal and reveal elements
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.io-reveal, .reveal').forEach((el) => revealObserver.observe(el));

// 1. Rotating Hero Title Word (Paused when out of view, Zero CLS)
const heroSection = document.querySelector('.hero');
const rotatingWord = document.querySelector('[data-rotating-word]');
if (rotatingWord && heroConfig.rotatingNiches.length > 1) {
  let nicheIdx = 0;
  let rotateTimer = null;

  const rotateStep = () => {
    rotatingWord.classList.add('is-switching');
    window.setTimeout(() => {
      nicheIdx = (nicheIdx + 1) % heroConfig.rotatingNiches.length;
      rotatingWord.textContent = heroConfig.rotatingNiches[nicheIdx];
      rotatingWord.classList.remove('is-switching');
    }, 280);
  };

  const startRotation = () => {
    if (rotateTimer) return;
    rotateTimer = window.setInterval(rotateStep, 3200);
  };

  const stopRotation = () => {
    if (rotateTimer) {
      window.clearInterval(rotateTimer);
      rotateTimer = null;
    }
  };

  if ('IntersectionObserver' in window && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startRotation();
        } else {
          stopRotation();
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  } else {
    startRotation();
  }
}

// 2. Indoor Totem Color & Ad Carousel Controller
const indoorStage = document.querySelector('[data-indoor-stage]');
if (indoorStage) {
  const totemFrame = indoorStage.querySelector('.totem-frame');
  const totemScreen = indoorStage.querySelector('[data-totem-screen]');
  const colorButtons = document.querySelectorAll('[data-totem-color]');
  const toggleBtn = document.querySelector('[data-toggle-totem]');
  const secondaryLabel = document.querySelector('[data-secondary-label]');
  const adPills = Array.from(document.querySelectorAll('[data-ad-index]'));
  const slides = Array.from(indoorStage.querySelectorAll('.screen-slide'));
  const progressFill = document.querySelector('[data-ad-progress]');
  const screenProgressFill = indoorStage.querySelector('[data-screen-progress]');

  const SCREEN_QUADS = {
    black: {
      aspect: 1444 / 1089,
      corners: [
        [470 / 1089, 381 / 1444],
        [783 / 1089, 353 / 1444],
        [783 / 1089, 993 / 1444],
        [470 / 1089, 983 / 1444]
      ]
    },
    white: {
      aspect: 1537 / 1023,
      corners: [
        [370 / 1023, 407 / 1537],
        [646 / 1023, 429 / 1537],
        [646 / 1023, 976 / 1537],
        [370 / 1023, 984 / 1537]
      ]
    }
  };

  const computeHomographyMatrix3d = (W, H, pts) => {
    const [p0, p1, p2, p3] = pts;
    const x0 = p0[0], y0 = p0[1];
    const x1 = p1[0], y1 = p1[1];
    const x2 = p2[0], y2 = p2[1];
    const x3 = p3[0], y3 = p3[1];

    const dx1 = x1 - x2, dx2 = x3 - x2, sx = x0 - x1 + x2 - x3;
    const dy1 = y1 - y2, dy2 = y3 - y2, sy = y0 - y1 + y2 - y3;
    const det = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(det) < 1e-9) return 'none';

    const g = (sx * dy2 - dx2 * sy) / det;
    const h = (dx1 * sy - sx * dy1) / det;
    const a = x1 - x0 + g * x1;
    const b = x3 - x0 + h * x3;
    const c = x0;
    const d = y1 - y0 + g * y1;
    const e = y3 - y0 + h * y3;
    const f = y0;

    const m = [
      a / W, d / W, 0, g / W,
      b / H, e / H, 0, h / H,
      0,     0,     1, 0,
      c,     f,     0, 1
    ];
    return `matrix3d(${m.map((v) => Number(v.toFixed(7))).join(',')})`;
  };

  const updateTotemScreenHomography = () => {
    if (!totemFrame || !totemScreen) return;
    const color = indoorStage.getAttribute('data-active-color') || 'black';
    const cfg = SCREEN_QUADS[color] || SCREEN_QUADS.black;
    const fw = totemFrame.clientWidth || 380;
    const fh = totemFrame.clientHeight > 80 ? totemFrame.clientHeight : fw * cfg.aspect;
    const pixelCorners = cfg.corners.map(([nx, ny]) => [nx * fw, ny * fh]);
    totemScreen.style.transform = computeHomographyMatrix3d(320, 600, pixelCorners);
  };

  const setTotemColor = (color) => {
    const prev = indoorStage.getAttribute('data-active-color');
    indoorStage.setAttribute('data-active-color', color);
    colorButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-totem-color') === color);
    });
    if (secondaryLabel) {
      secondaryLabel.textContent =
        color === 'black' ? 'Ver versão White Clean' : 'Ver versão Black Edition';
    }
    if (totemFrame && prev !== color) {
      totemFrame.classList.remove('is-switching-totem');
      void totemFrame.offsetWidth;
      totemFrame.classList.add('is-switching-totem');
    }
    window.requestAnimationFrame(updateTotemScreenHomography);
  };

  colorButtons.forEach((btn) => {
    btn.addEventListener('click', () => setTotemColor(btn.getAttribute('data-totem-color')));
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = indoorStage.getAttribute('data-active-color') || 'black';
      setTotemColor(current === 'black' ? 'white' : 'black');
    });
  }

  indoorStage.querySelectorAll('.totem-photo').forEach((img) => {
    img.addEventListener('load', updateTotemScreenHomography);
  });
  window.addEventListener('resize', updateTotemScreenHomography, { passive: true });
  if ('ResizeObserver' in window && totemFrame) {
    new ResizeObserver(updateTotemScreenHomography).observe(totemFrame);
  }
  updateTotemScreenHomography();

  let currentAd = 0;
  let adTimer = 0;
  const AD_DURATION = 4800;

  const restartProgress = () => {
    [progressFill, screenProgressFill].forEach((bar) => {
      if (!bar) return;
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth;
      bar.style.transition = `width ${AD_DURATION}ms linear`;
      bar.style.width = '100%';
    });
  };

  const showAd = (index) => {
    currentAd = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentAd);
    });
    adPills.forEach((pill, i) => {
      pill.classList.toggle('active', i === currentAd);
    });
    restartProgress();
  };

  const startAdLoop = () => {
    window.clearInterval(adTimer);
    restartProgress();
    adTimer = window.setInterval(() => {
      showAd(currentAd + 1);
    }, AD_DURATION);
  };

  adPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      showAd(idx);
      startAdLoop();
    });
  });

  startAdLoop();
}

// 3. Hero Visual Map Radar Search & Counter
const heroVisual = document.querySelector('.hero-visual-modern');
const searchText = document.querySelector('[data-search-text]');
const counter = document.querySelector('[data-counter]');

function typeSearchTerm() {
  if (!searchText) return;
  let termIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const step = () => {
    const currentTerm = heroConfig.searchTerms[termIdx];
    if (!deleting) {
      charIdx += 1;
      searchText.textContent = currentTerm.slice(0, charIdx);
      if (charIdx < currentTerm.length) {
        window.setTimeout(step, 60);
      } else {
        deleting = true;
        window.setTimeout(step, 1600);
      }
    } else {
      charIdx -= 1;
      searchText.textContent = currentTerm.slice(0, charIdx);
      if (charIdx > 0) {
        window.setTimeout(step, 28);
      } else {
        deleting = false;
        termIdx = (termIdx + 1) % heroConfig.searchTerms.length;
        window.setTimeout(step, 300);
      }
    }
  };
  step();
}

function animateCounter() {
  if (!counter) return;
  let currentReach = heroConfig.weeklyReach;
  const start = performance.now();
  const duration = 1500;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `+${Math.floor(eased * currentReach)}`;
    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };
  window.requestAnimationFrame(tick);

  window.setInterval(() => {
    currentReach += 1;
    counter.textContent = `+${currentReach}`;
    counter.classList.remove('counter-bump');
    void counter.offsetWidth;
    counter.classList.add('counter-bump');
  }, 4500);
}

if (heroVisual) {
  heroVisual.classList.add('hero-active');
  typeSearchTerm();
  animateCounter();
}
