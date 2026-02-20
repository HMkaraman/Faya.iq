"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

interface TeamMember {
  id: string;
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  specialization: { en: string; ar: string };
  image: string;
  branches: string[];
  yearsExperience: number;
  [key: string]: unknown;
}

export default function TeamPage() {
  const { t, lang } = useLanguage();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTeam(data);
    } catch {
      toast(t(adminI18n.team.loadFailed), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/team/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setTeam((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast(t(adminI18n.team.deleteSuccess), "success");
    } catch {
      toast(t(adminI18n.team.deleteFailed), "error");
    }
    setDeleteTarget(null);
  }

  const columns = [
    {
      key: "image",
      label: t(adminI18n.common.image),
      render: (item: TeamMember) => (
        <img
          src={item.image}
          alt={item.name?.[lang] || item.name?.en}
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
    },
    {
      key: "name",
      label: t(adminI18n.common.name),
      render: (item: TeamMember) => (
        <span className="font-medium text-gray-900">{item.name?.[lang] || item.name?.en}</span>
      ),
    },
    {
      key: "title",
      label: t(adminI18n.common.title),
      render: (item: TeamMember) => item.title?.[lang] || item.title?.en,
    },
    {
      key: "specialization",
      label: t(adminI18n.team.specialization),
      render: (item: TeamMember) => item.specialization?.[lang] || item.specialization?.en,
    },
    {
      key: "yearsExperience",
      label: t(adminI18n.team.experience),
      render: (item: TeamMember) => (
        <span>{item.yearsExperience} {t(adminI18n.team.years)}</span>
      ),
    },
    {
      key: "branches",
      label: t(adminI18n.sidebar.branches),
      render: (item: TeamMember) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {item.branches.length} {item.branches.length === 1 ? t(adminI18n.team.branchCount) : t(adminI18n.team.branchesCount)}
        </span>
      ),
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
      <TopBar title={t(adminI18n.team.title)}>
        <Link
          href="/admin/team/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t(adminI18n.team.addMember)}
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={team}
          searchKey="name"
          onEdit={(item) => {
            const member = item as unknown as TeamMember;
            router.push(`/admin/team/${member.id}/edit`);
          }}
          onDelete={(item) => setDeleteTarget(item as unknown as TeamMember)}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t(adminI18n.team.deleteTitle)}
        message={t(adminI18n.team.deleteMessage)}
      />
    </div>
  );
}
