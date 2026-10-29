(() => {
  const config = {
    tiltMax: 8,
    lerp: 0.12,
    parallaxScroll: 0.06,
  };

  const visual = document.querySelector('.hero-visual-modern');
  const card = document.querySelector('[data-hero-card]');
  if (!visual || !card) return;

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
    visual.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    visual.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    visual.style.setProperty('--parallax-x', `${(pointers.currentX * 10).toFixed(1)}px`);
    visual.style.setProperty('--parallax-y', `${(pointers.currentY * 10).toFixed(1)}px`);

    if (
      !active &&
      Math.abs(pointers.currentX) < 0.01 &&
      Math.abs(pointers.currentY) < 0.01
    ) {
      visual.style.setProperty('--tilt-x', '0deg');
      visual.style.setProperty('--tilt-y', '0deg');
      visual.style.setProperty('--parallax-x', '0px');
      visual.style.setProperty('--parallax-y', '0px');
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(render);
  };

  const start = () => {
    active = true;
    if (!frame && desktop.matches) {
      frame = requestAnimationFrame(render);
    }
  };

  const stop = () => {
    active = false;
    resetPointer();
    if (!frame && desktop.matches) {
      frame = requestAnimationFrame(render);
    }
  };

  const setPointer = (event) => {
    if (!desktop.matches) return;
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

  visual.classList.add('hero-interactions-active');

  window.addEventListener('scroll', () => {
    if (!desktop.matches) return;
    visual.style.setProperty('--scroll-parallax', `${Math.min(window.scrollY * config.parallaxScroll, 24)}px`);
  }, { passive: true });
})();
