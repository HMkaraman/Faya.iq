"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { lang, dir, t } = useLanguage();
  const isRTL = dir === "rtl";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* 404 number */}
      <div className="relative">
        <span className="text-[10rem] font-bold leading-none text-primary/10 sm:text-[14rem]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      <h1 className="mt-4 font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
        {t({ en: "Page Not Found", ar: "الصفحة غير موجودة" })}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-[#8c7284]">
        {t({
          en: "Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.",
          ar: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نساعدك في العودة.",
        })}
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg
            className={`h-4 w-4 ${isRTL ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          {t({ en: "Back to Home", ar: "العودة للرئيسية" })}
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 px-7 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5"
        >
          {t({ en: "Browse Services", ar: "تصفح الخدمات" })}
        </Link>
      </div>

      {/* Help text */}
      <p className="mt-10 text-xs text-[#8c7284]">
        {t({
          en: "Need help? Contact us via",
          ar: "تحتاج مساعدة؟ تواصل معنا عبر",
        })}{" "}
        <Link href="/contact" className="font-medium text-primary hover:underline">
          {t({ en: "WhatsApp or phone", ar: "واتساب أو الهاتف" })}
        </Link>
      </p>
    </div>
  );
}
