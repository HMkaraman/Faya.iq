"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";

const ALL_TAGS = ["Filler", "Botox", "Skin Boosters", "Dermatology", "Chemical Peel"];

const tagLabels: Record<string, { en: string; ar: string }> = {
  Filler: { en: "Filler", ar: "فلر" },
  Botox: { en: "Botox", ar: "بوتوكس" },
  "Skin Boosters": { en: "Skin Boosters", ar: "ابر النضارة" },
  Dermatology: { en: "Dermatology", ar: "جلدية" },
  "Chemical Peel": { en: "Chemical Peel", ar: "تقشير" },
};

export default function ServicesPage() {
  return (
    <Suspense>
      <ServicesContent />
    </Suspense>
  );
}

function ServicesContent() {
  const { lang, dir, t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

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
        console.error("Failed to fetch services data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t: string) => t !== tag) : [...prev, tag]
    );
  };

  const filteredServices = useMemo(() => {
    return services.filter((service: any) => {
      // Category filter
      if (activeCategory !== "all" && service.categorySlug !== activeCategory) {
        return false;
      }

      // Tag filter — service must include ALL active tags
      if (activeTags.length > 0 && !activeTags.every((tag: string) => service.tags.includes(tag))) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName =
          service.name.en.toLowerCase().includes(q) ||
          service.name.ar.includes(q);
        const matchDesc =
          service.shortDescription.en.toLowerCase().includes(q) ||
          service.shortDescription.ar.includes(q);
        const matchCategory = service.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCategory) return false;
      }

      return true;
    });
  }, [services, search, activeCategory, activeTags]);

  const getBranch = (branchId: string) =>
    branches.find((b: any) => b.id === branchId);

  if (loading) {
    return (
      <main dir={dir} className="flex min-h-screen items-center justify-center bg-bg-light">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-text-muted">{t({ en: "Loading...", ar: "جارٍ التحميل..." })}</p>
        </div>
      </main>
    );
  }

  return (
    <main dir={dir} className="min-h-screen bg-bg-light">
      {/* ───────────── HERO BANNER ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-white to-[#fdf2f8]">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <ScrollReveal>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {t({ en: "Explore Our Expertise", ar: "استكشف خبراتنا" })}
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              {t({ en: "Our Services", ar: "خدماتنا" })}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
              {t({
                en: "Comprehensive Beauty & Aesthetic Treatments tailored to reveal your natural radiance.",
                ar: "علاجات تجميلية شاملة مصممة لإظهار إشراقتك الطبيعية.",
              })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ───────────── FILTERS AREA ───────────── */}
      <section className="sticky top-0 z-30 border-b border-primary/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mx-auto mb-4 max-w-xl">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-text-muted">
              {/* Search icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t({
                en: "Search services...",
                ar: "ابحث عن الخدمات...",
              })}
              className="w-full rounded-full border border-primary/20 bg-white py-3 pe-4 ps-12 text-sm text-text-primary shadow-soft outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 end-0 flex items-center pe-4 text-text-muted hover:text-primary"
                aria-label={t({ en: "Clear search", ar: "مسح البحث" })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Pills — horizontal scroll on mobile */}
          <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-white shadow-glow"
                  : "bg-bg-light text-text-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {t({ en: "All", ar: "الكل" })}
            </button>
            {serviceCategories.map((cat: any) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-primary text-white shadow-glow"
                    : "bg-bg-light text-text-muted hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {t(cat.name)}
              </button>
            ))}
          </div>

          {/* Tag Filter Pills */}
          <div className="hide-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  activeTags.includes(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/15 bg-white text-text-muted hover:border-primary/30 hover:text-primary"
                }`}
              >
                {t(tagLabels[tag])}
              </button>
            ))}
          </div>

          {/* View Toggle + Results count */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {filteredServices.length}{" "}
              {t({
                en: filteredServices.length === 1 ? "service found" : "services found",
                ar: "خدمة",
              })}
            </p>
            <div className="flex gap-1 rounded-lg border border-primary/15 p-0.5">
              {/* Grid view button */}
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-primary"
                }`}
                aria-label={t({ en: "Grid view", ar: "عرض شبكي" })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
              {/* List view button */}
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-primary"
                }`}
                aria-label={t({ en: "List view", ar: "عرض قائمة" })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── SERVICE CARDS ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filteredServices.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-text-primary">
              {t({ en: "No services found", ar: "لم يتم العثور على خدمات" })}
            </h3>
            <p className="mt-2 text-text-muted">
              {t({
                en: "Try adjusting your search or filters.",
                ar: "حاول تعديل البحث أو الفلاتر.",
              })}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setActiveTags([]);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {t({ en: "Clear Filters", ar: "مسح الفلاتر" })}
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* ── Grid View ── */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service: any, idx: number) => (
              <ScrollReveal key={service.id} delay={idx * 80}>
                <article className="group overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={service.image}
                      alt={t(service.name)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Category badge */}
                    <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
                      {t(
                        serviceCategories.find((c: any) => c.slug === service.categorySlug)?.name ?? {
                          en: service.category,
                          ar: service.category,
                        }
                      )}
                    </span>
                    {/* Tags overlay bottom */}
                    {service.tags.length > 0 && (
                      <div className="absolute bottom-3 start-3 flex flex-wrap gap-1.5">
                        {service.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
                          >
                            {t(tagLabels[tag] ?? { en: tag, ar: tag })}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-text-primary transition-colors group-hover:text-primary">
                      {t(service.name)}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
                      {t(service.shortDescription)}
                    </p>

                    {/* Duration & Price */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      {service.duration && (
                        <span className="inline-flex items-center gap-1 text-text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                          </svg>
                          {service.duration}
                        </span>
                      )}
                      {service.priceRange && (
                        <span className="inline-flex items-center gap-1 font-medium text-primary-dark">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 8v2m0-8c1.11 0 2.08.402 2.599 1M12 8c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t(service.priceRange)}
                        </span>
                      )}
                    </div>

                    {/* Branch availability dots */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {t({ en: "Available at:", ar: "متوفر في:" })}
                      </span>
                      <div className="flex gap-1.5">
                        {service.branches.map((branchId: string) => {
                          const branch = getBranch(branchId);
                          return branch ? (
                            <span
                              key={branchId}
                              title={t(branch.city)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary"
                            >
                              {branch.city.en.charAt(0)}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Learn More link */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      {t({ en: "Learn More", ar: "اعرف المزيد" })}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${lang === "ar" ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          /* ── List View ── */
          <div className="flex flex-col gap-4">
            {filteredServices.map((service: any, idx: number) => (
              <ScrollReveal key={service.id} delay={idx * 60}>
                <article className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-card transition-all duration-300 hover:shadow-elevated sm:flex-row">
                  {/* Image */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-60 lg:w-72">
                    <img
                      src={service.image}
                      alt={t(service.name)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
                      {t(
                        serviceCategories.find((c: any) => c.slug === service.categorySlug)?.name ?? {
                          en: service.category,
                          ar: service.category,
                        }
                      )}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-primary">
                          {t(service.name)}
                        </h3>
                        {service.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
                          >
                            {t(tagLabels[tag] ?? { en: tag, ar: tag })}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {t(service.shortDescription)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {service.duration && (
                          <span className="inline-flex items-center gap-1 text-text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                            </svg>
                            {service.duration}
                          </span>
                        )}
                        {service.priceRange && (
                          <span className="inline-flex items-center gap-1 font-medium text-primary-dark">
                            {t(service.priceRange)}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          {service.branches.map((branchId: string) => {
                            const branch = getBranch(branchId);
                            return branch ? (
                              <span
                                key={branchId}
                                title={t(branch.city)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary"
                              >
                                {branch.city.en.charAt(0)}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                      >
                        {t({ en: "Learn More", ar: "اعرف المزيد" })}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
