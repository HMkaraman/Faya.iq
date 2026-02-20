"use client";

import React, { useEffect, useState, useRef } from "react";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { validate, testimonialSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { Branch } from "@/types";

export interface TestimonialFormData {
  name: { en: string; ar: string };
  service: { en: string; ar: string };
  branch: string;
  rating: number;
  text: { en: string; ar: string };
  image: string;
}

const emptyForm: TestimonialFormData = {
  name: { en: "", ar: "" }, service: { en: "", ar: "" }, branch: "",
  rating: 5, text: { en: "", ar: "" }, image: "",
};

interface TestimonialFormProps {
  initialData?: TestimonialFormData;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  isSubmitting: boolean;
  formId?: string;
}

export default function TestimonialForm({ initialData, onSubmit, isSubmitting, formId }: TestimonialFormProps) {
  const [form, setForm] = useState<TestimonialFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [branches, setBranches] = useState<Branch[]>([]);
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;
  const { t } = useLanguage();

  useUnsavedChanges(isDirty);

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then(setBranches).catch(() => {});
  }, []);

  function updateForm<K extends keyof TestimonialFormData>(key: K, value: TestimonialFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form as unknown as Record<string, unknown>, testimonialSchema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.testimonialForm.clientInfo)}</h2>
        <BilingualInput label={t(adminI18n.common.name)} nameEn="name_en" nameAr="name_ar" valueEn={form.name.en} valueAr={form.name.ar} onChangeEn={(v) => updateForm("name", { ...form.name, en: v })} onChangeAr={(v) => updateForm("name", { ...form.name, ar: v })} required />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        <BilingualInput label={t(adminI18n.common.service)} nameEn="service_en" nameAr="service_ar" valueEn={form.service.en} valueAr={form.service.ar} onChangeEn={(v) => updateForm("service", { ...form.service, en: v })} onChangeAr={(v) => updateForm("service", { ...form.service, ar: v })} />
        <FormField label={t(adminI18n.common.branch)}>
          <select value={form.branch} onChange={(e) => updateForm("branch", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
            <option value="">{t(adminI18n.testimonialForm.selectBranch)}</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name.en}</option>)}
          </select>
        </FormField>
        <ImageUpload label={t(adminI18n.testimonialForm.clientImage)} value={form.image} onChange={(url) => updateForm("image", url)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.testimonialForm.testimonial)}</h2>
        <FormField label={t(adminI18n.common.rating)}>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => updateForm("rating", star)} className={`text-2xl transition-colors ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">{form.rating}/5</span>
          </div>
        </FormField>
        <BilingualTextarea label={t(adminI18n.testimonialForm.text)} nameEn="text_en" nameAr="text_ar" valueEn={form.text.en} valueAr={form.text.ar} onChangeEn={(v) => updateForm("text", { ...form.text, en: v })} onChangeAr={(v) => updateForm("text", { ...form.text, ar: v })} rows={4} />
        {errors.text && <p className="text-sm text-red-500">{errors.text}</p>}
      </div>

    </form>
  );
}
