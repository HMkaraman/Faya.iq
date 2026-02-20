"use client";

import React, { useEffect, useState, useRef } from "react";
import TopBar from "@/components/admin/TopBar";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import StatusBadge from "@/components/admin/StatusBadge";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import FormField from "@/components/admin/FormField";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { HeroSlide } from "@/types";

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

export default function HeroSlidesPage() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [expandedSlide, setExpandedSlide] = useState<string | null>(null);
  const initialRef = useRef<string>("");

  const isDirty = JSON.stringify(slides) !== initialRef.current;

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const heroSlides = (data.heroSlides || []) as HeroSlide[];
      setSlides(heroSlides);
      initialRef.current = JSON.stringify(heroSlides);
    } catch {
      toast(t(adminI18n.heroSlides.loadFailed), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Fetch current settings, merge heroSlides, save back
      const getRes = await fetch("/api/settings");
      if (!getRes.ok) throw new Error("Failed to fetch settings");
      const currentSettings = await getRes.json();

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentSettings, heroSlides: slides }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }

      initialRef.current = JSON.stringify(slides);
      toast(t(adminI18n.heroSlides.saveSuccess), "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.heroSlides.saveFailed), "error");
    } finally {
      setSaving(false);
    }
  }

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
    setSlides((prev) => [...prev, newSlide]);
    setExpandedSlide(newSlide.id);
  }

  function removeSlide() {
    if (deleteIndex === null) return;
    setSlides((prev) => {
      const next = prev.filter((_, i) => i !== deleteIndex);
      next.forEach((s, i) => (s.order = i));
      return next;
    });
    setDeleteIndex(null);
  }

  function updateSlide(index: number, updates: Partial<HeroSlide>) {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  }

  function moveSlide(index: number, direction: "up" | "down") {
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
      next.forEach((s, i) => (s.order = i));
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedSlide((prev) => (prev === id ? null : id));
  }

  const activeCount = slides.filter((s) => s.active).length;

  if (loading) {
    return (
      <>
        <TopBar title={t(adminI18n.heroSlides.title)} />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={t(adminI18n.heroSlides.title)}>
        <button
          onClick={addSlide}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t(adminI18n.heroSlides.addSlide)}
        </button>
      </TopBar>

      <div className="p-6 space-y-5">
        {/* Stats bar */}
        {slides.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">slideshow</span>
                {slides.length} {t(adminI18n.heroSlides.slideCount)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {activeCount} {t(adminI18n.heroSlides.activeCount)}
              </span>
            </div>
            {isDirty && (
              <span className="text-sm text-amber-600 font-medium inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                {t(adminI18n.heroSlides.unsavedChanges)}
              </span>
            )}
          </div>
        )}

        {/* Empty state */}
        {slides.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300">
              slideshow
            </span>
            <p className="mt-3 text-gray-500">{t(adminI18n.heroSlides.noSlides)}</p>
            <button
              onClick={addSlide}
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {t(adminI18n.heroSlides.addFirstSlide)}
            </button>
          </div>
        ) : (
          /* Slide cards */
          <div className="space-y-4">
            {slides.map((slide, index) => {
              const isExpanded = expandedSlide === slide.id;
              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Collapsed header — always visible */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => toggleExpand(slide.id)}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-14 sm:w-28 sm:h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {slide.backgroundImage ? (
                        <img
                          src={slide.backgroundImage}
                          alt={slide.title?.[lang] || slide.title?.en || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <span className="material-symbols-outlined text-[24px]">image</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {slide.title?.[lang] || slide.title?.en || (
                            <span className="text-gray-400 italic">{t(adminI18n.heroSlides.slideTitle)}</span>
                          )}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {slide.subtitle?.[lang] || slide.subtitle?.en || "—"}
                      </p>
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={slide.active ? "active" : "inactive"} />

                      {/* Reorder */}
                      <button
                        onClick={() => moveSlide(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        title={t(adminI18n.heroSlides.moveUp)}
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                      </button>
                      <button
                        onClick={() => moveSlide(index, "down")}
                        disabled={index === slides.length - 1}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        title={t(adminI18n.heroSlides.moveDown)}
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteIndex(index)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title={t(adminI18n.heroSlides.deleteSlide)}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>

                      {/* Expand chevron */}
                      <button
                        onClick={() => toggleExpand(slide.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] transition-transform duration-200 block ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded edit form */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 sm:px-6 pb-6 pt-5 space-y-5">
                      {/* Background Image */}
                      <ImageUpload
                        label={t(adminI18n.heroSlides.backgroundImage)}
                        value={slide.backgroundImage}
                        onChange={(url) => updateSlide(index, { backgroundImage: url })}
                      />

                      {/* Title */}
                      <BilingualInput
                        label={t(adminI18n.heroSlides.slideTitle)}
                        nameEn={`hero_title_en_${index}`}
                        nameAr={`hero_title_ar_${index}`}
                        valueEn={slide.title.en}
                        valueAr={slide.title.ar}
                        onChangeEn={(v) => updateSlide(index, { title: { ...slide.title, en: v } })}
                        onChangeAr={(v) => updateSlide(index, { title: { ...slide.title, ar: v } })}
                        required
                      />

                      {/* Subtitle */}
                      <BilingualTextarea
                        label={t(adminI18n.heroSlides.subtitle)}
                        nameEn={`hero_sub_en_${index}`}
                        nameAr={`hero_sub_ar_${index}`}
                        valueEn={slide.subtitle.en}
                        valueAr={slide.subtitle.ar}
                        onChangeEn={(v) => updateSlide(index, { subtitle: { ...slide.subtitle, en: v } })}
                        onChangeAr={(v) => updateSlide(index, { subtitle: { ...slide.subtitle, ar: v } })}
                        rows={2}
                      />

                      {/* CTA */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <BilingualInput
                          label={t(adminI18n.heroSlides.ctaText)}
                          nameEn={`hero_cta_en_${index}`}
                          nameAr={`hero_cta_ar_${index}`}
                          valueEn={slide.ctaText?.en || ""}
                          valueAr={slide.ctaText?.ar || ""}
                          onChangeEn={(v) => updateSlide(index, { ctaText: { en: v, ar: slide.ctaText?.ar || "" } })}
                          onChangeAr={(v) => updateSlide(index, { ctaText: { en: slide.ctaText?.en || "", ar: v } })}
                        />
                        <FormField label={t(adminI18n.heroSlides.ctaLink)}>
                          <input
                            type="text"
                            value={slide.ctaHref || ""}
                            onChange={(e) => updateSlide(index, { ctaHref: e.target.value })}
                            placeholder={t(adminI18n.heroSlides.ctaLinkPlaceholder)}
                            className={INPUT_CLASS}
                          />
                        </FormField>
                      </div>

                      {/* Active toggle */}
                      <div className="flex items-center gap-3 pt-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slide.active}
                            onChange={(e) => updateSlide(index, { active: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                          <span className="ml-3 text-sm text-gray-600">
                            {slide.active ? t(adminI18n.heroSlides.activeSlide) : t(adminI18n.heroSlides.inactiveSlide)}
                          </span>
                        </label>
                      </div>

                      {/* Live Preview */}
                      {slide.backgroundImage && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                            {t(adminI18n.heroSlides.preview)}
                          </p>
                          <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={slide.backgroundImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
                            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                              <div className="space-y-2">
                                <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white font-display leading-tight drop-shadow">
                                  {slide.title?.[lang] || slide.title?.en || "…"}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto drop-shadow">
                                  {slide.subtitle?.[lang] || slide.subtitle?.en || "…"}
                                </p>
                                {(slide.ctaText?.en || slide.ctaText?.ar) && (
                                  <span className="inline-block mt-1 px-4 py-1.5 bg-primary rounded-full text-white text-xs font-semibold">
                                    {slide.ctaText?.[lang] || slide.ctaText?.en || "CTA"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Save bar */}
        {slides.length > 0 && (
          <div className="flex items-center justify-end pt-2 pb-8">
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="px-8 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? t(adminI18n.common.saving) : t(adminI18n.heroSlides.saveSlides)}
            </button>
          </div>
        )}
      </div>

      <DeleteConfirm
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={removeSlide}
        title={t(adminI18n.heroSlides.deleteTitle)}
        message={t(adminI18n.heroSlides.deleteMessage)}
      />
    </>
  );
}
