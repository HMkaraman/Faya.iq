"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import TeamForm, { type TeamFormData } from "@/components/admin/forms/TeamForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<TeamFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/team/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((member) => {
        setInitialData({
          name: member.name || { en: "", ar: "" },
          title: member.title || { en: "", ar: "" },
          specialization: member.specialization || { en: "", ar: "" },
          bio: member.bio || { en: "", ar: "" },
          image: member.image || "",
          branches: member.branches || [],
          credentials: member.credentials || [],
          yearsExperience: member.yearsExperience || 0,
        });
      })
      .catch(() => toast(t(adminI18n.team.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: TeamFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/team/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.team.updateFailed)); }
      toast(t(adminI18n.team.updateSuccess), "success");
      router.push("/admin/team");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.team.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.team.deleteSuccess), "success");
      router.push("/admin/team");
    } catch {
      toast(t(adminI18n.team.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      formId="team-form"
      backHref="/admin/team"
      title={t(adminI18n.team.editMember)}
      breadcrumbs={[{ label: t(adminI18n.team.title), href: "/admin/team" }, { label: t(adminI18n.common.edit) }]}
      isSubmitting={submitting}
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      isEditing={true}
      onDelete={handleDelete}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <TeamForm formId="team-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
