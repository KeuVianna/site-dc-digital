const whatsappNumber = document.documentElement.dataset.whatsappNumber;
const whatsappMessage = 'Olá! Vim pelo site da DC Digital e quero saber mais.';
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
const heroConfig = {
  searchTerms: [
    'restaurante perto de mim',
    'clínica odontológica',
    'barbearia aberta agora',
    'esmalteria no centro'
  ],
  weeklyReach: 127
};

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.href = whatsappUrl;
  link.target = '_blank';
  link.rel = 'noreferrer';
});

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

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

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

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

  // Live increment every few seconds to simulate real-time local reach
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
