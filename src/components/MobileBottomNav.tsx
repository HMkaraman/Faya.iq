"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { href: "/", icon: "home", label: { en: "Home", ar: "الرئيسية" } },
  { href: "/services", icon: "spa", label: { en: "Services", ar: "الخدمات" } },
  { href: "/booking", icon: "calendar_month", label: { en: "Book", ar: "حجز" } },
  { href: "/gallery", icon: "photo_library", label: { en: "Gallery", ar: "المعرض" } },
  { href: "/contact", icon: "menu", label: { en: "More", ar: "المزيد" } },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#f1eaec] md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 transition-colors ${
                isActive ? "text-[#c8567e]" : "text-[#8c7284]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? "font-semibold" : ""
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-tight">
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for notched devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
