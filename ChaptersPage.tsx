import React from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  HelpCircle,
} from "lucide-react";
import { ALL_LESSONS, CHAPTERS, getExamById } from "../data/curriculumIndex";
import { AppPage, StudentProgress } from "../types/curriculum";

interface ChaptersPageProps {
  progress: StudentProgress;
  onNavigate: (page: AppPage, lessonId?: string) => void;
}

export const ChaptersPage: React.FC<ChaptersPageProps> = ({ progress, onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">الفصول الدراسية والدروس</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
          خمسة فصول متكاملة تطابق محاضرات قسم تكنولوجيا المعلومات (المحاضرة 2 إلى المحاضرة 6)،
          وكل فصل يضم 3 دروس مستقلة واختباراً نهائياً شاملاً.
        </p>
      </div>

      <div className="space-y-6">
        {CHAPTERS.map((ch) => {
          const lessons = ALL_LESSONS.filter((l) => l.chapterId === ch.id);
          const exam = getExamById(ch.examId);
          const examRecord = exam ? progress.examScores[exam.id] : undefined;
          const completedCount = lessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;

          return (
            <section key={ch.id} className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold">الفصل {ch.number}</span>
                    <span>·</span>
                    <span>المحاضرة {ch.lectureNumber}</span>
                    <span>·</span>
                    <span>{ch.lecturer}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{ch.titleAr}</h2>
                  <p className="text-xs font-mono text-slate-400" dir="ltr">
                    {ch.titleEn}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed pt-1">{ch.summary}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 tabular-nums">
                  <span className="text-sm font-bold text-cyan-300">
                    {completedCount} / {lessons.length} دروس
                  </span>
                  {examRecord && (
                    <span
                      className={`text-xs font-semibold ${
                        examRecord.passed ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      اختبار الفصل: {examRecord.score}/{examRecord.total}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lessons.map((lesson) => {
                  const isDone = progress.completedLessons.includes(lesson.id);
                  const quizResult = progress.quizScores[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between gap-4 hover:border-cyan-400/40 transition-colors"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-cyan-300 font-semibold">
                            درس {lesson.number}
                          </span>
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>مكتمل</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 inline-flex items-center gap-1 tabular-nums">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{lesson.estimatedMinutes} دقيقة</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white leading-snug">
                          {lesson.titleAr}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {lesson.overview}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-800/80">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5 text-violet-400" />
                            {lesson.examples.length} أمثلة
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                            {lesson.mcqs.length} سؤال
                          </span>
                          {quizResult && (
                            <span className="text-emerald-300 font-semibold">
                              درجتك: {quizResult.score}/{quizResult.total}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onNavigate("lesson", lesson.id)}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs sm:text-sm font-semibold text-white inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span>فتح صفحة الدرس</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {exam && (
                <div className="rounded-2xl bg-violet-950/30 border border-violet-500/30 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-violet-300 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white">{exam.titleAr}</div>
                      <div className="text-xs text-slate-300 tabular-nums">
                        {exam.questions.length} سؤالاً شاملاً · المدة المقترحة {exam.durationMinutes} دقيقة
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("exams")}
                    className="gradient-btn-brand px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white cursor-pointer"
                  >
                    بدء اختبار الفصل
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
