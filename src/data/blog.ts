export interface BlogPost {
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

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-skin-aging",
    title: {
      en: "Understanding Skin Aging: Why Collagen Matters",
      ar: "فهم شيخوخة البشرة: لماذا الكولاجين مهم"
    },
    excerpt: {
      en: "Discover the science behind skin aging and how modern treatments can help maintain youthful, radiant skin at any age.",
      ar: "اكتشف العلم وراء شيخوخة البشرة وكيف يمكن للعلاجات الحديثة المساعدة في الحفاظ على بشرة شابة ومشرقة في أي عمر."
    },
    content: {
      en: `<p>Skin aging is a natural process that affects everyone, but understanding its mechanisms can help us make better choices about skincare and treatments.</p>
      <h2>What is Collagen?</h2>
      <p>Collagen is the most abundant protein in your body, making up about 75% of your skin's dry weight. It provides structure, firmness, and elasticity to your skin.</p>
      <h2>Why Does Collagen Decrease?</h2>
      <p>Starting in our mid-20s, we lose approximately 1% of our collagen each year. Factors like sun exposure, smoking, poor diet, and stress accelerate this process.</p>
      <h2>Modern Solutions</h2>
      <p>Today's aesthetic medicine offers several effective ways to stimulate collagen production:</p>
      <ul>
        <li><strong>PRP Therapy:</strong> Uses your own blood platelets to stimulate collagen</li>
        <li><strong>Micro-needling:</strong> Creates controlled micro-injuries that trigger healing</li>
        <li><strong>Skin Boosters:</strong> Hyaluronic acid injections for deep hydration</li>
        <li><strong>Chemical Peels:</strong> Stimulate cell turnover and collagen production</li>
      </ul>
      <p>At Faya.iq, our dermatologists create personalized treatment plans based on your skin type, concerns, and goals. Book a consultation to learn which approach is right for you.</p>
      <p><em>Results may vary. A consultation with our medical team is required before any treatment.</em></p>`,
      ar: `<p>شيخوخة البشرة عملية طبيعية تؤثر على الجميع، ولكن فهم آلياتها يمكن أن يساعدنا في اتخاذ خيارات أفضل حول العناية بالبشرة والعلاجات.</p>
      <h2>ما هو الكولاجين؟</h2>
      <p>الكولاجين هو البروتين الأكثر وفرة في جسمك، ويشكل حوالي ٧٥٪ من الوزن الجاف لبشرتك.</p>`
    },
    category: "Medical Insights",
    tags: ["Skin Care", "Anti-Aging", "Collagen"],
    author: "Dr. Sarah Ahmed",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    publishedAt: "2024-12-15",
    readTime: { en: "5 min read", ar: "٥ دقائق قراءة" },
    featured: true
  },
  {
    id: "2",
    slug: "laser-hair-removal-guide",
    title: {
      en: "The Ultimate Guide to Laser Hair Removal",
      ar: "الدليل الشامل لإزالة الشعر بالليزر"
    },
    excerpt: {
      en: "Everything you need to know about laser hair removal — from preparation to aftercare and expected results.",
      ar: "كل ما تحتاج معرفته عن إزالة الشعر بالليزر — من التحضير إلى العناية والنتائج المتوقعة."
    },
    content: {
      en: `<p>Laser hair removal has become one of the most popular cosmetic procedures worldwide. Here's your complete guide.</p>
      <h2>How Does It Work?</h2>
      <p>Laser hair removal uses concentrated light to target melanin in hair follicles. The light converts to heat, damaging the follicle and inhibiting future growth.</p>
      <h2>Preparation Tips</h2>
      <ul>
        <li>Avoid sun exposure for 2 weeks before treatment</li>
        <li>Shave the treatment area 24 hours before</li>
        <li>Avoid waxing or plucking for 4 weeks prior</li>
        <li>Skip self-tanners and bleaching creams</li>
      </ul>
      <p><em>Results may vary. A consultation is recommended before starting treatment.</em></p>`,
      ar: `<p>أصبحت إزالة الشعر بالليزر واحدة من أكثر الإجراءات التجميلية شيوعاً في العالم.</p>`
    },
    category: "Skin Care Tips",
    tags: ["Laser", "Hair Removal", "Guide"],
    author: "Dr. Layla Mahmoud",
    authorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964e6c9?w=100&q=80",
    image: "https://images.unsplash.com/photo-1598524374912-6b0b0bab43a5?w=800&q=80",
    publishedAt: "2024-12-10",
    readTime: { en: "7 min read", ar: "٧ دقائق قراءة" },
    featured: true
  },
  {
    id: "3",
    slug: "dermal-fillers-what-to-know",
    title: {
      en: "Dermal Fillers: What You Need to Know Before Your First Treatment",
      ar: "الفيلر: ما تحتاج معرفته قبل علاجك الأول"
    },
    excerpt: {
      en: "A comprehensive guide to dermal fillers, including types, safety considerations, and what to expect during and after treatment.",
      ar: "دليل شامل للفيلر، بما في ذلك الأنواع واعتبارات السلامة وما يمكن توقعه أثناء وبعد العلاج."
    },
    content: {
      en: `<p>Dermal fillers have revolutionized non-surgical facial rejuvenation. Here's everything you should know.</p>`,
      ar: `<p>أحدث الفيلر ثورة في تجديد الوجه غير الجراحي.</p>`
    },
    category: "Treatment Guides",
    tags: ["Fillers", "Injectables", "Guide"],
    author: "Dr. Layla Mahmoud",
    authorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964e6c9?w=100&q=80",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
    publishedAt: "2024-11-28",
    readTime: { en: "6 min read", ar: "٦ دقائق قراءة" },
    featured: false
  },
  {
    id: "4",
    slug: "client-transformation-rhinoplasty",
    title: {
      en: "Client Transformation: A Rhinoplasty Journey",
      ar: "تحول العميلة: رحلة تجميل الأنف"
    },
    excerpt: {
      en: "Follow one client's journey through rhinoplasty at Faya.iq — from consultation to beautiful, natural results.",
      ar: "تابع رحلة إحدى العميلات في تجميل الأنف في فايا — من الاستشارة إلى النتائج الجميلة والطبيعية."
    },
    content: {
      en: `<p>Every rhinoplasty journey is unique. Here's a look at one client's experience at our Baghdad clinic.</p>`,
      ar: `<p>كل رحلة تجميل أنف فريدة. إليك نظرة على تجربة إحدى العميلات في عيادتنا في بغداد.</p>`
    },
    category: "Case Studies",
    tags: ["Rhinoplasty", "Transformation", "Case Study"],
    author: "Dr. Youssef Kareem",
    authorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80",
    image: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=800&q=80",
    publishedAt: "2024-11-20",
    readTime: { en: "4 min read", ar: "٤ دقائق قراءة" },
    featured: false
  },
  {
    id: "5",
    slug: "winter-skincare-routine",
    title: {
      en: "Winter Skincare Routine: Protect Your Skin in Cold Weather",
      ar: "روتين العناية بالبشرة في الشتاء: احمِ بشرتك في الطقس البارد"
    },
    excerpt: {
      en: "Essential tips and product recommendations to keep your skin healthy, hydrated, and glowing during the winter months.",
      ar: "نصائح أساسية وتوصيات منتجات للحفاظ على بشرة صحية ورطبة ومشرقة خلال أشهر الشتاء."
    },
    content: {
      en: `<p>Winter weather can be harsh on your skin. Here's how to adjust your routine.</p>`,
      ar: `<p>يمكن أن يكون طقس الشتاء قاسياً على بشرتك. إليك كيفية تعديل روتينك.</p>`
    },
    category: "Beauty Tips",
    tags: ["Skincare", "Winter", "Tips"],
    author: "Dr. Sarah Ahmed",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    publishedAt: "2024-11-15",
    readTime: { en: "4 min read", ar: "٤ دقائق قراءة" },
    featured: false
  }
];

export const blogCategories = [
  { en: "All Articles", ar: "جميع المقالات" },
  { en: "Medical Insights", ar: "رؤى طبية" },
  { en: "Skin Care Tips", ar: "نصائح العناية بالبشرة" },
  { en: "Treatment Guides", ar: "أدلة العلاج" },
  { en: "Case Studies", ar: "دراسات حالة" },
  { en: "Beauty Tips", ar: "نصائح الجمال" }
];
