"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import TeamForm, { type TeamFormData } from "@/components/admin/forms/TeamForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewTeamMemberPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: TeamFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.team.createFailed)); }
      toast(t(adminI18n.team.createSuccess), "success");
      router.push("/admin/team");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.team.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="team-form"
      backHref="/admin/team"
      title={t(adminI18n.team.addMember)}
      breadcrumbs={[{ label: t(adminI18n.team.title), href: "/admin/team" }, { label: t(adminI18n.team.newMember) }]}
      isSubmitting={submitting}
      submitLabel={t(adminI18n.teamForm.createMember)}
      submittingLabel={t(adminI18n.common.creating)}
    >
      <TeamForm formId="team-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
