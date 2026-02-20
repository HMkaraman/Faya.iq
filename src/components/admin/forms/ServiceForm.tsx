"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/ToastProvider";
import { validate, serviceSchema } from "@/lib/validation";
import type { ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { ServiceCategory, Branch } from "@/types";

export interface ServiceFormData {
  slug: string;
  category: string;
  categorySlug: string;
  name: { en: string; ar: string };
  shortDescription: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  image: string;
  tags: string[];
  branches: string[];
  duration: string;
  priceRange: { en: string; ar: string };
  benefits: { en: string[]; ar: string[] };
  steps: { en: string[]; ar: string[] };
  downtime: { en: string; ar: string };
  faq: { question: { en: string; ar: string }; answer: { en: string; ar: string } }[];
  beforeAfterPairs: {
    id: string;
    beforeImage: string;
    afterImage: string;
    caption?: { en: string; ar: string };
  }[];
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isSubmitting: boolean;
}

const emptyForm: ServiceFormData = {
  slug: "",
  category: "",
  categorySlug: "",
  name: { en: "", ar: "" },
  shortDescription: { en: "", ar: "" },
  description: { en: "", ar: "" },
  icon: "",
  image: "",
  tags: [],
  branches: [],
  duration: "",
  priceRange: { en: "", ar: "" },
  benefits: { en: [""], ar: [""] },
  steps: { en: [""], ar: [""] },
  downtime: { en: "", ar: "" },
  faq: [],
  beforeAfterPairs: [],
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function generateId(): string {
  return `pair-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function ServiceForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ServiceFormProps) {
  const [form, setForm] = useState<ServiceFormData>(initialData ?? emptyForm);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const initialDataRef = useRef(initialData);
  const { toast } = useToast();
  const { t } = useLanguage();

  useUnsavedChanges(isDirty);

  // Load categories and branches
  useEffect(() => {
    fetch("/api/service-categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => toast("Failed to load categories", "error"));

    fetch("/api/branches")
      .then((r) => r.json())
      .then(setAllBranches)
      .catch(() => toast("Failed to load branches", "error"));
  }, [toast]);

  // Populate form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && initialData !== initialDataRef.current) {
      setForm(initialData);
      initialDataRef.current = initialData;
    }
  }, [initialData]);

  function updateForm<K extends keyof ServiceFormData>(
    key: K,
    value: ServiceFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    // Clear error for the field when the user edits it
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  // --- Category ---
  function handleCategoryChange(slug: string) {
    const cat = categories.find((c) => c.slug === slug);
    setForm((prev) => ({
      ...prev,
      categorySlug: slug,
      category: cat?.name.en || "",
    }));
    setIsDirty(true);
    if (errors.categorySlug) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.categorySlug;
        return next;
      });
    }
  }

  // --- Branches ---
  function handleBranchToggle(branchId: string) {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter((b) => b !== branchId)
        : [...prev.branches, branchId],
    }));
    setIsDirty(true);
  }

  // --- Benefits ---
  function addBenefitRow() {
    setForm((prev) => ({
      ...prev,
      benefits: {
        en: [...prev.benefits.en, ""],
        ar: [...prev.benefits.ar, ""],
      },
    }));
    setIsDirty(true);
  }

  function removeBenefitRow(index: number) {
    setForm((prev) => ({
      ...prev,
      benefits: {
        en: prev.benefits.en.filter((_, i) => i !== index),
        ar: prev.benefits.ar.filter((_, i) => i !== index),
      },
    }));
    setIsDirty(true);
  }

  function updateBenefit(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [lang]: prev.benefits[lang].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
    setIsDirty(true);
  }

  // --- Steps ---
  function addStepRow() {
    setForm((prev) => ({
      ...prev,
      steps: {
        en: [...prev.steps.en, ""],
        ar: [...prev.steps.ar, ""],
      },
    }));
    setIsDirty(true);
  }

  function removeStepRow(index: number) {
    setForm((prev) => ({
      ...prev,
      steps: {
        en: prev.steps.en.filter((_, i) => i !== index),
        ar: prev.steps.ar.filter((_, i) => i !== index),
      },
    }));
    setIsDirty(true);
  }

  function updateStep(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        [lang]: prev.steps[lang].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
    setIsDirty(true);
  }

  // --- Before & After Pairs ---
  function addBeforeAfterPair() {
    setForm((prev) => ({
      ...prev,
      beforeAfterPairs: [
        ...prev.beforeAfterPairs,
        {
          id: generateId(),
          beforeImage: "",
          afterImage: "",
          caption: { en: "", ar: "" },
        },
      ],
    }));
    setIsDirty(true);
  }

  function removeBeforeAfterPair(index: number) {
    setForm((prev) => ({
      ...prev,
      beforeAfterPairs: prev.beforeAfterPairs.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }

  function updateBeforeAfterPair(
    index: number,
    field: "beforeImage" | "afterImage",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      beforeAfterPairs: prev.beforeAfterPairs.map((pair, i) =>
        i === index ? { ...pair, [field]: value } : pair
      ),
    }));
    setIsDirty(true);
  }

  function updateBeforeAfterCaption(
    index: number,
    lang: "en" | "ar",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      beforeAfterPairs: prev.beforeAfterPairs.map((pair, i) =>
        i === index
          ? {
              ...pair,
              caption: {
                en: lang === "en" ? value : pair.caption?.en || "",
                ar: lang === "ar" ? value : pair.caption?.ar || "",
              },
            }
          : pair
      ),
    }));
    setIsDirty(true);
  }

  // --- FAQ ---
  function addFaqRow() {
    setForm((prev) => ({
      ...prev,
      faq: [
        ...prev.faq,
        {
          question: { en: "", ar: "" },
          answer: { en: "", ar: "" },
        },
      ],
    }));
    setIsDirty(true);
  }

  function removeFaqRow(index: number) {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }

  function updateFaq(
    index: number,
    field: "question" | "answer",
    lang: "en" | "ar",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) =>
        i === index
          ? { ...item, [field]: { ...item[field], [lang]: value } }
          : item
      ),
    }));
    setIsDirty(true);
  }

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Run validation
    const validationErrors = validate(
      {
        name: form.name,
        categorySlug: form.categorySlug,
        slug: form.slug,
      },
      serviceSchema
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast("Please fix the validation errors before submitting", "error");
      return;
    }

    setErrors({});
    await onSubmit(form);
    setIsDirty(false);
  }

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">
          {t(adminI18n.serviceForm.basicInfo)}
        </h2>

        <FormField label={t(adminI18n.common.slug)} required error={errors.slug}>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateForm("slug", e.target.value)}
            placeholder={t(adminI18n.serviceForm.slugPlaceholder)}
            className={inputClass}
          />
        </FormField>

        <FormField label={t(adminI18n.common.category)} required error={errors.categorySlug}>
          <select
            value={form.categorySlug}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={`${inputClass} bg-white`}
          >
            <option value="">{t(adminI18n.serviceForm.selectCategory)}</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name.en}
              </option>
            ))}
          </select>
        </FormField>

        <BilingualInput
          label={t(adminI18n.common.name)}
          nameEn="name_en"
          nameAr="name_ar"
          valueEn={form.name.en}
          valueAr={form.name.ar}
          onChangeEn={(v) => updateForm("name", { ...form.name, en: v })}
          onChangeAr={(v) => updateForm("name", { ...form.name, ar: v })}
          required
          error={errors.name}
        />

        <BilingualInput
          label={t(adminI18n.serviceForm.shortDescription)}
          nameEn="shortDesc_en"
          nameAr="shortDesc_ar"
          valueEn={form.shortDescription.en}
          valueAr={form.shortDescription.ar}
          onChangeEn={(v) =>
            updateForm("shortDescription", {
              ...form.shortDescription,
              en: v,
            })
          }
          onChangeAr={(v) =>
            updateForm("shortDescription", {
              ...form.shortDescription,
              ar: v,
            })
          }
        />

        <BilingualTextarea
          label={t(adminI18n.common.description)}
          nameEn="desc_en"
          nameAr="desc_ar"
          valueEn={form.description.en}
          valueAr={form.description.ar}
          onChangeEn={(v) =>
            updateForm("description", { ...form.description, en: v })
          }
          onChangeAr={(v) =>
            updateForm("description", { ...form.description, ar: v })
          }
        />

        <FormField label={t(adminI18n.common.icon)}>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => updateForm("icon", e.target.value)}
            placeholder={t(adminI18n.serviceForm.iconPlaceholder)}
            className={inputClass}
          />
        </FormField>

        <ImageUpload
          label={t(adminI18n.common.image)}
          value={form.image}
          onChange={(url) => updateForm("image", url)}
        />
      </div>

      {/* Tags & Branches */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">
          {t(adminI18n.serviceForm.tagsBranches)}
        </h2>

        <FormField label={t(adminI18n.common.tags)}>
          <TagInput
            value={form.tags}
            onChange={(tags) => updateForm("tags", tags)}
            placeholder={t(adminI18n.serviceForm.addTag)}
          />
        </FormField>

        <FormField label={t(adminI18n.sidebar.branches)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allBranches.map((branch) => (
              <label
                key={branch.id}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={form.branches.includes(branch.id)}
                  onChange={() => handleBranchToggle(branch.id)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {branch.name.en}
                </span>
              </label>
            ))}
          </div>
        </FormField>
      </div>

      {/* Duration & Pricing */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">
          {t(adminI18n.serviceForm.durationPricing)}
        </h2>

        <FormField label={t(adminI18n.services.duration)}>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => updateForm("duration", e.target.value)}
            placeholder={t(adminI18n.serviceForm.durationPlaceholder)}
            className={inputClass}
          />
        </FormField>

        <BilingualInput
          label={t(adminI18n.serviceForm.priceRange)}
          nameEn="price_en"
          nameAr="price_ar"
          valueEn={form.priceRange.en}
          valueAr={form.priceRange.ar}
          onChangeEn={(v) =>
            updateForm("priceRange", { ...form.priceRange, en: v })
          }
          onChangeAr={(v) =>
            updateForm("priceRange", { ...form.priceRange, ar: v })
          }
        />

        <BilingualInput
          label={t(adminI18n.serviceForm.downtime)}
          nameEn="downtime_en"
          nameAr="downtime_ar"
          valueEn={form.downtime.en}
          valueAr={form.downtime.ar}
          onChangeEn={(v) =>
            updateForm("downtime", { ...form.downtime, en: v })
          }
          onChangeAr={(v) =>
            updateForm("downtime", { ...form.downtime, ar: v })
          }
        />
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.serviceForm.benefits)}</h2>
          <button
            type="button"
            onClick={addBenefitRow}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.common.addRow)}
          </button>
        </div>

        {form.benefits.en.map((_, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {t(adminI18n.common.english)}
                </label>
                <textarea
                  value={form.benefits.en[index]}
                  onChange={(e) => updateBenefit(index, "en", e.target.value)}
                  placeholder={t(adminI18n.serviceForm.benefitEnPlaceholder)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {t(adminI18n.common.arabic)}
                </label>
                <textarea
                  value={form.benefits.ar[index] || ""}
                  onChange={(e) => updateBenefit(index, "ar", e.target.value)}
                  placeholder={t(adminI18n.serviceForm.benefitArPlaceholder)}
                  dir="rtl"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  style={{ fontFamily: "var(--font-arabic)" }}
                />
              </div>
            </div>
            {form.benefits.en.length > 1 && (
              <button
                type="button"
                onClick={() => removeBenefitRow(index)}
                className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={t(adminI18n.serviceForm.removeRow)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.serviceForm.steps)}</h2>
          <button
            type="button"
            onClick={addStepRow}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.common.addRow)}
          </button>
        </div>

        {form.steps.en.map((_, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 mt-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              {index + 1}
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {t(adminI18n.common.english)}
                </label>
                <textarea
                  value={form.steps.en[index]}
                  onChange={(e) => updateStep(index, "en", e.target.value)}
                  placeholder={t(adminI18n.serviceForm.stepEnPlaceholder)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {t(adminI18n.common.arabic)}
                </label>
                <textarea
                  value={form.steps.ar[index] || ""}
                  onChange={(e) => updateStep(index, "ar", e.target.value)}
                  placeholder={t(adminI18n.serviceForm.stepArPlaceholder)}
                  dir="rtl"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  style={{ fontFamily: "var(--font-arabic)" }}
                />
              </div>
            </div>
            {form.steps.en.length > 1 && (
              <button
                type="button"
                onClick={() => removeStepRow(index)}
                className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={t(adminI18n.serviceForm.removeRow)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Before & After Gallery */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {t(adminI18n.serviceForm.beforeAfterGallery)}
          </h2>
          <button
            type="button"
            onClick={addBeforeAfterPair}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.serviceForm.addPair)}
          </button>
        </div>

        {form.beforeAfterPairs.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            {t(adminI18n.serviceForm.noPairs)}
          </p>
        )}

        {form.beforeAfterPairs.map((pair, index) => (
          <div
            key={pair.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t(adminI18n.serviceForm.pairLabel)} #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeBeforeAfterPair(index)}
                className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={t(adminI18n.serviceForm.removePair)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  {t(adminI18n.serviceForm.beforeImage)}
                </label>
                <ImageUpload
                  value={pair.beforeImage}
                  onChange={(url) =>
                    updateBeforeAfterPair(index, "beforeImage", url)
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  {t(adminI18n.serviceForm.afterImage)}
                </label>
                <ImageUpload
                  value={pair.afterImage}
                  onChange={(url) =>
                    updateBeforeAfterPair(index, "afterImage", url)
                  }
                />
              </div>
            </div>

            <BilingualInput
              label={t(adminI18n.serviceForm.captionOptional)}
              nameEn={`ba_caption_en_${index}`}
              nameAr={`ba_caption_ar_${index}`}
              valueEn={pair.caption?.en || ""}
              valueAr={pair.caption?.ar || ""}
              onChangeEn={(v) => updateBeforeAfterCaption(index, "en", v)}
              onChangeAr={(v) => updateBeforeAfterCaption(index, "ar", v)}
            />
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.serviceForm.faq)}</h2>
          <button
            type="button"
            onClick={addFaqRow}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t(adminI18n.serviceForm.addFaq)}
          </button>
        </div>

        {form.faq.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            {t(adminI18n.serviceForm.noFaq)}
          </p>
        )}

        {form.faq.map((faqItem, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t(adminI18n.serviceForm.faqLabel)} #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeFaqRow(index)}
                className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={t(adminI18n.serviceForm.removeFaq)}
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <BilingualInput
              label={t(adminI18n.serviceForm.question)}
              nameEn={`faq_q_en_${index}`}
              nameAr={`faq_q_ar_${index}`}
              valueEn={faqItem.question.en}
              valueAr={faqItem.question.ar}
              onChangeEn={(v) => updateFaq(index, "question", "en", v)}
              onChangeAr={(v) => updateFaq(index, "question", "ar", v)}
            />

            <BilingualTextarea
              label={t(adminI18n.serviceForm.answer)}
              nameEn={`faq_a_en_${index}`}
              nameAr={`faq_a_ar_${index}`}
              valueEn={faqItem.answer.en}
              valueAr={faqItem.answer.ar}
              onChangeEn={(v) => updateFaq(index, "answer", "en", v)}
              onChangeAr={(v) => updateFaq(index, "answer", "ar", v)}
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Link
          href="/admin/services"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t(adminI18n.common.cancel)}
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSubmitting
            ? isEditing
              ? t(adminI18n.common.saving)
              : t(adminI18n.common.creating)
            : isEditing
              ? t(adminI18n.common.saveChanges)
              : t(adminI18n.serviceForm.createService)}
        </button>
      </div>
    </form>
  );
}
