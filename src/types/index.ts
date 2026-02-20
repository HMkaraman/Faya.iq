// Bilingual string helper
export interface Bilingual {
  en: string;
  ar: string;
}

// Service
export interface Service {
  id: string;
  slug: string;
  category: string;
  categorySlug: string;
  name: Bilingual;
  shortDescription: Bilingual;
  description: Bilingual;
  icon: string;
  image: string;
  tags: string[];
  branches: string[];
  duration?: string;
  priceRange?: Bilingual;
  benefits: { en: string[]; ar: string[] };
  steps: { en: string[]; ar: string[] };
  downtime: Bilingual;
  faq: { question: Bilingual; answer: Bilingual }[];
}

// Service Category
export interface ServiceCategory {
  slug: string;
  name: Bilingual;
  icon: string;
  description: Bilingual;
  image: string;
}

// Branch
export interface Branch {
  id: string;
  slug: string;
  name: Bilingual;
  city: Bilingual;
  address: Bilingual;
  phone: string;
  whatsapp: string;
  email: string;
  hours: Bilingual;
  rating: number;
  reviewCount: number;
  image: string;
  mapUrl: string;
  coordinates: { lat: number; lng: number };
  availableServices: string[];
  hasGallery: boolean;
  teamMembers: string[];
  features: { en: string[]; ar: string[] };
}

// Team Member
export interface TeamMember {
  id: string;
  name: Bilingual;
  title: Bilingual;
  specialization: Bilingual;
  bio: Bilingual;
  image: string;
  branches: string[];
  credentials: string[];
  yearsExperience: number;
}

// Blog Post
export interface BlogPost {
  id: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  content: Bilingual;
  category: string;
  tags: string[];
  author: string;
  authorImage: string;
  image: string;
  publishedAt: string;
  readTime: Bilingual;
  featured: boolean;
}

// Testimonial
export interface Testimonial {
  id: string;
  name: Bilingual;
  service: Bilingual;
  branch: string;
  rating: number;
  text: Bilingual;
  image: string;
}

// Offer
export interface Offer {
  id: string;
  title: Bilingual;
  description: Bilingual;
  discount: string;
  originalPrice: Bilingual;
  salePrice: Bilingual;
  image: string;
  validUntil: string;
  branches: Bilingual;
  tag: Bilingual;
  active: boolean;
}

// Gallery Item
export interface GalleryItem {
  id: string;
  title: Bilingual;
  category: string;
  type: "before-after" | "showcase";
  beforeImage: string;
  afterImage: string;
  doctor: Bilingual;
  sessions: number;
  tags: Bilingual[];
  active: boolean;
}

// Booking
export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  branchId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

// Site Settings
export interface SiteSettings {
  siteName: string;
  logoText: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    hours: Bilingual;
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
  seo: {
    title: Bilingual;
    description: Bilingual;
    keywords: string[];
  };
  header: {
    navItems: { href: string; label: Bilingual }[];
    ctaText: Bilingual;
    ctaHref: string;
  };
  footer: {
    description: Bilingual;
    copyrightYear: number;
  };
}

// Admin User
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}
