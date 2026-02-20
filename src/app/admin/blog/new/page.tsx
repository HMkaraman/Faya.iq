"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import BlogForm, { type BlogFormData } from "@/components/admin/forms/BlogForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewBlogPost() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: BlogFormData) {
    setSubmitting(true);
    try {
      const payload = { slug: data.slug, title: data.title, excerpt: data.excerpt, content: data.content, category: data.category, tags: data.tags, author: data.author, authorImage: data.authorImage, image: data.image, publishedAt: data.publishedAt, readTime: data.readTime, featured: data.featured };
      const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.blog.createFailed)); }
      toast(t(adminI18n.blog.createSuccess), "success");
      router.push("/admin/blog");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.blog.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title={t(adminI18n.blog.newBlogPost)} breadcrumbs={[{ label: t(adminI18n.blog.title), href: "/admin/blog" }, { label: t(adminI18n.blog.newPost) }]}>
        <Link href="/admin/blog" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{t(adminI18n.common.cancel)}</Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        <BlogForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </>
  );
}
