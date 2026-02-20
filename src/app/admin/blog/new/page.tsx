"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import BlogForm, { type BlogFormData } from "@/components/admin/forms/BlogForm";
import { useToast } from "@/components/admin/ToastProvider";

export default function NewBlogPost() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(data: BlogFormData) {
    setSubmitting(true);
    try {
      const payload = { slug: data.slug, title: data.title, excerpt: data.excerpt, content: data.content, category: data.category, tags: data.tags, author: data.author, authorImage: data.authorImage, image: data.image, publishedAt: data.publishedAt, readTime: data.readTime, featured: data.featured };
      const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to create post"); }
      toast("Blog post created successfully", "success");
      router.push("/admin/blog");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create blog post", "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title="New Blog Post" breadcrumbs={[{ label: "Blog", href: "/admin/blog" }, { label: "New Post" }]}>
        <Link href="/admin/blog" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        <BlogForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </>
  );
}
