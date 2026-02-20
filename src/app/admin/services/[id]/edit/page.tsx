"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import ServiceForm, { type ServiceFormData } from "@/components/admin/forms/ServiceForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<ServiceFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((service) => {
        setInitialData({
          slug: service.slug || "",
          category: service.category || "",
          categorySlug: service.categorySlug || "",
          name: service.name || { en: "", ar: "" },
          shortDescription: service.shortDescription || { en: "", ar: "" },
          description: service.description || { en: "", ar: "" },
          icon: service.icon || "",
          image: service.image || "",
          tags: service.tags || [],
          branches: service.branches || [],
          duration: service.duration || "",
          priceRange: service.priceRange || { en: "", ar: "" },
          benefits: { en: service.benefits?.en?.length ? service.benefits.en : [""], ar: service.benefits?.ar?.length ? service.benefits.ar : [""] },
          steps: { en: service.steps?.en?.length ? service.steps.en : [""], ar: service.steps?.ar?.length ? service.steps.ar : [""] },
          downtime: service.downtime || { en: "", ar: "" },
          faq: service.faq || [],
          beforeAfterPairs: service.beforeAfterPairs || [],
        });
      })
      .catch(() => toast(t(adminI18n.services.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: ServiceFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t(adminI18n.services.updateFailed));
      }
      toast(t(adminI18n.services.updateSuccess), "success");
      router.push("/admin/services");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.services.updateFailed), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.services.deleteSuccess), "success");
      router.push("/admin/services");
    } catch {
      toast(t(adminI18n.services.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      title={t(adminI18n.services.editService)}
      breadcrumbs={[
        { label: t(adminI18n.services.title), href: "/admin/services" },
        { label: t(adminI18n.common.edit) },
      ]}
      backHref="/admin/services"
      formId="service-form"
      isSubmitting={submitting}
      isEditing
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      onDelete={handleDelete}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <ServiceForm formId="service-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
