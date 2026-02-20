"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import UserForm, { type UserFormData } from "@/components/admin/forms/UserForm";
import PageSkeleton from "@/components/admin/PageSkeleton";
import { useToast } from "@/components/admin/ToastProvider";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((user) => {
        setInitialData({
          username: user.username || "",
          email: user.email || "",
          name: user.name || "",
          password: "",
          role: user.role || "editor",
          isActive: user.isActive ?? true,
        });
      })
      .catch(() => toast("Failed to load user", "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  async function handleSubmit(data: UserFormData) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to update user"); }
      toast("User updated successfully", "success");
      router.push("/admin/users");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update user", "error");
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <TopBar title="Edit User" breadcrumbs={[{ label: "Users", href: "/admin/users" }, { label: "Edit" }]}>
        <Link href="/admin/users" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </Link>
      </TopBar>
      <div className="p-6 max-w-4xl">
        {loading ? <PageSkeleton variant="form" /> : initialData && <UserForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={submitting} />}
      </div>
    </>
  );
}
