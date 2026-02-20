"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BeforeAfterSlider from "./BeforeAfterSlider";
import type { BeforeAfterPair } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface BeforeAfterCarouselProps {
  pairs: BeforeAfterPair[];
}

export default function BeforeAfterCarousel({ pairs }: BeforeAfterCarouselProps) {
  const { t, dir } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  if (pairs.length === 0) return null;

  if (pairs.length === 1) {
    const pair = pairs[0];
    return (
      <BeforeAfterSlider
        beforeImage={pair.beforeImage}
        afterImage={pair.afterImage}
        caption={pair.caption ? t(pair.caption) : undefined}
      />
    );
  }

  return (
    <div className="before-after-carousel-wrapper">
      {/* Counter */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#8c7284]">
          <span className="font-semibold text-primary">{activeIndex + 1}</span>
          <span className="mx-1">/</span>
          <span>{pairs.length}</span>
          <span className="ms-2">{t({ en: "results", ar: "نتيجة" })}</span>
        </p>
      </div>

      <Swiper
        dir={dir}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".ba-next",
          prevEl: ".ba-prev",
        }}
        pagination={{
          clickable: true,
          el: ".ba-pagination",
        }}
        spaceBetween={24}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="ba-swiper rounded-2xl"
      >
        {pairs.map((pair) => (
          <SwiperSlide key={pair.id}>
            <BeforeAfterSlider
              beforeImage={pair.beforeImage}
              afterImage={pair.afterImage}
              caption={pair.caption ? t(pair.caption) : undefined}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation + pagination bar */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className="ba-prev flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition-all hover:bg-primary hover:text-white hover:shadow-md disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${dir === "rtl" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="ba-pagination flex items-center gap-2" />

        <button
          className="ba-next flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition-all hover:bg-primary hover:text-white hover:shadow-md disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${dir === "rtl" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
