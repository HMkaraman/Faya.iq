"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";

interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  category: string;
  tags: string[];
  author: string;
  authorImage: string;
  image: string;
  publishedAt: string;
  readTime: { en: string; ar: string };
  featured: boolean;
}

const blogCategories = [
  { en: "All Articles", ar: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" },
  { en: "Medical Insights", ar: "\u0631\u0624\u0649 \u0637\u0628\u064a\u0629" },
  { en: "Skin Care Tips", ar: "\u0646\u0635\u0627\u0626\u062d \u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629" },
  { en: "Treatment Guides", ar: "\u0623\u062f\u0644\u0629 \u0627\u0644\u0639\u0644\u0627\u062c" },
  { en: "Case Studies", ar: "\u062f\u0631\u0627\u0633\u0627\u062a \u062d\u0627\u0644\u0629" },
  { en: "Beauty Tips", ar: "\u0646\u0635\u0627\u0626\u062d \u0627\u0644\u062c\u0645\u0627\u0644" },
];

export default function BlogPage() {
  const { lang, dir, t } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setBlogPosts(data))
      .catch(() => setBlogPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9fa]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const featuredPost = blogPosts.find((p: any) => p.featured) || blogPosts[0];

  const filteredPosts = useMemo(() => {
    if (!featuredPost) return [];
    return blogPosts.filter((post: any) => {
      // exclude the featured post from the grid
      if (post.id === featuredPost.id) return false;

      const matchesCategory =
        activeCategory === 0 ||
        post.category === blogCategories[activeCategory].en;

      const matchesSearch =
        searchTerm.trim() === "" ||
        t(post.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(post.excerpt).toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, featuredPost?.id, t]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // Trending posts: top 3 by most recent (excluding featured)
  const trendingPosts = blogPosts
    .filter((p: any) => featuredPost && p.id !== featuredPost.id)
    .slice(0, 3);

  if (!featuredPost) {
    return (
      <div dir={dir} className="bg-[#fbf9fa] min-h-screen flex items-center justify-center">
        <p className="text-[#8c7284] text-lg">
          {t({ en: "No blog posts available.", ar: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0642\u0627\u0644\u0627\u062a \u0645\u062a\u0627\u062d\u0629." })}
        </p>
      </div>
    );
  }

  return (
    <div dir={dir} className="bg-[#fbf9fa] min-h-screen">
      {/* ===== Page Header ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <ScrollReveal>
            <h1 className="font-[Playfair_Display] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#333333] mb-3">
              {t({
                en: "Blog & Medical Insights",
                ar: "\u0627\u0644\u0645\u062f\u0648\u0651\u0646\u0629 \u0648\u0627\u0644\u0631\u0624\u0649 \u0627\u0644\u0637\u0628\u064a\u0629",
              })}
            </h1>
            <p className="text-[#8c7284] text-base sm:text-lg max-w-2xl mx-auto">
              {t({
                en: "Expert advice, treatment guides, and beauty insights from our medical team.",
                ar: "\u0646\u0635\u0627\u0626\u062d \u0627\u0644\u062e\u0628\u0631\u0627\u0621 \u0648\u0623\u062f\u0644\u0629 \u0627\u0644\u0639\u0644\u0627\u062c \u0648\u0631\u0624\u0649 \u0627\u0644\u062c\u0645\u0627\u0644 \u0645\u0646 \u0641\u0631\u064a\u0642\u0646\u0627 \u0627\u0644\u0637\u0628\u064a.",
              })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Featured Article Hero ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <ScrollReveal>
          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="relative w-full rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[21/8]">
              <img
                src={featuredPost.image}
                alt={t(featuredPost.title)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
                <span className="inline-block w-fit bg-primary text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  {t({ en: "Featured Article", ar: "\u0645\u0642\u0627\u0644 \u0645\u0645\u064a\u0651\u0632" })}
                </span>
                <h2 className="text-white font-[Playfair_Display] text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 max-w-3xl leading-tight">
                  {t(featuredPost.title)}
                </h2>
                <p className="text-white/80 text-sm sm:text-base max-w-2xl mb-4 line-clamp-2">
                  {t(featuredPost.excerpt)}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={featuredPost.authorImage}
                    alt={featuredPost.author}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/50"
                  />
                  <span className="text-white/90 text-sm font-medium">
                    {featuredPost.author}
                  </span>
                  <span className="text-white/60 text-sm">|</span>
                  <span className="text-white/70 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {t(featuredPost.readTime)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </section>

      {/* ===== Filter Tabs + Search ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((cat: any, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveCategory(idx);
                  setVisibleCount(4);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === idx
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-[#8c7284] border border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-[#8c7284] text-[20px] ltr:left-3 rtl:right-3">
              search
            </span>
            <input
              type="text"
              placeholder={t({
                en: "Search Insights",
                ar: "\u0627\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a",
              })}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(4);
              }}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-[#333333] placeholder:text-[#8c7284] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>
      </section>

      {/* ===== Main Content Grid + Sidebar ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Blog Grid */}
          <div className="flex-1">
            {visiblePosts.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-5xl text-[#8c7284]/40 mb-4">article</span>
                <p className="text-[#8c7284] text-lg">
                  {t({
                    en: "No articles found matching your criteria.",
                    ar: "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0645\u0642\u0627\u0644\u0627\u062a \u0645\u0637\u0627\u0628\u0642\u0629.",
                  })}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visiblePosts.map((post: any, idx: number) => (
                  <ScrollReveal key={post.id} delay={idx * 100}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image}
                          alt={t(post.title)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 ltr:left-3 rtl:right-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {lang === "ar"
                            ? blogCategories.find((c: any) => c.en === post.category)?.ar || post.category
                            : post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-[#333333] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {t(post.title)}
                        </h3>
                        <p className="text-[#8c7284] text-sm line-clamp-2 mb-4">
                          {t(post.excerpt)}
                        </p>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="text-[#333333] text-xs font-medium">
                              {post.author}
                            </span>
                          </div>
                          <span className="text-[#8c7284] text-xs flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {t(post.readTime)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="inline-flex items-center gap-2 bg-white border border-primary text-primary px-8 py-3 rounded-full font-medium text-sm hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  {t({
                    en: "Load More Articles",
                    ar: "\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a",
                  })}
                </button>
              </div>
            )}
          </div>

          {/* ===== Sidebar (Desktop) ===== */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-8">
            {/* Search Insights */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-[#333333] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">search</span>
                {t({ en: "Search Insights", ar: "\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" })}
              </h4>
              <input
                type="text"
                placeholder={t({
                  en: "Type to search...",
                  ar: "\u0627\u0643\u062a\u0628 \u0644\u0644\u0628\u062d\u062b...",
                })}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(4);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9fa] text-sm text-[#333333] placeholder:text-[#8c7284] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Trending Now */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-[#333333] mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">trending_up</span>
                {t({ en: "Trending Now", ar: "\u0627\u0644\u0623\u0643\u062b\u0631 \u0631\u0648\u0627\u062c\u0627\u064b" })}
              </h4>
              <div className="space-y-4">
                {trendingPosts.map((post: any, idx: number) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <img
                      src={post.image}
                      alt={t(post.title)}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-[#333333] line-clamp-2 group-hover:text-primary transition-colors">
                        {t(post.title)}
                      </h5>
                      <span className="text-xs text-[#8c7284] mt-1 inline-block">
                        {t(post.readTime)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-[#333333] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">label</span>
                {t({ en: "Popular Tags", ar: "\u0627\u0644\u0648\u0633\u0648\u0645 \u0627\u0644\u0634\u0627\u0626\u0639\u0629" })}
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(blogPosts.flatMap((p: any) => p.tags))).map(
                  (tag: string) => (
                    <span
                      key={tag}
                      className="bg-[#fbf9fa] text-[#8c7284] text-xs px-3 py-1.5 rounded-full border border-gray-100 hover:border-primary hover:text-primary transition cursor-default"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
