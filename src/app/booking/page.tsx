"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { branches, type Branch } from "@/data/branches";
import type { Service } from "@/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface FormData {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  agreePolicy: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STEP_LABELS_EN = ["Branch", "Service", "Date & Time", "Details"];
const STEP_LABELS_AR = ["الفرع", "الخدمة", "التاريخ والوقت", "التفاصيل"];
const TOTAL_STEPS = 4;

const DAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS_AR = ["أح", "اث", "ثل", "أر", "خم", "جم", "سب"];

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

const MORNING_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const AFTERNOON_SLOTS = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
const EVENING_SLOTS = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

const DISABLED_SLOTS = new Set(["10:30", "13:00", "14:30", "18:30", "20:00"]);

/* ------------------------------------------------------------------ */
/*  Helper: Material Symbol icon (inline)                              */
/* ------------------------------------------------------------------ */
function MIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
      {name}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Star Rating                                                        */
/* ------------------------------------------------------------------ */
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400 text-sm">
      {Array.from({ length: 5 }, (_: unknown, i: number) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < full ? "currentColor" : i === full && hasHalf ? "url(#half)" : "none"} stroke="currentColor" strokeWidth={1}>
          {i === full && hasHalf && (
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
          <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.47l-4.94 2.64.94-5.5-4-3.9 5.61-.87L10 1z" />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function BookingPage() {
  const { lang, dir, t } = useLanguage();
  const isRTL = dir === "rtl";

  /* ---- state ---- */
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setAllServices(data))
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"morning" | "afternoon" | "evening">("morning");
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
    agreePolicy: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ---- derived ---- */
  const stepLabels = lang === "ar" ? STEP_LABELS_AR : STEP_LABELS_EN;
  const dayLabels = lang === "ar" ? DAYS_AR : DAYS_EN;
  const monthNames = lang === "ar" ? MONTH_NAMES_AR : MONTH_NAMES_EN;

  const filteredServices = useMemo(() => {
    if (!selectedBranch) return [];
    return allServices.filter((s: Service) => s.branches.includes(selectedBranch.id));
  }, [selectedBranch, allServices]);

  const activeSlots = useMemo(() => {
    if (timeFilter === "morning") return MORNING_SLOTS;
    if (timeFilter === "afternoon") return AFTERNOON_SLOTS;
    return EVENING_SLOTS;
  }, [timeFilter]);

  /* ---- calendar helpers ---- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  function isPastDate(day: number) {
    const d = new Date(calendarYear, calendarMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  }

  function isToday(day: number) {
    return (
      calendarYear === today.getFullYear() &&
      calendarMonth === today.getMonth() &&
      day === today.getDate()
    );
  }

  function isSelectedDate(day: number) {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === calendarYear &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getDate() === day
    );
  }

  function prevMonth() {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  }

  /* ---- navigation ---- */
  function canContinue(): boolean {
    switch (currentStep) {
      case 1:
        return !!selectedBranch;
      case 2:
        return !!selectedService;
      case 3:
        return !!selectedDate && !!selectedTime;
      case 4:
        return formData.fullName.trim() !== "" && formData.phone.trim() !== "" && formData.agreePolicy;
      default:
        return false;
    }
  }

  function handleNext() {
    if (currentStep === TOTAL_STEPS) {
      setIsSubmitted(true);
      return;
    }
    if (canContinue() && currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  /* ---- format helpers ---- */
  function formatDate(d: Date | null) {
    if (!d) return "--/--";
    const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "long", year: "numeric" };
    return d.toLocaleDateString(lang === "ar" ? "ar-IQ" : "en-US", options);
  }

  /* ================================================================ */
  /*  PROGRESS BAR                                                     */
  /* ================================================================ */
  function renderProgressBar() {
    const pct = (currentStep / TOTAL_STEPS) * 100;
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-[#333333]">
            {lang === "ar"
              ? `الخطوة ${currentStep} من ${TOTAL_STEPS}`
              : `Step ${currentStep} of ${TOTAL_STEPS}`}
          </p>
          <p className="text-sm font-semibold text-primary">
            {stepLabels[currentStep - 1]}
          </p>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-3">
          {stepLabels.map((label: string, i: number) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i + 1 <= currentStep
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-[#8c7284]"
                }`}
              >
                {i + 1 <= currentStep - 1 ? (
                  <MIcon name="check" className="!text-sm" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[10px] hidden sm:block ${i + 1 <= currentStep ? "text-primary font-medium" : "text-[#8c7284]"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  STEP 1: SELECT BRANCH                                            */
  /* ================================================================ */
  function renderStep1() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#333333] mb-1">
          {lang === "ar" ? "اختاري الفرع" : "Select Branch"}
        </h2>
        <p className="text-sm text-[#8c7284] mb-5">
          {lang === "ar"
            ? "اختاري الفرع الأقرب إليك"
            : "Choose the branch nearest to you"}
        </p>

        <div className="space-y-3">
          {branches.map((branch: Branch, idx: number) => {
            const isSelected = selectedBranch?.id === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranch(branch)}
                className={`w-full text-start rounded-xl p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-primary bg-primary/5 shadow-sm"
                    : "border border-slate-200 hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Radio indicator */}
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${isSelected ? "border-primary" : "border-slate-300"}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#333333]">{t(branch.name)}</h3>
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <MIcon name="near_me" className="!text-xs" />
                          {lang === "ar" ? "الأقرب" : "Nearest"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8c7284] mt-0.5 flex items-center gap-1">
                      <MIcon name="location_on" className="!text-sm text-[#8c7284]" />
                      {t(branch.address)}
                    </p>
                    <p className="text-xs text-[#8c7284] mt-1 flex items-center gap-1">
                      <MIcon name="schedule" className="!text-xs text-[#8c7284]" />
                      {t(branch.hours)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={branch.rating} />
                      <span className="text-xs text-[#8c7284]">
                        {branch.rating} ({branch.reviewCount.toLocaleString()}{" "}
                        {lang === "ar" ? "تقييم" : "reviews"})
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Map placeholder */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 h-44 flex items-center justify-center">
          <div className="text-center text-[#8c7284]">
            <MIcon name="map" className="!text-4xl mb-1" />
            <p className="text-sm">{lang === "ar" ? "خريطة الموقع" : "Branch Location Map"}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  STEP 2: SELECT SERVICE                                           */
  /* ================================================================ */
  function renderStep2() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#333333] mb-1">
          {lang === "ar" ? "اختاري الخدمة" : "Select Service"}
        </h2>
        <p className="text-sm text-[#8c7284] mb-5">
          {lang === "ar"
            ? `الخدمات المتوفرة في ${t(selectedBranch.name)}`
            : `Services available at ${t(selectedBranch.name)}`}
        </p>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-[#8c7284]">
            <MIcon name="search_off" className="!text-4xl mb-2" />
            <p>{lang === "ar" ? "لا توجد خدمات متاحة" : "No services available"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredServices.map((service: Service) => {
              const isSelected = selectedService?.id === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className={`text-start rounded-xl p-4 transition-all duration-200 relative ${
                    isSelected
                      ? "border-2 border-primary bg-primary/5 shadow-sm"
                      : "border border-slate-200 hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 end-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <MIcon name="check" className="!text-xs text-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MIcon name={service.icon} className="!text-xl text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#333333] text-sm leading-tight">
                        {t(service.name)}
                      </h3>
                      <p className="text-[11px] text-[#8c7284] mt-0.5">{service.category}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#8c7284]">
                        {service.duration && (
                          <span className="flex items-center gap-1">
                            <MIcon name="schedule" className="!text-xs" />
                            {service.duration}
                          </span>
                        )}
                        {service.priceRange && (
                          <span className="flex items-center gap-1">
                            <MIcon name="payments" className="!text-xs" />
                            {t(service.priceRange)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ================================================================ */
  /*  STEP 3: DATE & TIME                                              */
  /* ================================================================ */
  function renderStep3() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#333333] mb-1">
          {lang === "ar" ? "اختاري التاريخ والوقت" : "Select Date & Time"}
        </h2>
        <p className="text-sm text-[#8c7284] mb-5">
          {lang === "ar"
            ? "اختاري الموعد المناسب لك"
            : "Pick a date and time that works for you"}
        </p>

        {/* ---- Calendar ---- */}
        <div className="rounded-xl border border-slate-200 p-4 mb-6">
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MIcon name={isRTL ? "chevron_right" : "chevron_left"} className="!text-xl text-[#333333]" />
            </button>
            <h3 className="font-semibold text-[#333333]">
              {monthNames[calendarMonth]} {calendarYear}
            </h3>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MIcon name={isRTL ? "chevron_left" : "chevron_right"} className="!text-xl text-[#333333]" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {dayLabels.map((d: string) => (
              <div key={d} className="text-center text-xs font-medium text-[#8c7284] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day: number | null, i: number) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const past = isPastDate(day);
              const todayMark = isToday(day);
              const selected = isSelectedDate(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={past}
                  onClick={() => {
                    setSelectedDate(new Date(calendarYear, calendarMonth, day));
                  }}
                  className={`h-10 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                    past
                      ? "text-slate-300 cursor-not-allowed"
                      : selected
                      ? "bg-primary text-white shadow-sm"
                      : "text-[#333333] hover:bg-primary/10"
                  }`}
                >
                  {day}
                  {todayMark && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Time Slots ---- */}
        <div>
          <h3 className="font-semibold text-[#333333] mb-3">
            {lang === "ar" ? "الأوقات المتاحة" : "Available Time Slots"}
          </h3>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {(["morning", "afternoon", "evening"] as const).map((period) => {
              const labels = {
                morning: { en: "Morning", ar: "صباحاً", icon: "wb_sunny" },
                afternoon: { en: "Afternoon", ar: "ظهراً", icon: "wb_cloudy" },
                evening: { en: "Evening", ar: "مساءً", icon: "dark_mode" },
              };
              const active = timeFilter === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => setTimeFilter(period)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-[#8c7284] hover:bg-slate-200"
                  }`}
                >
                  <MIcon name={labels[period].icon} className="!text-base" />
                  {lang === "ar" ? labels[period].ar : labels[period].en}
                </button>
              );
            })}
          </div>

          {/* Slots grid */}
          <div className="grid grid-cols-3 gap-2">
            {activeSlots.map((slot: string) => {
              const disabled = DISABLED_SLOTS.has(slot);
              const selected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    disabled
                      ? "text-slate-300 line-through cursor-not-allowed bg-slate-50"
                      : selected
                      ? "bg-primary/10 border-2 border-primary text-primary"
                      : "border border-slate-200 text-[#333333] hover:border-primary/50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  STEP 4: PERSONAL DETAILS                                         */
  /* ================================================================ */
  function renderStep4() {
    if (isSubmitted) {
      return renderConfirmation();
    }

    return (
      <div>
        <h2 className="text-xl font-bold text-[#333333] mb-1">
          {lang === "ar" ? "بياناتك الشخصية" : "Personal Details"}
        </h2>
        <p className="text-sm text-[#8c7284] mb-5">
          {lang === "ar"
            ? "أدخلي معلوماتك لتأكيد الحجز"
            : "Enter your information to confirm your booking"}
        </p>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              {lang === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <MIcon name="person" className="absolute start-3 top-1/2 -translate-y-1/2 !text-lg text-[#8c7284]" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={lang === "ar" ? "أدخلي اسمك الكامل" : "Enter your full name"}
                className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#333333] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              {lang === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <MIcon name="phone" className="absolute start-3 top-1/2 -translate-y-1/2 !text-lg text-[#8c7284]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={lang === "ar" ? "٠٧XX XXX XXXX" : "07XX XXX XXXX"}
                className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#333333] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              {lang === "ar" ? "البريد الإلكتروني" : "Email"}{" "}
              <span className="text-xs text-[#8c7284]">({lang === "ar" ? "اختياري" : "optional"})</span>
            </label>
            <div className="relative">
              <MIcon name="mail" className="absolute start-3 top-1/2 -translate-y-1/2 !text-lg text-[#8c7284]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={lang === "ar" ? "example@email.com" : "example@email.com"}
                className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#333333] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">
              {lang === "ar" ? "ملاحظات خاصة" : "Special Notes"}{" "}
              <span className="text-xs text-[#8c7284]">({lang === "ar" ? "اختياري" : "optional"})</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={lang === "ar" ? "أي ملاحظات أو طلبات خاصة..." : "Any special requests or notes..."}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#333333] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Policy checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={formData.agreePolicy}
                onChange={(e) => setFormData({ ...formData, agreePolicy: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                {formData.agreePolicy && (
                  <MIcon name="check" className="!text-xs text-white" />
                )}
              </div>
            </div>
            <span className="text-sm text-[#333333]">
              {lang === "ar"
                ? "أوافق على سياسة الإلغاء وشروط الحجز"
                : "I agree to the cancellation policy and booking terms"}{" "}
              <span className="text-primary">*</span>
            </span>
          </label>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  CONFIRMATION                                                     */
  /* ================================================================ */
  function renderConfirmation() {
    return (
      <div className="text-center py-8">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <MIcon name="check_circle" className="!text-5xl text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-[#333333] mb-2">
          {lang === "ar" ? "تم تأكيد الحجز!" : "Booking Confirmed!"}
        </h2>
        <p className="text-sm text-[#8c7284] mb-6 max-w-sm mx-auto">
          {lang === "ar"
            ? "تم تأكيد موعدك بنجاح. سنرسل لك رسالة تأكيد قريباً."
            : "Your appointment has been confirmed successfully. We will send you a confirmation message shortly."}
        </p>

        {/* Summary card */}
        <div className="bg-[#fbf9fa] rounded-xl p-5 text-start max-w-sm mx-auto mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MIcon name="person" className="!text-lg text-primary" />
              <span className="text-sm text-[#333333]">{formData.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <MIcon name="location_on" className="!text-lg text-primary" />
              <span className="text-sm text-[#333333]">{t(selectedBranch.name)}</span>
            </div>
            {selectedService && (
              <div className="flex items-center gap-3">
                <MIcon name={selectedService.icon} className="!text-lg text-primary" />
                <span className="text-sm text-[#333333]">{t(selectedService.name)}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MIcon name="calendar_today" className="!text-lg text-primary" />
              <span className="text-sm text-[#333333]">
                {formatDate(selectedDate)} - {selectedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Add to calendar */}
        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          <MIcon name="calendar_add_on" className="!text-lg" />
          {lang === "ar" ? "إضافة إلى التقويم" : "Add to Calendar"}
        </button>

        <div className="mt-4">
          <Link href="/" className="text-sm text-primary hover:underline">
            {lang === "ar" ? "العودة إلى الرئيسية" : "Back to Homepage"}
          </Link>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  SIDEBAR SUMMARY                                                  */
  /* ================================================================ */
  function renderSummary() {
    const price =
      selectedService?.priceRange
        ? t(selectedService.priceRange)
        : lang === "ar"
        ? "-- د.ع"
        : "-- IQD";

    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-[#333333]">
            {lang === "ar" ? "ملخص الحجز" : "Your Booking"}
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {lang === "ar" ? "مسودة" : "Draft"}
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Branch */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MIcon name="location_on" className="!text-lg text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8c7284]">{lang === "ar" ? "الفرع" : "Location"}</p>
              {selectedBranch ? (
                <>
                  <p className="text-sm font-medium text-[#333333] truncate">{t(selectedBranch.name)}</p>
                  <p className="text-xs text-[#8c7284] truncate">{t(selectedBranch.address)}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400">{lang === "ar" ? "لم يتم الاختيار" : "Not selected yet"}</p>
              )}
            </div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-primary hover:underline flex-shrink-0"
              >
                {lang === "ar" ? "تعديل" : "Edit"}
              </button>
            )}
          </div>

          {/* Service */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MIcon name="spa" className="!text-lg text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8c7284]">{lang === "ar" ? "الخدمة" : "Service"}</p>
              {selectedService ? (
                <>
                  <p className="text-sm font-medium text-[#333333] truncate">{t(selectedService.name)}</p>
                  {selectedService.duration && (
                    <p className="text-xs text-[#8c7284]">{selectedService.duration}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400">{lang === "ar" ? "لم يتم الاختيار" : "Not selected yet"}</p>
              )}
            </div>
            {currentStep > 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-primary hover:underline flex-shrink-0"
              >
                {lang === "ar" ? "تعديل" : "Edit"}
              </button>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MIcon name="calendar_today" className="!text-lg text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8c7284]">{lang === "ar" ? "التاريخ والوقت" : "Date & Time"}</p>
              {selectedDate && selectedTime ? (
                <>
                  <p className="text-sm font-medium text-[#333333] truncate">{formatDate(selectedDate)}</p>
                  <p className="text-xs text-[#8c7284]">{selectedTime}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400">--/--</p>
              )}
            </div>
            {currentStep > 3 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs text-primary hover:underline flex-shrink-0"
              >
                {lang === "ar" ? "تعديل" : "Edit"}
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8c7284]">
                {lang === "ar" ? "التكلفة التقديرية" : "Estimated Total"}
              </span>
              <span className="text-base font-bold text-[#333333]">{price}</span>
            </div>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
            <MIcon name="info" className="!text-lg text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              {lang === "ar"
                ? "لا يلزم الدفع الآن. ستدفعين في العيادة."
                : "No payment required now. You will pay at the clinic."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div dir={dir} className="min-h-screen bg-[#fbf9fa]">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <MIcon name={isRTL ? "arrow_forward" : "arrow_back"} className="!text-lg text-[#333333]" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#333333]">
                {lang === "ar" ? "حجز موعد" : "Book Appointment"}
              </h1>
              <p className="text-xs text-[#8c7284]">
                {lang === "ar"
                  ? "احجزي موعدك في عيادة فايا"
                  : "Schedule your appointment at Faya Clinic"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* ---- Left Column: Steps ---- */}
          <div>
            {/* Progress */}
            {!isSubmitted && renderProgressBar()}

            {/* Step content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {/* Navigation */}
            {!isSubmitted && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  {/* Back */}
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      currentStep === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-100 text-[#333333] hover:bg-slate-200"
                    }`}
                  >
                    <MIcon name={isRTL ? "arrow_forward" : "arrow_back"} className="!text-base" />
                    {lang === "ar" ? "رجوع" : "Back"}
                  </button>

                  {/* Continue / Confirm */}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      canContinue()
                        ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
                        : "bg-primary/40 text-white/70 cursor-not-allowed"
                    }`}
                  >
                    {currentStep === TOTAL_STEPS
                      ? lang === "ar"
                        ? "تأكيد الحجز"
                        : "Confirm Booking"
                      : lang === "ar"
                      ? "متابعة"
                      : "Continue"}
                    <MIcon
                      name={currentStep === TOTAL_STEPS ? "check" : isRTL ? "arrow_back" : "arrow_forward"}
                      className="!text-base"
                    />
                  </button>
                </div>

                {/* WhatsApp alternative */}
                <div className="text-center">
                  <p className="text-sm text-[#8c7284]">
                    {lang === "ar"
                      ? "تفضلين الحجز عبر واتساب؟"
                      : "Prefer to book via WhatsApp?"}{" "}
                    <a
                      href={`https://wa.me/${selectedBranch?.whatsapp || "964770000001"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {lang === "ar" ? "تواصلي معنا" : "Chat with us"}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ---- Right Column: Summary (desktop sticky, mobile bottom) ---- */}
          <div className="hidden lg:block">
            <div className="sticky top-24">{renderSummary()}</div>
          </div>

          {/* Mobile summary - collapsible */}
          <div className="lg:hidden mt-6">{renderSummary()}</div>
        </div>
      </div>
    </div>
  );
}
