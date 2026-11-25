/**
 * PREMAINS INTELLECT LLP - Components Injector
 * Injects shared Header, Mega-Menu, Mobile Drawer, Footer, Floating Buttons & Cookie Banner
 */

(function () {
  function getRootPath() {
    const metaRoot = document.querySelector('meta[name="root-path"]');
    if (metaRoot && metaRoot.getAttribute('content')) {
      return metaRoot.getAttribute('content');
    }
    // Fallback: calculate based on pathname depth relative to root
    const pathname = window.location.pathname;
    if (pathname.includes('/services/usa/') ||
      pathname.includes('/services/canada/') ||
      pathname.includes('/services/australia/') ||
      pathname.includes('/services/uae/')) {
      return '../../';
    }
    if (pathname.includes('/services/') || pathname.includes('/blog/')) {
      return '../';
    }
    return './';
  }

  const root = getRootPath();
  const cfg = window.SITE_CONFIG || {
    brand: { name: "PREMAINS INTELLECT LLP", tagline: "Legal, Corporate, Tax & Technical Advisory" },
    contact: {
      phone: "+91 9818122696",
      phoneDisplay: "+91 98181 22696",
      primaryEmail: "premains.legal@gmail.com",
      whatsappLink: "https://wa.me/919818122696?text=Hello%20Premains%20Intellect%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
    },
    social: {
      linkedin: "https://www.linkedin.com/company/premains-intellect",
      twitter: "https://twitter.com/premainsintellect"
    }
  };

  const sprite = `${root}assets/icons/icons.svg`;

  // Render Header
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <!-- Top Bar -->
      <div class="topbar">
        <div class="container topbar__inner">
          <div class="topbar__links">
            <a href="tel:${cfg.contact.phone.replace(/\s+/g, '')}" class="topbar__link">
              <svg class="icon"><use href="${sprite}#icon-phone"></use></svg>
              <span>${cfg.contact.phoneDisplay}</span>
            </a>
            <a href="mailto:${cfg.contact.primaryEmail}" class="topbar__link">
              <svg class="icon"><use href="${sprite}#icon-email"></use></svg>
              <span>${cfg.contact.primaryEmail}</span>
            </a>
            <a href="${cfg.contact.whatsappLink}" target="_blank" rel="noopener" class="topbar__link">
              <svg class="icon"><use href="${sprite}#icon-whatsapp"></use></svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
          <div class="topbar__socials">
            <span style="font-size: 0.8rem; opacity: 0.8; margin-right: 4px;">Global Offshoring Hub: Kolkata, India</span>
            <a href="${cfg.social.linkedin}" target="_blank" rel="noopener" class="topbar__social-link" aria-label="LinkedIn">
              <svg class="icon"><use href="${sprite}#icon-linkedin"></use></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Sticky Navigation -->
      <header class="header" id="main-header">
        <div class="container header__inner">
          <a href="${root}index.html" class="logo" aria-label="Premains Intellect LLP Homepage">
            <div class="logo__mark">
              <svg class="logo__mark-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="logo__text">
              <span class="logo__title">PREMAINS INTELLECT LLP</span>
              <span class="logo__subtitle">LEGAL • TAX • ADVISORY</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="nav-menu" aria-label="Main Navigation">
            <div class="nav-item">
              <a href="${root}index.html" class="nav-link" data-nav="home">Home</a>
            </div>

            <!-- About Dropdown -->
            <div class="nav-item">
              <a href="${root}about.html" class="nav-link" data-nav="about" aria-haspopup="true">
                About
                <svg class="icon"><use href="${sprite}#icon-chevron-down"></use></svg>
              </a>
              <div class="dropdown-menu" role="menu">
                <a href="${root}about.html" class="dropdown-link" role="menuitem">
                  <svg class="icon"><use href="${sprite}#icon-buildings"></use></svg>
                  Company Overview
                </a>
                <a href="${root}our-team.html" class="dropdown-link" role="menuitem">
                  <svg class="icon"><use href="${sprite}#icon-users"></use></svg>
                  Our Leadership Team
                </a>
                <a href="${root}infrastructure.html" class="dropdown-link" role="menuitem">
                  <svg class="icon"><use href="${sprite}#icon-server"></use></svg>
                  Infrastructure & Global Hub
                </a>
                <a href="${root}data-security.html" class="dropdown-link" role="menuitem">
                  <svg class="icon"><use href="${sprite}#icon-shield"></use></svg>
                  Data Security & Compliance
                </a>
                <a href="${root}industries.html" class="dropdown-link" role="menuitem">
                  <svg class="icon"><use href="${sprite}#icon-briefcase"></use></svg>
                  Industries We Serve
                </a>
                <a href="${root}faqs.html" class="dropdown-link" role="menuitem">
                  <svg class="icon"><use href="${sprite}#icon-alert-circle"></use></svg>
                  Frequently Asked Questions
                </a>
              </div>
            </div>

            <!-- Services Link -->
            <div class="nav-item">
              <a href="${root}enquiry.html#our-services" class="nav-link" data-nav="services" aria-haspopup="true">
                Services
                <svg class="icon"><use href="${sprite}#icon-chevron-down"></use></svg>
              </a>
              <div class="dropdown-menu dropdown-menu--services" role="menu">
                <a href="${root}enquiry.html?service=Legal%20%26%20Corporate%20Compliance#service-legal" class="dropdown-link" role="menuitem">Legal &amp; Corporate Compliance</a>
                <a href="${root}enquiry.html?service=Tax%20Consultancy%20%26%20Advisory#service-tax" class="dropdown-link" role="menuitem">Tax Consultancy &amp; Advisory</a>
                <a href="${root}enquiry.html?service=Bookkeeping%20%26%20Financial%20Preparation#service-bookkeeping" class="dropdown-link" role="menuitem">Bookkeeping &amp; Financial Preparation</a>
                <a href="${root}enquiry.html?service=Sales%20Tax%20/%20VAT%20/%20GST%20Filing#service-vat-gst" class="dropdown-link" role="menuitem">Sales Tax / VAT / GST Filing</a>
                <a href="${root}enquiry.html?service=Business%20Management%20Services#service-management" class="dropdown-link" role="menuitem">Business Management Services</a>
                <a href="${root}enquiry.html?service=Business%20Planning%20Consultancy#service-planning" class="dropdown-link" role="menuitem">Business Planning Consultancy</a>
                <a href="${root}enquiry.html?service=Business%20Research#service-research" class="dropdown-link" role="menuitem">Business Research</a>
                <a href="${root}enquiry.html?service=Company%20%26%20LLP%20Incorporation#service-incorporation" class="dropdown-link" role="menuitem">Company &amp; LLP Incorporation</a>
                <a href="${root}enquiry.html?service=HR%20%26%20Labour%20Law%20Consultancy#service-hr" class="dropdown-link" role="menuitem">HR &amp; Labour Law Consultancy</a>
                <a href="${root}enquiry.html?service=IPR%20/%20Trademark%20Services#service-ipr" class="dropdown-link" role="menuitem">IPR / Trademark Services</a>
                <a href="${root}enquiry.html?service=Payroll%20Processing#service-payroll" class="dropdown-link" role="menuitem">Payroll Processing</a>
                <a href="${root}enquiry.html?service=AP%20/%20AR%20Management#service-apar" class="dropdown-link" role="menuitem">AP / AR Management</a>
              </div>
            </div>

            <div class="nav-item">
              <a href="${root}blog.html" class="nav-link" data-nav="blog">Blog</a>
            </div>

            <div class="nav-item">
              <a href="${root}contact.html" class="nav-link" data-nav="contact">Contact</a>
            </div>
          </nav>

          <!-- Header Action & Mobile Hamburger -->
          <div class="header__actions">
            <!-- LOGIN DISABLED (un-comment to bring back)
            <a href="${root}login.html" class="header-login" id="header-login-btn" data-auth-link>
              <svg class="icon"><use href="${sprite}#icon-user"></use></svg>
              <span data-auth-label>Login</span>
            </a>
            -->
            <a href="${root}enquiry.html" class="btn btn--primary btn--sm" id="header-cta-btn">
              <span>Consultation</span>
              <svg class="icon"><use href="${sprite}#icon-arrow-right"></use></svg>
            </a>
            <button type="button" class="hamburger" id="hamburger-btn" aria-label="Open Mobile Navigation Menu" aria-expanded="false">
              <svg class="icon"><use href="${sprite}#icon-menu"></use></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Slide-in Mobile Drawer -->
      <div class="drawer-backdrop" id="drawer-backdrop"></div>
      <aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation">
        <div class="drawer__header">
          <div class="logo">
            <div class="logo__mark" style="width: 36px; height: 36px;">
              <svg class="logo__mark-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span class="logo__title" style="font-size: 1.05rem;">PREMAINS LLP</span>
          </div>
          <button type="button" class="drawer__close" id="drawer-close-btn" aria-label="Close navigation">
            <svg class="icon"><use href="${sprite}#icon-close"></use></svg>
          </button>
        </div>

        <div class="drawer__body">
          <ul class="drawer-nav__list">
            <li class="drawer-nav__item">
              <a href="${root}index.html" class="drawer-nav__link">Home</a>
            </li>

            <!-- Mobile About Accordion -->
            <li class="drawer-nav__item">
              <button type="button" class="drawer-accordion__btn" aria-expanded="false">
                <span>About Firm</span>
                <svg class="icon"><use href="${sprite}#icon-chevron-down"></use></svg>
              </button>
              <div class="drawer-accordion__content">
                <a href="${root}about.html" class="drawer-sub__link">Company Overview</a>
                <a href="${root}our-team.html" class="drawer-sub__link">Our Leadership Team</a>
                <a href="${root}infrastructure.html" class="drawer-sub__link">Infrastructure & Global Hub</a>
                <a href="${root}data-security.html" class="drawer-sub__link">Data Security & Compliance</a>
                <a href="${root}industries.html" class="drawer-sub__link">Industries We Serve</a>
                <a href="${root}faqs.html" class="drawer-sub__link">Frequently Asked Questions</a>
              </div>
            </li>

            <!-- Mobile Services Link -->
            <li class="drawer-nav__item">
              <button type="button" class="drawer-accordion__btn" aria-expanded="false">
                <span>Services</span>
                <svg class="icon"><use href="${sprite}#icon-chevron-down"></use></svg>
              </button>
              <div class="drawer-accordion__content">
                <a href="${root}enquiry.html?service=Legal%20%26%20Corporate%20Compliance#service-legal" class="drawer-sub__link">Legal &amp; Corporate Compliance</a>
                <a href="${root}enquiry.html?service=Tax%20Consultancy%20%26%20Advisory#service-tax" class="drawer-sub__link">Tax Consultancy &amp; Advisory</a>
                <a href="${root}enquiry.html?service=Bookkeeping%20%26%20Financial%20Preparation#service-bookkeeping" class="drawer-sub__link">Bookkeeping &amp; Financial Preparation</a>
                <a href="${root}enquiry.html?service=Sales%20Tax%20/%20VAT%20/%20GST%20Filing#service-vat-gst" class="drawer-sub__link">Sales Tax / VAT / GST Filing</a>
                <a href="${root}enquiry.html?service=Business%20Management%20Services#service-management" class="drawer-sub__link">Business Management Services</a>
                <a href="${root}enquiry.html?service=Business%20Planning%20Consultancy#service-planning" class="drawer-sub__link">Business Planning Consultancy</a>
                <a href="${root}enquiry.html?service=Business%20Research#service-research" class="drawer-sub__link">Business Research</a>
                <a href="${root}enquiry.html?service=Company%20%26%20LLP%20Incorporation#service-incorporation" class="drawer-sub__link">Company &amp; LLP Incorporation</a>
                <a href="${root}enquiry.html?service=HR%20%26%20Labour%20Law%20Consultancy#service-hr" class="drawer-sub__link">HR &amp; Labour Law Consultancy</a>
                <a href="${root}enquiry.html?service=IPR%20/%20Trademark%20Services#service-ipr" class="drawer-sub__link">IPR / Trademark Services</a>
                <a href="${root}enquiry.html?service=Payroll%20Processing#service-payroll" class="drawer-sub__link">Payroll Processing</a>
                <a href="${root}enquiry.html?service=AP%20/%20AR%20Management#service-apar" class="drawer-sub__link">AP / AR Management</a>
              </div>
            </li>

            <li class="drawer-nav__item">
              <a href="${root}blog.html" class="drawer-nav__link">Knowledge & Insights</a>
            </li>

            <li class="drawer-nav__item">
              <a href="${root}contact.html" class="drawer-nav__link">Contact Us</a>
            </li>

            <!-- LOGIN DISABLED (un-comment to bring back)
            <li class="drawer-nav__item">
              <a href="${root}login.html" class="drawer-nav__link" data-auth-link>Login</a>
            </li>
            -->
          </ul>
        </div>

        <div class="drawer__footer">
          <a href="${root}enquiry.html" class="btn btn--primary" style="width: 100%; margin-bottom: 12px;">
            Book Consultation
          </a>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); text-align: center;">
            Call / WhatsApp: <a href="tel:${cfg.contact.phone.replace(/\s+/g, '')}" style="color: var(--color-primary); font-weight: 700;">${cfg.contact.phoneDisplay}</a>
          </div>
        </div>
      </aside>
    `;
  }

  // Render Footer
  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    const currentYear = new Date().getFullYear();
    footerContainer.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <!-- Brand Column -->
            <div class="footer__brand">
              <div class="logo">
                <div class="logo__mark">
                  <svg class="logo__mark-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div class="logo__text">
                  <span class="logo__title">PREMAINS INTELLECT LLP</span>
                  <span class="logo__subtitle">LLP • CORPORATE ADVISORY</span>
                </div>
              </div>
              <p>
                Premier offshore accounting, bookkeeping, taxation, and financial outsourcing advisory. Empowering CPA practices, tech startups, and global enterprises with high-precision Indian talent.
              </p>
              <div class="footer__contact-info">
                <div class="footer__contact-item">
                  <svg class="icon"><use href="${sprite}#icon-location"></use></svg>
                  <span>${cfg.brand.headquarters}</span>
                </div>
                <div class="footer__contact-item">
                  <svg class="icon"><use href="${sprite}#icon-phone"></use></svg>
                  <span><a href="tel:${cfg.contact.phone.replace(/\s+/g, '')}">${cfg.contact.phoneDisplay}</a></span>
                </div>
                <div class="footer__contact-item">
                  <svg class="icon"><use href="${sprite}#icon-email"></use></svg>
                  <span><a href="mailto:${cfg.contact.primaryEmail}">${cfg.contact.primaryEmail}</a></span>
                </div>
              </div>
            </div>

            <!-- Our Services -->
            <div>
              <h4 class="footer__col-title">Our Services</h4>
              <ul class="footer__links">
                <li><a href="${root}enquiry.html" class="footer__link">Corporate Compliance</a></li>
                <li><a href="${root}enquiry.html" class="footer__link">Financial Preparation</a></li>
                <li><a href="${root}enquiry.html" class="footer__link">Business Research</a></li>
                <li><a href="${root}enquiry.html" class="footer__link">HR & Labour Law Consultancy</a></li>
                <li><a href="${root}enquiry.html" class="footer__link">Tax Consultancy</a></li>
                <li><a href="${root}enquiry.html" class="footer__link">Company Incorporation</a></li>
                <li><a href="${root}enquiry.html" class="footer__link">IPR / Trademark Services</a></li>
              </ul>
            </div>

            <!-- Quick Links & Newsletter -->
            <div>
              <h4 class="footer__col-title">Practice Links</h4>
              <ul class="footer__links" style="margin-bottom: 20px;">
                <li><a href="${root}about.html" class="footer__link">About Premains Intellect</a></li>
                <li><a href="${root}our-team.html" class="footer__link">Executive Leadership</a></li>
                <li><a href="${root}infrastructure.html" class="footer__link">Secure Infrastructure</a></li>
                <li><a href="${root}data-security.html" class="footer__link">SOC & ISO Protocols</a></li>
                <li><a href="${root}faqs.html" class="footer__link">Knowledge FAQ</a></li>
                <li><a href="${root}blog.html" class="footer__link">Insights & Tax Updates</a></li>
              </ul>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="footer__bottom">
            <div>
              &copy; <span id="current-year">${currentYear}</span> ${cfg.brand.name}. All Rights Reserved.
            </div>
            <div class="footer__bottom-links">
              <span class="footer__credit">Designed &amp; developed by Junaid Khan</span>
              <a href="${root}privacy-policy.html">Privacy Policy</a>
              <a href="${root}terms.html">Terms of Engagement</a>
              <a href="${root}data-security.html">Data Security Policy</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // Floating WhatsApp & Back-To-Top
  const floatingContainer = document.createElement('div');
  floatingContainer.id = 'floating-widgets';
  floatingContainer.innerHTML = `
    <!-- Floating WhatsApp -->
    <a href="${cfg.contact.whatsappLink}" target="_blank" rel="noopener" class="whatsapp-float" id="btn-whatsapp-float" aria-label="Chat directly on WhatsApp with our Advisory Team">
      <svg class="icon"><use href="${sprite}#icon-whatsapp"></use></svg>
    </a>

    <!-- Back to top -->
    <button type="button" class="back-to-top" id="btn-back-to-top" aria-label="Scroll back to top of page">
      <svg class="icon"><use href="${sprite}#icon-chevron-up"></use></svg>
    </button>

    <!-- Cookie Consent Banner -->
    <div class="cookie-banner" id="cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <h3 class="cookie-banner__title" id="cookie-title">
        <svg class="icon" style="color: var(--color-accent);"><use href="${sprite}#icon-shield"></use></svg>
        Data Privacy & Cookie Consent
      </h3>
      <p class="cookie-banner__text">
        We respect your privacy. We use functional and analytical cookies to safeguard client communications and refine your advisory browsing experience according to GDPR and ISO 27001 standards.
      </p>
      <div class="cookie-banner__actions">
        <button type="button" class="btn btn--primary btn--sm" id="cookie-accept-all">Accept All</button>
        <button type="button" class="btn btn--outline-navy btn--sm" id="cookie-reject-all">Reject Non-Essential</button>
        <a href="${root}privacy-policy.html" style="font-size: 0.8rem; text-decoration: underline; align-self: center; margin-left: 8px;">Learn More</a>
      </div>
    </div>
  `;
  document.body.appendChild(floatingContainer);

  // If a Supabase session is stored in this browser, the Login link becomes "My Account".
  // (Only a cheap storage check here; the real session check happens on the login/enquiry pages.)
  (function markSignedIn() {
    try {
      const url = cfg.supabase && cfg.supabase.url;
      if (!url) return;
      const ref = new URL(url).hostname.split('.')[0];
      if (!window.localStorage.getItem('sb-' + ref + '-auth-token')) return;
      document.querySelectorAll('[data-auth-link]').forEach((a) => {
        const label = a.querySelector('[data-auth-label]');
        (label || a).textContent = 'My Account';
        a.setAttribute('href', root + 'login.html');
      });
    } catch (e) { /* storage blocked: leave the Login link */ }
  })();

  // Auto-highlight active navigation item
  function highlightActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '').toLowerCase();

      if (currentPath.endsWith('/' + cleanHref) ||
        (cleanHref === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')))) {
        link.classList.add('active');
      } else if (cleanHref.startsWith('services/') && currentPath.includes('/services/')) {
        link.classList.add('active');
      }
    });
  }

  highlightActiveNav();
})();
