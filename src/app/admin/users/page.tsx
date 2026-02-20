"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { useToast } from "@/components/admin/ToastProvider";
import { useAdmin } from "@/components/admin/AdminProvider";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  [key: string]: unknown;
}

const roleBadgeColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: "bg-purple-100", text: "text-purple-800" },
  editor: { bg: "bg-blue-100", text: "text-blue-800" },
  viewer: { bg: "bg-gray-100", text: "text-gray-600" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete");
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast("User deleted successfully", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete user", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  function formatDate(dateStr?: string): string {
    if (!dateStr) return "Never";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item: User) => (
        <span className="font-medium text-gray-900">{item.name}</span>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (item: User) => (
        <span className="text-sm text-gray-600">{item.username}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item: User) => (
        <span className="text-sm text-gray-600">{item.email}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (item: User) => {
        const colors = roleBadgeColors[item.role] || roleBadgeColors.viewer;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
          >
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
          </span>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (item: User) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (item: User) => (
        <span className="text-sm text-gray-500">{formatDate(item.lastLogin)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar title="Users" />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c8567e] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Users">
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c8567e] text-white text-sm font-medium rounded-lg hover:bg-[#b34469] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add User
        </Link>
      </TopBar>

      <div className="p-6">
        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          onEdit={(item) => {
            const user = item as unknown as User;
            router.push(`/admin/users/${user.id}/edit`);
          }}
          onDelete={(item) => {
            const user = item as unknown as User;
            if (currentUser && user.id === currentUser.id) {
              toast("You cannot delete your own account", "error");
              return;
            }
            setDeleteTarget(user);
          }}
        />
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </>
  );
}
