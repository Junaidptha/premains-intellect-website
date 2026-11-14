/**
 * PREMAINS INTELLECT LLP - Count-Up Numbers
 * Triggers once upon scrolling into view via IntersectionObserver
 */

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-card__number[data-target]');
  if (!statNumbers.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function runCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const stepTime = 25;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    if (prefersReduced) {
      el.textContent = target.toLocaleString();
      return;
    }

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, stepTime);
  }

  if (!('IntersectionObserver' in window)) {
    statNumbers.forEach(el => runCounter(el));
    return;
  }

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(el => statObserver.observe(el));
});
