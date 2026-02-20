"use client";

import { AdminProvider } from "@/components/admin/AdminProvider";
import { ToastProvider } from "@/components/admin/ToastProvider";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 lg:ml-64">{children}</main>
        </div>
      </ToastProvider>
    </AdminProvider>
  );
}
