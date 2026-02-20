"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { validate, testimonialSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
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
}

export default function TestimonialForm({ initialData, onSubmit, isSubmitting }: TestimonialFormProps) {
  const [form, setForm] = useState<TestimonialFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [branches, setBranches] = useState<Branch[]>([]);
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Client Information</h2>
        <BilingualInput label="Name" nameEn="name_en" nameAr="name_ar" valueEn={form.name.en} valueAr={form.name.ar} onChangeEn={(v) => updateForm("name", { ...form.name, en: v })} onChangeAr={(v) => updateForm("name", { ...form.name, ar: v })} required />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        <BilingualInput label="Service" nameEn="service_en" nameAr="service_ar" valueEn={form.service.en} valueAr={form.service.ar} onChangeEn={(v) => updateForm("service", { ...form.service, en: v })} onChangeAr={(v) => updateForm("service", { ...form.service, ar: v })} />
        <FormField label="Branch">
          <select value={form.branch} onChange={(e) => updateForm("branch", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
            <option value="">Select branch...</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name.en}</option>)}
          </select>
        </FormField>
        <ImageUpload label="Client Image" value={form.image} onChange={(url) => updateForm("image", url)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Testimonial</h2>
        <FormField label="Rating">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => updateForm("rating", star)} className={`text-2xl transition-colors ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">{form.rating}/5</span>
          </div>
        </FormField>
        <BilingualTextarea label="Text" nameEn="text_en" nameAr="text_ar" valueEn={form.text.en} valueAr={form.text.ar} onChangeEn={(v) => updateForm("text", { ...form.text, en: v })} onChangeAr={(v) => updateForm("text", { ...form.text, ar: v })} rows={4} />
        {errors.text && <p className="text-sm text-red-500">{errors.text}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/admin/testimonials" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Testimonial")}
        </button>
      </div>
    </form>
  );
}
