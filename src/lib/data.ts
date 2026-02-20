import fs from "fs";
import path from "path";
import type {
  Service,
  ServiceCategory,
  Branch,
  TeamMember,
  BlogPost,
  Testimonial,
  Offer,
  GalleryItem,
  Booking,
  SiteSettings,
  AdminUser,
} from "@/types";

const dataDir = path.join(process.cwd(), "src", "data", "json");

export function readData<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeData<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Convenience getters
export function getServices(): Service[] {
  return readData<Service[]>("services.json");
}

export function getServiceCategories(): ServiceCategory[] {
  return readData<ServiceCategory[]>("service-categories.json");
}

export function getBranches(): Branch[] {
  return readData<Branch[]>("branches.json");
}

export function getTeamMembers(): TeamMember[] {
  return readData<TeamMember[]>("team.json");
}

export function getBlogPosts(): BlogPost[] {
  return readData<BlogPost[]>("blog.json");
}

export function getTestimonials(): Testimonial[] {
  return readData<Testimonial[]>("testimonials.json");
}

export function getOffers(): Offer[] {
  return readData<Offer[]>("offers.json");
}

export function getGalleryItems(): GalleryItem[] {
  return readData<GalleryItem[]>("gallery.json");
}

export function getBookings(): Booking[] {
  return readData<Booking[]>("bookings.json");
}

export function getSettings(): SiteSettings {
  return readData<SiteSettings>("settings.json");
}

export function getUsers(): AdminUser[] {
  return readData<AdminUser[]>("users.json");
}
