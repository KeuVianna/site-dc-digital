(() => {
  const config = {
    tiltMax: 8,
    lerp: 0.12,
    spotlightSize: 360,
    magneticRange: 110,
    magneticStrength: 0.18,
    parallaxScroll: 0.08,
  };

  const visual = document.querySelector('.hero-visual-modern');
  const card = document.querySelector('[data-hero-card]');
  if (!visual || !card) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 901px)');
  const pointers = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
  let active = false;
  let frame = 0;

  const lerp = (current, target, amount) => current + (target - current) * amount;

  const resetPointer = () => {
    pointers.targetX = 0;
    pointers.targetY = 0;
    visual.style.setProperty('--spot-x', '50%');
    visual.style.setProperty('--spot-y', '50%');
  };

  const render = () => {
    pointers.currentX = lerp(pointers.currentX, pointers.targetX, config.lerp);
    pointers.currentY = lerp(pointers.currentY, pointers.targetY, config.lerp);
    const tiltX = pointers.currentY * -config.tiltMax;
    const tiltY = pointers.currentX * config.tiltMax;
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(1.5deg)`;
    visual.style.setProperty('--parallax-x', `${pointers.currentX * 7}px`);
    visual.style.setProperty('--parallax-y', `${pointers.currentY * 7}px`);
    frame = active ? requestAnimationFrame(render) : 0;
  };

  const start = () => {
    if (!active && !reduceMotion && desktop.matches) {
      active = true;
      frame = requestAnimationFrame(render);
    }
  };

  const stop = () => {
    active = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    resetPointer();
    if (!reduceMotion) card.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(1.5deg)';
  };

  const setPointer = (event) => {
    if (reduceMotion || !desktop.matches) return;
    const bounds = visual.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pointers.targetX = (x / bounds.width - 0.5) * 2;
    pointers.targetY = (y / bounds.height - 0.5) * 2;
    visual.style.setProperty('--spot-x', `${x}px`);
    visual.style.setProperty('--spot-y', `${y}px`);
    start();
  };

  visual.addEventListener('pointermove', setPointer);
  visual.addEventListener('pointerenter', start);
  visual.addEventListener('pointerleave', stop);

  const magnetic = visual.querySelector('[data-magnetic]');
  visual.addEventListener('pointermove', (event) => {
    if (!magnetic || reduceMotion || !desktop.matches) return;
    const bounds = magnetic.getBoundingClientRect();
    const distanceX = event.clientX - (bounds.left + bounds.width / 2);
    const distanceY = event.clientY - (bounds.top + bounds.height / 2);
    const distance = Math.hypot(distanceX, distanceY);
    if (distance < config.magneticRange) magnetic.style.transform = `translate(${distanceX * config.magneticStrength}px, ${distanceY * config.magneticStrength}px)`;
    else magnetic.style.transform = '';
  });
  magnetic?.addEventListener('pointerleave', () => { magnetic.style.transform = ''; });

  const pins = visual.querySelectorAll('.map-pin');
  pins.forEach((pin) => {
    pin.addEventListener('click', () => pin.classList.toggle('pin-selected'));
    pin.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        pin.classList.toggle('pin-selected');
      }
    });
  });

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      visual.classList.add('hero-interactions-active');
      if (!reduceMotion) start();
    } else {
      visual.classList.remove('hero-interactions-active');
      stop();
    }
  }, { threshold: 0.15 });
  visibilityObserver.observe(visual);

  window.addEventListener('scroll', () => {
    if (!desktop.matches || reduceMotion) return;
    visual.style.setProperty('--scroll-parallax', `${Math.min(window.scrollY * config.parallaxScroll, 32)}px`);
  }, { passive: true });
})();