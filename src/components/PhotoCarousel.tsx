"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface PhotoCarouselProps {
  images: string[];
  title?: string;
}

export default function PhotoCarousel({ images, title }: PhotoCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}

        {/* Main slider */}
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={0}
          slidesPerView={1}
          className="rounded-xl overflow-hidden"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="aspect-[4/3] cursor-zoom-in" onClick={() => openLightbox(i)}>
                <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails */}
        {images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={Math.min(images.length, 6)}
            watchSlidesProgress
            className="mt-2"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className="cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                  <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg z-10" onClick={() => setLightboxOpen(false)}>
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>

          {lightboxIndex > 0 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-lg z-10" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i - 1); }}>
              <span className="material-symbols-outlined text-[32px]">chevron_left</span>
            </button>
          )}

          {lightboxIndex < images.length - 1 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-lg z-10" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i + 1); }}>
              <span className="material-symbols-outlined text-[32px]">chevron_right</span>
            </button>
          )}

          <img
            src={images[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
