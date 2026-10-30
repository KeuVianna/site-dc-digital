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
    'clínicas e consultórios',
    'restaurantes e bares',
    'barbearias e salões',
    'lojas e serviços'
  ],
  weeklyReach: 127
};

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  const customMessage = link.getAttribute('data-whatsapp-text') || defaultWhatsappMessage;
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  link.target = '_blank';
  link.rel = 'noreferrer';
});

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  document.querySelectorAll('.mobile-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// 1. Rotating Hero Title Word
const rotatingWord = document.querySelector('[data-rotating-word]');
if (rotatingWord && heroConfig.rotatingNiches.length > 1) {
  let nicheIdx = 0;
  window.setInterval(() => {
    rotatingWord.classList.add('is-switching');
    window.setTimeout(() => {
      nicheIdx = (nicheIdx + 1) % heroConfig.rotatingNiches.length;
      rotatingWord.textContent = heroConfig.rotatingNiches[nicheIdx];
      rotatingWord.classList.remove('is-switching');
    }, 280);
  }, 3200);
}

// 2. Interactive Spotlight on Service & Comparison Cards
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

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
