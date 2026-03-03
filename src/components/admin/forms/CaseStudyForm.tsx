"use client";

import React, { useEffect, useState, useRef } from "react";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { validate, caseStudySchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { ServiceCategory } from "@/types";

interface StageData {
  id: string;
  date: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
}

export interface CaseStudyFormData {
  slug: string;
  title: { en: string; ar: string };
  summary: { en: string; ar: string };
  serviceId: string;
  categorySlug: string;
  doctor: { en: string; ar: string };
  stages: StageData[];
  tags: { en: string; ar: string }[];
  active: boolean;
}

const emptyForm: CaseStudyFormData = {
  slug: "",
  title: { en: "", ar: "" },
  summary: { en: "", ar: "" },
  serviceId: "",
  categorySlug: "",
  doctor: { en: "", ar: "" },
  stages: [],
  tags: [],
  active: true,
};

interface CaseStudyFormProps {
  initialData?: CaseStudyFormData;
  onSubmit: (data: CaseStudyFormData) => Promise<void>;
  isSubmitting: boolean;
  formId?: string;
}

function generateStageId(): string {
  return `stage-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function CaseStudyForm({ initialData, onSubmit, isSubmitting, formId }: CaseStudyFormProps) {
  const [form, setForm] = useState<CaseStudyFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const { t } = useLanguage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useUnsavedChanges(isDirty);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices).catch(() => {});
    fetch("/api/service-categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  function updateForm<K extends keyof CaseStudyFormData>(key: K, value: CaseStudyFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  // --- Tags ---
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

  // --- Stages ---
  function addStage() {
    setForm((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        { id: generateStageId(), date: "", title: { en: "", ar: "" }, description: { en: "", ar: "" }, images: [] },
      ],
    }));
  }
  function removeStage(index: number) {
    setForm((prev) => ({ ...prev, stages: prev.stages.filter((_, i) => i !== index) }));
  }
  function updateStage<K extends keyof StageData>(index: number, field: K, value: StageData[K]) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }
  function addStageImage(stageIndex: number) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((s, i) => (i === stageIndex ? { ...s, images: [...s.images, ""] } : s)),
    }));
  }
  function removeStageImage(stageIndex: number, imgIndex: number) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((s, i) =>
        i === stageIndex ? { ...s, images: s.images.filter((_, j) => j !== imgIndex) } : s
      ),
    }));
  }
  function updateStageImage(stageIndex: number, imgIndex: number, url: string) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((s, i) =>
        i === stageIndex ? { ...s, images: s.images.map((img, j) => (j === imgIndex ? url : img)) } : s
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate({ title: form.title, slug: form.slug, serviceId: form.serviceId } as unknown as Record<string, unknown>, caseStudySchema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.caseStudyForm.basicInfo)}</h2>

        <BilingualInput label={t(adminI18n.common.title)} nameEn="title_en" nameAr="title_ar" valueEn={form.title.en} valueAr={form.title.ar} onChangeEn={(v) => updateForm("title", { ...form.title, en: v })} onChangeAr={(v) => updateForm("title", { ...form.title, ar: v })} required />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

        <FormField label={t(adminI18n.common.slug)} required error={errors.slug}>
          <input type="text" value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} placeholder={t(adminI18n.caseStudyForm.slugPlaceholder)} className={inputClass} />
        </FormField>

        <BilingualTextarea label={t(adminI18n.caseStudyForm.summary)} nameEn="summary_en" nameAr="summary_ar" valueEn={form.summary.en} valueAr={form.summary.ar} onChangeEn={(v) => updateForm("summary", { ...form.summary, en: v })} onChangeAr={(v) => updateForm("summary", { ...form.summary, ar: v })} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label={t(adminI18n.common.service)} required error={errors.serviceId}>
            <select value={form.serviceId} onChange={(e) => updateForm("serviceId", e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">{t(adminI18n.caseStudyForm.selectService)}</option>
              {services.map((svc: any) => <option key={svc.id} value={svc.id}>{svc.name?.en || svc.id}</option>)}
            </select>
          </FormField>

          <FormField label={t(adminI18n.common.category)}>
            <select value={form.categorySlug} onChange={(e) => updateForm("categorySlug", e.target.value)} className={`${inputClass} bg-white`}>
              <option value="">{t(adminI18n.caseStudyForm.selectCategory)}</option>
              {categories.map((cat) => <option key={cat.slug} value={cat.slug}>{cat.name.en}</option>)}
            </select>
          </FormField>
        </div>

        <BilingualInput label={t(adminI18n.caseStudyForm.doctor)} nameEn="doctor_en" nameAr="doctor_ar" valueEn={form.doctor.en} valueAr={form.doctor.ar} onChangeEn={(v) => updateForm("doctor", { ...form.doctor, en: v })} onChangeAr={(v) => updateForm("doctor", { ...form.doctor, ar: v })} />

        <FormField label={t(adminI18n.common.status)}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => updateForm("active", e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            <span className="ml-3 text-sm text-gray-600">{form.active ? t(adminI18n.common.active) : t(adminI18n.common.inactive)}</span>
          </label>
        </FormField>
      </div>

      {/* Stages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.caseStudyForm.stagesSection)}</h2>
          <button type="button" onClick={addStage} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.caseStudyForm.addStage)}
          </button>
        </div>

        {form.stages.length === 0 && <p className="text-sm text-gray-400 text-center py-4">{t(adminI18n.caseStudyForm.noStages)}</p>}

        {form.stages.map((stage, idx) => (
          <div key={stage.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{t(adminI18n.caseStudyForm.stageLabel)} #{idx + 1}</span>
              <button type="button" onClick={() => removeStage(idx)} className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={t(adminI18n.caseStudyForm.removeStage)}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <FormField label={t(adminI18n.caseStudyForm.stageDate)}>
              <input type="date" value={stage.date} onChange={(e) => updateStage(idx, "date", e.target.value)} className={inputClass} />
            </FormField>

            <BilingualInput label={t(adminI18n.caseStudyForm.stageTitle)} nameEn={`stage_title_en_${idx}`} nameAr={`stage_title_ar_${idx}`} valueEn={stage.title.en} valueAr={stage.title.ar} onChangeEn={(v) => updateStage(idx, "title", { ...stage.title, en: v })} onChangeAr={(v) => updateStage(idx, "title", { ...stage.title, ar: v })} />

            <BilingualTextarea label={t(adminI18n.caseStudyForm.stageDescription)} nameEn={`stage_desc_en_${idx}`} nameAr={`stage_desc_ar_${idx}`} valueEn={stage.description.en} valueAr={stage.description.ar} onChangeEn={(v) => updateStage(idx, "description", { ...stage.description, en: v })} onChangeAr={(v) => updateStage(idx, "description", { ...stage.description, ar: v })} rows={3} />

            {/* Stage Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{t(adminI18n.caseStudyForm.stageImages)}</label>
                <button type="button" onClick={() => addStageImage(idx)} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  {t(adminI18n.caseStudyForm.addImage)}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage.images.map((img, imgIdx) => (
                  <div key={imgIdx} className="relative">
                    <ImageUpload value={img} onChange={(url) => updateStageImage(idx, imgIdx, url)} label={`${t(adminI18n.common.image)} ${imgIdx + 1}`} />
                    <button type="button" onClick={() => removeStageImage(idx, imgIdx)} className="absolute top-0 right-0 p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={t(adminI18n.common.remove)}>
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.common.tags)}</h2>
          <button type="button" onClick={addTag} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.caseStudyForm.addTag)}
          </button>
        </div>
        {form.tags.length === 0 && <p className="text-sm text-gray-400 text-center py-4">{t(adminI18n.caseStudyForm.noTags)}</p>}
        {form.tags.map((tag, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.common.english)}</label>
                <input type="text" value={tag.en} onChange={(e) => updateTag(index, "en", e.target.value)} placeholder={t(adminI18n.caseStudyForm.tagEnPlaceholder)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.common.arabic)}</label>
                <input type="text" value={tag.ar} onChange={(e) => updateTag(index, "ar", e.target.value)} placeholder={t(adminI18n.caseStudyForm.tagArPlaceholder)} dir="rtl" className={inputClass} style={{ fontFamily: "var(--font-arabic)" }} />
              </div>
            </div>
            <button type="button" onClick={() => removeTag(index)} className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={t(adminI18n.caseStudyForm.removeTag)}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
