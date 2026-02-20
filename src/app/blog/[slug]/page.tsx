"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { blogPosts, blogCategories } from "@/data/blog";
import ScrollReveal from "@/components/ScrollReveal";

export default function BlogArticlePage() {
  const { lang, dir, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;

  const post = blogPosts.find((p: any) => p.slug === slug);

  // Related posts: same category, or fallback to others (exclude current)
  const relatedPosts = post
    ? blogPosts
        .filter((p: any) => p.id !== post.id)
        .sort((a: any, b: any) => (a.category === post.category ? -1 : 1))
        .slice(0, 3)
    : [];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (lang === "ar") {
      return date.toLocaleDateString("ar-IQ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ===== Not Found State ===== */
  if (!post) {
    return (
      <div dir={dir} className="bg-[#fbf9fa] min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <span className="material-symbols-outlined text-6xl text-[#8c7284]/40 mb-4 block">
            article
          </span>
          <h1 className="text-2xl font-bold text-[#333333] mb-2">
            {t({ en: "Article Not Found", ar: "\u0627\u0644\u0645\u0642\u0627\u0644 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f" })}
          </h1>
          <p className="text-[#8c7284] mb-6">
            {t({
              en: "Sorry, we couldn't find the article you're looking for.",
              ar: "\u0639\u0630\u0631\u0627\u064b\u060c \u0644\u0645 \u0646\u062a\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0627\u0644 \u0627\u0644\u0630\u064a \u062a\u0628\u062d\u062b \u0639\u0646\u0647.",
            })}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-primary-dark transition"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            {t({ en: "Back to Blog", ar: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0648\u0651\u0646\u0629" })}
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel =
    lang === "ar"
      ? blogCategories.find((c: any) => c.en === post.category)?.ar || post.category
      : post.category;

  return (
    <div dir={dir} className="bg-[#fbf9fa] min-h-screen">
      {/* ===== Back Link ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[#8c7284] hover:text-primary transition text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">
            {dir === "rtl" ? "arrow_forward" : "arrow_back"}
          </span>
          {t({ en: "Back to Blog", ar: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062f\u0648\u0651\u0646\u0629" })}
        </Link>
      </div>

      {/* ===== Hero ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <ScrollReveal>
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[21/9]">
            <img
              src={post.image}
              alt={t(post.title)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
              <span className="inline-block w-fit bg-primary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                {categoryLabel}
              </span>
              <h1 className="text-white font-[Playfair_Display] text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 max-w-4xl leading-tight">
                {t(post.title)}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {post.author}
                    </p>
                    <p className="text-white/70 text-xs">
                      {formatDate(post.publishedAt)}
                    </p>
                  </div>
                </div>
                <span className="text-white/50 hidden sm:inline">|</span>
                <span className="text-white/70 text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {t(post.readTime)}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== Article Body ===== */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ScrollReveal>
          <div
            className="
              bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-sm
              [&_h2]:text-2xl [&_h2]:font-[Playfair_Display] [&_h2]:font-bold [&_h2]:text-[#333333] [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#333333] [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:text-[#333333] [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-base
              [&_ul]:my-5 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:rtl:pr-6 [&_ul]:rtl:pl-0
              [&_ol]:my-5 [&_ol]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:rtl:pr-6 [&_ol]:rtl:pl-0
              [&_li]:text-[#333333] [&_li]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-[#333333]
              [&_em]:italic [&_em]:text-[#8c7284]
              [&_blockquote]:border-l-4 [&_blockquote]:rtl:border-l-0 [&_blockquote]:rtl:border-r-4 [&_blockquote]:border-primary [&_blockquote]:bg-[#fbf9fa] [&_blockquote]:rounded-r-xl [&_blockquote]:rtl:rounded-r-none [&_blockquote]:rtl:rounded-l-xl [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:text-[#8c7284] [&_blockquote]:italic
              [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary-dark
              [&_img]:rounded-xl [&_img]:my-6
            "
            dangerouslySetInnerHTML={{ __html: t(post.content) }}
          />
        </ScrollReveal>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-white text-[#8c7284] text-xs px-3 py-1.5 rounded-full border border-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* ===== Author Box ===== */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={post.authorImage}
              alt={post.author}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#fbf9fa] shrink-0"
            />
            <div className="text-center sm:text-start">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                {t({ en: "Written By", ar: "\u0628\u0642\u0644\u0645" })}
              </p>
              <h3 className="text-lg font-bold text-[#333333] mb-2">
                {post.author}
              </h3>
              <p className="text-[#8c7284] text-sm leading-relaxed mb-3">
                {t({
                  en: "A trusted specialist at Faya.iq, dedicated to delivering the highest standard of aesthetic and medical care. Passionate about helping clients achieve their beauty and wellness goals.",
                  ar: "\u0623\u062e\u0635\u0627\u0626\u064a \u0645\u0648\u062b\u0648\u0642 \u0641\u064a \u0641\u0627\u064a\u0627\u060c \u0645\u0644\u062a\u0632\u0645 \u0628\u062a\u0642\u062f\u064a\u0645 \u0623\u0639\u0644\u0649 \u0645\u0639\u0627\u064a\u064a\u0631 \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u062c\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0637\u0628\u064a\u0629. \u0634\u063a\u0648\u0641 \u0628\u0645\u0633\u0627\u0639\u062f\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0639\u0644\u0649 \u062a\u062d\u0642\u064a\u0642 \u0623\u0647\u062f\u0627\u0641\u0647\u0645 \u0641\u064a \u0627\u0644\u062c\u0645\u0627\u0644 \u0648\u0627\u0644\u0639\u0627\u0641\u064a\u0629.",
                })}
              </p>
              <Link
                href="/blog"
                className="text-primary text-sm font-medium hover:text-primary-dark transition inline-flex items-center gap-1"
              >
                {t({ en: "View all articles", ar: "\u0639\u0631\u0636 \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" })}
                <span className="material-symbols-outlined text-[16px]">
                  {dir === "rtl" ? "arrow_back" : "arrow_forward"}
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== Read Next ===== */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ScrollReveal>
            <h2 className="font-[Playfair_Display] text-2xl sm:text-3xl font-bold text-[#333333] mb-8 text-center">
              {t({ en: "Read Next", ar: "\u0627\u0642\u0631\u0623 \u0623\u064a\u0636\u0627\u064b" })}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((rp: any, idx: number) => (
              <ScrollReveal key={rp.id} delay={idx * 100}>
                <Link
                  href={`/blog/${rp.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={rp.image}
                      alt={t(rp.title)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 ltr:left-3 rtl:right-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {lang === "ar"
                        ? blogCategories.find((c: any) => c.en === rp.category)?.ar || rp.category
                        : rp.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-[#333333] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {t(rp.title)}
                    </h3>
                    <p className="text-[#8c7284] text-sm line-clamp-2 mb-4">
                      {t(rp.excerpt)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rp.authorImage}
                          alt={rp.author}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-[#333333] text-xs font-medium">
                          {rp.author}
                        </span>
                      </div>
                      <span className="text-[#8c7284] text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {t(rp.readTime)}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
