"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "./AdminProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

const sidebarKeys = [
  "dashboard", "services", "categories", "branches", "team",
  "blog", "testimonials", "offers", "gallery", "heroSlides", "bookings", "settings", "users",
] as const;

interface NavItem {
  key: typeof sidebarKeys[number];
  href: string;
  icon: string;
  badge?: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { key: "dashboard", href: "/admin", icon: "dashboard" },
  { key: "services", href: "/admin/services", icon: "spa", roles: ["admin", "editor"] },
  { key: "categories", href: "/admin/categories", icon: "category", roles: ["admin", "editor"] },
  { key: "branches", href: "/admin/branches", icon: "location_on", roles: ["admin", "editor"] },
  { key: "team", href: "/admin/team", icon: "group", roles: ["admin", "editor"] },
  { key: "blog", href: "/admin/blog", icon: "article", roles: ["admin", "editor"] },
  { key: "testimonials", href: "/admin/testimonials", icon: "format_quote", roles: ["admin", "editor"] },
  { key: "offers", href: "/admin/offers", icon: "local_offer", roles: ["admin", "editor"] },
  { key: "gallery", href: "/admin/gallery", icon: "photo_library", roles: ["admin", "editor"] },
  { key: "heroSlides", href: "/admin/hero-slides", icon: "slideshow", roles: ["admin", "editor"] },
  { key: "bookings", href: "/admin/bookings", icon: "calendar_month" },
  { key: "settings", href: "/admin/settings", icon: "settings", roles: ["admin"] },
  { key: "users", href: "/admin/users", icon: "admin_panel_settings", roles: ["admin"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, user } = useAdmin();
  const { t, lang, toggleLanguage, dir } = useLanguage();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setSidebarOpen]);

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role ? item.roles.includes(user.role) : false;
  });

  const isRTL = dir === "rtl";

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 z-50 h-screen w-64 bg-gray-900 text-white
          flex flex-col shrink-0 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:z-auto
          ${isRTL ? "right-0" : "left-0"}
          ${sidebarOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Faya.iq</span>
            <span className="text-sm text-gray-400 font-medium">{t(adminI18n.sidebar.admin)}</span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-gray-400">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    active
                      ? "bg-primary/20 text-primary"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="flex-1">{t(adminI18n.sidebar[item.key])}</span>
                {item.key === "users" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-white font-semibold uppercase">
                    {t(adminI18n.sidebar.admin)}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="my-3 border-t border-gray-800" />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">translate</span>
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Back to Site */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isRTL ? "arrow_forward" : "arrow_back"}
            </span>
            <span>{t(adminI18n.sidebar.backToSite)}</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Faya.iq</p>
        </div>
      </aside>
    </>
  );
}
