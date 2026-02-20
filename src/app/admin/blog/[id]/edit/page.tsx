"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import BlogForm, { type BlogFormData } from "@/components/admin/forms/BlogForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import type { BlogPost } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [initialData, setInitialData] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((post: BlogPost) => {
        setInitialData({
          slug: post.slug || "",
          title: post.title || { en: "", ar: "" },
          excerpt: post.excerpt || { en: "", ar: "" },
          content: post.content || { en: "", ar: "" },
          category: post.category || "",
          tags: post.tags || [],
          author: post.author || "",
          authorImage: post.authorImage || "",
          image: post.image || "",
          publishedAt: post.publishedAt ? post.publishedAt.split("T")[0] : "",
          readTime: post.readTime || { en: "", ar: "" },
          featured: post.featured || false,
        });
      })
      .catch(() => { toast(t(adminI18n.blog.loadOneFailed), "error"); router.push("/admin/blog"); })
      .finally(() => setLoading(false));
  }, [id, router, toast, t]);

  async function handleSubmit(data: BlogFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.blog.updateFailed)); }
      toast(t(adminI18n.blog.updateSuccess), "success");
      router.push("/admin/blog");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.blog.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title={t(adminI18n.blog.editBlogPost)} breadcrumbs={[{ label: t(adminI18n.blog.title), href: "/admin/blog" }, { label: t(adminI18n.common.edit) }]}>
        <Link href="/admin/blog" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{t(adminI18n.common.cancel)}</Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <BlogForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
