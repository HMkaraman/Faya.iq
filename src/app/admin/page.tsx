"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

interface DashboardData {
  services: number;
  branches: number;
  team: number;
  blog: number;
  testimonials: number;
  bookings: { total: number; recent: Array<Record<string, string>> };
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const [services, branches, team, blog, testimonials, bookings] =
        await Promise.all([
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/branches").then((r) => r.json()),
          fetch("/api/team").then((r) => r.json()),
          fetch("/api/blog").then((r) => r.json()),
          fetch("/api/testimonials").then((r) => r.json()),
          fetch("/api/bookings").then((r) => r.json()),
        ]);
      setData({
        services: services.length,
        branches: branches.length,
        team: team.length,
        blog: blog.length,
        testimonials: testimonials.length,
        bookings: {
          total: bookings.length,
          recent: bookings.slice(-10).reverse(),
        },
      });
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={t(adminI18n.dashboard.title)}>
        <Link
          href="/admin/services/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {t(adminI18n.dashboard.addService)}
        </Link>
      </TopBar>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title={t(adminI18n.dashboard.services)} value={data.services} icon="spa" color="var(--color-primary)" />
          <StatsCard title={t(adminI18n.dashboard.branches)} value={data.branches} icon="location_on" color="#4f46e5" />
          <StatsCard title={t(adminI18n.dashboard.team)} value={data.team} icon="group" color="#0891b2" />
          <StatsCard title={t(adminI18n.dashboard.blogPosts)} value={data.blog} icon="article" color="#059669" />
          <StatsCard title={t(adminI18n.dashboard.testimonials)} value={data.testimonials} icon="format_quote" color="#d97706" />
          <StatsCard title={t(adminI18n.dashboard.bookings)} value={data.bookings.total} icon="calendar_month" color="#dc2626" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/services/new"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">add</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t(adminI18n.dashboard.quickAddService)}</p>
              <p className="text-xs text-gray-500">{t(adminI18n.dashboard.quickAddServiceDesc)}</p>
            </div>
          </Link>
          <Link
            href="/admin/blog/new"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600">edit_note</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t(adminI18n.dashboard.quickNewBlog)}</p>
              <p className="text-xs text-gray-500">{t(adminI18n.dashboard.quickNewBlogDesc)}</p>
            </div>
          </Link>
          <Link
            href="/admin/bookings"
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">visibility</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t(adminI18n.dashboard.quickViewBookings)}</p>
              <p className="text-xs text-gray-500">{t(adminI18n.dashboard.quickViewBookingsDesc)}</p>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{t(adminI18n.dashboard.recentBookings)}</h2>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
              {t(adminI18n.dashboard.viewAll)}
            </Link>
          </div>
          {data.bookings.recent.length === 0 ? (
            <div className="p-8 text-center text-gray-400">{t(adminI18n.dashboard.noBookings)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium">{t(adminI18n.dashboard.client)}</th>
                    <th className="text-start px-4 py-3 font-medium">{t(adminI18n.common.phone)}</th>
                    <th className="text-start px-4 py-3 font-medium">{t(adminI18n.common.date)}</th>
                    <th className="text-start px-4 py-3 font-medium">{t(adminI18n.common.status)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.bookings.recent.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{b.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{b.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{b.date} {b.time}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
