"use client";

import React, { useState } from "react";
import Link from "next/link";
import TopBar from "./TopBar";
import ConfirmDialog from "./ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { BreadcrumbItem } from "./Breadcrumbs";

interface FormPageLayoutProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  backHref: string;
  formId: string;
  isSubmitting: boolean;
  isEditing?: boolean;
  submitLabel: string;
  submittingLabel: string;
  onDelete?: () => void;
  children: React.ReactNode;
}

export default function FormPageLayout({
  title,
  breadcrumbs,
  backHref,
  formId,
  isSubmitting,
  isEditing,
  submitLabel,
  submittingLabel,
  onDelete,
  children,
}: FormPageLayoutProps) {
  const { t } = useLanguage();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <TopBar title={title} breadcrumbs={breadcrumbs}>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t(adminI18n.common.back)}
        </Link>
      </TopBar>

      <div className="p-6">
        <div className="flex gap-6">
          {/* Form content */}
          <div className="flex-1 min-w-0 max-w-4xl">
            {children}
          </div>

          {/* Desktop sticky sidebar */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-[73px]">
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t(adminI18n.common.actions)}
                </h3>

                {/* Save button */}
                <button
                  type="submit"
                  form={formId}
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? submittingLabel : submitLabel}
                </button>

                {/* Cancel link */}
                <Link
                  href={backHref}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t(adminI18n.common.cancel)}
                </Link>

                {/* Delete button (edit pages only) */}
                {isEditing && onDelete && (
                  <>
                    <div className="border-t border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      {t(adminI18n.common.deleteItem)}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}
          <div className="flex-1" />
          <Link
            href={backHref}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t(adminI18n.common.cancel)}
          </Link>
          <button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {isEditing && onDelete && (
        <ConfirmDialog
          open={showDeleteConfirm}
          title={t(adminI18n.common.delete)}
          message={t(adminI18n.common.deleteConfirm)}
          confirmLabel={t(adminI18n.common.delete)}
          cancelLabel={t(adminI18n.common.cancel)}
          variant="danger"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
