"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import CaseStudyForm, { type CaseStudyFormData } from "@/components/admin/forms/CaseStudyForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewCaseStudyPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: CaseStudyFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/case-studies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.caseStudies.createFailed)); }
      toast(t(adminI18n.caseStudies.createSuccess), "success");
      router.push("/admin/case-studies");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.caseStudies.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="case-study-form"
      backHref="/admin/case-studies"
      title={t(adminI18n.caseStudies.addCaseStudy)}
      breadcrumbs={[{ label: t(adminI18n.caseStudies.title), href: "/admin/case-studies" }, { label: t(adminI18n.caseStudies.newItem) }]}
      submitLabel={t(adminI18n.caseStudyForm.createItem)}
      submittingLabel={t(adminI18n.common.creating)}
      isSubmitting={submitting}
    >
      <CaseStudyForm formId="case-study-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
