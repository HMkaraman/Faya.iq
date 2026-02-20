"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { Offer } from "@/types";

export default function OffersPage() {
  const { t, lang } = useLanguage();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    try {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOffers(data);
    } catch {
      toast(t(adminI18n.offers.loadFailed), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/offers/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      toast(t(adminI18n.offers.deleteSuccess), "success");
    } catch {
      toast(t(adminI18n.offers.deleteFailed), "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "image",
      label: t(adminI18n.common.image),
      render: (item: Offer) => (
        <img
          src={item.image || "/placeholder.png"}
          alt={item.title?.[lang] || item.title?.en}
          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
        />
      ),
    },
    {
      key: "title",
      label: t(adminI18n.common.title),
      render: (item: Offer) => (
        <span className="font-medium text-gray-900">{item.title?.[lang] || item.title?.en}</span>
      ),
    },
    {
      key: "discount",
      label: t(adminI18n.offers.discount),
      render: (item: Offer) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          {item.discount}
        </span>
      ),
    },
    {
      key: "salePrice",
      label: t(adminI18n.offers.salePrice),
      render: (item: Offer) => (
        <span className="text-sm text-gray-600">{item.salePrice?.[lang] || item.salePrice?.en || "—"}</span>
      ),
    },
    {
      key: "validUntil",
      label: t(adminI18n.offers.validUntil),
      render: (item: Offer) => (
        <span className="text-sm text-gray-600">
          {item.validUntil
            ? new Date(item.validUntil).toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "active",
      label: t(adminI18n.common.status),
      render: (item: Offer) => (
        <StatusBadge status={item.active ? "active" : "inactive"} />
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar title={t(adminI18n.offers.title)} />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={t(adminI18n.offers.title)}>
        <Link
          href="/admin/offers/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t(adminI18n.offers.addOffer)}
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={offers}
          searchKey="title"
          onEdit={(item) => {
            const offer = item as unknown as Offer;
            router.push(`/admin/offers/${offer.id}/edit`);
          }}
          onDelete={(item) => {
            setDeleteTarget(item as unknown as Offer);
          }}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t(adminI18n.offers.deleteTitle)}
        message={t(adminI18n.offers.deleteMessage)}
      />
    </>
  );
}
