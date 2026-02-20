"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import BranchForm, { type BranchFormData } from "@/components/admin/forms/BranchForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export default function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<BranchFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`/api/branches/${id}`)
      .then((r) => { if (!r.ok) throw new Error(t(adminI18n.common.notFound)); return r.json(); })
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
      .catch(() => toast(t(adminI18n.branches.loadOneFailed), "error"))
      .finally(() => setLoading(false));
  }, [id, toast, t]);

  async function handleSubmit(data: BranchFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/branches/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || t(adminI18n.branches.updateFailed)); }
      toast(t(adminI18n.branches.updateSuccess), "success");
      router.push("/admin/branches");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.branches.updateFailed), "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title={t(adminI18n.branches.editBranch)} breadcrumbs={[{ label: t(adminI18n.branches.title), href: "/admin/branches" }, { label: t(adminI18n.common.edit) }]}>
        <Link href="/admin/branches" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t(adminI18n.common.back)}
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <BranchForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
