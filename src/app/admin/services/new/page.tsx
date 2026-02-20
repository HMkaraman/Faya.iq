"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import ServiceForm, { type ServiceFormData } from "@/components/admin/forms/ServiceForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewServicePage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: ServiceFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t(adminI18n.services.createFailed));
      }
      toast(t(adminI18n.services.createSuccess), "success");
      router.push("/admin/services");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.services.createFailed), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormPageLayout
      title={t(adminI18n.services.addService)}
      breadcrumbs={[
        { label: t(adminI18n.services.title), href: "/admin/services" },
        { label: t(adminI18n.services.newService) },
      ]}
      backHref="/admin/services"
      formId="service-form"
      isSubmitting={submitting}
      submitLabel={t(adminI18n.serviceForm.createService)}
      submittingLabel={t(adminI18n.common.creating)}
    >
      <ServiceForm formId="service-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
