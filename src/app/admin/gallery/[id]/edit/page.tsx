"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import GalleryForm, { type GalleryFormData } from "@/components/admin/forms/GalleryForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";

export default function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<GalleryFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/gallery/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((item) => {
        setInitialData({
          title: item.title || { en: "", ar: "" },
          category: item.category || "",
          type: item.type || "before-after",
          beforeImage: item.beforeImage || "",
          afterImage: item.afterImage || "",
          images: item.images || [],
          doctor: item.doctor || { en: "", ar: "" },
          sessions: item.sessions || 1,
          tags: item.tags || [],
          active: item.active ?? true,
        });
      })
      .catch(() => toast("Failed to load gallery item", "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  async function handleSubmit(data: GalleryFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to update"); }
      toast("Gallery item updated successfully", "success");
      router.push("/admin/gallery");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update gallery item", "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title="Edit Gallery Item" breadcrumbs={[{ label: "Gallery", href: "/admin/gallery" }, { label: "Edit" }]}>
        <Link href="/admin/gallery" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <GalleryForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
