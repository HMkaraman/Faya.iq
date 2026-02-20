"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import UserForm, { type UserFormData } from "@/components/admin/forms/UserForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewUserPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: UserFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.users.createFailed)); }
      toast(t(adminI18n.users.createSuccess), "success");
      router.push("/admin/users");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.users.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="user-form"
      backHref="/admin/users"
      title={t(adminI18n.users.addUser)}
      breadcrumbs={[{ label: t(adminI18n.users.title), href: "/admin/users" }, { label: t(adminI18n.users.newUser) }]}
      submitLabel={t(adminI18n.userForm.createUser)}
      submittingLabel={t(adminI18n.common.creating)}
      isSubmitting={submitting}
    >
      <UserForm formId="user-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
