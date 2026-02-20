"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import OfferForm, { type OfferFormData } from "@/components/admin/forms/OfferForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<OfferFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/offers/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
      .then((offer) => {
        setInitialData({
          title: offer.title || { en: "", ar: "" },
          description: offer.description || { en: "", ar: "" },
          discount: offer.discount || "",
          originalPrice: offer.originalPrice || { en: "", ar: "" },
          salePrice: offer.salePrice || { en: "", ar: "" },
          image: offer.image || "",
          validUntil: offer.validUntil || "",
          branches: offer.branches || { en: "", ar: "" },
          tag: offer.tag || { en: "", ar: "" },
          active: offer.active ?? true,
        });
      })
      .catch(() => toast(t(adminI18n.offers.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: OfferFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.offers.updateFailed)); }
      toast(t(adminI18n.offers.updateSuccess), "success");
      router.push("/admin/offers");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.offers.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast(t(adminI18n.offers.deleteSuccess), "success");
      router.push("/admin/offers");
    } catch {
      toast(t(adminI18n.offers.deleteFailed), "error");
    }
  }

  return (
    <FormPageLayout
      formId="offer-form"
      backHref="/admin/offers"
      title={t(adminI18n.offers.editOffer)}
      breadcrumbs={[{ label: t(adminI18n.offers.title), href: "/admin/offers" }, { label: t(adminI18n.common.edit) }]}
      isSubmitting={submitting}
      submitLabel={t(adminI18n.common.saveChanges)}
      submittingLabel={t(adminI18n.common.saving)}
      isEditing={true}
      onDelete={handleDelete}
    >
      {loading ? <PageSkeleton variant="form" /> : initialData && <OfferForm formId="offer-form" initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
    </FormPageLayout>
  );
}
