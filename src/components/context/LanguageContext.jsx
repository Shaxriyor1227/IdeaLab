import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const LanguageContext = createContext();

const translations = {
  en: {
    // Header
    howItWorks: "How it works",
    features: "Features",
    blog: "Blog",
    analyze: "Analyze",
    result: "Result",
    dashboard: "Dashboard",
    newAnalysis: "New Analysis",
    history: "History",
    settings: "Settings",
    logout: "Logout",
    getStarted: "Get Started",
    exportPdf: "Export PDF",
    saveToHistory: "Save to History",

    // Home / Hero
    heroTitle: "Validate Your Startup Ideas In Seconds",
    heroSub: "IdeaLab analyzes your concept against market data, SWOT structure, and growth potential using advanced AI model validation.",
    heroBtn: "Start Analyzing Free",
    heroBadge: "AI startup validation, before you build",
    watchDemo: "Watch Demo",

    // Analyze Page
    describeIdea: "Describe Your Startup Idea",
    describeSub: "Give IdeaLab the core details and we'll prepare your concept for a fast AI validation pass.",
    startupName: "Startup name",
    oneLineDesc: "One-line description",
    problemSolving: "Problem you're solving",
    problemDesc: "Describe the painful workflow, customer frustration, or market gap...",
    targetCustomer: "Target customer",
    industryCategory: "Industry category",
    selectIndustry: "Select industry",
    estimatedBudget: "Estimated budget",
    selectBudget: "Select budget",
    btnAnalyze: "Analyze My Idea",
    analyzingIdeas: "Analyzing Ideas",
    analysisTime: "Analysis takes ~60 seconds",
    aiPoweredIntake: "AI-powered idea intake",

    // History Page
    analysisHistory: "Analysis History",
    historySubtitle: "All your past startup idea validations in one place.",
    totalAnalyses: "Total Analyses",
    highPotential: "High Potential",
    avgViability: "Avg. Viability Score",
    noAnalysesYet: "No analyses yet",
    noAnalysesDesc: "You haven't validated any startup ideas yet. Start your first analysis and it will appear here.",
    startFirstAnalysis: "Start First Analysis",
    viewReport: "View Report",
    analyzedDate: "Analyzed",

    // Results Page
    backToDashboard: "Back to Dashboard",
    ideaAnalysisReport: "Idea Analysis Report",
    viabilityScore: "Viability Score",
    strongMarketFit: "Strong market fit with clear differentiation",
    marketSize: "Market Size",
    competition: "Competition",
    trendScore: "Trend Score",
    swotAnalysis: "SWOT Analysis",
    viewDetails: "View Details",
    aiRecommendations: "AI Recommendations",
    priority: "Priority",

    // Settings Page
    settingsTitle: "Settings & Options",
    settingsSubtitle: "Customize your IdeaLab workspace theme, language, and manage account features.",
    colorTheme: "Color Theme",
    changeColorTheme: "Choose a primary accent color for your interface",
    language: "Language (Til)",
    changeLanguage: "Select your preferred application language",
    accountDetails: "Account Details",
    emailAddress: "Email address",
    displayName: "Display Name",
    logoutTitle: "Sign Out",
    logoutDesc: "Sign out of your current session on this device",
    saveSettings: "Save Settings",
    settingsSavedMsg: "Settings updated successfully!",
    themeMode: "Theme Mode",
    changeThemeMode: "Switch between light and dark visual styles",
    // Features Page
    featuresTitle: "Built for founders who move fast and think clearly",
    featuresSubtitle: "IdeaLab gives you a complete validation system in one place. From raw idea to investor-ready insight — powered by AI, designed for clarity, built for speed.",
    fullAnalysisTime: "Full analysis",
    aiModulesCount: "AI modules",
    ideasValidatedText: "Ideas validated",
    userRating: "User rating",
    stopGuessing: "Stop guessing. Start validating.",
    stopGuessingDesc: "Every day you spend building without validation is a day you risk wasting. Run your first analysis in under 60 seconds and find out exactly where your idea stands.",
    btnAnalyzeMyIdea: "Analyze My Idea",
    // Blog Page
    blogTitleText: "Learn how to build smarter",
    blogSubtitleText: "Expert insights on startup validation, product strategy, market research, and growth.",
    readArticle: "Read Article",
    newsletterTitle: "Get startup insights delivered to your inbox",
    newsletterSub: "Join 10,000+ founders who get our weekly newsletter on product validation.",
    subscribe: "Subscribe",
    // BlogPostPage
    backToBlog: "Back to Blog",
    nextArticle: "Next Article",
    readNext: "Read Next",
    // How It Works Page
    hiwDescribeTitle: "Describe the idea",
    hiwDescribeDesc: "Enter the target customer, problem, and initial product angle in plain language.",
    hiwAiTitle: "AI scores the market",
    hiwAiDesc: "The model grades urgency, competition, monetization, timing, and founder-market fit.",
    hiwExportTitle: "Export next steps",
    hiwExportDesc: "Download a concise validation brief with risks, experiments, and recommended MVP scope.",
    hiwEyebrow: "HOW IT WORKS",
    hiwMainTitle: "From startup idea to validation report",
    hiwSubtitle: "IdeaLab compresses research, scoring, and recommendations into a simple guided workflow for founders.",
    // Idea Analysis Mockup Page
    iaTitle: "Idea Analysis",
    iaSubtitle: "SaaS tool for remote teams",
    iaViabilityScore: "VIABILITY SCORE",
    iaMedium: "Medium",
    iaCompetitors: "14 competitors",
    iaTrendingUp: "↑ Trending up",
    iaStrengths: "Strengths",
    iaWeaknesses: "Weaknesses",
    iaOpportunities: "Opportunities",
    iaThreats: "Threats",
    // Testimonials Page
    testEyebrow: "LOVED BY OPERATORS",
    testTitle: "Sharper decisions before launch",
    testSubtitle: "Founders use IdeaLab to avoid expensive false starts and focus on the ideas with real signal.",
    testQuote1: "IdeaLab helped us kill two weak concepts and double down on the one customers were already trying to hack together.",
    testQuote2: "The competitor map alone saved a week of research. It gave us a clearer wedge and better investor answers.",
    testQuote3: "It turns founder excitement into evidence. We now run every new product bet through IdeaLab before committing design time.",
    // Footer Section
    footerTagline: "AI-powered idea validation and deep code reviews. Build faster, validate smarter, and ship with absolute confidence.",
    footerProduct: "Product",
    footerIntegrations: "Integrations",
    footerPricing: "Pricing",
    footerResources: "Resources",
    footerDocumentation: "Documentation",
    footerCommunity: "Community",
    footerHelpCenter: "Help Center",
    footerLegal: "Legal",
    footerPrivacyPolicy: "Privacy Policy",
    footerTermsOfService: "Terms of Service",
    footerCookiePolicy: "Cookie Policy",
    footerAllRightsReserved: "All rights reserved.",
    footerAllSystemsOperational: "All systems operational",
    // CTA Section
    ctaTitle: "Start validating for free",
    ctaSubtitle: "Run your first idea through IdeaLab and get a market score, SWOT summary, competitor view, and recommended next experiments in under a minute.",
  },
  uz: {
    // Header
    howItWorks: "Qanday ishlaydi",
    features: "Imkoniyatlar",
    blog: "Blog",
    analyze: "Tahlil qilish",
    result: "Natija",
    dashboard: "Boshqaruv paneli",
    newAnalysis: "Yangi tahlil",
    history: "Tarix",
    settings: "Sozlamalar",
    logout: "Chiqish",
    getStarted: "Boshlash",
    exportPdf: "PDF Yuklash",
    saveToHistory: "Tarixga saqlash",

    // Home / Hero
    heroTitle: "Startap g'oyalaringizni soniyalarda tekshiring",
    heroSub: "IdeaLab ilg'or sun'iy intellekt tahlili yordamida g'oyangizni bozor ma'lumotlari, SWOT tuzilishi va o'sish salohiyatiga muvofiq tekshiradi.",
    heroBtn: "Bepul tahlilni boshlash",
    heroBadge: "Qurishdan oldin AI startap tekshiruvi",
    watchDemo: "Demo ko'rish",

    // Analyze Page
    describeIdea: "Startap g'oyangizni tavsiflang",
    describeSub: "IdeaLab-ga asosiy ma'lumotlarni taqdim eting va biz g'oyangizni sun'iy intellekt orqali tezkor tekshirishga tayyorlaymiz.",
    startupName: "Startap nomi",
    oneLineDesc: "Bir satrlik tavsif",
    problemSolving: "Siz hal qilayotgan muammo",
    problemDesc: "Qiyin ish jarayonini, mijozlar noroziligini yoki bozordagi bo'shliqni tasvirlang...",
    targetCustomer: "Maqsadli mijoz",
    industryCategory: "Sohani tanlang",
    selectIndustry: "Sohani tanlash",
    estimatedBudget: "Taxminiy budjet",
    selectBudget: "Budjetni tanlash",
    btnAnalyze: "G'oyani tahlil qilish",
    analyzingIdeas: "G'oya tahlil qilinmoqda",
    analysisTime: "Tahlil ~60 soniya vaqt oladi",
    aiPoweredIntake: "Sun'iy intellekt orqali qabul qilish",

    // History Page
    analysisHistory: "Tahlillar tarixi",
    historySubtitle: "Barcha o'tgan startap g'oyalaringiz tahlillari bir joyda.",
    totalAnalyses: "Jami tahlillar",
    highPotential: "Yuqori salohiyat",
    avgViability: "O'rtacha hayotiylik",
    noAnalysesYet: "Hozircha tahlillar yo'q",
    noAnalysesDesc: "Siz hali startap g'oyalarini tahlil qilmadingiz. Birinchi tahlilni boshlang va u shu yerda paydo bo'ladi.",
    startFirstAnalysis: "Birinchi tahlilni boshlash",
    viewReport: "Hisobotni ko'rish",
    analyzedDate: "Tahlil sanasi",

    // Results Page
    backToDashboard: "Bosh sahifaga qaytish",
    ideaAnalysisReport: "G'oya tahlili hisoboti",
    viabilityScore: "Hayotiylik darajasi",
    strongMarketFit: "Aniq farqlarga ega kuchli bozor mosligi",
    marketSize: "Bozor hajmi",
    competition: "Raqobat",
    trendScore: "Trend reytingi",
    swotAnalysis: "SWOT tahlili",
    viewDetails: "Batafsil ko'rish",
    aiRecommendations: "Sun'iy intellekt tavsiyalari",
    priority: "Muhimlik darajasi",

    // Settings Page
    settingsTitle: "Sozlamalar va imkoniyatlar",
    settingsSubtitle: "IdeaLab interfeys rangi, til sozlamalari va hisob xususiyatlarini moslashtiring.",
    colorTheme: "Interfeys rangi",
    changeColorTheme: "Interfeys uchun asosiy urg'u rangini tanlang",
    language: "Til (Language)",
    changeLanguage: "Ilova tilini tanlang",
    accountDetails: "Hisob ma'lumotlari",
    emailAddress: "Email manzili",
    displayName: "Foydalanuvchi ismi",
    logoutTitle: "Tizimdan chiqish",
    logoutDesc: "Ushbu qurilmadagi joriy sessiyani yakunlash",
    saveSettings: "Sozlamalarni saqlash",
    settingsSavedMsg: "Sozlamalar muvaffaqiyatli saqlandi!",
    themeMode: "Mavzu rejimi",
    changeThemeMode: "Tungi va kunduzgi rejimni tanlang",
    // Features Page
    featuresTitle: "Tezkor va aniq fikrlovchi ta'sischilar uchun yaratilgan",
    featuresSubtitle: "IdeaLab sizga barcha tekshiruv tizimlarini bir joyda taqdim etadi. Xom g'oyadan tortib investitsiyaga tayyor hisobotgacha — sun'iy intellekt kuchi, aniqlik va tezlik.",
    fullAnalysisTime: "To'liq tahlil",
    aiModulesCount: "AI modullari",
    ideasValidatedText: "G'oyalar tekshirildi",
    userRating: "Foydalanuvchi reytingi",
    stopGuessing: "Taxmin qilishni to'xtating. Tasdiqlashni boshlang.",
    stopGuessingDesc: "Tekshiruvsiz qurish uchun sarflagan har bir kuningiz bekorga ketishi mumkin. Birinchi tahlilni 60 soniyadan kamroq vaqt ichida boshlang va g'oyangizning haqiqiy holatini bilib oling.",
    btnAnalyzeMyIdea: "G'oyani tahlil qilish",
    // Blog Page
    blogTitleText: "Aqlliroq qurishni o'rganing",
    blogSubtitleText: "Startap tahlili, mahsulot strategiyasi, bozor tadqiqoti va o'sish bo'yicha ekspert fikrlari.",
    readArticle: "Maqolani o'qish",
    newsletterTitle: "Startap tahlillarini elektron pochtangizga oling",
    newsletterSub: "Mahsulotni tekshirish bo'yicha haftalik byulletenimizni oladigan 10 000 dan ortiq asoschilarga qo'shiling.",
    subscribe: "Obuna bo'lish",
    // BlogPostPage
    backToBlog: "Blogga qaytish",
    nextArticle: "Keyingi maqola",
    readNext: "Keyingisini o'qish",
    // How It Works Page
    hiwDescribeTitle: "G'oyani tasvirlang",
    hiwDescribeDesc: "Maqsadli mijoz, muammo va mahsulot yo'nalishini oddiy tilda kiriting.",
    hiwAiTitle: "Sun'iy intellekt bozorni baholaydi",
    hiwAiDesc: "Model dolzarblik, raqobat, monetizatsiya, vaqt va ta'sischi-bozor mosligini baholaydi.",
    hiwExportTitle: "Keyingi qadamlarni yuklab oling",
    hiwExportDesc: "Xatarlar, eksperimentlar va tavsiya etilgan MVP qamrovi hisobotini yuklab oling.",
    hiwEyebrow: "QANDAY ISHLAYDI",
    hiwMainTitle: "Startap g'oyadan tekshiruv hisobotigacha",
    hiwSubtitle: "IdeaLab tadqiqot, baholash va tavsiyalarni ta'sischilar uchun oddiy boshqariladigan ish jarayoniga aylantiradi.",
    // Idea Analysis Mockup Page
    iaTitle: "G'oya tahlili",
    iaSubtitle: "Masofaviy jamoalar uchun SaaS vositasi",
    iaViabilityScore: "HAYOTIYLIK DARAJASI",
    iaMedium: "O'rtacha",
    iaCompetitors: "14 ta raqobatchi",
    iaTrendingUp: "↑ O'sib bormoqda",
    iaStrengths: "Kuchli tomonlar",
    iaWeaknesses: "Kuchsiz tomonlar",
    iaOpportunities: "Imkoniyatlar",
    iaThreats: "Xavflar",
    // Testimonials Page
    testEyebrow: "MUTAXASSISLAR TOMONIDAN SEVILGAN",
    testTitle: "Ishga tushirishdan oldin aniqroq qarorlar",
    testSubtitle: "Ta'sischilar noto'g'ri va qimmat startlardan qochish va haqiqiy natija beradigan g'oyalarga e'tibor qaratish uchun IdeaLab-dan foydalanadilar.",
    testQuote1: "IdeaLab bizga ikkita kuchsiz g'oyani to'xtatishga va mijozlar allaqachon birlashtirishga harakat qilayotgan g'oyaga e'tibor qaratishga yordam berdi.",
    testQuote2: "Raqobatchilar xaritasining o'zi bir haftalik tadqiqotni tejab qoldi. Bu bizga aniqroq strategiya va investorlar uchun yaxshiroq javoblar berdi.",
    testQuote3: "U asoschining hayajonini dalilga aylantiradi. Endi biz dizaynga vaqt sarflashdan oldin har bir yangi mahsulot g'oyasini IdeaLab orqali sinab ko'ramiz.",
    // Footer Section
    footerTagline: "Sun'iy intellektga asoslangan g'oyalarni tekshirish va chuqur kod tahlili. Tezroq quring, aqlliroq tekshiring va to'liq ishonch bilan ishga tushiring.",
    footerProduct: "Mahsulot",
    footerIntegrations: "Integratsiyalar",
    footerPricing: "Narxlar",
    footerResources: "Manbalar",
    footerDocumentation: "Hujjatlar",
    footerCommunity: "Hamjamiyat",
    footerHelpCenter: "Yordam markazi",
    footerLegal: "Huquqiy",
    footerPrivacyPolicy: "Maxfiylik siyosati",
    footerTermsOfService: "Foydalanish shartlari",
    footerCookiePolicy: "Cookie siyosati",
    footerAllRightsReserved: "Barcha huquqlar himoyalangan.",
    footerAllSystemsOperational: "Barcha tizimlar ishlamoqda",
    // CTA Section
    ctaTitle: "Tekshirishni bepul boshlang",
    ctaSubtitle: "Birinchi g'oyangizni IdeaLab orqali tahlil qiling va bir daqiqadan kamroq vaqt ichida bozor reytingi, SWOT tahlili, raqobatchilar ro'yxati va tavsiya etilgan keyingi tajribalarni oling.",
  },
  ru: {
    // Header
    howItWorks: "Как это работает",
    features: "Возможности",
    blog: "Блог",
    analyze: "Анализировать",
    result: "Результат",
    dashboard: "Панель управления",
    newAnalysis: "Новый анализ",
    history: "История",
    settings: "Настройки",
    logout: "Выйти",
    getStarted: "Начать",
    exportPdf: "Экспорт PDF",
    saveToHistory: "Сохранить в историю",

    // Home / Hero
    heroTitle: "Проверяйте стартап-идеи за считанные секунды",
    heroSub: "IdeaLab анализирует вашу концепцию с помощью передового искусственного интеллекта на основе рыночных данных, SWOT-структуры и потенциала роста.",
    heroBtn: "Начать анализ бесплатно",
    heroBadge: "Валидация стартапов с ИИ, до того как вы начнете строить",
    watchDemo: "Смотреть демо",

    // Analyze Page
    describeIdea: "Опишите вашу стартап-идею",
    describeSub: "Предоставьте IdeaLab основные детали, и мы подготовим ваш проект к быстрой валидации ИИ.",
    startupName: "Название стартапа",
    oneLineDesc: "Краткое описание (в одну строку)",
    problemSolving: "Решаемая проблема",
    problemDesc: "Опишите сложный рабочий процесс, недовольство клиентов или рыночный пробел...",
    targetCustomer: "Целевой клиент",
    industryCategory: "Категория отрасли",
    selectIndustry: "Выберите отрасль",
    estimatedBudget: "Оценочный бюджет",
    selectBudget: "Выберите бюджет",
    btnAnalyze: "Анализировать идею",
    analyzingIdeas: "Идея анализируется",
    analysisTime: "Анализ занимает около 60 секунд",
    aiPoweredIntake: "Сбор идей на базе ИИ",

    // History Page
    analysisHistory: "История анализов",
    historySubtitle: "Все ваши прошлые валидации стартап-идей в одном месте.",
    totalAnalyses: "Всего анализов",
    highPotential: "Высокий потенциал",
    avgViability: "Средняя жизнеспособность",
    noAnalysesYet: "Пока нет анализов",
    noAnalysesDesc: "Вы еще не провели валидацию ни одной стартап-идеи. Начните свой первый анализ, и он появится здесь.",
    startFirstAnalysis: "Начать первый анализ",
    viewReport: "Посмотреть отчет",
    analyzedDate: "Дата анализа",

    // Results Page
    backToDashboard: "Назад на главную",
    ideaAnalysisReport: "Отчет об анализе идеи",
    viabilityScore: "Показатель жизнеспособности",
    strongMarketFit: "Сильное соответствие рынку с четкими отличиями",
    marketSize: "Размер рынка",
    competition: "Конкуренция",
    trendScore: "Показатель тренда",
    swotAnalysis: "SWOT-анализ",
    viewDetails: "Подробнее",
    aiRecommendations: "Рекомендации ИИ",
    priority: "Приоритет",

    // Settings Page
    settingsTitle: "Настройки и параметры",
    settingsSubtitle: "Настройте тему интерфейса IdeaLab, язык и управляйте функциями аккаунта.",
    colorTheme: "Цветовая тема",
    changeColorTheme: "Выберите основной акцентный цвет для вашего интерфейса",
    language: "Язык (Language)",
    changeLanguage: "Выберите предпочтительный язык приложения",
    accountDetails: "Данные аккаунта",
    emailAddress: "Электронная почта",
    displayName: "Имя пользователя",
    logoutTitle: "Выйти из системы",
    logoutDesc: "Выйти из текущей сессии на этом устройстве",
    saveSettings: "Сохранить настройки",
    settingsSavedMsg: "Настройки успешно сохранены!",
    themeMode: "Режим темы",
    changeThemeMode: "Переключение между светлым и темным режимом",
    // Features Page
    featuresTitle: "Создано для фаундеров, которые действуют быстро и мыслят ясно",
    featuresSubtitle: "IdeaLab дает вам полную систему валидации в одном месте. От сырой идеи до готового для инвесторов отчета — на базе ИИ, создано для ясности, создано для скорости.",
    fullAnalysisTime: "Полный анализ",
    aiModulesCount: "ИИ-модули",
    ideasValidatedText: "Идей проверено",
    userRating: "Рейтинг пользователей",
    stopGuessing: "Перестаньте гадать. Начните проверять.",
    stopGuessingDesc: "Каждый день, потраченный на разработку без валидации, — это риск потерять время. Проведите первый анализ менее чем за 60 секунд и узнайте, на каком этапе находится ваша идея.",
    btnAnalyzeMyIdea: "Анализировать мою идею",
    // Blog Page
    blogTitleText: "Узнайте, как строить умнее",
    blogSubtitleText: "Экспертные статьи о валидации стартапов, продуктовой стратегии, исследовании рынка и росте.",
    readArticle: "Читать статью",
    newsletterTitle: "Получайте аналитику стартапов прямо на почту",
    newsletterSub: "Присоединяйтесь к 10 000+ фаундерам, которые получают нашу еженедельную рассылку о валидации.",
    subscribe: "Подписаться",
    // BlogPostPage
    backToBlog: "Назад в блог",
    nextArticle: "Следующая статья",
    readNext: "Читать далее",
    // How It Works Page
    hiwDescribeTitle: "Опишите идею",
    hiwDescribeDesc: "Введите целевого клиента, проблему и первоначальное видение продукта простым языком.",
    hiwAiTitle: "ИИ оценивает рынок",
    hiwAiDesc: "Модель оценивает актуальность, конкуренцию, монетизацию, выбор времени и соответствие фаундера рынку.",
    hiwExportTitle: "Экспортируйте шаги",
    hiwExportDesc: "Скачайте краткий валидационный отчет с рисками, экспериментами и рекомендуемым объемом MVP.",
    hiwEyebrow: "КАК ЭТО РАБОТАЕТ",
    hiwMainTitle: "От идеи стартапа до отчета о валидации",
    hiwSubtitle: "IdeaLab объединяет исследования, скоринг и рекомендации в простой пошаговый процесс для основателей.",
    // Idea Analysis Mockup Page
    iaTitle: "Анализ идеи",
    iaSubtitle: "SaaS-инструмент для удаленных команд",
    iaViabilityScore: "РЕЙТИНГ ЖИЗНЕСПОСОБНОСТИ",
    iaMedium: "Средняя",
    iaCompetitors: "14 конкурентов",
    iaTrendingUp: "↑ Растет",
    iaStrengths: "Сильные стороны",
    iaWeaknesses: "Слабые стороны",
    iaOpportunities: "Возможности",
    iaThreats: "Угрозы",
    // Testimonials Page
    testEyebrow: "ЛЮБИМО ОПЕРАТОРАМИ",
    testTitle: "Более точные решения перед запуском",
    testSubtitle: "Основатели используют IdeaLab, чтобы избежать дорогостоящих фальстартов и сосредоточиться на идеях с реальным потенциалом.",
    testQuote1: "IdeaLab помог нам отбросить две слабые концепции и сосредоточиться на той, которую клиенты уже пытались собрать самостоятельно.",
    testQuote2: "Одна только карта конкурентов сэкономила неделю исследований. Она дала нам более четкое направление и лучшие ответы для инвесторов.",
    testQuote3: "Это превращает энтузиазм основателя в доказательства. Теперь мы проверяем каждую новую идею продукта через IdeaLab, прежде чем тратить время на дизайн.",
    // Footer Section
    footerTagline: "Валидация идей и глубокий анализ кода на базе ИИ. Стройте быстрее, проверяйте умнее и запускайте с абсолютной уверенностью.",
    footerProduct: "Продукт",
    footerIntegrations: "Интеграции",
    footerPricing: "Цены",
    footerResources: "Ресурсы",
    footerDocumentation: "Документация",
    footerCommunity: "Сообщество",
    footerHelpCenter: "Справочный центр",
    footerLegal: "Юридическая информация",
    footerPrivacyPolicy: "Политика конфиденциальности",
    footerTermsOfService: "Условия использования",
    footerCookiePolicy: "Политика cookie",
    footerAllRightsReserved: "Все права защищены.",
    footerAllSystemsOperational: "Все системы работают",
    // CTA Section
    ctaTitle: "Начните валидацию бесплатно",
    ctaSubtitle: "Проверьте свою первую идею через IdeaLab и получите оценку рынка, SWOT-анализ, список конкурентов и рекомендации по экспериментам менее чем за минуту.",
}}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem("appLocale") || "en";
  });

  useEffect(() => {
    localStorage.setItem("appLocale", locale);
  }, [locale]);

  // Sync locale with Firestore when authentication changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().locale) {
            setLocale(userDoc.data().locale);
          }
        } catch (error) {
          console.error("Error loading locale from Firestore:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const changeLocale = async (newLocale) => {
    if (newLocale !== "en" && newLocale !== "uz" && newLocale !== "ru") return;
    setLocale(newLocale);

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { locale: newLocale });
      } catch (error) {
        console.error("Error updating locale in Firestore:", error);
      }
    }
  };

  const t = (key) => {
    const dict = translations[locale] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default translations;
