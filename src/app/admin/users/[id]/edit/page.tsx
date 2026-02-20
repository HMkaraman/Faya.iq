"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import UserForm, { type UserFormData } from "@/components/admin/forms/UserForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((user) => {
        setInitialData({
          username: user.username || "",
          email: user.email || "",
          name: user.name || "",
          password: "",
          role: user.role || "editor",
          isActive: user.isActive ?? true,
        });
      })
      .catch(() => toast(t(adminI18n.users.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: UserFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.users.updateFailed)); }
      toast(t(adminI18n.users.updateSuccess), "success");
      router.push("/admin/users");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.users.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.users.deleteSuccess), "success");
      router.push("/admin/users");
    } catch {
      toast(t(adminI18n.users.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      formId="user-form"
      backHref="/admin/users"
      title={t(adminI18n.users.editUser)}
      breadcrumbs={[{ label: t(adminI18n.users.title), href: "/admin/users" }, { label: t(adminI18n.common.edit) }]}
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      isSubmitting={submitting}
      isEditing={true}
      onDelete={handleDelete}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <UserForm formId="user-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
