"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import GalleryForm, { type GalleryFormData } from "@/components/admin/forms/GalleryForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<GalleryFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/gallery/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
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
      .catch(() => toast(t(adminI18n.gallery.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: GalleryFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.gallery.updateFailed)); }
      toast(t(adminI18n.gallery.updateSuccess), "success");
      router.push("/admin/gallery");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.gallery.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title={t(adminI18n.gallery.editGalleryItem)} breadcrumbs={[{ label: t(adminI18n.gallery.title), href: "/admin/gallery" }, { label: t(adminI18n.common.edit) }]}>
        <Link href="/admin/gallery" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t(adminI18n.common.back)}
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <GalleryForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
