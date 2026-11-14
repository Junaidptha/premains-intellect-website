/**
 * PREMAINS INTELLECT LLP - Accessible FAQ Accordion
 * Manages expand/collapse state, keyboard triggers, and aria attributes
 */

document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.accordion');
  if (!accordions.length) return;

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion-item');

    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (!header || !body) return;

      header.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

      header.addEventListener('click', () => {
        const isCurrentActive = item.classList.contains('active');

        // Optional: collapse sibling items in same accordion
        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherHeader = otherItem.querySelector('.accordion-header');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          }
        });

        if (isCurrentActive) {
          item.classList.remove('active');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
});
