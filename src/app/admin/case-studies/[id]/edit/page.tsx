"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import CaseStudyForm, { type CaseStudyFormData } from "@/components/admin/forms/CaseStudyForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<CaseStudyFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/case-studies/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((item) => {
        setInitialData({
          slug: item.slug || "",
          title: item.title || { en: "", ar: "" },
          summary: item.summary || { en: "", ar: "" },
          serviceId: item.serviceId || "",
          categorySlug: item.categorySlug || "",
          doctor: item.doctor || { en: "", ar: "" },
          stages: item.stages || [],
          tags: item.tags || [],
          active: item.active ?? true,
        });
      })
      .catch(() => toast(t(adminI18n.caseStudies.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: CaseStudyFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/case-studies/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.caseStudies.updateFailed)); }
      toast(t(adminI18n.caseStudies.updateSuccess), "success");
      router.push("/admin/case-studies");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.caseStudies.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/case-studies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.caseStudies.deleteSuccess), "success");
      router.push("/admin/case-studies");
    } catch {
      toast(t(adminI18n.caseStudies.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      formId="case-study-form"
      backHref="/admin/case-studies"
      title={t(adminI18n.caseStudies.editCaseStudy)}
      breadcrumbs={[{ label: t(adminI18n.caseStudies.title), href: "/admin/case-studies" }, { label: t(adminI18n.common.edit) }]}
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      isSubmitting={submitting}
      isEditing={true}
      onDelete={handleDelete}
      previewHref={initialData?.slug ? `/case-studies/${initialData.slug}` : undefined}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <CaseStudyForm formId="case-study-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
