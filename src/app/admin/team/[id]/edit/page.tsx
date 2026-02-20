"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import ImageUpload from "@/components/admin/ImageUpload";
import TagInput from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/ToastProvider";

interface BranchOption {
  id: string;
  name: { en: string; ar: string };
}

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors";

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);

  // Form state
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [specEn, setSpecEn] = useState("");
  const [specAr, setSpecAr] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [bioAr, setBioAr] = useState("");
  const [image, setImage] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [credentials, setCredentials] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [memberRes, branchRes] = await Promise.all([
          fetch(`/api/team/${id}`),
          fetch("/api/branches"),
        ]);

        if (!memberRes.ok) throw new Error("Team member not found");

        const member = await memberRes.json();
        if (branchRes.ok) setBranchOptions(await branchRes.json());

        // Populate form
        setNameEn(member.name?.en || "");
        setNameAr(member.name?.ar || "");
        setTitleEn(member.title?.en || "");
        setTitleAr(member.title?.ar || "");
        setSpecEn(member.specialization?.en || "");
        setSpecAr(member.specialization?.ar || "");
        setBioEn(member.bio?.en || "");
        setBioAr(member.bio?.ar || "");
        setImage(member.image || "");
        setSelectedBranches(member.branches || []);
        setCredentials(member.credentials || []);
        setYearsExperience(member.yearsExperience || 0);
      } catch {
        toast("Failed to load team member data", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, toast]);

  function toggleBranch(branchId: string) {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((b) => b !== branchId)
        : [...prev, branchId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      name: { en: nameEn, ar: nameAr },
      title: { en: titleEn, ar: titleAr },
      specialization: { en: specEn, ar: specAr },
      bio: { en: bioEn, ar: bioAr },
      image,
      branches: selectedBranches,
      credentials,
      yearsExperience,
    };

    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update team member");
      }

      toast("Team member updated successfully", "success");
      router.push("/admin/team");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to update team member",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Edit Team Member">
        <Link
          href="/admin/team"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>

            <BilingualInput
              label="Full Name"
              nameEn="nameEn"
              nameAr="nameAr"
              valueEn={nameEn}
              valueAr={nameAr}
              onChangeEn={setNameEn}
              onChangeAr={setNameAr}
              required
            />

            <BilingualInput
              label="Title"
              nameEn="titleEn"
              nameAr="titleAr"
              valueEn={titleEn}
              valueAr={titleAr}
              onChangeEn={setTitleEn}
              onChangeAr={setTitleAr}
              required
            />

            <BilingualInput
              label="Specialization"
              nameEn="specEn"
              nameAr="specAr"
              valueEn={specEn}
              valueAr={specAr}
              onChangeEn={setSpecEn}
              onChangeAr={setSpecAr}
              required
            />

            <BilingualTextarea
              label="Bio"
              nameEn="bioEn"
              nameAr="bioAr"
              valueEn={bioEn}
              valueAr={bioAr}
              onChangeEn={setBioEn}
              onChangeAr={setBioAr}
              rows={4}
            />
          </div>

          {/* Image & Experience */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Media & Experience</h2>

            <ImageUpload value={image} onChange={setImage} label="Profile Image" />

            <FormField label="Years of Experience">
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                min={0}
                className={INPUT_CLASS}
              />
            </FormField>
          </div>

          {/* Branches */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Branches</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {branchOptions.map((branch) => (
                <label
                  key={branch.id}
                  className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(branch.id)}
                    onChange={() => toggleBranch(branch.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#c8567e] focus:ring-[#c8567e]"
                  />
                  <span className="text-sm text-gray-700">{branch.name.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Credentials</h2>

            <FormField label="Credentials & Certifications">
              <TagInput
                value={credentials}
                onChange={setCredentials}
                placeholder="Add credential (press Enter)..."
              />
            </FormField>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/admin/team"
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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
