"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
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
    <>
      <TopBar title={t(adminI18n.team.addMember)} breadcrumbs={[{ label: t(adminI18n.team.title), href: "/admin/team" }, { label: t(adminI18n.team.newMember) }]}>
        <Link href="/admin/team" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t(adminI18n.common.back)}
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl"><TeamForm onSubmit={handleSubmit} isSubmitting={submitting} /></div>
    </>
  );
}
