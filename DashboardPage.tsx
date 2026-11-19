import React, { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  RotateCcw,
  Trophy,
} from "lucide-react";
import {
  ALL_LESSONS,
  CHAPTER_EXAMS,
  COURSES,
  getLessonById,
} from "../data/curriculumIndex";
import { AchievementDef, AppPage, StudentProgress } from "../types/curriculum";

interface DashboardPageProps {
  progress: StudentProgress;
  unlockedAchievementIds: string[];
  allAchievements: AchievementDef[];
  onNavigate: (page: AppPage, lessonId?: string) => void;
  onResetProgress: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  progress,
  unlockedAchievementIds,
  allAchievements,
  onNavigate,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const totalLessons = ALL_LESSONS.length;
  const completedLessons = ALL_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  );
  const remainingLessons = ALL_LESSONS.filter(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const overallPct = Math.round((completedLessons.length / totalLessons) * 100);

  const lastLesson = getLessonById(progress.lastVisitedLessonId) ?? ALL_LESSONS[0];
  const quizEntries = Object.entries(progress.quizScores);
  const examEntries = Object.entries(progress.examScores);
  const totalExercises = ALL_LESSONS.reduce((acc, l) => acc + l.exercises.length, 0);

  return (
    <div className="space-y-8">
      {/* Header + Resume CTA */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">لوحة تحكم الطالب</h1>
          <p className="text-sm sm:text-base text-slate-300">
            تُحفظ جميع إنجازاتك ودرجاتك ومسودات الكود تلقائياً في المتصفح حتى بعد إغلاق الموقع.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("lesson", lastLesson.id)}
          className="gradient-btn-brand inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white cursor-pointer"
        >
          <PlayCircle className="w-5 h-5" />
          <span>استكمال التعلم: {lastLesson.titleAr}</span>
        </button>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>نسبة إتمام المنهج</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-300 tabular-nums">{overallPct}%</div>
          <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-cyan-400 to-violet-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>الدروس المكتملة / المتبقية</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {completedLessons.length}{" "}
            <span className="text-base font-normal text-slate-400">/ {totalLessons}</span>
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            المتبقي: {remainingLessons.length} دروس
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>التدريبات العملية المنجزة</span>
            <Award className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {progress.completedExercises.length}{" "}
            <span className="text-base font-normal text-slate-400">/ {totalExercises}</span>
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            الاختبارات المجتازة: {examEntries.filter(([, e]) => e.passed).length} /{" "}
            {CHAPTER_EXAMS.length}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>وقت التعلم المسجّل</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums">
            {progress.studyMinutesAccumulated}{" "}
            <span className="text-base font-normal text-slate-400">دقيقة</span>
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            الأوسمة المفتوحة: {unlockedAchievementIds.length} / {allAchievements.length}
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <section className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">نسبة التقدم في الكورسات</h2>
        <div className="space-y-4">
          {COURSES.map((course) => {
            const lessons = ALL_LESSONS.filter((l) => l.courseId === course.id);
            const done = lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const pct = Math.round((done / lessons.length) * 100);
            return (
              <div key={course.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-100">
                    كورس {course.number}: {course.titleAr}
                  </span>
                  <span className="font-mono text-cyan-300 tabular-nums">
                    {done}/{lessons.length} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Completed vs Remaining Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>الدروس المكتملة ({completedLessons.length})</span>
          </h2>
          {completedLessons.length === 0 ? (
            <p className="text-sm text-slate-400">لم تُكمل أي درس بعد. ابدأ بأول درس الآن.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pl-1">
              {completedLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onNavigate("lesson", lesson.id)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/75 border border-slate-800 hover:border-emerald-400/40 text-right cursor-pointer"
                >
                  <span className="text-sm text-slate-100">
                    {lesson.number}: {lesson.titleAr}
                  </span>
                  <span className="text-xs text-emerald-300">مكتمل</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>الدروس المتبقية ({remainingLessons.length})</span>
          </h2>
          {remainingLessons.length === 0 ? (
            <p className="text-sm text-emerald-300">
              أتممت جميع دروس المنهج الخمسة عشر بنجاح!
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pl-1">
              {remainingLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onNavigate("lesson", lesson.id)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/75 border border-slate-800 hover:border-cyan-400/40 text-right cursor-pointer"
                >
                  <span className="text-sm text-slate-100">
                    {lesson.number}: {lesson.titleAr}
                  </span>
                  <span className="text-xs text-cyan-300 tabular-nums">
                    {lesson.estimatedMinutes} دقيقة
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Scores Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">درجات اختبارات الدروس</h2>
          {quizEntries.length === 0 ? (
            <p className="text-sm text-slate-400">لم تُحل أي اختبارات دروس بعد.</p>
          ) : (
            <div className="space-y-2">
              {quizEntries.map(([lessonId, q]) => {
                const l = getLessonById(lessonId);
                return (
                  <div
                    key={lessonId}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-800 text-sm"
                  >
                    <span className="text-slate-200">{l?.titleAr ?? lessonId}</span>
                    <span className="font-mono font-bold text-cyan-300 tabular-nums">
                      {q.score} / {q.total}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">درجات الاختبارات النهائية للفصول</h2>
          {examEntries.length === 0 ? (
            <p className="text-sm text-slate-400">لم تؤدِّ أي اختبار نهائي لفصل بعد.</p>
          ) : (
            <div className="space-y-2">
              {examEntries.map(([examId, ex]) => {
                const examObj = CHAPTER_EXAMS.find((e) => e.id === examId);
                return (
                  <div
                    key={examId}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-800 text-sm"
                  >
                    <span className="text-slate-200">{examObj?.titleAr ?? examId}</span>
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        ex.passed ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      {ex.score} / {ex.total}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Achievements */}
      <section className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">الإنجازات والأوسمة الأكاديمية</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAchievements.map((ach) => {
            const unlocked = unlockedAchievementIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-4 border space-y-2 ${
                  unlocked
                    ? "bg-violet-950/35 border-violet-400/50 text-white"
                    : "bg-slate-950/70 border-slate-800 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300">{ach.metricLabel}</span>
                  {unlocked ? (
                    <Award className="w-5 h-5 text-amber-300" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <h3 className="text-base font-bold">{ach.titleAr}</h3>
                <p className="text-xs leading-relaxed">{ach.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safe Progress Reset */}
      <section className="glass-panel-subtle rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          هل تريد تصفير سجل التقدم والبدء من جديد؟
        </div>
        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white cursor-pointer"
            >
              تأكيد تصفير التقدم
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التقدم</span>
          </button>
        )}
      </section>
    </div>
  );
};
