import React from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  GraduationCap,
  Layers,
  PlayCircle,
} from "lucide-react";
import { ALL_LESSONS, CHAPTERS, COURSES, getLessonById } from "../data/curriculumIndex";
import { AppPage, StudentProgress } from "../types/curriculum";

interface HomePageProps {
  progress: StudentProgress;
  onNavigate: (page: AppPage, lessonId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ progress, onNavigate }) => {
  const lastLesson = getLessonById(progress.lastVisitedLessonId) ?? ALL_LESSONS[0];
  const completedCount = progress.completedLessons.length;
  const totalCount = ALL_LESSONS.length;
  const overallPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs sm:text-sm font-medium text-cyan-300 tracking-wide">
              قسم تكنولوجيا المعلومات · منهج بايثون الأكاديمي المعتمد (محاضرات 2 – 6)
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              منصة <span className="gradient-text-brand">بايثون أكاديمي</span> لطلاب تكنولوجيا المعلومات
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              منهج جامعي متدرج مبني بالكامل على محاضرات الدكتورة غادة فتحي: من تشغيل أول سطر على
              Google Colab وفهم خلايا الذاكرة والمتغيرات، إلى خرائط التدفق والحلقات وهياكل القوائم
              والسلاسل النصية والدوال البرمجية.
            </p>

            {/* Unboxed metadata summary (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300 border-t border-b border-slate-800/80 py-3 tabular-nums">
              <span>3 كورسات متخصصة</span>
              <span className="text-slate-600">·</span>
              <span>5 فصول دراسية</span>
              <span className="text-slate-600">·</span>
              <span>15 درساً تفاعلياً</span>
              <span className="text-slate-600">·</span>
              <span>75 مثالاً عملياً و75 تدريباً</span>
              <span className="text-slate-600">·</span>
              <span>210 سؤالاً تقييمياً</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate("lesson", lastLesson.id)}
                className="gradient-btn-brand inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white cursor-pointer"
              >
                <PlayCircle className="w-5 h-5" />
                <span>
                  {completedCount > 0
                    ? `استكمال التعلم: ${lastLesson.titleAr}`
                    : `ابدأ الآن: ${lastLesson.titleAr}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("courses")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-slate-900/90 border border-slate-700/80 text-slate-100 hover:border-cyan-400/50 transition-colors cursor-pointer"
              >
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>تصفح الكورسات والفصول</span>
              </button>
            </div>
          </div>

          {/* Bespoke CS Technical Vector Architecture Visual */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#070c1b] border border-slate-800/90 p-5 space-y-4">
              <svg viewBox="0 0 420 260" className="w-full h-auto" aria-label="مخطط معماري لمسار بايثون">
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                {/* Background subtle grid */}
                <rect x="0" y="0" width="420" height="260" rx="14" fill="#060a16" />
                {/* Connections */}
                <path d="M110 70 L210 70 L310 70" stroke="url(#heroGrad)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                <path d="M310 70 L310 135 L110 135 L110 195 L210 195 L310 195" stroke="#334155" strokeWidth="2" fill="none" />

                {/* Node 1: Lecture 2 */}
                <rect x="30" y="38" width="110" height="58" rx="10" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" />
                <text x="85" y="62" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace">L2: Variables</text>
                <text x="85" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">input() · type()</text>

                {/* Node 2: Lecture 3 */}
                <rect x="155" y="38" width="110" height="58" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
                <text x="210" y="62" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="monospace">L3: Decisions</text>
                <text x="210" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">if / elif / try</text>

                {/* Node 3: Lecture 4 */}
                <rect x="280" y="38" width="110" height="58" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
                <text x="335" y="62" textAnchor="middle" fill="#c084fc" fontSize="11" fontFamily="monospace">L4: Loops</text>
                <text x="335" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">while · for</text>

                {/* Node 4: Lecture 5 */}
                <rect x="30" y="164" width="145" height="58" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="102" y="188" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">L5: Data Structures</text>
                <text x="102" y="206" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">Lists &amp; Strings</text>

                {/* Node 5: Lecture 6 */}
                <rect x="215" y="164" width="175" height="58" rx="10" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
                <text x="302" y="188" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace">L6: Functions</text>
                <text x="302" y="206" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">def · args · return</text>
              </svg>

              <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-800 pt-3 tabular-nums">
                <span>تقدمك الحالي في المنهج</span>
                <span className="font-mono font-bold text-cyan-300">
                  {completedCount} / {totalCount} درساً ({overallPct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all duration-300"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Overview Grid */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">الكورسات التعليمية المعتمدة</h2>
            <p className="text-sm text-slate-400 mt-1">
              ثلاثة مسارات مترابطة تغطي كامل المنهج المرفوع بدقة وتفصيل
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("courses")}
            className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 cursor-pointer"
          >
            <span>عرض تفاصيل الكورسات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const lessons = ALL_LESSONS.filter((l) => l.courseId === course.id);
            const done = lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const pct = Math.round((done / lessons.length) * 100);

            return (
              <div
                key={course.id}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-cyan-400/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-300 font-semibold">كورس {course.number}</span>
                    <span>{course.level}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug">{course.titleAr}</h3>
                  <p className="text-xs font-mono text-slate-400" dir="ltr">
                    {course.titleEn}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">{course.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-300 tabular-nums">
                    <span>{lessons.length} دروس مستقلة</span>
                    <span className="font-mono text-cyan-300">{pct}% مكتمل</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-cyan-400 to-violet-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("chapters")}
                    className="w-full py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/70 text-sm font-semibold text-slate-100 hover:border-cyan-400/50 transition-colors cursor-pointer"
                  >
                    استعراض الفصول والدروس
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Learning Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: BookOpen,
            title: "شروحات معمّقة بالعربية",
            desc: "كل درس يبدأ بمقدمة مبسطة ويتدرج خطوة بخطوة مع قاموس للمصطلحات الإنجليزية وجداول مقارنة.",
          },
          {
            icon: Code2,
            title: "أكواد بأسلوب VS Code",
            desc: "75 مثالاً عملياً مع تلوين الكلمات البرمجية وتتبع تفاعلي لكل سطر وشرح الأخطاء الشائعة.",
          },
          {
            icon: Cpu,
            title: "15 مختبراً بصرياً تفاعلياً",
            desc: "محاكاة تفاعلية لخلايا الذاكرة وخرائط التدفق والحلقات وفهارس القوائم واستدعاء الدوال.",
          },
          {
            icon: GraduationCap,
            title: "اختبارات وتدريبات فورية",
            desc: "10 أسئلة و5 تدريبات عملية بعد كل درس بالإضافة إلى 5 اختبارات نهائية للفصول.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="glass-panel-subtle rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Quick Chapter Roadmap */}
      <section className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">خريطة الفصول الخمسة (محاضرات 2 – 6)</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("exams")}
            className="text-sm text-cyan-300 hover:text-cyan-200 cursor-pointer"
          >
            الانتقال إلى الاختبارات النهائية
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {CHAPTERS.map((ch) => {
            const doneCount = ch.lessonIds.filter((id) =>
              progress.completedLessons.includes(id)
            ).length;
            const isAllDone = doneCount === ch.lessonIds.length;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => onNavigate("lesson", ch.lessonIds[0])}
                className="text-right rounded-xl bg-slate-950/75 border border-slate-800 hover:border-cyan-400/50 p-4 space-y-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-semibold">محاضرة {ch.lectureNumber}</span>
                  {isAllDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="font-mono text-slate-400 tabular-nums">
                      {doneCount}/{ch.lessonIds.length}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white leading-snug">{ch.titleAr}</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
