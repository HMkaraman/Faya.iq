"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
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

  async function handleDelete() {
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.testimonials.deleteSuccess), "success");
      router.push("/admin/testimonials");
    } catch {
      toast(t(adminI18n.testimonials.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      formId="testimonial-form"
      backHref="/admin/testimonials"
      title={t(adminI18n.testimonials.editTestimonial)}
      breadcrumbs={[{ label: t(adminI18n.testimonials.title), href: "/admin/testimonials" }, { label: t(adminI18n.common.edit) }]}
      isSubmitting={submitting}
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      isEditing={true}
      onDelete={handleDelete}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <TestimonialForm formId="testimonial-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
