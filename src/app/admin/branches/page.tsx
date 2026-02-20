"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

interface Branch {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  [key: string]: unknown;
}

export default function BranchesPage() {
  const { t, lang } = useLanguage();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBranches(data);
    } catch {
      toast(t(adminI18n.branches.loadFailed), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/branches/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setBranches((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      toast(t(adminI18n.branches.deleteSuccess), "success");
    } catch {
      toast(t(adminI18n.branches.deleteFailed), "error");
    }
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "image",
      label: t(adminI18n.common.image),
      render: (item: Branch) => (
        <img
          src={item.image}
          alt={item.name?.[lang] || item.name?.en}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "name",
      label: t(adminI18n.common.name),
      render: (item: Branch) => (
        <span className="font-medium text-gray-900">{item.name?.[lang] || item.name?.en}</span>
      ),
    },
    {
      key: "city",
      label: t(adminI18n.branches.city),
      render: (item: Branch) => item.city?.[lang] || item.city?.en,
    },
    {
      key: "phone",
      label: t(adminI18n.common.phone),
      render: (item: Branch) => item.phone,
    },
    {
      key: "rating",
      label: t(adminI18n.common.rating),
      render: (item: Branch) => (
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-yellow-500 text-[16px]">
            star
          </span>
          {item.rating} ({item.reviewCount})
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={t(adminI18n.branches.title)}>
        <Link
          href="/admin/branches/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t(adminI18n.branches.addBranch)}
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={branches}
          searchKey="name"
          onEdit={(item) => {
            const branch = item as unknown as Branch;
            router.push(`/admin/branches/${branch.id}/edit`);
          }}
          onDelete={(item) => setDeleteTarget(item as unknown as Branch)}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t(adminI18n.branches.deleteTitle)}
        message={t(adminI18n.branches.deleteMessage)}
      />
    </div>
  );
}
