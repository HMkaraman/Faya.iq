"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

const milestones = [
  {
    year: "2009",
    title: { en: "The Beginning in Baghdad", ar: "البداية في بغداد" },
    description: {
      en: "Faya opened its first clinic in Al Mansour, Baghdad, with a vision to bring world-class aesthetic care to Iraq.",
      ar: "افتتحت فايا أول عيادة لها في المنصور، بغداد، برؤية لتقديم رعاية تجميلية عالمية المستوى في العراق.",
    },
  },
  {
    year: "2014",
    title: { en: "Expansion to Erbil", ar: "التوسع إلى أربيل" },
    description: {
      en: "With growing demand, we opened our second branch in Erbil's prestigious Dream City, serving the Kurdistan Region.",
      ar: "مع تزايد الطلب، افتتحنا فرعنا الثاني في دريم سيتي المرموقة في أربيل لخدمة إقليم كردستان.",
    },
  },
  {
    year: "2019",
    title: { en: "National Recognition", ar: "اعتراف وطني" },
    description: {
      en: "Faya was awarded Best Aesthetic Clinic in Iraq, recognizing our commitment to excellence and patient satisfaction.",
      ar: "حصلت فايا على جائزة أفضل عيادة تجميلية في العراق، تقديراً لالتزامنا بالتميز ورضا المرضى.",
    },
  },
  {
    year: "2023",
    title: { en: "Basra Branch Launch", ar: "إطلاق فرع البصرة" },
    description: {
      en: "Continuing our national expansion, we launched our newest branch in Basra to bring our services to southern Iraq.",
      ar: "استمراراً في توسعنا الوطني، أطلقنا أحدث فروعنا في البصرة لتقديم خدماتنا في جنوب العراق.",
    },
  },
];

const values = [
  {
    title: { en: "Excellence", ar: "التميز" },
    description: {
      en: "We pursue the highest standards in every treatment, using cutting-edge technology and techniques to deliver exceptional results.",
      ar: "نسعى لأعلى المعايير في كل علاج، باستخدام أحدث التقنيات والأساليب لتقديم نتائج استثنائية.",
    },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: { en: "Trust", ar: "الثقة" },
    description: {
      en: "Building lasting relationships through transparency, honesty, and genuine care for every patient who walks through our doors.",
      ar: "بناء علاقات دائمة من خلال الشفافية والصدق والرعاية الحقيقية لكل مريض يدخل أبوابنا.",
    },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: { en: "Innovation", ar: "الابتكار" },
    description: {
      en: "Continuously adopting the latest advances in aesthetic medicine to offer our patients the most effective and safest treatments available.",
      ar: "اعتماد أحدث التطورات في الطب التجميلي باستمرار لتقديم أكثر العلاجات فعالية وأماناً لمرضانا.",
    },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
];

export default function AboutPage() {
  const { lang, dir, t } = useLanguage();

  /* ── API data state ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamRes, branchRes] = await Promise.all([
          fetch("/api/team"),
          fetch("/api/branches"),
        ]);
        const [teamData, branchData] = await Promise.all([
          teamRes.json(),
          branchRes.json(),
        ]);
        setTeamMembers(teamData);
        setBranches(branchData);
      } catch (err) {
        console.error("Failed to fetch about page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      {/* ───────────── HERO SECTION ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-white to-[#fdf2f8]">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "About Faya", ar: "عن فايا" })}
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                {t({
                  en: "Elevating Beauty Through Science",
                  ar: "الارتقاء بالجمال من خلال العلم",
                })}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-text-muted">
                {t({
                  en: "Since 2009, Faya has been Iraq's leading aesthetic clinic, combining medical expertise with artistic vision to help our clients feel confident and beautiful. With three branches across the country, we bring world-class treatments closer to you.",
                  ar: "منذ عام ٢٠٠٩، كانت فايا العيادة التجميلية الرائدة في العراق، تجمع بين الخبرة الطبية والرؤية الفنية لمساعدة عملائنا على الشعور بالثقة والجمال. مع ثلاثة فروع في أنحاء البلاد، نقرّب العلاجات العالمية إليك.",
                })}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ───────────── STATS BAR ───────────── */}
      <section className="relative -mt-1 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <AnimatedCounter
              end={2009}
              label={t({ en: "Founded", ar: "سنة التأسيس" })}
              duration={2500}
            />
            <AnimatedCounter
              end={3}
              label={t({ en: "Branches", ar: "فروع" })}
              duration={1500}
            />
            <AnimatedCounter
              end={50}
              suffix="+"
              label={t({ en: "Specialists", ar: "متخصص" })}
              duration={2000}
            />
            <AnimatedCounter
              end={15000}
              suffix="+"
              label={t({ en: "Happy Clients", ar: "عميل سعيد" })}
              duration={2500}
            />
          </div>
        </div>
      </section>

      {/* ───────────── OUR JOURNEY TIMELINE ───────────── */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "Our Story", ar: "قصتنا" })}
              </span>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t({ en: "Our Journey", ar: "مسيرتنا" })}
              </h2>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical connector line (desktop) */}
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-primary/20 md:block" />
            {/* Vertical connector line (mobile) */}
            <div className="absolute start-6 top-0 block h-full w-0.5 bg-primary/20 md:hidden" />

            <div className="space-y-12 md:space-y-16">
              {milestones.map((milestone: any, idx: number) => {
                const isLeft = idx % 2 === 0;
                return (
                  <ScrollReveal key={milestone.year} delay={idx * 150}>
                    <div className="relative flex items-start gap-6 md:items-center">
                      {/* ── Mobile layout ── */}
                      <div className="flex shrink-0 md:hidden">
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary text-sm font-bold text-white shadow-glow">
                          {milestone.year.slice(2)}
                        </div>
                      </div>
                      <div className="flex-1 md:hidden">
                        <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-card">
                          <span className="text-xs font-bold tracking-widest text-primary">
                            {milestone.year}
                          </span>
                          <h3 className="mt-1 font-display text-lg font-bold text-text-primary">
                            {t(milestone.title)}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-text-muted">
                            {t(milestone.description)}
                          </p>
                        </div>
                      </div>

                      {/* ── Desktop layout ── */}
                      {/* Left content */}
                      <div className={`hidden w-5/12 md:block ${isLeft ? "" : "order-3"}`}>
                        {isLeft && (
                          <div className="rounded-2xl border border-primary/10 bg-white p-6 text-end shadow-card transition-all duration-300 hover:shadow-elevated">
                            <span className="text-xs font-bold tracking-widest text-primary">
                              {milestone.year}
                            </span>
                            <h3 className="mt-1 font-display text-xl font-bold text-text-primary">
                              {t(milestone.title)}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-muted">
                              {t(milestone.description)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Center dot */}
                      <div className="relative z-10 hidden shrink-0 md:flex">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-primary text-sm font-bold text-white shadow-glow">
                          {milestone.year.slice(2)}
                        </div>
                      </div>

                      {/* Right content */}
                      <div className={`hidden w-5/12 md:block ${isLeft ? "order-3" : ""}`}>
                        {!isLeft && (
                          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-elevated">
                            <span className="text-xs font-bold tracking-widest text-primary">
                              {milestone.year}
                            </span>
                            <h3 className="mt-1 font-display text-xl font-bold text-text-primary">
                              {t(milestone.title)}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-muted">
                              {t(milestone.description)}
                            </p>
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

      {/* ───────────── MISSION & VALUES ───────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "What Drives Us", ar: "ما يحفّزنا" })}
              </span>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t({ en: "Mission & Values", ar: "الرسالة والقيم" })}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-muted">
                {t({
                  en: "Everything we do is guided by our core values, ensuring every patient receives the care they deserve.",
                  ar: "كل ما نقوم به يسترشد بقيمنا الأساسية، مما يضمن حصول كل مريض على الرعاية التي يستحقها.",
                })}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((value: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 120}>
                <div className="group rounded-2xl border border-primary/10 bg-bg-light p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    {value.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    {t(value.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {t(value.description)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── MEET THE MEDICAL TEAM ───────────── */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "Expert Care", ar: "رعاية متخصصة" })}
              </span>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t({ en: "Meet the Medical Team", ar: "تعرّف على الفريق الطبي" })}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-muted">
                {t({
                  en: "Our board-certified specialists combine years of experience with a passion for aesthetic excellence.",
                  ar: "يجمع أطباؤنا المعتمدون بين سنوات من الخبرة وشغف بالتميز في الطب التجميلي.",
                })}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member: any, idx: number) => (
              <ScrollReveal key={member.id} delay={idx * 120}>
                <article className="group overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={t(member.name)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {/* Years badge */}
                    <div className="absolute bottom-4 end-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
                      {member.yearsExperience}{" "}
                      {t({ en: "years exp.", ar: "سنة خبرة" })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-text-primary">
                      {t(member.name)}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {t(member.title)}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t(member.specialization)}
                    </p>

                    {/* Branches */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {t({ en: "Branches:", ar: "الفروع:" })}
                      </span>
                      {member.branches.map((branchId: string) => {
                        const branch = getBranch(branchId);
                        return branch ? (
                          <span
                            key={branchId}
                            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                          >
                            {t(branch.city)}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CLINIC GALLERY ───────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {t({ en: "Our Space", ar: "مساحتنا" })}
              </span>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {t({ en: "Inside Our Clinics", ar: "داخل عياداتنا" })}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-muted">
                {t({
                  en: "Modern, comfortable spaces designed to make you feel at ease from the moment you arrive.",
                  ar: "مساحات حديثة ومريحة مصممة لتشعرك بالراحة منذ لحظة وصولك.",
                })}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {galleryImages.map((src: string, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group overflow-hidden rounded-xl">
                  <img
                    src={src}
                    alt={t({
                      en: `Faya clinic gallery image ${idx + 1}`,
                      ar: `صورة معرض عيادة فايا ${idx + 1}`,
                    })}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA SECTION ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-20">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {t({
                en: "Ready to Start Your Journey?",
                ar: "مستعد لبدء رحلتك؟",
              })}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {t({
                en: "Book a consultation with our expert team and discover the treatments that are right for you.",
                ar: "احجز استشارة مع فريقنا المتخصص واكتشف العلاجات المناسبة لك.",
              })}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all hover:bg-ivory hover:shadow-xl"
              >
                {t({ en: "Book a Consultation", ar: "احجز استشارة" })}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${lang === "ar" ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                {t({ en: "View Services", ar: "عرض الخدمات" })}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
