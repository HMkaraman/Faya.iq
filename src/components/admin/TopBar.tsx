"use client";

import React, { useState } from "react";
import { useAdmin } from "./AdminProvider";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";
import ConfirmDialog from "./ConfirmDialog";

interface TopBarProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export default function TopBar({ title, breadcrumbs, children }: TopBarProps) {
  const { user, toggleSidebar } = useAdmin();
  const [showLogout, setShowLogout] = useState(false);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined text-gray-600">menu</span>
            </button>
            <div>
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Action buttons slot */}
            {children}

            {/* User info */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
                <span className="text-sm text-gray-600">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase">
                  {user.role}
                </span>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={showLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the admin dashboard?"
        confirmLabel="Logout"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
    </>
  );
}
