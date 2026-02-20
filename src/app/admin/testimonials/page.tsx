"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import type { Testimonial } from "@/types";

export default function AdminTestimonialsList() {
  const router = useRouter();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTestimonials(data);
    } catch {
      toast("Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast("Testimonial deleted successfully", "success");
    } catch {
      toast("Failed to delete testimonial", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`material-symbols-outlined text-[18px] ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>
    );
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (item: Testimonial) =>
        item.image ? (
          <img
            src={item.image}
            alt={item.name.en}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400 text-[18px]">person</span>
          </div>
        ),
    },
    {
      key: "name",
      label: "Name",
      render: (item: Testimonial) => (
        <span className="font-medium text-gray-900">{item.name.en}</span>
      ),
    },
    {
      key: "service",
      label: "Service",
      render: (item: Testimonial) => (
        <span className="text-gray-600">{item.service.en}</span>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      render: (item: Testimonial) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
          {item.branch}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (item: Testimonial) => renderStars(item.rating),
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
      <TopBar title="Testimonials">
        <Link
          href="/admin/testimonials/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Testimonial
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={testimonials}
          searchKey="branch"
          onEdit={(item) => {
            const t = item as unknown as Testimonial;
            router.push(`/admin/testimonials/${t.id}/edit`);
          }}
          onDelete={(item) => setDeleteTarget(item as unknown as Testimonial)}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.name?.en}"? This action cannot be undone.`}
      />
    </div>
  );
}
