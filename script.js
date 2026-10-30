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
const scrollProgress = document.querySelector('[data-scroll-progress]');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateScrollUI() {
  const scrollTop = window.scrollY;
  if (header) {
    header.classList.toggle('scrolled', scrollTop > 20);
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

// 2. Interactive Spotlight on Cards
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

// 3. Indoor Totem Color & Ad Carousel Controller
const indoorStage = document.querySelector('[data-indoor-stage]');
if (indoorStage) {
  const colorButtons = document.querySelectorAll('[data-totem-color]');
  const toggleBtn = document.querySelector('[data-toggle-totem]');
  const secondaryLabel = document.querySelector('[data-secondary-label]');
  const adPills = Array.from(document.querySelectorAll('[data-ad-index]'));
  const slides = Array.from(indoorStage.querySelectorAll('.screen-slide'));
  const progressFill = document.querySelector('[data-ad-progress]');

  const setTotemColor = (color) => {
    indoorStage.setAttribute('data-active-color', color);
    colorButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-totem-color') === color);
    });
    if (secondaryLabel) {
      secondaryLabel.textContent =
        color === 'black' ? 'Ver versão White Clean' : 'Ver versão Black Edition';
    }
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

  let currentAd = 0;
  let adTimer = 0;
  const AD_DURATION = 4200;

  const restartProgress = () => {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    void progressFill.offsetWidth;
    progressFill.style.transition = `width ${AD_DURATION}ms linear`;
    progressFill.style.width = '100%';
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

// 4. Interactive 1-Click Diagnostic
const diagData = [
  {
    tag: 'Recomendação #1 · Busca Local',
    heading: 'Estruturação completa do Google Meu Negócio',
    desc: 'Ideal para colocar endereço, horários, fotos estratégicas e avaliações trabalhando para gerar ligações, rotas e mensagens de quem já está procurando o que você vende.',
    benefits: [
      'Otimização de categorias, descrição e serviços',
      'Orientação de fotos e rotina para ganhar avaliações',
      'Link direto para o seu WhatsApp nas buscas'
    ],
    waText: 'Olá! Fiz o diagnóstico no site da DC Digital e minha prioridade hoje é aparecer melhor no Google Meu Negócio.'
  },
  {
    tag: 'Recomendação #2 · Vitrine 24h',
    heading: 'Site Profissional Rápido e Feito para Celular',
    desc: 'Perfeito para apresentar sua empresa com autoridade, organizar seus serviços, mostrar seu portfólio e facilitar o contato imediato pelo WhatsApp.',
    benefits: [
      'Design moderno que carrega rápido no 4G/5G',
      'Textos claros pensados para gerar confiança',
      'Domínio próprio com cadeado de segurança HTTPS'
    ],
    waText: 'Olá! Fiz o diagnóstico no site da DC Digital e minha prioridade hoje é criar um site profissional para o meu negócio.'
  },
  {
    tag: 'Recomendação #3 · Conversão Direta',
    heading: 'Página de Venda e Captura de Alta Conversão',
    desc: 'Focada em uma única oferta ou campanha para transformar visitantes de anúncios e redes sociais em clientes chamando no seu WhatsApp sem distrações.',
    benefits: [
      'Sequência persuasiva: problema, proposta, prova e ação',
      'Leitura escaneável e botões estratégicos ao longo da tela',
      'Pronta para receber tráfego do Instagram e Google Ads'
    ],
    waText: 'Olá! Fiz o diagnóstico no site da DC Digital e quero criar uma página de vendas/captura para uma oferta do meu negócio.'
  },
  {
    tag: 'Recomendação #4 · Ponto de Venda & Mídia',
    heading: 'Marketing Indoor nas Telas DC Digital',
    desc: 'Destaque sua marca, promoções e serviços em nossos totens digitais (Black Edition e White Clean) com alta circulação de público ou dentro do seu próprio estabelecimento.',
    benefits: [
      'Anúncios em vídeo e animações que capturam o olhar',
      'Totens elegantes em 2 cores nos melhores pontos',
      'Programação atualizável para ofertas da semana'
    ],
    waText: 'Olá! Fiz o diagnóstico no site da DC Digital e quero anunciar ou instalar as telas de Marketing Indoor.'
  }
];

const diagButtons = document.querySelectorAll('[data-diag-index]');
const diagResult = document.querySelector('[data-diag-result]');
if (diagButtons.length && diagResult) {
  const tagEl = diagResult.querySelector('[data-diag-tag]');
  const headingEl = diagResult.querySelector('[data-diag-heading]');
  const descEl = diagResult.querySelector('[data-diag-desc]');
  const listEl = diagResult.querySelector('[data-diag-list]');
  const ctaEl = diagResult.querySelector('[data-diag-cta]');

  diagButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-diag-index')) || 0;
      const item = diagData[idx];
      if (!item) return;

      diagButtons.forEach((b) => b.classList.toggle('active', b === btn));
      diagResult.classList.remove('diag-flash');
      void diagResult.offsetWidth;
      diagResult.classList.add('diag-flash');

      if (tagEl) tagEl.textContent = item.tag;
      if (headingEl) headingEl.textContent = item.heading;
      if (descEl) descEl.textContent = item.desc;
      if (listEl) {
        listEl.innerHTML = item.benefits
          .map((text) => `<li><span>✓</span> ${text}</li>`)
          .join('');
      }
      if (ctaEl) {
        ctaEl.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(item.waText)}`;
      }
    });
  });
}

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
