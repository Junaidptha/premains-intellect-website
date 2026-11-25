/**
 * PREMAINS INTELLECT LLP - Home Hero Slider
 * Shows one slide (text + background photo) at a time, advancing every 5 seconds.
 * Keeps changing whether or not the mouse is over it; supports the dots, and stays still for reduced-motion users.
 */

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('home-hero');
  if (!hero) return;

  const slides = hero.querySelectorAll('.hero-slide');
  const photos = hero.querySelectorAll('.hero__slide');
  const dots = hero.querySelectorAll('.hero__dot');
  const progress = hero.querySelector('.hero__progress span');
  if (slides.length < 2) return;

  const DURATION = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((el, i) => {
      const on = i === current;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    photos.forEach((el, i) => el.classList.toggle('is-active', i === current));
    dots.forEach((el, i) => {
      el.classList.toggle('is-active', i === current);
      if (i === current) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  }

  function restartProgress() {
    if (!progress) return;
    progress.style.animation = 'none';
    void progress.offsetWidth; // force reflow so the animation restarts
    progress.style.animation = '';
  }

  function play() {
    if (reduceMotion) return;
    clearTimeout(timer);
    hero.classList.remove('is-paused');
    restartProgress();
    timer = setTimeout(() => {
      show(current + 1);
      play();
    }, DURATION);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      play();
    });
  });

  hero.classList.add('hero--js');
  show(0);
  if (reduceMotion) hero.classList.add('is-paused');
  else play();
});
