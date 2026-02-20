"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import TopBar from "@/components/admin/TopBar";
import { useToast } from "@/components/admin/ToastProvider";
import StatusBadge from "@/components/admin/StatusBadge";

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
}

interface BranchRef {
  id: string;
  name: { en: string; ar: string };
}

interface ServiceRef {
  id: string;
  name: { en: string; ar: string };
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [branches, setBranches] = useState<BranchRef[]>([]);
  const [services, setServices] = useState<ServiceRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingRes, branchesRes, servicesRes] = await Promise.all([
          fetch(`/api/bookings/${id}`),
          fetch("/api/branches"),
          fetch("/api/services"),
        ]);

        if (!bookingRes.ok) throw new Error("Booking not found");
        const bookingData = await bookingRes.json();
        setBooking(bookingData);
        setNewStatus(bookingData.status);

        if (branchesRes.ok) setBranches(await branchesRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
      } catch {
        toast("Failed to load booking details", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, toast]);

  function getBranchName(branchId: string): string {
    const branch = branches.find((b) => b.id === branchId);
    return branch?.name?.en || branchId;
  }

  function getServiceName(serviceId: string): string {
    const service = services.find((s) => s.id === serviceId);
    return service?.name?.en || serviceId;
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  async function handleUpdateStatus() {
    if (!booking || newStatus === booking.status) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }

      setBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
      toast("Booking status updated successfully", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Booking Details" />
        <div className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <TopBar title="Booking Details">
          <Link
            href="/admin/bookings"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </Link>
        </TopBar>
        <div className="p-6">
          <div className="text-center py-20 text-gray-400">Booking not found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Booking Details">
        <Link
          href="/admin/bookings"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>
      </TopBar>

      <div className="p-6 max-w-4xl">
        {/* Customer Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">person</span>
            Customer Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
              <p className="text-sm text-gray-900 font-medium">{booking.fullName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
              <p className="text-sm text-gray-900">{booking.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm text-gray-900">{booking.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
            Booking Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Branch</p>
              <p className="text-sm text-gray-900">{getBranchName(booking.branchId)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Service</p>
              <p className="text-sm text-gray-900">{getServiceName(booking.serviceId)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
              <p className="text-sm text-gray-900">{booking.date}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Time</p>
              <p className="text-sm text-gray-900">{booking.time}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Status</p>
              <StatusBadge status={booking.status} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created At</p>
              <p className="text-sm text-gray-900">{formatDate(booking.createdAt)}</p>
            </div>
          </div>

          {booking.notes && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Update Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">edit_note</span>
            Update Status
          </h2>

          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating || newStatus === booking.status}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {updating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
