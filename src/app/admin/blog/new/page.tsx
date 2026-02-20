"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
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
    <FormPageLayout
      title={t(adminI18n.blog.newBlogPost)}
      breadcrumbs={[{ label: t(adminI18n.blog.title), href: "/admin/blog" }, { label: t(adminI18n.blog.newPost) }]}
      backHref="/admin/blog"
      formId="blog-form"
      isSubmitting={submitting}
      submitLabel={t(adminI18n.blogForm.createPost)}
      submittingLabel={t(adminI18n.common.creating)}
    >
      <BlogForm formId="blog-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
