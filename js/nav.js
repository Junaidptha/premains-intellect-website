/**
 * PREMAINS INTELLECT LLP - Navigation Handler
 * Manages sticky header, mobile drawer, accordions, and mega-menu accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close-btn');

  // Sticky Header Scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }

  // Mobile Drawer Toggle
  function openDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.classList.add('scroll-locked');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.classList.remove('scroll-locked');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close drawer on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Mobile Drawer Accordion Submenus
  const accordionBtns = document.querySelectorAll('.drawer-accordion__btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const content = btn.nextElementSibling;
      if (!content) return;

      // Close all other drawer accordions for cleaner look
      accordionBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.remove('open');
          }
        }
      });

      btn.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.classList.add('open');
      } else {
        content.classList.remove('open');
      }
    });
  });

  // Desktop Mega Menu Keyboard Escape handling
  const megaItem = document.querySelector('.nav-item--mega');
  if (megaItem) {
    megaItem.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const link = megaItem.querySelector('.nav-link');
        if (link) link.focus();
      }
    });
  }
});
