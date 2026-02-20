"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/ToastProvider";
import type { ServiceCategory, Branch } from "@/types";

interface ServiceForm {
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
}

const emptyForm: ServiceForm = {
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
};

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const [serviceRes, catsRes, branchesRes] = await Promise.all([
          fetch(`/api/services/${id}`),
          fetch("/api/service-categories"),
          fetch("/api/branches"),
        ]);

        if (!serviceRes.ok) throw new Error("Service not found");

        const service = await serviceRes.json();
        const cats = await catsRes.json();
        const branches = await branchesRes.json();

        setCategories(cats);
        setAllBranches(branches);

        setForm({
          slug: service.slug || "",
          category: service.category || "",
          categorySlug: service.categorySlug || "",
          name: service.name || { en: "", ar: "" },
          shortDescription: service.shortDescription || { en: "", ar: "" },
          description: service.description || { en: "", ar: "" },
          icon: service.icon || "",
          image: service.image || "",
          tags: service.tags || [],
          branches: service.branches || [],
          duration: service.duration || "",
          priceRange: service.priceRange || { en: "", ar: "" },
          benefits: {
            en: service.benefits?.en?.length ? service.benefits.en : [""],
            ar: service.benefits?.ar?.length ? service.benefits.ar : [""],
          },
          steps: {
            en: service.steps?.en?.length ? service.steps.en : [""],
            ar: service.steps?.ar?.length ? service.steps.ar : [""],
          },
          downtime: service.downtime || { en: "", ar: "" },
          faq: service.faq || [],
        });
      } catch {
        toast("Failed to load service data", "error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, toast]);

  function updateForm<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCategoryChange(slug: string) {
    const cat = categories.find((c) => c.slug === slug);
    setForm((prev) => ({
      ...prev,
      categorySlug: slug,
      category: cat?.name.en || "",
    }));
  }

  function handleBranchToggle(branchId: string) {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter((b) => b !== branchId)
        : [...prev.branches, branchId],
    }));
  }

  // Benefits management
  function addBenefitRow() {
    setForm((prev) => ({
      ...prev,
      benefits: {
        en: [...prev.benefits.en, ""],
        ar: [...prev.benefits.ar, ""],
      },
    }));
  }

  function removeBenefitRow(index: number) {
    setForm((prev) => ({
      ...prev,
      benefits: {
        en: prev.benefits.en.filter((_, i) => i !== index),
        ar: prev.benefits.ar.filter((_, i) => i !== index),
      },
    }));
  }

  function updateBenefit(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [lang]: prev.benefits[lang].map((item, i) => (i === index ? value : item)),
      },
    }));
  }

  // Steps management
  function addStepRow() {
    setForm((prev) => ({
      ...prev,
      steps: {
        en: [...prev.steps.en, ""],
        ar: [...prev.steps.ar, ""],
      },
    }));
  }

  function removeStepRow(index: number) {
    setForm((prev) => ({
      ...prev,
      steps: {
        en: prev.steps.en.filter((_, i) => i !== index),
        ar: prev.steps.ar.filter((_, i) => i !== index),
      },
    }));
  }

  function updateStep(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        [lang]: prev.steps[lang].map((item, i) => (i === index ? value : item)),
      },
    }));
  }

  // FAQ management
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
  }

  function removeFaqRow(index: number) {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.en || !form.name.ar) {
      toast("Service name is required in both languages", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update service");
      }

      toast("Service updated successfully", "success");
      router.push("/admin/services");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update service", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Edit Service" />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c8567e] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Edit Service">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>

            <FormField label="Slug">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                placeholder="e.g. hydrafacial"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

            <FormField label="Category" required>
              <select
                value={form.categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] bg-white"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name.en}
                  </option>
                ))}
              </select>
            </FormField>

            <BilingualInput
              label="Name"
              nameEn="name_en"
              nameAr="name_ar"
              valueEn={form.name.en}
              valueAr={form.name.ar}
              onChangeEn={(v) => updateForm("name", { ...form.name, en: v })}
              onChangeAr={(v) => updateForm("name", { ...form.name, ar: v })}
              required
            />

            <BilingualInput
              label="Short Description"
              nameEn="shortDesc_en"
              nameAr="shortDesc_ar"
              valueEn={form.shortDescription.en}
              valueAr={form.shortDescription.ar}
              onChangeEn={(v) => updateForm("shortDescription", { ...form.shortDescription, en: v })}
              onChangeAr={(v) => updateForm("shortDescription", { ...form.shortDescription, ar: v })}
            />

            <BilingualTextarea
              label="Description"
              nameEn="desc_en"
              nameAr="desc_ar"
              valueEn={form.description.en}
              valueAr={form.description.ar}
              onChangeEn={(v) => updateForm("description", { ...form.description, en: v })}
              onChangeAr={(v) => updateForm("description", { ...form.description, ar: v })}
            />

            <FormField label="Icon (Material Symbol name)">
              <input
                type="text"
                value={form.icon}
                onChange={(e) => updateForm("icon", e.target.value)}
                placeholder="e.g. face, science, spa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

            <ImageUpload
              label="Image"
              value={form.image}
              onChange={(url) => updateForm("image", url)}
            />
          </div>

          {/* Tags & Branches */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Tags & Branches</h2>

            <FormField label="Tags">
              <TagInput
                value={form.tags}
                onChange={(tags) => updateForm("tags", tags)}
                placeholder="Add a tag and press Enter..."
              />
            </FormField>

            <FormField label="Branches">
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
                      className="w-4 h-4 rounded border-gray-300 text-[#c8567e] focus:ring-[#c8567e]"
                    />
                    <span className="text-sm text-gray-700">{branch.name.en}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </div>

          {/* Duration & Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Duration & Pricing</h2>

            <FormField label="Duration">
              <input
                type="text"
                value={form.duration}
                onChange={(e) => updateForm("duration", e.target.value)}
                placeholder="e.g. 45 min, 1-2 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

            <BilingualInput
              label="Price Range"
              nameEn="price_en"
              nameAr="price_ar"
              valueEn={form.priceRange.en}
              valueAr={form.priceRange.ar}
              onChangeEn={(v) => updateForm("priceRange", { ...form.priceRange, en: v })}
              onChangeAr={(v) => updateForm("priceRange", { ...form.priceRange, ar: v })}
            />

            <BilingualInput
              label="Downtime"
              nameEn="downtime_en"
              nameAr="downtime_ar"
              valueEn={form.downtime.en}
              valueAr={form.downtime.ar}
              onChangeEn={(v) => updateForm("downtime", { ...form.downtime, en: v })}
              onChangeAr={(v) => updateForm("downtime", { ...form.downtime, ar: v })}
            />
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Benefits</h2>
              <button
                type="button"
                onClick={addBenefitRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#c8567e] bg-[#c8567e]/10 rounded-lg hover:bg-[#c8567e]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Row
              </button>
            </div>

            {form.benefits.en.map((_, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">English</label>
                    <textarea
                      value={form.benefits.en[index]}
                      onChange={(e) => updateBenefit(index, "en", e.target.value)}
                      placeholder="Benefit in English..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Arabic</label>
                    <textarea
                      value={form.benefits.ar[index] || ""}
                      onChange={(e) => updateBenefit(index, "ar", e.target.value)}
                      placeholder="...الفائدة بالعربي"
                      dir="rtl"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
                      style={{ fontFamily: "var(--font-arabic)" }}
                    />
                  </div>
                </div>
                {form.benefits.en.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBenefitRow(index)}
                    className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove row"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Steps</h2>
              <button
                type="button"
                onClick={addStepRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#c8567e] bg-[#c8567e]/10 rounded-lg hover:bg-[#c8567e]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Row
              </button>
            </div>

            {form.steps.en.map((_, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 mt-7 rounded-full bg-[#c8567e]/10 text-[#c8567e] flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">English</label>
                    <textarea
                      value={form.steps.en[index]}
                      onChange={(e) => updateStep(index, "en", e.target.value)}
                      placeholder="Step in English..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Arabic</label>
                    <textarea
                      value={form.steps.ar[index] || ""}
                      onChange={(e) => updateStep(index, "ar", e.target.value)}
                      placeholder="...الخطوة بالعربي"
                      dir="rtl"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
                      style={{ fontFamily: "var(--font-arabic)" }}
                    />
                  </div>
                </div>
                {form.steps.en.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStepRow(index)}
                    className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove row"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">FAQ</h2>
              <button
                type="button"
                onClick={addFaqRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#c8567e] bg-[#c8567e]/10 rounded-lg hover:bg-[#c8567e]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add FAQ
              </button>
            </div>

            {form.faq.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No FAQ items yet. Click &quot;Add FAQ&quot; to add one.
              </p>
            )}

            {form.faq.map((faqItem, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    FAQ #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaqRow(index)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove FAQ"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <BilingualInput
                  label="Question"
                  nameEn={`faq_q_en_${index}`}
                  nameAr={`faq_q_ar_${index}`}
                  valueEn={faqItem.question.en}
                  valueAr={faqItem.question.ar}
                  onChangeEn={(v) => updateFaq(index, "question", "en", v)}
                  onChangeAr={(v) => updateFaq(index, "question", "ar", v)}
                />

                <BilingualTextarea
                  label="Answer"
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
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#c8567e] text-white text-sm font-medium rounded-lg hover:bg-[#b34469] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
