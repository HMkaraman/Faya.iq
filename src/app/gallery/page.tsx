"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import PhotoCarousel from "@/components/PhotoCarousel";

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

/* ------------------------------------------------------------------ */
/*  Gallery Card component                                             */
/* ------------------------------------------------------------------ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GalleryCard({ item, onOpen }: { item: any; onOpen: () => void }) {
  const { t } = useLanguage();

  const isBeforeAfter = item.type === "before-after";
  const categoryLabel = categories.find((c) => c.id === item.category);
  const showcaseCount = item.images?.length || 0;

  return (
    <div
      onClick={onOpen}
      className="group rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Gradient placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8bbd0] via-[#f4c2c2] to-[#e8a0bf]" />

        {isBeforeAfter ? (
          /* Split preview for before/after */
          <>
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" style={{ width: "200%" }} />
            </div>
            <div className="absolute inset-0 start-1/2 w-1/2 overflow-hidden">
              <img src={item.afterImage} alt="After" className="w-full h-full object-cover" style={{ width: "200%", objectPosition: "right" }} />
            </div>
            {/* Divider line */}
            <div className="absolute top-0 bottom-0 start-1/2 w-0.5 bg-white z-10" />
          </>
        ) : (
          /* First image for showcase */
          <img
            src={item.images?.[0] || item.afterImage}
            alt={t(item.title)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badge */}
        {isBeforeAfter ? (
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <ShieldIcon className="w-3.5 h-3.5" />
            <span>{t({ en: "Before / After", ar: "قبل / بعد" })}</span>
          </div>
        ) : (
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>{t({ en: "Showcase", ar: "عرض" })}</span>
          </div>
        )}

        {/* Image count badge for showcase */}
        {!isBeforeAfter && showcaseCount > 1 && (
          <div className="absolute top-3 end-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <CameraIcon className="w-3 h-3" />
            <span>{showcaseCount}</span>
          </div>
        )}

        {/* Category tag */}
        {categoryLabel && isBeforeAfter && (
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
            {isBeforeAfter && item.sessions > 0 && (
              <>
                <span className="mx-1.5 text-white/50">|</span>
                <span>
                  {item.sessions} {t({ en: "sessions", ar: "جلسات" })}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags?.map((tag: any, i: number) => (
            <span
              key={i}
              className="text-[11px] font-medium text-text-muted bg-bg-light px-2.5 py-1 rounded-full"
            >
              {t(tag)}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          <span>
            {isBeforeAfter
              ? t({ en: "View Comparison", ar: "عرض المقارنة" })
              : t({ en: "View Gallery", ar: "عرض المعرض" })}
          </span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GalleryModal({ item, onClose }: { item: any; onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isBeforeAfter = item.type === "before-after";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t(item.title)}</h2>

          {isBeforeAfter ? (
            <BeforeAfterSlider
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
            />
          ) : (
            <PhotoCarousel
              images={item.images?.length ? item.images : [item.afterImage]}
            />
          )}

          {/* Info */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>{t(item.doctor)}</span>
            {isBeforeAfter && item.sessions > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span>{item.sessions} {t({ en: "sessions", ar: "جلسات" })}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag: any, i: number) => (
                <span key={i} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {t(tag)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function GalleryPage() {
  const { t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modalItem, setModalItem] = useState<any | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setGalleryItems(data.filter((item: any) => item.active !== false));
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const filtered =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((i: any) => i.category === activeCategory);

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
            {categories.map((cat) => {
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

      {/* ─── Loading / Results count ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-muted">{t({ en: "Loading gallery...", ar: "جارٍ تحميل المعرض..." })}</p>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            {t({
              en: `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`,
              ar: `عرض ${filtered.length} نتيجة`,
            })}
          </p>
        )}
      </div>

      {/* ─── Gallery Grid (masonry-style) ─── */}
      {!loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item: any, index: number) => (
              <ScrollReveal key={item.id} delay={index * 80} className="break-inside-avoid">
                <GalleryCard item={item} onOpen={() => setModalItem(item)} />
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
      )}

      {/* Spacer */}
      <div className="h-16" />

      {/* Modal */}
      {modalItem && (
        <GalleryModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </main>
  );
}
