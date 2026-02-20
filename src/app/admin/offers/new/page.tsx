"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/ToastProvider";

interface OfferForm {
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

const emptyForm: OfferForm = {
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

export default function NewOfferPage() {
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function updateForm<K extends keyof OfferForm>(key: K, value: OfferForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.en || !form.title.ar) {
      toast("Offer title is required in both languages", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create offer");
      }

      toast("Offer created successfully", "success");
      router.push("/admin/offers");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create offer", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopBar title="Add Offer">
        <Link
          href="/admin/offers"
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

            <BilingualInput
              label="Title"
              nameEn="title_en"
              nameAr="title_ar"
              valueEn={form.title.en}
              valueAr={form.title.ar}
              onChangeEn={(v) => updateForm("title", { ...form.title, en: v })}
              onChangeAr={(v) => updateForm("title", { ...form.title, ar: v })}
              required
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

            <ImageUpload
              label="Image"
              value={form.image}
              onChange={(url) => updateForm("image", url)}
            />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Pricing</h2>

            <FormField label="Discount">
              <input
                type="text"
                value={form.discount}
                onChange={(e) => updateForm("discount", e.target.value)}
                placeholder="e.g. 30%, Buy 1 Get 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

            <BilingualInput
              label="Original Price"
              nameEn="originalPrice_en"
              nameAr="originalPrice_ar"
              valueEn={form.originalPrice.en}
              valueAr={form.originalPrice.ar}
              onChangeEn={(v) => updateForm("originalPrice", { ...form.originalPrice, en: v })}
              onChangeAr={(v) => updateForm("originalPrice", { ...form.originalPrice, ar: v })}
            />

            <BilingualInput
              label="Sale Price"
              nameEn="salePrice_en"
              nameAr="salePrice_ar"
              valueEn={form.salePrice.en}
              valueAr={form.salePrice.ar}
              onChangeEn={(v) => updateForm("salePrice", { ...form.salePrice, en: v })}
              onChangeAr={(v) => updateForm("salePrice", { ...form.salePrice, ar: v })}
            />
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Details</h2>

            <FormField label="Valid Until">
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => updateForm("validUntil", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

            <BilingualInput
              label="Branches"
              nameEn="branches_en"
              nameAr="branches_ar"
              valueEn={form.branches.en}
              valueAr={form.branches.ar}
              onChangeEn={(v) => updateForm("branches", { ...form.branches, en: v })}
              onChangeAr={(v) => updateForm("branches", { ...form.branches, ar: v })}
            />

            <BilingualInput
              label="Tag"
              nameEn="tag_en"
              nameAr="tag_ar"
              valueEn={form.tag.en}
              valueAr={form.tag.ar}
              onChangeEn={(v) => updateForm("tag", { ...form.tag, en: v })}
              onChangeAr={(v) => updateForm("tag", { ...form.tag, ar: v })}
            />

            <FormField label="Active">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => updateForm("active", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#c8567e]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c8567e]" />
                <span className="ml-3 text-sm text-gray-600">
                  {form.active ? "Active" : "Inactive"}
                </span>
              </label>
            </FormField>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <Link
              href="/admin/offers"
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
              {submitting ? "Creating..." : "Create Offer"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
