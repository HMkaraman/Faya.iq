"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import BeforeAfterCarousel from "@/components/BeforeAfterCarousel";

export default function ServiceDetailPage() {
  const { lang, dir, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  /* ── API data state ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [svcRes, catRes, branchRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/service-categories"),
          fetch("/api/branches"),
        ]);
        const [svcData, catData, branchData] = await Promise.all([
          svcRes.json(),
          catRes.json(),
          branchRes.json(),
        ]);
        setServices(svcData);
        setServiceCategories(catData);
        setBranches(branchData);
      } catch (err) {
        console.error("Failed to fetch service detail data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <main dir={dir} className="flex min-h-screen items-center justify-center bg-[#fbf9fa]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-[#8c7284]">{t({ en: "Loading...", ar: "جارٍ التحميل..." })}</p>
        </div>
      </main>
    );
  }

  const service = services.find((s: any) => s.slug === slug);

  if (!service) {
    return (
      <main dir={dir} className="flex min-h-screen items-center justify-center bg-[#fbf9fa]">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-[Playfair_Display] text-3xl font-bold text-[#333333]">
            {t({ en: "Service Not Found", ar: "الخدمة غير موجودة" })}
          </h1>
          <p className="mt-3 text-[#8c7284]">
            {t({
              en: "The service you are looking for does not exist or has been moved.",
              ar: "الخدمة التي تبحث عنها غير موجودة أو تم نقلها.",
            })}
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {t({ en: "Back to Services", ar: "العودة إلى الخدمات" })}
          </Link>
        </div>
      </main>
    );
  }

  const category = serviceCategories.find((c: any) => c.slug === service.categorySlug);
  const categoryName = category ? t(category.name) : service.category;

  const relatedServices = services
    .filter((s: any) => s.categorySlug === service.categorySlug && s.slug !== service.slug)
    .slice(0, 3);

  const availableBranches = branches.filter((b: any) => service.branches.includes(b.id));

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main dir={dir} className="min-h-screen bg-[#fbf9fa]">
      {/* ───────────── BREADCRUMB ───────────── */}
      <nav className="border-b border-primary/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[#8c7284]">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                {t({ en: "Home", ar: "الرئيسية" })}
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/services" className="transition-colors hover:text-primary">
                {t({ en: "Services", ar: "الخدمات" })}
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href={`/services?category=${service.categorySlug}`} className="transition-colors hover:text-primary">
                {categoryName}
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="font-medium text-[#333333]">{t(service.name)}</li>
          </ol>
        </div>
      </nav>

      {/* ───────────── HERO SECTION ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-white to-[#fdf2f8]">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <ScrollReveal>
              <div>
                {/* Category Badge */}
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {categoryName}
                </span>

                {/* Service Name */}
                <h1 className="font-[Playfair_Display] text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl lg:text-5xl">
                  {t(service.name)}
                </h1>

                {/* Description */}
                <p className="mt-5 text-base leading-relaxed text-[#8c7284] sm:text-lg">
                  {t(service.description)}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Duration & Price */}
                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                  {service.duration && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#8c7284]">{t({ en: "Duration", ar: "المدة" })}</p>
                        <p className="font-semibold text-[#333333]">{service.duration}</p>
                      </div>
                    </div>
                  )}
                  {service.priceRange && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 8v2m0-8c1.11 0 2.08.402 2.599 1M12 8c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#8c7284]">{t({ en: "Price Range", ar: "نطاق السعر" })}</p>
                        <p className="font-semibold text-primary-dark">{t(service.priceRange)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
                  >
                    {t({ en: "Book Your Treatment", ar: "احجز علاجك" })}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                  >
                    {t({ en: "Free Consultation", ar: "استشارة مجانية" })}
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column - Image */}
            <ScrollReveal delay={200}>
              <div className="relative">
                <img
                  src={service.image}
                  alt={t(service.name)}
                  className="w-full rounded-xl object-cover shadow-lg lg:h-[500px]"
                />
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -start-4 -z-10 h-full w-full rounded-xl bg-primary/10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      {service.steps[lang].length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center">
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t({ en: "Step by Step", ar: "خطوة بخطوة" })}
                </span>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                  {t({ en: "How It Works", ar: "كيف يعمل" })}
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-12 max-w-2xl">
              {service.steps[lang].map((step: string, index: number) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="relative flex gap-4 pb-8">
                    {/* Vertical Line */}
                    {index < service.steps[lang].length - 1 && (
                      <div className="absolute start-4 top-10 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 bg-primary/20 rtl:translate-x-1/2" />
                    )}

                    {/* Number Circle */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 rounded-lg border border-primary/10 bg-[#fbf9fa] px-5 py-4">
                      <p className="text-[#333333]">{step}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── BENEFITS ───────────── */}
      {service.benefits[lang].length > 0 && (
        <section className="bg-[#fbf9fa] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center">
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t({ en: "Why Choose This Treatment", ar: "لماذا تختار هذا العلاج" })}
                </span>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                  {t({ en: "Benefits", ar: "الفوائد" })}
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
              {service.benefits[lang].map((benefit: string, index: number) => (
                <ScrollReveal key={index} delay={index * 80}>
                  <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    {/* Checkmark Icon */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="pt-1 text-[#333333]">{benefit}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── EXPECTED RESULTS ───────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "What to Expect", ar: "ماذا تتوقع" })}
              </span>
              <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                {t({ en: "Expected Results", ar: "النتائج المتوقعة" })}
              </h2>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-10 max-w-4xl">
            {/* Before / After Gallery */}
            {service.beforeAfterPairs && service.beforeAfterPairs.length > 0 ? (
              <ScrollReveal>
                <BeforeAfterCarousel pairs={service.beforeAfterPairs} />
              </ScrollReveal>
            ) : (
              <ScrollReveal>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-[#fbf9fa]">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                      <p className="mt-3 text-sm font-semibold text-primary/50">
                        {t({ en: "Before", ar: "قبل" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-[#fbf9fa]">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                      <p className="mt-3 text-sm font-semibold text-primary/50">
                        {t({ en: "After", ar: "بعد" })}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Downtime Info Card */}
            <ScrollReveal delay={150}>
              <div className="mt-8 flex items-start gap-4 rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 to-transparent p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#333333]">
                    {t({ en: "Recovery & Downtime", ar: "التعافي وفترة الراحة" })}
                  </h3>
                  <p className="mt-1 text-[#8c7284]">{t(service.downtime)}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ───────────── BRANCH AVAILABILITY ───────────── */}
      {availableBranches.length > 0 && (
        <section className="bg-[#fbf9fa] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center">
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t({ en: "Visit Us", ar: "زورنا" })}
                </span>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                  {t({ en: "Available At", ar: "متوفر في" })}
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableBranches.map((branch: any, index: number) => (
                <ScrollReveal key={branch.id} delay={index * 100}>
                  <div className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-[#333333]">{t(branch.name)}</h3>
                        <p className="mt-1 text-sm text-[#8c7284]">{t(branch.address)}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                        {t({ en: "Available", ar: "متوفر" })}
                      </span>
                    </div>
                    <Link
                      href={`/booking?branch=${branch.slug}&service=${service.slug}`}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      {t({ en: "Book at This Branch", ar: "احجز في هذا الفرع" })}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── FAQ ACCORDION ───────────── */}
      {service.faq.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center">
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t({ en: "Got Questions?", ar: "لديك أسئلة؟" })}
                </span>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                  {t({ en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" })}
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-10 max-w-3xl">
              {service.faq.map((item: any, index: number) => (
                <ScrollReveal key={index} delay={index * 80}>
                  <div className="border-b border-slate-100">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-start"
                    >
                      <span className="text-base font-medium text-[#333333]">
                        {t(item.question)}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                          openFaqIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaqIndex === index ? "max-h-96 pb-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-[#8c7284]">
                        {t(item.answer)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── RELATED SERVICES ───────────── */}
      {relatedServices.length > 0 && (
        <section className="bg-[#fbf9fa] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center">
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t({ en: "Explore More", ar: "اكتشف المزيد" })}
                </span>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                  {t({ en: "You Might Also Like", ar: "قد يعجبك أيضاً" })}
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((related: any, index: number) => (
                <ScrollReveal key={related.id} delay={index * 100}>
                  <Link
                    href={`/services/${related.slug}`}
                    className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={related.image}
                        alt={t(related.name)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#333333] transition-colors group-hover:text-primary">
                        {t(related.name)}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-[#8c7284]">
                        {t(related.shortDescription)}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {t({ en: "Learn More", ar: "اعرف المزيد" })}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${lang === "ar" ? "rotate-180 group-hover:-translate-x-1" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── MEDICAL DISCLAIMER ───────────── */}
      <section className="border-t border-primary/10 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs leading-relaxed text-[#8c7284]">
            {t({
              en: "Results may vary. A consultation with our medical team is required before any treatment. The information provided on this page is for educational purposes only and does not constitute medical advice.",
              ar: "قد تختلف النتائج. يلزم استشارة فريقنا الطبي قبل أي علاج. المعلومات المقدمة في هذه الصفحة هي لأغراض تعليمية فقط ولا تشكل نصيحة طبية.",
            })}
          </p>
        </div>
      </section>

      {/* ───────────── STICKY BOTTOM BAR (MOBILE) ───────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/10 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            {service.priceRange && (
              <p className="text-sm font-bold text-primary-dark">{t(service.priceRange)}</p>
            )}
            {service.duration && (
              <p className="text-xs text-[#8c7284]">{service.duration}</p>
            )}
          </div>
          <Link
            href="/booking"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark"
          >
            {t({ en: "Book Now", ar: "احجز الآن" })}
          </Link>
        </div>
      </div>

      {/* Spacer for sticky bottom bar on mobile */}
      <div className="h-16 lg:hidden" />
    </main>
  );
}
