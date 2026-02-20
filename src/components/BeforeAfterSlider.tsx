"use client";

import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  caption?: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, caption }: BeforeAfterSliderProps) {
  const { t } = useLanguage();
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    updatePosition(e.clientX);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }

  function handleMouseUp() {
    isDragging.current = false;
  }

  function handleTouchStart(e: React.TouchEvent) {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }

  function handleTouchEnd() {
    isDragging.current = false;
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="before-after-container relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-col-resize shadow-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* After image (full background) */}
        <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

        {/* Before image (clipped by position) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${containerRef.current?.offsetWidth || 600}px` }}
            draggable={false}
          />
        </div>

        {/* Slider divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          {/* Vertical line */}
          <div className="absolute inset-0 w-[2px] bg-white/90 mx-auto shadow-[0_0_8px_rgba(0,0,0,0.3)]" />

          {/* Drag handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.25)] flex items-center justify-center transition-transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
          {t({ en: "Before", ar: "قبل" })}
        </div>
        <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
          {t({ en: "After", ar: "بعد" })}
        </div>

        {/* Instruction hint (fades after interaction) */}
        <div className="before-after-hint absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full pointer-events-none transition-opacity">
          {t({ en: "Drag to compare", ar: "اسحب للمقارنة" })}
        </div>
      </div>
      {caption && <p className="text-sm text-[#8c7284] text-center">{caption}</p>}
    </div>
  );
}
