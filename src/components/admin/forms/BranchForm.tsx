"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { validate, branchSchema, type ValidationErrors } from "@/lib/validation";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { Service, TeamMember } from "@/types";

export interface BranchFormData {
  slug: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
  address: { en: string; ar: string };
  phone: string;
  whatsapp: string;
  email: string;
  hours: { en: string; ar: string };
  rating: number;
  reviewCount: number;
  image: string;
  mapUrl: string;
  coordinates: { lat: number; lng: number };
  availableServices: string[];
  hasGallery: boolean;
  teamMembers: string[];
  features: { en: string[]; ar: string[] };
}

const emptyForm: BranchFormData = {
  slug: "", name: { en: "", ar: "" }, city: { en: "", ar: "" }, address: { en: "", ar: "" },
  phone: "", whatsapp: "", email: "", hours: { en: "", ar: "" },
  rating: 5, reviewCount: 0, image: "", mapUrl: "",
  coordinates: { lat: 0, lng: 0 }, availableServices: [], hasGallery: false,
  teamMembers: [], features: { en: [""], ar: [""] },
};

interface BranchFormProps {
  initialData?: BranchFormData;
  onSubmit: (data: BranchFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function BranchForm({ initialData, onSubmit, isSubmitting }: BranchFormProps) {
  const [form, setForm] = useState<BranchFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [services, setServices] = useState<Service[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const initialRef = useRef(JSON.stringify(initialData || emptyForm));
  const isDirty = JSON.stringify(form) !== initialRef.current;
  const isEditing = !!initialData;

  useUnsavedChanges(isDirty);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices).catch(() => {});
    fetch("/api/team").then((r) => r.json()).then(setTeam).catch(() => {});
  }, []);

  function updateForm<K extends keyof BranchFormData>(key: K, value: BranchFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function toggleArrayItem(key: "availableServices" | "teamMembers", id: string) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));
  }

  function addFeatureRow() {
    setForm((prev) => ({ ...prev, features: { en: [...prev.features.en, ""], ar: [...prev.features.ar, ""] } }));
  }

  function removeFeatureRow(index: number) {
    setForm((prev) => ({ ...prev, features: { en: prev.features.en.filter((_, i) => i !== index), ar: prev.features.ar.filter((_, i) => i !== index) } }));
  }

  function updateFeature(index: number, lang: "en" | "ar", value: string) {
    setForm((prev) => ({ ...prev, features: { ...prev.features, [lang]: prev.features[lang].map((item, i) => (i === index ? value : item)) } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form as unknown as Record<string, unknown>, branchSchema);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit(form);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
        <FormField label="Slug" required error={errors.slug}>
          <input type="text" value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} placeholder="e.g. baghdad-main" className={inputClass} />
        </FormField>
        <BilingualInput label="Name" nameEn="name_en" nameAr="name_ar" valueEn={form.name.en} valueAr={form.name.ar} onChangeEn={(v) => updateForm("name", { ...form.name, en: v })} onChangeAr={(v) => updateForm("name", { ...form.name, ar: v })} required />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        <BilingualInput label="City" nameEn="city_en" nameAr="city_ar" valueEn={form.city.en} valueAr={form.city.ar} onChangeEn={(v) => updateForm("city", { ...form.city, en: v })} onChangeAr={(v) => updateForm("city", { ...form.city, ar: v })} />
        <BilingualTextarea label="Address" nameEn="address_en" nameAr="address_ar" valueEn={form.address.en} valueAr={form.address.ar} onChangeEn={(v) => updateForm("address", { ...form.address, en: v })} onChangeAr={(v) => updateForm("address", { ...form.address, ar: v })} rows={2} />
        <ImageUpload label="Image" value={form.image} onChange={(url) => updateForm("image", url)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Phone" required error={errors.phone}>
            <input type="text" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+964..." className={inputClass} />
          </FormField>
          <FormField label="WhatsApp">
            <input type="text" value={form.whatsapp} onChange={(e) => updateForm("whatsapp", e.target.value)} placeholder="+964..." className={inputClass} />
          </FormField>
          <FormField label="Email">
            <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputClass} />
          </FormField>
        </div>
        <BilingualInput label="Working Hours" nameEn="hours_en" nameAr="hours_ar" valueEn={form.hours.en} valueAr={form.hours.ar} onChangeEn={(v) => updateForm("hours", { ...form.hours, en: v })} onChangeAr={(v) => updateForm("hours", { ...form.hours, ar: v })} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Location</h2>
        <FormField label="Map URL">
          <input type="text" value={form.mapUrl} onChange={(e) => updateForm("mapUrl", e.target.value)} placeholder="Google Maps URL..." className={inputClass} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Latitude">
            <input type="number" step="any" value={form.coordinates.lat} onChange={(e) => updateForm("coordinates", { ...form.coordinates, lat: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </FormField>
          <FormField label="Longitude">
            <input type="number" step="any" value={form.coordinates.lng} onChange={(e) => updateForm("coordinates", { ...form.coordinates, lng: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Rating">
            <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => updateForm("rating", parseFloat(e.target.value) || 0)} className={inputClass} />
          </FormField>
          <FormField label="Review Count">
            <input type="number" min={0} value={form.reviewCount} onChange={(e) => updateForm("reviewCount", parseInt(e.target.value) || 0)} className={inputClass} />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Services & Team</h2>
        <FormField label="Available Services">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={form.availableServices.includes(s.id)} onChange={() => toggleArrayItem("availableServices", s.id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700">{s.name.en}</span>
              </label>
            ))}
          </div>
        </FormField>
        <FormField label="Team Members">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {team.map((t) => (
              <label key={t.id} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={form.teamMembers.includes(t.id)} onChange={() => toggleArrayItem("teamMembers", t.id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700">{t.name.en}</span>
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Features</h2>
          <button type="button" onClick={addFeatureRow} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Row
          </button>
        </div>
        {form.features.en.map((_, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">English</label>
                <input type="text" value={form.features.en[index]} onChange={(e) => updateFeature(index, "en", e.target.value)} placeholder="Feature in English..." className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Arabic</label>
                <input type="text" value={form.features.ar[index] || ""} onChange={(e) => updateFeature(index, "ar", e.target.value)} placeholder="...الميزة بالعربي" dir="rtl" className={inputClass} style={{ fontFamily: "var(--font-arabic)" }} />
              </div>
            </div>
            {form.features.en.length > 1 && (
              <button type="button" onClick={() => removeFeatureRow(index)} className="mt-6 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pb-6">
        <Link href="/admin/branches" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Branch")}
        </button>
      </div>
    </form>
  );
}
