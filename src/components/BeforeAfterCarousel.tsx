"use client";

import React from "react";
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
  const { t } = useLanguage();

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
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1}
      className="before-after-carousel"
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
  );
}
