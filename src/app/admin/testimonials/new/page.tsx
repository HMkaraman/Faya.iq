"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPageLayout from "@/components/admin/FormPageLayout";
import TestimonialForm, { type TestimonialFormData } from "@/components/admin/forms/TestimonialForm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function NewTestimonialPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(data: TestimonialFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.testimonials.createFailed)); }
      toast(t(adminI18n.testimonials.createSuccess), "success");
      router.push("/admin/testimonials");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.testimonials.createFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <FormPageLayout
      formId="testimonial-form"
      backHref="/admin/testimonials"
      title={t(adminI18n.testimonials.addTestimonial)}
      breadcrumbs={[{ label: t(adminI18n.testimonials.title), href: "/admin/testimonials" }, { label: t(adminI18n.testimonials.newTestimonial) }]}
      isSubmitting={submitting}
      submitLabel={t(adminI18n.testimonialForm.createTestimonial)}
      submittingLabel={t(adminI18n.common.creating)}
    >
      <TestimonialForm formId="testimonial-form" onSubmit={handleSubmit} isSubmitting={submitting} />
    </FormPageLayout>
  );
}
