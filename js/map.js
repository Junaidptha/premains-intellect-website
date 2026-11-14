/**
 * PREMAINS INTELLECT LLP - Interactive World Map
 * Tooltips and marker interactions for global headquarters and served markets
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapWrapper = document.querySelector('.world-map-wrapper');
  if (!mapWrapper) return;

  const tooltip = mapWrapper.querySelector('.map-tooltip');
  const pins = mapWrapper.querySelectorAll('.map-pin');

  if (!tooltip || !pins.length) return;

  pins.forEach(pin => {
    function showTooltip(e) {
      const title = pin.getAttribute('data-location') || '';
      const details = pin.getAttribute('data-details') || '';
      const coverage = pin.getAttribute('data-coverage') || '';

      // textContent keeps attribute values from ever being parsed as HTML
      tooltip.replaceChildren();
      [
        [title, 'font-weight: 700; color: var(--color-accent); font-size: 0.95rem; margin-bottom: 2px;'],
        [details, 'font-size: 0.82rem; opacity: 0.9; margin-bottom: 2px;'],
        [coverage, 'font-size: 0.76rem; color: #6EE7B7;']
      ].forEach(([text, style]) => {
        const row = document.createElement('div');
        row.style.cssText = style;
        row.textContent = text;
        tooltip.appendChild(row);
      });

      // Position relative to wrapper
      const rect = pin.getBoundingClientRect();
      const wrapRect = mapWrapper.getBoundingClientRect();
      const left = rect.left - wrapRect.left + (rect.width / 2);
      const top = rect.top - wrapRect.top - 10;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.transform = `translate(-50%, -100%)`;
      tooltip.classList.add('visible');
    }

    function hideTooltip() {
      tooltip.classList.remove('visible');
    }

    pin.addEventListener('mouseenter', showTooltip);
    pin.addEventListener('mouseleave', hideTooltip);
    pin.addEventListener('focus', showTooltip);
    pin.addEventListener('blur', hideTooltip);
  });
});
