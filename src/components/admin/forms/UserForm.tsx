"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import { validate, userSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

export interface UserFormData {
  username: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
}

const emptyForm: UserFormData = {
  username: "", email: "", name: "", password: "", role: "editor", isActive: true,
};

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function UserForm({ initialData, onSubmit, isSubmitting }: UserFormProps) {
  const [form, setForm] = useState<UserFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;
  const { t } = useLanguage();

  useUnsavedChanges(isDirty);

  function updateForm<K extends keyof UserFormData>(key: K, value: UserFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const schema = { ...userSchema };
    if (!isEditing) {
      schema.password = { required: true, minLength: 6 };
    }
    const errs = validate(form as unknown as Record<string, unknown>, schema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.userForm.accountInfo)}</h2>
        <FormField label={t(adminI18n.common.name)} required error={errors.name}>
          <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} className={inputClass} />
        </FormField>
        <FormField label={t(adminI18n.users.username)} required error={errors.username}>
          <input type="text" value={form.username} onChange={(e) => updateForm("username", e.target.value)} className={inputClass} />
        </FormField>
        <FormField label={t(adminI18n.common.email)} required error={errors.email}>
          <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputClass} />
        </FormField>
        <FormField label={isEditing ? t(adminI18n.userForm.passwordEdit) : t(adminI18n.userForm.password)} required={!isEditing} error={errors.password}>
          <input type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder={isEditing ? t(adminI18n.userForm.passwordEditPlaceholder) : t(adminI18n.userForm.passwordNewPlaceholder)} className={inputClass} />
        </FormField>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.userForm.roleStatus)}</h2>
        <FormField label={t(adminI18n.users.role)}>
          <select value={form.role} onChange={(e) => updateForm("role", e.target.value as UserFormData["role"])} className={`${inputClass} bg-white`}>
            <option value="admin">{t(adminI18n.userForm.admin)}</option>
            <option value="editor">{t(adminI18n.userForm.editor)}</option>
            <option value="viewer">{t(adminI18n.userForm.viewer)}</option>
          </select>
        </FormField>
        {isEditing && (
          <FormField label={t(adminI18n.common.status)}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => updateForm("isActive", e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              <span className="ml-3 text-sm text-gray-600">{form.isActive ? t(adminI18n.common.active) : t(adminI18n.common.inactive)}</span>
            </label>
          </FormField>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/admin/users" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{t(adminI18n.common.cancel)}</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isSubmitting ? (isEditing ? t(adminI18n.common.saving) : t(adminI18n.common.creating)) : (isEditing ? t(adminI18n.common.saveChanges) : t(adminI18n.userForm.createUser))}
        </button>
      </div>
    </form>
  );
}
