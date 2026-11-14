/**
 * PREMAINS INTELLECT LLP - Cookie Consent & Analytics Loader
 * Manages privacy preferences in localStorage and conditionally initializes GA4
 */

(function () {
  const STORAGE_KEY = 'premains_cookie_consent';

  function initAnalytics(gaId) {
    // Only real GA4 IDs (G- + 10 alphanumerics) are loaded; placeholders are ignored
    if (!/^G-[A-Z0-9]{10}$/.test(gaId || '') || gaId === 'G-XXXXXXXXXX' || window.gaLoaded) return;
    window.gaLoaded = true;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    console.info(`[Analytics] Google Analytics 4 (${gaId}) successfully activated under client consent.`);
  }

  // Safe tracking dispatcher
  window.trackEvent = function (action, category, label) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-all');
    const rejectBtn = document.getElementById('cookie-reject-all');
    const cfg = window.SITE_CONFIG || {};
    const gaId = cfg.analytics ? cfg.analytics.gaId : null;

    // Storage can throw (Safari private mode, blocked site data); fall back to "no choice yet"
    const readConsent = () => { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } };
    const saveConsent = (v) => { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignore */ } };
    const savedConsent = readConsent();

    if (!savedConsent && banner) {
      setTimeout(() => {
        banner.classList.add('active');
      }, 1000);
    } else if (savedConsent === 'accepted' && gaId) {
      initAnalytics(gaId);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        saveConsent('accepted');
        if (banner) banner.classList.remove('active');
        if (gaId) initAnalytics(gaId);
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        saveConsent('rejected');
        if (banner) banner.classList.remove('active');
      });
    }
  });
})();
