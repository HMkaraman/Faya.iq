"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  caption?: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, caption }: BeforeAfterSliderProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Before Frame */}
        <div className="relative overflow-hidden rounded-xl shadow-md">
          <div className="aspect-[4/5]">
            <img
              src={beforeImage}
              alt="Before"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5 sm:px-4 sm:py-3">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {t({ en: "Before", ar: "قبل" })}
            </span>
          </div>
        </div>

        {/* After Frame */}
        <div className="relative overflow-hidden rounded-xl shadow-md">
          <div className="aspect-[4/5]">
            <img
              src={afterImage}
              alt="After"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5 sm:px-4 sm:py-3">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {t({ en: "After", ar: "بعد" })}
            </span>
          </div>
        </div>
      </div>

      {caption && <p className="text-sm text-[#8c7284] text-center">{caption}</p>}
    </div>
  );
}
