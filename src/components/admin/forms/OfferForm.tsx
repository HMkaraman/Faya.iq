"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { validate, offerSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export interface OfferFormData {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  discount: string;
  originalPrice: { en: string; ar: string };
  salePrice: { en: string; ar: string };
  image: string;
  validUntil: string;
  branches: { en: string; ar: string };
  tag: { en: string; ar: string };
  active: boolean;
}

const emptyForm: OfferFormData = {
  title: { en: "", ar: "" },
  description: { en: "", ar: "" },
  discount: "",
  originalPrice: { en: "", ar: "" },
  salePrice: { en: "", ar: "" },
  image: "",
  validUntil: "",
  branches: { en: "", ar: "" },
  tag: { en: "", ar: "" },
  active: true,
};

interface OfferFormProps {
  initialData?: OfferFormData;
  onSubmit: (data: OfferFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function OfferForm({ initialData, onSubmit, isSubmitting }: OfferFormProps) {
  const [form, setForm] = useState<OfferFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;
  const { t } = useLanguage();

  useUnsavedChanges(isDirty);

  function updateForm<K extends keyof OfferFormData>(key: K, value: OfferFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form as unknown as Record<string, unknown>, offerSchema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.offerForm.basicInfo)}</h2>
        <BilingualInput label={t(adminI18n.common.title)} nameEn="title_en" nameAr="title_ar" valueEn={form.title.en} valueAr={form.title.ar} onChangeEn={(v) => updateForm("title", { ...form.title, en: v })} onChangeAr={(v) => updateForm("title", { ...form.title, ar: v })} required />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        <BilingualTextarea label={t(adminI18n.common.description)} nameEn="desc_en" nameAr="desc_ar" valueEn={form.description.en} valueAr={form.description.ar} onChangeEn={(v) => updateForm("description", { ...form.description, en: v })} onChangeAr={(v) => updateForm("description", { ...form.description, ar: v })} />
        <ImageUpload label={t(adminI18n.common.image)} value={form.image} onChange={(url) => updateForm("image", url)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.offerForm.pricing)}</h2>
        <FormField label={t(adminI18n.offers.discount)}>
          <input type="text" value={form.discount} onChange={(e) => updateForm("discount", e.target.value)} placeholder={t(adminI18n.offerForm.discountPlaceholder)} className={inputClass} />
        </FormField>
        <BilingualInput label={t(adminI18n.offerForm.originalPrice)} nameEn="originalPrice_en" nameAr="originalPrice_ar" valueEn={form.originalPrice.en} valueAr={form.originalPrice.ar} onChangeEn={(v) => updateForm("originalPrice", { ...form.originalPrice, en: v })} onChangeAr={(v) => updateForm("originalPrice", { ...form.originalPrice, ar: v })} />
        <BilingualInput label={t(adminI18n.offers.salePrice)} nameEn="salePrice_en" nameAr="salePrice_ar" valueEn={form.salePrice.en} valueAr={form.salePrice.ar} onChangeEn={(v) => updateForm("salePrice", { ...form.salePrice, en: v })} onChangeAr={(v) => updateForm("salePrice", { ...form.salePrice, ar: v })} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.offerForm.details)}</h2>
        <FormField label={t(adminI18n.offers.validUntil)}>
          <input type="date" value={form.validUntil} onChange={(e) => updateForm("validUntil", e.target.value)} className={inputClass} />
        </FormField>
        <BilingualInput label={t(adminI18n.sidebar.branches)} nameEn="branches_en" nameAr="branches_ar" valueEn={form.branches.en} valueAr={form.branches.ar} onChangeEn={(v) => updateForm("branches", { ...form.branches, en: v })} onChangeAr={(v) => updateForm("branches", { ...form.branches, ar: v })} />
        <BilingualInput label={t(adminI18n.offerForm.tag)} nameEn="tag_en" nameAr="tag_ar" valueEn={form.tag.en} valueAr={form.tag.ar} onChangeEn={(v) => updateForm("tag", { ...form.tag, en: v })} onChangeAr={(v) => updateForm("tag", { ...form.tag, ar: v })} />
        <FormField label={t(adminI18n.common.status)}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => updateForm("active", e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            <span className="ml-3 text-sm text-gray-600">{form.active ? t(adminI18n.common.active) : t(adminI18n.common.inactive)}</span>
          </label>
        </FormField>
      </div>

      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/admin/offers" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{t(adminI18n.common.cancel)}</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isSubmitting ? (isEditing ? t(adminI18n.common.saving) : t(adminI18n.common.creating)) : (isEditing ? t(adminI18n.common.saveChanges) : t(adminI18n.offerForm.createOffer))}
        </button>
      </div>
    </form>
  );
}
