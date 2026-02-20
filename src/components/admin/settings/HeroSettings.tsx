"use client";

import React from "react";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUpload from "@/components/admin/ImageUpload";
import type { HeroSlide } from "@/types";

interface HeroSettingsProps {
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
}

export default function HeroSettings({ slides, onChange }: HeroSettingsProps) {
  function addSlide() {
    const newSlide: HeroSlide = {
      id: `slide_${Date.now()}`,
      backgroundImage: "",
      title: { en: "", ar: "" },
      subtitle: { en: "", ar: "" },
      ctaText: { en: "", ar: "" },
      ctaHref: "",
      order: slides.length,
      active: true,
    };
    onChange([...slides, newSlide]);
  }

  function removeSlide(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  function updateSlide(index: number, updates: Partial<HeroSlide>) {
    onChange(slides.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  }

  function moveSlide(index: number, direction: "up" | "down") {
    const newSlides = [...slides];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;
    [newSlides[index], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[index]];
    newSlides.forEach((s, i) => (s.order = i));
    onChange(newSlides);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
        <button
          type="button"
          onClick={addSlide}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Slide
        </button>
      </div>

      {slides.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">No hero slides configured. The homepage will show the default static hero.</p>
      )}

      {slides.map((slide, index) => (
        <div key={slide.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Slide #{index + 1}</span>
              {!slide.active && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Inactive</span>}
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveSlide(index, "up")} disabled={index === 0} className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Move up">
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
              <button type="button" onClick={() => moveSlide(index, "down")} disabled={index === slides.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Move down">
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </button>
              <button type="button" onClick={() => removeSlide(index)} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove slide">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          <ImageUpload
            label="Background Image"
            value={slide.backgroundImage}
            onChange={(url) => updateSlide(index, { backgroundImage: url })}
          />

          <BilingualInput
            label="Title"
            nameEn={`hero_title_en_${index}`}
            nameAr={`hero_title_ar_${index}`}
            valueEn={slide.title.en}
            valueAr={slide.title.ar}
            onChangeEn={(v) => updateSlide(index, { title: { ...slide.title, en: v } })}
            onChangeAr={(v) => updateSlide(index, { title: { ...slide.title, ar: v } })}
          />

          <BilingualInput
            label="Subtitle"
            nameEn={`hero_sub_en_${index}`}
            nameAr={`hero_sub_ar_${index}`}
            valueEn={slide.subtitle.en}
            valueAr={slide.subtitle.ar}
            onChangeEn={(v) => updateSlide(index, { subtitle: { ...slide.subtitle, en: v } })}
            onChangeAr={(v) => updateSlide(index, { subtitle: { ...slide.subtitle, ar: v } })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BilingualInput
              label="CTA Button Text"
              nameEn={`hero_cta_en_${index}`}
              nameAr={`hero_cta_ar_${index}`}
              valueEn={slide.ctaText?.en || ""}
              valueAr={slide.ctaText?.ar || ""}
              onChangeEn={(v) => updateSlide(index, { ctaText: { en: v, ar: slide.ctaText?.ar || "" } })}
              onChangeAr={(v) => updateSlide(index, { ctaText: { en: slide.ctaText?.en || "", ar: v } })}
            />
            <FormField label="CTA Link">
              <input
                type="text"
                value={slide.ctaHref || ""}
                onChange={(e) => updateSlide(index, { ctaHref: e.target.value })}
                placeholder="/booking"
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer" dir="ltr">
              <input type="checkbox" checked={slide.active} onChange={(e) => updateSlide(index, { active: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
            <span className="text-sm text-gray-600">{slide.active ? "Active" : "Inactive"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
