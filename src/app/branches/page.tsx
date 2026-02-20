"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { branches } from "@/data/branches";
import { serviceCategories } from "@/data/services";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Map a service category slug to its readable bilingual name */
function serviceName(slug: string): { en: string; ar: string } {
  const found = serviceCategories.find((c) => c.slug === slug);
  return found ? found.name : { en: slug, ar: slug };
}

/** Colour palette for service tags (cycles) */
const tagColors = [
  "bg-primary/10 text-primary",
  "bg-[#e8a0bf]/20 text-[#a03d5e]",
  "bg-[#c9a96e]/15 text-[#8b6d30]",
  "bg-[#b76e79]/15 text-[#8e4752]",
  "bg-[#8c7284]/10 text-[#6b4f60]",
  "bg-[#c8567e]/10 text-[#a03d5e]",
];

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */
function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function NavigationIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function CheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function HeartPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Map Placeholder component                                          */
/* ------------------------------------------------------------------ */
function MapPlaceholder({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();

  /* Rough pin positions (% from top-left) per branch for the placeholder map */
  const pinPositions: Record<string, { top: string; left: string }> = {
    "baghdad-mansour": { top: "42%", left: "50%" },
    erbil: { top: "18%", left: "58%" },
    basra: { top: "78%", left: "55%" },
  };

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-0 rounded-2xl bg-[#f0e8eb] overflow-hidden border border-primary/10">
      {/* Map grid lines */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_: unknown, i: number) => (
          <div key={`h-${i}`} className="absolute w-full border-t border-primary/20" style={{ top: `${(i + 1) * 11}%` }} />
        ))}
        {Array.from({ length: 6 }).map((_: unknown, i: number) => (
          <div key={`v-${i}`} className="absolute h-full border-s border-primary/20" style={{ left: `${(i + 1) * 15}%` }} />
        ))}
      </div>

      {/* Decorative label */}
      <div className="absolute top-4 start-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-text-muted">
        <MapPinIcon className="w-3.5 h-3.5 text-primary" />
        <span>{t({ en: "Iraq", ar: "العراق" })}</span>
      </div>

      {/* Branch pins */}
      {branches.map((branch: any) => {
        const pos = pinPositions[branch.id] || { top: "50%", left: "50%" };
        const isSelected = selectedId === branch.id;

        return (
          <button
            key={branch.id}
            onClick={() => onSelect(branch.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none"
            style={{ top: pos.top, left: pos.left }}
            aria-label={t(branch.name)}
          >
            {/* Pulse ring for selected */}
            {isSelected && (
              <span className="absolute inset-0 -m-3 rounded-full bg-primary/20 animate-ping" />
            )}

            {/* Pin body */}
            <span
              className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 ${
                isSelected
                  ? "bg-primary text-white scale-125 shadow-primary/30"
                  : "bg-white text-primary hover:bg-primary hover:text-white hover:scale-110"
              }`}
            >
              <HeartPinIcon className="w-5 h-5" />
            </span>

            {/* Label */}
            <span
              className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded-md transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white/90 text-text-primary shadow-sm opacity-0 group-hover/pin:opacity-100"
              }`}
            >
              {t(branch.city)}
            </span>
          </button>
        );
      })}

      {/* Country shape hint (decorative dashed path) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4">
        <path d="M80 20 Q110 10, 130 30 Q140 50, 120 80 Q130 100, 115 130 Q100 160, 110 180 Q90 190, 80 170 Q70 150, 60 130 Q50 100, 60 80 Q55 50, 70 35 Z" className="text-primary" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Branch Card component                                              */
/* ------------------------------------------------------------------ */
function BranchCard({
  branch,
  isSelected,
  onSelect,
}: {
  branch: (typeof branches)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { t, dir } = useLanguage();

  return (
    <div
      onClick={onSelect}
      className={`group rounded-2xl overflow-hidden bg-white transition-all duration-300 cursor-pointer ${
        isSelected
          ? "ring-2 ring-primary shadow-lg shadow-primary/10"
          : "shadow-sm hover:shadow-md border border-transparent hover:border-primary/10"
      }`}
    >
      {/* Branch image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={branch.image}
          alt={t(branch.name)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 end-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-sm font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span className="text-text-primary">{branch.rating}</span>
          <span className="text-text-muted text-xs">({branch.reviewCount.toLocaleString()})</span>
        </div>

        {/* Branch name overlay */}
        <div className="absolute bottom-3 start-3 end-3">
          <h3 className="text-white font-bold text-lg leading-tight">{t(branch.name)}</h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-2.5">
          <MapPinIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-muted leading-relaxed">{t(branch.address)}</p>
        </div>

        {/* Working hours */}
        <div className="flex items-start gap-2.5">
          <ClockIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-muted leading-relaxed">{t(branch.hours)}</p>
        </div>

        {/* Phone (click-to-call) */}
        <div className="flex items-center gap-2.5">
          <PhoneIcon className="w-4 h-4 text-primary flex-shrink-0" />
          <a
            href={`tel:${branch.phone.replace(/\s/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
            dir="ltr"
          >
            {branch.phone}
          </a>
        </div>

        {/* Available services */}
        <div>
          <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
            {t({ en: "Available Services", ar: "الخدمات المتاحة" })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {branch.availableServices.map((slug, i) => (
              <span
                key={slug}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${tagColors[i % tagColors.length]}`}
              >
                {t(serviceName(slug))}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
            {t({ en: "Features", ar: "المميزات" })}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {(dir === "rtl" ? branch.features.ar : branch.features.en).map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-sm text-text-muted">
                <CheckIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            <NavigationIcon className="w-4 h-4" />
            <span>{t({ en: "Get Directions", ar: "احصل على الاتجاهات" })}</span>
          </a>
          <a
            href={`https://wa.me/${branch.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-[#1ebe5a] transition-all duration-300"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>{t({ en: "WhatsApp", ar: "واتساب" })}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function BranchesPage() {
  const { t, dir } = useLanguage();
  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]?.id ?? "");

  return (
    <main dir={dir} className="min-h-screen bg-bg-light">
      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -start-20 w-56 h-56 rounded-full bg-blush/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
          {/* Breadcrumb */}
          <ScrollReveal>
            <nav className="flex items-center gap-1.5 text-sm text-text-muted mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                {t({ en: "Home", ar: "الرئيسية" })}
              </Link>
              <ChevronRightIcon className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
              <span className="text-text-primary font-medium">
                {t({ en: "Locations", ar: "الفروع" })}
              </span>
            </nav>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              {t({ en: "Our Branches", ar: "فروعنا" })}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mt-4 text-lg sm:text-xl text-text-muted max-w-2xl leading-relaxed">
              {t({
                en: "Visit us at any of our locations across Iraq. Each branch is designed to deliver the highest standard of beauty and medical care in a welcoming environment.",
                ar: "قم بزيارتنا في أي من فروعنا في أنحاء العراق. كل فرع مصمم لتقديم أعلى معايير الجمال والرعاية الطبية في بيئة ترحيبية.",
              })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Map + Branch Cards ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map (left on desktop, top on mobile) */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal>
              <MapPlaceholder
                selectedId={selectedBranch}
                onSelect={setSelectedBranch}
              />
            </ScrollReveal>

            {/* Quick branch count */}
            <div className="mt-4 text-center">
              <p className="text-sm text-text-muted">
                <span className="font-semibold text-primary">{branches.length}</span>{" "}
                {t({ en: "branches across Iraq", ar: "فروع في أنحاء العراق" })}
              </p>
            </div>
          </div>

          {/* Branch cards (right on desktop, bottom on mobile) */}
          <div className="w-full lg:w-7/12 space-y-6">
            {branches.map((branch: any, index: number) => (
              <ScrollReveal key={branch.id} delay={index * 100}>
                <BranchCard
                  branch={branch}
                  isSelected={selectedBranch === branch.id}
                  onSelect={() => setSelectedBranch(branch.id)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="bg-gradient-to-br from-primary/5 via-bg-light to-blush/5 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              {t({
                en: "Not Sure Which Branch to Visit?",
                ar: "غير متأكد أي فرع تزوره؟",
              })}
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              {t({
                en: "Contact us and we will help you find the nearest branch with the services you need.",
                ar: "تواصل معنا وسنساعدك في العثور على أقرب فرع بالخدمات التي تحتاجها.",
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/20"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>{t({ en: "Contact Us", ar: "تواصل معنا" })}</span>
              </Link>
              <a
                href={`https://wa.me/${branches[0]?.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#1ebe5a] transition-all duration-300"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>{t({ en: "WhatsApp Us", ar: "راسلنا واتساب" })}</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
