"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { BlogPost } from "@/types";

export default function AdminBlogList() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data);
    } catch {
      toast(t(adminI18n.blog.loadFailed), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/blog/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast(t(adminI18n.blog.deleteSuccess), "success");
    } catch {
      toast(t(adminI18n.blog.deleteFailed), "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "image",
      label: t(adminI18n.common.image),
      render: (post: BlogPost) =>
        post.image ? (
          <img
            src={post.image}
            alt={post.title?.[lang] || post.title?.en}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">image</span>
          </div>
        ),
    },
    {
      key: "title",
      label: t(adminI18n.common.title),
      render: (post: BlogPost) => (
        <span className="font-medium text-gray-900 line-clamp-1">{post.title?.[lang] || post.title?.en}</span>
      ),
    },
    {
      key: "category",
      label: t(adminI18n.common.category),
      render: (post: BlogPost) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {post.category}
        </span>
      ),
    },
    {
      key: "author",
      label: t(adminI18n.blog.author),
    },
    {
      key: "publishedAt",
      label: t(adminI18n.blog.published),
      render: (post: BlogPost) => (
        <span className="text-gray-600">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "featured",
      label: t(adminI18n.blog.featured),
      render: (post: BlogPost) =>
        post.featured ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t(adminI18n.common.yes)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {t(adminI18n.common.no)}
          </span>
        ),
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={t(adminI18n.blog.title)}>
        <Link
          href="/admin/blog/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t(adminI18n.blog.newPost)}
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={posts}
          searchKey="author"
          onEdit={(item) => {
            const post = item as unknown as BlogPost;
            router.push(`/admin/blog/${post.id}/edit`);
          }}
          onDelete={(item) => setDeleteTarget(item as unknown as BlogPost)}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t(adminI18n.blog.deleteTitle)}
        message={t(adminI18n.blog.deleteMessage)}
      />
    </div>
  );
}
