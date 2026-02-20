"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import OfferForm, { type OfferFormData } from "@/components/admin/forms/OfferForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewOfferPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: OfferFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/offers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.offers.createFailed)); }
      toast(t(adminI18n.offers.createSuccess), "success");
      router.push("/admin/offers");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.offers.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="offer-form"
      backHref="/admin/offers"
      title={t(adminI18n.offers.addOffer)}
      breadcrumbs={[{ label: t(adminI18n.offers.title), href: "/admin/offers" }, { label: t(adminI18n.offers.newOffer) }]}
      isSubmitting={submitting}
      submitLabel={t(adminI18n.offerForm.createOffer)}
      submittingLabel={t(adminI18n.common.creating)}
    >
      <OfferForm formId="offer-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
