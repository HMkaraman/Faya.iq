"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import type { Service } from "@/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setServices(data);
    } catch {
      toast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/services/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast("Service deleted successfully", "success");
    } catch {
      toast("Failed to delete service", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item: Service) => (
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name.en}
          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (item: Service) => (
        <span className="font-medium text-gray-900">{item.name.en}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item: Service) => (
        <span className="text-sm text-gray-600">{item.category}</span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (item: Service) => (
        <span className="text-sm text-gray-600">{item.duration || "—"}</span>
      ),
    },
    {
      key: "tags",
      label: "Tags",
      render: (item: Service) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.length > 0
            ? item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                >
                  {tag}
                </span>
              ))
            : "—"}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar title="Services" />
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
      <TopBar title="Services">
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Service
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={services}
          searchKey="name"
          onEdit={(item) => {
            const service = item as unknown as Service;
            router.push(`/admin/services/${service.id}/edit`);
          }}
          onDelete={(item) => {
            setDeleteTarget(item as unknown as Service);
          }}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name.en}"? This action cannot be undone.`}
      />
    </>
  );
}
