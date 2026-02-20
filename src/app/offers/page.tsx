"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";

const offers = [
  {
    id: "1",
    title: { en: "Summer Glow Package", ar: "باقة إشراقة الصيف" },
    description: {
      en: "Get the ultimate summer glow with our HydraFacial + Chemical Peel combo. Save 30% when you book both treatments together.",
      ar: "احصلي على إشراقة الصيف المطلقة مع باقة الهيدرافيشل + التقشير الكيميائي. وفري ٣٠٪ عند حجز العلاجين معاً."
    },
    discount: "30%",
    originalPrice: { en: "175,000 IQD", ar: "١٧٥,٠٠٠ د.ع" },
    salePrice: { en: "122,500 IQD", ar: "١٢٢,٥٠٠ د.ع" },
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    validUntil: "2025-03-31",
    branches: { en: "All Branches", ar: "جميع الفروع" },
    tag: { en: "Best Seller", ar: "الأكثر مبيعاً" },
  },
  {
    id: "2",
    title: { en: "Laser Hair Removal - 6 Session Package", ar: "إزالة الشعر بالليزر - باقة ٦ جلسات" },
    description: {
      en: "Complete your laser journey with our 6-session full body package. Pay for 5, get 1 free!",
      ar: "أكملي رحلة الليزر مع باقة الجسم الكامل لـ ٦ جلسات. ادفعي لـ ٥ واحصلي على واحدة مجاناً!"
    },
    discount: "1 FREE",
    originalPrice: { en: "900,000 IQD", ar: "٩٠٠,٠٠٠ د.ع" },
    salePrice: { en: "750,000 IQD", ar: "٧٥٠,٠٠٠ د.ع" },
    image: "https://images.unsplash.com/photo-1598524374912-6b0b0bab43a5?w=600&q=80",
    validUntil: "2025-04-15",
    branches: { en: "All Branches", ar: "جميع الفروع" },
    tag: { en: "Limited Time", ar: "وقت محدود" },
  },
  {
    id: "3",
    title: { en: "Bridal Beauty Package", ar: "باقة جمال العروس" },
    description: {
      en: "Look your absolute best on your special day. Includes facial, hair styling, nail art, and a pre-wedding skin prep session.",
      ar: "اظهري بأجمل إطلالة في يومك المميز. تشمل العناية بالوجه وتصفيف الشعر وفن الأظافر وجلسة تحضير البشرة قبل الزفاف."
    },
    discount: "25%",
    originalPrice: { en: "350,000 IQD", ar: "٣٥٠,٠٠٠ د.ع" },
    salePrice: { en: "262,500 IQD", ar: "٢٦٢,٥٠٠ د.ع" },
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    validUntil: "2025-06-30",
    branches: { en: "Baghdad & Erbil", ar: "بغداد وأربيل" },
    tag: { en: "Popular", ar: "شائع" },
  },
  {
    id: "4",
    title: { en: "Refer a Friend - Both Get 15% Off", ar: "أحيلي صديقة - كلاكما تحصلان على ١٥٪ خصم" },
    description: {
      en: "Share the beauty! When you refer a friend to Faya.iq, both of you receive 15% off your next treatment.",
      ar: "شاركي الجمال! عندما تحيلين صديقة إلى فايا، كلاكما تحصلان على ١٥٪ خصم على العلاج التالي."
    },
    discount: "15%",
    originalPrice: { en: "", ar: "" },
    salePrice: { en: "15% off for both", ar: "١٥٪ خصم للاثنتين" },
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80",
    validUntil: "2025-12-31",
    branches: { en: "All Branches", ar: "جميع الفروع" },
    tag: { en: "Referral", ar: "إحالة" },
  },
];

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  return (
    <div className="flex items-center gap-1 text-xs text-[#c8567e] font-semibold">
      <span className="material-symbols-outlined text-sm">timer</span>
      <span>{days} days left</span>
    </div>
  );
}

export default function OffersPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fbf9fa]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#fff0f3] to-[#fbf9fa] py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[#c8567e] font-bold text-sm tracking-widest uppercase mb-3 block">
            {t({ en: "Special Offers", ar: "عروض خاصة" })}
          </span>
          <h1 className="font-[Playfair_Display] text-4xl md:text-5xl font-bold text-[#333] mb-4">
            {t({ en: "Exclusive Deals & Packages", ar: "عروض وباقات حصرية" })}
          </h1>
          <p className="text-[#8c7284] text-lg max-w-2xl mx-auto">
            {t({
              en: "Take advantage of our limited-time offers and save on your favorite treatments.",
              ar: "استفيدي من عروضنا المحدودة ووفري على علاجاتك المفضلة."
            })}
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer, index) => (
            <ScrollReveal key={offer.id} delay={index * 100}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${offer.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-[#c8567e] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {offer.discount} {t({ en: "OFF", ar: "خصم" })}
                  </div>
                  {/* Tag */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#333] px-3 py-1 rounded-full text-xs font-semibold">
                    {t(offer.tag)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#333] mb-2">
                    {t(offer.title)}
                  </h3>
                  <p className="text-[#8c7284] text-sm mb-4 leading-relaxed">
                    {t(offer.description)}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    {offer.originalPrice.en && (
                      <span className="text-[#8c7284] line-through text-sm">
                        {t(offer.originalPrice)}
                      </span>
                    )}
                    <span className="text-[#c8567e] font-bold text-lg">
                      {t(offer.salePrice)}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-[#8c7284]">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {t(offer.branches)}
                      </div>
                      <CountdownTimer targetDate={offer.validUntil} />
                    </div>
                    <Link
                      href="/booking"
                      className="bg-[#c8567e] hover:bg-[#a03d5e] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
                    >
                      {t({ en: "Book Now", ar: "احجزي الآن" })}
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Referral Program Banner */}
        <ScrollReveal>
          <div className="mt-16 bg-gradient-to-r from-[#c8567e] to-[#a03d5e] rounded-2xl p-8 md:p-12 text-white text-center">
            <span className="material-symbols-outlined text-5xl mb-4 block opacity-80">loyalty</span>
            <h2 className="font-[Playfair_Display] text-3xl font-bold mb-3">
              {t({ en: "Faya Loyalty Program", ar: "برنامج ولاء فايا" })}
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6">
              {t({
                en: "Earn points with every visit and redeem them for exclusive rewards. The more you visit, the more you save!",
                ar: "اجمعي نقاط مع كل زيارة واستبدليها بمكافآت حصرية. كلما زرتينا أكثر، وفرتِ أكثر!"
              })}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#c8567e] font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              {t({ en: "Learn More", ar: "اعرفي المزيد" })}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
