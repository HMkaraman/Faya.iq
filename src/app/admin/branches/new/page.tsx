"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/ToastProvider";

interface Category {
  slug: string;
  name: { en: string; ar: string };
}

interface TeamMember {
  id: string;
  name: { en: string; ar: string };
}

interface FeatureRow {
  en: string;
  ar: string;
}

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors";

export default function NewBranchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Form state
  const [slug, setSlug] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [cityEn, setCityEn] = useState("");
  const [cityAr, setCityAr] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [addressAr, setAddressAr] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [hoursEn, setHoursEn] = useState("");
  const [hoursAr, setHoursAr] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [image, setImage] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [features, setFeatures] = useState<FeatureRow[]>([{ en: "", ar: "" }]);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, teamRes] = await Promise.all([
          fetch("/api/service-categories"),
          fetch("/api/team"),
        ]);
        if (catRes.ok) setCategories(await catRes.json());
        if (teamRes.ok) setTeamMembers(await teamRes.json());
      } catch {
        toast("Failed to load reference data", "error");
      }
    }
    loadData();
  }, [toast]);

  function addFeatureRow() {
    setFeatures((prev) => [...prev, { en: "", ar: "" }]);
  }

  function removeFeatureRow(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFeature(index: number, lang: "en" | "ar", value: string) {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [lang]: value } : f))
    );
  }

  function toggleService(slug: string) {
    setAvailableServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleTeamMember(id: string) {
    setSelectedTeam((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      slug,
      name: { en: nameEn, ar: nameAr },
      city: { en: cityEn, ar: cityAr },
      address: { en: addressEn, ar: addressAr },
      phone,
      whatsapp,
      email,
      hours: { en: hoursEn, ar: hoursAr },
      rating,
      reviewCount,
      image,
      mapUrl,
      coordinates: { lat, lng },
      availableServices,
      teamMembers: selectedTeam,
      features: {
        en: features.map((f) => f.en).filter(Boolean),
        ar: features.map((f) => f.ar).filter(Boolean),
      },
    };

    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create branch");
      }

      toast("Branch created successfully", "success");
      router.push("/admin/branches");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create branch", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <TopBar title="New Branch">
        <Link
          href="/admin/branches"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>

            <FormField label="Slug" required>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. baghdad-mansour"
                required
                className={INPUT_CLASS}
              />
            </FormField>

            <BilingualInput
              label="Branch Name"
              nameEn="nameEn"
              nameAr="nameAr"
              valueEn={nameEn}
              valueAr={nameAr}
              onChangeEn={setNameEn}
              onChangeAr={setNameAr}
              required
            />

            <BilingualInput
              label="City"
              nameEn="cityEn"
              nameAr="cityAr"
              valueEn={cityEn}
              valueAr={cityAr}
              onChangeEn={setCityEn}
              onChangeAr={setCityAr}
              required
            />

            <BilingualInput
              label="Address"
              nameEn="addressEn"
              nameAr="addressAr"
              valueEn={addressEn}
              valueAr={addressAr}
              onChangeEn={setAddressEn}
              onChangeAr={setAddressAr}
              required
            />
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone" required>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770 000 0001"
                  required
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label="WhatsApp">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="964770000001"
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>

            <FormField label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="branch@faya.iq"
                className={INPUT_CLASS}
              />
            </FormField>

            <BilingualInput
              label="Working Hours"
              nameEn="hoursEn"
              nameAr="hoursAr"
              valueEn={hoursEn}
              valueAr={hoursAr}
              onChangeEn={setHoursEn}
              onChangeAr={setHoursAr}
            />
          </div>

          {/* Ratings & Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Ratings & Media</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Rating">
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={5}
                  step={0.1}
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label="Review Count">
                <input
                  type="number"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                  min={0}
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>

            <ImageUpload value={image} onChange={setImage} label="Branch Image" />
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Location</h2>

            <FormField label="Map URL">
              <input
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className={INPUT_CLASS}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Latitude">
                <input
                  type="number"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  step={0.0001}
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label="Longitude">
                <input
                  type="number"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  step={0.0001}
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>
          </div>

          {/* Available Services */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Available Services</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={availableServices.includes(cat.slug)}
                    onChange={() => toggleService(cat.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-[#c8567e] focus:ring-[#c8567e]"
                  />
                  <span className="text-sm text-gray-700">{cat.name.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Team Members</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teamMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTeam.includes(member.id)}
                    onChange={() => toggleTeamMember(member.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#c8567e] focus:ring-[#c8567e]"
                  />
                  <span className="text-sm text-gray-700">{member.name.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Features</h2>
              <button
                type="button"
                onClick={addFeatureRow}
                className="text-sm text-[#c8567e] hover:text-[#a03d5e] font-medium flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={feature.en}
                      onChange={(e) => updateFeature(index, "en", e.target.value)}
                      placeholder="Feature (English)"
                      className={INPUT_CLASS}
                    />
                    <input
                      type="text"
                      value={feature.ar}
                      onChange={(e) => updateFeature(index, "ar", e.target.value)}
                      placeholder="...الميزة (عربي)"
                      dir="rtl"
                      className={INPUT_CLASS}
                      style={{ fontFamily: "var(--font-arabic)" }}
                    />
                  </div>
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureRow(index)}
                      className="mt-1.5 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove feature"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/admin/branches"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#c8567e] rounded-lg hover:bg-[#a03d5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? "Creating..." : "Create Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
