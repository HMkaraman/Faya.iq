"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
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

  async function handleDelete() {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.gallery.deleteSuccess), "success");
      router.push("/admin/gallery");
    } catch {
      toast(t(adminI18n.gallery.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      formId="gallery-form"
      backHref="/admin/gallery"
      title={t(adminI18n.gallery.editGalleryItem)}
      breadcrumbs={[{ label: t(adminI18n.gallery.title), href: "/admin/gallery" }, { label: t(adminI18n.common.edit) }]}
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      isSubmitting={submitting}
      isEditing={true}
      onDelete={handleDelete}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <GalleryForm formId="gallery-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
