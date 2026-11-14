/**
 * PREMAINS INTELLECT LLP - Main Application Initializer
 * Coordinates global UI behaviors, back-to-top button, analytics events
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Back-To-Top Button
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Global Conversion & Analytics Click Tracking
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href') || '';

    // WhatsApp Click
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('click_whatsapp', 'Contact', href);
      }
    }
    // Phone Call Click
    else if (href.startsWith('tel:')) {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('click_telephone', 'Contact', href);
      }
    }
    // Email Click
    else if (href.startsWith('mailto:')) {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('click_email', 'Contact', href);
      }
    }
    // Brochure Download Click
    else if (href.endsWith('.pdf')) {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('download_brochure', 'Resource', href);
      }
    }
    // Consultation CTA Click
    else if (target.classList.contains('btn--primary') || target.id === 'header-cta-btn') {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('click_cta_consultation', 'Engagement', target.textContent.trim());
      }
    }
  });

  console.info('Premains Intellect LLP initialized successfully.');
});
