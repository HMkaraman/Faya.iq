"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/TopBar";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  branchId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface BranchRef {
  id: string;
  name: { en: string; ar: string };
}

interface ServiceRef {
  id: string;
  name: { en: string; ar: string };
}

export default function BookingsPage() {
  const { t, lang } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<BranchRef[]>([]);
  const [services, setServices] = useState<ServiceRef[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [bookingsRes, branchesRes, servicesRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/branches"),
        fetch("/api/services"),
      ]);

      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
      setBookings(await bookingsRes.json());

      if (branchesRes.ok) setBranches(await branchesRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
    } catch {
      toast(t(adminI18n.bookings.loadFailed), "error");
    } finally {
      setLoading(false);
    }
  }

  function getBranchName(branchId: string): string {
    const branch = branches.find((b) => b.id === branchId);
    return branch?.name?.[lang] || branch?.name?.en || branchId;
  }

  function getServiceName(serviceId: string): string {
    const service = services.find((s) => s.id === serviceId);
    return service?.name?.[lang] || service?.name?.en || serviceId;
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  const columns = [
    {
      key: "fullName",
      label: t(adminI18n.bookings.fullName),
      render: (item: Booking) => (
        <span className="font-medium text-gray-900">{item.fullName}</span>
      ),
    },
    {
      key: "phone",
      label: t(adminI18n.common.phone),
      render: (item: Booking) => (
        <span className="text-sm text-gray-600">{item.phone}</span>
      ),
    },
    {
      key: "branchId",
      label: t(adminI18n.common.branch),
      render: (item: Booking) => (
        <span className="text-sm text-gray-600">{getBranchName(item.branchId)}</span>
      ),
    },
    {
      key: "serviceId",
      label: t(adminI18n.common.service),
      render: (item: Booking) => (
        <span className="text-sm text-gray-600">{getServiceName(item.serviceId)}</span>
      ),
    },
    {
      key: "date",
      label: t(adminI18n.common.date),
      render: (item: Booking) => (
        <span className="text-sm text-gray-600">{item.date}</span>
      ),
    },
    {
      key: "time",
      label: t(adminI18n.bookings.time),
      render: (item: Booking) => (
        <span className="text-sm text-gray-600">{item.time}</span>
      ),
    },
    {
      key: "status",
      label: t(adminI18n.common.status),
      render: (item: Booking) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      label: t(adminI18n.bookings.created),
      render: (item: Booking) => (
        <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar title={t(adminI18n.bookings.title)} />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={t(adminI18n.bookings.title)} />

      <div className="p-6">
        <DataTable
          columns={columns}
          data={bookings}
          searchKey="fullName"
          onEdit={(item) => {
            const booking = item as unknown as Booking;
            router.push(`/admin/bookings/${booking.id}`);
          }}
        />
      </div>
    </>
  );
}
