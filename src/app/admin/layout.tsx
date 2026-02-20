"use client";

import { AdminProvider } from "@/components/admin/AdminProvider";
import { ToastProvider } from "@/components/admin/ToastProvider";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import Sidebar from "@/components/admin/Sidebar";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage();
  return (
    <div className="flex min-h-screen bg-gray-100" dir={dir}>
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AdminProvider>
        <ToastProvider>
          <AdminLayoutInner>{children}</AdminLayoutInner>
        </ToastProvider>
      </AdminProvider>
    </LanguageProvider>
  );
}
