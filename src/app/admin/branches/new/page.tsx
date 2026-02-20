"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import BranchForm, { type BranchFormData } from "@/components/admin/forms/BranchForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewBranchPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: BranchFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.branches.createFailed)); }
      toast(t(adminI18n.branches.createSuccess), "success");
      router.push("/admin/branches");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.branches.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="branch-form"
      backHref="/admin/branches"
      title={t(adminI18n.branches.addBranch)}
      breadcrumbs={[{ label: t(adminI18n.branches.title), href: "/admin/branches" }, { label: t(adminI18n.branches.newBranch) }]}
      submitLabel={t(adminI18n.branchForm.createBranch)}
      submittingLabel={t(adminI18n.common.creating)}
      isSubmitting={submitting}
    >
      <BranchForm formId="branch-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
