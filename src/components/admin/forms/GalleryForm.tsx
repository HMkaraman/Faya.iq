"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUpload from "@/components/admin/ImageUpload";
import { validate, gallerySchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export interface GalleryFormData {
  title: { en: string; ar: string };
  category: string;
  type: "before-after" | "showcase";
  beforeImage: string;
  afterImage: string;
  images: string[];
  doctor: { en: string; ar: string };
  sessions: number;
  tags: { en: string; ar: string }[];
  active: boolean;
}

const emptyForm: GalleryFormData = {
  title: { en: "", ar: "" },
  category: "",
  type: "before-after",
  beforeImage: "",
  afterImage: "",
  images: [],
  doctor: { en: "", ar: "" },
  sessions: 1,
  tags: [],
  active: true,
};

interface GalleryFormProps {
  initialData?: GalleryFormData;
  onSubmit: (data: GalleryFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function GalleryForm({ initialData, onSubmit, isSubmitting }: GalleryFormProps) {
  const [form, setForm] = useState<GalleryFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;
  const { t } = useLanguage();

  useUnsavedChanges(isDirty);

  const categoryOptions = [
    { value: "Skin Care", label: adminI18n.galleryForm.skinCare },
    { value: "Hair Transplant", label: adminI18n.galleryForm.hairTransplant },
    { value: "Injectables", label: adminI18n.galleryForm.injectables },
    { value: "Laser", label: adminI18n.galleryForm.laser },
    { value: "Body Contouring", label: adminI18n.galleryForm.bodyContouring },
  ];

  function updateForm<K extends keyof GalleryFormData>(key: K, value: GalleryFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function addTag() {
    setForm((prev) => ({ ...prev, tags: [...prev.tags, { en: "", ar: "" }] }));
  }

  function removeTag(index: number) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  }

  function updateTag(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? { ...tag, [lang]: value } : tag)),
    }));
  }

  function addImage() {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function updateImage(index: number, url: string) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? url : img)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form as unknown as Record<string, unknown>, gallerySchema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.galleryForm.basicInfo)}</h2>

        <BilingualInput label={t(adminI18n.common.title)} nameEn="title_en" nameAr="title_ar" valueEn={form.title.en} valueAr={form.title.ar} onChangeEn={(v) => updateForm("title", { ...form.title, en: v })} onChangeAr={(v) => updateForm("title", { ...form.title, ar: v })} required />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label={t(adminI18n.common.category)} required error={errors.category}>
            <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">{t(adminI18n.galleryForm.selectCategory)}</option>
              {categoryOptions.map((cat) => <option key={cat.value} value={cat.value}>{t(cat.label)}</option>)}
            </select>
          </FormField>

          <FormField label={t(adminI18n.galleryForm.type)}>
            <select value={form.type} onChange={(e) => updateForm("type", e.target.value as GalleryFormData["type"])} className={`${inputClass} bg-white`}>
              <option value="before-after">{t(adminI18n.galleryForm.beforeAfter)}</option>
              <option value="showcase">{t(adminI18n.galleryForm.showcase)}</option>
            </select>
          </FormField>
        </div>

        <BilingualInput label={t(adminI18n.galleryForm.doctor)} nameEn="doctor_en" nameAr="doctor_ar" valueEn={form.doctor.en} valueAr={form.doctor.ar} onChangeEn={(v) => updateForm("doctor", { ...form.doctor, en: v })} onChangeAr={(v) => updateForm("doctor", { ...form.doctor, ar: v })} />

        <FormField label={t(adminI18n.galleryForm.sessions)}>
          <input type="number" min={1} value={form.sessions} onChange={(e) => updateForm("sessions", parseInt(e.target.value) || 1)} className={inputClass} />
        </FormField>

        <FormField label={t(adminI18n.common.status)}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => updateForm("active", e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            <span className="ml-3 text-sm text-gray-600">{form.active ? t(adminI18n.common.active) : t(adminI18n.common.inactive)}</span>
          </label>
        </FormField>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.galleryForm.images)}</h2>

        {form.type === "before-after" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUpload label={t(adminI18n.galleryForm.beforeImage)} value={form.beforeImage} onChange={(url) => updateForm("beforeImage", url)} />
            <ImageUpload label={t(adminI18n.galleryForm.afterImage)} value={form.afterImage} onChange={(url) => updateForm("afterImage", url)} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{t(adminI18n.galleryForm.showcaseImages)}</p>
              <button type="button" onClick={addImage} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-[16px]">add</span>
                {t(adminI18n.galleryForm.addImage)}
              </button>
            </div>
            {form.images.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">{t(adminI18n.galleryForm.noImages)}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.images.map((img, index) => (
                <div key={index} className="relative">
                  <ImageUpload value={img} onChange={(url) => updateImage(index, url)} label={`${t(adminI18n.galleryForm.imageLabel)} ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={t(adminI18n.common.remove)}>
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.common.tags)}</h2>
          <button type="button" onClick={addTag} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.galleryForm.addTag)}
          </button>
        </div>
        {form.tags.length === 0 && <p className="text-sm text-gray-400 text-center py-4">{t(adminI18n.galleryForm.noTags)}</p>}
        {form.tags.map((tag, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.common.english)}</label>
                <input type="text" value={tag.en} onChange={(e) => updateTag(index, "en", e.target.value)} placeholder={t(adminI18n.galleryForm.tagEnPlaceholder)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.common.arabic)}</label>
                <input type="text" value={tag.ar} onChange={(e) => updateTag(index, "ar", e.target.value)} placeholder={t(adminI18n.galleryForm.tagArPlaceholder)} dir="rtl" className={inputClass} style={{ fontFamily: "var(--font-arabic)" }} />
              </div>
            </div>
            <button type="button" onClick={() => removeTag(index)} className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={t(adminI18n.galleryForm.removeTag)}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/admin/gallery" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{t(adminI18n.common.cancel)}</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isSubmitting ? (isEditing ? t(adminI18n.common.saving) : t(adminI18n.common.creating)) : (isEditing ? t(adminI18n.common.saveChanges) : t(adminI18n.galleryForm.createItem))}
        </button>
      </div>
    </form>
  );
}
