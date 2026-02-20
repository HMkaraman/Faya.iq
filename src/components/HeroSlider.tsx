"use client";

import React, { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { HeroSlide } from "@/types";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const { t, dir } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const isRTL = dir === "rtl";

  const activeSlides = slides
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  if (activeSlides.length === 0) return null;

  return (
    <section className="hero-slider-wrapper relative" aria-label={t({ en: "Hero Banner", ar: "البانر الرئيسي" })}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
        }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        loop={activeSlides.length > 1}
        speed={1000}
        onSlideChangeTransitionStart={handleSlideChange}
        className="hero-slider w-full"
        style={{ height: "min(90vh, 950px)" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {activeSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden">
              {/* Background with Ken Burns */}
              <div
                className={`absolute inset-0 w-full h-full hero-ken-burns-container${
                  activeIndex === index ? " hero-ken-burns-active" : ""
                }`}
              >
                <img
                  src={slide.backgroundImage}
                  alt={t(slide.title)}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              {/* Dual overlay: bottom gradient + radial vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-8">
                <div
                  className={`hero-slide-content max-w-4xl space-y-6 md:space-y-8${
                    activeIndex === index ? " active" : ""
                  }`}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-display leading-tight drop-shadow-lg">
                    {t(slide.title)}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    {t(slide.subtitle)}
                  </p>
                  {slide.ctaText && slide.ctaHref && (
                    <div>
                      <Link
                        href={slide.ctaHref}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 hover:scale-105"
                      >
                        {t(slide.ctaText)}
                        <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                          {isRTL ? "arrow_back" : "arrow_forward"}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation arrows — hidden on mobile */}
      {activeSlides.length > 1 && (
        <>
          <button
            className="hero-prev hidden md:flex absolute top-1/2 left-4 lg:left-8 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110"
            aria-label={t({ en: "Previous slide", ar: "الشريحة السابقة" })}
          >
            <span className="material-symbols-outlined text-[24px] lg:text-[28px]">
              {isRTL ? "chevron_right" : "chevron_left"}
            </span>
          </button>
          <button
            className="hero-next hidden md:flex absolute top-1/2 right-4 lg:right-8 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110"
            aria-label={t({ en: "Next slide", ar: "الشريحة التالية" })}
          >
            <span className="material-symbols-outlined text-[24px] lg:text-[28px]">
              {isRTL ? "chevron_left" : "chevron_right"}
            </span>
          </button>
        </>
      )}

      {/* Custom pagination */}
      <div className="hero-pagination absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5" />
    </section>
  );
}
