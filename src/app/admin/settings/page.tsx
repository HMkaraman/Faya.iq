"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/admin/TopBar";
import FormField from "@/components/admin/FormField";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualTextarea from "@/components/admin/BilingualTextarea";
import TagInput from "@/components/admin/TagInput";
import HeroSettings from "@/components/admin/settings/HeroSettings";
import { useToast } from "@/components/admin/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";
import type { HeroSlide } from "@/types";

interface NavItem {
  href: string;
  label: { en: string; ar: string };
}

interface SettingsData {
  siteName: string;
  logoText: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    hours: { en: string; ar: string };
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
  seo: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    keywords: string[];
  };
  header: {
    navItems: NavItem[];
    ctaText: { en: string; ar: string };
    ctaHref: string;
  };
  footer: {
    description: { en: string; ar: string };
    copyrightYear: number;
  };
  heroSlides: HeroSlide[];
}

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const defaultSettings: SettingsData = {
  siteName: "",
  logoText: "",
  colors: { primary: "#c8567e", primaryDark: "#a03d5e", primaryLight: "#e8a0b8" },
  contact: { phone: "", email: "", whatsapp: "", hours: { en: "", ar: "" } },
  social: { facebook: "", instagram: "", tiktok: "", whatsapp: "" },
  seo: { title: { en: "", ar: "" }, description: { en: "", ar: "" }, keywords: [] },
  header: { navItems: [], ctaText: { en: "", ar: "" }, ctaHref: "" },
  footer: { description: { en: "", ar: "" }, copyrightYear: new Date().getFullYear() },
  heroSlides: [],
};

export default function SettingsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    colors: false,
    contact: false,
    social: false,
    seo: false,
    header: false,
    footer: false,
    hero: false,
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings({
          siteName: data.siteName || "",
          logoText: data.logoText || "",
          colors: {
            primary: data.colors?.primary || "#c8567e",
            primaryDark: data.colors?.primaryDark || "#a03d5e",
            primaryLight: data.colors?.primaryLight || "#e8a0b8",
          },
          contact: {
            phone: data.contact?.phone || "",
            email: data.contact?.email || "",
            whatsapp: data.contact?.whatsapp || "",
            hours: {
              en: data.contact?.hours?.en || "",
              ar: data.contact?.hours?.ar || "",
            },
          },
          social: {
            facebook: data.social?.facebook || "",
            instagram: data.social?.instagram || "",
            tiktok: data.social?.tiktok || "",
            whatsapp: data.social?.whatsapp || "",
          },
          seo: {
            title: {
              en: data.seo?.title?.en || "",
              ar: data.seo?.title?.ar || "",
            },
            description: {
              en: data.seo?.description?.en || "",
              ar: data.seo?.description?.ar || "",
            },
            keywords: data.seo?.keywords || [],
          },
          header: {
            navItems: data.header?.navItems || [],
            ctaText: {
              en: data.header?.ctaText?.en || "",
              ar: data.header?.ctaText?.ar || "",
            },
            ctaHref: data.header?.ctaHref || "",
          },
          footer: {
            description: {
              en: data.footer?.description?.en || "",
              ar: data.footer?.description?.ar || "",
            },
            copyrightYear: data.footer?.copyrightYear || new Date().getFullYear(),
          },
          heroSlides: data.heroSlides || [],
        });
      } catch {
        toast(t(adminI18n.settings.loadFailed), "error");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [toast, t]);

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function updateSettings(path: string, value: unknown) {
    setSettings((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  // Nav items helpers
  function addNavItem() {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navItems: [...prev.header.navItems, { href: "", label: { en: "", ar: "" } }],
      },
    }));
  }

  function removeNavItem(index: number) {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navItems: prev.header.navItems.filter((_, i) => i !== index),
      },
    }));
  }

  function updateNavItem(index: number, field: string, value: string) {
    setSettings((prev) => {
      const navItems = [...prev.header.navItems];
      if (field === "href") {
        navItems[index] = { ...navItems[index], href: value };
      } else if (field === "labelEn") {
        navItems[index] = { ...navItems[index], label: { ...navItems[index].label, en: value } };
      } else if (field === "labelAr") {
        navItems[index] = { ...navItems[index], label: { ...navItems[index].label, ar: value } };
      }
      return { ...prev, header: { ...prev.header, navItems } };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save settings");
      }

      toast(t(adminI18n.settings.saveSuccess), "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : t(adminI18n.settings.saveFailed), "error");
    } finally {
      setSaving(false);
    }
  }

  function SectionHeader({ id, title, icon }: { id: string; title: string; icon: string }) {
    const isOpen = openSections[id];
    return (
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-5 text-start hover:bg-gray-50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <span
          className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
    );
  }

  if (loading) {
    return (
      <>
        <TopBar title={t(adminI18n.settings.title)} />
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
      <TopBar title={t(adminI18n.settings.title)} />

      <div className="p-6 max-w-4xl space-y-4">
        {/* General */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="general" title={t(adminI18n.settings.general)} icon="settings" />
          {openSections.general && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              <FormField label={t(adminI18n.settings.siteName)} required>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => updateSettings("siteName", e.target.value)}
                  placeholder={t(adminI18n.settings.siteNamePlaceholder)}
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label={t(adminI18n.settings.logoText)}>
                <input
                  type="text"
                  value={settings.logoText}
                  onChange={(e) => updateSettings("logoText", e.target.value)}
                  placeholder={t(adminI18n.settings.logoTextPlaceholder)}
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="colors" title={t(adminI18n.settings.colors)} icon="palette" />
          {openSections.colors && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">{t(adminI18n.settings.primary)}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.colors.primary}
                      onChange={(e) => updateSettings("colors.primary", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.colors.primary}
                      onChange={(e) => updateSettings("colors.primary", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div
                    className="h-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: settings.colors.primary }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">{t(adminI18n.settings.primaryDark)}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.colors.primaryDark}
                      onChange={(e) => updateSettings("colors.primaryDark", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.colors.primaryDark}
                      onChange={(e) => updateSettings("colors.primaryDark", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div
                    className="h-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: settings.colors.primaryDark }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">{t(adminI18n.settings.primaryLight)}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.colors.primaryLight}
                      onChange={(e) => updateSettings("colors.primaryLight", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.colors.primaryLight}
                      onChange={(e) => updateSettings("colors.primaryLight", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div
                    className="h-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: settings.colors.primaryLight }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="contact" title={t(adminI18n.settings.contactSection)} icon="call" />
          {openSections.contact && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t(adminI18n.common.phone)}>
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => updateSettings("contact.phone", e.target.value)}
                    placeholder={t(adminI18n.settings.phonePlaceholder)}
                    className={INPUT_CLASS}
                  />
                </FormField>

                <FormField label={t(adminI18n.common.email)}>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => updateSettings("contact.email", e.target.value)}
                    placeholder={t(adminI18n.settings.emailPlaceholder)}
                    className={INPUT_CLASS}
                  />
                </FormField>
              </div>

              <FormField label={t(adminI18n.settings.whatsappNumber)}>
                <input
                  type="text"
                  value={settings.contact.whatsapp}
                  onChange={(e) => updateSettings("contact.whatsapp", e.target.value)}
                  placeholder={t(adminI18n.settings.whatsappPlaceholder)}
                  className={INPUT_CLASS}
                />
              </FormField>

              <BilingualInput
                label={t(adminI18n.settings.workingHours)}
                nameEn="contactHoursEn"
                nameAr="contactHoursAr"
                valueEn={settings.contact.hours.en}
                valueAr={settings.contact.hours.ar}
                onChangeEn={(v) => updateSettings("contact.hours.en", v)}
                onChangeAr={(v) => updateSettings("contact.hours.ar", v)}
              />
            </div>
          )}
        </div>

        {/* Social */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="social" title={t(adminI18n.settings.socialMedia)} icon="share" />
          {openSections.social && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              <FormField label={t(adminI18n.settings.facebookUrl)}>
                <input
                  type="url"
                  value={settings.social.facebook}
                  onChange={(e) => updateSettings("social.facebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label={t(adminI18n.settings.instagramUrl)}>
                <input
                  type="url"
                  value={settings.social.instagram}
                  onChange={(e) => updateSettings("social.instagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label={t(adminI18n.settings.tiktokUrl)}>
                <input
                  type="url"
                  value={settings.social.tiktok}
                  onChange={(e) => updateSettings("social.tiktok", e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label={t(adminI18n.settings.whatsappUrl)}>
                <input
                  type="url"
                  value={settings.social.whatsapp}
                  onChange={(e) => updateSettings("social.whatsapp", e.target.value)}
                  placeholder="https://wa.me/..."
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="seo" title={t(adminI18n.settings.seo)} icon="search" />
          {openSections.seo && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              <BilingualInput
                label={t(adminI18n.settings.seoTitle)}
                nameEn="seoTitleEn"
                nameAr="seoTitleAr"
                valueEn={settings.seo.title.en}
                valueAr={settings.seo.title.ar}
                onChangeEn={(v) => updateSettings("seo.title.en", v)}
                onChangeAr={(v) => updateSettings("seo.title.ar", v)}
              />

              <BilingualTextarea
                label={t(adminI18n.settings.seoDescription)}
                nameEn="seoDescEn"
                nameAr="seoDescAr"
                valueEn={settings.seo.description.en}
                valueAr={settings.seo.description.ar}
                onChangeEn={(v) => updateSettings("seo.description.en", v)}
                onChangeAr={(v) => updateSettings("seo.description.ar", v)}
                rows={3}
              />

              <FormField label={t(adminI18n.settings.keywords)}>
                <TagInput
                  value={settings.seo.keywords}
                  onChange={(tags) => updateSettings("seo.keywords", tags)}
                  placeholder={t(adminI18n.settings.keywordsPlaceholder)}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="header" title={t(adminI18n.settings.header)} icon="web" />
          {openSections.header && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              {/* Nav Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">{t(adminI18n.settings.navItems)}</label>
                  <button
                    type="button"
                    onClick={addNavItem}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {t(adminI18n.settings.addNavItem)}
                  </button>
                </div>

                {settings.header.navItems.length === 0 && (
                  <p className="text-sm text-gray-400 py-3 text-center">
                    {t(adminI18n.settings.noNavItems)}
                  </p>
                )}

                {settings.header.navItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.settings.href)}</label>
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => updateNavItem(index, "href", e.target.value)}
                          placeholder={t(adminI18n.settings.hrefPlaceholder)}
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.settings.labelEn)}</label>
                          <input
                            type="text"
                            value={item.label.en}
                            onChange={(e) => updateNavItem(index, "labelEn", e.target.value)}
                            placeholder={t(adminI18n.settings.labelEnPlaceholder)}
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t(adminI18n.settings.labelAr)}</label>
                          <input
                            type="text"
                            value={item.label.ar}
                            onChange={(e) => updateNavItem(index, "labelAr", e.target.value)}
                            placeholder={t(adminI18n.settings.labelArPlaceholder)}
                            dir="rtl"
                            className={INPUT_CLASS}
                            style={{ fontFamily: "var(--font-arabic)" }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNavItem(index)}
                      className="mt-1 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title={t(adminI18n.common.remove)}
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>

              <BilingualInput
                label={t(adminI18n.settings.ctaText)}
                nameEn="ctaTextEn"
                nameAr="ctaTextAr"
                valueEn={settings.header.ctaText.en}
                valueAr={settings.header.ctaText.ar}
                onChangeEn={(v) => updateSettings("header.ctaText.en", v)}
                onChangeAr={(v) => updateSettings("header.ctaText.ar", v)}
              />

              <FormField label={t(adminI18n.settings.ctaLink)}>
                <input
                  type="text"
                  value={settings.header.ctaHref}
                  onChange={(e) => updateSettings("header.ctaHref", e.target.value)}
                  placeholder={t(adminI18n.settings.ctaLinkPlaceholder)}
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Hero Slides */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="hero" title={t(adminI18n.settings.heroSlides)} icon="slideshow" />
          {openSections.hero && (
            <div className="px-6 pb-6 border-t border-gray-100 pt-5">
              <HeroSettings
                slides={settings.heroSlides}
                onChange={(slides) => updateSettings("heroSlides", slides)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeader id="footer" title={t(adminI18n.settings.footer)} icon="bottom_app_bar" />
          {openSections.footer && (
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
              <BilingualTextarea
                label={t(adminI18n.settings.footerDescription)}
                nameEn="footerDescEn"
                nameAr="footerDescAr"
                valueEn={settings.footer.description.en}
                valueAr={settings.footer.description.ar}
                onChangeEn={(v) => updateSettings("footer.description.en", v)}
                onChangeAr={(v) => updateSettings("footer.description.ar", v)}
                rows={3}
              />

              <FormField label={t(adminI18n.settings.copyrightYear)}>
                <input
                  type="number"
                  value={settings.footer.copyrightYear}
                  onChange={(e) =>
                    updateSettings("footer.copyrightYear", parseInt(e.target.value) || new Date().getFullYear())
                  }
                  min={2000}
                  max={2100}
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-2 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saving ? t(adminI18n.common.saving) : t(adminI18n.settings.saveAll)}
          </button>
        </div>
      </div>
    </>
  );
}
