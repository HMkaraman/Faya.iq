"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import type { GalleryItem } from "@/types";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch {
      toast("Failed to load gallery items", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast("Gallery item deleted successfully", "success");
    } catch {
      toast("Failed to delete gallery item", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Gallery" />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Gallery">
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Item
        </Link>
      </TopBar>

      <div className="p-6">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300">
              photo_library
            </span>
            <p className="mt-3 text-gray-500">No gallery items found.</p>
            <Link
              href="/admin/gallery/new"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={item.afterImage || item.beforeImage || "/placeholder.png"}
                    alt={item.title.en}
                    className="w-full h-full object-cover"
                  />
                  {/* Type badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.type === "before-after"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.type === "before-after" ? "Before / After" : "Showcase"}
                  </span>
                  {/* Active badge */}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={item.active ? "active" : "inactive"} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {item.title.en}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {item.doctor.en || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      {item.sessions} {item.sessions === 1 ? "session" : "sessions"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => router.push(`/admin/gallery/${item.id}/edit`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Gallery Item"
        message={`Are you sure you want to delete "${deleteTarget?.title.en}"? This action cannot be undone.`}
      />
    </>
  );
}
