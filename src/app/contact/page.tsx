"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { branches } from "@/data/branches";
import ScrollReveal from "@/components/ScrollReveal";

const serviceOptions = [
  { en: "General Inquiry", ar: "\u0627\u0633\u062a\u0641\u0633\u0627\u0631 \u0639\u0627\u0645" },
  { en: "Skin Care", ar: "\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629" },
  { en: "Hair Care", ar: "\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0634\u0639\u0631" },
  { en: "Injectables", ar: "\u0627\u0644\u062d\u0642\u0646 \u0627\u0644\u062a\u062c\u0645\u064a\u0644\u064a\u0629" },
  { en: "Laser", ar: "\u0627\u0644\u0644\u064a\u0632\u0631" },
  { en: "Surgical", ar: "\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062c\u0631\u0627\u062d\u064a\u0629" },
  { en: "Other", ar: "\u0623\u062e\u0631\u0649" },
];

const faqData = [
  {
    q: {
      en: "Do I need a consultation before treatment?",
      ar: "\u0647\u0644 \u0623\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u0639\u0644\u0627\u062c\u061f",
    },
    a: {
      en: "Yes, all new clients are required to have a consultation with one of our doctors before any procedure. This ensures your treatment plan is safe and tailored to your specific needs and goals.",
      ar: "\u0646\u0639\u0645\u060c \u064a\u062c\u0628 \u0639\u0644\u0649 \u062c\u0645\u064a\u0639 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062c\u062f\u062f \u0625\u062c\u0631\u0627\u0621 \u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0645\u0639 \u0623\u062d\u062f \u0623\u0637\u0628\u0627\u0626\u0646\u0627 \u0642\u0628\u0644 \u0623\u064a \u0625\u062c\u0631\u0627\u0621. \u0647\u0630\u0627 \u064a\u0636\u0645\u0646 \u0623\u0646 \u062e\u0637\u0629 \u0639\u0644\u0627\u062c\u0643 \u0622\u0645\u0646\u0629 \u0648\u0645\u0635\u0645\u0645\u0629 \u062e\u0635\u064a\u0635\u0627\u064b \u0644\u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a\u0643 \u0648\u0623\u0647\u062f\u0627\u0641\u0643.",
    },
  },
  {
    q: {
      en: "What payment methods do you accept?",
      ar: "\u0645\u0627 \u0647\u064a \u0637\u0631\u0642 \u0627\u0644\u062f\u0641\u0639 \u0627\u0644\u062a\u064a \u062a\u0642\u0628\u0644\u0648\u0646\u0647\u0627\u061f",
    },
    a: {
      en: "We accept cash, major credit cards (Visa, Mastercard), and bank transfers. For certain procedures, we also offer flexible installment plans. Please inquire at reception for details.",
      ar: "\u0646\u0642\u0628\u0644 \u0627\u0644\u062f\u0641\u0639 \u0646\u0642\u062f\u0627\u064b \u0648\u0628\u0637\u0627\u0642\u0627\u062a \u0627\u0644\u0627\u0626\u062a\u0645\u0627\u0646 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 (\u0641\u064a\u0632\u0627\u060c \u0645\u0627\u0633\u062a\u0631\u0643\u0627\u0631\u062f) \u0648\u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629. \u0644\u0628\u0639\u0636 \u0627\u0644\u0625\u062c\u0631\u0627\u0621\u0627\u062a\u060c \u0646\u0642\u062f\u0645 \u0623\u064a\u0636\u0627\u064b \u062e\u0637\u0637 \u0623\u0642\u0633\u0627\u0637 \u0645\u0631\u0646\u0629. \u064a\u0631\u062c\u0649 \u0627\u0644\u0627\u0633\u062a\u0641\u0633\u0627\u0631 \u0641\u064a \u0627\u0644\u0627\u0633\u062a\u0642\u0628\u0627\u0644 \u0644\u0644\u062a\u0641\u0627\u0635\u064a\u0644.",
    },
  },
  {
    q: {
      en: "How do I cancel or reschedule?",
      ar: "\u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u064a \u0625\u0644\u063a\u0627\u0621 \u0623\u0648 \u0625\u0639\u0627\u062f\u0629 \u062c\u062f\u0648\u0644\u0629 \u0627\u0644\u0645\u0648\u0639\u062f\u061f",
    },
    a: {
      en: "You can cancel or reschedule your appointment by calling us or via WhatsApp at least 24 hours in advance. Late cancellations may be subject to a cancellation fee for certain premium services.",
      ar: "\u064a\u0645\u0643\u0646\u0643 \u0625\u0644\u063a\u0627\u0621 \u0623\u0648 \u0625\u0639\u0627\u062f\u0629 \u062c\u062f\u0648\u0644\u0629 \u0645\u0648\u0639\u062f\u0643 \u0628\u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u0646\u0627 \u0623\u0648 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628 \u0642\u0628\u0644 \u0662\u0664 \u0633\u0627\u0639\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644. \u0642\u062f \u062a\u062e\u0636\u0639 \u0627\u0644\u0625\u0644\u063a\u0627\u0621\u0627\u062a \u0627\u0644\u0645\u062a\u0623\u062e\u0631\u0629 \u0644\u0631\u0633\u0648\u0645 \u0625\u0644\u063a\u0627\u0621 \u0644\u0628\u0639\u0636 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0645\u064a\u0632\u0629.",
    },
  },
  {
    q: {
      en: "Are your doctors certified?",
      ar: "\u0647\u0644 \u0623\u0637\u0628\u0627\u0624\u0643\u0645 \u0645\u0639\u062a\u0645\u062f\u0648\u0646\u061f",
    },
    a: {
      en: "Absolutely. All our physicians are board-certified dermatologists and plastic surgeons with extensive training and international experience. We maintain the highest standards of medical practice and safety.",
      ar: "\u0628\u0627\u0644\u062a\u0623\u0643\u064a\u062f. \u062c\u0645\u064a\u0639 \u0623\u0637\u0628\u0627\u0626\u0646\u0627 \u0647\u0645 \u0623\u062e\u0635\u0627\u0626\u064a\u0648 \u062c\u0644\u062f\u064a\u0629 \u0648\u062c\u0631\u0627\u062d\u0629 \u062a\u062c\u0645\u064a\u0644\u064a\u0629 \u0645\u0639\u062a\u0645\u062f\u0648\u0646 \u0645\u0639 \u062a\u062f\u0631\u064a\u0628 \u0645\u0643\u062b\u0641 \u0648\u062e\u0628\u0631\u0629 \u062f\u0648\u0644\u064a\u0629. \u0646\u062d\u0627\u0641\u0638 \u0639\u0644\u0649 \u0623\u0639\u0644\u0649 \u0645\u0639\u0627\u064a\u064a\u0631 \u0627\u0644\u0645\u0645\u0627\u0631\u0633\u0629 \u0627\u0644\u0637\u0628\u064a\u0629 \u0648\u0627\u0644\u0633\u0644\u0627\u0645\u0629.",
    },
  },
  {
    q: {
      en: "Do you offer package deals?",
      ar: "\u0647\u0644 \u062a\u0642\u062f\u0645\u0648\u0646 \u0639\u0631\u0648\u0636 \u0628\u0627\u0642\u0627\u062a\u061f",
    },
    a: {
      en: "Yes, we offer various package deals on popular treatments like laser sessions, facials, and injectables. Check our Offers page or ask our team during your consultation for current promotions.",
      ar: "\u0646\u0639\u0645\u060c \u0646\u0642\u062f\u0645 \u0639\u0631\u0648\u0636 \u0628\u0627\u0642\u0627\u062a \u0645\u062a\u0646\u0648\u0639\u0629 \u0639\u0644\u0649 \u0627\u0644\u0639\u0644\u0627\u062c\u0627\u062a \u0627\u0644\u0634\u0627\u0626\u0639\u0629 \u0645\u062b\u0644 \u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0644\u064a\u0632\u0631 \u0648\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0648\u062c\u0647 \u0648\u0627\u0644\u062d\u0642\u0646. \u062a\u0641\u0642\u062f \u0635\u0641\u062d\u0629 \u0627\u0644\u0639\u0631\u0648\u0636 \u0623\u0648 \u0627\u0633\u0623\u0644 \u0641\u0631\u064a\u0642\u0646\u0627 \u062e\u0644\u0627\u0644 \u0627\u0633\u062a\u0634\u0627\u0631\u062a\u0643 \u0644\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062d\u0627\u0644\u064a\u0629.",
    },
  },
  {
    q: {
      en: "Is parking available?",
      ar: "\u0647\u0644 \u062a\u062a\u0648\u0641\u0631 \u0645\u0648\u0627\u0642\u0641 \u0644\u0644\u0633\u064a\u0627\u0631\u0627\u062a\u061f",
    },
    a: {
      en: "Yes, all our branches provide free parking for clients. Our Baghdad Al Mansour and Erbil locations have dedicated parking lots, and our Basra branch has convenient street-level access.",
      ar: "\u0646\u0639\u0645\u060c \u062a\u0648\u0641\u0631 \u062c\u0645\u064a\u0639 \u0641\u0631\u0648\u0639\u0646\u0627 \u0645\u0648\u0627\u0642\u0641 \u0645\u062c\u0627\u0646\u064a\u0629 \u0644\u0644\u0639\u0645\u0644\u0627\u0621. \u0641\u0631\u0639\u0627 \u0628\u063a\u062f\u0627\u062f \u0627\u0644\u0645\u0646\u0635\u0648\u0631 \u0648\u0623\u0631\u0628\u064a\u0644 \u0644\u062f\u064a\u0647\u0645\u0627 \u0645\u0648\u0627\u0642\u0641 \u0645\u062e\u0635\u0635\u0629\u060c \u0648\u0641\u0631\u0639 \u0627\u0644\u0628\u0635\u0631\u0629 \u064a\u0648\u0641\u0631 \u0648\u0635\u0648\u0644\u0627\u064b \u0633\u0647\u0644\u0627\u064b \u0645\u0646 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0634\u0627\u0631\u0639.",
    },
  },
];

const socialLinks = [
  { icon: "Instagram", href: "https://instagram.com/faya.iq", label: "Instagram" },
  { icon: "Facebook", href: "https://facebook.com/faya.iq", label: "Facebook" },
  { icon: "Tiktok", href: "https://tiktok.com/@faya.iq", label: "TikTok" },
  { icon: "Snapchat", href: "https://snapchat.com/add/faya.iq", label: "Snapchat" },
];

export default function ContactPage() {
  const { lang, dir, t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    service: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      branch: "",
      service: "",
      message: "",
    });
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#333333] placeholder:text-[#8c7284]/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  return (
    <div dir={dir} className="bg-[#fbf9fa] min-h-screen">
      {/* ===== Success Toast ===== */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-white border border-green-200 shadow-elevated rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500 text-[24px]">check_circle</span>
            <div>
              <p className="font-semibold text-[#333333] text-sm">
                {t({ en: "Message Sent!", ar: "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629!" })}
              </p>
              <p className="text-[#8c7284] text-xs">
                {t({
                  en: "We'll get back to you within 24 hours.",
                  ar: "\u0633\u0646\u0639\u0648\u062f \u0625\u0644\u064a\u0643 \u062e\u0644\u0627\u0644 \u0662\u0664 \u0633\u0627\u0639\u0629.",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Hero ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <ScrollReveal>
            <h1 className="font-[Playfair_Display] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#333333] mb-4">
              {t({ en: "Get in Touch", ar: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627" })}
            </h1>
            <p className="text-[#8c7284] text-base sm:text-lg max-w-2xl mx-auto">
              {t({
                en: "Have a question or ready to book? Reach out to us and our team will be happy to help you on your beauty journey.",
                ar: "\u0644\u062f\u064a\u0643 \u0633\u0624\u0627\u0644 \u0623\u0648 \u0645\u0633\u062a\u0639\u062f \u0644\u0644\u062d\u062c\u0632\u061f \u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0648\u0633\u064a\u0633\u0639\u062f \u0641\u0631\u064a\u0642\u0646\u0627 \u0628\u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0641\u064a \u0631\u062d\u0644\u0629 \u062c\u0645\u0627\u0644\u0643.",
              })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Contact Form + Branch Cards (Two Column) ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Contact Form */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <h2 className="font-[Playfair_Display] text-xl sm:text-2xl font-bold text-[#333333] mb-1">
                  {t({ en: "Send Us a Message", ar: "\u0623\u0631\u0633\u0644 \u0644\u0646\u0627 \u0631\u0633\u0627\u0644\u0629" })}
                </h2>
                <p className="text-[#8c7284] text-sm mb-6">
                  {t({
                    en: "Fill out the form below and we'll respond promptly.",
                    ar: "\u0627\u0645\u0644\u0623 \u0627\u0644\u0646\u0645\u0648\u0630\u062c \u0623\u062f\u0646\u0627\u0647 \u0648\u0633\u0646\u0631\u062f \u0639\u0644\u064a\u0643 \u0628\u0623\u0633\u0631\u0639 \u0648\u0642\u062a.",
                  })}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1.5">
                      {t({ en: "Full Name", ar: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" })}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder={t({ en: "Enter your full name", ar: "\u0623\u062f\u062e\u0644 \u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644" })}
                      className={inputClasses}
                    />
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1.5">
                        {t({ en: "Email", ar: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" })}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t({ en: "your@email.com", ar: "your@email.com" })}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1.5">
                        {t({ en: "Phone", ar: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641" })}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t({ en: "+964 7XX XXX XXXX", ar: "+964 7XX XXX XXXX" })}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Branch & Service Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1.5">
                        {t({ en: "Preferred Branch", ar: "\u0627\u0644\u0641\u0631\u0639 \u0627\u0644\u0645\u0641\u0636\u0644" })}
                      </label>
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="">
                          {t({ en: "Select a branch", ar: "\u0627\u062e\u062a\u0631 \u0641\u0631\u0639\u0627\u064b" })}
                        </option>
                        {branches.map((b: any) => (
                          <option key={b.id} value={b.id}>
                            {t(b.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1.5">
                        {t({ en: "Service Interest", ar: "\u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629" })}
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="">
                          {t({ en: "Select a service", ar: "\u0627\u062e\u062a\u0631 \u062e\u062f\u0645\u0629" })}
                        </option>
                        {serviceOptions.map((s: any, i: number) => (
                          <option key={i} value={s.en}>
                            {t(s)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1.5">
                      {t({ en: "Message", ar: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629" })}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      placeholder={t({
                        en: "Tell us how we can help you...",
                        ar: "\u0623\u062e\u0628\u0631\u0646\u0627 \u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u0627 \u0645\u0633\u0627\u0639\u062f\u062a\u0643...",
                      })}
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-3.5 rounded-full transition-all duration-300 shadow-soft hover:shadow-glow flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    {t({ en: "Send Message", ar: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629" })}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Branch Contact Cards + Social */}
          <div className="lg:col-span-2 space-y-6">
            {branches.map((branch: any, idx: number) => (
              <ScrollReveal key={branch.id} delay={idx * 100}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-[#333333] text-lg mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
                    {t(branch.name)}
                  </h3>

                  <div className="space-y-3 text-sm">
                    {/* Address */}
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#8c7284] mt-0.5 shrink-0">home</span>
                      <span className="text-[#8c7284]">{t(branch.address)}</span>
                    </div>

                    {/* Phone (click-to-call) */}
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#8c7284] shrink-0">call</span>
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, "")}`}
                        className="text-[#333333] font-medium hover:text-primary transition"
                        dir="ltr"
                      >
                        {branch.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#8c7284] shrink-0">mail</span>
                      <a
                        href={`mailto:${branch.email}`}
                        className="text-[#333333] hover:text-primary transition"
                      >
                        {branch.email}
                      </a>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#8c7284] mt-0.5 shrink-0">schedule</span>
                      <span className="text-[#8c7284]">{t(branch.hours)}</span>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${branch.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white text-sm font-medium px-5 py-2.5 rounded-full transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t({ en: "WhatsApp", ar: "\u0648\u0627\u062a\u0633\u0627\u0628" })}
                  </a>
                </div>
              </ScrollReveal>
            ))}

            {/* Social Media */}
            <ScrollReveal delay={300}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#333333] text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">share</span>
                  {t({ en: "Follow Us", ar: "\u062a\u0627\u0628\u0639\u0646\u0627" })}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social: any) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-11 h-11 rounded-full bg-[#fbf9fa] border border-gray-100 flex items-center justify-center text-[#8c7284] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    >
                      <span className="text-sm font-semibold">
                        {social.label.charAt(0)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-[Playfair_Display] text-2xl sm:text-3xl font-bold text-[#333333] mb-3">
              {t({ en: "Frequently Asked Questions", ar: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629" })}
            </h2>
            <p className="text-[#8c7284] text-sm sm:text-base max-w-xl mx-auto">
              {t({
                en: "Find quick answers to the most common questions about our services and policies.",
                ar: "\u0627\u0628\u062d\u062b \u0639\u0646 \u0625\u062c\u0627\u0628\u0627\u062a \u0633\u0631\u064a\u0639\u0629 \u0644\u0623\u0643\u062b\u0631 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0634\u064a\u0648\u0639\u0627\u064b \u062d\u0648\u0644 \u062e\u062f\u0645\u0627\u062a\u0646\u0627 \u0648\u0633\u064a\u0627\u0633\u0627\u062a\u0646\u0627.",
              })}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqData.map((faq: any, idx: number) => (
            <ScrollReveal key={idx} delay={idx * 50}>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-start"
                >
                  <span className="font-medium text-[#333333] text-sm sm:text-base flex-1 ltr:pr-4 rtl:pl-4">
                    {t(faq.q)}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-primary transition-transform duration-300 shrink-0 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === idx ? "max-h-60 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="px-6 text-[#8c7284] text-sm leading-relaxed">
                    {t(faq.a)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== Map Placeholder ===== */}
      <section className="w-full">
        <ScrollReveal>
          <div className="bg-gray-200 w-full h-64 sm:h-80 lg:h-96 relative flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-[#8c7284]/40 mb-3 block">map</span>
              <p className="text-[#8c7284] font-medium">
                {t({ en: "Interactive Map Coming Soon", ar: "\u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u062a\u0641\u0627\u0639\u0644\u064a\u0629 \u0642\u0631\u064a\u0628\u0627\u064b" })}
              </p>
              <p className="text-[#8c7284]/60 text-sm mt-1">
                {t({
                  en: "View all our branches across Iraq",
                  ar: "\u0639\u0631\u0636 \u062c\u0645\u064a\u0639 \u0641\u0631\u0648\u0639\u0646\u0627 \u0641\u064a \u0627\u0644\u0639\u0631\u0627\u0642",
                })}
              </p>
            </div>
            {/* Decorative dots to suggest map */}
            {branches.map((b: any, i: number) => (
              <div
                key={b.id}
                className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md animate-pulse-soft"
                style={{
                  top: `${30 + i * 20}%`,
                  left: `${25 + i * 22}%`,
                }}
                title={t(b.name)}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
