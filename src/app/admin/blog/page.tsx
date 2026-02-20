"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import type { BlogPost } from "@/types";

export default function AdminBlogList() {
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
      toast("Failed to load blog posts", "error");
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
      toast("Blog post deleted successfully", "success");
    } catch {
      toast("Failed to delete blog post", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (post: BlogPost) =>
        post.image ? (
          <img
            src={post.image}
            alt={post.title.en}
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
      label: "Title",
      render: (post: BlogPost) => (
        <span className="font-medium text-gray-900 line-clamp-1">{post.title.en}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (post: BlogPost) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {post.category}
        </span>
      ),
    },
    {
      key: "author",
      label: "Author",
    },
    {
      key: "publishedAt",
      label: "Published",
      render: (post: BlogPost) => (
        <span className="text-gray-600">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "featured",
      label: "Featured",
      render: (post: BlogPost) =>
        post.featured ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            No
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
      <TopBar title="Blog Posts">
        <Link
          href="/admin/blog/new"
          className="bg-[#c8567e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a03d5e] transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Post
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
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title?.en}"? This action cannot be undone.`}
      />
    </div>
  );
}
