# PREMAINS INTELLECT LLP - Corporate Website

> **Legal, Corporate, Tax & Technical Advisory — Trusted by Businesses, Startups & Individuals**  
> Headquarters: 38B, Baishnab Ghata Road, G F, Debanjali Apartment, Naktala, Netaji Nagar, Kolkata, West Bengal - 700047, India  
> Phone/WhatsApp: +91 9818122696 | Emails: chandanmallb@gmail.com, engineerkundansharma@gmail.com  
> Markets Served: India, USA, Canada, Australia, United Arab Emirates (UAE)

---

## 1. Overview & Architecture

This repository contains the complete, production-ready, multi-page corporate website for **PREMAINS INTELLECT LLP**, an offshore accounting, bookkeeping, taxation, and financial outsourcing firm.

The website is engineered entirely with **semantic HTML5, modern CSS3, and modular Vanilla JavaScript (ES6+)**.
- **Zero frameworks, zero node_modules, zero build tools.**
- Runs immediately by opening `index.html` in any web browser or via VS Code Live Server.
- Features a single-source shared header and footer injected via `js/components.js` with active navigation detection.
- Includes a desktop 4-column mega menu (USA, Australia, Canada, UAE), slide-in mobile navigation drawer, interactive SVG world map, count-up statistics, testimonials carousel, accordion FAQs, client-side form validation, and GDPR-compliant cookie consent with GA4 triggers.

---

## 2. Tech Stack

- **Markup:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Styling:** Vanilla CSS3 (`css/style.css`) using CSS Custom Properties (variables), Flexbox, CSS Grid, BEM naming conventions, and mobile-first media queries (`576px`, `768px`, `992px`, `1200px`).
- **Scripts:** Modular Vanilla ES6+ (`main.js`, `components.js`, `nav.js`, `animations.js`, `counters.js`, `carousel.js`, `accordion.js`, `form.js`, `cookies.js`, `map.js`).
- **Typography:** Google Fonts (`Plus Jakarta Sans` for headings, `Inter` for body) with `font-display: swap` and `preconnect`.
- **Icons:** Inline SVG sprite system (`assets/icons/icons.svg`) — zero external icon fonts or heavy libraries.
- **Forms:** Client-side validation + honeypot anti-spam + API submission to Web3Forms / Formspree.

---

## 3. Directory Structure

```
├── index.html                                 # Homepage with all 14 structured sections
├── about.html                                 # Firm history, vision, and core pillars
├── our-team.html                              # Leadership & partner bios with anchors
├── infrastructure.html                        # Kolkata delivery hub technical specifications
├── data-security.html                         # ISO 27001, NDAs, and zero-trust security
├── industries.html                            # 8 dedicated commercial industry breakdowns
├── faqs.html                                  # Comprehensive searchable FAQ accordion
├── contact.html                               # Contact details, embedded Google Map, message form
├── enquiry.html                               # 30-min consultation discovery form
├── blog.html                                  # Blog listing with live search & category filters
├── privacy-policy.html                        # GDPR and client confidentiality statement
├── terms.html                                 # Professional terms of engagement
├── 404.html                                   # Custom error fallback page
├── sitemap.xml                                # XML Sitemap with 54 indexed pages
├── robots.txt                                 # Search engine crawler instructions
│
├── services/
│   ├── usa.html                               # United States Practice Hub
│   ├── canada.html                            # Canada Practice Hub
│   ├── australia.html                         # Australia Practice Hub
│   ├── uae.html                               # United Arab Emirates Practice Hub
│   │
│   ├── usa/                                   # 9 Individual US Service Pages
│   │   ├── virtual-cfo.html
│   │   ├── accounting-bookkeeping.html
│   │   ├── tax-return-preparation.html
│   │   ├── sales-tax-preparation.html
│   │   ├── financial-statement-preparation.html
│   │   ├── business-formation-support.html
│   │   ├── payroll-processing.html
│   │   ├── apar-management.html
│   │   └── bank-reconciliation.html
│   │
│   ├── australia/                             # 9 Individual Australian Service Pages
│   │   ├── accounting-bookkeeping.html
│   │   ├── bas-preparation.html
│   │   ├── payroll.html
│   │   ├── apar.html
│   │   ├── bank-reconciliation.html
│   │   ├── virtual-cfo.html
│   │   ├── superannuation-calculation.html
│   │   ├── income-tax-return-prep.html
│   │   └── asic-compliance.html
│   │
│   ├── canada/                                # 7 Individual Canadian Service Pages
│   │   ├── accounting-bookkeeping.html
│   │   ├── tax-return-preparation.html
│   │   ├── cra-compliance.html
│   │   ├── payroll.html
│   │   ├── apar.html
│   │   ├── bank-reconciliation.html
│   │   └── virtual-cfo.html
│   │
│   └── uae/                                   # 10 Individual UAE Service Pages
│       ├── accounting-bookkeeping.html
│       ├── vat-return-filing.html
│       ├── corporate-tax-support.html
│       ├── apar.html
│       ├── payroll.html
│       ├── bank-reconciliation.html
│       ├── financial-statement-preparation.html
│       ├── cash-flow-budgeting.html
│       ├── business-setup.html
│       └── virtual-cfo.html
│
├── blog/                                      # Full In-depth Articles
│   ├── navigating-us-corporate-tax-for-foreign-subsidiaries.html
│   ├── uae-corporate-tax-compliance-guide.html
│   └── why-cpa-firms-are-scaling-with-offshore-teams.html
│
├── css/
│   └── style.css                              # Master stylesheet (variables, components, layout)
│
├── js/
│   ├── main.js                                # Global initializer & conversion tracking
│   ├── components.js                          # Shared header/footer/mega-menu/drawer injector
│   ├── nav.js                                 # Sticky header & mobile drawer interactions
│   ├── animations.js                          # IntersectionObserver scroll reveal animations
│   ├── counters.js                            # Count-up statistics on scroll
│   ├── carousel.js                            # Testimonials touch/keyboard slider
│   ├── accordion.js                           # Accessible expand/collapse accordion
│   ├── form.js                                # Client validation & Web3Forms/Formspree submit
│   ├── cookies.js                             # GDPR cookie consent banner & GA4 loader
│   ├── map.js                                 # Interactive SVG world map markers & tooltips
│   └── data/
│       ├── config.js                          # Centralized contact, form key, and GA ID
│       └── posts.js                           # Blog posts database for dynamic search/filter
│
└── assets/
    ├── icons/icons.svg                        # SVG symbol sprite (UI icons + country flags)
    ├── images/                                # Local graphic assets
    └── flags/                                 # Country flag vectors
```

---

## 4. Local Setup & Running Instructions

### Option A: VS Code Live Server (Recommended)
1. Open this repository folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The website will launch automatically at `http://127.0.0.1:5500/index.html`.

### Option B: Direct Browser Opening
- Double-click `index.html` or drag it into any modern web browser (Chrome, Edge, Safari, Firefox).
- The dynamic path resolver in `js/components.js` automatically detects directory depth, so all navigation links, styles, and SVG icons will resolve flawlessly under both HTTP and `file://` protocols.

---

## 5. Configuration & Content Customization

### Centralized Configuration (`js/data/config.js`)
All contact details, social links, form endpoints, and analytics keys are configured in one file:

```javascript
const SITE_CONFIG = {
  brand: {
    name: "PREMAINS INTELLECT LLP",
    headquarters: "38B, Baishnab Ghata Road, G F, Debanjali Apartment, Naktala, Netaji Nagar, Kolkata, West Bengal - 700047, India"
  },
  contact: {
    phone: "+91 9818122696",
    whatsappLink: "https://wa.me/919818122696?text=...",
    primaryEmail: "chandanmallb@gmail.com",
    supportEmail: "engineerkundansharma@gmail.com"
  },
  forms: {
    service: "web3forms",
    accessKey: "demo-mode", // Insert your Web3Forms Access Key or Formspree Form ID
    actionUrl: "https://api.web3forms.com/submit"
  },
  analytics: {
    gaId: "G-PREMAINS2026", // Set your Google Analytics 4 Measurement ID
    enabled: true
  }
};
```

### Form Setup (Web3Forms / Formspree)
- To receive live email submissions from `enquiry.html` and `contact.html`, obtain a free key at [Web3Forms](https://web3forms.com/) or [Formspree](https://formspree.io/).
- Set `accessKey: "YOUR-ACCESS-KEY"` in `js/data/config.js`.
- In `"demo-mode"`, the form displays an authentic success confirmation for local testing without transmitting external network requests.

---

## 6. How to Add New Content

### Adding a New Service Page:
1. Create a new `.html` file inside the appropriate country folder (e.g. `services/usa/new-service.html`).
2. Add `<meta name="root-path" content="../../">` in the `<head>`.
3. Include `<link rel="stylesheet" href="../../css/style.css">` and standard scripts.
4. Add the service entry in `js/components.js` under the respective country column of the Mega Menu.

### Adding a New Blog Post:
1. Add a new article object to the `BLOG_POSTS` array in `js/data/posts.js`:
   ```javascript
   {
     id: "my-article-slug",
     title: "Article Headline",
     slug: "my-article-slug.html",
     category: "USA Tax",
     date: "October 15, 2026",
     readTime: "5 min read",
     excerpt: "Summary of the article...",
     image: "https://images.unsplash.com/...",
     tags: ["Tax", "Advisory"]
   }
   ```
2. Create the HTML file `blog/my-article-slug.html`.
3. The article will automatically be indexed, searchable, and filterable on `blog.html`.

---

## 7. Performance & Accessibility Standards

- **Semantic HTML5:** Single `<h1>` per page, hierarchical headings, skip-to-content links.
- **Accessibility:** Tested for WCAG 2.1 AA color contrast, visible focus states, ARIA attributes on accordions, menus, and forms.
- **Micro-Animations:** Full support for `prefers-reduced-motion` across CSS keyframes and JavaScript observers.
- **SEO Ready:** Schema.org JSON-LD (Organization, LocalBusiness, Breadcrumbs), Open Graph, Twitter Cards, `sitemap.xml`, and `robots.txt`.

---

© 2026 PREMAINS INTELLECT LLP. All Rights Reserved.
