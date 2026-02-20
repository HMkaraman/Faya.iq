"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import TestimonialForm, { type TestimonialFormData } from "@/components/admin/forms/TestimonialForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [initialData, setInitialData] = useState<TestimonialFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/testimonials/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((t) => {
        setInitialData({
          name: t.name || { en: "", ar: "" },
          service: t.service || { en: "", ar: "" },
          branch: t.branch || "",
          rating: t.rating || 5,
          text: t.text || { en: "", ar: "" },
          image: t.image || "",
        });
      })
      .catch(() => toast("Failed to load testimonial", "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  async function handleSubmit(data: TestimonialFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to update"); }
      toast("Testimonial updated successfully", "success");
      router.push("/admin/testimonials");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update testimonial", "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title="Edit Testimonial" breadcrumbs={[{ label: "Testimonials", href: "/admin/testimonials" }, { label: "Edit" }]}>
        <Link href="/admin/testimonials" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <TestimonialForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
