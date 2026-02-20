"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { validate, blogSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

export interface BlogFormData {
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  category: string;
  tags: string[];
  author: string;
  authorImage: string;
  image: string;
  publishedAt: string;
  readTime: { en: string; ar: string };
  featured: boolean;
}

const emptyForm: BlogFormData = {
  slug: "",
  title: { en: "", ar: "" },
  excerpt: { en: "", ar: "" },
  content: { en: "", ar: "" },
  category: "",
  tags: [],
  author: "",
  authorImage: "",
  image: "",
  publishedAt: new Date().toISOString().split("T")[0],
  readTime: { en: "", ar: "" },
  featured: false,
};

interface BlogFormProps {
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function BlogForm({ initialData, onSubmit, isSubmitting }: BlogFormProps) {
  const [form, setForm] = useState<BlogFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;

  useUnsavedChanges(isDirty);

  function updateForm<K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form as unknown as Record<string, unknown>, blogSchema);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>

        <FormField label="Slug" required error={errors.slug}>
          <input type="text" value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} placeholder="e.g. my-blog-post" className={inputClass} />
        </FormField>

        <BilingualInput label="Title" nameEn="titleEn" nameAr="titleAr" valueEn={form.title.en} valueAr={form.title.ar} onChangeEn={(v) => updateForm("title", { ...form.title, en: v })} onChangeAr={(v) => updateForm("title", { ...form.title, ar: v })} required />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

        <BilingualTextarea label="Excerpt" nameEn="excerptEn" nameAr="excerptAr" valueEn={form.excerpt.en} valueAr={form.excerpt.ar} onChangeEn={(v) => updateForm("excerpt", { ...form.excerpt, en: v })} onChangeAr={(v) => updateForm("excerpt", { ...form.excerpt, ar: v })} rows={3} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Content (English)">
            <textarea value={form.content.en} onChange={(e) => updateForm("content", { ...form.content, en: e.target.value })} placeholder="Write blog content in English..." rows={12} className={`${inputClass} resize-y`} />
          </FormField>
          <FormField label="Content (Arabic)">
            <textarea value={form.content.ar} onChange={(e) => updateForm("content", { ...form.content, ar: e.target.value })} placeholder="...اكتب محتوى المدونة بالعربية" dir="rtl" rows={12} className={`${inputClass} resize-y`} style={{ fontFamily: "var(--font-arabic)" }} />
          </FormField>
        </div>
      </div>

      {/* Category & Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Category & Tags</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Category">
            <input type="text" value={form.category} onChange={(e) => updateForm("category", e.target.value)} placeholder="e.g. Medical Insights" className={inputClass} />
          </FormField>
          <FormField label="Tags">
            <TagInput value={form.tags} onChange={(tags) => updateForm("tags", tags)} placeholder="Add tag and press Enter..." />
          </FormField>
        </div>
      </div>

      {/* Author & Media */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Author & Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Author">
            <input type="text" value={form.author} onChange={(e) => updateForm("author", e.target.value)} placeholder="e.g. Dr. Sarah Ahmed" className={inputClass} />
          </FormField>
          <FormField label="Author Image URL">
            <input type="text" value={form.authorImage} onChange={(e) => updateForm("authorImage", e.target.value)} placeholder="https://..." className={inputClass} />
          </FormField>
        </div>
        <ImageUpload value={form.image} onChange={(url) => updateForm("image", url)} label="Cover Image" />
      </div>

      {/* Meta */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Metadata</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FormField label="Published Date">
            <input type="date" value={form.publishedAt} onChange={(e) => updateForm("publishedAt", e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Read Time (EN)">
            <input type="text" value={form.readTime.en} onChange={(e) => updateForm("readTime", { ...form.readTime, en: e.target.value })} placeholder="e.g. 5 min read" className={inputClass} />
          </FormField>
          <FormField label="Read Time (AR)">
            <input type="text" value={form.readTime.ar} onChange={(e) => updateForm("readTime", { ...form.readTime, ar: e.target.value })} placeholder="e.g. ٥ دقائق قراءة" dir="rtl" className={inputClass} style={{ fontFamily: "var(--font-arabic)" }} />
          </FormField>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => updateForm("featured", !form.featured)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.featured ? "bg-primary" : "bg-gray-300"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.featured ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <label className="text-sm font-medium text-gray-700">Featured Post</label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/admin/blog" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Post")}
        </button>
      </div>
    </form>
  );
}
