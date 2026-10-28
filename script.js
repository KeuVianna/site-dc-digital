const whatsappNumber = document.documentElement.dataset.whatsappNumber;
const whatsappMessage = 'Olá! Vim pelo site da DC Digital e quero saber mais.';
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
const heroConfig = { searchTerm: 'pizzaria perto de mim', weeklyReach: 127 };

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
const heroCard = document.querySelector('[data-hero-card]');
const searchText = document.querySelector('[data-search-text]');
const counter = document.querySelector('[data-counter]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeSearchTerm() {
  if (!searchText) return;
  if (reduceMotion) {
    searchText.textContent = heroConfig.searchTerm;
    return;
  }
  let index = 0;
  const typeNext = () => {
    searchText.textContent = heroConfig.searchTerm.slice(0, index);
    index += 1;
    if (index <= heroConfig.searchTerm.length) window.setTimeout(typeNext, 75);
  };
  typeNext();
}

function animateCounter() {
  if (!counter) return;
  if (reduceMotion) {
    counter.textContent = `+${heroConfig.weeklyReach}`;
    return;
  }
  const start = performance.now();
  const duration = 1500;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = `+${Math.floor(progress * heroConfig.weeklyReach)}`;
    if (progress < 1) window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}

if (heroVisual) {
  const heroObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    heroVisual.classList.add('hero-active');
    typeSearchTerm();
    animateCounter();
    observer.disconnect();
  }, { threshold: 0.2 });
  heroObserver.observe(heroVisual);
}

if (heroCard && heroVisual && !reduceMotion && window.matchMedia('(min-width: 901px)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroCard.style.transform = `rotateX(${y * -3}deg) rotateY(${x * 4}deg) rotateZ(1.5deg)`;
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(1.5deg)';
  });
}
