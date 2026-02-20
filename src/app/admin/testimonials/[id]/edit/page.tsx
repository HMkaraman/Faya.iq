"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/ToastProvider";
import type { Testimonial } from "@/types";

interface BranchOption {
  id: string;
  slug: string;
  name: { en: string; ar: string };
}

export default function EditTestimonial({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState<BranchOption[]>([]);

  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    serviceEn: "",
    serviceAr: "",
    branch: "",
    rating: 5,
    textEn: "",
    textAr: "",
    image: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [testimonialRes, branchesRes] = await Promise.all([
          fetch(`/api/testimonials/${id}`),
          fetch("/api/branches"),
        ]);

        if (!testimonialRes.ok) throw new Error("Not found");
        const testimonial: Testimonial = await testimonialRes.json();

        if (branchesRes.ok) {
          const branchData = await branchesRes.json();
          setBranches(branchData);
        }

        setForm({
          nameEn: testimonial.name?.en || "",
          nameAr: testimonial.name?.ar || "",
          serviceEn: testimonial.service?.en || "",
          serviceAr: testimonial.service?.ar || "",
          branch: testimonial.branch || "",
          rating: testimonial.rating || 5,
          textEn: testimonial.text?.en || "",
          textAr: testimonial.text?.ar || "",
          image: testimonial.image || "",
        });
      } catch {
        toast("Failed to load testimonial", "error");
        router.push("/admin/testimonials");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router, toast]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nameEn || !form.nameAr) {
      toast("Name is required in both languages", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: { en: form.nameEn, ar: form.nameAr },
        service: { en: form.serviceEn, ar: form.serviceAr },
        branch: form.branch,
        rating: form.rating,
        text: { en: form.textEn, ar: form.textAr },
        image: form.image,
      };

      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update testimonial");
      }

      toast("Testimonial updated successfully", "success");
      router.push("/admin/testimonials");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update testimonial", "error");
    } finally {
      setSaving(false);
    }
  }

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
      <TopBar title="Edit Testimonial">
        <Link
          href="/admin/testimonials"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <BilingualInput
            label="Name"
            nameEn="nameEn"
            nameAr="nameAr"
            valueEn={form.nameEn}
            valueAr={form.nameAr}
            onChangeEn={(v) => update("nameEn", v)}
            onChangeAr={(v) => update("nameAr", v)}
            required
          />

          {/* Service */}
          <BilingualInput
            label="Service"
            nameEn="serviceEn"
            nameAr="serviceAr"
            valueEn={form.serviceEn}
            valueAr={form.serviceAr}
            onChangeEn={(v) => update("serviceEn", v)}
            onChangeAr={(v) => update("serviceAr", v)}
          />

          {/* Branch & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Branch">
              <select
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors bg-white"
              >
                <option value="">Select a branch...</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name.en}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Rating">
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => update("rating", star)}
                    className="p-0.5 rounded transition-colors hover:scale-110"
                  >
                    <span
                      className={`material-symbols-outlined text-[28px] transition-colors ${
                        star <= form.rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-300"
                      }`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">{form.rating} / 5</span>
              </div>
            </FormField>
          </div>

          {/* Text */}
          <BilingualTextarea
            label="Testimonial Text"
            nameEn="textEn"
            nameAr="textAr"
            valueEn={form.textEn}
            valueAr={form.textAr}
            onChangeEn={(v) => update("textEn", v)}
            onChangeAr={(v) => update("textAr", v)}
            rows={4}
          />

          {/* Image */}
          <ImageUpload
            value={form.image}
            onChange={(url) => update("image", url)}
            label="Client Image"
          />

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#c8567e] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#a03d5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/testimonials"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
