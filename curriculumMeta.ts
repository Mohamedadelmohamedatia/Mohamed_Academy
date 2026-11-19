import { AchievementDef, Chapter, Course } from "../types/curriculum";

export const COURSES: Course[] = [
  {
    id: "course-1",
    number: 1,
    titleAr: "أساسيات بايثون والبيانات والتعابير الرقمية",
    titleEn: "Python Fundamentals, Data Types & Expressions",
    description:
      "تأسيس برمجي متكامل يبدأ من تشغيل بايثون عبر Google Colab وبناء الخوارزميات الأولى، مروراً بمفهوم حجز المتغيرات في الذاكرة وأنواع البيانات والتحويل الصريح والضمني، وصولاً إلى قواعد المعرّفات وأولوية العمليات الحسابية وإدخال المستخدم.",
    level: "المستوى التأسيسي · المحاضرة 2",
    chapterIds: ["chapter-2"],
    accentFrom: "#06b6d4",
    accentTo: "#6366f1",
  },
  {
    id: "course-2",
    number: 2,
    titleAr: "التحكم في مسار التنفيذ والحلقات التكرارية",
    titleEn: "Control Flow, Conditions & Loops",
    description:
      "إتقان منطق اتخاذ القرار في البرمجة باستخدام عوامل المقارنة والمنطق وخرائط التدفق وجمل if / elif / else ومعالجة أخطاء الإدخال بـ try / except، ثم بناء التكرار الذكي عبر حلقات while و for ودالة range() والتحكم عبر break و continue.",
    level: "المستوى الأساسي · المحاضرتان 3 و 4",
    chapterIds: ["chapter-3", "chapter-4"],
    accentFrom: "#6366f1",
    accentTo: "#a855f7",
  },
  {
    id: "course-3",
    number: 3,
    titleAr: "هياكل البيانات النصية والقوائم والدوال البرمجية",
    titleEn: "Lists, Strings & Modular Functions",
    description:
      "الانتقال إلى تنظيم البيانات ومعالجتها بكفاءة باستخدام القوائم (Lists) والسلاسل النصية (Strings) والفهرسة والتقطيع (Slicing) والدوال المدمجة، ثم تصميم دوال برمجية قابلة لإعادة الاستخدام (Functions) بأنواع وسائطها المختلفة وجملة return.",
    level: "المستوى التطبيقي · المحاضرتان 5 و 6",
    chapterIds: ["chapter-5", "chapter-6"],
    accentFrom: "#22d3ee",
    accentTo: "#8b5cf6",
  },
];

export const CHAPTERS: Chapter[] = [
  {
    id: "chapter-2",
    courseId: "course-1",
    number: 1,
    lectureNumber: 2,
    titleAr: "مدخل إلى بايثون، المتغيرات، والتعابير الرقمية",
    titleEn: "Python Basics, Variables, Types & Numeric Expressions",
    lecturer: "د. غادة فتحي · قسم تكنولوجيا المعلومات",
    summary:
      "يغطي تشغيل بايثون على Google Colab، كتابة Hello World، بناء خوارزمية جمع رقمين، تخزين المتغيرات في الذاكرة، أنواع البيانات الأربعة وتحويلها، قواعد المعرّفات والكلمات المحجوزة، أولوية العمليات الحسابية، الإسناد المتعدد، ودالة input().",
    lessonIds: ["L2-1", "L2-2", "L2-3"],
    examId: "exam-ch2",
  },
  {
    id: "chapter-3",
    courseId: "course-2",
    number: 2,
    lectureNumber: 3,
    titleAr: "التنفيذ الشرطي ومعالجة الأخطاء وخرائط التدفق",
    titleEn: "Conditional Execution, Error Handling & Flowcharts",
    lecturer: "د. غادة فتحي · قسم تكنولوجيا المعلومات",
    summary:
      "يتناول حماية البرامج من مدخلات المستخدم غير الصالحة باستخدام try / except، عوامل الإسناد المركبة، عوامل المقارنة والمنطق وجداول الصواب، رسم خرائط التدفق، جمل if و if-else و elif والقرارات المتداخلة.",
    lessonIds: ["L3-1", "L3-2", "L3-3"],
    examId: "exam-ch3",
  },
  {
    id: "chapter-4",
    courseId: "course-2",
    number: 3,
    lectureNumber: 4,
    titleAr: "الحلقات التكرارية والتحكم في التكرار",
    titleEn: "Loops (while, for, range, break & continue)",
    lecturer: "د. غادة فتحي · قسم تكنولوجيا المعلومات",
    summary:
      "يشرح مفهوم التكرار البرمجي وحلقة while والحلقة اللانهائية والحلقات الصفرية و while-else، وحلقة for ودالة range(start, stop, step) والتكرار على النصوص والقوائم، والحلقات المتداخلة، وتعليمات break و continue.",
    lessonIds: ["L4-1", "L4-2", "L4-3"],
    examId: "exam-ch4",
  },
  {
    id: "chapter-5",
    courseId: "course-3",
    number: 4,
    lectureNumber: 5,
    titleAr: "القوائم والسلاسل النصية والفهرسة والتقطيع",
    titleEn: "Lists & Strings: Indexing, Slicing & Methods",
    lecturer: "د. غادة فتحي · قسم تكنولوجيا المعلومات",
    summary:
      "يستعرض القوائم المتجانسة والمختلطة والمتداخلة، الفهرسة من الصفر وطول القائمة len()، تعديل العناصر والفرق بين Simple Loop و Index Loop، التقطيع Slicing، طرق القوائم التسع، ومعالجة السلاسل النصية وتقطيعها وتنظيفها.",
    lessonIds: ["L5-1", "L5-2", "L5-3"],
    examId: "exam-ch5",
  },
  {
    id: "chapter-6",
    courseId: "course-3",
    number: 5,
    lectureNumber: 6,
    titleAr: "الدوال البرمجية وتقسيم البرامج",
    titleEn: "Functions: Definition, Arguments & Return",
    lecturer: "د. غادة فتحي · قسم تكنولوجيا المعلومات",
    summary:
      "يركز على أهمية الدوال ومبدأ Store and Reuse، الفرق بين الدوال المدمجة والمخصصة، هيكل def، أنواع الوسائط (الافتراضية والموضعية والمسماة)، والفرق الجوهري بين print() و return وتطبيقات عملية متكاملة.",
    lessonIds: ["L6-1", "L6-2", "L6-3"],
    examId: "exam-ch6",
  },
];

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-lesson",
    titleAr: "الخطوة الأولى في بايثون",
    description: "إتمام أول درس برمجي بنجاح وفهم أساسيات التنفيذ.",
    metricLabel: "1 درس مكتمل",
  },
  {
    id: "five-lessons",
    titleAr: "مبرمج منضبط",
    description: "إتمام 5 دروس كاملة عبر المنهج المعتمد.",
    metricLabel: "5 دروس مكتملة",
  },
  {
    id: "all-lessons",
    titleAr: "إتقان منهج بايثون الجامعي",
    description: "إتمام جميع الدروس الخمسة عشر من المحاضرة 2 إلى المحاضرة 6.",
    metricLabel: "15 درساً مكتملًا",
  },
  {
    id: "quiz-master",
    titleAr: "دقة الاختبارات",
    description: "تحقيق درجة 80% فأعلى في 3 اختبارات دروس على الأقل.",
    metricLabel: "3 اختبارات بامتياز",
  },
  {
    id: "practice-builder",
    titleAr: "مهندس التطبيق العملي",
    description: "إنجاز 10 تدريبات برمجية عملية من المختبرات.",
    metricLabel: "10 تدريبات عملية",
  },
  {
    id: "chapter-champion",
    titleAr: "اجتياز الاختبارات النهائية",
    description: "اجتياز اختبارين نهائيين للفصول بنجاح.",
    metricLabel: "2 اختبار فصل",
  },
];
