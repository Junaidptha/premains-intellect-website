/**
 * PREMAINS INTELLECT LLP - Global Configuration File
 * All contact details, form submission keys, and analytics IDs are maintained here.
 */
const SITE_CONFIG = {
  brand: {
    name: "PREMAINS INTELLECT LLP",
    shortName: "Premains Intellect",
    tagline: "Legal, Corporate, Tax & Technical Advisory — Trusted by Businesses, Startups & Individuals",
    headquarters: "38B, Baishnab Ghata Road, G F, Debanjali Apartment, Naktala, Netaji Nagar, Kolkata, West Bengal - 700047, India",
    city: "Kolkata",
    country: "India",
    establishedYear: 2011,
    experienceYears: "15+"
  },
  contact: {
    phone: "+91 9818122696",
    phoneDisplay: "+91 98181 22696",
    whatsapp: "+919818122696",
    whatsappLink: "https://wa.me/919818122696?text=Hello%20Premains%20Intellect%2C%20I%20would%20like%20to%20inquire%20about%20your%20offshore%20accounting%20and%20tax%20advisory%20services.",
    emails: [
      "chandanmallb@gmail.com",
      "engineerkundansharma@gmail.com"
    ],
    primaryEmail: "premains.legal@gmail.com",
    supportEmail: "engineerkundansharma@gmail.com",
    hours: "Monday – Saturday: 9:00 AM – 7:30 PM IST (24/7 Client Coverage for US, CA, AU, UAE)"
  },
  social: {
    linkedin: "https://www.linkedin.com/company/premains-intellect",
    twitter: "https://twitter.com/premainsintellect",
    facebook: "https://facebook.com/premainsintellect",
    youtube: "https://youtube.com/@premainsintellect"
  },
  // Form submission: configured for Web3Forms or Formspree
  // If accessKey is 'demo-mode' or empty, the frontend form simulator will provide an authentic instant success preview
  forms: {
    service: "web3forms", // "web3forms" | "formspree" | "demo"
    accessKey: "demo-mode", // Replace with your Web3Forms Access Key (e.g., 'xxxx-xxxx-xxxx-xxxx') or Formspree ID
    actionUrl: "https://api.web3forms.com/submit"
  },
  // Supabase: login + Free Trial / Consultation requests.
  // The publishable key is PUBLIC by design (row level security protects the data).
  // NEVER put a secret / service_role key in this file.
  supabase: {
    url: "https://milyscsniqhlisfhahzm.supabase.co",
    publishableKey: "sb_publishable_-ZhqU2pWyBr6rGHUTdqcoA_SYYhMd2f"
  },
  // Google Analytics 4 Measurement ID
  analytics: {
    gaId: "G-PREMAINS2026", // Set your GA4 ID here
    enabled: true
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}
