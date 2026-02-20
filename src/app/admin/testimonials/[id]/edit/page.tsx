"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import TestimonialForm, { type TestimonialFormData } from "@/components/admin/forms/TestimonialForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [initialData, setInitialData] = useState<TestimonialFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/testimonials/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((item) => {
        setInitialData({
          name: item.name || { en: "", ar: "" },
          service: item.service || { en: "", ar: "" },
          branch: item.branch || "",
          rating: item.rating || 5,
          text: item.text || { en: "", ar: "" },
          image: item.image || "",
        });
      })
      .catch(() => toast(t(adminI18n.testimonials.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: TestimonialFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.testimonials.updateFailed)); }
      toast(t(adminI18n.testimonials.updateSuccess), "success");
      router.push("/admin/testimonials");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.testimonials.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title={t(adminI18n.testimonials.editTestimonial)} breadcrumbs={[{ label: t(adminI18n.testimonials.title), href: "/admin/testimonials" }, { label: t(adminI18n.common.edit) }]}>
        <Link href="/admin/testimonials" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t(adminI18n.common.back)}
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <TestimonialForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
