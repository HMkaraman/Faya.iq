"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import BranchForm, { type BranchFormData } from "@/components/admin/forms/BranchForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";

export default function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<BranchFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/branches/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((branch) => {
        const features = branch.features || { en: [""], ar: [""] };
        setInitialData({
          slug: branch.slug || "",
          name: branch.name || { en: "", ar: "" },
          city: branch.city || { en: "", ar: "" },
          address: branch.address || { en: "", ar: "" },
          phone: branch.phone || "",
          whatsapp: branch.whatsapp || "",
          email: branch.email || "",
          hours: branch.hours || { en: "", ar: "" },
          rating: branch.rating || 5,
          reviewCount: branch.reviewCount || 0,
          image: branch.image || "",
          mapUrl: branch.mapUrl || "",
          coordinates: branch.coordinates || { lat: 0, lng: 0 },
          availableServices: branch.availableServices || [],
          hasGallery: branch.hasGallery || false,
          teamMembers: branch.teamMembers || [],
          features: { en: features.en?.length ? features.en : [""], ar: features.ar?.length ? features.ar : [""] },
        });
      })
      .catch(() => toast("Failed to load branch", "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  async function handleSubmit(data: BranchFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/branches/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to update branch"); }
      toast("Branch updated successfully", "success");
      router.push("/admin/branches");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update branch", "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title="Edit Branch" breadcrumbs={[{ label: "Branches", href: "/admin/branches" }, { label: "Edit" }]}>
        <Link href="/admin/branches" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <BranchForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
