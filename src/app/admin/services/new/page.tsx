"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import ServiceForm, { type ServiceFormData } from "@/components/admin/forms/ServiceForm";
import { useToast } from "@/components/admin/ToastProvider";
import Link from "next/link";

export default function NewServicePage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
        throw new Error(err.error || "Failed to create service");
      }
      toast("Service created successfully", "success");
      router.push("/admin/services");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create service", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TopBar
        title="Add Service"
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: "New Service" },
        ]}
      >
        <Link href="/admin/services" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        <ServiceForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </>
  );
}
