"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/ToastProvider";

interface BilingualTag {
  en: string;
  ar: string;
}

interface GalleryForm {
  title: { en: string; ar: string };
  category: string;
  type: "before-after" | "showcase";
  beforeImage: string;
  afterImage: string;
  doctor: { en: string; ar: string };
  sessions: number;
  tags: BilingualTag[];
  active: boolean;
}

const emptyForm: GalleryForm = {
  title: { en: "", ar: "" },
  category: "",
  type: "before-after",
  beforeImage: "",
  afterImage: "",
  doctor: { en: "", ar: "" },
  sessions: 1,
  tags: [],
  active: true,
};

export default function NewGalleryItemPage() {
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function updateForm<K extends keyof GalleryForm>(key: K, value: GalleryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Tag management
  function addTag() {
    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, { en: "", ar: "" }],
    }));
  }

  function removeTag(index: number) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  function updateTag(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) =>
        i === index ? { ...tag, [lang]: value } : tag
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.en || !form.title.ar) {
      toast("Title is required in both languages", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create gallery item");
      }

      toast("Gallery item created successfully", "success");
      router.push("/admin/gallery");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create gallery item", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopBar title="Add Gallery Item">
        <Link
          href="/admin/gallery"
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

            <FormField label="Category">
              <input
                type="text"
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                placeholder="e.g. Skin Care, Dental, Hair"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

            <FormField label="Type" required>
              <select
                value={form.type}
                onChange={(e) =>
                  updateForm("type", e.target.value as "before-after" | "showcase")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] bg-white"
              >
                <option value="before-after">Before / After</option>
                <option value="showcase">Showcase</option>
              </select>
            </FormField>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Images</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUpload
                label="Before Image"
                value={form.beforeImage}
                onChange={(url) => updateForm("beforeImage", url)}
              />
              <ImageUpload
                label="After Image"
                value={form.afterImage}
                onChange={(url) => updateForm("afterImage", url)}
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Details</h2>

            <BilingualInput
              label="Doctor"
              nameEn="doctor_en"
              nameAr="doctor_ar"
              valueEn={form.doctor.en}
              valueAr={form.doctor.ar}
              onChangeEn={(v) => updateForm("doctor", { ...form.doctor, en: v })}
              onChangeAr={(v) => updateForm("doctor", { ...form.doctor, ar: v })}
            />

            <FormField label="Sessions">
              <input
                type="number"
                value={form.sessions}
                onChange={(e) => updateForm("sessions", parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
              />
            </FormField>

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

          {/* Tags (Bilingual) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Tags</h2>
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#c8567e] bg-[#c8567e]/10 rounded-lg hover:bg-[#c8567e]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Tag
              </button>
            </div>

            {form.tags.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No tags yet. Click &quot;Add Tag&quot; to add one.
              </p>
            )}

            {form.tags.map((tag, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">English</label>
                    <input
                      type="text"
                      value={tag.en}
                      onChange={(e) => updateTag(index, "en", e.target.value)}
                      placeholder="Tag in English..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Arabic</label>
                    <input
                      type="text"
                      value={tag.ar}
                      onChange={(e) => updateTag(index, "ar", e.target.value)}
                      placeholder="...الوسم بالعربي"
                      dir="rtl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e]"
                      style={{ fontFamily: "var(--font-arabic)" }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove tag"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <Link
              href="/admin/gallery"
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
              {submitting ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
