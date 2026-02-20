"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function Footer() {
  const { lang, dir, t } = useLanguage();
  const [email, setEmail] = useState("");

  const treatmentLinks = [
    {
      href: "/treatments/laser-hair-removal",
      label: { en: "Laser Hair Removal", ar: "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0634\u0639\u0631 \u0628\u0627\u0644\u0644\u064a\u0632\u0631" },
    },
    {
      href: "/treatments/hydrafacial",
      label: { en: "HydraFacial", ar: "\u0647\u0627\u064a\u062f\u0631\u0627\u0641\u064a\u0634\u0644" },
    },
    {
      href: "/treatments/botox-fillers",
      label: { en: "Botox & Fillers", ar: "\u0628\u0648\u062a\u0648\u0643\u0633 \u0648\u0641\u064a\u0644\u0631" },
    },
    {
      href: "/treatments/dermal-fillers",
      label: { en: "Dermal Fillers", ar: "\u0641\u064a\u0644\u0631 \u0627\u0644\u0628\u0634\u0631\u0629" },
    },
    {
      href: "/treatments/hair-transplant",
      label: { en: "Hair Transplant", ar: "\u0632\u0631\u0627\u0639\u0629 \u0627\u0644\u0634\u0639\u0631" },
    },
    {
      href: "/treatments/chemical-peel",
      label: { en: "Chemical Peel", ar: "\u0627\u0644\u062a\u0642\u0634\u064a\u0631 \u0627\u0644\u0643\u064a\u0645\u064a\u0627\u0626\u064a" },
    },
  ];

  const companyLinks = [
    { href: "/about", label: { en: "About Us", ar: "\u0645\u0646 \u0646\u062d\u0646" } },
    { href: "/doctors", label: { en: "Our Doctors", ar: "\u0623\u0637\u0628\u0627\u0624\u0646\u0627" } },
    { href: "/branches", label: { en: "Branches", ar: "\u0627\u0644\u0641\u0631\u0648\u0639" } },
    { href: "/blog", label: { en: "Blog", ar: "\u0627\u0644\u0645\u062f\u0648\u0646\u0629" } },
    { href: "/careers", label: { en: "Careers", ar: "\u0627\u0644\u0648\u0638\u0627\u0626\u0641" } },
    { href: "/contact", label: { en: "Contact", ar: "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627" } },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer
      dir={dir}
      className="bg-[#fbf9fa] border-t border-[#f1eaec]"
    >
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="bg-gradient-to-r from-[#c8567e]/10 to-[#c8567e]/5 rounded-2xl p-8 sm:p-12 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-3">
              {t({
                en: "Stay Beautiful, Stay Updated",
                ar: "\u0627\u0628\u0642\u064e\u064a \u062c\u0645\u064a\u0644\u0629\u060c \u0627\u0628\u0642\u064e\u064a \u0639\u0644\u0649 \u0627\u0637\u0644\u0627\u0639",
              })}
            </h3>
            <p className="text-[#8c7284] mb-6">
              {t({
                en: "Subscribe to our newsletter for exclusive offers, beauty tips, and the latest treatments.",
                ar: "\u0627\u0634\u062a\u0631\u0643\u064a \u0641\u064a \u0646\u0634\u0631\u062a\u0646\u0627 \u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0639\u0631\u0648\u0636 \u062d\u0635\u0631\u064a\u0629 \u0648\u0646\u0635\u0627\u0626\u062d \u062c\u0645\u0627\u0644\u064a\u0629 \u0648\u0623\u062d\u062f\u062b \u0627\u0644\u0639\u0644\u0627\u062c\u0627\u062a.",
              })}
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t({
                  en: "Enter your email address",
                  ar: "\u0623\u062f\u062e\u0644\u064a \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
                })}
                required
                className="flex-1 px-5 py-3 rounded-full border border-[#f1eaec] bg-white text-[#333333] placeholder-[#8c7284]/60 focus:outline-none focus:border-[#c8567e] focus:ring-2 focus:ring-[#c8567e]/20 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-[#c8567e] text-white font-semibold hover:bg-[#b34a6e] active:bg-[#a04162] transition-colors cursor-pointer shrink-0"
              >
                {t({ en: "Subscribe", ar: "\u0627\u0634\u062a\u0631\u0627\u0643" })}
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              {/* Spa Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8567e] to-[#e091ab] flex items-center justify-center shadow-sm">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.78 0 3.44-.47 4.89-1.28-.43-.95-.89-2.06-.89-2.06C14.6 20.17 13.36 21 12 21c-1.1 0-2.12-.31-3-0.83 0 0 .92-2.36 2.25-4.52C12.96 13.24 15 11 15 8c0-2.21-.89-4.21-2.33-5.67C12.44 2.12 12.22 2 12 2zm0 2c1.61 0 3.09.59 4.23 1.57C15 7.5 14 10 12 12.5 10 10 9 7.5 7.77 5.57A7.96 7.96 0 0112 4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#333333] group-hover:text-[#c8567e] transition-colors">
                Faya.iq
              </span>
            </Link>

            {/* Description */}
            <p className="text-[#8c7284] text-sm leading-relaxed mb-6">
              {t({
                en: "Your premier destination for advanced beauty treatments and skincare in Iraq. We combine cutting-edge technology with personalized care.",
                ar: "\u0648\u062c\u0647\u062a\u0643 \u0627\u0644\u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0639\u0644\u0627\u062c\u0627\u062a \u0627\u0644\u062a\u062c\u0645\u064a\u0644 \u0627\u0644\u0645\u062a\u0642\u062f\u0645\u0629 \u0648\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629 \u0641\u064a \u0627\u0644\u0639\u0631\u0627\u0642. \u0646\u062c\u0645\u0639 \u0628\u064a\u0646 \u0623\u062d\u062f\u062b \u0627\u0644\u062a\u0642\u0646\u064a\u0627\u062a \u0648\u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0634\u062e\u0635\u064a\u0629.",
              })}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#f1eaec] bg-white flex items-center justify-center text-[#8c7284] hover:bg-[#c8567e] hover:border-[#c8567e] hover:text-white transition-all duration-200"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#f1eaec] bg-white flex items-center justify-center text-[#8c7284] hover:bg-[#c8567e] hover:border-[#c8567e] hover:text-white transition-all duration-200"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full border border-[#f1eaec] bg-white flex items-center justify-center text-[#8c7284] hover:bg-[#c8567e] hover:border-[#c8567e] hover:text-white transition-all duration-200"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/9647700000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-[#f1eaec] bg-white flex items-center justify-center text-[#8c7284] hover:bg-[#c8567e] hover:border-[#c8567e] hover:text-white transition-all duration-200"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Treatments */}
          <div>
            <h4 className="text-[#333333] font-semibold text-base mb-5">
              {t({ en: "Treatments", ar: "\u0627\u0644\u0639\u0644\u0627\u062c\u0627\u062a" })}
            </h4>
            <ul className="space-y-3">
              {treatmentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8c7284] text-sm hover:text-[#c8567e] transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-[#333333] font-semibold text-base mb-5">
              {t({ en: "Company", ar: "\u0627\u0644\u0634\u0631\u0643\u0629" })}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8c7284] text-sm hover:text-[#c8567e] transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[#333333] font-semibold text-base mb-5">
              {t({ en: "Contact", ar: "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627" })}
            </h4>
            <ul className="space-y-4">
              {/* Phone */}
              <li>
                <a
                  href="tel:+9647700000000"
                  className="flex items-start gap-3 group"
                >
                  <svg
                    className="w-5 h-5 text-[#c8567e] mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span
                    className="text-[#8c7284] text-sm group-hover:text-[#c8567e] transition-colors"
                    dir="ltr"
                  >
                    +964 770 000 0000
                  </span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:info@faya.iq"
                  className="flex items-start gap-3 group"
                >
                  <svg
                    className="w-5 h-5 text-[#c8567e] mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span className="text-[#8c7284] text-sm group-hover:text-[#c8567e] transition-colors">
                    info@faya.iq
                  </span>
                </a>
              </li>

              {/* Hours */}
              <li>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[#c8567e] mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                  </svg>
                  <div className="text-sm">
                    <p className="text-[#333333] font-medium">
                      {t({ en: "Daily", ar: "\u064a\u0648\u0645\u064a\u0627\u064b" })}
                    </p>
                    <p className="text-[#8c7284]" dir="ltr">
                      10:00 AM - 9:00 PM
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#f1eaec]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8c7284] text-sm">
            {t({
              en: "\u00a9 2024 Faya.iq. All rights reserved.",
              ar: "\u00a9 2024 Faya.iq. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.",
            })}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[#8c7284] text-sm hover:text-[#c8567e] transition-colors"
            >
              {t({ en: "Privacy Policy", ar: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629" })}
            </Link>
            <Link
              href="/terms"
              className="text-[#8c7284] text-sm hover:text-[#c8567e] transition-colors"
            >
              {t({ en: "Terms of Service", ar: "\u0634\u0631\u0648\u0637 \u0627\u0644\u062e\u062f\u0645\u0629" })}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
