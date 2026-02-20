"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import ServiceForm, { type ServiceFormData } from "@/components/admin/forms/ServiceForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<ServiceFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
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
      .catch(() => toast("Failed to load service data", "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

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
        throw new Error(err.error || "Failed to update service");
      }
      toast("Service updated successfully", "success");
      router.push("/admin/services");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update service", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopBar
        title="Edit Service"
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: "Edit" },
        ]}
      >
        <Link href="/admin/services" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <ServiceForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
