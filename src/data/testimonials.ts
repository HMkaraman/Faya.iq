export interface Testimonial {
  id: string;
  name: { en: string; ar: string };
  service: { en: string; ar: string };
  branch: string;
  rating: number;
  text: { en: string; ar: string };
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: { en: "Nour Al-Rawi", ar: "نور الراوي" },
    service: { en: "HydraFacial", ar: "هيدرافيشل" },
    branch: "baghdad-mansour",
    rating: 5,
    text: {
      en: "The HydraFacial at Faya was incredible! My skin has never looked this radiant. The staff made me feel so comfortable throughout the entire process.",
      ar: "كانت جلسة الهيدرافيشل في فايا رائعة! لم تبدو بشرتي بهذه الإشراقة من قبل. جعلني الطاقم أشعر بالراحة طوال العملية."
    },
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
  },
  {
    id: "2",
    name: { en: "Zainab Hassan", ar: "زينب حسن" },
    service: { en: "Dermal Fillers", ar: "فيلر الوجه" },
    branch: "erbil",
    rating: 5,
    text: {
      en: "Dr. Layla did an amazing job with my lip fillers. The results look so natural — exactly what I wanted. I've been coming back for 2 years now!",
      ar: "قامت الدكتورة ليلى بعمل رائع مع فيلر الشفاه. النتائج تبدو طبيعية جداً — بالضبط ما أردته. أعود منذ عامين الآن!"
    },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
  },
  {
    id: "3",
    name: { en: "Ahmed Jabbar", ar: "أحمد جبار" },
    service: { en: "Hair Transplant", ar: "زراعة الشعر" },
    branch: "baghdad-mansour",
    rating: 5,
    text: {
      en: "I was nervous about getting a hair transplant, but Dr. Youssef and his team were exceptional. 6 months later and my confidence is completely restored.",
      ar: "كنت متوتراً بشأن زراعة الشعر، لكن الدكتور يوسف وفريقه كانوا استثنائيين. بعد ٦ أشهر وثقتي بنفسي عادت تماماً."
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
  },
  {
    id: "4",
    name: { en: "Fatima Al-Saadi", ar: "فاطمة السعدي" },
    service: { en: "Laser Hair Removal", ar: "إزالة الشعر بالليزر" },
    branch: "basra",
    rating: 5,
    text: {
      en: "After just 4 sessions, I can already see significant results. The clinic is beautifully designed and the team is incredibly professional.",
      ar: "بعد ٤ جلسات فقط، يمكنني رؤية نتائج ملحوظة بالفعل. العيادة مصممة بشكل جميل والفريق محترف بشكل لا يصدق."
    },
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
  },
  {
    id: "5",
    name: { en: "Sara Mahmoud", ar: "سارة محمود" },
    service: { en: "Chemical Peel", ar: "التقشير الكيميائي" },
    branch: "baghdad-mansour",
    rating: 4,
    text: {
      en: "The chemical peel treatment transformed my skin. My acne scars have faded significantly. Dr. Sarah really knows what she's doing!",
      ar: "علاج التقشير الكيميائي غيّر بشرتي. تلاشت ندوب حب الشباب بشكل ملحوظ. الدكتورة سارة تعرف حقاً ما تفعله!"
    },
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80"
  }
];
