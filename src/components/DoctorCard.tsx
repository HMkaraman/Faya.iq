"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import type { TeamMember, Branch } from "@/types";

interface DoctorCardProps {
  member: TeamMember;
  branches: Branch[];
  variant: "full" | "compact";
  delay?: number;
}

export default function DoctorCard({ member, branches, variant, delay = 0 }: DoctorCardProps) {
  const { dir, t } = useLanguage();
  const isRTL = dir === "rtl";
  const [bioExpanded, setBioExpanded] = useState(false);

  const memberBranches = branches.filter((b) => member.branches.includes(b.id));

  return (
    <ScrollReveal delay={delay}>
      <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image */}
        <div className={`relative overflow-hidden ${variant === "full" ? "aspect-[4/5]" : "h-56"}`}>
          <img
            src={member.image}
            alt={t(member.name)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Name + title overlay on image */}
          <div className="absolute bottom-0 inset-x-0 p-5">
            <h3 className="text-lg font-bold text-white">
              {t(member.name)}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-white/80">
              {t(member.title)}
            </p>
          </div>
          {/* Experience badge */}
          <div className="absolute top-4 end-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
            <span dir="ltr">{member.yearsExperience}</span> {t({ en: "yrs", ar: "سنة" })}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {variant === "full" && (
            <p className="text-xs text-[#8c7284]">
              {t(member.specialization)}
            </p>
          )}

          {/* Branch pills */}
          {memberBranches.length > 0 && (
            <div className={`${variant === "full" ? "mt-3" : "mt-2"} flex flex-wrap items-center gap-1.5`}>
              {memberBranches.map((branch) => (
                <span
                  key={branch.id}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                >
                  <svg className="h-3 w-3 shrink-0 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {t(branch.city)}
                </span>
              ))}
            </div>
          )}

          {/* Credentials — full variant only */}
          {variant === "full" && member.credentials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {member.credentials.map((cred, i) => (
                <span
                  key={i}
                  dir="ltr"
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-[#333333]/70"
                >
                  {cred}
                </span>
              ))}
            </div>
          )}

          {/* Bio — full variant only */}
          {variant === "full" && t(member.bio) && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p
                className={`text-sm leading-relaxed text-[#8c7284] ${
                  !bioExpanded ? "line-clamp-3" : ""
                }`}
              >
                {t(member.bio)}
              </p>
              {t(member.bio).length > 120 && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  {bioExpanded
                    ? t({ en: "Show less", ar: "عرض أقل" })
                    : t({ en: "Read more", ar: "اقرأ المزيد" })}
                  <svg
                    className={`h-3 w-3 transition-transform ${bioExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    </ScrollReveal>
  );
}
