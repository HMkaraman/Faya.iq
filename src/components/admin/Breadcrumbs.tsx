"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { dir } = useLanguage();
  const chevron = dir === "rtl" ? "chevron_left" : "chevron_right";

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
      <Link href="/admin" className="hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-[16px]">home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-gray-300">{chevron}</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
