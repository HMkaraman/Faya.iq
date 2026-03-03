"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import type { CaseStudy } from "@/types";

export default function CaseStudyDetailPage() {
  const { lang, dir, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((data: CaseStudy[]) => {
        const found = data.find((cs) => cs.slug === slug);
        setCaseStudy(found || null);
      })
      .catch((err) => console.error("Failed to fetch case study:", err))
      .finally(() => setLoading(false));
  }, [slug]);

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

  if (!caseStudy) {
    return (
      <main dir={dir} className="flex min-h-screen items-center justify-center bg-[#fbf9fa]">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-gray-300">clinical_notes</span>
          <h1 className="mt-4 font-[Playfair_Display] text-3xl font-bold text-[#333333]">
            {t({ en: "Case Study Not Found", ar: "الحالة الدراسية غير موجودة" })}
          </h1>
          <p className="mt-3 text-[#8c7284]">
            {t({ en: "The case study you are looking for does not exist.", ar: "الحالة الدراسية التي تبحث عنها غير موجودة." })}
          </p>
          <Link href="/case-studies" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {t({ en: "Back to Case Studies", ar: "العودة إلى الحالات الدراسية" })}
          </Link>
        </div>
      </main>
    );
  }

  const sortedStages = [...(caseStudy.stages || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "ar" ? "ar-IQ" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main dir={dir} className="min-h-screen bg-[#fbf9fa]">
      {/* Breadcrumb */}
      <nav className="border-b border-primary/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[#8c7284]">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">{t({ en: "Home", ar: "الرئيسية" })}</Link>
            </li>
            <li><svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
            <li>
              <Link href="/case-studies" className="transition-colors hover:text-primary">{t({ en: "Case Studies", ar: "حالات دراسية" })}</Link>
            </li>
            <li><svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
            <li className="font-medium text-[#333333]">{t(caseStudy.title)}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-white to-[#fdf2f8]">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary capitalize">
              {caseStudy.categorySlug?.replace(/-/g, " ")}
            </span>
            <h1 className="font-[Playfair_Display] text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl lg:text-5xl">
              {t(caseStudy.title)}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#8c7284] sm:text-lg">
              {t(caseStudy.summary)}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#8c7284]">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                {t(caseStudy.doctor)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">timeline</span>
                {sortedStages.length} {t({ en: "stages", ar: "مراحل" })}
              </span>
            </div>
            {caseStudy.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {caseStudy.tags.map((tag, i) => (
                  <span key={i} className="rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary">
                    {t(tag)}
                  </span>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "Treatment Timeline", ar: "الجدول الزمني للعلاج" })}
              </span>
              <h2 className="font-[Playfair_Display] text-3xl font-bold text-[#333333] sm:text-4xl">
                {t({ en: "The Journey", ar: "الرحلة" })}
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-primary/20 md:block" />
            {/* Vertical line (mobile) */}
            <div className="absolute start-6 top-0 block h-full w-0.5 bg-primary/20 md:hidden" />

            <div className="space-y-12 md:space-y-16">
              {sortedStages.map((stage, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <ScrollReveal key={stage.id} delay={idx * 150}>
                    <div className="relative flex items-start gap-6 md:items-center">
                      {/* Mobile layout */}
                      <div className="flex shrink-0 md:hidden">
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary text-sm font-bold text-white shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 md:hidden">
                        <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                          <span className="text-xs font-bold tracking-widest text-primary">
                            {formatDate(stage.date)}
                          </span>
                          <h3 className="mt-1 font-[Playfair_Display] text-lg font-bold text-[#333333]">
                            {t(stage.title)}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#8c7284]">
                            {t(stage.description)}
                          </p>
                          {stage.images.length > 0 && (
                            <div className="mt-4">
                              {stage.images.length === 1 ? (
                                <img src={stage.images[0]} alt={t(stage.title)} className="w-full rounded-lg object-cover aspect-[4/3]" />
                              ) : (
                                <Swiper
                                  modules={[Navigation, Pagination]}
                                  navigation
                                  pagination={{ clickable: true }}
                                  spaceBetween={12}
                                  slidesPerView={1}
                                  className="rounded-lg overflow-hidden"
                                >
                                  {stage.images.map((img, imgIdx) => (
                                    <SwiperSlide key={imgIdx}>
                                      <img src={img} alt={`${t(stage.title)} ${imgIdx + 1}`} className="w-full rounded-lg object-cover aspect-[4/3]" />
                                    </SwiperSlide>
                                  ))}
                                </Swiper>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className={`hidden w-5/12 md:block ${isLeft ? "" : "order-3"}`}>
                        {isLeft && (
                          <div className="rounded-2xl border border-primary/10 bg-white p-6 text-end shadow-sm transition-all duration-300 hover:shadow-lg">
                            <span className="text-xs font-bold tracking-widest text-primary">
                              {formatDate(stage.date)}
                            </span>
                            <h3 className="mt-1 font-[Playfair_Display] text-xl font-bold text-[#333333]">
                              {t(stage.title)}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#8c7284]">
                              {t(stage.description)}
                            </p>
                            {stage.images.length > 0 && (
                              <div className="mt-4">
                                {stage.images.length === 1 ? (
                                  <img src={stage.images[0]} alt={t(stage.title)} className="w-full rounded-lg object-cover aspect-[4/3]" />
                                ) : (
                                  <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={12}
                                    slidesPerView={1}
                                    className="rounded-lg overflow-hidden"
                                  >
                                    {stage.images.map((img, imgIdx) => (
                                      <SwiperSlide key={imgIdx}>
                                        <img src={img} alt={`${t(stage.title)} ${imgIdx + 1}`} className="w-full rounded-lg object-cover aspect-[4/3]" />
                                      </SwiperSlide>
                                    ))}
                                  </Swiper>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Center dot (desktop) */}
                      <div className="relative z-10 hidden shrink-0 md:flex">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-primary text-sm font-bold text-white shadow-lg">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Right content (desktop) */}
                      <div className={`hidden w-5/12 md:block ${isLeft ? "order-3" : ""}`}>
                        {!isLeft && (
                          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                            <span className="text-xs font-bold tracking-widest text-primary">
                              {formatDate(stage.date)}
                            </span>
                            <h3 className="mt-1 font-[Playfair_Display] text-xl font-bold text-[#333333]">
                              {t(stage.title)}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#8c7284]">
                              {t(stage.description)}
                            </p>
                            {stage.images.length > 0 && (
                              <div className="mt-4">
                                {stage.images.length === 1 ? (
                                  <img src={stage.images[0]} alt={t(stage.title)} className="w-full rounded-lg object-cover aspect-[4/3]" />
                                ) : (
                                  <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={12}
                                    slidesPerView={1}
                                    className="rounded-lg overflow-hidden"
                                  >
                                    {stage.images.map((img, imgIdx) => (
                                      <SwiperSlide key={imgIdx}>
                                        <img src={img} alt={`${t(stage.title)} ${imgIdx + 1}`} className="w-full rounded-lg object-cover aspect-[4/3]" />
                                      </SwiperSlide>
                                    ))}
                                  </Swiper>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-primary/10 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-[Playfair_Display] text-2xl font-bold text-[#333333] sm:text-3xl">
              {t({ en: "Interested in a Similar Treatment?", ar: "مهتم بعلاج مشابه؟" })}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#8c7284]">
              {t({ en: "Book a consultation with our team to discuss your goals.", ar: "احجز استشارة مع فريقنا لمناقشة أهدافك." })}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
              >
                {t({ en: "Book a Consultation", ar: "احجز استشارة" })}
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white"
              >
                {t({ en: "View More Case Studies", ar: "عرض المزيد من الحالات" })}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
