"use client";

import React, { useEffect, useState, useRef } from "react";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { validate, teamSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { Branch } from "@/types";

export interface TeamFormData {
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  specialization: { en: string; ar: string };
  bio: { en: string; ar: string };
  image: string;
  branches: string[];
  credentials: string[];
  yearsExperience: number;
}

const emptyForm: TeamFormData = {
  name: { en: "", ar: "" }, title: { en: "", ar: "" }, specialization: { en: "", ar: "" },
  bio: { en: "", ar: "" }, image: "", branches: [], credentials: [], yearsExperience: 0,
};

interface TeamFormProps {
  initialData?: TeamFormData;
  onSubmit: (data: TeamFormData) => Promise<void>;
  isSubmitting: boolean;
  formId?: string;
}

export default function TeamForm({ initialData, onSubmit, isSubmitting, formId }: TeamFormProps) {
  const [form, setForm] = useState<TeamFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;
  const { t } = useLanguage();

  useUnsavedChanges(isDirty);

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then(setAllBranches).catch(() => {});
  }, []);

  function updateForm<K extends keyof TeamFormData>(key: K, value: TeamFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function toggleBranch(id: string) {
    setForm((prev) => ({ ...prev, branches: prev.branches.includes(id) ? prev.branches.filter((b) => b !== id) : [...prev.branches, id] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form as unknown as Record<string, unknown>, teamSchema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.teamForm.personalInfo)}</h2>
        <BilingualInput label={t(adminI18n.common.name)} nameEn="name_en" nameAr="name_ar" valueEn={form.name.en} valueAr={form.name.ar} onChangeEn={(v) => updateForm("name", { ...form.name, en: v })} onChangeAr={(v) => updateForm("name", { ...form.name, ar: v })} required />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        <BilingualInput label={t(adminI18n.common.title)} nameEn="title_en" nameAr="title_ar" valueEn={form.title.en} valueAr={form.title.ar} onChangeEn={(v) => updateForm("title", { ...form.title, en: v })} onChangeAr={(v) => updateForm("title", { ...form.title, ar: v })} required />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        <BilingualInput label={t(adminI18n.team.specialization)} nameEn="spec_en" nameAr="spec_ar" valueEn={form.specialization.en} valueAr={form.specialization.ar} onChangeEn={(v) => updateForm("specialization", { ...form.specialization, en: v })} onChangeAr={(v) => updateForm("specialization", { ...form.specialization, ar: v })} />
        <BilingualTextarea label={t(adminI18n.teamForm.bio)} nameEn="bio_en" nameAr="bio_ar" valueEn={form.bio.en} valueAr={form.bio.ar} onChangeEn={(v) => updateForm("bio", { ...form.bio, en: v })} onChangeAr={(v) => updateForm("bio", { ...form.bio, ar: v })} rows={4} />
        <ImageUpload label={t(adminI18n.teamForm.profileImage)} value={form.image} onChange={(url) => updateForm("image", url)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.teamForm.professionalDetails)}</h2>
        <FormField label={t(adminI18n.teamForm.yearsOfExperience)}>
          <input type="number" min={0} value={form.yearsExperience} onChange={(e) => updateForm("yearsExperience", parseInt(e.target.value) || 0)} className={inputClass} />
        </FormField>
        <FormField label={t(adminI18n.teamForm.credentials)}>
          <TagInput value={form.credentials} onChange={(c) => updateForm("credentials", c)} placeholder={t(adminI18n.teamForm.credentialsPlaceholder)} />
        </FormField>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">{t(adminI18n.sidebar.branches)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {allBranches.map((branch) => (
            <label key={branch.id} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={form.branches.includes(branch.id)} onChange={() => toggleBranch(branch.id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-700">{branch.name.en}</span>
            </label>
          ))}
        </div>
      </div>

    </form>
  );
}
