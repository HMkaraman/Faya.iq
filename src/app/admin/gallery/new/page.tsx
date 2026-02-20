"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
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
    <>
      <TopBar title={t(adminI18n.gallery.addGalleryItem)} breadcrumbs={[{ label: t(adminI18n.gallery.title), href: "/admin/gallery" }, { label: t(adminI18n.gallery.newItem) }]}>
        <Link href="/admin/gallery" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t(adminI18n.common.back)}
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl"><GalleryForm onSubmit={handleSubmit} isSubmitting={submitting} /></div>
    </>
  );
}
