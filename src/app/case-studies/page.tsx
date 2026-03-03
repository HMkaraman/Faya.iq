"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import type { CaseStudy } from "@/types";

export default function CaseStudiesPage() {
  const { lang, dir, t } = useLanguage();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((data) => setCaseStudies(data.filter((cs: CaseStudy) => cs.active)))
      .catch((err) => console.error("Failed to fetch case studies:", err))
      .finally(() => setLoading(false));
  }, []);

  // Derive unique categories from case studies
  const categories = Array.from(new Set(caseStudies.map((cs) => cs.categorySlug).filter(Boolean)));

  const filtered = activeCategory === "all"
    ? caseStudies
    : caseStudies.filter((cs) => cs.categorySlug === activeCategory);

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

  return (
    <main dir={dir} className="min-h-screen bg-[#fbf9fa]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-white to-[#fdf2f8]">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {t({ en: "Patient Journeys", ar: "رحلات المرضى" })}
            </span>
            <h1 className="font-[Playfair_Display] text-4xl font-bold tracking-tight text-[#333333] sm:text-5xl">
              {t({ en: "Case Studies", ar: "حالات دراسية" })}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8c7284]">
              {t({
                en: "Explore real patient treatment journeys — from initial assessment to final results.",
                ar: "استكشف رحلات علاج حقيقية للمرضى — من التقييم الأولي إلى النتائج النهائية.",
              })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Category filter tabs */}
      {categories.length > 1 && (
        <section className="border-b border-primary/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto hide-scrollbar py-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-primary text-white"
                    : "bg-[#fbf9fa] text-[#8c7284] hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {t({ en: "All", ar: "الكل" })}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors capitalize ${
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "bg-[#fbf9fa] text-[#8c7284] hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cat.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Study Cards Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-[48px] text-gray-300">clinical_notes</span>
              <p className="mt-3 text-gray-500">{t({ en: "No case studies found.", ar: "لا توجد حالات دراسية." })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cs, idx) => {
                const thumbnail = cs.stages?.[0]?.images?.[0];
                return (
                  <ScrollReveal key={cs.id} delay={idx * 100}>
                    <Link
                      href={`/case-studies/${cs.slug}`}
                      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={t(cs.title)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="material-symbols-outlined text-[48px] text-gray-300">clinical_notes</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        {/* Stages badge */}
                        <span className="absolute top-4 start-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                          {cs.stages?.length || 0} {t({ en: "stages", ar: "مراحل" })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-base font-bold leading-snug text-[#333333] group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {t(cs.title)}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#8c7284]">
                          {t(cs.summary)}
                        </p>

                        <div className="mt-4 flex items-center gap-3 border-t border-gray-50 pt-4">
                          <div className="flex items-center gap-1.5 text-xs text-[#8c7284]">
                            <span className="material-symbols-outlined text-[16px]">person</span>
                            {t(cs.doctor)}
                          </div>
                        </div>

                        {/* Tags */}
                        {cs.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {cs.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="rounded-full bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                {t(tag)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
