"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/ToastProvider";
import type { BlogPost } from "@/types";

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    titleAr: "",
    excerptEn: "",
    excerptAr: "",
    contentEn: "",
    contentAr: "",
    category: "",
    tags: [] as string[],
    author: "",
    authorImage: "",
    image: "",
    publishedAt: "",
    readTimeEn: "",
    readTimeAr: "",
    featured: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (!res.ok) throw new Error("Not found");
        const post: BlogPost = await res.json();

        setForm({
          slug: post.slug || "",
          titleEn: post.title?.en || "",
          titleAr: post.title?.ar || "",
          excerptEn: post.excerpt?.en || "",
          excerptAr: post.excerpt?.ar || "",
          contentEn: post.content?.en || "",
          contentAr: post.content?.ar || "",
          category: post.category || "",
          tags: post.tags || [],
          author: post.author || "",
          authorImage: post.authorImage || "",
          image: post.image || "",
          publishedAt: post.publishedAt ? post.publishedAt.split("T")[0] : "",
          readTimeEn: post.readTime?.en || "",
          readTimeAr: post.readTime?.ar || "",
          featured: post.featured || false,
        });
      } catch {
        toast("Failed to load blog post", "error");
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router, toast]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.titleEn || !form.titleAr) {
      toast("Title is required in both languages", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        title: { en: form.titleEn, ar: form.titleAr },
        excerpt: { en: form.excerptEn, ar: form.excerptAr },
        content: { en: form.contentEn, ar: form.contentAr },
        category: form.category,
        tags: form.tags,
        author: form.author,
        authorImage: form.authorImage,
        image: form.image,
        publishedAt: form.publishedAt,
        readTime: { en: form.readTimeEn, ar: form.readTimeAr },
        featured: form.featured,
      };

      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update post");
      }

      toast("Blog post updated successfully", "success");
      router.push("/admin/blog");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update blog post", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Edit Blog Post">
        <Link
          href="/admin/blog"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Slug */}
          <FormField label="Slug" required>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="e.g. my-blog-post"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
            />
          </FormField>

          {/* Title */}
          <BilingualInput
            label="Title"
            nameEn="titleEn"
            nameAr="titleAr"
            valueEn={form.titleEn}
            valueAr={form.titleAr}
            onChangeEn={(v) => update("titleEn", v)}
            onChangeAr={(v) => update("titleAr", v)}
            required
          />

          {/* Excerpt */}
          <BilingualTextarea
            label="Excerpt"
            nameEn="excerptEn"
            nameAr="excerptAr"
            valueEn={form.excerptEn}
            valueAr={form.excerptAr}
            onChangeEn={(v) => update("excerptEn", v)}
            onChangeAr={(v) => update("excerptAr", v)}
            rows={3}
          />

          {/* Content EN & AR side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Content (English)">
              <textarea
                value={form.contentEn}
                onChange={(e) => update("contentEn", e.target.value)}
                placeholder="Write blog content in English..."
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
              />
            </FormField>

            <FormField label="Content (Arabic)">
              <textarea
                value={form.contentAr}
                onChange={(e) => update("contentAr", e.target.value)}
                placeholder="...اكتب محتوى المدونة بالعربية"
                dir="rtl"
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
                style={{ fontFamily: "var(--font-arabic)" }}
              />
            </FormField>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Category">
              <input
                type="text"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Medical Insights"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
              />
            </FormField>

            <FormField label="Tags">
              <TagInput
                value={form.tags}
                onChange={(tags) => update("tags", tags)}
                placeholder="Add tag and press Enter..."
              />
            </FormField>
          </div>

          {/* Author & Author Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Author">
              <input
                type="text"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="e.g. Dr. Sarah Ahmed"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
              />
            </FormField>

            <FormField label="Author Image URL">
              <input
                type="text"
                value={form.authorImage}
                onChange={(e) => update("authorImage", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
              />
            </FormField>
          </div>

          {/* Cover Image */}
          <ImageUpload
            value={form.image}
            onChange={(url) => update("image", url)}
            label="Cover Image"
          />

          {/* Published Date & Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FormField label="Published Date">
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => update("publishedAt", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
              />
            </FormField>

            <FormField label="Read Time (EN)">
              <input
                type="text"
                value={form.readTimeEn}
                onChange={(e) => update("readTimeEn", e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
              />
            </FormField>

            <FormField label="Read Time (AR)">
              <input
                type="text"
                value={form.readTimeAr}
                onChange={(e) => update("readTimeAr", e.target.value)}
                placeholder="e.g. ٥ دقائق قراءة"
                dir="rtl"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
                style={{ fontFamily: "var(--font-arabic)" }}
              />
            </FormField>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("featured", !form.featured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.featured ? "bg-[#c8567e]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.featured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-sm font-medium text-gray-700">Featured Post</label>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#c8567e] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#a03d5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/blog"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
