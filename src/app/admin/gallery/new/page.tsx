"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import GalleryForm, { type GalleryFormData } from "@/components/admin/forms/GalleryForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewGalleryItemPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: GalleryFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.gallery.createFailed)); }
      toast(t(adminI18n.gallery.createSuccess), "success");
      router.push("/admin/gallery");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.gallery.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="gallery-form"
      backHref="/admin/gallery"
      title={t(adminI18n.gallery.addGalleryItem)}
      breadcrumbs={[{ label: t(adminI18n.gallery.title), href: "/admin/gallery" }, { label: t(adminI18n.gallery.newItem) }]}
      submitLabel={t(adminI18n.galleryForm.createItem)}
      submittingLabel={t(adminI18n.common.creating)}
      isSubmitting={submitting}
    >
      <GalleryForm formId="gallery-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
