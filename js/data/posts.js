/**
 * PREMAINS INTELLECT LLP - Blog Posts Database
 * Used for dynamic filtering, search, and related articles.
 */
const BLOG_POSTS = [
  {
    id: "navigating-us-corporate-tax-for-foreign-subsidiaries",
    title: "Navigating US Corporate Tax & Form 5472 for Foreign-Owned US Entities",
    slug: "navigating-us-corporate-tax-for-foreign-subsidiaries.html",
    category: "USA Tax",
    date: "October 8, 2026",
    isoDate: "2026-10-08",
    readTime: "7 min read",
    author: {
      name: "Chandan Mal, Advocate",
      role: "Managing Partner & Legal Tax Counsel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    excerpt: "Foreign entrepreneurs and multi-entity corporations face intense IRS scrutiny under Section 6038A. Learn how to maintain transfer pricing documentation, prepare Form 5472, and avoid the $25,000 per violation penalty.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    tags: ["Form 5472", "US Taxation", "Transfer Pricing", "IRS Compliance", "Offshore Advisory"],
    featured: true
  },
  {
    id: "uae-corporate-tax-compliance-guide",
    title: "UAE Corporate Tax Law: Qualifying Free Zone Person (QFZP) Rules Demystified",
    slug: "uae-corporate-tax-compliance-guide.html",
    category: "UAE Corporate Tax",
    date: "September 24, 2026",
    isoDate: "2026-09-24",
    readTime: "6 min read",
    author: {
      name: "Er. Kundan Sharma",
      role: "Partner & Operations Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
    },
    excerpt: "The UAE's 9% Federal Corporate Tax regime introduces stringent economic substance and qualifying income conditions. Discover the vital auditing checklist for Free Zone businesses to retain 0% tax benefit.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    tags: ["UAE Tax", "Free Zone", "QFZP", "FTA Compliance", "Dubai Business"],
    featured: true
  },
  {
    id: "why-cpa-firms-are-scaling-with-offshore-teams",
    title: "Why North American & Australian CPA Firms Are Scaling With India Offshore Hubs",
    slug: "why-cpa-firms-are-scaling-with-offshore-teams.html",
    category: "Practice Management",
    date: "September 12, 2026",
    isoDate: "2026-09-12",
    readTime: "8 min read",
    author: {
      name: "Chandan Mal, Advocate",
      role: "Managing Partner & Legal Tax Counsel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    excerpt: "With acute accountant shortages and climbing domestic salaries, top CPA practices leverage dedicated offshore talent in India. Here is how modern firms achieve 60% operational savings while raising turnaround speed and audit quality.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["CPA Outsourcing", "Offshore Bookkeeping", "Talent Shortage", "Practice Growth"],
    featured: false
  }
];

if (typeof window !== "undefined") {
  window.BLOG_POSTS = BLOG_POSTS;
}
