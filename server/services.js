export const services = [
  { id: "systematic-screening", category: "venture", title: "غربالگری نظام‌مند", titleEn: "Systematic Screening", short: "شناسایی، ارزیابی اولیه و اولویت‌بندی هوشمند فرصت‌ها برای تمرکز سرمایه و توان تیم روی جذاب‌ترین گزینه‌ها.", deliverables: ["شناسایی فرصت", "امتیازدهی اولیه"], minQuantity: 10, maxQuantity: 100, defaultPrice: 25000000 },
  { id: "deep-review", category: "venture", title: "بررسی عمیق", titleEn: "Deep Review", short: "ارزیابی جامع کسب‌وکار؛ تحقیقات بازار، بررسی مدل کسب‌وکار، درآمد و تیم بنیان‌گذار، برای رسیدن به یک تصویر دقیق از نقاط قوت و ریسک‌های اصلی پیش از ورود سرمایه.", deliverables: ["بررسی کسب‌وکار", "ارزیابی بنیان‌گذار"], minQuantity: 1, maxQuantity: 30, defaultPrice: 50000000 },
  { id: "financial-analysis", category: "venture", title: "تحلیل مالی", titleEn: "Financial Analysis", short: "تحلیل مدل مالی و میزان آمادگی کسب‌وکار برای جذب سرمایه‌گذار، با تمرکز بر پایداری درآمد و هزینه‌ها.", deliverables: ["مدل مالی", "آمادگی سرمایه‌گذاری"], minQuantity: 1, maxQuantity: 10, defaultPrice: 50000000 },
  { id: "gtm-evaluation", category: "venture", title: "ارزیابی ورود به بازار", titleEn: "GTM Evaluation", short: "ارزیابی راهبرد ورود به بازار، کانال‌های فروش و امکان تجاری‌سازی محصول برای انتخاب مؤثرترین مسیر جذب مشتری و سرمایه.", deliverables: ["راهبرد GTM", "ارزیابی تجاری‌سازی"], minQuantity: 1, maxQuantity: 10, defaultPrice: 50000000 },
  { id: "feasibility-assessment", category: "venture", title: "ارزیابی امکان‌پذیری", titleEn: "Feasibility Assessment", short: "امکان‌سنجی پی‌گیری فرصت‌ها از سه زاویه فنی، نیروی انسانی و بازار برای روشن شدن ریسک‌ها و موانع کلیدی.", detail: "مناسب تیم‌ها و کسب‌وکارهایی که ایده جذاب دارند، اما می‌خواهند پیش از ورود جدی، تصویر واقع‌بینانه‌تری از امکان‌پذیری آن به‌دست بیاورند.", deliverables: ["امکان‌پذیری فنی", "ریسک بازار و اجرا"], minQuantity: 1, maxQuantity: 5, defaultPrice: 150000000 },
  { id: "activation-program", category: "venture", title: "برنامه فعال‌سازی", titleEn: "Activation Program", short: "برنامه‌ای برای اجرای سریع و پشتیبانی عملیاتی فرصت‌های اعتبارسنجی‌شده؛ از آماده‌سازی تیم تا راه‌اندازی فعالیت‌ها در بازار هدف.", deliverables: ["برنامه اجرا", "فعال‌سازی عملیات"], minQuantity: 1, maxQuantity: 5, defaultPrice: 150000000 },
  { id: "team-building", category: "venture", title: "تیم‌سازی", titleEn: "Team Building", short: "شکل‌دهی تیم استارتاپی و جذب استعدادهای متناسب با مرحله رشد.", deliverables: ["طراحی تیم", "جذب استعداد"], minQuantity: 1, maxQuantity: 5, defaultPrice: 100000000 },
  { id: "capital-connection", category: "venture", title: "اتصال به سرمایه", titleEn: "Capital Connection", short: "دسترسی به سرمایه‌گذاران هم‌راستا و تسهیل فرایند جذب سرمایه.", deliverables: ["معرفی سرمایه‌گذار", "تسهیل جذب سرمایه"], minQuantity: 1, maxQuantity: 999, defaultPrice: 250000000 },
  { id: "persona", category: "strategy", title: "تحلیل پرسونای خریدار و تصمیم‌گیرنده", short: "شناخت دقیق نقش‌ها، دغدغه‌ها و معیارهای تصمیم‌گیری مشتریان هدف.", deliverables: ["پرسونای خریدار", "نقشه تصمیم‌گیری"] },
  { id: "value", category: "strategy", title: "ارزش پیشنهادی محصول", short: "تبدیل قابلیت‌های محصول به یک وعده روشن و قابل لمس برای بازار.", deliverables: ["ارزش پیشنهادی", "تمایز رقابتی"] },
  { id: "sales-message", category: "strategy", title: "پیام اصلی فروش", short: "پیامی کوتاه و متقاعدکننده برای شروع گفت‌وگو با مشتری درست.", deliverables: ["پیام محوری", "نسخه‌های کاربردی"] },
  { id: "product-story", category: "strategy", title: "ساختار معرفی محصول", short: "روایت منسجم معرفی محصول از مسئله مشتری تا راه‌حل و اقدام بعدی.", deliverables: ["روایت محصول", "ساختار ارائه"] },
  { id: "sales-deck", category: "sales", title: "پرزنتیشن فروش", short: "ارائه‌ای حرفه‌ای برای جلسات فروش، دمو و تصمیم‌گیری مدیران؛ با اسلایدهای منسجم و داستان روشن از ارزش محصول.", deliverables: ["اسلاید فروش", "سناریوی ارائه"] },
  { id: "catalog", category: "content", title: "کاتالوگ محصول", short: "معرفی کامل محصول، قابلیت‌ها و کاربردها در قالب یک فایل/سند دیجیتال قابل ارسال برای مشتریان و شرکای تجاری.", deliverables: ["کاتالوگ", "نسخه دیجیتال"] },
  { id: "proposal", category: "sales", title: "پروپوزال پایه قابل شخصی‌سازی", short: "قالب آماده برای ساخت پیشنهادهای تجاری حرفه‌ای، قابل تنظیم برای هر مشتری و هر سناریوی فروش.", deliverables: ["قالب پروپوزال", "ساختار قیمت"] },
  { id: "brandbook", category: "content", title: "برندبوک یا مینی‌برندبوک", short: "راهنمای فشرده هویت برند برای یک‌دست شدن پیام، لحن و تصویر برند در همه نقاط تماس با بازار؛ از وب‌سایت و شبکه‌های اجتماعی تا جلسات فروش و ارائه‌های آنلاین و حضوری.", deliverables: ["هویت بصری", "راهنمای لحن"] },
  { id: "product-intro", category: "content", title: "متن معرفی کوتاه و مفصل محصول", short: "متن‌های آماده برای وب‌سایت، شبکه‌های اجتماعی، کاتالوگ و ارتباطات فروش؛ نسخه‌های کوتاه برای معرفی سریع، متن‌های کامل و مفصل برای توضیح جزئیات محصول.", deliverables: ["معرفی کوتاه", "معرفی کامل"] },
  { id: "call-script", category: "sales", title: "سناریوی تماس فروش", short: "مسیر گفت‌وگوی اولین تماس برای کشف نیاز مشتری، مدیریت گفت‌وگوها و هدایت مکالمه به گام بعدی در فرایند فروش.", deliverables: ["اسکریپت تماس", "پاسخ اعتراضات"] },
  { id: "demo-script", category: "sales", title: "سناریوی جلسه دمو", short: "طراحی سناریوی نمایش محصول به‌گونه‌ای که قابلیت‌ها به‌طور مستقیم به مسئله و نیازهای مشتری وصل شود و جلسه دمو به نتیجه برسد.", deliverables: ["سناریوی دمو", "چک‌لیست جلسه"] },
  { id: "messaging-copy", category: "content", title: "متن پیامک، واتساپ، بله، تلگرام و ایمیل فروش", short: "متن‌های آماده برای پیگیری، معرفی، دعوت به جلسه و پیش‌برد مشتری در قیف فروش؛ با لحن حرفه‌ای و متناسب با هر کانال.", deliverables: ["پیام‌های فروش", "ایمیل پیگیری"] },
  { id: "social-content", category: "content", title: "محتوای شبکه اجتماعی", short: "محتوای منسجم برای توضیح مسئله و راه‌حل آن، تقویت اعتبار برند و نشان دادن کاربرد محصول در موقعیت‌های واقعی.", deliverables: ["تقویم محتوا", "متن پست"] },
  { id: "lead-campaign", category: "campaign", title: "طراحی کمپین جذب سرنخ", short: "طراحی کمپین برای رساندن پیام درست به مخاطب هدف و تبدیل توجه او به سرنخ فروش؛ با مسیر مشخص از آگاهی تا اقدام.", deliverables: ["ایده کمپین", "مسیر جذب سرنخ"] },
  { id: "needs-form", category: "sales", title: "فرم نیازسنجی مشتری", short: "یک فرم کاربردی برای ثبت مسئله مشتری، اولویت‌ها، بودجه و مسیر تصمیم‌گیری خرید؛ همراه با منطق امتیازدهی برای ارزیابی میزان جذابیت فرصت.", deliverables: ["فرم نیازسنجی", "منطق امتیازدهی"] },
  { id: "sales-questionnaire", category: "sales", title: "پرسش‌نامه جلسه فروش", short: "مجموعه پرسش‌های هدفمند برای کشف لایه‌های پنهان نیاز مشتری و آماده‌سازی یک پیشنهاد دقیق و قابل‌قبول.", deliverables: ["پرسش‌نامه", "راهنمای گفت‌وگو"] },
  { id: "monthly-report", category: "ops", title: "ساختار گزارش ماهانه فروش و بازاریابی", short: "داشبورد و قالب گزارش ماهانه برای رصد سرنخ‌ها، فرصت‌ها، نرخ تبدیل و روندهای بازار؛ به‌گونه‌ای که تصویر روشنی از عملکرد تیم فروش و بازاریابی در اختیار مدیریت قرار بگیرد.", deliverables: ["قالب گزارش", "شاخص‌های عملکرد"] }
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
