"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

/* ------------------------------------------------------------------ */
/*  Icon helper – renders a Material Symbols Outlined icon             */
/* ------------------------------------------------------------------ */
function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Star rating helper                                                 */
/* ------------------------------------------------------------------ */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_: unknown, i: number) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  HOMEPAGE                                                           */
/* ================================================================== */
export default function HomePage() {
  const { lang, dir, t } = useLanguage();
  const [selectedBranch, setSelectedBranch] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);

  /* ── API data state ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testimonials, setTestimonials] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, branchRes, testRes, blogRes] = await Promise.all([
          fetch("/api/service-categories"),
          fetch("/api/branches"),
          fetch("/api/testimonials"),
          fetch("/api/blog"),
        ]);
        const [catData, branchData, testData, blogData] = await Promise.all([
          catRes.json(),
          branchRes.json(),
          testRes.json(),
          blogRes.json(),
        ]);
        setServiceCategories(catData);
        setBranches(branchData);
        setTestimonials(testData);
        setBlogPosts(blogData);
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* Featured categories for the grid (pick 3) */
  const featuredCategories = serviceCategories.filter((c) =>
    ["skin-care", "hair-care", "injectables"].includes(c.slug)
  );

  const featuredCategoryMeta: Record<string, { icon: string; label: { en: string; ar: string } }> = {
    "skin-care": { icon: "face_retouching_natural", label: { en: "Skin Care", ar: "العناية بالبشرة" } },
    "hair-care": { icon: "content_cut", label: { en: "Hair Solutions", ar: "حلول الشعر" } },
    injectables: { icon: "vaccines", label: { en: "Injectables", ar: "الحقن التجميلية" } },
  };

  /* Helpers --------------------------------------------------------- */
  const isOpenNow = () => true; // simplified for display
  const scrollTestimonials = (direction: "left" | "right") => {
    if (!testimonialRef.current) return;
    const amount = direction === "left" ? -360 : 360;
    testimonialRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const firstThreePosts = blogPosts.slice(0, 3);

  /* Before/After placeholder images */
  const beforeAfterImages = [
    {
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
      label: { en: "Skin Rejuvenation", ar: "تجديد البشرة" },
    },
    {
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
      label: { en: "Facial Contouring", ar: "نحت الوجه" },
    },
  ];

  /* Trust partner names */
  const trustPartners = ["Allergan", "Hydrafacial", "Galderma", "FDA Approved", "Ministry of Health"];

  /* ================================================================ */
  if (loading) {
    return (
      <main dir={dir} className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c8567e]/20 border-t-[#c8567e]" />
          <p className="text-sm text-[#8c7284]">{t({ en: "Loading...", ar: "جارٍ التحميل..." })}</p>
        </div>
      </main>
    );
  }

  return (
    <main dir={dir} className="overflow-hidden">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                               */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Hero", ar: "القسم الرئيسي" })}
        className="relative bg-gradient-to-b from-[#fff0f3] via-[#fff8f5] to-white pb-28 pt-32 md:pt-40 md:pb-36"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#c8567e]/5 blur-3xl" />
          <div className="absolute top-1/2 -left-48 h-80 w-80 rounded-full bg-[#f4c2c2]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <ScrollReveal>
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#c8567e]/20 bg-white/70 px-5 py-2 text-sm font-medium text-[#c8567e] shadow-sm backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#c8567e] animate-pulse" />
              {t({ en: "The Premier Aesthetic Destination", ar: "الوجهة التجميلية الأولى" })}
            </div>
          </ScrollReveal>

          {/* Main heading */}
          <ScrollReveal delay={100}>
            <h1 className="mx-auto max-w-4xl font-[Playfair_Display] text-4xl font-bold leading-tight tracking-tight text-[#333333] sm:text-5xl md:text-6xl lg:text-7xl">
              {t({ en: "Your Journey to", ar: "رحلتك نحو" })}{" "}
              <br className="hidden sm:block" />
              <span className="italic text-[#c8567e]">
                {t({ en: "Timeless Beauty", ar: "الجمال الخالد" })}
              </span>
            </h1>
          </ScrollReveal>

          {/* Arabic subtitle */}
          <ScrollReveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#8c7284] md:text-xl" dir="rtl">
              {lang === "en"
                ? "رحلتك نحو الجمال الخالد"
                : t({
                    en: "Where science meets artistry to reveal your most radiant self.",
                    ar: "حيث يلتقي العلم بالفن ليكشف عن أجمل ما فيك.",
                  })}
            </p>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={250}>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#8c7284]/80">
              {t({
                en: "Iraq's most trusted beauty & aesthetics clinics — advanced treatments, world-class specialists, three premium locations.",
                ar: "أكثر عيادات التجميل موثوقية في العراق — علاجات متقدمة، متخصصون عالميون، ثلاثة فروع فاخرة.",
              })}
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[#c8567e] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#c8567e]/25 transition-all duration-300 hover:bg-[#a03d5e] hover:shadow-xl hover:shadow-[#c8567e]/30 hover:-translate-y-0.5"
              >
                {t({ en: "Book a Consultation", ar: "احجز استشارة" })}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#c8567e]/30 bg-white/60 px-8 py-4 text-base font-semibold text-[#c8567e] backdrop-blur-sm transition-all duration-300 hover:border-[#c8567e] hover:bg-white hover:-translate-y-0.5"
              >
                {t({ en: "Explore Services", ar: "اكتشف خدماتنا" })}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. BRANCH SELECTOR (Floating card overlapping hero)           */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Select your branch", ar: "اختر فرعك" })}
        className="relative z-30 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal>
          <div className="rounded-2xl bg-white p-6 shadow-elevated md:p-8">
            <div className="mb-6 text-center">
              <h2 className="font-[Playfair_Display] text-xl font-bold text-[#333333] md:text-2xl">
                {t({ en: "Select Your Nearest Clinic", ar: "اختر أقرب عيادة إليك" })}
              </h2>
              <p className="mt-1 text-sm text-[#8c7284]">
                {t({ en: "Three premium locations across Iraq", ar: "ثلاثة فروع فاخرة في جميع أنحاء العراق" })}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {branches.map((branch, idx) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(idx)}
                  className={`group relative rounded-xl border-2 p-5 text-start transition-all duration-300 ${
                    selectedBranch === idx
                      ? "border-[#c8567e] bg-[#fff0f3]/50 shadow-md"
                      : "border-gray-100 bg-white hover:border-[#c8567e]/30 hover:shadow-sm"
                  }`}
                >
                  {/* Selected indicator */}
                  {selectedBranch === idx && (
                    <span className="absolute top-3 end-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#c8567e] text-white">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}

                  <h3 className="text-base font-semibold text-[#333333]">{t(branch.name)}</h3>
                  <p className="mt-1 text-sm text-[#8c7284] leading-relaxed">{t(branch.address)}</p>

                  {/* Hours status */}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        isOpenNow() ? "bg-emerald-400" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-xs font-medium text-emerald-600">
                      {isOpenNow()
                        ? t({ en: "Open Now", ar: "مفتوح الآن" })
                        : t({ en: "Closed", ar: "مغلق" })}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8c7284]">
                    <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                    <span className="font-semibold text-[#333333]">{branch.rating}</span>
                    <span>({branch.reviewCount.toLocaleString()} {t({ en: "reviews", ar: "تقييم" })})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED SERVICES                                          */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Featured Services", ar: "الخدمات المميزة" })}
        className="bg-white py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#c8567e]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c8567e]">
                {t({ en: "Our Expertise", ar: "خبراتنا" })}
              </span>
              <h2 className="mt-4 font-[Playfair_Display] text-3xl font-bold text-[#333333] md:text-4xl lg:text-5xl">
                {t({ en: "Curated Treatments for Every Need", ar: "علاجات مختارة لكل حاجة" })}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-[#8c7284]">
                {t({
                  en: "From subtle enhancements to transformative procedures, our expert team delivers exceptional results with the utmost care.",
                  ar: "من التحسينات الدقيقة إلى الإجراءات التحويلية، يقدم فريقنا المتخصص نتائج استثنائية بأقصى درجات العناية.",
                })}
              </p>
            </div>
          </ScrollReveal>

          {/* Service cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredCategories.map((cat, idx) => {
              const meta = featuredCategoryMeta[cat.slug];
              return (
                <ScrollReveal key={cat.slug} delay={idx * 150}>
                  <Link
                    href={`/services?category=${cat.slug}`}
                    className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${cat.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative px-6 pb-6 pt-0">
                      {/* Floating icon */}
                      <div className="-mt-7 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#c8567e] text-white shadow-lg shadow-[#c8567e]/30">
                        <MIcon name={meta?.icon || cat.icon} className="text-2xl" />
                      </div>

                      <h3 className="text-lg font-bold text-[#333333] group-hover:text-[#c8567e] transition-colors duration-300">
                        {meta ? t(meta.label) : t(cat.name)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#8c7284] line-clamp-2">
                        {t(cat.description)}
                      </p>

                      {/* Explore link */}
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c8567e]">
                        {t({ en: "EXPLORE", ar: "استكشف" })}
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* View all link */}
          <ScrollReveal delay={500}>
            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8567e] transition-colors hover:text-[#a03d5e]"
              >
                {t({ en: "View All Services", ar: "عرض جميع الخدمات" })}
                <svg
                  className="h-4 w-4 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TRUST SIGNALS                                              */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Trusted Partners", ar: "الشركاء الموثوقون" })}
        className="border-y border-gray-100 bg-[#fbf9fa] py-10"
      >
        <ScrollReveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-[#8c7284]/60">
              {t({ en: "Trusted by leading brands & certified by", ar: "موثوق من قبل العلامات الرائدة ومعتمد من" })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {trustPartners.map((partner: any) => (
                <span
                  key={partner}
                  className="text-lg font-bold text-[#333333]/30 transition-all duration-300 hover:text-[#333333]/80 md:text-xl cursor-default select-none"
                  style={{ opacity: 0.5 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ============================================================ */}
      {/* 5. ANIMATED STATS                                             */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Statistics", ar: "الإحصائيات" })}
        className="bg-white py-20 md:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
              <AnimatedCounter
                end={15000}
                suffix="+"
                label={t({ en: "Happy Clients", ar: "عميل سعيد" })}
              />
              <AnimatedCounter
                end={50}
                suffix="+"
                label={t({ en: "Expert Specialists", ar: "متخصص خبير" })}
              />
              <AnimatedCounter
                end={3}
                label={t({ en: "Premium Branches", ar: "فروع فاخرة" })}
              />
              <AnimatedCounter
                end={15}
                suffix="+"
                label={t({ en: "Years of Excellence", ar: "سنوات من التميز" })}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BEFORE & AFTER TEASER                                      */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Before and After Results", ar: "نتائج قبل وبعد" })}
        className="bg-[#fbf9fa] py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#c8567e]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c8567e]">
                {t({ en: "Real Results", ar: "نتائج حقيقية" })}
              </span>
              <h2 className="mt-4 font-[Playfair_Display] text-3xl font-bold text-[#333333] md:text-4xl">
                {t({ en: "See the Transformation", ar: "شاهد التحول" })}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-[#8c7284]">
                {t({
                  en: "Discover the results our clients have achieved with our expert treatments.",
                  ar: "اكتشف النتائج التي حققها عملاؤنا مع علاجاتنا المتخصصة.",
                })}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {beforeAfterImages.map((item: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <Link
                  href="/gallery"
                  className="group relative block aspect-[16/10] overflow-hidden rounded-2xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                    <span className="text-lg font-bold text-white">{t(item.label)}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20">
                      {t({ en: "View Results", ar: "عرض النتائج" })}
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="mt-10 text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8567e] transition-colors hover:text-[#a03d5e]"
              >
                {t({ en: "Browse Full Gallery", ar: "تصفح المعرض الكامل" })}
                <svg
                  className="h-4 w-4 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TESTIMONIALS                                               */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Client Testimonials", ar: "آراء العملاء" })}
        className="bg-white py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#c8567e]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c8567e]">
                {t({ en: "Testimonials", ar: "الشهادات" })}
              </span>
              <h2 className="mt-4 font-[Playfair_Display] text-3xl font-bold text-[#333333] md:text-4xl">
                {t({ en: "What Our Clients Say", ar: "ماذا يقول عملاؤنا" })}
              </h2>
            </div>
          </ScrollReveal>

          {/* Carousel controls */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => scrollTestimonials("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#8c7284] transition-all hover:border-[#c8567e] hover:text-[#c8567e]"
              aria-label={t({ en: "Scroll left", ar: "التمرير لليسار" })}
            >
              <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollTestimonials("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#8c7284] transition-all hover:border-[#c8567e] hover:text-[#c8567e]"
              aria-label={t({ en: "Scroll right", ar: "التمرير لليمين" })}
            >
              <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Scrollable cards */}
          <ScrollReveal>
            <div
              ref={testimonialRef}
              className="mt-10 flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-px-4 pb-4"
            >
              {testimonials.map((test: any) => (
                <article
                  key={test.id}
                  className="min-w-[320px] max-w-[360px] shrink-0 snap-start rounded-xl bg-white p-6 shadow-card border border-gray-50 transition-shadow duration-300 hover:shadow-elevated"
                >
                  {/* Stars */}
                  <StarRating rating={test.rating} />

                  {/* Quote */}
                  <blockquote className="mt-4 text-sm leading-relaxed text-[#333333]/80">
                    &ldquo;{t(test.text)}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-3 border-t border-gray-50 pt-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#fbf9fa]">
                      <img
                        src={test.image}
                        alt={t(test.name)}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#333333]">{t(test.name)}</p>
                      <p className="text-xs text-[#8c7284]">{t(test.service)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. BLOG PREVIEW                                               */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Latest Blog Posts", ar: "أحدث المقالات" })}
        className="bg-[#fbf9fa] py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#c8567e]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c8567e]">
                {t({ en: "From Our Blog", ar: "من مدونتنا" })}
              </span>
              <h2 className="mt-4 font-[Playfair_Display] text-3xl font-bold text-[#333333] md:text-4xl">
                {t({ en: "Latest Insights", ar: "أحدث المقالات" })}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-[#8c7284]">
                {t({
                  en: "Expert advice, treatment guides, and beauty tips from our medical team.",
                  ar: "نصائح الخبراء وأدلة العلاج ونصائح الجمال من فريقنا الطبي.",
                })}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {firstThreePosts.map((post: any, idx: number) => (
              <ScrollReveal key={post.id} delay={idx * 150}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <article className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${post.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      {/* Category badge */}
                      <span className="absolute top-4 start-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#c8567e] backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-base font-bold leading-snug text-[#333333] group-hover:text-[#c8567e] transition-colors duration-300 line-clamp-2">
                        {t(post.title)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#8c7284] line-clamp-2">
                        {t(post.excerpt)}
                      </p>

                      {/* Author & read time */}
                      <div className="mt-4 flex items-center gap-3 border-t border-gray-50 pt-4">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#fbf9fa]">
                          <img
                            src={post.authorImage}
                            alt={post.author}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-semibold text-[#333333]">{post.author}</p>
                          <p className="text-xs text-[#8c7284]">{t(post.readTime)}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#c8567e]/30 px-7 py-3 text-sm font-semibold text-[#c8567e] transition-all duration-300 hover:border-[#c8567e] hover:bg-[#c8567e] hover:text-white"
              >
                {t({ en: "Read All Articles", ar: "اقرأ جميع المقالات" })}
                <svg
                  className="h-4 w-4 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. CTA SECTION                                                */}
      {/* ============================================================ */}
      <section
        aria-label={t({ en: "Call to Action", ar: "دعوة للعمل" })}
        className="relative overflow-hidden bg-[#c8567e] py-20 md:py-28"
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#a03d5e]/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-[Playfair_Display] text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {t({ en: "Ready to Start Your Journey?", ar: "مستعد لبدء رحلتك؟" })}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
              {t({
                en: "Book a free consultation with our specialists today. Discover your personalized path to confidence and beauty.",
                ar: "احجز استشارة مجانية مع متخصصينا اليوم. اكتشف مسارك الشخصي نحو الثقة والجمال.",
              })}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#c8567e] shadow-lg transition-all duration-300 hover:bg-[#fff0f3] hover:shadow-xl hover:-translate-y-0.5"
              >
                {t({ en: "Book Appointment", ar: "احجز موعداً" })}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/branches"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
              >
                {t({ en: "Find a Branch", ar: "ابحث عن فرع" })}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
