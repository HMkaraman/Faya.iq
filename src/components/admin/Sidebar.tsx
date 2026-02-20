"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "./AdminProvider";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Services", href: "/admin/services", icon: "spa" },
  { label: "Categories", href: "/admin/categories", icon: "category" },
  { label: "Branches", href: "/admin/branches", icon: "location_on" },
  { label: "Team", href: "/admin/team", icon: "group" },
  { label: "Blog", href: "/admin/blog", icon: "article" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "format_quote" },
  { label: "Offers", href: "/admin/offers", icon: "local_offer" },
  { label: "Gallery", href: "/admin/gallery", icon: "photo_library" },
  { label: "Bookings", href: "/admin/bookings", icon: "calendar_month" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  { label: "Users", href: "/admin/users", icon: "admin_panel_settings", badge: "Admin" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAdmin();

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
          fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#c8567e]">Faya.iq</span>
            <span className="text-sm text-gray-400 font-medium">Admin</span>
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
          {navItems.map((item) => {
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
                      ? "bg-[#c8567e]/20 text-[#c8567e]"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c8567e]/30 text-[#c8567e] font-semibold uppercase">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="my-3 border-t border-gray-800" />

          {/* Back to Site */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Back to Site</span>
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
