"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface NavItem {
  href: string;
  label: { en: string; ar: string };
}

const navItems: NavItem[] = [
  { href: "/", label: { en: "Home", ar: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" } },
  { href: "/services", label: { en: "Services", ar: "\u0627\u0644\u062E\u062F\u0645\u0627\u062A" } },
  { href: "/gallery", label: { en: "Gallery", ar: "\u0627\u0644\u0645\u0639\u0631\u0636" } },
  { href: "/branches", label: { en: "Branches", ar: "\u0627\u0644\u0641\u0631\u0648\u0639" } },
  { href: "/blog", label: { en: "Blog", ar: "\u0627\u0644\u0645\u062F\u0648\u0651\u0646\u0629" } },
  { href: "/contact", label: { en: "Contact", ar: "\u062A\u0648\u0627\u0635\u0644" } },
];

export default function Header() {
  const { lang, dir, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for enhanced shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        dir={dir}
        className={`
          fixed top-0 left-0 right-0 z-50 h-[72px]
          bg-white/80 backdrop-blur-md
          border-b border-primary/10
          transition-shadow duration-300
          ${scrolled ? "shadow-lg shadow-primary/5" : "shadow-none"}
        `}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
          >
            <span
              className="material-symbols-outlined text-primary text-[28px] transition-transform duration-300 group-hover:rotate-12"
              aria-hidden="true"
            >
              spa
            </span>
            <span
              className="text-[22px] font-bold tracking-wide text-[#333333]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Faya
              <span className="text-primary">.iq</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={lang === "ar" ? "\u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0631\u0626\u064A\u0633\u064A" : "Main navigation"}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-[#333333] hover:text-primary"
                  }
                `}
              >
                {t(item.label)}
                {/* Active indicator line */}
                <span
                  className={`
                    absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-primary
                    transition-all duration-300
                    ${isActive(item.href) ? "w-4/5" : "w-0"}
                  `}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full border border-primary/20
                text-xs font-semibold text-[#8c7284]
                transition-all duration-200
                hover:border-primary/40 hover:bg-[#fbf9fa] hover:text-primary
                active:scale-95
              "
              aria-label={
                lang === "ar"
                  ? "Switch to English"
                  : "\u0627\u0644\u062A\u0628\u062F\u064A\u0644 \u0625\u0644\u0649 \u0627\u0644\u0639\u0631\u0628\u064A\u0629"
              }
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>

            {/* Book Now CTA - Desktop */}
            <Link
              href="/contact"
              className="
                hidden items-center gap-1.5 rounded-full
                bg-primary px-5 py-2 text-sm font-semibold text-white
                shadow-md shadow-primary/20
                transition-all duration-200
                hover:shadow-lg hover:shadow-primary/30 hover:brightness-110
                active:scale-[0.97]
                sm:flex
              "
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                calendar_month
              </span>
              {t({ en: "Book Now", ar: "\u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646" })}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-lg text-[#333333]
                transition-colors duration-200
                hover:bg-[#fbf9fa]
                active:scale-95
                lg:hidden
              "
              aria-label={
                mobileMenuOpen
                  ? t({ en: "Close menu", ar: "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629" })
                  : t({ en: "Open menu", ar: "\u0641\u062A\u062D \u0627\u0644\u0642\u0627\u0626\u0645\u0629" })
              }
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to offset fixed header */}
      <div className="h-[72px]" />

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
          transition-opacity duration-300
          lg:hidden
          ${mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div
        dir={dir}
        className={`
          fixed top-0 z-50 h-full w-[300px] max-w-[85vw]
          bg-white shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${
            dir === "rtl"
              ? `left-auto right-0 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`
              : `left-0 right-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
          }
        `}
        role="dialog"
        aria-modal="true"
        aria-label={t({ en: "Mobile navigation", ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0646\u0642\u0644" })}
      >
        {/* Drawer Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-primary/10 px-5">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span
              className="material-symbols-outlined text-primary text-[24px]"
              aria-hidden="true"
            >
              spa
            </span>
            <span
              className="text-[20px] font-bold text-[#333333]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Faya<span className="text-primary">.iq</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg text-[#8c7284]
              transition-colors duration-200
              hover:bg-[#fbf9fa] hover:text-[#333333]
            "
            aria-label={t({ en: "Close menu", ar: "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629" })}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3
                text-[15px] font-medium transition-all duration-200
                ${
                  isActive(item.href)
                    ? "bg-[#fbf9fa] text-primary"
                    : "text-[#333333] hover:bg-[#fbf9fa] hover:text-primary"
                }
              `}
            >
              {t(item.label)}
              {isActive(item.href) && (
                <span
                  className={`
                    ${dir === "rtl" ? "mr-auto" : "ml-auto"}
                    h-1.5 w-1.5 rounded-full bg-primary
                  `}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-primary/10 p-5">
          {/* Mobile Book Now CTA */}
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="
              flex w-full items-center justify-center gap-2 rounded-full
              bg-primary px-5 py-3 text-sm font-semibold text-white
              shadow-md shadow-primary/20
              transition-all duration-200
              hover:shadow-lg hover:brightness-110
              active:scale-[0.97]
            "
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              calendar_month
            </span>
            {t({ en: "Book Now", ar: "\u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646" })}
          </Link>

          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="
              mt-3 flex w-full items-center justify-center gap-2
              rounded-full border border-primary/20
              px-5 py-2.5 text-sm font-medium text-[#8c7284]
              transition-all duration-200
              hover:border-primary/40 hover:text-primary
              active:scale-[0.97]
            "
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              translate
            </span>
            {lang === "ar" ? "English" : "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"}
          </button>
        </div>
      </div>
    </>
  );
}
