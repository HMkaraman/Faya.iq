"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */
const categories = [
  { id: "all", label: { en: "All", ar: "الكل" } },
  { id: "skin-care", label: { en: "Skin Care", ar: "العناية بالبشرة" } },
  { id: "hair-transplant", label: { en: "Hair Transplant", ar: "زراعة الشعر" } },
  { id: "injectables", label: { en: "Injectables", ar: "الحقن" } },
  { id: "laser", label: { en: "Laser", ar: "الليزر" } },
  { id: "body-contouring", label: { en: "Body Contouring", ar: "نحت الجسم" } },
];

/* ------------------------------------------------------------------ */
/*  Gallery items                                                      */
/* ------------------------------------------------------------------ */
interface GalleryItem {
  id: string;
  title: { en: string; ar: string };
  category: string;
  type: "before-after" | "showcase";
  beforeImage: string;
  afterImage: string;
  doctor: { en: string; ar: string };
  sessions: number;
  tags: { en: string; ar: string }[];
}

const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: { en: "HydraFacial Transformation", ar: "تحول الهيدرافيشل" },
    category: "skin-care",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    doctor: { en: "Dr. Sarah Ahmed", ar: "د. سارة أحمد" },
    sessions: 4,
    tags: [
      { en: "Skin Rejuvenation", ar: "تجديد البشرة" },
      { en: "No Downtime", ar: "بدون فترة تعافي" },
    ],
  },
  {
    id: "g2",
    title: { en: "FUE Hair Transplant - 3000 Grafts", ar: "زراعة الشعر FUE - ٣٠٠٠ بصيلة" },
    category: "hair-transplant",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1585747860019-8e7e4d6e2a2f?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    doctor: { en: "Dr. Youssef Ali", ar: "د. يوسف علي" },
    sessions: 1,
    tags: [
      { en: "Hair Restoration", ar: "استعادة الشعر" },
      { en: "Permanent", ar: "دائم" },
    ],
  },
  {
    id: "g3",
    title: { en: "Lip Filler Enhancement", ar: "تعزيز فيلر الشفاه" },
    category: "injectables",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80",
    doctor: { en: "Dr. Layla Hassan", ar: "د. ليلى حسن" },
    sessions: 2,
    tags: [
      { en: "Fillers", ar: "فيلر" },
      { en: "Natural Look", ar: "مظهر طبيعي" },
    ],
  },
  {
    id: "g4",
    title: { en: "Full Body Laser Results", ar: "نتائج ليزر الجسم الكامل" },
    category: "laser",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1598524374912-6b0b0bab43a5?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    doctor: { en: "Dr. Sarah Ahmed", ar: "د. سارة أحمد" },
    sessions: 6,
    tags: [
      { en: "Hair Removal", ar: "إزالة الشعر" },
      { en: "FDA Approved", ar: "معتمد FDA" },
    ],
  },
  {
    id: "g5",
    title: { en: "Luxury Gel Nail Art", ar: "فن أظافر الجل الفاخر" },
    category: "skin-care",
    type: "showcase",
    beforeImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    doctor: { en: "Faya Nail Studio", ar: "استوديو أظافر فايا" },
    sessions: 1,
    tags: [
      { en: "Nail Art", ar: "فن الأظافر" },
      { en: "Trending", ar: "رائج" },
    ],
  },
  {
    id: "g6",
    title: { en: "Jawline Contouring", ar: "نحت خط الفك" },
    category: "body-contouring",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    doctor: { en: "Dr. Youssef Ali", ar: "د. يوسف علي" },
    sessions: 3,
    tags: [
      { en: "Body Contouring", ar: "نحت الجسم" },
      { en: "Non-Surgical", ar: "بدون جراحة" },
    ],
  },
  {
    id: "g7",
    title: { en: "Chemical Peel Glow-Up", ar: "توهج التقشير الكيميائي" },
    category: "skin-care",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    doctor: { en: "Dr. Layla Hassan", ar: "د. ليلى حسن" },
    sessions: 3,
    tags: [
      { en: "Peel", ar: "تقشير" },
      { en: "Anti-Aging", ar: "مكافحة الشيخوخة" },
    ],
  },
  {
    id: "g8",
    title: { en: "Bridal Hair Styling", ar: "تصفيف شعر العروس" },
    category: "hair-transplant",
    type: "showcase",
    beforeImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    doctor: { en: "Faya Hair Studio", ar: "استوديو شعر فايا" },
    sessions: 1,
    tags: [
      { en: "Bridal", ar: "عرائس" },
      { en: "Styling", ar: "تصفيف" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG helpers)                                         */
/* ------------------------------------------------------------------ */
function ShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CameraIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function SparklesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery Card component                                             */
/* ------------------------------------------------------------------ */
function GalleryCard({ item }: { item: GalleryItem }) {
  const { t, dir } = useLanguage();

  const isBeforeAfter = item.type === "before-after";
  const categoryLabel = categories.find((c) => c.id === item.category);

  return (
    <div className="group rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Gradient placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8bbd0] via-[#f4c2c2] to-[#e8a0bf]" />

        {/* Actual image */}
        <img
          src={item.afterImage}
          alt={t(item.title)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badge */}
        {isBeforeAfter ? (
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <ShieldIcon className="w-3.5 h-3.5" />
            <span>{t({ en: "Before / After Verified", ar: "قبل / بعد موثق" })}</span>
          </div>
        ) : (
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-warm-gold text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>{t({ en: "Showcase", ar: "عرض" })}</span>
          </div>
        )}

        {/* Category tag */}
        {categoryLabel && (
          <div className="absolute top-3 end-3 bg-primary/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {t(categoryLabel.label)}
          </div>
        )}

        {/* Bottom overlay info */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">
            {t(item.title)}
          </h3>
          <p className="text-white/80 text-sm mt-1">
            {t(item.doctor)}
            {isBeforeAfter && (
              <span className="mx-1.5 text-white/50">|</span>
            )}
            {isBeforeAfter && (
              <span>
                {item.sessions} {t({ en: "sessions", ar: "جلسات" })}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.map((tag: any, i: number) => (
            <span
              key={i}
              className="text-[11px] font-medium text-text-muted bg-bg-light px-2.5 py-1 rounded-full"
            >
              {t(tag)}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/gallery/${item.id}`}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
        >
          <span>
            {isBeforeAfter
              ? t({ en: "View Full Story", ar: "عرض القصة الكاملة" })
              : t({ en: "View Details", ar: "عرض التفاصيل" })}
          </span>
          <ArrowRightIcon className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function GalleryPage() {
  const { t, dir, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  return (
    <main dir={dir} className="min-h-screen bg-bg-light">
      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-hero overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -start-20 w-56 h-56 rounded-full bg-blush/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
              <CameraIcon className="w-4 h-4" />
              <span>{t({ en: "Consent-Verified Images", ar: "صور موثقة بالموافقة" })}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              {t({ en: "Real Patient Results", ar: "نتائج حقيقية للمرضى" })}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mt-5 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              {t({
                en: "Browse verified before-and-after images from our patients. Every result is documented with consent and reflects our commitment to natural-looking transformations.",
                ar: "تصفح صور قبل وبعد الموثقة من مرضانا. كل نتيجة موثقة بالموافقة وتعكس التزامنا بالتحولات الطبيعية المظهر.",
              })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Filter Tabs ─── */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-primary/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={scrollRef}
            className="flex gap-2 py-4 overflow-x-auto hide-scrollbar"
          >
            {categories.map((cat: any) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-bg-light text-text-muted hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {t(cat.label)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Results count ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4">
        <p className="text-sm text-text-muted">
          {t({
            en: `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`,
            ar: `عرض ${filtered.length} نتيجة`,
          })}
        </p>
      </div>

      {/* ─── Gallery Grid (masonry-style) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filtered.map((item: any, index: number) => (
            <ScrollReveal key={item.id} delay={index * 80} className="break-inside-avoid">
              <GalleryCard item={item} />
            </ScrollReveal>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <CameraIcon className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-text-muted text-lg">
              {t({
                en: "No results found in this category yet.",
                ar: "لم يتم العثور على نتائج في هذه الفئة بعد.",
              })}
            </p>
          </div>
        )}
      </section>

      {/* ─── Load More ─── */}
      {filtered.length > 0 && (
        <div className="text-center pb-20">
          <button className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
            <span>{t({ en: "Load More Results", ar: "تحميل المزيد من النتائج" })}</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </main>
  );
}
