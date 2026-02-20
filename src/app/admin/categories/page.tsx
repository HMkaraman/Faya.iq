"use client";

import React, { useEffect, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import Modal from "@/components/admin/Modal";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import FormField from "@/components/admin/FormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import type { ServiceCategory } from "@/types";

interface CategoryForm {
  slug: string;
  name: { en: string; ar: string };
  icon: string;
  description: { en: string; ar: string };
  image: string;
}

const emptyForm: CategoryForm = {
  slug: "",
  name: { en: "", ar: "" },
  icon: "",
  description: { en: "", ar: "" },
  image: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCategory | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/service-categories");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingSlug(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(category: ServiceCategory) {
    setEditingSlug(category.slug);
    setForm({
      slug: category.slug,
      name: { en: category.name.en, ar: category.name.ar },
      icon: category.icon,
      description: { en: category.description.en, ar: category.description.ar },
      image: category.image,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingSlug(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.en || !form.name.ar) {
      toast("Category name is required in both languages", "error");
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = editingSlug !== null;
      const url = isEdit
        ? `/api/service-categories/${editingSlug}`
        : "/api/service-categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${isEdit ? "update" : "create"} category`);
      }

      toast(
        `Category ${isEdit ? "updated" : "created"} successfully`,
        "success"
      );
      closeModal();
      fetchCategories();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to save category",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/service-categories/${deleteTarget.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCategories((prev) => prev.filter((c) => c.slug !== deleteTarget.slug));
      toast("Category deleted successfully", "success");
    } catch {
      toast("Failed to delete category", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Service Categories" />
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
      <TopBar title="Service Categories">
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Category
        </button>
      </TopBar>

      <div className="p-6">
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300">
              category
            </span>
            <p className="mt-2 text-gray-500">No categories yet.</p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add your first category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                {cat.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name.en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {cat.icon && (
                        <span className="material-symbols-outlined text-[24px] text-primary">
                          {cat.icon}
                        </span>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{cat.name.en}</h3>
                        <p
                          className="text-sm text-gray-500"
                          dir="rtl"
                          style={{ fontFamily: "var(--font-arabic)" }}
                        >
                          {cat.name.ar}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-mono">
                      {cat.slug}
                    </span>
                  </div>

                  {cat.description.en && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {cat.description.en}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingSlug ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <BilingualInput
            label="Name"
            nameEn="cat_name_en"
            nameAr="cat_name_ar"
            valueEn={form.name.en}
            valueAr={form.name.ar}
            onChangeEn={(v) => setForm((prev) => ({ ...prev, name: { ...prev.name, en: v } }))}
            onChangeAr={(v) => setForm((prev) => ({ ...prev, name: { ...prev.name, ar: v } }))}
            required
          />

          <FormField label="Slug">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g. skin-care"
              disabled={editingSlug !== null}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
            />
            {editingSlug && (
              <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation.</p>
            )}
          </FormField>

          <FormField label="Icon (Material Symbol name)">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g. face, spa, bolt"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              {form.icon && (
                <span className="material-symbols-outlined text-[24px] text-primary">
                  {form.icon}
                </span>
              )}
            </div>
          </FormField>

          <BilingualTextarea
            label="Description"
            nameEn="cat_desc_en"
            nameAr="cat_desc_ar"
            valueEn={form.description.en}
            valueAr={form.description.ar}
            onChangeEn={(v) => setForm((prev) => ({ ...prev, description: { ...prev.description, en: v } }))}
            onChangeAr={(v) => setForm((prev) => ({ ...prev, description: { ...prev.description, ar: v } }))}
            rows={3}
          />

          <ImageUpload
            label="Image"
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting
                ? "Saving..."
                : editingSlug
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name.en}"? Services in this category will not be deleted but will lose their category association.`}
      />
    </>
  );
}
