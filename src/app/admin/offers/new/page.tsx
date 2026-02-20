"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
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
    <>
      <TopBar title={t(adminI18n.offers.addOffer)} breadcrumbs={[{ label: t(adminI18n.offers.title), href: "/admin/offers" }, { label: t(adminI18n.offers.newOffer) }]}>
        <Link href="/admin/offers" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t(adminI18n.common.back)}
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl"><OfferForm onSubmit={handleSubmit} isSubmitting={submitting} /></div>
    </>
  );
}
