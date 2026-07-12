export const services = [
  { id: "systematic-screening", category: "venture", title: "غربالگری نظام‌مند", titleEn: "Systematic Screening", short: "شناسایی، ارزیابی اولیه و اولویت‌بندی فرصت‌ها با کمک هوش مصنوعی.", deliverables: ["شناسایی فرصت", "امتیازدهی اولیه"], minQuantity: 10, maxQuantity: 100, defaultPrice: 25000000 },
  { id: "deep-review", category: "venture", title: "بررسی عمیق", titleEn: "Deep Review", short: "ارزیابی جامع کسب‌وکار، بازار، مدل درآمدی و تیم بنیان‌گذار.", deliverables: ["بررسی کسب‌وکار", "ارزیابی بنیان‌گذار"], minQuantity: 1, maxQuantity: 30, defaultPrice: 50000000 },
  { id: "financial-analysis", category: "venture", title: "تحلیل مالی", titleEn: "Financial Analysis", short: "بررسی مدل مالی، اقتصاد واحد و آمادگی کسب‌وکار برای جذب سرمایه.", deliverables: ["مدل مالی", "آمادگی سرمایه‌گذاری"], minQuantity: 1, maxQuantity: 10, defaultPrice: 50000000 },
  { id: "gtm-evaluation", category: "venture", title: "ارزیابی ورود به بازار", titleEn: "GTM Evaluation", short: "ارزیابی راهبرد ورود به بازار، کانال‌ها و امکان تجاری‌سازی محصول.", deliverables: ["راهبرد GTM", "ارزیابی تجاری‌سازی"], minQuantity: 1, maxQuantity: 10, defaultPrice: 50000000 },
  { id: "feasibility-assessment", category: "venture", title: "ارزیابی امکان‌پذیری", titleEn: "Feasibility Assessment", short: "اعتبارسنجی امکان‌پذیری راهبردی و عملیاتی فرصت.", detail: "بررسی واقع‌بینانه امکان اجرای فرصت از سه زاویه فنی، نیروی انسانی و بازار؛ برای آشکار کردن ریسک‌ها و موانع کلیدی پیش از تعهد منابع. زمانی مناسب است که ایده جذاب به نظر می‌رسد اما اجرای آن هنوز اثبات نشده است.", deliverables: ["امکان‌پذیری فنی", "ریسک بازار و اجرا"], minQuantity: 1, maxQuantity: 5, defaultPrice: 150000000 },
  { id: "activation-program", category: "venture", title: "برنامه فعال‌سازی", titleEn: "Activation Program", short: "شتاب‌دهی به اجرا و پشتیبانی عملیاتی برای فعال‌سازی فرصت اعتبارسنجی‌شده.", deliverables: ["برنامه اجرا", "فعال‌سازی عملیات"], minQuantity: 1, maxQuantity: 5, defaultPrice: 150000000 },
  { id: "team-building", category: "venture", title: "تیم‌سازی", titleEn: "Team Building", short: "شکل‌دهی تیم استارتاپی و جذب استعدادهای متناسب با مرحله رشد.", deliverables: ["طراحی تیم", "جذب استعداد"], minQuantity: 1, maxQuantity: 5, defaultPrice: 100000000 },
  { id: "capital-connection", category: "venture", title: "اتصال به سرمایه", titleEn: "Capital Connection", short: "دسترسی به سرمایه‌گذاران هم‌راستا و تسهیل فرایند جذب سرمایه.", deliverables: ["معرفی سرمایه‌گذار", "تسهیل جذب سرمایه"], minQuantity: 1, maxQuantity: 999, defaultPrice: 250000000 },
  { id: "persona", category: "strategy", title: "تحلیل پرسونای خریدار و تصمیم‌گیرنده", short: "شناخت دقیق نقش‌ها، دغدغه‌ها و معیارهای تصمیم‌گیری مشتریان هدف.", deliverables: ["پرسونای خریدار", "نقشه تصمیم‌گیری"] },
  { id: "value", category: "strategy", title: "ارزش پیشنهادی محصول", short: "تبدیل قابلیت‌های محصول به یک وعده روشن و قابل لمس برای بازار.", deliverables: ["ارزش پیشنهادی", "تمایز رقابتی"] },
  { id: "sales-message", category: "strategy", title: "پیام اصلی فروش", short: "پیامی کوتاه و متقاعدکننده برای شروع گفت‌وگو با مشتری درست.", deliverables: ["پیام محوری", "نسخه‌های کاربردی"] },
  { id: "product-story", category: "strategy", title: "ساختار معرفی محصول", short: "روایت منسجم معرفی محصول از مسئله مشتری تا راه‌حل و اقدام بعدی.", deliverables: ["روایت محصول", "ساختار ارائه"] },
  { id: "sales-deck", category: "sales", title: "پرزنتیشن فروش", short: "ارائه‌ای حرفه‌ای برای جلسه فروش، دمو و تصمیم‌گیری مدیران.", deliverables: ["اسلاید فروش", "سناریوی ارائه"] },
  { id: "catalog", category: "content", title: "کاتالوگ محصول", short: "معرفی کامل محصول، قابلیت‌ها و کاربردها در یک دارایی قابل ارسال.", deliverables: ["کاتالوگ", "نسخه دیجیتال"] },
  { id: "proposal", category: "sales", title: "پروپوزال خام قابل شخصی‌سازی", short: "قالب آماده برای ساخت پیشنهادهای تجاری سریع و متناسب با هر مشتری.", deliverables: ["قالب پروپوزال", "ساختار قیمت"] },
  { id: "brandbook", category: "content", title: "برندبوک یا مینی‌برندبوک", short: "راهنمای فشرده هویت برند برای یکدست شدن تمام نقاط تماس بازار.", deliverables: ["هویت بصری", "راهنمای لحن"] },
  { id: "product-intro", category: "content", title: "متن معرفی کوتاه و بلند محصول", short: "متن‌های آماده برای سایت، شبکه‌های اجتماعی، کاتالوگ و ارتباطات فروش.", deliverables: ["معرفی کوتاه", "معرفی کامل"] },
  { id: "call-script", category: "sales", title: "سناریوی تماس فروش", short: "مسیر گفت‌وگوی تماس اول برای کشف نیاز و رسیدن به قدم بعدی.", deliverables: ["اسکریپت تماس", "پاسخ اعتراضات"] },
  { id: "demo-script", category: "sales", title: "سناریوی جلسه دمو", short: "طراحی ترتیب نمایش محصول برای متصل کردن قابلیت‌ها به مسئله مشتری.", deliverables: ["سناریوی دمو", "چک‌لیست جلسه"] },
  { id: "messaging-copy", category: "content", title: "متن پیامک، واتساپ، بله، تلگرام و ایمیل فروش", short: "متن‌های آماده برای پیگیری، معرفی، دعوت به جلسه و حرکت در قیف فروش.", deliverables: ["پیام‌های فروش", "ایمیل پیگیری"] },
  { id: "social-content", category: "content", title: "محتوای شبکه اجتماعی", short: "محتوای منسجم برای معرفی مسئله، راه‌حل، اعتبار و کاربرد محصول.", deliverables: ["تقویم محتوا", "متن پست"] },
  { id: "lead-campaign", category: "campaign", title: "طراحی کمپین جذب سرنخ", short: "طراحی کمپین برای رساندن پیام درست به مخاطب درست و ساختن فرصت فروش.", deliverables: ["ایده کمپین", "مسیر جذب سرنخ"] },
  { id: "needs-form", category: "sales", title: "فرم نیازسنجی مشتری", short: "فرمی کاربردی برای ثبت مسئله، اولویت، بودجه و مسیر خرید مشتری.", deliverables: ["فرم نیازسنجی", "منطق امتیازدهی"] },
  { id: "sales-questionnaire", category: "sales", title: "پرسش‌نامه جلسه فروش", short: "سؤالاتی برای کشف لایه‌های پنهان نیاز و آماده‌سازی پیشنهاد دقیق‌تر.", deliverables: ["پرسش‌نامه", "راهنمای گفت‌وگو"] },
  { id: "monthly-report", category: "ops", title: "ساختار گزارش ماهانه فروش و بازاریابی", short: "داشبورد و قالب گزارش برای دیدن سرنخ‌ها، فرصت‌ها، تبدیل و بازخورد بازار.", deliverables: ["قالب گزارش", "شاخص‌های عملکرد"] }
];

export const serviceMap = new Map(services.map(service => [service.id, service]));

export const categories = {
  all: "همه خدمات",
  venture: "ارزیابی، اجرا و سرمایه",
  strategy: "استراتژی و پیام",
  sales: "فروش و مذاکره",
  content: "محتوا و برند",
  campaign: "کمپین و جذب سرنخ",
  ops: "گزارش و مدیریت"
};
