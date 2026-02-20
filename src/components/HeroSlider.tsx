"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { HeroSlide } from "@/types";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const { t } = useLanguage();

  const activeSlides = slides.filter((s) => s.active).sort((a, b) => a.order - b.order);

  if (activeSlides.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      pagination={{ clickable: true }}
      loop={activeSlides.length > 1}
      className="hero-slider w-full"
      style={{ height: "clamp(50vh, 70vh, 80vh)" }}
    >
      {activeSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-full">
            {/* Background */}
            <img
              src={slide.backgroundImage}
              alt={t(slide.title)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display leading-tight">
                  {t(slide.title)}
                </h1>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                  {t(slide.subtitle)}
                </p>
                {slide.ctaText && slide.ctaHref && (
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                  >
                    {t(slide.ctaText)}
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
