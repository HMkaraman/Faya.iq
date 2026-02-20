"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import BranchForm, { type BranchFormData } from "@/components/admin/forms/BranchForm";
import { useToast } from "@/components/admin/ToastProvider";

export default function NewBranchPage() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(data: BranchFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to create branch"); }
      toast("Branch created successfully", "success");
      router.push("/admin/branches");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create branch", "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title="Add Branch" breadcrumbs={[{ label: "Branches", href: "/admin/branches" }, { label: "New Branch" }]}>
        <Link href="/admin/branches" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl"><BranchForm onSubmit={handleSubmit} isSubmitting={submitting} /></div>
    </>
  );
}
